"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shirt, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call - replace with actual Supabase auth
    setTimeout(() => {
      if (studentId.length < 5) {
        setError("Invalid Student ID");
        setLoading(false);
        return;
      }
      // Store auth token
      localStorage.setItem("student_id", studentId);
      localStorage.setItem("user_type", studentId.startsWith("ADMIN") ? "admin" : "student");

      if (studentId.startsWith("ADMIN")) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-4">
            <Shirt className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-violet-400 bg-clip-text text-transparent">
            LaundryEase
          </h1>
          <p className="text-slate-400 text-sm mt-1">Christ University Hostel Management</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-slate-900/80 border border-purple-500/20 p-8 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Student ID / Admin ID
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-purple-500/30 text-white placeholder-slate-500 focus:border-purple-400 input-glow outline-none transition-all"
                placeholder="e.g., CHRIST2024001"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Use ADMIN prefix for admin access</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-950 border border-purple-500/30 text-white placeholder-slate-500 focus:border-purple-400 input-glow outline-none transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-purple-500/10 text-center">
            <p className="text-sm text-slate-500">
              New student?{" "}
              <button className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                Contact Hostel Office
              </button>
            </p>
          </div>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-600">
            Demo: Use "CHRIST2024001" (student) or "ADMIN001" (admin)
          </p>
        </div>
      </div>
    </div>
  );
}