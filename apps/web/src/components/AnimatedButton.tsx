"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import clsx from "clsx";

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary";
}

export default function AnimatedButton({
  children,
  variant = "primary",
  className,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={clsx(
        "rounded-2xl px-6 py-3 font-semibold shadow-md transition-colors",
        variant === "primary" &&
          "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
        variant === "secondary" &&
          "bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
