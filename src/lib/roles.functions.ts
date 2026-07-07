import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type AppRole = "student" | "job_seeker" | "mentor" | "admin";

const roleSchema = z.enum(["student", "job_seeker", "mentor", "admin"]);
const nonAdminRoleSchema = z.enum(["student", "job_seeker", "mentor"]);

// Load the signed-in user's profile + role.
export const getMe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("id, username, xp, primary_role, display_name, avatar_url")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

// User picks their role at onboarding (cannot self-assign admin).
export const setMyPrimaryRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ role: nonAdminRoleSchema }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.rpc("set_primary_role", { _role: data.role });
    if (error) throw new Error(error.message);
    return { role: data.role };
  });

// Admin: check current user is admin (used by admin route gate).
export const checkAmAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) throw new Error(error.message);
    return { isAdmin: Boolean(data) };
  });

// Admin: list all users with role + xp.
export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: adminCheck } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!adminCheck) throw new Error("Forbidden");

    const { data, error } = await context.supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, xp, primary_role, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// Admin: change a user's primary role (via SECURITY DEFINER function).
export const adminSetUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ userId: z.string().uuid(), role: roleSchema }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.rpc("admin_set_user_role", {
      _user_id: data.userId,
      _role: data.role,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Admin: read a specific user's progress + stats.
export const adminGetUserProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: adminCheck } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!adminCheck) throw new Error("Forbidden");

    const [profile, steps, tasks] = await Promise.all([
      context.supabase
        .from("profiles")
        .select("id, username, display_name, xp, primary_role, avatar_url, created_at")
        .eq("id", data.userId)
        .maybeSingle(),
      context.supabase
        .from("user_step_progress")
        .select("id, step_id, status, completed_at, learning_steps(title, xp_reward, learning_paths(title, role))")
        .eq("user_id", data.userId)
        .order("completed_at", { ascending: false }),
      context.supabase
        .from("user_task_progress")
        .select("id, completed_at, tasks(title, xp_reward, role)")
        .eq("user_id", data.userId)
        .order("completed_at", { ascending: false }),
    ]);

    if (profile.error) throw new Error(profile.error.message);
    return {
      profile: profile.data,
      steps: steps.data ?? [],
      tasks: tasks.data ?? [],
    };
  });
