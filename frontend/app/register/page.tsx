"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { show, ToastEl } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      show("Account created! Please sign in.", "success");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: unknown) {
      show(err instanceof Error ? err.message : "Registration failed", "error");
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
               Broker-app
            </Link>
          </div>

     
          <div className="bg-surface border border-border rounded-card p-8">
            <h2 className="font-serif text-2xl mb-1">Create account</h2>
            <p className="text-stone text-sm mb-7">
              Already have an account?{" "}
              <Link href="/login" className="text-ink font-medium underline">
                Sign in
              </Link>
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

              
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-stone mb-1.5" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Alex Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-btn bg-surface text-ink text-sm placeholder:text-stone focus:outline-none focus:border-clay focus:ring-2 focus:ring-clay/20 transition-all"
                />
                {errors.name && (
                  <p className="text-terracotta text-xs mt-1">{errors.name}</p>
                )}
              </div>


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

              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-stone mb-1.5" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Min. 6 characters"
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
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-stone mt-5">
            By signing up you agree to our Terms &amp; Privacy Policy.
          </p>
        </div>
      </main>
    </>
  );
}