import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// Return the dashboard payload for the signed-in user.
export const getMyDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const uid = context.userId;

    const profileQ = await context.supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, xp, primary_role")
      .eq("id", uid)
      .maybeSingle();
    if (profileQ.error) throw new Error(profileQ.error.message);
    const profile = profileQ.data;
    if (!profile?.primary_role) {
      return { profile, path: null, steps: [], tasks: [], stats: null };
    }

    const role = profile.primary_role;

    const [pathQ, tasksQ, taskProgQ, stepProgQ] = await Promise.all([
      context.supabase
        .from("learning_paths")
        .select("id, title, description, learning_steps(id, title, description, xp_reward, sort_order)")
        .eq("role", role)
        .order("sort_order", { ascending: true })
        .limit(1)
        .maybeSingle(),
      context.supabase
        .from("tasks")
        .select("id, title, description, xp_reward, category")
        .eq("role", role)
        .order("created_at", { ascending: true }),
      context.supabase
        .from("user_task_progress")
        .select("task_id, completed_at")
        .eq("user_id", uid),
      context.supabase
        .from("user_step_progress")
        .select("step_id, status, completed_at")
        .eq("user_id", uid),
    ]);

    if (pathQ.error) throw new Error(pathQ.error.message);
    if (tasksQ.error) throw new Error(tasksQ.error.message);

    const path = pathQ.data
      ? {
          id: pathQ.data.id,
          title: pathQ.data.title,
          description: pathQ.data.description,
          steps: (pathQ.data.learning_steps ?? [])
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order),
        }
      : null;

    const completedStepIds = new Set(
      (stepProgQ.data ?? []).filter((r) => r.status === "completed").map((r) => r.step_id),
    );
    const completedTaskIds = new Set((taskProgQ.data ?? []).map((r) => r.task_id));

    const stepsWithStatus = path
      ? path.steps.map((s) => ({ ...s, completed: completedStepIds.has(s.id) }))
      : [];

    const tasksWithStatus = (tasksQ.data ?? []).map((t) => ({
      ...t,
      completed: completedTaskIds.has(t.id),
    }));

    const stepsCompleted = stepsWithStatus.filter((s) => s.completed).length;
    const stepsTotal = stepsWithStatus.length;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const tasksDoneThisWeek = (taskProgQ.data ?? []).filter(
      (r) => new Date(r.completed_at).getTime() >= weekAgo,
    ).length;

    return {
      profile,
      path: path ? { id: path.id, title: path.title, description: path.description, steps: stepsWithStatus } : null,
      tasks: tasksWithStatus,
      stats: {
        stepsCompleted,
        stepsTotal,
        pathProgressPct: stepsTotal ? Math.round((stepsCompleted / stepsTotal) * 100) : 0,
        tasksDoneThisWeek,
        totalXp: profile.xp,
        level: Math.floor(profile.xp / 1000) + 1,
      },
    };
  });

// List every learning path available to the user's role.
export const listMyPaths = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const profileQ = await context.supabase
      .from("profiles")
      .select("primary_role")
      .eq("id", context.userId)
      .maybeSingle();
    if (!profileQ.data?.primary_role) return [];

    const { data, error } = await context.supabase
      .from("learning_paths")
      .select("id, title, description, sort_order, learning_steps(id)")
      .eq("role", profileQ.data.primary_role)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);

    const progQ = await context.supabase
      .from("user_step_progress")
      .select("step_id, status")
      .eq("user_id", context.userId);
    const doneIds = new Set(
      (progQ.data ?? []).filter((r) => r.status === "completed").map((r) => r.step_id),
    );

    return (data ?? []).map((p) => {
      const total = p.learning_steps?.length ?? 0;
      const done = (p.learning_steps ?? []).filter((s) => doneIds.has(s.id)).length;
      return {
        id: p.id,
        title: p.title,
        description: p.description,
        total,
        done,
        pct: total ? Math.round((done / total) * 100) : 0,
      };
    });
  });

// Fetch a single path with all steps + user progress.
export const getPath = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ pathId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const [pathQ, progQ] = await Promise.all([
      context.supabase
        .from("learning_paths")
        .select("id, title, description, role, learning_steps(id, title, description, xp_reward, sort_order)")
        .eq("id", data.pathId)
        .maybeSingle(),
      context.supabase
        .from("user_step_progress")
        .select("step_id, status, completed_at")
        .eq("user_id", context.userId),
    ]);
    if (pathQ.error) throw new Error(pathQ.error.message);
    if (!pathQ.data) throw new Error("Path not found");

    const doneMap = new Map(
      (progQ.data ?? []).map((r) => [r.step_id, r.status === "completed"] as const),
    );

    return {
      id: pathQ.data.id,
      title: pathQ.data.title,
      description: pathQ.data.description,
      role: pathQ.data.role,
      steps: (pathQ.data.learning_steps ?? [])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((s) => ({ ...s, completed: doneMap.get(s.id) ?? false })),
    };
  });

// Mark a step as completed. Awards XP via SECURITY DEFINER RPC.
export const completeStep = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ stepId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: reward, error } = await context.supabase.rpc("complete_step", {
      _step_id: data.stepId,
    });
    if (error) throw new Error(error.message);
    return { xpAwarded: reward ?? 0 };
  });

// Mark a task as completed. Awards XP via SECURITY DEFINER RPC.
export const completeMyTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ taskId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: reward, error } = await context.supabase.rpc("complete_task", {
      _task_id: data.taskId,
    });
    if (error) throw new Error(error.message);
    return { xpAwarded: reward ?? 0 };
  });
