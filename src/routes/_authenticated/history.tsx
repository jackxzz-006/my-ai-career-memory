import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Clock, Loader2 } from "lucide-react";
import { listMyRecommendations } from "@/lib/recommend.functions";
import { Navbar } from "@/components/landing/navbar";
import type { RecommendationPath } from "@/lib/recommend.functions";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({ meta: [{ title: "History — CareerTwin AI" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const list = useServerFn(listMyRecommendations);
  const { data, isLoading, error } = useQuery({
    queryKey: ["recommendations", "mine"],
    queryFn: () => list(),
  });

  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-electric-purple/20 blur-3xl" />

      <main className="relative mx-auto max-w-4xl px-6 pb-24 pt-32">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-soft-gray">
              <Clock className="h-3.5 w-3.5 text-violet-glow" /> Your History
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold">Past recommendations</h1>
          </div>
          <Link
            to="/recommend"
            className="rounded-full bg-gradient-to-r from-royal-purple to-electric-purple px-5 py-2.5 text-sm font-medium shadow-glow"
          >
            <Sparkles className="mr-1.5 -mt-0.5 inline h-4 w-4" /> New
          </Link>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 rounded-2xl glass p-6 text-sm text-soft-gray">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        )}
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
            {error instanceof Error ? error.message : "Failed to load history"}
          </div>
        )}
        {data && data.length === 0 && (
          <div className="rounded-2xl glass p-10 text-center text-sm text-soft-gray">
            No recommendations yet.{" "}
            <Link to="/recommend" className="text-violet-glow hover:underline">
              Generate your first one
            </Link>
            .
          </div>
        )}

        <div className="space-y-6">
          {data?.map((r) => (
            <div key={r.id} className="rounded-2xl glass-strong p-6">
              <div className="flex items-center justify-between text-xs text-soft-gray">
                <span>{new Date(r.created_at).toLocaleString()}</span>
                <span className="rounded-full bg-electric-purple/15 px-2 py-0.5 text-violet-glow">
                  {(r.paths as RecommendationPath[]).length} paths
                </span>
              </div>
              <div className="mt-3 grid gap-2 text-xs text-white/70 md:grid-cols-2">
                <div><span className="text-soft-gray">Education:</span> {r.education_level}</div>
                <div><span className="text-soft-gray">Goals:</span> {r.goals}</div>
                <div className="md:col-span-2"><span className="text-soft-gray">Skills:</span> {r.skills}</div>
                {r.constraints && (
                  <div className="md:col-span-2"><span className="text-soft-gray">Constraints:</span> {r.constraints}</div>
                )}
              </div>
              <div className="mt-5 space-y-3">
                {(r.paths as RecommendationPath[]).map((p, i) => (
                  <div key={i} className="rounded-xl glass p-4">
                    <div className="text-sm font-semibold text-white">
                      {i + 1}. {p.title}
                    </div>
                    <p className="mt-1 text-xs text-white/70">{p.why_it_fits}</p>
                    <ul className="mt-2 space-y-1 text-xs text-white/80">
                      {p.next_steps.map((s, j) => (
                        <li key={j}>→ {s}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
