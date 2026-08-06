"use client";

import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { durationSeconds, easing } from "@/design-system/tokens/motion";

export const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durationSeconds.moderate,
      ease: easing.standard,
    },
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durationSeconds.moderate,
      ease: easing.emphasized,
    },
  },
};

export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durationSeconds.normal,
      ease: easing.standard,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: durationSeconds.fast,
      ease: easing.exit,
    },
  },
};

export const cardHoverVariants: Variants = {
  rest: { y: 0 },
  hover: {
    y: -1,
    transition: {
      duration: durationSeconds.fast,
      ease: easing.standard,
    },
  },
};

export const buttonPressVariants: Variants = {
  rest: { scale: 1 },
  press: {
    scale: 0.985,
    transition: {
      duration: durationSeconds.instant,
      ease: easing.standard,
    },
  },
};

type MotionDivProps = HTMLMotionProps<"div">;

function useMotionSafe() {
  const prefersReduced = useReducedMotion();
  // null during SSR/hydration — treat as "animate" so markup stays stable
  return prefersReduced !== true;
}

export function FadeIn({
  children,
  delay = 0,
  className,
  ...props
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
} & Omit<MotionDivProps, "children" | "className">) {
  const animate = useMotionSafe();

  return (
    <motion.div
      variants={fadeInVariants}
      initial={animate ? "hidden" : false}
      animate="visible"
      transition={{
        duration: durationSeconds.moderate,
        delay: animate ? delay : 0,
        ease: easing.standard,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({
  children,
  delay = 0,
  className,
  ...props
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
} & Omit<MotionDivProps, "children" | "className">) {
  const animate = useMotionSafe();

  return (
    <motion.div
      variants={slideUpVariants}
      initial={animate ? "hidden" : false}
      animate="visible"
      transition={{
        duration: durationSeconds.moderate,
        delay: animate ? delay : 0,
        ease: easing.emphasized,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function PageTransition({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & Omit<MotionDivProps, "children" | "className">) {
  const animate = useMotionSafe();

  return (
    <motion.div
      variants={pageTransitionVariants}
      initial={animate ? "initial" : false}
      animate="animate"
      exit="exit"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHover({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & Omit<MotionDivProps, "children" | "className">) {
  const animate = useMotionSafe();

  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover={animate ? "hover" : undefined}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ButtonPress({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & Omit<MotionDivProps, "children" | "className">) {
  const animate = useMotionSafe();

  return (
    <motion.div
      variants={buttonPressVariants}
      initial="rest"
      whileTap={animate ? "press" : undefined}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CelebrateComplete({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const animate = useMotionSafe();

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 4 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={animate ? easing.spring : { duration: 0 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
