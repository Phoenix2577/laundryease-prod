"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({
  children,
  className = "",
  glowColor = "rgba(124, 58, 237, 0.3)",
}: GlowCardProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-700/50 backdrop-blur-sm ${className}`}
      whileHover={{
        scale: 1.02,
        borderColor: "rgba(124, 58, 237, 0.5)",
        boxShadow: `0 0 30px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.1)`,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
