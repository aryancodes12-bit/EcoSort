import React from 'react';
import { Target, Globe, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerChild, cardMotion } from '../motion-presets';

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 180, damping: 22 } },
};

const sdgCards = [
  {
    code: 'SDG 12',
    color: '#DC2626',
    borderColor: '#DC2626',
    title: 'Responsible Consumption & Production',
    target: 'Target 12.5: Substantially reduce waste generation through prevention, reduction, recycling, and reuse.',
    desc: 'By reducing contamination at the disposal bin, EcoSort AI drastically increases the volume of pure, recyclable material that successfully reaches processing plants.',
    tag: 'PRIMARY SDG',
    tagBg: 'rgba(220,38,38,0.10)',
    tagColor: '#991B1B',
  },
  {
    code: 'SDG 11',
    color: '#D97706',
    borderColor: '#F59E0B',
    title: 'Sustainable Cities & Communities',
    target: 'Target 11.6: Reduce the adverse per capita environmental impact of cities, focusing on municipal waste management.',
    desc: 'Improves campus and urban sanitation efficiency, preventing unsegregated municipal waste piles and open burning.',
    tag: null,
  },
  {
    code: 'SDG 13',
    color: '#059669',
    borderColor: '#10B981',
    title: 'Climate Action',
    target: 'Target 13.3: Improve education and institutional capacity on climate change mitigation and impact reduction.',
    desc: 'Diverting food and organic waste to composting prevents anaerobic decomposition in landfills, directly mitigating methane emissions.',
    tag: null,
  },
];

const dtSteps = [
  { step: '1. EMPATHIZE', desc: 'Observed confusion among students and residents faced with ambiguous multi-material packaging.' },
  { step: '2. DEFINE',   desc: 'Identified the lack of instantaneous point-of-disposal guidance as the root cause of recycling contamination.' },
  { step: '3. IDEATE',   desc: 'Designed a lightweight multimodal AI vision workflow producing structured disposal actions and sustainability tips.' },
  { step: '4. PROTOTYPE',desc: 'Engineered a resilient web app supporting real-time camera capture, drag-and-drop, and API fallbacks.' },
  { step: '5. TEST',     desc: 'Validated against 5 diverse benchmark waste cases including mixed waste abstention.' },
];

export default function SdgSection() {
  return (
    <section id="sdg-section" style={{ padding: '3.5rem 0 2.5rem 0' }}>
      <div className="container">

        {/* Section header */}
        <motion.div
          style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem auto' }}
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          <span className="badge badge-sdg" style={{ marginBottom: '0.75rem' }}>
            <Target size={13} /> SUSTAINABILITY ALIGNMENT
          </span>
          <h2 style={{ fontSize: '2rem', color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
            United Nations Sustainable Development Goals
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-muted)' }}>
            EcoSort AI addresses the waste segregation gap at educational institutions and communities
            through targeted technological intervention.
          </p>
        </motion.div>

        {/* SDG cards */}
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
        >
          {sdgCards.map((card, i) => (
            <motion.div
              key={i}
              variants={staggerChild}
              {...cardMotion}
              className="glass-md"
              style={{
                padding: '1.75rem',
                borderTop: `4px solid ${card.borderColor}`,
                borderRadius: 'var(--radius-lg)',
                position: 'relative',
                cursor: 'default',
              }}
            >
              {card.tag && (
                <span style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: card.tagBg,
                  color: card.tagColor,
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '0.18rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  letterSpacing: '0.03em',
                }}>
                  {card.tag}
                </span>
              )}

              <h3 style={{ fontSize: '1.3rem', color: card.color, marginBottom: '0.35rem', fontFamily: 'var(--font-heading)' }}>
                {card.code}
              </h3>
              <h4 style={{ fontSize: '1rem', color: 'var(--color-forest)', marginBottom: '0.75rem', fontWeight: 700 }}>
                {card.title}
              </h4>
              <p style={{ fontSize: '0.855rem', color: 'var(--color-charcoal)', lineHeight: 1.55, marginBottom: '0.85rem' }}>
                <strong>{card.target}</strong>
              </p>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-muted)', lineHeight: 1.55, margin: 0 }}>
                {card.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Design Thinking bar */}
        <motion.div
          className="glass-md"
          style={{ padding: '2rem' }}
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
        >
          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-forest)', marginBottom: '1.35rem', textAlign: 'center' }}>
            Design Thinking Framework
          </h3>
          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.85rem' }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10px' }}
          >
            {dtSteps.map((d, i) => (
              <motion.div
                key={i}
                variants={staggerChild}
                className="glass-sm"
                style={{ padding: '0.95rem', borderRadius: 'var(--radius-md)' }}
              >
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--color-emerald)',
                  marginBottom: '0.35rem',
                  letterSpacing: '0.03em',
                }}>
                  {d.step}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-charcoal)', lineHeight: 1.45 }}>
                  {d.desc}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
