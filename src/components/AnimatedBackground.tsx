import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full animate-float animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, hsla(var(--primary), 0.08) 0%, transparent 70%)",
          animationDelay: "0s",
        }}
      />
      <div
        className="absolute top-1/3 -left-40 w-[400px] h-[400px] rounded-full animate-float animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, hsla(var(--ai-purple), 0.06) 0%, transparent 70%)",
          animationDelay: "2s",
        }}
      />
      <div
        className="absolute -bottom-20 right-1/4 w-[350px] h-[350px] rounded-full animate-float animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, hsla(var(--mint), 0.05) 0%, transparent 70%)",
          animationDelay: "4s",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}
