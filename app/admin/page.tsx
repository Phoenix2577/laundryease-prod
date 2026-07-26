"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shirt, LogOut, Search, ChevronDown, Download,
  Package, Users, TrendingUp, Clock, CheckCircle, AlertCircle,
  BarChart3, Mail
} from "lucide-react";
import { STATUS_LABELS, STATUS_FLOW } from "@/types";
import { formatDate } from "@/lib/utils";

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
        await fetchRequests(); // Refresh data
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
        <div className="text-purple-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Shirt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-violet-400 bg-clip-text text-transparent">LaundryEase</h1>
              <p className="text-xs text-purple-300/60">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-slate-400">Laundry Head</span>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <AdminStatCard icon={<Package className="w-4 h-4" />} label="Today" value={stats.totalToday} color="purple" />
          <AdminStatCard icon={<AlertCircle className="w-4 h-4" />} label="Pending" value={stats.pending} color="amber" />
          <AdminStatCard icon={<Clock className="w-4 h-4" />} label="In Progress" value={stats.inProgress} color="blue" />
          <AdminStatCard icon={<CheckCircle className="w-4 h-4" />} label="Ready" value={stats.ready} color="cyan" />
          <AdminStatCard icon={<TrendingUp className="w-4 h-4" />} label="Delivered" value={stats.delivered} color="emerald" />
          <AdminStatCard icon={<BarChart3 className="w-4 h-4" />} label="Revenue" value={`Rs.${stats.totalRevenue}`} color="violet" />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, room, ticket..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-purple-500/20 text-white placeholder-slate-500 focus:border-purple-400 input-glow outline-none text-sm"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="appearance-none px-4 py-2.5 pr-10 rounded-xl bg-slate-900 border border-purple-500/20 text-white focus:border-purple-400 outline-none text-sm cursor-pointer"
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
        </div>

        {/* Requests Table */}
        <div className="rounded-2xl bg-slate-900/50 border border-purple-500/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/10 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Ticket</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">Room/Block</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">Date & Time</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {filteredRequests.map(req => {
                  const nextStatus = getNextStatus(req.status);
                  return (
                    <tr key={req.id} className="hover:bg-purple-500/5 transition-colors group">
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-white">#{String(req.ticket_number).padStart(4, '0')}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-white text-sm">{req.student?.full_name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{req.student?.student_id}</p>
                        {req.student?.email && (
                          <p className="text-xs text-slate-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {req.student.email}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-sm text-white">{req.student?.room_number}</p>
                        <p className="text-xs text-slate-500">{req.student?.hostel_block}</p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="text-sm text-white">{formatDate(req.pickup_date)}</p>
                        <p className="text-xs text-slate-500">{req.pickup_time_slot}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-white font-medium">{req.total_items}</span>
                        <span className="text-xs text-slate-500 ml-1">(Rs.{req.cost})</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_LABELS[req.status]?.bg || ""}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_LABELS[req.status]?.color?.replace("text-", "bg-") || "bg-slate-500"}`} />
                          {STATUS_LABELS[req.status]?.label || req.status}
                        </span>
                        {req.delivery_otp && req.status === 'ready' && (
                          <p className="text-xs text-red-400 mt-1">OTP: {req.delivery_otp}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {nextStatus ? (
                          <button
                            onClick={() => updateStatus(req.id, nextStatus)}
                            disabled={updating === req.id}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 transition-all disabled:opacity-50"
                          >
                            {updating === req.id ? '...' : `Mark ${STATUS_LABELS[nextStatus]?.label || nextStatus}`}
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Complete
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredRequests.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No requests found matching your filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function AdminStatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  const bgMap: Record<string, string> = {
    purple: "bg-purple-500/10",
    amber: "bg-amber-500/10",
    blue: "bg-blue-500/10",
    cyan: "bg-cyan-500/10",
    emerald: "bg-emerald-500/10",
    violet: "bg-violet-500/10",
  };
  const textMap: Record<string, string> = {
    purple: "text-purple-400",
    amber: "text-amber-400",
    blue: "text-blue-400",
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
    violet: "text-violet-400",
  };

  return (
    <div className="rounded-xl bg-slate-900/50 border border-purple-500/10 p-4 card-glow">
      <div className={`w-7 h-7 rounded-lg ${bgMap[color]} flex items-center justify-center mb-2 ${textMap[color]}`}>
        {icon}
      </div>
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  );
}
