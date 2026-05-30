"use client";

import { useEffect, useRef } from "react";
import { tsParticles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ParticleConfig } from "@/lib/particles/configs";

interface ParticleLayerProps {
  config: ParticleConfig;
}

export default function ParticleLayer({ config }: ParticleLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // LUMINA: Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // LUMINA: Adjust config for reduced motion
    const adjustedConfig = prefersReducedMotion
      ? {
          ...config.particles,
          particles: {
            ...config.particles.particles,
            number: { value: 8, density: { enable: true, value_area: 800 } },
            opacity: { value: { min: 0.1, max: 0.15 }, animation: { enable: false } },
            move: {
              ...config.particles.particles.move,
              speed: { min: 0.2, max: 0.5 },
            },
          },
        }
      : config.particles;

    const initParticles = async () => {
      await loadSlim(tsParticles);

      particlesRef.current = await tsParticles.load({
        id: `particles-${config.type}`,
        element: containerRef.current,
        options: adjustedConfig,
      });
    };

    initParticles();

    // LUMINA: Pause particles when tab is not visible
    const handleVisibilityChange = () => {
      if (document.hidden && particlesRef.current) {
        particlesRef.current.pause();
      } else if (particlesRef.current) {
        particlesRef.current.play();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (particlesRef.current) {
        particlesRef.current.destroy();
      }
    };
  }, [config]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
