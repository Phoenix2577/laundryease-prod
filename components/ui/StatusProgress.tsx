"use client";

import { motion } from "framer-motion";
import { Package, Truck, WashingMachine, CheckCircle2, Star } from "lucide-react";

const steps = [
  { id: "submitted", label: "Submitted", icon: Package },
  { id: "picked_up", label: "Picked Up", icon: Truck },
  { id: "in_progress", label: "Washing", icon: WashingMachine },
  { id: "ready", label: "Ready", icon: CheckCircle2 },
  { id: "delivered", label: "Delivered", icon: Star },
];

interface StatusProgressProps {
  currentStatus: string;
}

export function StatusProgress({ currentStatus }: StatusProgressProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStatus);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2" />
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 -translate-y-1/2"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isCompleted ? "rgb(147, 51, 234)" : "rgb(30, 41, 59)",
                  borderColor: isCompleted ? "rgb(168, 85, 247)" : "rgb(51, 65, 85)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${isCompleted ? "shadow-lg shadow-purple-500/30" : ""}`}
              >
                <Icon className={`w-5 h-5 ${isCompleted ? "text-white" : "text-slate-500"}`} />
              </motion.div>
              <motion.span
                initial={false}
                animate={{
                  color: isCompleted ? "rgb(168, 85, 247)" : "rgb(100, 116, 139)",
                  fontWeight: isCurrent ? 600 : 400,
                }}
                className="text-xs mt-2 whitespace-nowrap"
              >
                {step.label}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
