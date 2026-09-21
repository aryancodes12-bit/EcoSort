import React from 'react';
import { ArrowDown, Leaf, Shield, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerChild, buttonTap, springSnappy } from '../motion-presets';

export default function Hero({ onScrollToUpload }) {
  return (
    <section style={{ padding: '4rem 0 2.5rem 0', textAlign: 'center', position: 'relative' }}>
      <motion.div
        className="container"
        style={{ maxWidth: '840px' }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow badge */}
        <motion.div variants={staggerChild} style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
          <span className="badge badge-ai" style={{ fontSize: '0.78rem', padding: '0.35rem 1rem', gap: '0.4rem' }}>
            <Leaf size={13} /> AI FOR A SUSTAINABLE FUTURE
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={staggerChild}
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            letterSpacing: '-0.035em',
            marginBottom: '1.25rem',
            color: 'var(--color-forest)',
            lineHeight: 1.15,
          }}
        >
          Know your waste.{' '}
          <br />
          <span style={{
            background: 'linear-gradient(135deg, var(--color-emerald) 0%, #10b981 60%, #34d399 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Make the right choice.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={staggerChild}
          style={{
            fontSize: '1.1rem',
            color: 'var(--color-muted)',
            maxWidth: '600px',
            margin: '0 auto 2.25rem auto',
            lineHeight: 1.65,
          }}
        >
          Every year, millions of tons of recyclable materials are contaminated due to improper sorting.
          EcoSort AI uses multimodal vision AI to instantly guide your disposal at the point of action.
        </motion.p>

        {/* CTA button */}
        <motion.div variants={staggerChild} style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <motion.button
            onClick={onScrollToUpload}
            className="btn-primary"
            style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}
            whileTap={{ scale: 0.96, transition: springSnappy }}
            whileHover={{ boxShadow: '0 10px 32px rgba(4,120,87,0.45)', transition: { duration: 0.2 } }}
          >
            Analyze Waste Image <ArrowDown size={17} />
          </motion.button>
        </motion.div>

        {/* Trust strip — glass-sm pill */}
        <motion.div
          variants={staggerChild}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '0.65rem 1.5rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            color: 'var(--color-muted)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
          className="glass-sm"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Cpu size={14} color="var(--color-emerald)" /> Multimodal Vision AI
          </span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Shield size={14} color="var(--color-emerald)" /> Zero Image Retention
          </span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Leaf size={14} color="var(--color-emerald)" /> UN SDG 12 Aligned
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
