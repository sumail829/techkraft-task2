"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const { show, ToastEl } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

 
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form);
      setAuth(data.user, data.token);
      show("Welcome back!", "success");
      setTimeout(() => router.push("/dashboard"), 800);
    } catch (err: unknown) {
      show(err instanceof Error ? err.message : "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {ToastEl}
      <main className="min-h-screen flex items-center justify-center px-4 bg-cream">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <Link href="/" className="font-serif text-2xl text-ink no-underline">
              🏡 Nestly
            </Link>
          </div>

          
          <div className="bg-surface border border-border rounded-card p-8">
            <h2 className="font-serif text-2xl mb-1">Sign in</h2>
            <p className="text-stone text-sm mb-7">
              New here?{" "}
              <Link href="/register" className="text-ink font-medium underline">
                Create an account
              </Link>
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">


              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-stone mb-1.5" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="alex@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-btn bg-surface text-ink text-sm placeholder:text-stone focus:outline-none focus:border-clay focus:ring-2 focus:ring-clay/20 transition-all"
                />
                {errors.email && (
                  <p className="text-terracotta text-xs mt-1">{errors.email}</p>
                )}
              </div>

           =
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-stone mb-1.5" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-btn bg-surface text-ink text-sm placeholder:text-stone focus:outline-none focus:border-clay focus:ring-2 focus:ring-clay/20 transition-all"
                />
                {errors.password && (
                  <p className="text-terracotta text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-ink text-cream rounded-btn text-sm font-medium hover:bg-ink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-1"
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}