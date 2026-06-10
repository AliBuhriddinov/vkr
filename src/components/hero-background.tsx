"use client";

import { useEffect, useRef } from "react";

// Лёгкое псевдо-3D: поле точек с глубиной, спроецированное с перспективой,
// медленно движется на зрителя и реагирует на курсор (параллакс). Цвет берётся
// из токена --primary, поэтому совпадает с темой. Один canvas, без зависимостей.
export function HeroBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const focal = 300;
    const zNear = 40;
    const zFar = 620;
    const count = 80;

    let width = 0;
    let height = 0;
    let running = false;
    let raf = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const readColor = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim() || "#6e8cff";
    let primary = readColor();
    const themeObserver = new MutationObserver(() => {
      primary = readColor();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    type Particle = { x: number; y: number; z: number };
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: 0,
      y: 0,
      z: 0,
    }));

    function spawn(p: Particle, atFar: boolean) {
      p.x = (Math.random() * 2 - 1) * width;
      p.y = (Math.random() * 2 - 1) * height;
      p.z = atFar ? zFar : zNear + Math.random() * (zFar - zNear);
    }

    let seeded = false;
    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.max(1, Math.round(width * dpr));
      canvas!.height = Math.max(1, Math.round(height * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!seeded) {
        for (const p of particles) spawn(p, false);
        seeded = true;
      }
    }

    function render() {
      ctx!.clearRect(0, 0, width, height);
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      const cx = width / 2;
      const cy = height / 2;
      for (const p of particles) {
        if (!reduce) {
          p.z -= 0.5;
          if (p.z < zNear) spawn(p, true);
        }
        const scale = focal / p.z;
        const sx = cx + p.x * scale + mouse.x * 40 * scale * 0.12;
        const sy = cy + p.y * scale + mouse.y * 40 * scale * 0.12;
        if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) continue;
        const r = Math.max(0.4, scale * 1.8);
        ctx!.globalAlpha = Math.min(0.55, scale * 0.6);
        ctx!.fillStyle = primary;
        ctx!.beginPath();
        ctx!.arc(sx, sy, r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    function loop() {
      if (!running) return;
      render();
      raf = requestAnimationFrame(loop);
    }
    function start() {
      if (running || reduce) return;
      running = true;
      loop();
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }
    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    function onMouse(e: MouseEvent) {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    }

    resize();
    render();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={
        className ??
        "pointer-events-none absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black,transparent_85%)]"
      }
    />
  );
}
