"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ComponentProps, ElementType } from "react";

type RevealProps = {
  as?: ElementType;
  delay?: number;
  y?: number;
} & ComponentProps<typeof motion.div>;

export function Reveal({
  as = "div",
  delay = 0,
  y = 24,
  children,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      variants={variants}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

export function RevealStagger({
  delay = 0,
  stagger = 0.08,
  children,
  ...props
}: { delay?: number; stagger?: number } & ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  y = 20,
  children,
  ...props
}: { y?: number } & ComponentProps<typeof motion.div>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
