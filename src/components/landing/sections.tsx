import { motion } from "motion/react";
import { Link2, Cpu, Sparkles, Star, Check } from "lucide-react";
import { SectionHeader } from "./features";

const steps = [
  {
    n: "01",
    icon: Link2,
    title: "Connect Your Career Data",
    desc: "Resumes, LinkedIn, GitHub, certificates, interview notes — feed everything once. CareerTwin parses and structures it.",
  },
  {
    n: "02",
    icon: Cpu,
    title: "AI Builds Your Career Memory",
    desc: "Persistent vector memory captures every skill, project, and milestone with full context and chronology.",
  },
  {
    n: "03",
    icon: Sparkles,
    title: "CareerTwin Learns & Evolves",
    desc: "Every interview, achievement, and conversation makes your twin sharper, more personal, more useful.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="How It Works"
          title={<>Three steps to a <span className="text-gradient-purple">smarter career</span></>}
          subtitle="From scattered achievements to a unified career intelligence in minutes."
        />

        <div className="relative mt-20">
          {/* connector line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-electric-purple/40 to-transparent md:block" />

          <div className="space-y-16">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                  className={`grid items-center gap-8 md:grid-cols-2 ${isLeft ? "" : "md:[direction:rtl]"}`}
                >
                  <div className={`relative ${isLeft ? "md:pr-16" : "md:pl-16 md:[direction:ltr]"}`}>
                    <div className="rounded-2xl glass p-8">
                      <div className="flex items-center gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-royal-purple to-electric-purple shadow-glow">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-display text-3xl font-semibold text-white/10">{s.n}</span>
                      </div>
                      <h3 className="mt-5 font-display text-2xl font-semibold text-white">{s.title}</h3>
                      <p className="mt-3 text-soft-gray">{s.desc}</p>
                    </div>
                  </div>

                  {/* center node */}
                  <div className="relative hidden md:flex md:items-center md:justify-center md:[direction:ltr]">
                    <div className="absolute h-4 w-4 rounded-full bg-electric-purple shadow-glow" />
                    <div className="absolute h-8 w-8 rounded-full border border-electric-purple/40 animate-ping" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const months = [
  { m: "Month 1", iq: 35, label: "Generic AI suggestions" },
  { m: "Month 3", iq: 60, label: "Tailored interview prep" },
  { m: "Month 6", iq: 82, label: "Personalized roadmap" },
  { m: "Month 12", iq: 96, label: "True career co-pilot" },
];

export function MemoryEvolution() {
  return (
    <section id="memory" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Memory Evolution"
          title={<>Watch Your AI Twin <span className="text-gradient-purple">Get Smarter</span></>}
          subtitle="Generic advice on day one. A personal career strategist by month twelve."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl glass p-8"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-soft-gray">
              <span className="h-1.5 w-1.5 rounded-full bg-soft-gray" /> Before · Generic AI
            </div>
            <div className="space-y-3 text-sm">
              <Chat user="How do I land a cloud role?" />
              <Chat ai="Learn AWS basics, build a portfolio, and apply to entry-level jobs." muted />
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-2xl glass-strong p-8 shadow-glow"
          >
            <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-electric-purple/30 to-transparent opacity-50" />
            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-electric-purple/15 px-3 py-1 text-xs text-violet-glow">
                <Sparkles className="h-3 w-3" /> After · CareerTwin Memory
              </div>
              <div className="space-y-3 text-sm">
                <Chat user="How do I land a cloud role?" />
                <Chat ai='Given your AWS SAA cert (Mar), the K8s side-project on GitHub, and the 2 cloud-eng interviews where you struggled on VPC design — focus the next 3 weeks on networking deep-dives and apply to the 7 mid-level roles I matched.' />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Timeline / growth */}
        <div className="mt-16 rounded-2xl glass p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-xs text-soft-gray">Memory Intelligence Over Time</div>
              <div className="font-display text-2xl font-semibold text-white">Growth curve</div>
            </div>
            <div className="hidden items-center gap-2 text-xs text-soft-gray md:flex">
              <span className="h-2 w-2 rounded-full bg-electric-purple" /> IQ score
            </div>
          </div>

          {/* Bars */}
          <div className="grid grid-cols-4 items-end gap-4 h-48">
            {months.map((m, i) => (
              <motion.div
                key={m.m}
                initial={{ height: 0 }}
                whileInView={{ height: `${m.iq}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                className="relative rounded-t-lg bg-gradient-to-t from-royal-purple to-violet-glow shadow-glow"
              >
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-medium text-white">{m.iq}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-4 text-center">
            {months.map((m) => (
              <div key={m.m}>
                <div className="text-xs font-medium text-white">{m.m}</div>
                <div className="mt-0.5 text-[11px] text-soft-gray">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Chat({ user, ai, muted }: { user?: string; ai?: string; muted?: boolean }) {
  if (user)
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-white/10 px-4 py-2.5 text-white">
          {user}
        </div>
      </div>
    );
  return (
    <div className="flex justify-start">
      <div
        className={`max-w-[90%] rounded-2xl rounded-bl-md px-4 py-2.5 ${
          muted
            ? "bg-white/[0.04] text-soft-gray"
            : "bg-gradient-to-br from-royal-purple/30 to-electric-purple/15 text-white border border-electric-purple/30"
        }`}
      >
        {ai}
      </div>
    </div>
  );
}

// Dashboard
const skills = [
  { name: "React", pct: 92 },
  { name: "AWS", pct: 78 },
  { name: "Python", pct: 85 },
  { name: "System Design", pct: 64 },
];
const sparkData = [12, 18, 14, 22, 28, 24, 32, 38, 35, 42, 50, 58];

export function DashboardPreview() {
  return (
    <section id="demo" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Career Dashboard"
          title={<>Everything you've earned, <span className="text-gradient-purple">in one place</span></>}
          subtitle="A live command center for your career memory, opportunities, and growth."
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 overflow-hidden rounded-3xl glass-strong p-2 shadow-card"
        >
          <div className="rounded-2xl bg-[#0a0a0a] p-6">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-royal-purple to-electric-purple">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Welcome back, Aarav</div>
                  <div className="text-xs text-soft-gray">Your twin learned 4 new things this week</div>
                </div>
              </div>
              <div className="hidden gap-2 md:flex">
                {["Overview", "Skills", "Interviews", "Network"].map((t, i) => (
                  <button
                    key={t}
                    className={`rounded-lg px-3 py-1.5 text-xs ${
                      i === 0 ? "bg-electric-purple/15 text-white border border-electric-purple/30" : "text-soft-gray hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {/* Skills tracker */}
              <Widget title="Skills Tracker" sub="+3 this month">
                <div className="space-y-3">
                  {skills.map((s) => (
                    <div key={s.name}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-white">{s.name}</span>
                        <span className="text-soft-gray">{s.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-royal-purple to-violet-glow shadow-glow"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Widget>

              {/* Interview insights */}
              <Widget title="Interview Insights" sub="12 interviews tracked">
                <div className="space-y-2.5">
                  {[
                    { c: "Google", r: "System Design", s: "Strong" },
                    { c: "Stripe", r: "Frontend", s: "Practice" },
                    { c: "Anthropic", r: "AI/ML", s: "Strong" },
                  ].map((row) => (
                    <div key={row.c} className="flex items-center justify-between rounded-lg bg-white/[0.03] p-2.5 text-xs">
                      <div>
                        <div className="text-white">{row.c}</div>
                        <div className="text-[10px] text-soft-gray">{row.r}</div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] ${
                          row.s === "Strong"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-amber-500/15 text-amber-300"
                        }`}
                      >
                        {row.s}
                      </span>
                    </div>
                  ))}
                </div>
              </Widget>

              {/* Career goals + sparkline */}
              <Widget title="Career Goal Progress" sub="Senior Cloud Engineer">
                <div className="mb-4 flex items-end gap-1 h-16">
                  {sparkData.map((v, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${v * 1.5}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04, duration: 0.5 }}
                      className="flex-1 rounded-sm bg-gradient-to-t from-royal-purple to-violet-glow"
                    />
                  ))}
                </div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-white">73%</div>
                    <div className="text-[10px] text-soft-gray">Readiness score</div>
                  </div>
                  <div className="text-xs text-emerald-300">+12% mo/mo</div>
                </div>
              </Widget>

              {/* Certifications */}
              <Widget title="Certifications" sub="5 active">
                <div className="grid grid-cols-2 gap-2">
                  {["AWS SAA", "GCP ACE", "K8s CKA", "Terraform"].map((c) => (
                    <div key={c} className="flex items-center gap-2 rounded-lg bg-white/[0.03] p-2 text-xs text-white">
                      <Check className="h-3 w-3 text-emerald-400" /> {c}
                    </div>
                  ))}
                </div>
              </Widget>

              {/* Networking */}
              <Widget title="Networking Contacts" sub="3 follow-ups due">
                <div className="space-y-2">
                  {[
                    { n: "Priya M.", r: "Recruiter · Meta" },
                    { n: "James K.", r: "EM · Stripe" },
                    { n: "Sara L.", r: "Founder · YC" },
                  ].map((p) => (
                    <div key={p.n} className="flex items-center gap-3 rounded-lg bg-white/[0.03] p-2">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-royal-purple to-electric-purple text-xs font-medium text-white">
                        {p.n[0]}
                      </div>
                      <div className="text-xs">
                        <div className="text-white">{p.n}</div>
                        <div className="text-[10px] text-soft-gray">{p.r}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Widget>

              {/* Opportunity matches */}
              <Widget title="Opportunity Matches" sub="AI-ranked">
                <div className="space-y-2">
                  {[
                    { t: "Sr Cloud Engineer", c: "Datadog", m: 94 },
                    { t: "Platform Eng II", c: "Vercel", m: 88 },
                    { t: "DevOps Lead", c: "Linear", m: 81 },
                  ].map((j) => (
                    <div key={j.t} className="flex items-center justify-between rounded-lg bg-white/[0.03] p-2 text-xs">
                      <div>
                        <div className="text-white">{j.t}</div>
                        <div className="text-[10px] text-soft-gray">{j.c}</div>
                      </div>
                      <div className="flex items-center gap-1 text-violet-glow">
                        <Star className="h-3 w-3 fill-current" /> {j.m}%
                      </div>
                    </div>
                  ))}
                </div>
              </Widget>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Widget({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl glass p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <div className="text-sm font-medium text-white">{title}</div>
          <div className="text-[11px] text-soft-gray">{sub}</div>
        </div>
      </div>
      {children}
    </div>
  );
}
