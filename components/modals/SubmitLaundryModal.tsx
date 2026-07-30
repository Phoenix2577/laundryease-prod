"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shirt, Calendar, Clock } from "lucide-react";

interface SubmitLaundryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { pickupDate: string; timeSlot: string; totalItems: number }) => void;
}

const timeSlots = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
];

export function SubmitLaundryModal({ isOpen, onClose, onSubmit }: SubmitLaundryModalProps) {
  const [pickupDate, setPickupDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [totalItems, setTotalItems] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupDate || !timeSlot) return;
    onSubmit({ pickupDate, timeSlot, totalItems });
    setPickupDate("");
    setTimeSlot("");
    setTotalItems(1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Shirt className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">New Laundry Request</h3>
                  <p className="text-xs text-slate-400">Schedule a pickup</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Pickup Date
                </label>
                <input
                  type="date"
                  required
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Time Slot
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        timeSlot === slot
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Shirt className="w-4 h-4 text-amber-400" />
                  Total Items
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTotalItems(Math.max(1, totalItems - 1))}
                    className="w-10 h-10 rounded-xl bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="text-xl font-bold text-white w-12 text-center">{totalItems}</span>
                  <button
                    type="button"
                    onClick={() => setTotalItems(totalItems + 1)}
                    className="w-10 h-10 rounded-xl bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!pickupDate || !timeSlot}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-500/20"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
