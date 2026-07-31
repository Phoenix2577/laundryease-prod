"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Shirt, WashingMachine, Sparkles, Droplets, Wind,
  ShirtIcon, Scissors, Ruler, Tag
} from "lucide-react";

const laundryItems = [
  { icon: Shirt, color: "text-purple-400", size: "w-12 h-12", startX: "10%", startY: "10%" },
  { icon: Sparkles, color: "text-cyan-400", size: "w-10 h-10", startX: "80%", startY: "15%" },
  { icon: Droplets, color: "text-blue-400", size: "w-14 h-14", startX: "20%", startY: "70%" },
  { icon: Wind, color: "text-emerald-400", size: "w-11 h-11", startX: "75%", startY: "65%" },
  { icon: ShirtIcon, color: "text-amber-400", size: "w-13 h-13", startX: "45%", startY: "20%" },
  { icon: Scissors, color: "text-rose-400", size: "w-9 h-9", startX: "60%", startY: "80%" },
  { icon: Ruler, color: "text-violet-400", size: "w-10 h-10", startX: "30%", startY: "85%" },
  { icon: Tag, color: "text-pink-400", size: "w-8 h-8", startX: "85%", startY: "40%" },
  { icon: WashingMachine, color: "text-teal-400", size: "w-16 h-16", startX: "50%", startY: "50%" },
];

export default function OpeningPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"fly-in" | "assemble" | "wash" | "done">("fly-in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("assemble"), 2000);
    const t2 = setTimeout(() => setPhase("wash"), 3500);
    const t3 = setTimeout(() => {
      setPhase("done");
      router.push("/login");
    }, 5500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950" />
      
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase !== "done" && (
          <motion.div
            key="opening"
            className="relative z-10"
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.8 } }}
          >
            <motion.div
              className="relative"
              animate={phase === "wash" ? {
                scale: [1, 1.5, 2, 3],
                opacity: [1, 1, 0.5, 0],
              } : {}}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <motion.div
                animate={phase === "assemble" ? {
                  rotate: [0, -10, 10, -10, 0],
                } : phase === "wash" ? {
                  rotate: [0, 360, 720],
                } : {}}
                transition={{ duration: phase === "wash" ? 2 : 0.5 }}
              >
                <WashingMachine className="w-24 h-24 text-purple-400 mx-auto" />
              </motion.div>
              
              {phase === "wash" && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-4 h-4 rounded-full border-2 border-cyan-400/50"
                      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                      animate={{ 
                        x: (Math.random() - 0.5) * 300,
                        y: -200 - Math.random() * 200,
                        scale: [0, 1.5, 0],
                        opacity: [1, 0.5, 0],
                      }}
                      transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                      style={{ left: "50%", top: "50%" }}
                    />
                  ))}
                </>
              )}
            </motion.div>

            {laundryItems.map((item, index) => {
              const Icon = item.icon;
              const isCenter = index === laundryItems.length - 1;
              return (
                <motion.div
                  key={index}
                  className={`absolute ${item.color}`}
                  style={{ left: item.startX, top: item.startY, transform: "translate(-50%, -50%)" }}
                  initial={{ opacity: 0, scale: 0, x: (Math.random() - 0.5) * 500, y: (Math.random() - 0.5) * 500, rotate: Math.random() * 360 }}
                  animate={
                    phase === "fly-in" ? {
                      opacity: 1, scale: 1, x: 0, y: 0, rotate: 0,
                    } : phase === "assemble" ? {
                      x: isCenter ? 0 : (50 - parseInt(item.startX)) * 2,
                      y: isCenter ? 0 : (50 - parseInt(item.startY)) * 2,
                      scale: isCenter ? 1 : 0.6,
                      opacity: isCenter ? 1 : 0.3,
                    } : phase === "wash" ? {
                      scale: 0, opacity: 0, x: 0, y: 0,
                    } : {}
                  }
                  transition={{ 
                    duration: phase === "fly-in" ? 1.5 : phase === "assemble" ? 0.8 : 0.5,
                    delay: phase === "fly-in" ? index * 0.15 : 0,
                    ease: "easeOut",
                  }}
                >
                  <Icon className={item.size} />
                </motion.div>
              );
            })}

            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={phase === "assemble" ? { opacity: 1, y: 0 } : phase === "wash" ? { opacity: 0, scale: 0.5 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold text-white tracking-tight">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  LaundryEase
                </span>
              </h1>
              <p className="text-slate-400 mt-2 text-sm">Fresh clothes, effortless</p>
            </motion.div>

            {phase === "wash" && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 2], opacity: [0, 0.3, 0] }}
                transition={{ duration: 1.5 }}
              >
                <div className="w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
