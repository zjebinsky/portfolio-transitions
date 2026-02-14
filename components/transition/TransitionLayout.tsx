"use client";

import { type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useDialKit } from "dialkit";
import { useTransition } from "./transition-context";
import { Menu } from "./Menu";
import { MenuButton } from "./MenuButton";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — Page Transitions (Genie Effect)
 *
 * Easing philosophy (per animations.dev):
 *   - Enter/exit transitions → ease-out (fast start, settled end)
 *   - On-screen movement (scale up/down) → spring (interruptible)
 *   - Backdrop fade → ease-out, paired with page transition
 *
 * ── Open Menu (idle → menu-opening → menu-open) ──
 *    0ms   capture scrollY, clip page to 100vh, offset content
 *    0ms   page scales 1 → 0.33 via spring (interruptible)
 *  ~500ms  page settles, menu links stagger in
 *
 * ── Navigate (menu-open → navigating → scaling-up → idle) ──
 *    0ms   menu links fade out (100ms ease-out)
 *    0ms   old page: genie warp down — 600ms ease-out-quint
 *    0ms   new page: genie warp in — 600ms ease-out-quint
 *  600ms   exit completes → "scaling-up"
 *  600ms   new page scales 0.33 → 1 — spring (interruptible)
 * ~1000ms  scale-up completes → idle
 *
 * ── Close Menu (menu-open → menu-closing → idle) ──
 *    0ms   page scales 0.33 → 1 via spring
 *  ~500ms  restore scroll, switch to relative
 *
 * All values tunable via DialKit panel (top-left).
 * ───────────────────────────────────────────────────────── */

/* Easing curves (animations.dev / Emil Kowalski) */
const EASE_OUT_QUINT = [0.23, 1, 0.32, 1] as const;
const EASE_OUT_QUART = [0.165, 0.84, 0.44, 1] as const;

export function TransitionLayout({ children }: { children: ReactNode }) {
  const { phase, savedScrollY, onPhaseComplete } = useTransition();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  /* ── DialKit: live-tunable animation params ── */
  const page = useDialKit("Page", {
    scaleDown:    [0.33, 0.1, 0.8],
    radiusOpen:   [12, 0, 40],
    spring: {
      type: "spring" as const,
      duration: 0.5,
      bounce: 0.15,
    },
  });

  const genie = useDialKit("Genie", {
    rotateX:     [25, 0, 60],
    scaleX:      [0.6, 0.2, 1],
    perspective: [1200, 400, 3000],
    duration:    [0.6, 0.2, 1.5],
  });

  const scaleUp = useDialKit("Scale Up", {
    spring: {
      type: "spring" as const,
      duration: 0.5,
      bounce: 0.1,
    },
  });

  // Container stays fixed for all non-idle phases
  const isOpen = phase !== "idle";

  // Page stays scaled down during these phases
  const isScaledDown =
    phase === "menu-opening" ||
    phase === "menu-open" ||
    phase === "navigating";

  // Duration-based ease-out for enter/exit (predetermined, not interruptible)
  const genieTransition = {
    duration: genie.duration,
    ease: EASE_OUT_QUINT as unknown as number[],
  };

  // Backdrop matches page transition timing (paired elements rule)
  const backdropTransition = {
    duration: isOpen ? 0.3 : 0.25,
    ease: EASE_OUT_QUART as unknown as number[],
  };

  return (
    <>
      {/* Black backdrop — paired with page, same easing family */}
      <motion.div
        className="fixed inset-0 bg-black"
        style={{ zIndex: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={backdropTransition}
      />

      {/* Menu overlay (z-30) */}
      <Menu />

      {/* Page shell (z-10) — perspective container for genie 3D */}
      <div
        className={`origin-center ${
          isOpen ? "fixed inset-0 overflow-hidden" : "relative min-h-screen"
        }`}
        style={{
          zIndex: 10,
          perspective: genie.perspective,
        }}
      >
        <AnimatePresence
          mode="popLayout"
          onExitComplete={() => {
            if (phase === "navigating") {
              onPhaseComplete("navigating");
            }
          }}
        >
          <motion.div
            key={pathname}
            className="bg-[var(--color-bg)]"
            style={{
              willChange: "transform",
              height: isOpen ? "100vh" : "auto",
              minHeight: "100vh",
              overflow: isOpen ? "hidden" : "visible",
              transformOrigin: "center center",
            }}
            /* ── Initial: new page warps in from above ── */
            initial={
              shouldReduceMotion
                ? false
                : phase === "navigating"
                  ? {
                      y: "-110vh",
                      scale: page.scaleDown,
                      scaleX: genie.scaleX,
                      rotateX: -genie.rotateX,
                      borderRadius: page.radiusOpen,
                      transformOrigin: "top center",
                    }
                  : false
            }
            /* ── Animate ── */
            animate={{
              y: 0,
              scale:        isScaledDown ? page.scaleDown : 1,
              scaleX:       1,
              rotateX:      0,
              borderRadius: isScaledDown ? page.radiusOpen : 0,
              transformOrigin: "center center",
              transition:
                phase === "navigating"
                  ? genieTransition                    // ease-out for enter
                  : phase === "scaling-up"
                    ? scaleUp.spring                   // spring for scale-up
                    : page.spring,                     // spring for menu open/close
            }}
            /* ── Exit: old page genie-warps down (ease-out) ── */
            exit={{
              y:               "110vh",
              scale:           page.scaleDown,
              scaleX:          genie.scaleX,
              rotateX:         genie.rotateX,
              borderRadius:    page.radiusOpen,
              transformOrigin: "bottom center",
              transition:      genieTransition,
            }}
            onAnimationComplete={() => {
              if (phase === "menu-opening") {
                onPhaseComplete("menu-opening");
              } else if (phase === "menu-closing") {
                onPhaseComplete("menu-closing");
              } else if (phase === "scaling-up") {
                onPhaseComplete("scaling-up");
              }
            }}
          >
            <div
              style={{
                transform:
                  isOpen && phase !== "scaling-up"
                    ? `translateY(-${savedScrollY}px)`
                    : "none",
              }}
            >
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Menu button (z-50) */}
      <MenuButton />
    </>
  );
}
