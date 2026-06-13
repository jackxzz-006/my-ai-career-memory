import { motion } from "motion/react";
import {
  Brain,
  MessageSquare,
  FileText,
  Users,
  Trophy,
  Target,
  Database,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Career Memory Engine",
    desc: "Stores skills, projects, certifications, internships, and career goals — forever.",
    bullets: ["Skills", "Projects", "Certifications"],
  },
  {
    icon: MessageSquare,
    title: "Interview Learning Brain",
    desc: "Remembers every question asked, weak area, and feedback to make you sharper next time.",
    bullets: ["Questions asked", "Weak areas", "Feedback received"],
  },
  {
    icon: FileText,
    title: "Resume Evolution Engine",
    desc: "Tracks resume versions and interview response rates to compound improvements.",
    bullets: ["Resume versions", "Response rates", "Improvements"],
  },
  {
    icon: Users,
    title: "Networking Memory",
    desc: "Recruiters met, events attended, follow-ups due — never lose context again.",
    bullets: ["Recruiters", "Events", "Follow-ups"],
  },
  {
    icon: Trophy,
    title: "Hackathon Intelligence",
    desc: "Projects built, judge feedback, and team collaborations — your portfolio remembers.",
    bullets: ["Projects", "Judge feedback", "Teams"],
  },
  {
    icon: Target,
    title: "Skill Gap Analyzer",
    desc: "Surfaces missing skills, builds a learning roadmap, scores job readiness.",
    bullets: ["Missing skills", "Roadmap", "Job readiness"],
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Features"
          title={<>A Career Coach That <span className="text-gradient-purple">Never Forgets</span></>}
          subtitle="Six persistent intelligence layers that compound your career memory over time."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="group relative overflow-hidden rounded-2xl glass p-7 transition-all duration-500 hover:-translate-y-1 hover:border-electric-purple/40"
              >
                {/* hover glow */}
                <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(400px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(168,85,247,0.15), transparent 40%)",
                  }}
                />
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-electric-purple/20 blur-3xl opacity-0 transition duration-500 group-hover:opacity-100" />

                <div className="relative">
                  <div className="mb-5 inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-royal-purple/30 to-electric-purple/20 border border-electric-purple/30">
                    <Icon className="h-5 w-5 text-violet-glow" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-soft-gray">{f.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {f.bullets.map((b) => (
                      <span
                        key={b}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-soft-gray"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-3xl text-center"
    >
      <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1 text-xs text-soft-gray">
        <Sparkles className="h-3 w-3 text-violet-glow" />
        {eyebrow}
      </div>
      <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base text-soft-gray md:text-lg">{subtitle}</p>
      )}
    </motion.div>
  );
}

export { Database, TrendingUp, Shield };
