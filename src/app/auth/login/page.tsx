"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back!");
        router.push("/admin");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-navy-light/20 border border-white/5 p-12 rounded-3xl backdrop-blur-xl">
        <div className="text-3xl font-bold font-outfit text-white mb-2">
          Wildpath<span className="text-accent">Africa</span>
        </div>
        <h1 className="text-xl font-bold mb-8 text-white/60">Log in to Admin Panel</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/40 mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none transition-colors"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/40 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none transition-colors"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-navy font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/40">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-accent hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
