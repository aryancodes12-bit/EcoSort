import React from 'react';
import { Recycle, ShieldCheck, BookOpen, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { buttonTap } from '../motion-presets';

export default function Navbar({ onOpenResponsibleAi }) {
  const { scrollY } = useScroll();

  // As user scrolls: blur increases 12px→28px, bg opacity 0.55→0.82
  const blurValue = useTransform(scrollY, [0, 80], [12, 28]);
  const bgOpacity = useTransform(scrollY, [0, 80], [0.55, 0.82]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0.25, 0.45]);

  return (
    <motion.header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        backdropFilter: useTransform(blurValue, v => `blur(${v}px) saturate(180%)`),
        WebkitBackdropFilter: useTransform(blurValue, v => `blur(${v}px) saturate(180%)`),
        backgroundColor: useTransform(bgOpacity, v => `rgba(255, 255, 255, ${v})`),
        borderBottom: '1px solid',
        borderColor: useTransform(borderOpacity, v => `rgba(255, 255, 255, ${v})`),
        padding: '0.75rem 0',
        boxShadow: '0 1px 24px rgba(0,0,0,0.06)',
      }}
    >
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <motion.div
            whileHover={{ rotate: 20, scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 350, damping: 14 }}
            style={{
              background: 'linear-gradient(135deg, var(--color-emerald) 0%, #10b981 100%)',
              color: '#fff',
              width: '42px',
              height: '42px',
              borderRadius: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(4, 120, 87, 0.30), inset 0 1px 0 rgba(255,255,255,0.2)',
              flexShrink: 0,
            }}
          >
            <Recycle size={22} />
          </motion.div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.2rem',
                color: 'var(--color-forest)',
                letterSpacing: '-0.025em',
              }}>
                EcoSort AI
              </span>
              <span className="badge badge-ai" style={{ fontSize: '0.68rem', padding: '0.12rem 0.5rem' }}>
                <Sparkles size={10} /> Multimodal
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: '-1px' }}>
              Smart Waste Segregation Assistant
            </div>
          </div>
        </div>

        {/* Nav actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <motion.a
            href="#sdg-section"
            className="badge badge-sdg"
            style={{ textDecoration: 'none', cursor: 'pointer' }}
            {...buttonTap}
          >
            <BookOpen size={12} />
            UN SDG 12
          </motion.a>

          <motion.button
            onClick={onOpenResponsibleAi}
            className="btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.83rem' }}
            {...buttonTap}
          >
            <ShieldCheck size={15} color="var(--color-emerald)" />
            Responsible AI
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
