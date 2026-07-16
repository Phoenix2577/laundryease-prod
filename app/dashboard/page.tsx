"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shirt, Plus, History, MessageSquare, LogOut, Bell,
  TrendingUp, Package, Clock, Star, ChevronRight, User
} from "lucide-react";
import { CLOTHING_ITEMS, TIME_SLOTS, WASH_TYPES, DETERGENTS, STATUS_LABELS } from "@/types";
import { formatDate, calculateCost } from "@/lib/utils";

interface RequestItem {
  id: number;
  date: string;
  items: number;
  status: string;
  total: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [student, setStudent] = useState({ name: "John Doe", id: "CHRIST2024001", room: "204-B", block: "Jonas Hall", quota: 5833 });
  const [requests, setRequests] = useState<RequestItem[]>([
    { id: 1, date: "2026-07-10", items: 8, status: "delivered", total: "Rs.120" },
    { id: 2, date: "2026-07-05", items: 12, status: "delivered", total: "Rs.180" },
    { id: 3, date: "2026-07-15", items: 5, status: "picked_up", total: "Rs.75" },
  ]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);

  // Form states
  const [pickupDate, setPickupDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [washType, setWashType] = useState(WASH_TYPES[0]);
  const [detergent, setDetergent] = useState(DETERGENTS[0]);
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    const sid = localStorage.getItem("student_id");
    if (!sid) router.push("/login");
  }, [router]);

  const updateCount = (id: string, delta: number) => {
    setCounts(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const totalItems = Object.values(counts).reduce((a, b) => a + b, 0);
  const estimatedCost = calculateCost(counts);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalItems === 0) return;

    const newRequest: RequestItem = {
      id: requests.length + 1,
      date: new Date().toISOString().split("T")[0],
      items: totalItems,
      status: "submitted",
      total: `Rs.${estimatedCost}`,
    };
    setRequests([newRequest, ...requests]);
    setCounts({});
    setShowSubmitModal(false);
    setActiveTab("history");
  };

  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setShowFeedbackModal(false);
    setSelectedRequest(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const pendingCount = requests.filter(r => r.status !== "delivered" && r.status !== "cancelled").length;
  const deliveredCount = requests.filter(r => r.status === "delivered").length;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-purple-500/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Shirt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-violet-400 bg-clip-text text-transparent">LaundryEase</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-purple-500/10 transition-colors">
              <Bell className="w-5 h-5 text-slate-400" />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-xs font-bold text-purple-300">
              {student.name.split(" ").map(n => n[0]).join("")}
            </div>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Student Info Bar */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-900/30 via-violet-900/20 to-slate-900/50 border border-purple-500/20 p-5 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <User className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-white">{student.name}</p>
              <p className="text-xs text-slate-400">{student.id} &middot; {student.block}</p>
            </div>
          </div>
          <div className="h-8 w-px bg-purple-500/20 hidden sm:block" />
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-slate-500">Room</p>
              <p className="font-medium text-white">{student.room}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Annual Quota</p>
              <p className="font-medium text-emerald-400">Rs.{student.quota.toLocaleString()} <span className="text-slate-500 text-xs">/ Rs.7,000</span></p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard icon={<Package className="w-5 h-5" />} label="Total Requests" value={requests.length} color="purple" />
          <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Items Washed" value={requests.reduce((a, r) => a + r.items, 0)} color="violet" />
          <StatCard icon={<Clock className="w-5 h-5" />} label="Pending" value={pendingCount} color="amber" />
          <StatCard icon={<Star className="w-5 h-5" />} label="Avg Rating" value="4.2" suffix="/5" color="emerald" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/30 p-6 hover:border-purple-400/50 transition-all text-left card-glow"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5 text-purple-300" />
                </div>
                <h3 className="font-semibold text-white">Submit New Laundry</h3>
                <p className="text-sm text-purple-300/60 mt-1">Register clothes for pickup</p>
              </div>
              <ChevronRight className="w-5 h-5 text-purple-400/40 group-hover:text-purple-300 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/20 to-violet-900/20 border border-violet-500/30 p-6 hover:border-violet-400/50 transition-all text-left card-glow"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5 text-violet-300" />
                </div>
                <h3 className="font-semibold text-white">Share Feedback</h3>
                <p className="text-sm text-violet-300/60 mt-1">Help improve our service</p>
              </div>
              <ChevronRight className="w-5 h-5 text-violet-400/40 group-hover:text-violet-300 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-slate-900/50 p-1 rounded-xl border border-purple-500/10">
          {[
            { id: "overview", label: "Overview", icon: <Package className="w-4 h-4" /> },
            { id: "history", label: "History", icon: <History className="w-4 h-4" /> },
            { id: "feedback", label: "Feedback", icon: <MessageSquare className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Recent Activity</h3>
            {requests.slice(0, 3).map(req => (
              <div key={req.id} className="rounded-xl bg-slate-900/50 border border-purple-500/10 p-4 flex items-center justify-between hover:border-purple-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Laundry #{String(req.id).padStart(4, "0")}</p>
                    <p className="text-sm text-slate-500">{formatDate(req.date)} &middot; {req.items} items</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_LABELS[req.status]?.bg || ""}`}>
                    {STATUS_LABELS[req.status]?.label || req.status}
                  </span>
                  {req.status === "delivered" && (
                    <button
                      onClick={() => { setSelectedRequest(req); setShowFeedbackModal(true); }}
                      className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                    >
                      Rate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-3">
            {requests.map(req => (
              <div key={req.id} className="rounded-xl bg-slate-900/50 border border-purple-500/10 p-5 hover:border-purple-500/30 transition-all card-glow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white">#{String(req.id).padStart(4, "0")}</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_LABELS[req.status]?.bg || ""}`}>
                      {STATUS_LABELS[req.status]?.label || req.status}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-white">{req.total}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-slate-400">{formatDate(req.date)}</span>
                  <span className="text-slate-500">{req.items} items</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "feedback" && (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl bg-slate-900/50 border border-purple-500/20 p-8 text-center space-y-6">
              <h3 className="text-lg font-semibold text-purple-300">How is your laundry experience?</h3>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} className="text-3xl text-purple-500/30 hover:text-purple-400 transition-colors">★</button>
                ))}
              </div>
              <textarea
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-purple-500/30 text-white placeholder-slate-500 focus:border-purple-400 input-glow outline-none transition-all resize-none"
                rows={4}
                placeholder="Tell us what we can improve..."
              />
              <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all">
                Submit Feedback
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-purple-500/30 shadow-2xl">
            <div className="p-6 border-b border-purple-500/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Submit Laundry</h2>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Clothing Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-purple-300">Select Items</h3>
                  <span className="text-sm text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">{totalItems} items &middot; Est. Rs.{estimatedCost}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CLOTHING_ITEMS.map(item => (
                    <div key={item.id} className="rounded-xl bg-slate-950 border border-purple-500/20 p-3 hover:border-purple-500/40 transition-all">
                      <div className="text-2xl mb-1 text-center">{item.icon}</div>
                      <p className="text-xs text-slate-300 text-center mb-2">{item.name}</p>
                      <p className="text-xs text-slate-500 text-center mb-2">Rs.{item.cost_per_item}/pc</p>
                      <div className="flex items-center justify-center gap-2">
                        <button type="button" onClick={() => updateCount(item.id, -1)} className="w-7 h-7 rounded-md bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 flex items-center justify-center font-bold text-sm">-</button>
                        <span className="w-6 text-center font-bold text-white">{counts[item.id] || 0}</span>
                        <button type="button" onClick={() => updateCount(item.id, 1)} className="w-7 h-7 rounded-md bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 flex items-center justify-center font-bold text-sm">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Pickup Date *</label>
                  <input type="date" required value={pickupDate} onChange={e => setPickupDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-purple-500/30 text-white focus:border-purple-400 input-glow outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Time Slot</label>
                  <select value={timeSlot} onChange={e => setTimeSlot(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-purple-500/30 text-white focus:border-purple-400 input-glow outline-none">
                    {TIME_SLOTS.map(slot => <option key={slot}>{slot}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Wash Type</label>
                  <select value={washType} onChange={e => setWashType(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-purple-500/30 text-white focus:border-purple-400 input-glow outline-none">
                    {WASH_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Detergent</label>
                  <select value={detergent} onChange={e => setDetergent(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-purple-500/30 text-white focus:border-purple-400 input-glow outline-none">
                    {DETERGENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Special Instructions</label>
                <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-purple-500/30 text-white placeholder-slate-500 focus:border-purple-400 input-glow outline-none resize-none" placeholder="Any specific instructions..." />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowSubmitModal(false)} className="flex-1 py-3 rounded-xl border border-purple-500/30 text-slate-300 hover:bg-purple-500/10 transition-all font-medium">Cancel</button>
                <button type="submit" disabled={totalItems === 0} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all disabled:opacity-50">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-purple-500/30 shadow-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Rate Laundry #{String(selectedRequest.id).padStart(4, "0")}</h3>
            <form onSubmit={handleFeedback} className="space-y-4">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" className="text-3xl text-purple-500/30 hover:text-purple-400 transition-colors">★</button>
                ))}
              </div>
              <textarea className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-purple-500/30 text-white placeholder-slate-500 focus:border-purple-400 input-glow outline-none resize-none" rows={3} placeholder="Your feedback..." />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowFeedbackModal(false)} className="flex-1 py-2.5 rounded-xl border border-purple-500/30 text-slate-300 hover:bg-purple-500/10 transition-all">Skip</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, suffix, color }: { icon: React.ReactNode; label: string; value: string | number; suffix?: string; color: string }) {
  const colorMap: Record<string, string> = {
    purple: "from-purple-900/40 border-purple-500/20",
    violet: "from-violet-900/40 border-violet-500/20",
    amber: "from-amber-900/40 border-amber-500/20",
    emerald: "from-emerald-900/40 border-emerald-500/20",
  };
  const textMap: Record<string, string> = {
    purple: "text-purple-400",
    violet: "text-violet-400",
    amber: "text-amber-400",
    emerald: "text-emerald-400",
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorMap[color]} to-slate-900 border p-5 card-glow`}>
      <div className="relative">
        <div className={`w-8 h-8 rounded-lg bg-${color}-500/10 flex items-center justify-center mb-2 ${textMap[color]}`}>
          {icon}
        </div>
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value}{suffix && <span className="text-sm text-slate-500 ml-1">{suffix}</span>}</p>
      </div>
    </div>
  );
}