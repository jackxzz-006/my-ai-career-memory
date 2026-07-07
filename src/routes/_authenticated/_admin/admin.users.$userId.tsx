import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminGetUserProgress } from "@/lib/roles.functions";
import { ROLE_META, type AppRole } from "@/lib/role-content";

export const Route = createFileRoute("/_authenticated/_admin/admin/users/$userId")({
  head: () => ({ meta: [{ title: "User progress — Admin" }] }),
  component: AdminUserDetail,
});

function AdminUserDetail() {
  const { userId } = Route.useParams();
  const fetchIt = useServerFn(adminGetUserProgress);
  const q = useQuery({
    queryKey: ["admin-user", userId],
    queryFn: () => fetchIt({ data: { userId } }),
  });

  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link to="/admin" className="text-xs text-soft-gray hover:text-white">← Admin</Link>

        {q.isLoading && <p className="mt-8 text-soft-gray">Loading…</p>}
        {q.error && <p className="mt-8 text-red-400">{(q.error as Error).message}</p>}
        {q.data && (
          <>
            <div className="mt-4 flex items-start gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-royal-purple to-electric-purple text-lg font-semibold">
                {(q.data.profile?.display_name || q.data.profile?.username || "?").slice(0, 1).toUpperCase()}
              </div>
              <div>
                <h1 className="font-display text-2xl font-semibold">
                  {q.data.profile?.display_name || q.data.profile?.username}
                </h1>
                <p className="text-xs text-soft-gray">
                  {q.data.profile?.primary_role
                    ? `${ROLE_META[q.data.profile.primary_role as AppRole].label} · ${q.data.profile.xp} XP`
                    : "No role assigned"}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
                <h2 className="font-display text-lg font-semibold">Learning steps</h2>
                <p className="mt-1 text-xs text-soft-gray">
                  {q.data.steps.length} recorded
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  {q.data.steps.map((s) => {
                    const step = s.learning_steps as unknown as {
                      title?: string;
                      xp_reward?: number;
                      learning_paths?: { title?: string };
                    } | null;
                    return (
                      <li key={s.id} className="rounded-xl border border-white/10 bg-black/30 p-3">
                        <p className="font-medium">{step?.title ?? "Step"}</p>
                        <p className="text-xs text-soft-gray">
                          {step?.learning_paths?.title} · +{step?.xp_reward ?? 0} XP ·{" "}
                          {s.status === "completed" ? "Completed" : "In progress"}
                        </p>
                      </li>
                    );
                  })}
                  {q.data.steps.length === 0 && (
                    <li className="text-xs text-soft-gray">No step progress yet.</li>
                  )}
                </ul>
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
                <h2 className="font-display text-lg font-semibold">Tasks completed</h2>
                <p className="mt-1 text-xs text-soft-gray">
                  {q.data.tasks.length} recorded
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  {q.data.tasks.map((t) => {
                    const task = t.tasks as unknown as {
                      title?: string;
                      xp_reward?: number;
                    } | null;
                    return (
                      <li key={t.id} className="rounded-xl border border-white/10 bg-black/30 p-3">
                        <p className="font-medium">{task?.title ?? "Task"}</p>
                        <p className="text-xs text-soft-gray">
                          +{task?.xp_reward ?? 0} XP · {new Date(t.completed_at).toLocaleDateString()}
                        </p>
                      </li>
                    );
                  })}
                  {q.data.tasks.length === 0 && (
                    <li className="text-xs text-soft-gray">No tasks completed yet.</li>
                  )}
                </ul>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
