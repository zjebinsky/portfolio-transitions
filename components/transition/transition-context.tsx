"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { allRoutes } from "@/lib/routes";

export type TransitionPhase =
  | "idle"
  | "menu-opening"
  | "menu-open"
  | "navigating"
  | "scaling-up"
  | "menu-closing";

interface TransitionContextValue {
  phase: TransitionPhase;
  isMenuOpen: boolean;
  targetPath: string | null;
  savedScrollY: number;
  openMenu: () => void;
  closeMenu: () => void;
  navigateTo: (path: string) => void;
  onPhaseComplete: (completedPhase: TransitionPhase) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const scrollYRef = useRef(0);
  const [savedScrollY, setSavedScrollY] = useState(0);

  // Prefetch all routes on mount so pages are ready for instant transitions
  useEffect(() => {
    allRoutes.forEach((route) => router.prefetch(route.path));
  }, [router]);

  const openMenu = useCallback(() => {
    if (phase !== "idle") return;
    const y = window.scrollY;
    scrollYRef.current = y;
    setSavedScrollY(y);
    document.body.classList.add("menu-open");
    setPhase("menu-opening");
  }, [phase]);

  const closeMenu = useCallback(() => {
    if (phase !== "menu-open") return;
    setPhase("menu-closing");
  }, [phase]);

  const navigateTo = useCallback(
    (path: string) => {
      if (phase !== "menu-open") return;
      if (path === pathname) {
        setPhase("menu-closing");
        return;
      }
      setTargetPath(path);
      setPhase("navigating");
      router.push(path);
    },
    [phase, pathname, router]
  );

  const onPhaseComplete = useCallback(
    (completedPhase: TransitionPhase) => {
      switch (completedPhase) {
        case "menu-opening":
          setPhase("menu-open");
          break;
        case "menu-closing": {
          document.body.classList.remove("menu-open");
          const savedY = scrollYRef.current;
          setPhase("idle");
          requestAnimationFrame(() => {
            window.scrollTo(0, savedY);
          });
          break;
        }
        case "navigating":
          // Old page has exited, new page is at 0.33 scale
          // Now scale up while keeping fixed positioning
          setPhase("scaling-up");
          break;
        case "scaling-up":
          // New page has finished scaling to 1
          document.body.classList.remove("menu-open");
          setTargetPath(null);
          setPhase("idle");
          requestAnimationFrame(() => {
            window.scrollTo(0, 0);
          });
          break;
      }
    },
    []
  );

  const isMenuOpen =
    phase === "menu-opening" ||
    phase === "menu-open" ||
    phase === "navigating" ||
    phase === "scaling-up" ||
    phase === "menu-closing";

  return (
    <TransitionContext.Provider
      value={{
        phase,
        isMenuOpen,
        targetPath,
        savedScrollY,
        openMenu,
        closeMenu,
        navigateTo,
        onPhaseComplete,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransition must be used within TransitionProvider");
  return ctx;
}
