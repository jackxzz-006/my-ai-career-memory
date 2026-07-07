import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { getMyDashboard, completeStep, completeMyTask } from "@/lib/learning.functions";
import { ROLE_META, type AppRole } from "@/lib/role-content";
import { supabase } from "@/integrations/supabase/client";
import { Check, Sparkles, Target, Trophy, Zap, ArrowRight, ListChecks } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CareerTwin AI" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchDashboard = useServerFn(getMyDashboard);
  const doStep = useServerFn(completeStep);
  const doTask = useServerFn(completeMyTask);

  const dash = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDashboard(),
  });

  useEffect(() => {
    if (dash.data && dash.data.profile && !dash.data.profile.primary_role) {
      navigate({ to: "/onboarding", replace: true });
    }
  }, [dash.data, navigate]);

  // Realtime: refetch when the user's progress rows change (multi-device sync).
  useEffect(() => {
    const uid = dash.data?.profile?.id;
    if (!uid) return;
    const channel = supabase
      .channel(`dash-${uid}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_step_progress", filter: `user_id=eq.${uid}` },
        () => qc.invalidateQueries({ queryKey: ["dashboard"] }),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_task_progress", filter: `user_id=eq.${uid}` },
        () => qc.invalidateQueries({ queryKey: ["dashboard"] }),
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${uid}` },
        () => qc.invalidateQueries({ queryKey: ["dashboard"] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [dash.data?.profile?.id, qc]);

  const stepMut = useMutation({
    mutationFn: (stepId: string) => doStep({ data: { stepId } }),
    onSuccess: (r) => {
      if (r.xpAwarded > 0) toast.success(`+${r.xpAwarded} XP earned`);
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const taskMut = useMutation({
    mutationFn: (taskId: string) => doTask({ data: { taskId } }),
    onSuccess: (r) => {
      if (r.xpAwarded > 0) toast.success(`+${r.xpAwarded} XP earned`);
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (dash.isLoading) return <PageShell><p className="text-soft-gray">Loading your workspace…</p></PageShell>;
  if (dash.error) return <PageShell><p className="text-red-400">Failed to load: {(dash.error as Error).message}</p></PageShell>;

  const data = dash.data!;
  if (!data.profile?.primary_role) return <PageShell><p className="text-soft-gray">Redirecting to onboarding…</p></PageShell>;

  const role = data.profile.primary_role as AppRole;
  const meta = ROLE_META[role];
  const stats = data.stats!;

  return (
    <PageShell>
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-soft-gray">
            <Sparkles className="h-3.5 w-3.5 text-electric-purple" />
            {meta.label} · Level {stats.level}
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{meta.dashboardTitle}</h1>
          <p className="mt-2 max-w-2xl text-sm text-soft-gray">{meta.dashboardSubtitle}</p>
        </div>
        <Link
          to="/paths"
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-soft-gray transition hover:border-white/30 hover:text-white"
        >
          View all learning paths →
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard icon={<Zap className="h-4 w-4" />} label="Total XP" value={stats.totalXp} />
        <StatCard icon={<Trophy className="h-4 w-4" />} label="Level" value={stats.level} />
        <StatCard
          icon={<ListChecks className="h-4 w-4" />}
          label="Path progress"
          value={`${stats.pathProgressPct}%`}
        />
        <StatCard
          icon={<Target className="h-4 w-4" />}
          label="Tasks this week"
          value={stats.tasksDoneThisWeek}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {data.path && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.02] p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold">{data.path.title}</h2>
                <p className="mt-1 text-sm text-soft-gray">{data.path.description}</p>
              </div>
              <div className={`rounded-full bg-gradient-to-r ${meta.accent} px-3 py-1 text-xs`}>
                {stats.stepsCompleted}/{stats.stepsTotal}
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${meta.accent} transition-all`}
                style={{ width: `${stats.pathProgressPct}%` }}
              />
            </div>
            <div className="mt-6 space-y-3">
              {data.path.steps.map((s, i) => (
                <div
                  key={s.id}
                  className={`flex items-start gap-4 rounded-2xl border p-4 transition ${
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
          </motion.section>
        )}

        <motion.aside
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-white/10 bg-white/[0.02] p-6"
        >
          <h2 className="font-display text-xl font-semibold">This week</h2>
          <p className="mt-1 text-sm text-soft-gray">Small wins compound.</p>
          <div className="mt-5 space-y-3">
            {data.tasks.length === 0 && (
              <p className="text-xs text-soft-gray">No tasks yet for this role.</p>
            )}
            {data.tasks.map((t) => (
              <div key={t.id} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`text-sm font-medium ${t.completed ? "line-through text-soft-gray" : ""}`}>
                      {t.title}
                    </p>
                    <p className="mt-0.5 text-xs text-soft-gray">{t.description}</p>
                  </div>
                  {t.completed ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <button
                      onClick={() => taskMut.mutate(t.id)}
                      disabled={taskMut.isPending}
                      className="rounded-full border border-electric-purple/40 px-2 py-1 text-[10px] font-medium text-electric-purple hover:bg-electric-purple/10 disabled:opacity-40"
                    >
                      +{t.xp_reward}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/recommend"
            className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20"
          >
            <div>
              <p className="text-sm font-medium">Ask your Career Twin</p>
              <p className="mt-0.5 text-xs text-soft-gray">Get a fresh AI recommendation.</p>
            </div>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.aside>
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="absolute -top-40 right-0 h-[30rem] w-[30rem] rounded-full bg-electric-purple/15 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <Link to="/" className="text-xs text-soft-gray hover:text-white">← Back to landing</Link>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-soft-gray">
        <span className="text-electric-purple">{icon}</span>
        {label}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
