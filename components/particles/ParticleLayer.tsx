"use client";

import { useMemo } from "react";
import Particles from "@tsparticles/react";
import type { ParticleConfig } from "@/lib/particles/configs";

interface ParticleLayerProps {
  config: ParticleConfig;
}

export default function ParticleLayer({ config }: ParticleLayerProps) {
  const options = useMemo(() => {
    // LUMINA: Check for reduced motion preference
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // LUMINA: Adjust config for reduced motion
    return prefersReducedMotion
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
  }, [config]);

  return (
    <Particles
      id={`particles-${config.type}`}
      options={options}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
