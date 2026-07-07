import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listMyPaths } from "@/lib/learning.functions";

export const Route = createFileRoute("/_authenticated/paths")({
  head: () => ({ meta: [{ title: "Learning paths — CareerTwin AI" }] }),
  component: PathsPage,
});

function PathsPage() {
  const fetchPaths = useServerFn(listMyPaths);
  const q = useQuery({ queryKey: ["my-paths"], queryFn: () => fetchPaths() });

  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Link to="/dashboard" className="text-xs text-soft-gray hover:text-white">← Dashboard</Link>
        <h1 className="mt-4 font-display text-3xl font-semibold">Your learning paths</h1>
        <p className="mt-2 text-sm text-soft-gray">Everything curated for your role.</p>

        <div className="mt-8 space-y-4">
          {q.isLoading && <p className="text-soft-gray">Loading…</p>}
          {q.data?.length === 0 && (
            <p className="text-soft-gray">No paths yet for your role.</p>
          )}
          {q.data?.map((p) => (
            <Link
              key={p.id}
              to="/paths/$pathId"
              params={{ pathId: p.id }}
              className="block rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-soft-gray">{p.description}</p>
                </div>
                <div className="rounded-full bg-electric-purple/10 px-3 py-1 text-xs text-electric-purple">
                  {p.done}/{p.total}
                </div>
              </div>
              <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-royal-purple to-electric-purple"
                  style={{ width: `${p.pct}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
