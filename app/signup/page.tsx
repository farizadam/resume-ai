"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setIsLoading(false);
        return;
      }

      // Automatically log in after successful registration
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        setError(signInRes.error);
        setIsLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-glass-border relative z-10">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white tracking-tight">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Join us and start building your resume
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm font-medium text-center border border-red-500/20">
              {error}
            </div>
          )}
          
          <div className="space-y-4 rounded-md">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full rounded-lg bg-glass-bg border border-glass-border px-3 py-2 text-sm text-white placeholder:text-text-muted focus:border-ai-primary focus:outline-none focus:ring-1 focus:ring-ai-primary transition-colors"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Email address</label>
              <input
                type="email"
                required
                className="w-full rounded-lg bg-glass-bg border border-glass-border px-3 py-2 text-sm text-white placeholder:text-text-muted focus:border-ai-primary focus:outline-none focus:ring-1 focus:ring-ai-primary transition-colors"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full rounded-lg bg-glass-bg border border-glass-border px-3 py-2 text-sm text-white placeholder:text-text-muted focus:border-ai-primary focus:outline-none focus:ring-1 focus:ring-ai-primary transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                minLength={6}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-space-950 bg-white hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-70 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-space-950" />
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-white hover:text-slate-300 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
