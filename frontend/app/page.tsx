"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push("/dashboard");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-stone text-sm">Loading…</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-cream">
      <div className="text-center max-w-lg">
        <div className="text-5xl mb-4">🏡</div>
        <h1 className="font-serif text-5xl mb-3 text-ink">Nestly</h1>
        <p className="text-stone text-lg leading-relaxed mb-10">
          Your personal buyer portal. Save properties, track favourites, and
          find your dream home.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-7 py-3 bg-ink text-cream rounded-btn text-sm font-medium hover:bg-ink/90 transition-colors"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 border border-border text-stone rounded-btn text-sm hover:border-clay hover:text-ink transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}