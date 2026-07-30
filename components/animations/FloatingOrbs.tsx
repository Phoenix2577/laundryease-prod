"use client";

import { motion } from "framer-motion";

export function FloatingOrbs() {
  const orbs = [
    { size: 300, color: "rgba(139, 92, 246, 0.15)", x: "10%", y: "20%", duration: 20 },
    { size: 200, color: "rgba(59, 130, 246, 0.12)", x: "70%", y: "60%", duration: 25 },
    { size: 250, color: "rgba(236, 72, 153, 0.1)", x: "50%", y: "80%", duration: 22 },
    { size: 180, color: "rgba(6, 182, 212, 0.12)", x: "80%", y: "10%", duration: 18 },
    { size: 350, color: "rgba(124, 58, 237, 0.08)", x: "30%", y: "50%", duration: 28 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.color,
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            x: [0, 50, -30, 20, 0],
            y: [0, -40, 30, -20, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
