'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeInUp, scaleIn, staggerContainer, staggerItem } from '@/lib/animations';

// Motion Card with fade in up animation
export function MotionCard({
  children,
  className,
  delay = 0,
  ...props
}: HTMLMotionProps<'div'> & { delay?: number }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, delay }}
      className={cn(
        'rounded-xl border border-border bg-card p-6 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Motion List with stagger animation
export function MotionList({
  children,
  className,
  ...props
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Motion List Item
export function MotionListItem({
  children,
  className,
  ...props
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div variants={staggerItem} className={className} {...props}>
      {children}
    </motion.div>
  );
}

// Fade wrapper
export function FadeIn({
  children,
  delay = 0,
  duration = 0.3,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Scale on tap
export function ScaleTap({
  children,
  scale = 0.98,
  className,
}: {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}) {
  return (
    <motion.div whileTap={{ scale }} className={className}>
      {children}
    </motion.div>
  );
}

// Number animation (counting up/down)
export function AnimatedNumber({
  value,
  className,
  formatOptions,
}: {
  value: number;
  className?: string;
  formatOptions?: Intl.NumberFormatOptions;
}) {
  const formatter = new Intl.NumberFormat('fr-FR', formatOptions);
  
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {formatter.format(value)}
    </motion.span>
  );
}

// Page transition wrapper
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
