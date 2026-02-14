"use client";

import { motion, AnimatePresence } from "motion/react";
import { useTransition } from "./transition-context";
import { secondaryRoutes } from "@/lib/routes";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const EASE_OUT = [0.215, 0.61, 0.355, 1] as const;

const SECONDARY = {
  offsetY:   10,
  stagger:   0.04,
  enterMs:   0.15,
  exitMs:    0.1,
};

export function Menu() {
  const { phase, navigateTo, closeMenu } = useTransition();
  const pathname = usePathname();

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

  const showMenu =
    phase === "menu-opening" ||
    phase === "menu-open" ||
    phase === "menu-to-nav" ||
    phase === "menu-closing";

  return (
    <AnimatePresence>
      {showMenu && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 grid grid-cols-12 items-end pointer-events-none"
          style={{ zIndex: 30, padding: "0.857rem" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: SECONDARY.exitMs, ease: EASE_OUT } }}
        >
          {/* Col 1–3: Copyright */}
          <div className="col-span-3 pointer-events-auto">
            <motion.span
              className="text-white/50"
              initial={{ opacity: 0, y: SECONDARY.offsetY }}
              animate={
                showLinks
                  ? { opacity: 1, y: 0, transition: { duration: SECONDARY.enterMs, ease: EASE_OUT } }
                  : { opacity: 0, y: SECONDARY.offsetY, transition: { duration: SECONDARY.exitMs, ease: EASE_OUT } }
              }
              exit={{ opacity: 0, transition: { duration: SECONDARY.exitMs, ease: EASE_OUT } }}
            >
              &copy; 2026
            </motion.span>
          </div>

          {/* Col 4–11: Secondary links */}
          <div className="col-span-8 flex flex-wrap items-center pointer-events-auto" style={{ gap: "0.857rem" }}>
            {secondaryRoutes.map((route, i) => (
              <motion.button
                key={route.path}
                onClick={() => navigateTo(route.path)}
                className={`hover:opacity-100 transition-opacity ${
                  pathname === route.path
                    ? "text-white"
                    : "text-white/50"
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
                          delay: i * SECONDARY.stagger,
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
          </div>

          {/* Col 12: Language switcher */}
          <div className="col-span-1 flex justify-end pointer-events-auto">
            <motion.div
              className="flex items-center"
              style={{ gap: "0.429rem" }}
              initial={{ opacity: 0, y: SECONDARY.offsetY }}
              animate={
                showLinks
                  ? { opacity: 1, y: 0, transition: { duration: SECONDARY.enterMs, ease: EASE_OUT, delay: 0.08 } }
                  : { opacity: 0, y: SECONDARY.offsetY, transition: { duration: SECONDARY.exitMs, ease: EASE_OUT } }
              }
              exit={{ opacity: 0, transition: { duration: SECONDARY.exitMs, ease: EASE_OUT } }}
            >
              <button className="text-white transition-opacity hover:opacity-100">
                English
              </button>
              <span className="text-white/30">/</span>
              <button className="text-white/50 transition-opacity hover:opacity-100">
                Polski
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
