import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  UploadCloud,
  ScanEye,
  CheckCircle2,
  FileCheck2,
  Check,
} from 'lucide-react';
import { springSnappy, springGentle } from '../motion-presets';

// ── Stage definitions — each maps to a real backend event ─────────────
const STAGES = [
  {
    id: 'uploading',
    label: 'Uploading image',
    sublabel: 'Sending to EcoSort AI backend',
    Icon: UploadCloud,
  },
  {
    id: 'vision',
    label: 'Running vision analysis',
    sublabel: 'EcoSort AI multimodal inference in flight',
    Icon: ScanEye,
  },
  {
    id: 'crosscheck',
    label: 'Cross-checking reasoning',
    sublabel: 'Groq consistency verification pass',
    Icon: CheckCircle2,
  },
  {
    id: 'preparing',
    label: 'Preparing results',
    sublabel: 'Formatting and validating response',
    Icon: FileCheck2,
  },
];

// ── Shimmer animation CSS (injected once) ─────────────────────────────
const SHIMMER_KEYFRAMES = `
@keyframes ecosort-shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
`;

let shimmerInjected = false;
function injectShimmerKeyframes() {
  if (shimmerInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = SHIMMER_KEYFRAMES;
  document.head.appendChild(style);
  shimmerInjected = true;
}

// ── Skeleton block with glass-tinted shimmer sweep ────────────────────
function SkeletonBlock({ height = 18, width = '100%', borderRadius = 8, style: extraStyle = {} }) {
  const shouldReduceMotion = useReducedMotion();
  injectShimmerKeyframes();

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      height,
      width,
      borderRadius,
      background: 'rgba(200, 210, 220, 0.28)',
      ...extraStyle,
    }}>
      {!shouldReduceMotion && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.28) 50%, transparent 100%)',
          animation: 'ecosort-shimmer 1.6s ease-in-out infinite',
          willChange: 'transform',
        }} />
      )}
    </div>
  );
}

// ── Stage indicator strip ─────────────────────────────────────────────
function StageIndicator({ currentStageId, failed }) {
  const shouldReduceMotion = useReducedMotion();

  const currentIdx = STAGES.findIndex(s => s.id === currentStageId);

  return (
    <div
      className="glass-sm"
      style={{
        padding: '0.9rem 1.1rem',
        marginBottom: '1.25rem',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}
    >
      {STAGES.map((stage, idx) => {
        const isCompleted = idx < currentIdx;
        const isCurrent   = idx === currentIdx;
        const isUpcoming  = idx > currentIdx;
        const Icon = stage.Icon;

        return (
          <React.Fragment key={stage.id}>
            {/* Stage pill */}
            <motion.div
              layout
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                opacity: isUpcoming ? 0.38 : 1,
                transition: 'opacity 0.25s ease',
                flex: '1 1 auto',
                minWidth: '100px',
              }}
            >
              {/* Icon circle */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {/* Active glow ring */}
                {isCurrent && !failed && (
                  <motion.div
                    layoutId="stage-active-ring"
                    style={{
                      position: 'absolute',
                      inset: -3,
                      borderRadius: '50%',
                      background: 'rgba(4,120,87,0.18)',
                      border: '1.5px solid rgba(4,120,87,0.35)',
                    }}
                    initial={shouldReduceMotion ? false : { scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={springSnappy}
                  />
                )}

                <motion.div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: failed && isCurrent
                      ? 'rgba(220,38,38,0.15)'
                      : isCompleted
                        ? 'rgba(4,120,87,0.12)'
                        : isCurrent
                          ? 'rgba(4,120,87,0.18)'
                          : 'rgba(200,210,220,0.25)',
                    border: failed && isCurrent
                      ? '1.5px solid rgba(220,38,38,0.3)'
                      : isCompleted
                        ? '1.5px solid rgba(4,120,87,0.25)'
                        : isCurrent
                          ? '1.5px solid rgba(4,120,87,0.35)'
                          : '1.5px solid rgba(200,210,220,0.3)',
                  }}
                  initial={shouldReduceMotion ? false : (isCurrent ? { scale: 0.85 } : {})}
                  animate={isCurrent && !failed && !shouldReduceMotion ? {
                    scale: [1, 1.07, 1],
                    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                  } : { scale: 1 }}
                  transition={springSnappy}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={shouldReduceMotion ? {} : { scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={springSnappy}
                      >
                        <Check size={14} color="var(--color-emerald)" strokeWidth={2.5} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="icon"
                        initial={shouldReduceMotion ? {} : { scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={springSnappy}
                      >
                        <Icon
                          size={14}
                          color={
                            failed && isCurrent ? '#dc2626'
                            : isCurrent ? 'var(--color-emerald)'
                            : 'var(--color-muted)'
                          }
                          strokeWidth={isCurrent ? 2.5 : 2}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Label */}
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: isCurrent ? 700 : 600,
                  color: failed && isCurrent
                    ? '#991b1b'
                    : isCompleted
                      ? 'var(--color-emerald)'
                      : isCurrent
                        ? 'var(--color-forest)'
                        : 'var(--color-muted)',
                  lineHeight: 1.2,
                }}>
                  {stage.label}
                </div>
                {isCurrent && (
                  <motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={springGentle}
                    style={{
                      fontSize: '0.67rem',
                      color: failed ? '#b91c1c' : 'var(--color-muted)',
                      lineHeight: 1.3,
                      marginTop: '1px',
                    }}
                  >
                    {failed ? 'Error encountered — showing degraded results' : stage.sublabel}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Connector dot between steps */}
            {idx < STAGES.length - 1 && (
              <div style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: idx < currentIdx
                  ? 'rgba(4,120,87,0.5)'
                  : 'rgba(200,210,220,0.5)',
                flexShrink: 0,
                alignSelf: 'center',
                marginTop: 0,
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Main skeleton card — mirrors AnalysisResult layout ────────────────
export default function AnalysisLoader({ currentStage, failed = false }) {
  return (
    <motion.div
      key="loader"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={springGentle}
    >
      {/* Stage indicator */}
      <StageIndicator currentStageId={currentStage} failed={failed} />

      {/* Skeleton — same glass-md + left border as AnalysisResult card */}
      <div
        className="glass-md"
        style={{
          padding: '2rem',
          marginBottom: '3rem',
          borderLeft: '5px solid rgba(200,210,220,0.55)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {/* Provenance banner skeleton */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          background: 'rgba(200,210,220,0.18)', borderRadius: 'var(--radius-md)',
          padding: '0.7rem 1rem', marginBottom: '1.1rem',
        }}>
          <SkeletonBlock height={9} width={9} borderRadius="50%" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <SkeletonBlock height={12} width="55%" />
            <SkeletonBlock height={10} width="80%" />
          </div>
          <SkeletonBlock height={22} width={80} borderRadius={12} />
        </div>

        {/* Verification row skeleton */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          background: 'rgba(200,210,220,0.14)', borderRadius: 'var(--radius-md)',
          padding: '0.8rem 1.05rem', marginBottom: '1.1rem',
        }}>
          <SkeletonBlock height={20} width={20} borderRadius="50%" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <SkeletonBlock height={12} width="45%" />
            <SkeletonBlock height={10} width="72%" />
          </div>
          <SkeletonBlock height={22} width={110} borderRadius={12} />
        </div>

        {/* Header — title row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          gap: '1rem', marginBottom: '1.35rem',
          borderBottom: '1px solid rgba(226,232,240,0.4)', paddingBottom: '1.1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <SkeletonBlock height={36} width={36} borderRadius="50%" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <SkeletonBlock height={22} width={160} />
              <SkeletonBlock height={11} width={220} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <SkeletonBlock height={26} width={130} borderRadius={14} />
            <SkeletonBlock height={11} width={80} />
          </div>
        </div>

        {/* Visual assessment note skeleton */}
        <div style={{
          background: 'rgba(200,210,220,0.14)', borderRadius: 'var(--radius-md)',
          padding: '0.6rem 0.95rem', marginBottom: '1.1rem',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
        }}>
          <SkeletonBlock height={14} width={14} borderRadius={4} style={{ flexShrink: 0 }} />
          <SkeletonBlock height={11} width="75%" />
        </div>

        {/* Bin + Action two-col grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.1rem', marginBottom: '1.35rem',
        }}>
          {[0, 1].map(i => (
            <div key={i} style={{
              background: 'rgba(200,210,220,0.14)',
              border: '1px solid rgba(200,210,220,0.25)',
              borderRadius: 'var(--radius-md)', padding: '1.1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.6rem' }}>
                <SkeletonBlock height={16} width={16} borderRadius={4} />
                <SkeletonBlock height={11} width={90} />
              </div>
              <SkeletonBlock height={20} width="70%" style={{ marginBottom: '6px' }} />
              <SkeletonBlock height={10} width="90%" />
              <SkeletonBlock height={10} width="60%" style={{ marginTop: '4px' }} />
            </div>
          ))}
        </div>

        {/* Accordion sections (3 placeholder rows) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1.35rem' }}>
          {[140, 100, 80].map((h, i) => (
            <div key={i} style={{
              background: 'rgba(200,210,220,0.14)',
              border: '1px solid rgba(200,210,220,0.22)',
              borderRadius: 'var(--radius-md)', overflow: 'hidden',
            }}>
              {/* Header row */}
              <div style={{
                padding: '0.875rem 1.1rem', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <SkeletonBlock height={16} width={16} borderRadius={4} />
                  <SkeletonBlock height={13} width={140} />
                </div>
                <SkeletonBlock height={16} width={16} borderRadius={4} />
              </div>
              {/* Expanded content (only first row) */}
              {i === 0 && (
                <div style={{ padding: '0 1.1rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <SkeletonBlock height={11} width="90%" />
                  <SkeletonBlock height={11} width="75%" />
                  <SkeletonBlock height={11} width="82%" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sustainability tip skeleton */}
        <div style={{
          background: 'rgba(200,210,220,0.12)', border: '1px solid rgba(200,210,220,0.22)',
          borderRadius: 'var(--radius-md)', padding: '1.1rem', marginBottom: '1.35rem',
          display: 'flex', gap: '0.8rem', alignItems: 'flex-start',
        }}>
          <SkeletonBlock height={30} width={30} borderRadius="50%" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <SkeletonBlock height={11} width="35%" />
            <SkeletonBlock height={12} width="95%" />
            <SkeletonBlock height={12} width="80%" />
          </div>
        </div>

        {/* Reasoning note skeleton */}
        <div style={{
          background: 'rgba(200,210,220,0.10)', borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem', marginBottom: '1.35rem',
          display: 'flex', flexDirection: 'column', gap: '5px',
        }}>
          <SkeletonBlock height={11} width="85%" />
          <SkeletonBlock height={10} width="70%" />
        </div>

        {/* Reset button skeleton */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SkeletonBlock height={40} width={180} borderRadius={20} />
        </div>
      </div>
    </motion.div>
  );
}
