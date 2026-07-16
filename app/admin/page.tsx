"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shirt, LogOut, Search, Filter, ChevronDown, Download,
  Package, Users, TrendingUp, Clock, CheckCircle, AlertCircle,
  BarChart3, ArrowUpDown, MoreHorizontal
} from "lucide-react";
import { STATUS_LABELS, STATUS_FLOW } from "@/types";
import { formatDate } from "@/lib/utils";

interface AdminRequest {
  id: number;
  ticket: string;
  studentName: string;
  studentId: string;
  room: string;
  block: string;
  date: string;
  items: number;
  status: string;
  total: string;
  timeSlot: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequests, setSelectedRequests] = useState<number[]>([]);
  const [showBulkAction, setShowBulkAction] = useState(false);

  const [requests, setRequests] = useState<AdminRequest[]>([
    { id: 1, ticket: "0423", studentName: "Rahul Sharma", studentId: "CHRIST2024001", room: "204-B", block: "Jonas Hall", date: "2026-07-15", items: 8, status: "submitted", total: "Rs.120", timeSlot: "9:00 AM - 11:00 AM" },
    { id: 2, ticket: "0424", studentName: "Priya Menon", studentId: "CHRIST2024002", room: "112-A", block: "Christ Hall A", date: "2026-07-15", items: 12, status: "picked_up", total: "Rs.180", timeSlot: "11:00 AM - 1:00 PM" },
    { id: 3, ticket: "0425", studentName: "Arun Kumar", studentId: "CHRIST2024003", room: "305-C", block: "Jonas Hall", date: "2026-07-15", items: 5, status: "washing", total: "Rs.75", timeSlot: "2:00 PM - 4:00 PM" },
    { id: 4, ticket: "0426", studentName: "Sneha Reddy", studentId: "CHRIST2024004", room: "201-A", block: "St. Kuriakose", date: "2026-07-14", items: 15, status: "ready", total: "Rs.225", timeSlot: "7:00 AM - 9:00 AM" },
    { id: 5, ticket: "0427", studentName: "Vikram Patel", studentId: "CHRIST2024005", room: "118-B", block: "Christ Hall B", date: "2026-07-14", items: 7, status: "delivered", total: "Rs.105", timeSlot: "4:00 PM - 6:00 PM" },
    { id: 6, ticket: "0428", studentName: "Ananya Iyer", studentId: "CHRIST2024006", room: "402-A", block: "Jonas Hall", date: "2026-07-14", items: 10, status: "submitted", total: "Rs.150", timeSlot: "9:00 AM - 11:00 AM" },
    { id: 7, ticket: "0429", studentName: "Karthik Nair", studentId: "CHRIST2024007", room: "215-C", block: "Christ Hall A", date: "2026-07-13", items: 6, status: "picked_up", total: "Rs.90", timeSlot: "11:00 AM - 1:00 PM" },
    { id: 8, ticket: "0430", studentName: "Meera Joshi", studentId: "CHRIST2024008", room: "108-B", block: "Devadan Hall", date: "2026-07-13", items: 9, status: "washing", total: "Rs.135", timeSlot: "2:00 PM - 4:00 PM" },
  ]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const updateStatus = (id: number, newStatus: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const getNextStatus = (current: string) => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  const filteredRequests = requests.filter(r => {
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    const matchesSearch = searchQuery === "" || 
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ticket.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const stats = {
    totalToday: requests.filter(r => r.date === "2026-07-15").length,
    pending: requests.filter(r => r.status === "submitted").length,
    inProgress: requests.filter(r => r.status === "picked_up" || r.status === "washing").length,
    ready: requests.filter(r => r.status === "ready").length,
    delivered: requests.filter(r => r.status === "delivered").length,
    totalRevenue: requests.reduce((a, r) => a + parseInt(r.total.replace("Rs.", "")), 0),
  };

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
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-purple-500/20 text-slate-300 hover:text-white hover:border-purple-500/40 transition-all text-sm">
            <Download className="w-4 h-4" /> Export
          </button>
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
                        <span className="font-mono font-bold text-white">#{req.ticket}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-white text-sm">{req.studentName}</p>
                        <p className="text-xs text-slate-500">{req.studentId}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-sm text-white">{req.room}</p>
                        <p className="text-xs text-slate-500">{req.block}</p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="text-sm text-white">{formatDate(req.date)}</p>
                        <p className="text-xs text-slate-500">{req.timeSlot}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-white font-medium">{req.items}</span>
                        <span className="text-xs text-slate-500 ml-1">({req.total})</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_LABELS[req.status]?.bg || ""}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_LABELS[req.status]?.color?.replace("text-", "bg-") || "bg-slate-500"}`} />
                          {STATUS_LABELS[req.status]?.label || req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {nextStatus ? (
                          <button
                            onClick={() => updateStatus(req.id, nextStatus)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 transition-all"
                          >
                            Mark {STATUS_LABELS[nextStatus]?.label || nextStatus}
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

        {/* Analytics Preview */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-slate-900/50 border border-purple-500/10 p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" /> Weekly Volume
            </h3>
            <div className="flex items-end gap-2 h-32">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                const heights = [45, 62, 38, 78, 55, 30, 25];
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-purple-500/20 rounded-t-lg relative group" style={{ height: `${heights[i]}%` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/40 to-purple-400/20 rounded-t-lg" />
                    </div>
                    <span className="text-xs text-slate-500">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-900/50 border border-purple-500/10 p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-400" /> Top Blocks
            </h3>
            <div className="space-y-3">
              {[
                { block: "Jonas Hall", count: 234, pct: 85 },
                { block: "Christ Hall A", count: 156, pct: 60 },
                { block: "St. Kuriakose", count: 98, pct: 40 },
                { block: "Devadan Hall", count: 67, pct: 25 },
              ].map(item => (
                <div key={item.block}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{item.block}</span>
                    <span className="text-white font-medium">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
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