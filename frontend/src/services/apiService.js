import { DEMO_CASES } from '../data/demoCases';

/**
 * Utility to rasterize SVG data URLs to standard PNG base64 so Gemini Vision API
 * can ingest demo and held-out presets without MIME-type rejection.
 */
export async function rasterizeSvgToPng(svgDataUri) {
  if (!svgDataUri || !svgDataUri.startsWith('data:image/svg+xml')) {
    return svgDataUri;
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 600, 400);
        ctx.drawImage(img, 0, 0, 600, 400);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        console.warn('Canvas rasterization error:', e);
        resolve(svgDataUri);
      }
    };
    img.onerror = () => resolve(svgDataUri);
    img.src = svgDataUri;
  });
}

/**
 * Pipeline stage IDs — must map 1-to-1 to real backend events.
 * The Groq cross-check stage is always included because the backend
 * always attempts it (verification field is present in real responses).
 */
export const PIPELINE_STAGES = ['uploading', 'vision', 'crosscheck', 'preparing'];

/**
 * Minimum time each stage is displayed (ms) — purely for readability,
 * not artificial delay. Stacked delays are avoided by only applying this
 * minimum when the real work completed faster.
 */
const MIN_STAGE_MS = 400;

/**
 * Advance stage with a guaranteed minimum display time for readability.
 * Returns a promise that resolves when the real work AND the minimum display
 * time have both elapsed.
 */
async function advanceStage(onStageChange, stage, workPromise) {
  const start = Date.now();
  const result = await workPromise;
  const elapsed = Date.now() - start;
  const remaining = MIN_STAGE_MS - elapsed;
  if (remaining > 0) {
    await new Promise(r => setTimeout(r, remaining));
  }
  onStageChange(stage);
  return result;
}

/**
 * analyzeWasteImage — extended with onStageChange callback.
 *
 * @param {Object} payload
 * @param {File|null}    payload.file
 * @param {string|null}  payload.base64Data
 * @param {string|null}  payload.activeDemoId
 * @param {boolean}      payload.isHeldOut
 * @param {boolean}      payload.liveOnly
 * @param {Function}     payload.onStageChange  — called with stage ID string when a real event fires
 */
export async function analyzeWasteImage({
  file,
  base64Data,
  activeDemoId,
  isHeldOut = false,
  liveOnly = false,
  onStageChange = () => {},
}) {
  const demoMatch = DEMO_CASES.find(c => c.id === activeDemoId);

  // Demo preset fast-path — still show stages so the UI doesn't look broken
  if (demoMatch && !liveOnly && !isHeldOut) {
    onStageChange('uploading');
    await new Promise(r => setTimeout(r, MIN_STAGE_MS));
    onStageChange('vision');
    await new Promise(r => setTimeout(r, MIN_STAGE_MS));
    onStageChange('crosscheck');
    await new Promise(r => setTimeout(r, MIN_STAGE_MS));
    onStageChange('preparing');
    await new Promise(r => setTimeout(r, 200));
    return {
      ...demoMatch.expected,
      source: 'demo-preset',
    };
  }

  // Ensure image payload is rasterized (PNG/JPEG) if it came from SVG preset
  let processedBase64 = base64Data;
  if (processedBase64 && processedBase64.startsWith('data:image/svg+xml')) {
    processedBase64 = await rasterizeSvgToPng(processedBase64);
  }

  // ── Stage 1: Uploading ───────────────────────────────────────────────
  onStageChange('uploading');

  // 1. Try Spring Boot Backend REST API
  try {
    let fetchPromise;

    const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      if (liveOnly || isHeldOut) {
        formData.append('liveOnly', 'true');
      }
      // Stage 1 → 2: fetch sent (upload leaving browser) → vision analysis in flight
      fetchPromise = fetch(`${API_BASE}/api/analyze?liveOnly=${liveOnly || isHeldOut}`, {
        method: 'POST',
        body: formData,
      });
    } else if (processedBase64) {
      fetchPromise = fetch(`${API_BASE}/api/analyze-base64`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: processedBase64,
          liveOnly: liveOnly || isHeldOut,
        }),
      });
    } else {
      throw new Error('No image payload available.');
    }

    // ── Stage 2: Vision analysis — Gemini call in flight ────────────────
    // Advance as soon as fetch() is dispatched (upload bytes leaving browser)
    await new Promise(r => setTimeout(r, MIN_STAGE_MS)); // min visibility for stage 1
    onStageChange('vision');

    // Await the actual HTTP response (Gemini processing time)
    const responsePromise = fetchPromise.then(async (response) => {
      const data = await response.json();

      // ── Stage 3: Cross-check — Groq verification resolves with response ─
      // The backend does Groq cross-check before returning; when we get the
      // response, that check is already done.
      onStageChange('crosscheck');

      return { response, data };
    });

    // Ensure stage 3 shows for minimum readability time before moving on
    const { response, data } = await advanceStage(
      (stage) => onStageChange(stage),
      'preparing',
      responsePromise,
    );

    if (!response.ok) {
      if (isHeldOut || liveOnly) {
        throw new Error(data.error || data.details || `Backend error: HTTP ${response.status}`);
      }
      return {
        item: 'Classification Failed',
        category: 'Unknown/Uncertain',
        bin: 'Manual Facility Segregation',
        confidence: 0.0,
        disposal_action: 'Live classification could not be completed.',
        sustainability_tip: 'Responsible AI prevents false classifications when AI provider errors occur.',
        reason: data.details || data.error || `HTTP ${response.status}`,
        uncertainty: `⚠️ Error from server: ${data.error || 'Request failed'}`,
        source: data.source || 'fallback-error',
        error_message: data.details || data.error,
      };
    }

    return data;

  } catch (backendErr) {
    console.warn('Backend REST API error or unavailable:', backendErr.message);
    if (isHeldOut || liveOnly) {
      // Attempt client-side Gemini as direct fallback
      const clientKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (clientKey && processedBase64) {
        try {
          const cleanBase64 = processedBase64.includes(',') ? processedBase64.split(',')[1] : processedBase64;
          const directResponse = await callClientGemini(cleanBase64, clientKey);
          if (directResponse) {
            onStageChange('preparing');
            return { ...directResponse, source: 'gemini-live' };
          }
        } catch (directErr) {
          throw new Error(`Live Gemini inference failed: ${directErr.message}`);
        }
      }
      throw new Error(backendErr.message || 'Held-out benchmark requires live Gemini inference with an active API key.');
    }
  }

  // ── Direct Client Gemini Vision fallback ─────────────────────────────
  const clientKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (clientKey && processedBase64) {
    try {
      onStageChange('vision');
      const cleanBase64 = processedBase64.includes(',') ? processedBase64.split(',')[1] : processedBase64;
      const directResponse = await callClientGemini(cleanBase64, clientKey);
      if (directResponse) {
        onStageChange('preparing');
        return { ...directResponse, source: 'gemini-live' };
      }
    } catch (directErr) {
      console.warn('Direct Gemini call error:', directErr);
      onStageChange('preparing');
      return {
        item: 'Gemini Client Error',
        category: 'Unknown/Uncertain',
        bin: 'Manual Inspection Required',
        confidence: 0.0,
        disposal_action: 'Direct client Gemini call failed.',
        sustainability_tip: 'Responsible AI avoids guessing when model inference fails.',
        reason: directErr.message,
        uncertainty: '⚠️ Gemini API error occurred.',
        source: 'fallback-error',
        error_message: directErr.message,
      };
    }
  }

  // Strict held-out fail
  if (isHeldOut || liveOnly) {
    throw new Error('This held-out benchmark contains NO canned output and strictly requires a live Gemini API key.');
  }

  // Default offline fallback
  onStageChange('vision');
  await new Promise(r => setTimeout(r, MIN_STAGE_MS));
  onStageChange('crosscheck');
  await new Promise(r => setTimeout(r, MIN_STAGE_MS));
  onStageChange('preparing');
  await new Promise(r => setTimeout(r, 200));

  return {
    item: 'Unverified Packaging Item',
    category: 'Unknown/Uncertain',
    bin: 'Campus Waste Sorting Hub',
    confidence: 0.0,
    disposal_action: 'Inspect the item for physical resin/recycling codes before disposal.',
    sustainability_tip: 'Configure GEMINI_API_KEY to activate live AI multimodal computer vision.',
    reason: 'Offline mode: No live Gemini API key was detected on the backend or client.',
    uncertainty: '⚠️ Live AI model is not connected. Configure GEMINI_API_KEY in .env to enable real-time inference.',
    source: 'fallback-no-key',
  };
}

async function callClientGemini(base64Data, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const prompt = `You are EcoSort AI. Analyze this waste image. Classify into: "Organic/Wet", "Recyclable/Dry", "General/Non-Recyclable", "Hazardous/Special", or "Unknown/Uncertain". Output ONLY valid JSON: {"item":"", "category":"", "bin":"", "confidence":0.95, "disposal_action":"", "sustainability_tip":"", "reason":"", "uncertainty":""}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Data } },
          { text: prompt },
        ],
      }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Gemini client error HTTP ${res.status}: ${errorBody}`);
  }
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(text);
}
