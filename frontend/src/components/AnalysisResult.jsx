import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Lightbulb,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
  ListOrdered,
  Globe2,
  ShieldCheck,
  Eye,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { springSnappy, springGentle, staggerContainer, staggerChild, buttonTap } from '../motion-presets';

/* ── Collapsible accordion section ───────────────────────────────────── */
function AccordionSection({ icon, title, isOpen, onToggle, children }) {
  return (
    <div
      className="glass-sm"
      style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}
    >
      <motion.button
        onClick={onToggle}
        whileTap={{ scale: 0.99, transition: springSnappy }}
        style={{
          width: '100%',
          padding: '0.875rem 1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'var(--font-body)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, color: 'var(--color-forest)', fontSize: '0.9rem' }}>
          {icon}
          {title}
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={springSnappy}>
          <ChevronDown size={17} color="var(--color-muted)" />
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springGentle}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 1.1rem 1.1rem', borderTop: '1px solid rgba(226,232,240,0.45)' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Source provenance banner ────────────────────────────────────────── */
function ProvenanceBanner({ source, error_message, reason, onRunLive }) {
  const s = source || 'gemini-live';

  const configs = {
    'gemini-live': {
      bg: 'linear-gradient(135deg, rgba(240,253,244,0.9) 0%, rgba(220,252,231,0.9) 100%)',
      border: 'rgba(134,239,172,0.5)',
      dot: '#16a34a',
      dotGlow: 'rgba(22,163,74,0.25)',
      titleColor: '#14532d',
      subtitleColor: '#166534',
      badge: { bg: '#16a34a', color: '#fff', text: 'Live Model' },
      icon: <Sparkles size={14} color="#16a34a" />,
      title: 'Live EcoSort AI (Verified Model Inference)',
      subtitle: 'Engine: Google Gemini Multimodal Vision • Zero cached JSON • Real-time Multimodal Inference',
    },
    'demo-preset': {
      bg: 'linear-gradient(135deg, rgba(239,246,255,0.9) 0%, rgba(219,234,254,0.9) 100%)',
      border: 'rgba(147,197,253,0.5)',
      dot: null,
      titleColor: '#1e40af',
      subtitleColor: '#1e3a8a',
      badge: { bg: '#2563eb', color: '#fff', text: 'Reference Preset' },
      icon: <Info size={16} color="#2563eb" />,
      title: '📋 Reference Benchmark Output (Pre-computed Preset)',
      subtitle: 'Standard demonstration baseline • Pre-computed test scenario • No live API tokens consumed',
    },
    'fallback-no-key': {
      bg: 'linear-gradient(135deg, rgba(255,251,235,0.9) 0%, rgba(254,243,199,0.9) 100%)',
      border: 'rgba(252,211,77,0.5)',
      dot: null,
      titleColor: '#92400e',
      subtitleColor: '#b45309',
      badge: { bg: '#d97706', color: '#fff', text: 'Offline Mode' },
      icon: <AlertTriangle size={16} color="#d97706" />,
      title: '⚠️ Offline Fallback Mode (No GEMINI_API_KEY Configured)',
      subtitle: 'Configure GEMINI_API_KEY in .env to unlock live multimodal AI computer vision.',
    },
    'fallback-error': {
      bg: 'linear-gradient(135deg, rgba(254,242,242,0.9) 0%, rgba(254,226,226,0.9) 100%)',
      border: 'rgba(252,165,165,0.5)',
      dot: null,
      titleColor: '#991b1b',
      subtitleColor: '#b91c1c',
      badge: { bg: '#dc2626', color: '#fff', text: 'Degraded Mode' },
      icon: <AlertTriangle size={16} color="#dc2626" />,
      title: '❌ Degraded Mode (Upstream EcoSort AI Failure)',
      subtitle: error_message || reason || 'Live model execution could not be completed.',
    },
  };

  const cfg = configs[s] || configs['gemini-live'];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.5rem',
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      borderRadius: 'var(--radius-md)',
      padding: '0.7rem 1rem',
      marginBottom: '1.1rem',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {cfg.dot && (
          <span style={{
            display: 'inline-block',
            width: '9px', height: '9px',
            borderRadius: '50%',
            background: cfg.dot,
            boxShadow: `0 0 0 3px ${cfg.dotGlow}`,
            flexShrink: 0,
          }} />
        )}
        {!cfg.dot && cfg.icon}
        <div>
          <div style={{ fontSize: '0.83rem', fontWeight: 700, color: cfg.titleColor, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {cfg.dot && cfg.icon} {cfg.title}
          </div>
          <div style={{ fontSize: '0.73rem', color: cfg.subtitleColor }}>{cfg.subtitle}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{
          fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.05em', background: cfg.badge.bg, color: cfg.badge.color,
          padding: '0.18rem 0.65rem', borderRadius: 'var(--radius-full)',
        }}>
          {cfg.badge.text}
        </span>
        {s === 'demo-preset' && onRunLive && (
          <motion.button
            onClick={onRunLive}
            {...buttonTap}
            style={{
              fontSize: '0.72rem', fontWeight: 600, padding: '0.28rem 0.75rem',
              borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.8)',
              border: '1px solid #2563eb', color: '#2563eb', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-body)',
            }}
          >
            <Sparkles size={11} /> Run Live
          </motion.button>
        )}
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────────── */
export default function AnalysisResult({ result, onReset, onRunLive }) {
  if (!result) return null;

  const {
    item, category, bin, confidence,
    disposal_action, disposal_steps,
    material_breakdown, alternative_categories_considered,
    environmental_impact, image_quality_note,
    verification, sustainability_tip,
    reason, uncertainty,
    source, error_message,
  } = result;

  const [openSections, setOpenSections] = useState({
    materials: true, steps: true, alternatives: false, environment: false,
  });
  const toggle = (key) => setOpenSections(p => ({ ...p, [key]: !p[key] }));

  const isUncertain = category.includes('Uncertain') || category.includes('Unknown') || (uncertainty?.trim().length > 0);

  const getCategoryTheme = () => {
    if (category.includes('Organic'))    return { badgeClass: 'badge-category-organic',    binColor: '#059669', binBg: 'rgba(16,185,129,0.09)',  icon: '🟢', title: 'Organic / Wet Waste' };
    if (category.includes('Recyclable')) return { badgeClass: 'badge-category-recyclable', binColor: '#2563eb', binBg: 'rgba(37,99,235,0.09)',   icon: '♻️', title: 'Recyclable / Dry Waste' };
    if (category.includes('Hazardous'))  return { badgeClass: 'badge-category-hazardous',  binColor: '#dc2626', binBg: 'rgba(220,38,38,0.09)',   icon: '☣️', title: 'Hazardous / Special Waste' };
    if (isUncertain)                     return { badgeClass: 'badge-category-uncertain',   binColor: '#d97706', binBg: 'rgba(217,119,6,0.09)',   icon: '⚠️', title: 'Mixed / Uncertain Waste' };
    return                                      { badgeClass: 'badge-category-general',     binColor: '#475569', binBg: 'rgba(100,116,139,0.09)', icon: '🗑️', title: 'General / Non-Recyclable Waste' };
  };

  const theme = getCategoryTheme();

  /* Verification row */
  const renderVerification = () => {
    if (!verification) return null;
    const { checked_by, agreement, note } = verification;
    const agree = agreement === 'agree';
    const disagree = agreement === 'disagree';
    const color   = agree ? '#047857' : disagree ? '#be123c' : '#475569';
    const bg      = agree ? 'rgba(4,120,87,0.09)' : disagree ? 'rgba(190,18,60,0.09)' : 'rgba(100,116,139,0.09)';
    const border  = agree ? 'rgba(167,243,208,0.6)' : disagree ? 'rgba(254,205,211,0.6)' : 'rgba(203,213,225,0.6)';
    const text    = agree ? 'Consistent (Agree)' : disagree ? 'Disagreement Flagged' : 'Unavailable';

    return (
      <div style={{
        background: bg, border: `1px solid ${border}`, borderRadius: 'var(--radius-md)',
        padding: '0.8rem 1.05rem', marginBottom: '1.1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '0.6rem',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck size={18} color={color} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.815rem', fontWeight: 700, color: 'var(--color-forest)' }}>
              Cross-checked by Groq ({checked_by || 'text-consistency review'})
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--color-muted)', marginTop: '1px' }}>
              {note || 'Independent second-model plausibility check on classification reasoning.'}
            </div>
          </div>
        </div>
        <span style={{
          fontSize: '0.68rem', fontWeight: 700, background: bg, color, padding: '0.28rem 0.7rem',
          borderRadius: 'var(--radius-full)', border: `1px solid ${border}`,
          textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          {text}
        </span>
      </div>
    );
  };

  return (
    <motion.div
      className="glass-md"
      style={{
        padding: '2rem',
        marginBottom: '3rem',
        borderLeft: `5px solid ${theme.binColor}`,
        borderRadius: 'var(--radius-lg)',
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springGentle}
    >
      {/* Source badge */}
      <ProvenanceBanner
        source={source}
        error_message={error_message}
        reason={reason}
        onRunLive={onRunLive}
      />

      {/* Groq verification */}
      {renderVerification()}

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: '1rem', marginBottom: '1.35rem',
        borderBottom: '1px solid rgba(226,232,240,0.5)', paddingBottom: '1.1rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '1.45rem' }}>{theme.icon}</span>
            <h2 style={{ fontSize: '1.7rem', color: 'var(--color-forest)', margin: 0 }}>
              {item || 'Waste Item'}
            </h2>
          </div>
          <p style={{ fontSize: '0.845rem', color: 'var(--color-muted)', margin: 0 }}>
            AI Multimodal Object Identification &amp; Material Analysis
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
          <span className={`badge ${theme.badgeClass}`} style={{ fontSize: '0.83rem', padding: '0.32rem 0.9rem' }}>
            {category}
          </span>
          <span style={{ fontSize: '0.73rem', color: 'var(--color-muted)', fontWeight: 600 }}>
            Confidence: {Math.round((confidence || 0.9) * 100)}%
          </span>
        </div>
      </div>

      {/* Image quality note */}
      {image_quality_note?.trim().length > 0 && (
        <div style={{
          background: 'rgba(241,245,249,0.6)', border: '1px solid rgba(226,232,240,0.5)',
          borderRadius: 'var(--radius-md)', padding: '0.6rem 0.95rem', marginBottom: '1.1rem',
          display: 'flex', alignItems: 'center', gap: '0.55rem',
          fontSize: '0.79rem', color: 'var(--color-muted)',
        }}>
          <Eye size={14} color="var(--color-emerald)" style={{ flexShrink: 0 }} />
          <span><strong>Visual Assessment:</strong> {image_quality_note}</span>
        </div>
      )}

      {/* Uncertainty notice */}
      {isUncertain && (
        <div style={{
          background: 'rgba(255,251,235,0.8)', border: '1px solid rgba(253,230,138,0.6)',
          borderRadius: 'var(--radius-md)', padding: '1.1rem', marginBottom: '1.35rem',
          display: 'flex', gap: '0.85rem', alignItems: 'flex-start',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        }}>
          <AlertTriangle color="#d97706" size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ color: '#92400e', marginBottom: '0.2rem', fontSize: '0.9rem', fontWeight: 700 }}>
              Responsible AI: Uncertainty / Mixed Waste Detected
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#b45309', lineHeight: 1.55, margin: 0 }}>
              {uncertainty || 'The image contains multiple waste materials or partial ambiguity. Rather than guessing, EcoSort AI requests separating the materials before depositing.'}
            </p>
          </div>
        </div>
      )}

      {/* Bin + Action grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.1rem', marginBottom: '1.35rem',
      }}>
        {/* Recommended Bin */}
        <div style={{
          background: theme.binBg,
          border: `1px solid ${theme.binColor}33`,
          borderRadius: 'var(--radius-md)', padding: '1.1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem' }}>
            <Trash2 size={16} color={theme.binColor} />
            <h3 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.binColor, margin: 0 }}>
              Recommended Bin
            </h3>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.2rem' }}>
            {bin || 'Appropriate Segregation Bin'}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', margin: 0 }}>
            Standard designated campus/municipal color-coded collection point.
          </p>
        </div>

        {/* What to do */}
        <div style={{
          background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(226,232,240,0.5)',
          borderRadius: 'var(--radius-md)', padding: '1.1rem',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem' }}>
            <CheckCircle2 size={16} color="var(--color-emerald)" />
            <h3 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-forest)', margin: 0 }}>
              What Should You Do?
            </h3>
          </div>
          <p style={{ fontSize: '0.925rem', color: 'var(--color-charcoal)', lineHeight: 1.55, margin: 0 }}>
            {disposal_action}
          </p>
        </div>
      </div>

      {/* Accordion sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1.35rem' }}>

        {disposal_steps?.length > 0 && (
          <AccordionSection
            icon={<ListOrdered size={16} color="var(--color-emerald)" />}
            title={`Step-by-Step Disposal (${disposal_steps.length} Steps)`}
            isOpen={openSections.steps}
            onToggle={() => toggle('steps')}
          >
            <ol style={{ margin: '0.65rem 0 0', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {disposal_steps.map((step, idx) => (
                <li key={idx} style={{ fontSize: '0.855rem', color: 'var(--color-charcoal)', lineHeight: 1.55 }}>
                  {step}
                </li>
              ))}
            </ol>
          </AccordionSection>
        )}

        {material_breakdown?.length > 0 && (
          <AccordionSection
            icon={<Layers size={16} color="var(--color-emerald)" />}
            title="Material Composition Breakdown"
            isOpen={openSections.materials}
            onToggle={() => toggle('materials')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.65rem' }}>
              {material_breakdown.map((mat, idx) => (
                <div key={idx} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.4rem 0.7rem',
                  background: 'rgba(248,250,252,0.7)', borderRadius: 'var(--radius-sm)',
                  fontSize: '0.84rem',
                }}>
                  <span style={{ color: 'var(--color-forest)', fontWeight: 600 }}>{mat.material}</span>
                  <span style={{
                    background: 'rgba(226,232,240,0.8)', color: '#334155',
                    fontWeight: 700, fontSize: '0.73rem',
                    padding: '0.12rem 0.5rem', borderRadius: 'var(--radius-full)',
                  }}>
                    {mat.percentage_estimate || '100%'}
                  </span>
                </div>
              ))}
            </div>
          </AccordionSection>
        )}

        {alternative_categories_considered?.length > 0 && (
          <AccordionSection
            icon={<Info size={16} color="var(--color-emerald)" />}
            title={`What Else the AI Model Considered (${alternative_categories_considered.length})`}
            isOpen={openSections.alternatives}
            onToggle={() => toggle('alternatives')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.65rem' }}>
              {alternative_categories_considered.map((alt, idx) => (
                <div key={idx} style={{
                  padding: '0.55rem 0.8rem', background: 'rgba(248,250,252,0.7)',
                  borderRadius: 'var(--radius-sm)', fontSize: '0.84rem',
                }}>
                  <div style={{ fontWeight: 700, color: '#334155', marginBottom: '0.18rem' }}>Weighed: {alt.category}</div>
                  <div style={{ color: 'var(--color-muted)', fontSize: '0.78rem', lineHeight: 1.45 }}>
                    <strong>Why Rejected:</strong> {alt.why_rejected}
                  </div>
                </div>
              ))}
            </div>
          </AccordionSection>
        )}

        {environmental_impact && (
          <AccordionSection
            icon={<Globe2 size={16} color="var(--color-emerald)" />}
            title="Lifecycle & Environmental Impact"
            isOpen={openSections.environment}
            onToggle={() => toggle('environment')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.65rem', fontSize: '0.84rem' }}>
              {environmental_impact.decomposition_time_estimate && (
                <div>
                  <strong style={{ color: 'var(--color-forest)' }}>Decomposition Timeline: </strong>
                  <span style={{ color: 'var(--color-charcoal)' }}>{environmental_impact.decomposition_time_estimate}</span>
                </div>
              )}
              {environmental_impact.co2_or_resource_note && (
                <div>
                  <strong style={{ color: 'var(--color-forest)' }}>Resource &amp; CO₂ Note: </strong>
                  <span style={{ color: 'var(--color-charcoal)' }}>{environmental_impact.co2_or_resource_note}</span>
                </div>
              )}
            </div>
          </AccordionSection>
        )}
      </div>

      {/* Sustainability tip */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(240,253,244,0.85) 0%, rgba(236,253,245,0.85) 100%)',
        border: '1px solid rgba(187,247,208,0.6)',
        borderRadius: 'var(--radius-md)',
        padding: '1.1rem', marginBottom: '1.35rem',
        display: 'flex', gap: '0.8rem', alignItems: 'flex-start',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      }}>
        <div style={{
          background: 'var(--color-emerald)', color: '#fff', borderRadius: '50%',
          width: '30px', height: '30px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(4,120,87,0.3)',
        }}>
          <Lightbulb size={16} />
        </div>
        <div>
          <div style={{
            fontSize: '0.77rem', fontWeight: 800, color: 'var(--color-emerald)',
            textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem',
          }}>
            🌱 Sustainability Tip (SDG 12)
          </div>
          <p style={{ fontSize: '0.875rem', color: '#065f46', lineHeight: 1.55, margin: 0 }}>
            {sustainability_tip}
          </p>
        </div>
      </div>

      {/* AI Reasoning note */}
      <div style={{
        background: 'rgba(248,250,252,0.65)', borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--color-muted)',
        border: '1px solid rgba(226,232,240,0.4)', marginBottom: '1.35rem',
        display: 'flex', flexDirection: 'column', gap: '0.35rem',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      }}>
        <div><strong>AI Reasoning:</strong> {reason}</div>
        <div><em>* Disclaimer: Local municipal bylaws and campus bin guidelines may vary. Always follow on-site facility bin labels.</em></div>
      </div>

      {/* Reset CTA */}
      <div style={{ textAlign: 'center' }}>
        <motion.button onClick={onReset} className="btn-secondary" {...buttonTap}>
          <RotateCcw size={15} /> Analyze Another Item
        </motion.button>
      </div>
    </motion.div>
  );
}
