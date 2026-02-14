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
  | "menu-to-nav"
  | "navigating"
  | "scaling-up"
  | "menu-closing"
  | "direct-navigating"
  | "direct-scaling-up";

interface TransitionContextValue {
  phase: TransitionPhase;
  isMenuOpen: boolean;
  isFixed: boolean;
  targetPath: string | null;
  savedScrollY: number;
  openMenu: () => void;
  closeMenu: () => void;
  navigateTo: (path: string) => void;
  navigateDirect: (path: string) => void;
  onPhaseComplete: (completedPhase: TransitionPhase) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const scrollYRef = useRef(0);
  const targetPathRef = useRef<string | null>(null);
  const [savedScrollY, setSavedScrollY] = useState(0);

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

  // Type A: Direct navigation from inline nav links (idle → direct-navigating → direct-scaling-up → idle)
  const navigateDirect = useCallback(
    (path: string) => {
      if (phase !== "idle") return;
      if (path === pathname) return;
      const y = window.scrollY;
      scrollYRef.current = y;
      setSavedScrollY(y);
      document.body.classList.add("menu-open");
      targetPathRef.current = path;
      setTargetPath(path);
      setPhase("direct-navigating");
      router.push(path);
    },
    [phase, pathname, router]
  );

  // Type B: Navigation from menu (menu-open → menu-to-nav → navigating → scaling-up → idle)
  // Defers router.push until menu-to-nav animation completes (0.33 → 0.80)
  const navigateTo = useCallback(
    (path: string) => {
      if (phase !== "menu-open") return;
      if (path === pathname) {
        setPhase("menu-closing");
        return;
      }
      targetPathRef.current = path;
      setTargetPath(path);
      setPhase("menu-to-nav");
    },
    [phase, pathname]
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
        case "menu-to-nav":
          // Scaled from 0.33 → 0.80, now push route and start genie swap
          if (targetPathRef.current) {
            router.push(targetPathRef.current);
          }
          setPhase("navigating");
          break;
        case "direct-navigating":
          // Old page exited at 0.80 scale, new page entering
          setPhase("direct-scaling-up");
          break;
        case "navigating":
          // Old page has exited, new page is at 0.80 scale
          setPhase("scaling-up");
          break;
        case "direct-scaling-up":
        case "scaling-up":
          // New page has finished scaling to 1
          document.body.classList.remove("menu-open");
          targetPathRef.current = null;
          setTargetPath(null);
          setPhase("idle");
          requestAnimationFrame(() => {
            window.scrollTo(0, 0);
          });
          break;
      }
    },
    [router]
  );

  const isMenuOpen =
    phase === "menu-opening" ||
    phase === "menu-open" ||
    phase === "menu-to-nav" ||
    phase === "navigating" ||
    phase === "scaling-up" ||
    phase === "menu-closing";

  const isFixed = phase !== "idle";

  return (
    <TransitionContext.Provider
      value={{
        phase,
        isMenuOpen,
        isFixed,
        targetPath,
        savedScrollY,
        openMenu,
        closeMenu,
        navigateTo,
        navigateDirect,
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
