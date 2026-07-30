"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function ClickRippleProvider({ children }: { children: React.ReactNode }) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; angle: number; distance: number }>>([]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    // Add ripple
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1000);

    // Add particles
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: id + i,
      x,
      y,
      angle: (i * 30) + Math.random() * 20,
      distance: 50 + Math.random() * 100,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1500);
  }, []);

  return (
    <div onClick={handleClick} className="relative overflow-hidden">
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ width: 0, height: 0, opacity: 0.6 }}
            animate={{ width: 400, height: 400, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: ripple.x - 200,
              top: ripple.y - 200,
              borderRadius: "50%",
              border: "2px solid rgba(139, 92, 246, 0.5)",
              pointerEvents: "none",
            }}
          />
        ))}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: particle.x, 
              y: particle.y, 
              scale: 1, 
              opacity: 1 
            }}
            animate={{ 
              x: particle.x + Math.cos((particle.angle * Math.PI) / 180) * particle.distance,
              y: particle.y + Math.sin((particle.angle * Math.PI) / 180) * particle.distance,
              scale: 0,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: `hsl(${260 + Math.random() * 60}, 70%, 60%)`,
              boxShadow: `0 0 10px hsl(${260 + Math.random() * 60}, 70%, 60%)`,
              pointerEvents: "none",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
