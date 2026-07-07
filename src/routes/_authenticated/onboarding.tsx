import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { getMe, setMyPrimaryRole } from "@/lib/roles.functions";
import { ONBOARDING_ROLES } from "@/lib/role-content";
import { Sparkles, GraduationCap, Briefcase, Users } from "lucide-react";

const ICONS = {
  student: GraduationCap,
  job_seeker: Briefcase,
  mentor: Users,
} as const;

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [{ title: "Choose your role — CareerTwin AI" }] }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const fetchMe = useServerFn(getMe);
  const setRole = useServerFn(setMyPrimaryRole);
  const [selected, setSelected] = useState<"student" | "job_seeker" | "mentor" | null>(null);
  const [saving, setSaving] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetchMe()
      .then((me) => {
        if (me?.primary_role) navigate({ to: "/dashboard", replace: true });
      })
      .finally(() => setChecked(true));
  }, [fetchMe, navigate]);

  async function handleSubmit() {
    if (!selected) return;
    setSaving(true);
    try {
      await setRole({ data: { role: selected } });
      toast.success("Welcome to your Career Twin");
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (!checked) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-electric-purple/20 blur-3xl" />
      <div className="relative mx-auto max-w-5xl px-6 py-16">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-soft-gray">
          <Sparkles className="h-3.5 w-3.5 text-electric-purple" />
          Step 1 of 1
        </div>
        <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
          Who is your Career Twin for?
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-soft-gray">
          Pick the mode that matches your goals right now. Your dashboard, tasks, and AI
          suggestions will adapt instantly. Admins can change your role later.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {ONBOARDING_ROLES.map((role) => {
            const Icon = ICONS[role.id];
            const isSelected = selected === role.id;
            return (
              <motion.button
                key={role.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelected(role.id)}
                className={`group relative overflow-hidden rounded-3xl border p-6 text-left transition ${
                  isSelected
                    ? "border-electric-purple/60 bg-electric-purple/10 shadow-glow"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-royal-purple to-electric-purple">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{role.title}</h3>
                <p className="mt-1 text-sm text-soft-gray">{role.headline}</p>
                <ul className="mt-4 space-y-1.5 text-xs text-soft-gray">
                  {role.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-1 h-1 w-1 rounded-full bg-electric-purple" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <p className="text-xs text-soft-gray">You can only pick once — admins can override later.</p>
          <button
            onClick={handleSubmit}
            disabled={!selected || saving}
            className="rounded-full bg-gradient-to-r from-royal-purple to-electric-purple px-6 py-3 text-sm font-medium shadow-glow transition hover:scale-[1.01] disabled:opacity-40"
          >
            {saving ? "Setting up…" : "Enter my workspace"}
          </button>
        </div>
      </div>
    </div>
  );
}
