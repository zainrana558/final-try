"use client";

import { motion } from "framer-motion";

export default function FramerPulse({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="fixed pointer-events-none"
          style={{
            left: `${20 + index * 30}%`,
            top: `${30 + index * 15}%`,
            width: "40px",
            height: "40px",
            zIndex: 1,
          }}
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5,
          }}
        />
      ))}
    </>
  );
}
