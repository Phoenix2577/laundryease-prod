"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import { Shirt, LogOut, Package, Clock, History, Star } from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }

      setUser(session.user);

      // Get student profile
      const { data: studentData } = await supabase
        .from("students")
        .select("*")
        .eq("email", session.user.email)
        .single();

      setStudent(studentData);

      // Get laundry requests
      const { data: requestsData } = await supabase
        .from("laundry_requests")
        .select("*")
        .eq("student_id", studentData?.id)
        .order("created_at", { ascending: false });

      setRequests(requestsData || []);
      setLoading(false);
    };

    fetchData();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      submitted: "bg-yellow-500/20 text-yellow-400",
      picked_up: "bg-blue-500/20 text-blue-400",
      washing: "bg-cyan-500/20 text-cyan-400",
      ready: "bg-green-500/20 text-green-400",
      delivered: "bg-purple-500/20 text-purple-400",
      cancelled: "bg-red-500/20 text-red-400",
    };
    return colors[status] || "bg-slate-500/20 text-slate-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shirt className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-xl font-bold text-white">LaundryEase</h1>
              <p className="text-xs text-slate-400">Christ University</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-white font-medium">{student?.full_name}</p>
              <p className="text-xs text-slate-400">{student?.student_id}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome + Quota */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome back, {student?.full_name?.split(" ")[0]}!
          </h2>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Remaining Quota</p>
              <p className="text-lg font-bold text-white">₹{student?.laundry_quota_remaining?.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package, label: "New Request", color: "bg-purple-500/20 text-purple-400", href: "/student/submit" },
            { icon: Clock, label: "Track Status", color: "bg-blue-500/20 text-blue-400", href: "#requests" },
            { icon: History, label: "History", color: "bg-emerald-500/20 text-emerald-400", href: "#requests" },
            { icon: Star, label: "Feedback", color: "bg-amber-500/20 text-amber-400", href: "#feedback" },
          ].map((action, i) => (
            <motion.a
              key={action.label}
              href={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors group"
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5" />
              </div>
              <p className="text-white font-medium">{action.label}</p>
            </motion.a>
          ))}
        </div>

        {/* Recent Requests */}
        <div id="requests">
          <h3 className="text-lg font-bold text-white mb-4">Recent Requests</h3>
          {requests.length === 0 ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-8 text-center">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No laundry requests yet</p>
              <a href="/student/submit" className="text-purple-400 hover:text-purple-300 text-sm mt-2 inline-block">
                Submit your first request →
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Ticket #{request.ticket_number}</p>
                      <p className="text-sm text-slate-400">
                        {request.total_items} items · {request.wash_type}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(request.status)}`}>
                      {request.status.replace("_", " ")}
                    </span>
                    <p className="text-sm text-slate-400 mt-1">₹{request.cost}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
