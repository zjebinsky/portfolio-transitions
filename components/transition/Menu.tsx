"use client";

import { motion, AnimatePresence } from "motion/react";
import { useTransition } from "./transition-context";
import { primaryRoutes, secondaryRoutes } from "@/lib/routes";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — Menu Links
 *
 * Easing philosophy (per animations.dev):
 *   - Links entering → ease-out (user-initiated, fast start)
 *   - Links exiting → ease-out, 20% faster than entrance
 *   - Stagger keeps under 300ms total for all links
 *
 * ── Appear (menu-opening) ──
 *    0ms   primary links stagger in (60ms apart), 200ms ease-out
 *  120ms   secondary links stagger in (40ms apart), 150ms ease-out
 *
 * ── Disappear (navigating / menu-closing) ──
 *    0ms   all links fade out (100ms ease-out — 20% faster exit)
 * ───────────────────────────────────────────────────────── */

/* ease-out-cubic: fast start, gentle settle — best for enter/exit */
const EASE_OUT = [0.215, 0.61, 0.355, 1];

/* Primary nav links (large, white) */
const PRIMARY = {
  offsetY:     20,       // px to slide up from (start from scale(0.95)-equivalent offset)
  stagger:     0.06,     // seconds between each link
  enterMs:     0.2,      // seconds — standard UI duration
  exitMs:      0.1,      // seconds — 20% faster exit
};

/* Secondary nav links (small, grey) */
const SECONDARY = {
  offsetY:     10,       // px to slide up from
  stagger:     0.04,     // seconds between each link
  baseDelay:   0.12,     // seconds after primary links start
  enterMs:     0.15,     // seconds — smaller elements animate faster
  exitMs:      0.1,      // seconds
};

export function Menu() {
  const { phase, isMenuOpen, navigateTo, closeMenu } = useTransition();
  const pathname = usePathname();

  // Keyboard: Escape closes menu
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && phase === "menu-open") {
        closeMenu();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, closeMenu]);

  const showLinks = phase === "menu-opening" || phase === "menu-open";

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-between py-12 md:py-20 pointer-events-none"
          style={{ zIndex: 30 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: PRIMARY.exitMs, ease: EASE_OUT } }}
        >
          {/* Primary links — top area */}
          <nav className="flex flex-col md:flex-row items-center gap-4 md:gap-12 pointer-events-auto">
            {primaryRoutes.map((route, i) => (
              <motion.button
                key={route.path}
                onClick={() => navigateTo(route.path)}
                className={`text-3xl md:text-5xl font-medium hover:opacity-70 ${
                  pathname === route.path ? "text-white" : "text-white/80"
                }`}
                style={{ willChange: "transform" }}
                initial={{ opacity: 0, y: PRIMARY.offsetY }}
                animate={
                  showLinks
                    ? {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: PRIMARY.enterMs,
                          ease: EASE_OUT,
                          delay: i * PRIMARY.stagger,
                        },
                      }
                    : {
                        opacity: 0,
                        y: PRIMARY.offsetY,
                        transition: {
                          duration: PRIMARY.exitMs,
                          ease: EASE_OUT,
                        },
                      }
                }
                exit={{
                  opacity: 0,
                  transition: { duration: PRIMARY.exitMs, ease: EASE_OUT },
                }}
              >
                {route.label}
              </motion.button>
            ))}
          </nav>

          {/* Secondary links — bottom area */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 max-w-lg pointer-events-auto">
            {secondaryRoutes.map((route, i) => (
              <motion.button
                key={route.path}
                onClick={() => navigateTo(route.path)}
                className={`text-sm hover:opacity-70 ${
                  pathname === route.path
                    ? "text-[var(--color-muted)]"
                    : "text-[var(--color-muted)]/70"
                }`}
                style={{ willChange: "transform" }}
                initial={{ opacity: 0, y: SECONDARY.offsetY }}
                animate={
                  showLinks
                    ? {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: SECONDARY.enterMs,
                          ease: EASE_OUT,
                          delay: SECONDARY.baseDelay + i * SECONDARY.stagger,
                        },
                      }
                    : {
                        opacity: 0,
                        y: SECONDARY.offsetY,
                        transition: {
                          duration: SECONDARY.exitMs,
                          ease: EASE_OUT,
                        },
                      }
                }
                exit={{
                  opacity: 0,
                  transition: { duration: SECONDARY.exitMs, ease: EASE_OUT },
                }}
              >
                {route.label}
              </motion.button>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
