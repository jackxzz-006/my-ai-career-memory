import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getPath, completeStep } from "@/lib/learning.functions";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/paths/$pathId")({
  head: () => ({ meta: [{ title: "Path — CareerTwin AI" }] }),
  component: PathDetailPage,
});

function PathDetailPage() {
  const { pathId } = Route.useParams();
  const qc = useQueryClient();
  const fetchPath = useServerFn(getPath);
  const doStep = useServerFn(completeStep);

  const q = useQuery({
    queryKey: ["path", pathId],
    queryFn: () => fetchPath({ data: { pathId } }),
  });

  const stepMut = useMutation({
    mutationFn: (stepId: string) => doStep({ data: { stepId } }),
    onSuccess: (r) => {
      if (r.xpAwarded > 0) toast.success(`+${r.xpAwarded} XP earned`);
      qc.invalidateQueries({ queryKey: ["path", pathId] });
      qc.invalidateQueries({ queryKey: ["my-paths"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link to="/paths" className="text-xs text-soft-gray hover:text-white">← All paths</Link>
        {q.isLoading && <p className="mt-8 text-soft-gray">Loading…</p>}
        {q.data && (
          <>
            <h1 className="mt-4 font-display text-3xl font-semibold">{q.data.title}</h1>
            <p className="mt-2 text-sm text-soft-gray">{q.data.description}</p>
            <div className="mt-8 space-y-3">
              {q.data.steps.map((s, i) => (
                <div
                  key={s.id}
                  className={`flex items-start gap-4 rounded-2xl border p-4 ${
                    s.completed
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <div
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                      s.completed
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-white/5 text-soft-gray"
                    }`}
                  >
                    {s.completed ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="mt-0.5 text-xs text-soft-gray">{s.description}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-electric-purple">
                      +{s.xp_reward} XP
                    </p>
                  </div>
                  {!s.completed && (
                    <button
                      onClick={() => stepMut.mutate(s.id)}
                      disabled={stepMut.isPending}
                      className="rounded-full bg-gradient-to-r from-royal-purple to-electric-purple px-3 py-1.5 text-xs font-medium disabled:opacity-40"
                    >
                      Mark done
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
