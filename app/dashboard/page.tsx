"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Shirt, LogOut, Bell, Plus, MessageSquare, Star,
  Package, TrendingUp, Clock, ChevronRight
} from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { GlowCard } from "@/components/animations/GlowCard";
import { FloatingOrbs } from "@/components/animations/FloatingOrbs";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";

interface LaundryRequest {
  id: string;
  ticket_number: number;
  status: string;
  total_items: number;
  created_at: string;
  cost: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<LaundryRequest[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/student/requests?studentId=CHRIST2024001');
      const data = await res.json();
      if (Array.isArray(data)) {
        setRequests(data);
      }
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const stats = {
    totalRequests: requests.length,
    itemsWashed: requests.reduce((a, r) => a + (r.total_items || 0), 0),
    pending: requests.filter(r => r.status === "submitted" || r.status === "picked_up").length,
    avgRating: 4.2,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <FloatingOrbs />
      
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-800 flex items-center justify-center shadow-lg shadow-purple-500/20"
            >
              <Shirt className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-white">LaundryEase</h1>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 relative"
            >
              <Bell className="w-5 h-5" />
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full"
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center text-white text-sm font-bold"
            >
              JD
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        {/* Profile Card */}
        <FadeIn>
          <GlowCard className="mb-6">
            <div className="p-6 flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center text-white text-xl font-bold"
              >
                <UserIcon />
              </motion.div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white">John Doe</h2>
                <p className="text-sm text-slate-500">CHRIST2024001 · Jonas Hall</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Room</p>
                <p className="text-lg font-bold text-white">204-B</p>
              </div>
            </div>
          </GlowCard>
        </FadeIn>

        {/* Stats */}
        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StaggerItem>
            <GlowCard glowColor="rgba(139, 92, 246, 0.2)">
              <div className="p-5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3 text-purple-400">
                  <Package className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-500 mb-1">Total Requests</p>
                <AnimatedCounter value={stats.totalRequests} className="text-2xl font-bold text-white" />
              </div>
            </GlowCard>
          </StaggerItem>
          
          <StaggerItem>
            <GlowCard glowColor="rgba(59, 130, 246, 0.2)">
              <div className="p-5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 text-blue-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-500 mb-1">Items Washed</p>
                <AnimatedCounter value={stats.itemsWashed} className="text-2xl font-bold text-white" />
              </div>
            </GlowCard>
          </StaggerItem>
          
          <StaggerItem>
            <GlowCard glowColor="rgba(245, 158, 11, 0.2)">
              <div className="p-5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3 text-amber-400">
                  <Clock className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-500 mb-1">Pending</p>
                <AnimatedCounter value={stats.pending} className="text-2xl font-bold text-white" />
              </div>
            </GlowCard>
          </StaggerItem>
          
          <StaggerItem>
            <GlowCard glowColor="rgba(16, 185, 129, 0.2)">
              <div className="p-5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3 text-emerald-400">
                  <Star className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-500 mb-1">Avg Rating</p>
                <div className="text-2xl font-bold text-white">
                  {stats.avgRating}<span className="text-sm text-slate-500">/5</span>
                </div>
              </div>
            </GlowCard>
          </StaggerItem>
        </StaggerContainer>

        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-purple-600/20 to-violet-800/20 border border-purple-500/20 text-left group relative overflow-hidden"
          >
            <motion.div
              whileHover={{ rotate: 90 }}
              className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400"
            >
              <Plus className="w-6 h-6" />
            </motion.div>
            <h3 className="text-white font-semibold mb-1">Submit New Laundry</h3>
            <p className="text-slate-400 text-sm">Register clothes for pickup</p>
            <motion.div
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ChevronRight className="w-5 h-5 text-purple-400" />
            </motion.div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/30 text-left group relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <div className="w-12 h-12 rounded-xl bg-slate-700/30 flex items-center justify-center mb-4 text-slate-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-white font-semibold mb-1">Share Feedback</h3>
            <p className="text-slate-400 text-sm">Help improve our service</p>
          </motion.button>
        </div>

        {/* Tabs */}
        <FadeIn delay={0.3}>
          <div className="flex gap-2 mb-6 p-1 rounded-xl bg-slate-900/50 border border-slate-800/50">
            {["overview", "history", "feedback"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/20"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </FadeIn>

        {/* Recent Activity */}
        <FadeIn delay={0.4}>
          <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <AnimatePresence>
              {requests.slice(0, 5).map((req, index) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/30 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400"
                    >
                      <Package className="w-5 h-5" />
                    </motion.div>
                    <div>
                      <p className="text-white font-medium">Laundry #{String(req.ticket_number).padStart(4, '0')}</p>
                      <p className="text-xs text-slate-500">{req.created_at ? new Date(req.created_at).toLocaleDateString() : 'N/A'} · {req.total_items} items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      req.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                      req.status === 'ready' ? 'bg-cyan-500/10 text-cyan-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {req.status}
                    </span>
                    {req.status === 'delivered' && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-xs text-purple-400 hover:text-purple-300"
                      >
                        Rate
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}

function UserIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
