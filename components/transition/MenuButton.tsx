"use client";

import { motion } from "motion/react";
import { useTransition } from "./transition-context";

export function MenuButton() {
  const { phase, isMenuOpen, openMenu, closeMenu } = useTransition();

  const handleClick = () => {
    if (phase === "menu-open") {
      closeMenu();
    } else if (phase === "idle") {
      openMenu();
    }
    // Ignore clicks during transitions
  };

  const barColor = isMenuOpen ? "bg-white" : "bg-black";
  const bgColor = isMenuOpen
    ? "bg-white/10 hover:bg-white/20"
    : "bg-black/5 hover:bg-black/10";

  return (
    <motion.button
      onClick={handleClick}
      className={`fixed top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-sm transition-colors ${bgColor}`}
      aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      whileTap={{ scale: 0.9 }}
    >
      <div className="relative w-5 h-4 flex flex-col justify-between">
        <motion.span
          className={`block h-[2px] w-full origin-center ${barColor}`}
          animate={
            isMenuOpen
              ? { rotate: 45, y: 7 }
              : { rotate: 0, y: 0 }
          }
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className={`block h-[2px] w-full ${barColor}`}
          animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.1 }}
        />
        <motion.span
          className={`block h-[2px] w-full origin-center ${barColor}`}
          animate={
            isMenuOpen
              ? { rotate: -45, y: -7 }
              : { rotate: 0, y: 0 }
          }
          transition={{ duration: 0.2 }}
        />
      </div>
    </motion.button>
  );
}
