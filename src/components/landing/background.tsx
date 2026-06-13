import { useEffect, useState } from "react";

export function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
      {/* aurora blobs */}
      <div className="absolute -top-40 -left-40 h-[60rem] w-[60rem] rounded-full bg-[radial-gradient(circle_at_center,#7c3aed_0%,transparent_60%)] opacity-40 blur-3xl animate-aurora" />
      <div className="absolute top-1/3 -right-40 h-[55rem] w-[55rem] rounded-full bg-[radial-gradient(circle_at_center,#a855f7_0%,transparent_60%)] opacity-30 blur-3xl animate-aurora-2" />
      <div className="absolute bottom-0 left-1/4 h-[50rem] w-[50rem] rounded-full bg-[radial-gradient(circle_at_center,#c084fc_0%,transparent_60%)] opacity-20 blur-3xl animate-aurora" />

      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050505_90%)]" />
    </div>
  );
}

export function Particles({ count = 30 }: { count?: number }) {
  const [particles, setParticles] = useState<
    { left: string; delay: string; duration: string; size: number; opacity: number }[]
  >([]);

  useEffect(() => {
    const p = Array.from({ length: count }).map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 15}s`,
      duration: `${15 + Math.random() * 20}s`,
      size: 1 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.6,
    }));
    setParticles(p);
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute block rounded-full bg-violet-glow"
          style={{
            left: p.left,
            bottom: `-10px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            boxShadow: "0 0 8px #c084fc",
            animation: `particle-rise ${p.duration} linear ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function MouseGlow() {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return (
    <div
      className="pointer-events-none fixed -z-10 h-[40rem] w-[40rem] rounded-full opacity-30 blur-3xl transition-transform duration-100"
      style={{
        left: pos.x - 320,
        top: pos.y - 320,
        background:
          "radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)",
      }}
    />
  );
}
