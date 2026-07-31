"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Shirt, Sparkles, Droplets, Wind, ShirtIcon, Scissors,
  Ruler, Tag, WashingMachine, Timer, Zap, Waves, SprayCan,
  Sun, CloudRain, Thermometer, Shirt as Shirt2, Heart,
  Star, CircleDot, Hexagon, Triangle, Diamond
} from "lucide-react";

const laundryItems = [
  { icon: Shirt, color: "text-purple-400", size: "w-10 h-10", startX: "8%", startY: "12%", delay: 0 },
  { icon: Sparkles, color: "text-cyan-400", size: "w-8 h-8", startX: "85%", startY: "8%", delay: 0.1 },
  { icon: Droplets, color: "text-blue-400", size: "w-12 h-12", startX: "15%", startY: "75%", delay: 0.2 },
  { icon: Wind, color: "text-emerald-400", size: "w-9 h-9", startX: "78%", startY: "70%", delay: 0.3 },
  { icon: Scissors, color: "text-rose-400", size: "w-7 h-7", startX: "65%", startY: "85%", delay: 0.4 },
  { icon: Ruler, color: "text-violet-400", size: "w-8 h-8", startX: "25%", startY: "88%", delay: 0.5 },
  { icon: Tag, color: "text-pink-400", size: "w-6 h-6", startX: "90%", startY: "35%", delay: 0.6 },
  { icon: Timer, color: "text-amber-400", size: "w-10 h-10", startX: "5%", startY: "45%", delay: 0.7 },
  { icon: Zap, color: "text-yellow-400", size: "w-8 h-8", startX: "92%", startY: "55%", delay: 0.8 },
  { icon: Waves, color: "text-teal-400", size: "w-11 h-11", startX: "40%", startY: "5%", delay: 0.9 },
  { icon: SprayCan, color: "text-indigo-400", size: "w-9 h-9", startX: "55%", startY: "92%", delay: 1.0 },
  { icon: Sun, color: "text-orange-400", size: "w-10 h-10", startX: "70%", startY: "15%", delay: 1.1 },
  { icon: CloudRain, color: "text-sky-400", size: "w-8 h-8", startX: "30%", startY: "18%", delay: 1.2 },
  { icon: Thermometer, color: "text-red-400", size: "w-7 h-7", startX: "82%", startY: "80%", delay: 1.3 },
  { icon: Heart, color: "text-rose-300", size: "w-6 h-6", startX: "12%", startY: "60%", delay: 1.4 },
  { icon: Star, color: "text-amber-300", size: "w-8 h-8", startX: "48%", startY: "8%", delay: 1.5 },
  { icon: CircleDot, color: "text-lime-400", size: "w-6 h-6", startX: "60%", startY: "78%", delay: 1.6 },
  { icon: Hexagon, color: "text-fuchsia-400", size: "w-7 h-7", startX: "35%", startY: "82%", delay: 1.7 },
  { icon: Triangle, color: "text-cyan-300", size: "w-6 h-6", startX: "75%", startY: "42%", delay: 1.8 },
  { icon: Diamond, color: "text-purple-300", size: "w-7 h-7", startX: "20%", startY: "30%", delay: 1.9 },
];

export default function OpeningPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"fly-in" | "assemble" | "spin" | "wash" | "burst" | "done">("fly-in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("assemble"), 2500);
    const t2 = setTimeout(() => setPhase("spin"), 4000);
    const t3 = setTimeout(() => setPhase("wash"), 5500);
    const t4 = setTimeout(() => setPhase("burst"), 7000);
    const t5 = setTimeout(() => {
      setPhase("done");
      router.push("/login");
    }, 8500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 animate-pulse" />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              backgroundColor: ["#a78bfa", "#22d3ee", "#34d399", "#fbbf24", "#f472b6"][Math.floor(Math.random() * 5)],
            }}
            animate={{
              y: [0, -30 - Math.random() * 40, 0],
              x: [0, (Math.random() - 0.5) * 30, 0],
              opacity: [0.1, 0.7, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Concentric circles */}
      <motion.div
        className="absolute w-96 h-96 rounded-full border border-purple-500/10"
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-72 h-72 rounded-full border border-cyan-500/10"
        animate={{ rotate: -360, scale: [1, 1.2, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <AnimatePresence mode="wait">
        {phase !== "done" && (
          <motion.div
            key="opening"
            className="relative z-10"
            exit={{ opacity: 0, scale: 0.5, filter: "blur(20px)", transition: { duration: 1.2 } }}
          >
            {/* Central washing machine - NO green one, just the main purple one */}
            <motion.div
              className="relative"
              animate={phase === "wash" ? {
                scale: [1, 1.3, 2, 3.5],
                opacity: [1, 1, 0.6, 0],
              } : phase === "burst" ? { opacity: 0 } : {}}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            >
              <motion.div
                className="relative"
                animate={phase === "assemble" ? {
                  rotate: [0, -15, 15, -10, 10, 0],
                } : phase === "spin" ? {
                  rotate: [0, 360, 720, 1080],
                  scale: [1, 1.1, 1, 1.1],
                } : phase === "wash" ? {
                  rotate: [0, 720, 1440],
                  scale: [1, 1.3, 1.5],
                } : {}}
                transition={{ 
                  duration: phase === "assemble" ? 0.8 : phase === "spin" ? 1.5 : 2,
                  ease: phase === "spin" ? "easeInOut" : "easeOut"
                }}
              >
                {/* Glow effect behind washing machine */}
                <motion.div
                  className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full"
                  animate={phase === "spin" ? { scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ width: "120%", height: "120%", left: "-10%", top: "-10%" }}
                />
                <WashingMachine className="w-28 h-28 text-purple-400 mx-auto relative z-10" strokeWidth={1.5} />
              </motion.div>
              
              {/* Bubbles during wash phase */}
              {phase === "wash" && (
                <>
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: `${8 + Math.random() * 20}px`,
                        height: `${8 + Math.random() * 20}px`,
                        left: "50%",
                        top: "50%",
                        background: `radial-gradient(circle at 30% 30%, ${["#a78bfa", "#22d3ee", "#34d399", "#fbbf24"][i % 4]}40, transparent)`,
                        border: `1px solid ${["#a78bfa", "#22d3ee", "#34d399", "#fbbf24"][i % 4]}60`,
                      }}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                      animate={{ 
                        x: (Math.random() - 0.5) * 400,
                        y: -150 - Math.random() * 300,
                        scale: [0, 1.5, 2, 0],
                        opacity: [1, 0.8, 0.4, 0],
                      }}
                      transition={{ duration: 2 + Math.random(), delay: i * 0.08, ease: "easeOut" }}
                    />
                  ))}
                </>
              )}
            </motion.div>

            {/* Flying items */}
            {laundryItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className={`absolute ${item.color}`}
                  style={{ left: item.startX, top: item.startY, transform: "translate(-50%, -50%)" }}
                  initial={{ opacity: 0, scale: 0, x: (Math.random() - 0.5) * 600, y: (Math.random() - 0.5) * 600, rotate: Math.random() * 360 }}
                  animate={
                    phase === "fly-in" ? {
                      opacity: 1, scale: 1, x: 0, y: 0, rotate: 0,
                    } : phase === "assemble" ? {
                      x: (50 - parseInt(item.startX)) * 2.5,
                      y: (50 - parseInt(item.startY)) * 2.5,
                      scale: 0.4,
                      opacity: 0.2,
                    } : phase === "spin" ? {
                      x: 0, y: 0, scale: 0, opacity: 0,
                    } : {}
                  }
                  transition={{ 
                    duration: phase === "fly-in" ? 1.8 : phase === "assemble" ? 1 : 0.5,
                    delay: phase === "fly-in" ? item.delay : 0,
                    ease: "easeOut",
                  }}
                >
                  <Icon className={item.size} />
                </motion.div>
              );
            })}

            {/* Logo text - appears during assemble */}
            <motion.div
              className="text-center mt-10"
              initial={{ opacity: 0, y: 30 }}
              animate={phase === "assemble" ? { opacity: 1, y: 0 } : phase === "spin" ? { opacity: 0, scale: 0.5, y: -20 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold text-white tracking-tight">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  LaundryEase
                </span>
              </h1>
              <p className="text-slate-400 mt-3 text-base">Fresh clothes, effortless</p>
            </motion.div>

            {/* Status text during spin */}
            <motion.div
              className="text-center mt-6 absolute left-1/2 -translate-x-1/2 w-full"
              initial={{ opacity: 0 }}
              animate={phase === "spin" ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-cyan-400 text-lg font-medium animate-pulse">Loading your experience...</p>
            </motion.div>

            {/* Burst effect before transition */}
            {phase === "burst" && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 2, 4], opacity: [0, 0.5, 0] }}
                transition={{ duration: 1.5 }}
              >
                <div className="w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-purple-500/30 blur-3xl" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
