"use client";

import { type ReactNode, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useTransition } from "./transition-context";
import { Menu } from "./Menu";
import { NavBar } from "./NavBar";

const EASE_OUT_QUINT = [0.23, 1, 0.32, 1] as const;
const EASE_OUT_QUART = [0.165, 0.84, 0.44, 1] as const;

const GRID_PADDING_REM = 0.857;
const GRID_COLUMNS = 12;
const PREVIEW_SPAN = 6;

function useMenuScale() {
  const calcScale = useCallback(() => {
    if (typeof window === "undefined") return 0.5;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const padding = GRID_PADDING_REM * rem;
    return (PREVIEW_SPAN / GRID_COLUMNS) * (window.innerWidth - padding * 2) / window.innerWidth;
  }, []);
  const [scale, setScale] = useState(calcScale);
  useEffect(() => {
    const update = () => setScale(calcScale());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [calcScale]);
  return scale;
}

const SCALE_MENU = 0.33; // fallback, overridden by useMenuScale
const SCALE_NAV = 0.8;
const RADIUS_OPEN = 12;
const GENIE_ROTATE_X = 25;
const GENIE_SCALE_X = 0.6;
const GENIE_PERSPECTIVE = 1200;
const GENIE_DURATION = 0.6;

const PAGE_SPRING = { type: "spring" as const, duration: 0.5, bounce: 0.15 };
const SCALE_UP_SPRING = { type: "spring" as const, duration: 0.5, bounce: 0.1 };

export function TransitionLayout({ children }: { children: ReactNode }) {
  const { phase, isFixed, savedScrollY, onPhaseComplete } = useTransition();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const scaleMenu = useMenuScale();

  const getTargetScale = () => {
    switch (phase) {
      case "menu-opening":
      case "menu-open":
        return scaleMenu;
      case "menu-to-nav":
      case "direct-navigating":
      case "navigating":
        return SCALE_NAV;
      case "direct-scaling-up":
      case "scaling-up":
      case "idle":
      default:
        return 1;
    }
  };

  const targetScale = getTargetScale();
  const isScaledDown = targetScale < 1;

  const genieTransition = {
    duration: GENIE_DURATION,
    ease: EASE_OUT_QUINT as [number, number, number, number],
  };

  const getAnimateTransition = () => {
    switch (phase) {
      case "navigating":
      case "direct-navigating":
        return genieTransition;
      case "scaling-up":
      case "direct-scaling-up":
        return SCALE_UP_SPRING;
      default:
        return PAGE_SPRING;
    }
  };

  const backdropOpacity = (() => {
    if (phase === "idle") return 0;
    if (phase === "direct-navigating" || phase === "direct-scaling-up") return 0.6;
    return 1;
  })();

  const backdropTransition = {
    duration: isFixed ? 0.3 : 0.25,
    ease: EASE_OUT_QUART as [number, number, number, number],
  };

  const isEnteringPage =
    phase === "navigating" || phase === "direct-navigating";

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black"
        style={{ zIndex: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: backdropOpacity }}
        transition={backdropTransition}
      />

      <Menu />

      <div
        className={`origin-center ${
          isFixed ? "fixed inset-0 overflow-hidden" : "relative min-h-screen"
        }`}
        style={{
          zIndex: 10,
          perspective: GENIE_PERSPECTIVE,
        }}
      >
        <AnimatePresence
          mode="popLayout"
          onExitComplete={() => {
            if (phase === "navigating") {
              onPhaseComplete("navigating");
            } else if (phase === "direct-navigating") {
              onPhaseComplete("direct-navigating");
            }
          }}
        >
          <motion.div
            key={pathname}
            className="bg-[var(--color-bg)]"
            style={{
              willChange: "transform",
              height: isFixed ? "100vh" : "auto",
              minHeight: "100vh",
              overflow: isFixed ? "hidden" : "visible",
              transformOrigin: "center center",
            }}
            initial={
              shouldReduceMotion
                ? false
                : isEnteringPage
                  ? {
                      y: "-110vh",
                      scale: SCALE_NAV,
                      scaleX: GENIE_SCALE_X,
                      rotateX: -GENIE_ROTATE_X,
                      borderRadius: RADIUS_OPEN,
                      transformOrigin: "top center",
                    }
                  : false
            }
            animate={{
              y: 0,
              scale:        targetScale,
              scaleX:       1,
              rotateX:      0,
              borderRadius: isScaledDown ? RADIUS_OPEN : 0,
              transformOrigin: "center center",
              transition:   getAnimateTransition(),
            }}
            exit={{
              y:               "110vh",
              scale:           SCALE_NAV,
              scaleX:          GENIE_SCALE_X,
              rotateX:         GENIE_ROTATE_X,
              borderRadius:    RADIUS_OPEN,
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
              } else if (phase === "direct-scaling-up") {
                onPhaseComplete("direct-scaling-up");
              } else if (phase === "menu-to-nav") {
                onPhaseComplete("menu-to-nav");
              }
            }}
          >
            <div
              style={{
                transform:
                  isFixed && phase !== "scaling-up" && phase !== "direct-scaling-up"
                    ? `translateY(-${savedScrollY}px)`
                    : "none",
              }}
            >
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <NavBar />
    </>
  );
}
