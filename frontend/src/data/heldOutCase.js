// Held-Out Test Case for EcoSort AI Validation
// CRITICAL: This case intentionally contains NO pre-computed 'expected' result.
// It is exclusively evaluated through live multimodal Gemini inference.

const makeSvgDataUri = (bg, emoji, label, sub) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg[0]}" />
        <stop offset="100%" stop-color="${bg[1]}" />
      </linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#g)" rx="24"/>
    <circle cx="300" cy="180" r="100" fill="white" opacity="0.15"/>
    <text x="300" y="210" font-size="90" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    <text x="300" y="320" font-family="'Outfit', sans-serif" font-weight="700" font-size="28" fill="#FFFFFF" text-anchor="middle">${label}</text>
    <text x="300" y="355" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" fill="rgba(255,255,255,0.8)" text-anchor="middle">${sub}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const HELD_OUT_CASE = {
  id: 'held-out-glass-bottle',
  name: 'Glass Beverage Bottle',
  badge: 'Live Gemini Only',
  emoji: '🍾',
  description: 'Uncached held-out item (no pre-computed output). Requires live Gemini API key.',
  image: makeSvgDataUri(['#064E3B', '#047857'], '🍾', 'Glass Beverage Bottle', 'Held-Out Benchmark • Live AI Only'),
  isHeldOut: true,
  liveOnly: true
  // Note: NO 'expected' object exists here!
};
