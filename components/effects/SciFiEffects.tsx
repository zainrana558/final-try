"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SciFiEffects({ accentColor = "#00D4FF" }: { accentColor?: string }) {
  const scanLineRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!scanLineRef.current) return;

    // LUMINA: Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return;
    }

    // LUMINA: Create horizontal scan line animation
    const tl = gsap.timeline({ repeat: -1 });
    timelineRef.current = tl;

    tl.to(scanLineRef.current, {
      y: "105vh",
      duration: 4,
      ease: "none",
    }).set(scanLineRef.current, { y: "-5%" });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return (
    <>
      {/* LUMINA: CSS Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage: `
            linear-gradient(${accentColor}33 1px, transparent 1px),
            linear-gradient(90deg, ${accentColor}33 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* LUMINA: GSAP horizontal scan line */}
      <div
        ref={scanLineRef}
        className="fixed left-0 right-0 pointer-events-none"
        style={{
          zIndex: 1,
          height: "1px",
          background: `linear-gradient(to right, transparent, ${accentColor}4D, transparent)`,
          y: "-5%",
          opacity: 0.6,
        }}
      />
    </>
  );
}
