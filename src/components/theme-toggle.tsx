"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("theme");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const next = isDark ? "light" : "dark";
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || reduceMotion) {
      setTheme(next);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    // Тёмная тема — «чернила»: в тёмную растекаются из кнопки (новый слой сверху,
    // круг расширяется), обратно — втягиваются в кнопку (старый тёмный слой сверху,
    // круг сжимается), открывая светлое.
    const goingDark = next === "dark";
    const root = document.documentElement;
    root.setAttribute("data-theme-anim", goingDark ? "out" : "in");

    const transition = doc.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });

    transition.ready.then(() => {
      const grow = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      const animation = root.animate(
        { clipPath: goingDark ? grow : [...grow].reverse() },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: goingDark
            ? "::view-transition-new(root)"
            : "::view-transition-old(root)",
        },
      );
      animation.finished.finally(() => root.removeAttribute("data-theme-anim"));
    });
  }

  return (
    <Button variant="ghost" size="icon" aria-label={t("toggle")} onClick={toggle}>
      {mounted && isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
