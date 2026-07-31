"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import { Shirt, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [role, setRole] = useState<"student" | "admin">("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let email = identifier;

      if (role === "student") {
        // Lookup student email via API route (bypasses RLS)
        const response = await fetch("/api/student-lookup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: identifier }),
        });

        if (!response.ok) {
          setError("Student ID not found");
          setLoading(false);
          return;
        }

        const data = await response.json();
        email = data.email;
      }

      // Sign in with Supabase Auth
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Redirect based on role
      if (role === "student") {
        router.push("/student/dashboard");
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Shirt className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">LaundryEase</h1>
          <p className="text-slate-400 mt-1">Christ University</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-8">
          {/* Role Toggle */}
          <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
            <button
              onClick={() => setRole("student")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                role === "student"
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                role === "admin"
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                {role === "student" ? "Student ID" : "Email"}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={role === "student" ? "CHRIST2024001" : "admin@christuniversity.in"}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
