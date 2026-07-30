"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Shirt, LogOut, Bell, Plus, MessageSquare, Star,
  Package, TrendingUp, Clock, ChevronRight, CheckCircle2,
  Truck, WashingMachine, AlertCircle, Calendar, Hash
} from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { GlowCard } from "@/components/animations/GlowCard";
import { FloatingOrbs } from "@/components/animations/FloatingOrbs";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { SubmitLaundryModal } from "@/components/modals/SubmitLaundryModal";

interface LaundryRequest {
  id: string;
  ticket_number: number;
  status: string;
  total_items: number;
  created_at: string;
  cost: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  submitted: { label: "Submitted", color: "text-amber-400", icon: Package },
  picked_up: { label: "Picked Up", color: "text-blue-400", icon: Truck },
  in_progress: { label: "Washing", color: "text-cyan-400", icon: WashingMachine },
  ready: { label: "Ready for Delivery", color: "text-emerald-400", icon: CheckCircle2 },
  delivered: { label: "Delivered", color: "text-purple-400", icon: Star },
};

export default function DashboardPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<LaundryRequest[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LaundryRequest | null>(null);

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

  const handleSubmit = async (data: { pickupDate: string; timeSlot: string; totalItems: number }) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: 'CHRIST2024001',
          pickup_date: data.pickupDate,
          pickup_time_slot: data.timeSlot,
          total_items: data.totalItems,
          status: 'submitted',
        }),
      });

      if (res.ok) {
        await fetchRequests();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Submit failed:', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const stats = {
    totalRequests: requests.length,
    itemsWashed: requests.reduce((a, r) => a + (r.total_items || 0), 0),
    pending: requests.filter(r => r.status === "submitted" || r.status === "picked_up" || r.status === "in_progress").length,
    completed: requests.filter(r => r.status === "delivered").length,
    avgRating: 4.2,
  };

  const recentRequests = [...requests].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 5);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || { label: status, color: "text-slate-400", icon: AlertCircle };
    const Icon = config.icon;
    return (
      <div className={`flex items-center gap-1.5 text-xs font-medium ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </div>
    );
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
              <p className="text-xs text-slate-400">Student Dashboard</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-purple-500/20"
            >
              <Plus className="w-4 h-4" />
              New Request
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-800/50"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2.5 text-slate-400 hover:text-red-400 transition-colors rounded-xl hover:bg-slate-800/50"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* Welcome */}
        <FadeIn>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome back! 👋</h2>
              <p className="text-slate-400 mt-1">Here's what's happening with your laundry</p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium text-amber-400">{stats.avgRating}</span>
            </div>
          </div>
        </FadeIn>

        {/* Stats Grid */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StaggerItem>
            <GlowCard>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-slate-400 font-medium">Total Requests</span>
                </div>
                <AnimatedCounter value={stats.totalRequests} className="text-2xl font-bold text-white" />
              </div>
            </GlowCard>
          </StaggerItem>

          <StaggerItem>
            <GlowCard>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shirt className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-400 font-medium">Items Washed</span>
                </div>
                <AnimatedCounter value={stats.itemsWashed} className="text-2xl font-bold text-white" />
              </div>
            </GlowCard>
          </StaggerItem>

          <StaggerItem>
            <GlowCard>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-400 font-medium">Pending</span>
                </div>
                <AnimatedCounter value={stats.pending} className="text-2xl font-bold text-white" />
              </div>
            </GlowCard>
          </StaggerItem>

          <StaggerItem>
            <GlowCard>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-400 font-medium">Completed</span>
                </div>
                <AnimatedCounter value={stats.completed} className="text-2xl font-bold text-white" />
              </div>
            </GlowCard>
          </StaggerItem>
        </StaggerContainer>

        {/* Tabs */}
        <FadeIn delay={0.2}>
          <div className="flex gap-1 p-1 bg-slate-900/50 rounded-xl border border-slate-800/50">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "requests", label: "My Requests", icon: Package },
              { id: "history", label: "History", icon: Clock },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-slate-800 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </FadeIn>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlowCard>
                  <div
                    onClick={() => setIsModalOpen(true)}
                    className="p-5 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <Plus className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Submit Laundry</h3>
                          <p className="text-xs text-slate-400">Schedule a new pickup</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
                    </div>
                  </div>
                </GlowCard>

                <GlowCard>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Support</h3>
                          <p className="text-xs text-slate-400">Need help? Contact us</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500" />
                    </div>
                  </div>
                </GlowCard>
              </div>

              {/* Recent Requests */}
              <FadeIn>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">Recent Requests</h3>
                  <button
                    onClick={() => setActiveTab("requests")}
                    className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                  >
                    View all
                  </button>
                </div>
              </FadeIn>

              <StaggerContainer className="space-y-3">
                {recentRequests.length === 0 ? (
                  <GlowCard>
                    <div className="p-8 text-center">
                      <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No requests yet</p>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-3 text-sm text-purple-400 hover:text-purple-300 font-medium"
                      >
                        Create your first request
                      </button>
                    </div>
                  </GlowCard>
                ) : (
                  recentRequests.map((req) => (
                    <StaggerItem key={req.id}>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedRequest(req)}
                        className="cursor-pointer"
                      >
                        <GlowCard>
                          <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                                <Hash className="w-5 h-5 text-purple-400" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-white font-medium">Ticket #{req.ticket_number}</h4>
                                  {getStatusBadge(req.status)}
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(req.created_at)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Shirt className="w-3 h-3" />
                                    {req.total_items} items
                                  </span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-600" />
                          </div>
                        </GlowCard>
                      </motion.div>
                    </StaggerItem>
                  ))
                )}
              </StaggerContainer>
            </motion.div>
          )}

          {activeTab === "requests" && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <StaggerContainer className="space-y-3">
                {requests.length === 0 ? (
                  <GlowCard>
                    <div className="p-8 text-center">
                      <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No requests found</p>
                    </div>
                  </GlowCard>
                ) : (
                  requests.sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                  ).map((req) => (
                    <StaggerItem key={req.id}>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedRequest(req)}
                        className="cursor-pointer"
                      >
                        <GlowCard>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <h4 className="text-white font-medium">Ticket #{req.ticket_number}</h4>
                                {getStatusBadge(req.status)}
                              </div>
                              <span className="text-sm font-medium text-emerald-400">
                                ₹{req.cost || 0}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-xs text-slate-400">
                              <div>
                                <p className="text-slate-500 mb-1">Date</p>
                                <p className="text-slate-300">{formatDate(req.created_at)}</p>
                              </div>
                              <div>
                                <p className="text-slate-500 mb-1">Items</p>
                                <p className="text-slate-300">{req.total_items}</p>
                              </div>
                              <div>
                                <p className="text-slate-500 mb-1">Status</p>
                                <p className="text-slate-300 capitalize">{req.status.replace('_', ' ')}</p>
                              </div>
                            </div>
                          </div>
                        </GlowCard>
                      </motion.div>
                    </StaggerItem>
                  ))
                )}
              </StaggerContainer>
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <StaggerContainer className="space-y-3">
                {requests.filter(r => r.status === "delivered").length === 0 ? (
                  <GlowCard>
                    <div className="p-8 text-center">
                      <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No completed requests yet</p>
                    </div>
                  </GlowCard>
                ) : (
                  requests
                    .filter(r => r.status === "delivered")
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((req) => (
                      <StaggerItem key={req.id}>
                        <GlowCard>
                          <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              </div>
                              <div>
                                <h4 className="text-white font-medium">Ticket #{req.ticket_number}</h4>
                                <p className="text-xs text-slate-400">{formatDate(req.created_at)} • {req.total_items} items</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-emerald-400">₹{req.cost || 0}</span>
                              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                                <Star className="w-4 h-4 text-slate-500 hover:text-amber-400" />
                              </button>
                            </div>
                          </div>
                        </GlowCard>
                      </StaggerItem>
                    ))
                )}
              </StaggerContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Submit Modal */}
      <SubmitLaundryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />

      {/* Request Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Request Details</h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                  <Hash className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-xs text-slate-400">Ticket Number</p>
                    <p className="text-white font-medium">#{selectedRequest.ticket_number}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-400">Submitted On</p>
                    <p className="text-white font-medium">{formatDate(selectedRequest.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                  <Shirt className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-xs text-slate-400">Total Items</p>
                    <p className="text-white font-medium">{selectedRequest.total_items} items</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-xs text-slate-400">Cost</p>
                    <p className="text-white font-medium">₹{selectedRequest.cost || 0}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                  <Package className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-xs text-slate-400">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
