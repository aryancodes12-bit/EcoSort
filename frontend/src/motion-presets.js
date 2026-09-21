/**
 * EcoSort AI — Shared Framer Motion spring presets
 * Define once, use everywhere. Respects prefers-reduced-motion at the
 * preset level so no per-component handling is needed.
 */

const reduced = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

const instant = { duration: 0 };

/** Snappy spring — for button tap feedback, pill indicators */
export const springSnappy = reduced
  ? instant
  : { type: 'spring', stiffness: 400, damping: 17 };

/** Gentle spring — for section entrances, card lifts */
export const springGentle = reduced
  ? instant
  : { type: 'spring', stiffness: 200, damping: 24 };

/** Smooth spring — for modals, sheets, large transitions */
export const springSmooth = reduced
  ? instant
  : { type: 'spring', stiffness: 150, damping: 22 };

/** Page/section fade-up entrance */
export const fadeUp = {
  initial: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: springGentle,
};

/** Stagger parent container */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: reduced
      ? { duration: 0 }
      : { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/** Stagger child */
export const staggerChild = {
  hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springGentle,
  },
};

/** Card hover + tap motion props */
export const cardMotion = reduced
  ? {}
  : {
      whileHover: {
        y: -5,
        boxShadow: '0 16px 48px rgba(0,0,0,0.13)',
        transition: springGentle,
      },
      whileTap: { scale: 0.98, transition: springSnappy },
    };

/** Button press — the most "iOS" feeling single detail */
export const buttonTap = reduced
  ? {}
  : { whileTap: { scale: 0.96, transition: springSnappy } };
