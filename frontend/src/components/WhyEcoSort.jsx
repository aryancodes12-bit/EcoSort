import React from 'react';
import { Camera, Sparkles, CheckCircle, AlertCircle, HelpCircle, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerChild, cardMotion } from '../motion-presets';

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 180, damping: 22 } },
};

export default function WhyEcoSort() {
  const steps = [
    {
      num: '01',
      icon: <Camera size={20} color="var(--color-emerald)" />,
      title: 'Capture at Point of Action',
      desc: 'Snap or upload a photo of the item in hand right before you approach disposal bins.',
    },
    {
      num: '02',
      icon: <Sparkles size={20} color="var(--color-emerald)" />,
      title: 'Multimodal AI Analysis',
      desc: 'EcoSort AI examines physical shape, polymer finish, and composite layers with transparent reasoning.',
    },
    {
      num: '03',
      icon: <CheckCircle size={20} color="var(--color-emerald)" />,
      title: 'Step-by-Step Guidance',
      desc: 'Receive immediate bin mapping, preparation steps (rinse, crush), and cross-model validation.',
    },
  ];

  const problems = [
    {
      icon: <AlertCircle size={17} color="#dc2626" />,
      title: 'The Contamination Bottleneck',
      iconBg: 'rgba(220,38,38,0.08)',
      text: 'Industry estimates suggest up to 25% of curbside recyclables end up rejected and landfilled because greasy food wrappers or residual liquids cross-contaminate clean dry paper and polymer batches.',
    },
    {
      icon: <HelpCircle size={17} color="#d97706" />,
      title: 'Why Humans Struggle',
      iconBg: 'rgba(217,119,6,0.08)',
      text: 'Visually identical items require opposite handling. A plain paper cup is recyclable; a plastic-lined hot coffee cup is non-recyclable domestic refuse. Clear PET bottles can be reprocessed; PVC clamshells poison the batch.',
    },
    {
      icon: <Lightbulb size={17} color="#059669" />,
      title: 'How EcoSort AI Helps',
      iconBg: 'rgba(5,150,105,0.08)',
      text: 'Provides instant multimodal guidance at the point of action — identifying composite materials, explaining preparation steps, and conscientiously refusing to guess whenever visual ambiguity is detected.',
    },
  ];

  return (
    <section style={{ padding: '1rem 0 3rem 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>

        {/* ── Why EcoSort AI ── */}
        <motion.div
          className="glass-md"
          style={{ padding: '2.5rem', marginBottom: '2rem' }}
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.85rem' }}>
            <span className="badge badge-ai" style={{ fontSize: '0.72rem', marginBottom: '0.6rem' }}>
              THE CORE CHALLENGE
            </span>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--color-forest)', margin: '0.4rem 0 0.5rem' }}>
              Why EcoSort AI Matters
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-muted)', maxWidth: '620px', margin: '0 auto' }}>
              Sorting sounds trivial, but modern packaging complexity makes everyday binning deceptively error-prone.
            </p>
          </div>

          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.1rem',
              marginBottom: '1.75rem',
            }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-20px' }}
          >
            {problems.map((p, i) => (
              <motion.div
                key={i}
                variants={staggerChild}
                {...cardMotion}
                className="glass-sm"
                style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', cursor: 'default' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <div style={{
                    background: p.iconBg,
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {p.icon}
                  </div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-forest)', margin: 0 }}>
                    {p.title}
                  </h3>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--color-charcoal)', lineHeight: 1.55, margin: 0 }}>
                  {p.text}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <div style={{
            background: 'rgba(241, 245, 249, 0.55)',
            borderRadius: 'var(--radius-md)',
            padding: '0.8rem 1.1rem',
            fontSize: '0.78rem',
            color: 'var(--color-muted)',
            lineHeight: 1.5,
            textAlign: 'center',
            border: '1px solid rgba(226,232,240,0.5)',
          }}>
            <em>* EcoSort AI acts as an educational decision aid — designed to supplement, never override, your local facility bin signage.</em>
          </div>
        </motion.div>

        {/* ── How It Works 3-Step Strip ── */}
        <motion.div
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-forest)', margin: 0 }}>
              How It Works in 3 Quick Steps
            </h3>
          </div>

          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-20px' }}
          >
            {steps.map((s, idx) => (
              <motion.div
                key={idx}
                variants={staggerChild}
                {...cardMotion}
                className="glass-sm"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'default',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {s.icon}
                  </div>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-emerald)', opacity: 0.5 }}>
                    {s.num}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-forest)', margin: 0 }}>
                  {s.title}
                </h4>
                <p style={{ fontSize: '0.815rem', color: 'var(--color-muted)', lineHeight: 1.55, margin: 0 }}>
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
