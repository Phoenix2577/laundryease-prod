"use client";

import { motion } from "framer-motion";

export function SkeletonCard() {
  return (
    <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-4 overflow-hidden">
      <div className="flex items-center gap-4">
        <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-12 h-12 rounded-xl bg-slate-800" />
        <div className="flex-1 space-y-2">
          <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }} className="h-4 w-3/4 rounded bg-slate-800" />
          <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="h-3 w-1/2 rounded bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-4">
          <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }} className="h-3 w-20 rounded bg-slate-800 mb-2" />
          <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 + 0.15 }} className="h-8 w-12 rounded bg-slate-800" />
        </div>
      ))}
    </div>
  );
}
