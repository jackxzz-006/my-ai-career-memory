import { motion } from "motion/react";
import { Check, Star, ArrowRight } from "lucide-react";
import { SectionHeader } from "./features";

const predictions = [
  { label: "Cloud Engineer Readiness", value: 78, color: "#a855f7" },
  { label: "Placement Readiness", value: 86, color: "#c084fc" },
  { label: "Leadership Score", value: 64, color: "#7c3aed" },
  { label: "Learning Consistency", value: 92, color: "#a855f7" },
];

function Radial({ value, color, label }: { value: number; color: string; label: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
          <motion.circle
            cx="60"
            cy="60"
            r={r}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="font-display text-3xl font-semibold text-white">{value}</div>
            <div className="text-[10px] text-soft-gray">/ 100</div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center text-sm text-white">{label}</div>
    </div>
  );
}

export function FuturePredictor() {
  return (
    <section id="roadmap" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Future Self Predictor"
          title={<>See Your <span className="text-gradient-purple">Future Career Path</span></>}
          subtitle="AI-modeled readiness across the dimensions that actually move your career."
        />

        <div className="mt-16 rounded-3xl glass-strong p-10">
          <div className="grid gap-10 md:grid-cols-4">
            {predictions.map((p) => (
              <Radial key={p.label} {...p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "Aarav Singh",
    role: "CS Student · IIT Bombay",
    quote:
      "It's like having a mentor who actually remembers every conversation. My interview prep went from chaotic to surgical.",
  },
  {
    name: "Maya Chen",
    role: "Frontend Engineer · ex-Stripe",
    quote:
      "CareerTwin caught a 6-month skill gap I didn't notice. Landed two senior offers in five weeks.",
  },
  {
    name: "Daniel Okafor",
    role: "PM · Series B startup",
    quote:
      "The networking memory alone is worth it. Recruiter context, follow-up timing, all there.",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Loved by early users"
          title={<>Students, job seekers, and <span className="text-gradient-purple">professionals</span></>}
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="gradient-border rounded-2xl p-7"
            >
              <div className="flex gap-0.5 text-violet-glow">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/90">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-royal-purple to-electric-purple text-sm font-medium">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t.name}</div>
                  <div className="text-xs text-soft-gray">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "For students starting out.",
    features: ["100 memories", "Basic interview log", "Skill tracking", "Resume v1"],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "$19",
    desc: "For job seekers & professionals.",
    features: [
      "Unlimited memories",
      "Interview learning brain",
      "Resume evolution",
      "Networking memory",
      "Opportunity matching",
      "Future self predictor",
    ],
    cta: "Get Pro",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For universities & teams.",
    features: ["SSO + admin", "Cohort analytics", "Custom integrations", "Dedicated success"],
    cta: "Contact sales",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Pricing"
          title={<>Simple plans that <span className="text-gradient-purple">grow with you</span></>}
          subtitle="Start free. Upgrade when your twin earns it."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                p.featured
                  ? "glass-strong shadow-glow-lg border-electric-purple/40"
                  : "glass"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-royal-purple to-electric-purple px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white shadow-glow">
                  Most popular
                </div>
              )}
              <div className="text-sm text-soft-gray">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-5xl font-semibold text-white">{p.price}</span>
                {p.price !== "Custom" && <span className="text-sm text-soft-gray">/mo</span>}
              </div>
              <p className="mt-2 text-sm text-soft-gray">{p.desc}</p>

              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/90">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-electric-purple/15">
                      <Check className="h-3 w-3 text-violet-glow" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full rounded-full py-3 text-sm font-medium transition ${
                  p.featured
                    ? "bg-gradient-to-r from-royal-purple to-electric-purple text-white shadow-glow hover:shadow-glow-lg"
                    : "glass text-white hover:bg-white/10"
                }`}
              >
                {p.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section id="contact" className="relative py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-12 text-center md:p-20">
          <div className="absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-electric-purple/30 blur-3xl" />
          <div className="absolute -bottom-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-royal-purple/30 blur-3xl" />

          <div className="relative">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl font-semibold tracking-tight md:text-6xl"
            >
              Start Building Your <br />
              <span className="text-gradient-purple">Career Twin Today</span>
            </motion.h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-soft-gray">
              Turn every achievement into future opportunities. Your professional memory that
              never forgets.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button className="group relative overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium text-white shadow-glow transition hover:shadow-glow-lg">
                <span className="absolute inset-0 bg-gradient-to-r from-royal-purple to-electric-purple" />
                <span className="relative flex items-center gap-2">
                  Get Early Access <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </button>
              <button className="rounded-full glass px-7 py-3.5 text-sm font-medium text-white hover:bg-white/10">
                Book a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustedBy() {
  const items = ["Stanford", "MIT", "Y Combinator", "TechCrunch", "Devpost", "AngelList"];
  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center text-xs uppercase tracking-[0.2em] text-soft-gray">
          Trusted by students, startups & career communities
        </div>
        <div className="mt-8 grid grid-cols-2 items-center gap-8 opacity-60 md:grid-cols-6">
          {items.map((n) => (
            <div
              key={n}
              className="text-center font-display text-lg font-medium text-white/70 transition hover:text-white"
            >
              {n}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const cols = [
    { title: "Product", links: ["Features", "How It Works", "Pricing", "Roadmap"] },
    { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
    { title: "Legal", links: ["Privacy Policy", "Terms", "Security", "Cookies"] },
  ];
  return (
    <footer className="relative border-t border-white/5 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-royal-purple to-electric-purple shadow-glow">
                <Star className="h-4 w-4 fill-white text-white" />
              </div>
              <span className="font-display text-lg font-semibold">
                CareerTwin <span className="text-gradient-purple">AI</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-soft-gray">
              Your professional memory that never forgets. Built for the next decade of work.
            </p>
            <div className="mt-6 flex gap-3">
              {["X", "in", "GH", "✦"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full glass text-xs text-white hover:bg-white/10"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-sm font-medium text-white">{c.title}</div>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-soft-gray hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-soft-gray">
          <div>© {new Date().getFullYear()} CareerTwin AI. All rights reserved.</div>
          <div>Made with persistent memory.</div>
        </div>
      </div>
    </footer>
  );
}
