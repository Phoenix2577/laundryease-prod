"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import {
  Shirt, LogOut, Package, Clock, History, Star, Plus,
  MapPin, Phone, Calendar, CheckCircle2, Circle, Loader2,
  Truck, Home, Sparkles, ChevronRight, Bell
} from "lucide-react";

const statusSteps = [
  { key: "submitted", label: "Submitted", icon: Package, color: "text-yellow-400", bg: "bg-yellow-500/20" },
  { key: "picked_up", label: "Picked Up", icon: Truck, color: "text-blue-400", bg: "bg-blue-500/20" },
  { key: "washing", label: "Washing", icon: Sparkles, color: "text-cyan-400", bg: "bg-cyan-500/20" },
  { key: "ready", label: "Ready", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/20" },
  { key: "delivered", label: "Delivered", icon: Home, color: "text-purple-400", bg: "bg-purple-500/20" },
];

export default function StudentDashboard() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUser(session.user);

      const { data: studentData } = await supabase
        .from("students")
        .select("*")
        .eq("email", session.user.email)
        .single();

      setStudent(studentData);

      const { data: requestsData } = await supabase
        .from("laundry_requests")
        .select("*, status_history(*)")
        .eq("student_id", studentData?.id)
        .order("created_at", { ascending: false });

      setRequests(requestsData || []);
      
      // Find the most recent non-delivered request for tracking
      const active = requestsData?.find((r: any) => r.status !== "delivered" && r.status !== "cancelled");
      setActiveRequest(active || null);

      // Fetch notifications
      const { data: notifData } = await supabase
        .from("notifications")
        .select("*")
        .eq("student_id", studentData?.id)
        .order("sent_at", { ascending: false })
        .limit(5);

      setNotifications(notifData || []);
      setLoading(false);
    };

    fetchData();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const getStatusIndex = (status: string) => statusSteps.findIndex(s => s.key === status);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
              <Shirt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">LaundryEase</h1>
              <p className="text-xs text-slate-400">Christ University</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {notifications.some(n => !n.is_read) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <div className="hidden sm:block text-right">
              <p className="text-sm text-white font-medium">{student?.full_name}</p>
              <p className="text-xs text-slate-400">{student?.student_id} · {student?.hostel_block}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold text-white">Hello, {student?.full_name?.split(" ")[0]}! 👋</h2>
          <p className="text-slate-400 mt-1">Here's what's happening with your laundry</p>
        </motion.div>

        {/* Active Request Tracking */}
        {activeRequest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                  Active Request #{activeRequest.ticket_number}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Submitted on {new Date(activeRequest.created_at).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${statusSteps[getStatusIndex(activeRequest.status)]?.bg} ${statusSteps[getStatusIndex(activeRequest.status)]?.color}`}>
                {activeRequest.status.replace("_", " ")}
              </span>
            </div>

            {/* Tracking Timeline */}
            <div className="relative">
              {/* Progress bar */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-slate-800 rounded-full">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(getStatusIndex(activeRequest.status) / (statusSteps.length - 1)) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>

              <div className="relative flex justify-between">
                {statusSteps.map((step, i) => {
                  const StepIcon = step.icon;
                  const isCompleted = getStatusIndex(activeRequest.status) >= i;
                  const isCurrent = getStatusIndex(activeRequest.status) === i;

                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 ${
                          isCompleted
                            ? `${step.bg} ${step.color} border-current`
                            : "bg-slate-800 text-slate-600 border-slate-700"
                        } ${isCurrent ? "ring-4 ring-purple-500/30" : ""}`}
                        animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <StepIcon className="w-5 h-5" />
                      </motion.div>
                      <p className={`text-xs mt-2 font-medium ${isCompleted ? step.color : "text-slate-600"}`}>
                        {step.label}
                      </p>
                      {isCurrent && activeRequest.status_history?.[0]?.created_at && (
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {new Date(activeRequest.status_history[0].created_at).toLocaleTimeString("en-IN", {
                            hour: "2-digit", minute: "2-digit"
                          })}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Request Details */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800">
              <div>
                <p className="text-xs text-slate-500 mb-1">Items</p>
                <p className="text-white font-medium">{activeRequest.total_items} pieces</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Wash Type</p>
                <p className="text-white font-medium">{activeRequest.wash_type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Pickup</p>
                <p className="text-white font-medium">{activeRequest.pickup_time_slot}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">OTP</p>
                <p className="text-purple-400 font-mono font-bold text-lg tracking-wider">
                  {activeRequest.delivery_otp || "Pending"}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Plus, label: "New Request", color: "from-purple-600 to-purple-500", href: "/student/submit" },
            { icon: Clock, label: "Track Status", color: "from-blue-600 to-blue-500", href: "#requests" },
            { icon: History, label: "History", color: "from-emerald-600 to-emerald-500", href: "#history" },
            { icon: Star, label: "Feedback", color: "from-amber-600 to-amber-500", href: "#feedback" },
          ].map((action, i) => (
            <motion.a
              key={action.label}
              href={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={`bg-gradient-to-br ${action.color} rounded-xl p-4 hover:opacity-90 transition-opacity group`}
            >
              <action.icon className="w-6 h-6 text-white/80 mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-white font-semibold text-sm">{action.label}</p>
            </motion.a>
          ))}
        </div>

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-400" />
              Notifications
            </h3>
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div key={notif.id} className={`flex items-start gap-3 p-3 rounded-lg ${notif.is_read ? "bg-slate-800/50" : "bg-purple-500/10 border border-purple-500/20"}`}>
                  <div className={`w-2 h-2 rounded-full mt-2 ${notif.is_read ? "bg-slate-600" : "bg-purple-400"}`} />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{notif.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{notif.message}</p>
                    <p className="text-slate-600 text-[10px] mt-1">
                      {new Date(notif.sent_at).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Request History */}
        <div id="history">
          <h3 className="text-lg font-bold text-white mb-4">Request History</h3>
          {requests.length === 0 ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No laundry requests yet</p>
              <a href="/student/submit" className="text-purple-400 hover:text-purple-300 text-sm mt-2 inline-block">
                Submit your first request →
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request, i) => {
                const statusStep = statusSteps.find(s => s.key === request.status);
                const StatusIcon = statusStep?.icon || Circle;

                return (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusStep?.bg || "bg-slate-800"}`}>
                        <StatusIcon className={`w-6 h-6 ${statusStep?.color || "text-slate-400"}`} />
                      </div>
                      <div>
                        <p className="text-white font-medium flex items-center gap-2">
                          Ticket #{request.ticket_number}
                          {request.status === "delivered" && !request.feedback_given && (
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded-full">Rate</span>
                          )}
                        </p>
                        <p className="text-sm text-slate-400">
                          {request.total_items} items · {request.wash_type}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[10px] text-slate-500">
                            <Calendar className="w-3 h-3" />
                            {new Date(request.created_at).toLocaleDateString("en-IN")}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-slate-500">
                            <MapPin className="w-3 h-3" />
                            {student?.hostel_block}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStep?.bg || "bg-slate-800"} ${statusStep?.color || "text-slate-400"}`}>
                        {request.status.replace("_", " ")}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">₹{request.cost}</p>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors ml-auto mt-1" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Student Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Your Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Hostel Block</p>
                <p className="text-white font-medium">{student?.hostel_block}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Room Number</p>
                <p className="text-white font-medium">{student?.room_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="text-white font-medium">{student?.phone || "N/A"}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
