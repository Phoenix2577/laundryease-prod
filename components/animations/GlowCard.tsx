"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

export function GlowCard({ children, className = "" }: GlowCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`relative bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
