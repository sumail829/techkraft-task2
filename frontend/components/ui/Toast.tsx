"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={[
        "fixed bottom-8 right-8 z-50 max-w-xs px-5 py-3 rounded-btn text-sm font-medium text-white shadow-lg",
        "animate-[slideUp_0.3s_ease]",
        type === "success" ? "bg-sage" : "bg-terracotta",
      ].join(" ")}
      style={{ animation: "slideUp 0.3s ease" }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
      {type === "success" ? "✓ " : "✕ "}
      {message}
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const show = (message: string, type: "success" | "error" = "success") =>
    setToast({ message, type });

  const hide = () => setToast(null);

  const ToastEl = toast ? (
    <Toast message={toast.message} type={toast.type} onClose={hide} />
  ) : null;

  return { show, ToastEl };
}