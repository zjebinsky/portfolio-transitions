"use client";

import { motion, AnimatePresence } from "motion/react";
import { useTransition } from "./transition-context";
import { primaryRoutes } from "@/lib/routes";
import { usePathname } from "next/navigation";

const EASE_OUT = [0.215, 0.61, 0.355, 1] as const;

export function NavBar() {
  const { phase, isFixed, openMenu, closeMenu, navigateTo, navigateDirect } =
    useTransition();
  const pathname = usePathname();

  const isTransitioning =
    phase === "menu-opening" ||
    phase === "menu-closing" ||
    phase === "menu-to-nav" ||
    phase === "navigating" ||
    phase === "scaling-up" ||
    phase === "direct-navigating" ||
    phase === "direct-scaling-up";

  const handleLinkClick = (path: string) => {
    if (isTransitioning) return;
    if (phase === "menu-open") {
      navigateTo(path);
    } else if (phase === "idle") {
      navigateDirect(path);
    }
  };

  const handleMenuClick = () => {
    if (isTransitioning) return;
    if (phase === "menu-open") {
      closeMenu();
    } else if (phase === "idle") {
      openMenu();
    }
  };

  const showClose =
    phase === "menu-opening" ||
    phase === "menu-open" ||
    phase === "menu-to-nav";

  const textColor = isFixed ? "text-white" : "text-black";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 grid grid-cols-12 transition-colors duration-300 ${textColor}`}
      style={{ padding: "0.857rem" }}
    >
      {/* Col 1: Name */}
      <div className="col-span-3">
        <button
          onClick={() => handleLinkClick("/")}
          className={`transition-opacity ${
            pathname === "/" ? "opacity-100" : "opacity-70 hover:opacity-100"
          }`}
        >
          Maciej &#x141;&#x119;&#x17C;ak
        </button>
      </div>

      {/* Col 4–11: Primary links */}
      <div className="col-span-8 flex items-center" style={{ gap: "0.857rem" }}>
        {primaryRoutes.map((route) => (
          <button
            key={route.path}
            onClick={() => handleLinkClick(route.path)}
            className={`transition-opacity ${
              pathname === route.path
                ? "opacity-100"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            {route.label}
          </button>
        ))}
      </div>

      {/* Col 12: Menu / Close — animated crossfade */}
      <div className="col-span-1 flex justify-end">
        <button
          onClick={handleMenuClick}
          className={`transition-opacity opacity-70 hover:opacity-100 relative`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={showClose ? "close" : "menu"}
              className="block"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.15, ease: EASE_OUT } }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.1, ease: EASE_OUT } }}
            >
              {showClose ? "Close" : "Menu"}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </nav>
  );
}
