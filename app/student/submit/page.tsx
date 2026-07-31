"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import { Shirt, ArrowLeft, Plus, Minus } from "lucide-react";

const itemPrices: Record<string, number> = {
  shirts: 15,
  pants: 20,
  towels: 18,
  bedsheets: 25,
  jackets: 30,
  socks: 10,
  undergarments: 12,
};

export default function SubmitRequest() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [items, setItems] = useState<Record<string, number>>({
    shirts: 0,
    pants: 0,
    towels: 0,
    bedsheets: 0,
    jackets: 0,
    socks: 0,
    undergarments: 0,
  });
  const [pickupDate, setPickupDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("9:00 AM - 11:00 AM");
  const [washType, setWashType] = useState("Regular Wash");
  const [loading, setLoading] = useState(false);

  const totalItems = Object.values(items).reduce((a, b) => a + b, 0);
  const totalCost = Object.entries(items).reduce((sum, [item, count]) => sum + (itemPrices[item] * count), 0);

  const updateItem = (item: string, delta: number) => {
    setItems(prev => ({
      ...prev,
      [item]: Math.max(0, prev[item] + delta)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalItems === 0) return;

    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();

    // Get student ID
    const { data: student } = await supabase
      .from("students")
      .select("id")
      .eq("email", session?.user?.email)
      .single();

    const { error } = await supabase.from("laundry_requests").insert({
      student_id: student?.id,
      pickup_date: pickupDate,
      pickup_time_slot: timeSlot,
      items: items,
      total_items: totalItems,
      wash_type: washType,
      cost: totalCost,
    });

    if (!error) {
      router.push("/student/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.push("/student/dashboard")} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <Shirt className="w-6 h-6 text-purple-400" />
          <h1 className="text-lg font-bold text-white">New Laundry Request</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Items */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
            <h3 className="text-white font-bold mb-4">Select Items</h3>
            <div className="space-y-3">
              {Object.entries(itemPrices).map(([item, price]) => (
                <div key={item} className="flex items-center justify-between">
                  <div>
                    <p className="text-white capitalize">{item}</p>
                    <p className="text-sm text-slate-400">₹{price} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateItem(item, -1)}
                      className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white hover:bg-slate-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-white w-6 text-center">{items[item]}</span>
                    <button
                      type="button"
                      onClick={() => updateItem(item, 1)}
                      className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white hover:bg-purple-500"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pickup Details */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-white font-bold">Pickup Details</h3>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Pickup Date</label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
              >
                <option>9:00 AM - 11:00 AM</option>
                <option>11:00 AM - 1:00 PM</option>
                <option>2:00 PM - 4:00 PM</option>
                <option>4:00 PM - 6:00 PM</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Wash Type</label>
              <select
                value={washType}
                onChange={(e) => setWashType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
              >
                <option>Regular Wash</option>
                <option>Express Wash (+₹50)</option>
                <option>Dry Clean</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between text-white mb-2">
              <span>Total Items</span>
              <span className="font-bold">{totalItems}</span>
            </div>
            <div className="flex justify-between text-white text-lg font-bold">
              <span>Total Cost</span>
              <span>₹{totalCost}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || totalItems === 0}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </main>
    </div>
  );
}
