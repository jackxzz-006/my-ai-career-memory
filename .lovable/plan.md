
## Goal

Turn CareerTwin AI into a role-aware LMS: after sign-in, each user gets a personalized dashboard with progress that syncs across devices. Roles: **Student**, **Job Seeker**, **Mentor**, **Admin**. Users pick their role at first sign-in; admins can override anytime.

## Data model (new migration)

Roles stored in a dedicated `user_roles` table (never on `profiles`) to avoid privilege escalation and RLS recursion.

- `app_role` enum: `student | job_seeker | mentor | admin`
- `user_roles(user_id, role)` — unique per pair, one-per-user for the "primary" role marked on `profiles.primary_role`
- `profiles` gains: `primary_role app_role`, `display_name`, `avatar_url`
- `learning_paths(id, role, title, description, order)` — seeded per role
- `learning_steps(id, path_id, title, description, xp_reward, order)`
- `user_step_progress(user_id, step_id, status, completed_at)` — status: `not_started | in_progress | completed`
- `tasks(id, role, title, description, xp_reward, category)` — role-scoped weekly tasks
- `user_task_progress(user_id, task_id, completed_at)`
- `has_role(_user_id, _role)` security-definer function for RLS checks

**RLS**: users read/write only their own progress rows; admins read all via `has_role(auth.uid(), 'admin')`. Learning paths/tasks readable by any authenticated user filtered by their role. `user_roles` writable only by admins.

**Seed** each role with 1 learning path (3–4 steps) and 3 weekly tasks so dashboards aren't empty.

## Auth flow changes

- After sign-in, if `profiles.primary_role IS NULL` → redirect to `/onboarding` where user picks a role. Writes to `profiles.primary_role` and inserts into `user_roles`.
- Otherwise → redirect to `/dashboard`.
- `_authenticated` layout loads current user + role into router context.

## Routes

- `/onboarding` — role picker (student / job seeker / mentor cards)
- `/dashboard` — role-aware; shows: XP, level, progress on current learning path, weekly tasks, completion stats, recent AI recommendations
- `/paths` — list learning paths for the user's role, drill into steps, mark complete
- `/admin` — admin-only: user table with role dropdown + link to view any user's progress
- `/admin/users/$userId` — read-only view of a specific user's progress + XP
- Existing `/recommend`, `/history` stay; recommendation prompts get lightly tailored copy per role

## Server functions

All in `src/lib/*.functions.ts` using `requireSupabaseAuth`:

- `setPrimaryRole({ role })` — onboarding write
- `getMyDashboard()` — profile + role + path progress + tasks + stats
- `listMyPaths()` / `getPath({ id })` — role-filtered
- `completeStep({ stepId })` / `completeTask({ taskId })` — idempotent, awards XP, writes activity feed
- `adminListUsers()` — checks `has_role('admin')`, returns paginated users with roles/xp
- `adminSetUserRole({ userId, role })` — admin-only, updates `user_roles` + `profiles.primary_role`
- `adminGetUserProgress({ userId })` — admin-only read of any user's stats

## UI changes

- Navbar: show avatar + role badge; add `Dashboard` link; conditional `Admin` link when role = admin
- New `/dashboard` with role-themed hero (different accent copy per role), XP ring, path progress bar, task checklist, stats cards (steps completed, tasks done this week, XP earned this month)
- Preserve existing landing page (public), live leaderboard, and CareerTwin branding

## Technical section

- Migration order: enum → `user_roles` + GRANTs + RLS → `has_role()` → alter `profiles` → learning_paths/steps + progress → tasks + progress → seed data → RLS policies referencing `has_role`
- Realtime enabled on `user_step_progress` and `user_task_progress` so multi-device sessions sync progress live
- Admin routes gated in `_authenticated/_admin/route.tsx` via router `beforeLoad` calling a lightweight `checkAdmin` server fn
- No schema changes to `auth.*`; role assignment happens through `user_roles` only
- Extensibility: new roles = add enum value + seed paths/tasks; no code branching on role name beyond dashboard copy

## Out of scope (v1)

- Admin editing tasks/paths content (you selected list users + view progress only)
- Mentor-specific features like reviewing student submissions
- Email/notifications on role change
