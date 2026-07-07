// Shared role metadata for UI (labels, copy, gradients).

export type AppRole = "student" | "job_seeker" | "mentor" | "admin";

export const ROLE_META: Record<
  AppRole,
  {
    label: string;
    tagline: string;
    dashboardTitle: string;
    dashboardSubtitle: string;
    accent: string;
  }
> = {
  student: {
    label: "Student",
    tagline: "Learn faster. Build sharper.",
    dashboardTitle: "Your student workspace",
    dashboardSubtitle:
      "Track what you're learning, ship small projects, and let your Career Twin remember every win.",
    accent: "from-blue-500 to-electric-purple",
  },
  job_seeker: {
    label: "Job Seeker",
    tagline: "From applying to signing an offer.",
    dashboardTitle: "Your job-search command center",
    dashboardSubtitle:
      "Sharpen your resume, log applications, and rehearse the interviews that get you hired.",
    accent: "from-emerald-500 to-electric-purple",
  },
  mentor: {
    label: "Mentor",
    tagline: "Coach the next generation with intention.",
    dashboardTitle: "Your mentorship studio",
    dashboardSubtitle:
      "Plan sessions, share resources, and build a library of feedback your mentees will remember.",
    accent: "from-amber-500 to-electric-purple",
  },
  admin: {
    label: "Admin",
    tagline: "Guardian of the Career Twin community.",
    dashboardTitle: "Admin control room",
    dashboardSubtitle: "Manage users, assign roles, and audit progress across the platform.",
    accent: "from-fuchsia-500 to-electric-purple",
  },
};

export const ONBOARDING_ROLES: {
  id: Exclude<AppRole, "admin">;
  title: string;
  headline: string;
  bullets: string[];
}[] = [
  {
    id: "student",
    title: "Student",
    headline: "I'm learning and building my foundation.",
    bullets: ["Study rhythm & focus", "Ship small projects", "Track skills as you grow"],
  },
  {
    id: "job_seeker",
    title: "Job Seeker",
    headline: "I'm actively looking for my next role.",
    bullets: ["Resume + LinkedIn tune-up", "Application tracker", "AI-powered interview prep"],
  },
  {
    id: "mentor",
    title: "Mentor",
    headline: "I coach others through their career journey.",
    bullets: ["Session templates", "Feedback frameworks", "Publish your mentorship offer"],
  },
];
