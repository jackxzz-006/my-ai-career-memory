import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  Trophy,
  Cloud,
  Mic,
  Briefcase,
  Rocket,
  Star,
  Flame,
  Crown,
  Send,
  Sparkles,
  CheckCircle2,
  Circle,
  Calendar,
  Award,
} from "lucide-react";
import { SectionHeader } from "./features";

/* ---------- Achievement Vault ---------- */
const badges = [
  { icon: Trophy, label: "Hackathon Winner", progress: 100, color: "#fbbf24" },
  { icon: Cloud, label: "AWS Explorer", progress: 100, color: "#60a5fa" },
  { icon: Mic, label: "Event Organizer", progress: 100, color: "#c084fc" },
  { icon: Briefcase, label: "Interview Warrior", progress: 80, color: "#a855f7" },
  { icon: Rocket, label: "Startup Builder", progress: 65, color: "#f472b6" },
  { icon: Star, label: "Campus Leader", progress: 100, color: "#facc15" },
  { icon: Flame, label: "Consistency Master", progress: 92, color: "#fb923c" },
  { icon: Crown, label: "Career Titan", progress: 45, color: "#c084fc" },
];

export function AchievementVault() {
  return (
    <section id="achievements" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Achievement Vault"
          title={
            <>
              Turn Every Achievement Into Your{" "}
              <span className="text-gradient-purple">Career Legacy</span>
            </>
          }
          subtitle="Every certification, project, event, hackathon, and milestone is permanently remembered by your AI Career Twin."
        />

        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full glass-strong px-5 py-2 text-sm">
            <Award className="h-4 w-4 text-violet-glow" />
            <span className="font-display text-white">42 Achievements Collected</span>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="group gradient-border relative overflow-hidden rounded-2xl p-6 text-center"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${b.color}33, transparent 70%)`,
                  }}
                />
                <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl glass animate-pulse-glow">
                  <Icon className="h-7 w-7" style={{ color: b.color }} />
                </div>
                <div className="relative mt-4 text-sm font-medium text-white">{b.label}</div>
                <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${b.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2 + i * 0.05 }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${b.color}, #c084fc)`,
                      boxShadow: `0 0 12px ${b.color}`,
                    }}
                  />
                </div>
                <div className="relative mt-2 text-[10px] text-soft-gray">
                  {b.progress === 100 ? "Unlocked" : `${b.progress}% to unlock`}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- XP & Level System ---------- */
const levels = [
  "Explorer",
  "Learner",
  "Builder",
  "Innovator",
  "Leader",
  "Expert",
  "Career Titan",
];

export function XPSystem() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="XP & Levels"
          title={
            <>
              Level Up Your <span className="text-gradient-purple">Career</span>
            </>
          }
          subtitle="A gaming-inspired progression system that rewards every real-world career move."
        />

        <div className="mt-16 rounded-3xl glass-strong p-8 md:p-12">
          {/* Level pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {levels.map((l, i) => {
              const active = i <= 5;
              const current = i === 5;
              return (
                <div key={l} className="flex flex-1 items-center gap-3 min-w-[120px]">
                  <div
                    className={`grid h-9 w-9 place-items-center rounded-full text-xs font-semibold ${
                      current
                        ? "bg-gradient-to-br from-royal-purple to-electric-purple text-white shadow-glow animate-pulse-glow"
                        : active
                          ? "bg-electric-purple/20 text-violet-glow"
                          : "bg-white/5 text-soft-gray"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="text-xs">
                    <div
                      className={`font-medium ${
                        current ? "text-white" : active ? "text-white/80" : "text-soft-gray"
                      }`}
                    >
                      {l}
                    </div>
                    <div className="text-[10px] text-soft-gray">Lv.{i + 1}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* XP bar */}
          <div className="mt-12">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-soft-gray">Current XP</div>
                <div className="mt-1 font-display text-4xl font-semibold text-white">
                  8,450 <span className="text-base text-soft-gray">XP</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-[0.2em] text-soft-gray">Next Level</div>
                <div className="mt-1 font-display text-xl font-semibold text-gradient-purple">
                  Career Titan
                </div>
              </div>
            </div>

            <div className="relative mt-5 h-4 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "87%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: "easeOut" }}
                className="relative h-full rounded-full bg-gradient-to-r from-royal-purple via-electric-purple to-violet-glow"
                style={{ boxShadow: "0 0 30px rgba(168,85,247,0.7)" }}
              >
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2.4s linear infinite",
                  }}
                />
              </motion.div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-soft-gray">
              <span>87% to next level</span>
              <span>1,550 XP remaining</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Career DNA ---------- */
const dna = [
  { label: "Leadership", value: 92, color: "#a855f7" },
  { label: "Innovation", value: 94, color: "#c084fc" },
  { label: "Technical", value: 88, color: "#7c3aed" },
  { label: "Communication", value: 81, color: "#a855f7" },
  { label: "Consistency", value: 90, color: "#c084fc" },
  { label: "Problem Solving", value: 86, color: "#7c3aed" },
];

function DnaRadial({ value, color, label }: { value: number; color: string; label: string }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <defs>
            <linearGradient id={`g-${label}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="10" fill="none" />
          <motion.circle
            cx="60"
            cy="60"
            r={r}
            stroke={`url(#g-${label})`}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 10px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="font-display text-2xl font-semibold text-white">{value}%</div>
        </div>
      </div>
      <div className="mt-3 text-sm text-white/90">{label}</div>
    </div>
  );
}

export function CareerDNA() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="AI Career DNA"
          title={
            <>
              Discover Your <span className="text-gradient-purple">Career DNA</span>
            </>
          }
          subtitle="A multi-dimensional map of who you are as a professional — synthesized in real time."
        />

        <div className="mt-16 rounded-3xl glass-strong p-10">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {dna.map((d) => (
              <DnaRadial key={d.label} {...d} />
            ))}
          </div>
          <div className="mt-10 text-center text-sm text-soft-gray">
            Generated from{" "}
            <span className="text-violet-glow">500+ career memories</span> stored by your AI Twin.
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Hall of Fame ---------- */
const leaderboard = [
  { rank: 1, name: "Rahul Sharma", xp: 12450, medal: "#fbbf24", title: "Top Innovator" },
  { rank: 2, name: "Priya Patel", xp: 11800, medal: "#d1d5db", title: "Top Leader" },
  { rank: 3, name: "Jagadheeshwari", xp: 10920, medal: "#f59e0b", title: "Top Builder" },
  { rank: 4, name: "Arjun Mehta", xp: 9870, medal: "#a855f7", title: "Top Hackathon Champ" },
  { rank: 5, name: "Sara Lin", xp: 9540, medal: "#a855f7", title: "Top Cloud Engineer" },
];

export function HallOfFame() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Career Hall of Fame"
          title={
            <>
              Compete With The <span className="text-gradient-purple">Best</span>
            </>
          }
          subtitle="A live leaderboard of the most relentless career builders on the platform."
        />

        {/* Podium */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 items-end gap-4">
          {[leaderboard[1], leaderboard[0], leaderboard[2]].map((p, idx) => {
            const heights = ["h-32", "h-44", "h-24"];
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="flex flex-col items-center"
              >
                <div
                  className="grid h-16 w-16 place-items-center rounded-full font-display text-xl font-semibold text-white shadow-glow"
                  style={{
                    background: `linear-gradient(135deg, ${p.medal}, #7c3aed)`,
                    boxShadow: `0 0 30px ${p.medal}80`,
                  }}
                >
                  {p.rank}
                </div>
                <div className="mt-3 text-sm font-medium text-white text-center">{p.name}</div>
                <div className="text-[11px] text-soft-gray">{p.xp.toLocaleString()} XP</div>
                <div
                  className={`mt-3 w-full ${heights[idx]} rounded-t-xl glass-strong border-b-0`}
                  style={{ boxShadow: `inset 0 0 30px ${p.medal}30` }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Full list */}
        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {leaderboard.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center justify-between gap-4 rounded-2xl glass p-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className="grid h-10 w-10 place-items-center rounded-full font-semibold text-white text-sm"
                  style={{ background: `linear-gradient(135deg, ${p.medal}, #7c3aed)` }}
                >
                  #{p.rank}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{p.name}</div>
                  <div className="text-xs text-soft-gray">{p.title}</div>
                </div>
              </div>
              <div className="font-display text-lg font-semibold text-gradient-purple">
                {p.xp.toLocaleString()} XP
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Weekly Challenges ---------- */
const challenges = [
  { label: "Complete AWS Module", reward: "+300 XP", progress: 60 },
  { label: "Solve 10 Coding Problems", reward: "+500 XP", progress: 80 },
  { label: "Update Resume", reward: "Badge Unlock", progress: 40 },
  { label: "Attend Technical Event", reward: "+300 XP", progress: 100 },
  { label: "Publish LinkedIn Post", reward: "+200 XP", progress: 25 },
  { label: "Mock Interview Session", reward: "+400 XP", progress: 10 },
];

export function WeeklyChallenges() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Weekly Challenges"
          title={
            <>
              AI Generated <span className="text-gradient-purple">Career Missions</span>
            </>
          }
          subtitle="Personalized weekly missions that compound into real career outcomes."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="gradient-border rounded-2xl p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {c.progress === 100 ? (
                    <CheckCircle2 className="h-5 w-5 text-violet-glow" />
                  ) : (
                    <Circle className="h-5 w-5 text-soft-gray" />
                  )}
                  <div className="text-sm font-medium text-white">{c.label}</div>
                </div>
                <span className="shrink-0 rounded-full bg-electric-purple/15 px-2.5 py-1 text-[10px] font-medium text-violet-glow">
                  {c.reward}
                </span>
              </div>
              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${c.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.2 + i * 0.05 }}
                  className="h-full rounded-full bg-gradient-to-r from-royal-purple to-violet-glow"
                  style={{ boxShadow: "0 0 12px #a855f7" }}
                />
              </div>
              <div className="mt-2 text-[11px] text-soft-gray">{c.progress}% complete</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Career Replay ---------- */
const timeline = [
  { month: "January", title: "AWS Workshop", desc: "Cloud fundamentals & hands-on lab" },
  { month: "March", title: "BIS Event Organizer", desc: "Led 200+ attendee tech meetup" },
  { month: "May", title: "Hackathon Participant", desc: "Built AI study assistant" },
  { month: "July", title: "AWS Certification", desc: "Cloud Practitioner certified" },
  { month: "September", title: "Internship", desc: "Backend engineer at fintech" },
  { month: "December", title: "Placement Interview", desc: "Final-round at top 3 employers" },
];

export function CareerReplay() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Career Replay"
          title={
            <>
              Relive Your Entire{" "}
              <span className="text-gradient-purple">Career Journey</span>
            </>
          }
          subtitle="An interactive timeline of every memory your AI Twin has captured for you in 2026."
        />

        <div className="relative mx-auto mt-16 max-w-4xl">
          {/* center line */}
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-electric-purple/0 via-electric-purple/60 to-electric-purple/0 md:left-1/2" />

          <div className="space-y-10">
            {timeline.map((t, i) => {
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={t.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5 }}
                  className={`relative flex flex-col gap-4 md:flex-row md:items-center ${
                    left ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* dot */}
                  <div className="absolute left-4 -translate-x-1/2 md:left-1/2">
                    <div className="grid h-4 w-4 place-items-center rounded-full bg-electric-purple shadow-glow animate-pulse-glow">
                      <Calendar className="h-2 w-2 text-white" />
                    </div>
                  </div>

                  <div className="md:w-1/2" />
                  <div className="ml-10 md:ml-0 md:w-1/2 md:px-8">
                    <div className="gradient-border rounded-2xl p-5">
                      <div className="text-xs uppercase tracking-[0.18em] text-violet-glow">
                        {t.month} 2026
                      </div>
                      <div className="mt-2 font-display text-lg font-semibold text-white">
                        {t.title}
                      </div>
                      <div className="mt-1 text-sm text-soft-gray">{t.desc}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 text-center text-sm text-soft-gray">
            Your AI Twin <span className="text-violet-glow">remembers every step.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Future Self AI Chat ---------- */
export function FutureSelfAI() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Future Self AI"
          title={
            <>
              Meet Your <span className="text-gradient-purple">Future Self</span>
            </>
          }
          subtitle="A conversational AI that thinks five years ahead — informed by every memory you've made."
        />

        <div className="mx-auto mt-16 max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl glass-strong p-8">
            <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-electric-purple/30 blur-3xl" />

            {/* AI avatar */}
            <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-royal-purple to-electric-purple shadow-glow animate-pulse-glow">
              <Sparkles className="h-9 w-9 text-white" />
            </div>
            <div className="relative mt-3 text-center text-xs uppercase tracking-[0.2em] text-soft-gray">
              CareerTwin · Future Self · Online
            </div>

            <div className="relative mt-8 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-royal-purple to-electric-purple px-4 py-3 text-sm text-white shadow-glow"
              >
                What should I focus on next?
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="max-w-[85%] rounded-2xl rounded-tl-sm glass px-4 py-3 text-sm text-white/90"
              >
                Based on your certifications, leadership activities, and hackathon experience,{" "}
                <span className="text-violet-glow">Kubernetes and DevOps</span> will accelerate
                your Cloud Engineer journey. I'd recommend a 6-week ramp starting this Sunday.
              </motion.div>
            </div>

            <div className="relative mt-8 flex items-center gap-3 rounded-full glass px-4 py-3">
              <input
                disabled
                placeholder="Ask your future self anything…"
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-soft-gray"
              />
              <button className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-royal-purple to-electric-purple shadow-glow">
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Memory Graph ---------- */
const graphNodes = [
  { id: "you", label: "You", x: 50, y: 50, r: 26, core: true },
  { id: "skills", label: "Skills", x: 18, y: 22 },
  { id: "projects", label: "Projects", x: 82, y: 22 },
  { id: "certs", label: "Certifications", x: 88, y: 55 },
  { id: "events", label: "Events", x: 78, y: 84 },
  { id: "hacks", label: "Hackathons", x: 50, y: 92 },
  { id: "intern", label: "Internships", x: 22, y: 84 },
  { id: "interviews", label: "Interviews", x: 12, y: 55 },
  { id: "goals", label: "Career Goals", x: 50, y: 10 },
];

export function MemoryGraph() {
  const links = graphNodes.filter((n) => !n.core).map((n) => ({ from: "you", to: n.id }));
  const byId = Object.fromEntries(graphNodes.map((n) => [n.id, n]));

  return (
    <section id="memory-graph" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Memory Graph"
          title={
            <>
              Visualize Your{" "}
              <span className="text-gradient-purple">Professional Growth</span>
            </>
          }
          subtitle="Every memory becomes a node. Every connection becomes intelligence."
        />

        <div className="relative mx-auto mt-16 aspect-square w-full max-w-3xl overflow-hidden rounded-3xl glass-strong p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18),transparent_70%)]" />

          <svg viewBox="0 0 100 100" className="relative h-full w-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="linkGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#c084fc" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
              </linearGradient>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="1" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.4" />
              </radialGradient>
            </defs>

            {/* Links */}
            {links.map((l, i) => {
              const a = byId[l.from];
              const b = byId[l.to];
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="url(#linkGrad)"
                  strokeWidth="0.3"
                  strokeDasharray="2 2"
                  className="animate-dash"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              );
            })}

            {/* Nodes */}
            {graphNodes.map((n, i) => (
              <g key={n.id}>
                <motion.circle
                  cx={n.x}
                  cy={n.y}
                  r={n.core ? 5 : 3}
                  fill="url(#nodeGlow)"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  style={{ filter: "drop-shadow(0 0 4px #c084fc)" }}
                />
                {n.core && (
                  <motion.circle
                    cx={n.x}
                    cy={n.y}
                    r={8}
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="0.3"
                    initial={{ opacity: 0.6, scale: 1 }}
                    animate={{ opacity: 0, scale: 2.2 }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <text
                  x={n.x}
                  y={n.y + (n.core ? 9 : 6)}
                  textAnchor="middle"
                  fontSize={n.core ? 2.6 : 2.2}
                  fill="#ffffff"
                  fontFamily="Space Grotesk, sans-serif"
                  style={{ textShadow: "0 0 6px #7c3aed" }}
                >
                  {n.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="mt-8 text-center text-sm text-soft-gray">
          Nodes glow brighter as your memory grows.{" "}
          <span className="text-violet-glow">Connections evolve in real time.</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- Premium Final CTA ---------- */
const floatBadges = [Trophy, Cloud, Rocket, Crown, Star, Flame];

export function PremiumLegacyCTA() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section id="legacy" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div
          ref={ref}
          className="relative overflow-hidden rounded-[2rem] glass-strong p-12 text-center md:p-20"
        >
          {/* aurora */}
          <div className="absolute -top-60 left-1/2 h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-electric-purple/30 blur-3xl animate-aurora" />
          <div className="absolute -bottom-60 right-0 h-[40rem] w-[40rem] rounded-full bg-royal-purple/30 blur-3xl animate-aurora-2" />

          {/* floating badges */}
          {mounted &&
            floatBadges.map((Icon, i) => {
              const positions = [
                { top: "10%", left: "8%" },
                { top: "18%", right: "10%" },
                { top: "60%", left: "5%" },
                { top: "70%", right: "8%" },
                { top: "30%", left: "85%" },
                { top: "85%", left: "40%" },
              ];
              return (
                <div
                  key={i}
                  className="pointer-events-none absolute hidden md:block"
                  style={{
                    ...positions[i],
                    animation: `float-y ${4 + i}s ease-in-out ${i * 0.4}s infinite`,
                  }}
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl glass animate-pulse-glow">
                    <Icon className="h-5 w-5 text-violet-glow" />
                  </div>
                </div>
              );
            })}

          {/* Brain core */}
          <div className="relative mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-royal-purple to-electric-purple shadow-glow-lg animate-pulse-glow">
            <Sparkles className="h-11 w-11 text-white" />
            <div className="absolute inset-0 rounded-full border border-white/20 animate-spin-slow" />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mt-8 font-display text-4xl font-semibold tracking-tight md:text-6xl"
          >
            Build Your{" "}
            <span className="text-gradient-purple">Digital Career Legacy</span>
          </motion.h2>
          <p className="relative mx-auto mt-6 max-w-xl text-lg text-soft-gray">
            Your achievements deserve more than a resume. Create an AI Twin that remembers,
            learns, and grows with you — forever.
          </p>
          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
            <button className="group relative overflow-hidden rounded-full px-8 py-4 text-sm font-medium text-white shadow-glow-lg transition hover:scale-[1.03]">
              <span className="absolute inset-0 bg-gradient-to-r from-royal-purple to-electric-purple" />
              <span className="relative flex items-center gap-2">
                Start Your Career Twin
              </span>
            </button>
            <button className="rounded-full glass px-8 py-4 text-sm font-medium text-white hover:bg-white/10">
              Join Early Access
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
