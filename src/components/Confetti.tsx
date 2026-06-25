import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface HeartParticle {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  color: string;
  duration: number;
  horizontalDrift: number;
}

export interface ConfettiRef {
  burst: (x?: number, y?: number) => void;
}

const HEART_COLORS = [
  "#f43f5e", // rose-500
  "#ec4899", // pink-500
  "#f472b6", // pink-400
  "#fda4af", // rose-300
  "#fb7185", // rose-400
  "#fbbf24", // amber-400 (gold accents)
];

export const Confetti = forwardRef<ConfettiRef, {}>((_, ref) => {
  const [particles, setParticles] = useState<HeartParticle[]>([]);

  const burst = (x?: number, y?: number) => {
    const originX = x ?? window.innerWidth / 2;
    const originY = y ?? window.innerHeight / 2;

    const newParticles: HeartParticle[] = Array.from({ length: 20 }).map((_, i) => {
      const id = Date.now() + Math.random() + i;
      const angle = (Math.random() * 360 * Math.PI) / 180;
      const distance = 40 + Math.random() * 120;
      const scale = 0.4 + Math.random() * 0.8;
      const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
      const duration = 1.5 + Math.random() * 1.5;
      const horizontalDrift = -100 + Math.random() * 200;

      return {
        id,
        x: originX,
        y: originY,
        angle,
        scale,
        color,
        duration,
        horizontalDrift,
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);
  };

  useImperativeHandle(ref, () => ({
    burst,
  }));

  // Automatically clean up old particles
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setParticles((prev) => prev.filter((p) => now - p.id < 3000));
    }, 1000);
    return () => clearInterval(interval);
  }, [particles]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => {
          const targetY = p.y - (150 + Math.random() * 250);
          const targetX = p.x + p.horizontalDrift;

          return (
            <motion.svg
              key={p.id}
              initial={{
                x: p.x - 12,
                y: p.y - 12,
                scale: 0,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                x: targetX,
                y: targetY,
                scale: [0, p.scale, p.scale * 0.8, 0],
                opacity: [1, 1, 0.8, 0],
                rotate: p.angle * (180 / Math.PI) + (Math.random() * 90 - 45),
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: p.duration,
                ease: "easeOut",
              }}
              className="absolute w-6 h-6"
              viewBox="0 0 24 24"
              fill={p.color}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </motion.svg>
          );
        })}
      </AnimatePresence>
    </div>
  );
});

Confetti.displayName = "Confetti";
