import React from "react";
import { cn } from "@/lib/utils";

export function AnimatedGlassBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-background">
      {/* Soft ambient orbs */}
      <div className="absolute top-[-8%] left-[-8%] w-[45%] h-[45%] rounded-full bg-white/[0.04] blur-[120px] animate-[orb-drift-1_22s_infinite_alternate_ease-in-out]" />
      <div className="absolute top-[55%] right-[-5%] w-[35%] h-[55%] rounded-full bg-white/[0.04] blur-[140px] animate-[orb-drift-2_28s_infinite_alternate_ease-in-out]" />
      <div className="absolute top-[15%] right-[15%] w-[28%] h-[28%] rounded-full bg-white/[0.03] blur-[100px] animate-[orb-drift-3_24s_infinite_alternate_ease-in-out]" />
      <div className="absolute bottom-[-8%] left-[15%] w-[38%] h-[38%] rounded-full bg-white/[0.04] blur-[120px] animate-[orb-drift-1_26s_infinite_alternate_ease-in-out]" />
    </div>
  );
}

export function GlassCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10 bg-black/[0.22] backdrop-blur-xl p-6 overflow-hidden",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.22)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlowButton({
  className,
  variant = "primary",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "accent" | "ghost" | "danger";
}) {
  const variants = {
    primary:   "bg-white/[0.08] text-white border-white/15 hover:bg-white/[0.13] hover:border-white/25 hover:shadow-[0_0_16px_rgba(255,255,255,0.08)]",
    accent:    "bg-white/[0.08] text-white border-white/15 hover:bg-white/[0.13] hover:border-white/25 hover:shadow-[0_0_16px_rgba(255,255,255,0.08)]",
    secondary: "bg-white/[0.06] text-white/80 border-white/10 hover:bg-white/[0.10] hover:border-white/20 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]",
    ghost:     "bg-transparent text-white/50 hover:text-white hover:bg-white/[0.05] border-transparent",
    danger:    "bg-white/[0.08] text-white border-white/15 hover:bg-white/[0.13] hover:border-white/25 hover:shadow-[0_0_16px_rgba(255,255,255,0.08)]",
  };
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function StatusBadge({
  status,
  variant = "default",
  className,
  children,
}: {
  status?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border bg-white/[0.08] text-white/70 border-white/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        className
      )}
    >
      {children || status}
    </span>
  );
}
