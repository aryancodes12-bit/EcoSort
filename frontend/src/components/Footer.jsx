import React from 'react';
import { Heart, Recycle } from 'lucide-react';
import { motion } from 'framer-motion';
import { buttonTap } from '../motion-presets';

export default function Footer({ onOpenResponsibleAi }) {
  return (
    <footer style={{
      marginTop: '4rem',
      background: 'var(--glass-lg-bg)',
      backdropFilter: 'var(--glass-lg-blur)',
      WebkitBackdropFilter: 'var(--glass-lg-blur)',
      borderTop: '1px solid rgba(255,255,255,0.4)',
      padding: '2.25rem 0',
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Recycle size={18} color="var(--color-emerald)" />
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.05rem',
              color: 'var(--color-forest)',
            }}>
              EcoSort AI
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', margin: 0, maxWidth: '380px', lineHeight: 1.5 }}>
            Academic Prototype for the{' '}
            <strong>1M1B AI for Sustainability Virtual Internship</strong> (IBM SkillsBuild &amp; AICTE).
          </p>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <motion.button
            onClick={onOpenResponsibleAi}
            {...buttonTap}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-muted)',
              fontSize: '0.83rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              padding: '0.25rem 0',
              textDecoration: 'underline',
              textDecorationColor: 'rgba(100,116,139,0.35)',
            }}
          >
            Responsible AI Policy
          </motion.button>

          <motion.a
            href="#sdg-section"
            {...buttonTap}
            style={{
              color: 'var(--color-muted)',
              fontSize: '0.83rem',
              textDecoration: 'none',
            }}
          >
            UN SDG 12
          </motion.a>

          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.78rem',
            color: 'var(--color-muted)',
            opacity: 0.7,
          }}>
            Made with <Heart size={12} color="#dc2626" fill="#dc2626" /> for sustainability
          </span>
        </div>
      </div>
    </footer>
  );
}
