import { motion } from "motion/react";
import { ArrowRight, Play, Brain, Award, Briefcase, Trophy, Code2, MessageSquare } from "lucide-react";

const memoryUpdates = [
  { icon: Award, text: "AWS Certification Added", time: "just now" },
  { icon: MessageSquare, text: "Interview Feedback Learned", time: "2m ago" },
  { icon: Briefcase, text: "Career Goal Updated", time: "5m ago" },
  { icon: Trophy, text: "Hackathon Achievement Stored", time: "12m ago" },
];

const orbitNodes = [
  { label: "Skills", icon: Code2, angle: 0 },
  { label: "Projects", icon: Briefcase, angle: 60 },
  { label: "Certifications", icon: Award, angle: 120 },
  { label: "Hackathons", icon: Trophy, angle: 180 },
  { label: "Internships", icon: Briefcase, angle: 240 },
  { label: "Interviews", icon: MessageSquare, angle: 300 },
];

export function Hero() {
  return (
    <section className="relative pt-36 pb-24 lg:pt-44 lg:pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-purple opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-electric-purple" />
              </span>
              <span className="text-soft-gray">
                Now in private beta — <span className="text-white">join the waitlist</span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
            >
              Build Your{" "}
              <span className="text-gradient-purple">Digital Career Twin</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-soft-gray"
            >
              An AI that remembers every achievement, interview, skill, certification,
              project, and career goal — becoming smarter with every interaction.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <button className="group relative overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium text-white shadow-glow transition hover:shadow-glow-lg">
                <span className="absolute inset-0 bg-gradient-to-r from-royal-purple to-electric-purple" />
                <span className="relative flex items-center gap-2">
                  Get Early Access
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </button>
              <button className="group flex items-center gap-3 rounded-full glass px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/10">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10">
                  <Play className="h-3 w-3 fill-white text-white" />
                </span>
                Watch Demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-12 grid grid-cols-3 gap-6 border-t border-white/5 pt-8 max-w-md"
            >
              {[
                { v: "12K+", l: "Beta users" },
                { v: "98%", l: "Recall accuracy" },
                { v: "4.9★", l: "Early ratings" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-semibold text-white">{s.v}</div>
                  <div className="text-xs text-soft-gray">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Brain orbit visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="relative h-[560px]"
          >
            {/* Glow orb behind */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-royal-purple/30 blur-3xl" />

            {/* Orbital circles */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative h-[420px] w-[420px]">
                <div className="absolute inset-0 rounded-full border border-electric-purple/20 animate-spin-slow" />
                <div className="absolute inset-8 rounded-full border border-electric-purple/15" />
                <div className="absolute inset-16 rounded-full border border-electric-purple/10" />

                {/* Center brain */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-royal-purple to-electric-purple animate-pulse-glow">
                    <Brain className="h-14 w-14 text-white" />
                    <div className="absolute inset-0 rounded-full border border-white/30" />
                  </div>
                </div>

                {/* Orbit nodes */}
                {orbitNodes.map((node, i) => {
                  const radius = 210;
                  const rad = (node.angle * Math.PI) / 180;
                  const x = Math.cos(rad) * radius;
                  const y = Math.sin(rad) * radius;
                  const Icon = node.icon;
                  return (
                    <motion.div
                      key={node.label}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                      className="absolute left-1/2 top-1/2"
                      style={{
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      }}
                    >
                      <div className="flex flex-col items-center gap-2 animate-float" style={{ animationDelay: `${i * 0.4}s` }}>
                        <div className="grid h-12 w-12 place-items-center rounded-xl glass-strong shadow-glow">
                          <Icon className="h-5 w-5 text-violet-glow" />
                        </div>
                        <span className="text-xs text-soft-gray">{node.label}</span>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Connection lines (SVG) */}
                <svg className="absolute inset-0 h-full w-full" viewBox="-210 -210 420 420">
                  {orbitNodes.map((n, i) => {
                    const rad = (n.angle * Math.PI) / 180;
                    const x = Math.cos(rad) * 210;
                    const y = Math.sin(rad) * 210;
                    return (
                      <line
                        key={i}
                        x1="0"
                        y1="0"
                        x2={x}
                        y2={y}
                        stroke="url(#linegrad)"
                        strokeWidth="1"
                        strokeDasharray="4 6"
                        className="animate-dash"
                        opacity="0.5"
                      />
                    );
                  })}
                  <defs>
                    <linearGradient id="linegrad" x1="0" x2="1">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Floating memory updates card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -right-2 bottom-4 w-72 rounded-2xl glass-strong p-4 shadow-card lg:right-0"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-white">Live Memory Updates</span>
                <span className="flex items-center gap-1.5 text-[10px] text-soft-gray">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> active
                </span>
              </div>
              <div className="space-y-2">
                {memoryUpdates.map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <motion.div
                      key={m.text}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + i * 0.15 }}
                      className="flex items-center gap-3 rounded-lg bg-white/[0.03] p-2.5"
                    >
                      <div className="grid h-7 w-7 place-items-center rounded-md bg-electric-purple/15">
                        <Icon className="h-3.5 w-3.5 text-violet-glow" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-xs text-white">{m.text}</div>
                        <div className="text-[10px] text-soft-gray">{m.time}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
