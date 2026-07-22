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
  return !prefersReduced;
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

  if (!animate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: durationSeconds.moderate,
        delay,
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

  if (!animate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={slideUpVariants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: durationSeconds.moderate,
        delay,
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

  if (!animate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
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

  if (!animate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
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

  if (!animate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={buttonPressVariants}
      initial="rest"
      whileTap="press"
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

  if (!animate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={easing.spring}
      className={className}
    >
      {children}
    </motion.div>
  );
}
