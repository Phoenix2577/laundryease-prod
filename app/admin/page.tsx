"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shirt, LogOut, Search, ChevronDown, Package,
  Users, TrendingUp, Clock, CheckCircle, AlertCircle,
  BarChart3, Mail, Sparkles
} from "lucide-react";
import { STATUS_LABELS, STATUS_FLOW } from "@/types";
import { formatDate } from "@/lib/utils";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { GlowCard } from "@/components/animations/GlowCard";
import { FloatingParticles } from "@/components/animations/FloatingParticles";
import { ScrollProgress } from "@/components/animations/ScrollProgress";

interface RequestWithStudent {
  id: string;
  ticket_number: number;
  student: {
    full_name: string;
    student_id: string;
    room_number: string;
    hostel_block: string;
    email: string;
  };
  pickup_date: string;
  total_items: number;
  status: string;
  cost: number;
  pickup_time_slot: string;
  delivery_otp: string | null;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<RequestWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/requests');
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

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        await fetchRequests();
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setUpdating(null);
    }
  };

  const getNextStatus = (current: string) => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  const filteredRequests = requests.filter(r => {
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    const matchesSearch = searchQuery === "" || 
      r.student?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.student?.student_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.student?.room_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(r.ticket_number).includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const stats = {
    totalToday: requests.filter(r => r.pickup_date === new Date().toISOString().split('T')[0]).length,
    pending: requests.filter(r => r.status === "submitted").length,
    inProgress: requests.filter(r => r.status === "picked_up" || r.status === "washing").length,
    ready: requests.filter(r => r.status === "ready").length,
    delivered: requests.filter(r => r.status === "delivered").length,
    totalRevenue: requests.reduce((a, r) => a + (r.cost || 0), 0),
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
    <div className="min-h-screen bg-slate-950 relative">
      <FloatingParticles />
      <ScrollProgress />
      
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-800 flex items-center justify-center shadow-lg shadow-purple-500/20"
            >
              <Shirt className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-white">LaundryEase</h1>
              <p className="text-xs text-slate-500">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden sm:inline text-sm text-slate-400"
            >
              Laundry Head
            </motion.span>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Stats Row */}
        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StaggerItem>
            <GlowCard glowColor="rgba(139, 92, 246, 0.2)">
              <div className="p-5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3 text-purple-400">
                  <Package className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-500 mb-1">Today</p>
                <AnimatedCounter value={stats.totalToday} className="text-2xl font-bold text-white" />
              </div>
            </GlowCard>
          </StaggerItem>
          
          <StaggerItem>
            <GlowCard glowColor="rgba(245, 158, 11, 0.2)">
              <div className="p-5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3 text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-500 mb-1">Pending</p>
                <AnimatedCounter value={stats.pending} className="text-2xl font-bold text-white" />
              </div>
            </GlowCard>
          </StaggerItem>
          
          <StaggerItem>
            <GlowCard glowColor="rgba(59, 130, 246, 0.2)">
              <div className="p-5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 text-blue-400">
                  <Clock className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-500 mb-1">In Progress</p>
                <AnimatedCounter value={stats.inProgress} className="text-2xl font-bold text-white" />
              </div>
            </GlowCard>
          </StaggerItem>
          
          <StaggerItem>
            <GlowCard glowColor="rgba(6, 182, 212, 0.2)">
              <div className="p-5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-3 text-cyan-400">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-500 mb-1">Ready</p>
                <AnimatedCounter value={stats.ready} className="text-2xl font-bold text-white" />
              </div>
            </GlowCard>
          </StaggerItem>
          
          <StaggerItem>
            <GlowCard glowColor="rgba(16, 185, 129, 0.2)">
              <div className="p-5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-500 mb-1">Delivered</p>
                <AnimatedCounter value={stats.delivered} className="text-2xl font-bold text-white" />
              </div>
            </GlowCard>
          </StaggerItem>
          
          <StaggerItem>
            <GlowCard glowColor="rgba(124, 58, 237, 0.2)">
              <div className="p-5">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center mb-3 text-violet-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-500 mb-1">Revenue</p>
                <div className="text-2xl font-bold text-white">
                  Rs.<AnimatedCounter value={stats.totalRevenue} />
                </div>
              </div>
            </GlowCard>
          </StaggerItem>
        </StaggerContainer>

        {/* Controls */}
        <FadeIn delay={0.3} className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, room, ticket..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="appearance-none px-4 py-3 pr-10 rounded-xl bg-slate-900/80 border border-slate-700/50 text-white focus:border-purple-500/50 outline-none text-sm cursor-pointer transition-all"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="picked_up">Picked Up</option>
              <option value="washing">Washing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </FadeIn>

        {/* Requests Table */}
        <FadeIn delay={0.4}>
          <div className="rounded-2xl bg-slate-900/60 border border-slate-700/30 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/30 text-left">
                    <th className="px-5 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Ticket</th>
                    <th className="px-5 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Student</th>
                    <th className="px-5 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Room/Block</th>
                    <th className="px-5 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">Date & Time</th>
                    <th className="px-5 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Items</th>
                    <th className="px-5 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/20">
                  <AnimatePresence>
                    {filteredRequests.map((req, index) => {
                      const nextStatus = getNextStatus(req.status);
                      return (
                        <motion.tr
                          key={req.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-slate-800/30 transition-colors group"
                        >
                          <td className="px-5 py-4">
                            <motion.span
                              whileHover={{ scale: 1.1 }}
                              className="font-mono font-bold text-purple-400 inline-block"
                            >
                              #{String(req.ticket_number).padStart(4, '0')}
                            </motion.span>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-medium text-white text-sm">{req.student?.full_name || 'Unknown'}</p>
                            <p className="text-xs text-slate-500">{req.student?.student_id}</p>
                            {req.student?.email && (
                              <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3" /> {req.student.email}
                              </p>
                            )}
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell">
                            <p className="text-sm text-white">{req.student?.room_number}</p>
                            <p className="text-xs text-slate-500">{req.student?.hostel_block}</p>
                          </td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <p className="text-sm text-white">{formatDate(req.pickup_date)}</p>
                            <p className="text-xs text-slate-500">{req.pickup_time_slot}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm text-white font-medium">{req.total_items}</span>
                            <span className="text-xs text-slate-500 ml-1">(Rs.{req.cost})</span>
                          </td>
                          <td className="px-5 py-4">
                            <motion.span
                              whileHover={{ scale: 1.05 }}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${STATUS_LABELS[req.status]?.bg || ""}`}
                            >
                              <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`w-1.5 h-1.5 rounded-full ${STATUS_LABELS[req.status]?.color?.replace("text-", "bg-") || "bg-slate-500"}`}
                              />
                              {STATUS_LABELS[req.status]?.label || req.status}
                            </motion.span>
                            {req.delivery_otp && req.status === 'ready' && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-red-400 mt-1 font-mono"
                              >
                                OTP: {req.delivery_otp}
                              </motion.p>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {nextStatus ? (
                              <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(124, 58, 237, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateStatus(req.id, nextStatus)}
                                disabled={updating === req.id}
                                className="text-xs font-medium px-4 py-2 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 transition-all disabled:opacity-50 flex items-center gap-1"
                              >
                                <Sparkles className="w-3 h-3" />
                                {updating === req.id ? '...' : `Mark ${STATUS_LABELS[nextStatus]?.label || nextStatus}`}
                              </motion.button>
                            ) : (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-emerald-400 flex items-center gap-1"
                              >
                                <CheckCircle className="w-3 h-3" /> Complete
                              </motion.span>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {filteredRequests.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 text-slate-500"
              >
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg">No requests found</p>
                <p className="text-sm text-slate-600 mt-1">Try adjusting your filters</p>
              </motion.div>
            )}
          </div>
        </FadeIn>
      </main>
    </div>
  );
}
// Animated counters active
