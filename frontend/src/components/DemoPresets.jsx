import React from 'react';
import { DEMO_CASES } from '../data/demoCases';
import { HELD_OUT_CASE } from '../data/heldOutCase';
import { Sparkles, Images } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerChild, springSnappy } from '../motion-presets';

export default function DemoPresets({ onSelectPreset, activeDemoId }) {
  const getBadgeClass = (category) => {
    if (category.includes('Organic'))                                    return 'badge-category-organic';
    if (category.includes('Recyclable'))                                 return 'badge-category-recyclable';
    if (category.includes('Hazardous'))                                  return 'badge-category-hazardous';
    if (category.includes('Uncertain') || category.includes('Unknown'))  return 'badge-category-uncertain';
    return 'badge-category-general';
  };

  const isHeldOutActive = activeDemoId === HELD_OUT_CASE.id;

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {/* Section header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginBottom: '1.1rem',
        gap: '0.5rem',
      }}>
        <div>
          <h3 style={{
            fontSize: '1.05rem',
            color: 'var(--color-forest)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            marginBottom: '0.2rem',
            fontWeight: 700,
          }}>
            <Images size={16} color="var(--color-emerald)" />
            Try a Sample
          </h3>
          <p style={{ fontSize: '0.81rem', color: 'var(--color-muted)', margin: 0 }}>
            Pick any item below to see how EcoSort AI classifies it — or upload your own photo above.
          </p>
        </div>
      </div>

      {/* Cards grid */}
      <motion.div
        className="presets-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
          gap: '0.85rem',
        }}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10px' }}
      >
        {/* Reference sample cards */}
        {DEMO_CASES.map((item) => {
          const isActive = activeDemoId === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onSelectPreset(item)}
              variants={staggerChild}
              whileTap={{ scale: 0.96, transition: springSnappy }}
              whileHover={!isActive ? {
                y: -4,
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                transition: { type: 'spring', stiffness: 300, damping: 20 },
              } : {}}
              style={{
                background: isActive
                  ? 'rgba(16, 185, 129, 0.14)'
                  : 'rgba(255, 255, 255, 0.58)',
                backdropFilter: 'blur(14px) saturate(160%)',
                WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                border: isActive
                  ? '2px solid rgba(16, 185, 129, 0.50)'
                  : '1px solid rgba(255, 255, 255, 0.45)',
                borderRadius: 'var(--radius-md)',
                padding: '0.9rem',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: isActive
                  ? '0 6px 20px rgba(4, 120, 87, 0.18)'
                  : '0 2px 12px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                position: 'relative',
                fontFamily: 'var(--font-body)',
              }}
            >
              {/* Emoji only — no Ref # numbering */}
              <span style={{ fontSize: '1.9rem', lineHeight: 1 }}>{item.emoji}</span>

              <div>
                <div style={{
                  fontSize: '0.83rem',
                  fontWeight: 700,
                  color: 'var(--color-forest)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {item.name}
                </div>
                <div style={{
                  fontSize: '0.71rem',
                  color: 'var(--color-muted)',
                  marginTop: '2px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.4,
                }}>
                  {item.description}
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '0.15rem' }}>
                <span className={`badge ${getBadgeClass(item.badge)}`} style={{ fontSize: '0.62rem', padding: '0.12rem 0.45rem' }}>
                  {item.badge}
                </span>
              </div>
            </motion.button>
          );
        })}

        {/* Live-only card — friendlier framing */}
        <motion.button
          onClick={() => onSelectPreset(HELD_OUT_CASE)}
          variants={staggerChild}
          whileTap={{ scale: 0.96, transition: springSnappy }}
          whileHover={!isHeldOutActive ? {
            y: -4,
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            transition: { type: 'spring', stiffness: 300, damping: 20 },
          } : {}}
          style={{
            background: isHeldOutActive
              ? 'rgba(245, 158, 11, 0.14)'
              : 'rgba(255, 253, 240, 0.70)',
            backdropFilter: 'blur(14px) saturate(160%)',
            WebkitBackdropFilter: 'blur(14px) saturate(160%)',
            border: isHeldOutActive
              ? '2px solid rgba(245, 158, 11, 0.50)'
              : '2px dashed rgba(217, 119, 6, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '0.9rem',
            textAlign: 'left',
            cursor: 'pointer',
            boxShadow: isHeldOutActive
              ? '0 6px 20px rgba(217, 119, 6, 0.22)'
              : '0 2px 12px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            position: 'relative',
            fontFamily: 'var(--font-body)',
          }}
        >
          {/* Emoji — no Test #6 badge */}
          <span style={{ fontSize: '1.9rem', lineHeight: 1 }}>{HELD_OUT_CASE.emoji}</span>

          <div>
            <div style={{
              fontSize: '0.83rem',
              fontWeight: 700,
              color: '#92400e',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {HELD_OUT_CASE.name}
            </div>
            <div style={{
              fontSize: '0.71rem',
              color: '#b45309',
              marginTop: '2px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
            }}>
              {HELD_OUT_CASE.description}
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '0.15rem' }}>
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#ffffff',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              boxShadow: '0 2px 8px rgba(217,119,6,0.3)',
            }}>
              <Sparkles size={9} /> Live AI
            </span>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
