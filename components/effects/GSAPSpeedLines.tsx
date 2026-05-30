"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function GSAPSpeedLines({ accentColor = "#E50914" }: { accentColor?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // LUMINA: Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return;
    }

    // LUMINA: Create 8 speed lines
    const lines = linesRef.current;
    const tl = gsap.timeline({ repeat: -1 });
    timelineRef.current = tl;

    // Animate each line
    lines.forEach((line, index) => {
      const duration = gsap.utils.random(0.4, 0.8);
      tl.to(line, {
        y: "110vh",
        duration: duration,
        ease: "none",
      }, index * 0.1); // Stagger each line
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el) linesRef.current[index] = el;
          }}
          className="fixed"
          style={{
            left: `${Math.random() * 100}%`,
            width: "1px",
            height: `${Math.random() * 60 + 60}px`,
            background: accentColor,
            opacity: 0.15,
            y: "-120px",
          }}
        />
      ))}
    </div>
  );
}
