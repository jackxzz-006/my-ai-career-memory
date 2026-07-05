import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getCareerRecommendations, type RecommendationPath } from "@/lib/recommend.functions";
import { Navbar } from "@/components/landing/navbar";

export const Route = createFileRoute("/_authenticated/recommend")({
  head: () => ({ meta: [{ title: "Get Recommendations — CareerTwin AI" }] }),
  component: RecommendPage,
});

function RecommendPage() {
  const run = useServerFn(getCareerRecommendations);
  const [form, setForm] = useState({
    education_level: "",
    skills: "",
    goals: "",
    constraints: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paths, setPaths] = useState<RecommendationPath[] | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPaths(null);
    try {
      const res = await run({ data: form });
      setPaths(res.paths);
      toast.success("Recommendations saved to your history");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-electric-purple/20 blur-3xl" />

      <main className="relative mx-auto max-w-4xl px-6 pb-24 pt-32">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-soft-gray">
            <Sparkles className="h-3.5 w-3.5 text-violet-glow" /> AI Career Agent
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold">
            Get your <span className="text-gradient-purple">personalized paths</span>
          </h1>
          <p className="mt-2 text-sm text-soft-gray">
            Tell CareerTwin about you — it returns 2–3 tailored career & education paths.
          </p>
          <Link to="/history" className="mt-3 inline-block text-xs text-violet-glow hover:underline">
            View past recommendations →
          </Link>
        </div>

        <form onSubmit={submit} className="rounded-3xl glass-strong p-8 space-y-5">
          <Field label="Current education level" required>
            <input
              required
              value={form.education_level}
              onChange={(e) => setForm({ ...form, education_level: e.target.value })}
              placeholder="e.g. High school senior, BSc CS 2nd year, Bootcamp grad…"
              className="w-full rounded-xl glass px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-electric-purple"
            />
          </Field>
          <Field label="Skills & interests" required>
            <textarea
              required
              rows={3}
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="Python, design, math olympiads, love building UI…"
              className="w-full rounded-xl glass px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-electric-purple"
            />
          </Field>
          <Field label="Career goals" required>
            <textarea
              required
              rows={2}
              value={form.goals}
              onChange={(e) => setForm({ ...form, goals: e.target.value })}
              placeholder="Become an AI engineer at a top lab within 4 years"
              className="w-full rounded-xl glass px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-electric-purple"
            />
          </Field>
          <Field label="Constraints (optional)">
            <input
              value={form.constraints}
              onChange={(e) => setForm({ ...form, constraints: e.target.value })}
              placeholder="Based in Mumbai, budget ≤ ₹3L/year, 18 months timeline"
              className="w-full rounded-xl glass px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-electric-purple"
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-royal-purple to-electric-purple py-3 text-sm font-medium shadow-glow transition hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing your profile…
              </>
            ) : (
              <>
                Generate recommendations <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </form>

        {paths && (
          <div className="mt-10 space-y-5">
            {paths.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="gradient-border rounded-2xl p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-royal-purple to-electric-purple text-sm font-semibold">
                    {i + 1}
                  </div>
                  <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                </div>
                <p className="mt-3 text-sm text-white/80">{p.why_it_fits}</p>
                <div className="mt-4">
                  <div className="text-xs uppercase tracking-wider text-soft-gray">Next steps</div>
                  <ul className="mt-2 space-y-1.5 text-sm text-white/90">
                    {p.next_steps.map((s, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="text-violet-glow">→</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs uppercase tracking-wider text-soft-gray">
        {label} {required && <span className="text-violet-glow">*</span>}
      </div>
      {children}
    </label>
  );
}
