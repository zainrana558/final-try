"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function GSAPVignette() {
  const vignetteRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!vignetteRef.current) return;

    // LUMINA: Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return;
    }

    // LUMINA: Create flickering vignette effect
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    timelineRef.current = tl;

    tl.to(vignetteRef.current, {
      opacity: 0.7,
      duration: gsap.utils.random(0.08, 0.3),
      ease: "power1.inOut",
    }).to(vignetteRef.current, {
      opacity: 1.0,
      duration: gsap.utils.random(0.08, 0.3),
      ease: "power1.inOut",
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return (
    <div
      ref={vignetteRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.85) 100%)",
      }}
    />
  );
}
