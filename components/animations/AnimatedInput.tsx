"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface AnimatedInputProps {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
}

export function AnimatedInput({ type = "text", placeholder, value, onChange, icon }: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="relative"
      animate={{
        scale: isFocused ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      {icon && (
        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10"
          animate={{
            color: isFocused ? "rgba(139, 92, 246, 0.8)" : "rgba(100, 116, 139, 1)",
          }}
        >
          {icon}
        </motion.div>
      )}
      <motion.input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full px-4 ${icon ? 'pl-12' : ''} py-4 rounded-xl bg-slate-900/60 border-2 text-white placeholder-slate-500 outline-none transition-all ${
          isFocused 
            ? 'border-purple-500/50 shadow-[0_0_20px_rgba(139,92,246,0.2)] bg-slate-800/60' 
            : 'border-slate-700/30'
        }`}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500"
        initial={{ width: 0, x: "-50%" }}
        animate={{
          width: isFocused ? "100%" : "0%",
          x: "-50%",
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
