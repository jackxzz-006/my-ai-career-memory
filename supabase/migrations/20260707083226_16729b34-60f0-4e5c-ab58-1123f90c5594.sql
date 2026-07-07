
-- 1. Role enum
CREATE TYPE public.app_role AS ENUM ('student', 'job_seeker', 'mentor', 'admin');

-- 2. user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. has_role() security definer (before policies that reference it)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. user_roles policies
CREATE POLICY "Users read own roles or admin reads all"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Admins manage roles via SECURITY DEFINER functions; no direct writes from users.

-- 5. profiles: extend
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS primary_role public.app_role,
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS avatar_url text;

-- Allow users to update their own display fields (username kept, add display_name + avatar_url)
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (username, display_name, avatar_url) ON public.profiles TO authenticated;

-- Admins can SELECT all profiles (already public SELECT), and update any profile via functions.

-- 6. set_primary_role — user picks their own role at onboarding (only if none set, cannot self-assign admin)
CREATE OR REPLACE FUNCTION public.set_primary_role(_role public.app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  current_role public.app_role;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF _role = 'admin' THEN
    RAISE EXCEPTION 'Cannot self-assign admin role';
  END IF;

  SELECT primary_role INTO current_role FROM public.profiles WHERE id = uid;
  IF current_role IS NOT NULL THEN
    RAISE EXCEPTION 'Role already set. Ask an admin to change it.';
  END IF;

  UPDATE public.profiles SET primary_role = _role WHERE id = uid;
  INSERT INTO public.user_roles (user_id, role) VALUES (uid, _role)
    ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- 7. admin_set_user_role — admins reassign any user's primary role (any role including admin)
CREATE OR REPLACE FUNCTION public.admin_set_user_role(_user_id uuid, _role public.app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  -- Remove existing primary-role rows (keep multiple secondary roles simple: one role per user)
  DELETE FROM public.user_roles WHERE user_id = _user_id;
  INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, _role);
  UPDATE public.profiles SET primary_role = _role WHERE id = _user_id;
END;
$$;

-- 8. learning_paths
CREATE TABLE public.learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role public.app_role NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.learning_paths TO authenticated;
GRANT ALL ON public.learning_paths TO service_role;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Any authenticated can view paths"
  ON public.learning_paths FOR SELECT TO authenticated USING (true);

-- 9. learning_steps
CREATE TABLE public.learning_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id uuid NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  xp_reward integer NOT NULL DEFAULT 50,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.learning_steps TO authenticated;
GRANT ALL ON public.learning_steps TO service_role;
ALTER TABLE public.learning_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Any authenticated can view steps"
  ON public.learning_steps FOR SELECT TO authenticated USING (true);

-- 10. user_step_progress
CREATE TABLE public.user_step_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  step_id uuid NOT NULL REFERENCES public.learning_steps(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed')),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, step_id)
);
GRANT SELECT, INSERT, UPDATE ON public.user_step_progress TO authenticated;
GRANT ALL ON public.user_step_progress TO service_role;
ALTER TABLE public.user_step_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own step progress or admin views all"
  ON public.user_step_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own step progress"
  ON public.user_step_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own step progress"
  ON public.user_step_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 11. tasks
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role public.app_role NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'weekly',
  xp_reward integer NOT NULL DEFAULT 25,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Any authenticated can view tasks"
  ON public.tasks FOR SELECT TO authenticated USING (true);

-- 12. user_task_progress
CREATE TABLE public.user_task_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, task_id)
);
GRANT SELECT, INSERT ON public.user_task_progress TO authenticated;
GRANT ALL ON public.user_task_progress TO service_role;
ALTER TABLE public.user_task_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own task progress or admin views all"
  ON public.user_task_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own task progress"
  ON public.user_task_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 13. complete_step / complete_task: award XP atomically via SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.complete_step(_step_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  reward integer;
  already boolean;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT xp_reward INTO reward FROM public.learning_steps WHERE id = _step_id;
  IF reward IS NULL THEN RAISE EXCEPTION 'Step not found'; END IF;

  SELECT EXISTS (SELECT 1 FROM public.user_step_progress
                 WHERE user_id = uid AND step_id = _step_id AND status = 'completed')
    INTO already;
  IF already THEN RETURN 0; END IF;

  INSERT INTO public.user_step_progress (user_id, step_id, status, completed_at)
    VALUES (uid, _step_id, 'completed', now())
    ON CONFLICT (user_id, step_id)
      DO UPDATE SET status = 'completed', completed_at = now();

  UPDATE public.profiles SET xp = xp + reward WHERE id = uid;
  RETURN reward;
END;
$$;

CREATE OR REPLACE FUNCTION public.complete_task(_task_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  reward integer;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT xp_reward INTO reward FROM public.tasks WHERE id = _task_id;
  IF reward IS NULL THEN RAISE EXCEPTION 'Task not found'; END IF;

  BEGIN
    INSERT INTO public.user_task_progress (user_id, task_id) VALUES (uid, _task_id);
  EXCEPTION WHEN unique_violation THEN
    RETURN 0;
  END;

  UPDATE public.profiles SET xp = xp + reward WHERE id = uid;
  RETURN reward;
END;
$$;

-- 14. Realtime for progress tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_step_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_task_progress;

-- 15. Seed content per role
DO $$
DECLARE
  student_path uuid;
  seeker_path uuid;
  mentor_path uuid;
BEGIN
  INSERT INTO public.learning_paths (role, title, description, sort_order)
    VALUES ('student', 'Foundations of Learning', 'Build the habits and skills every successful student needs.', 1)
    RETURNING id INTO student_path;
  INSERT INTO public.learning_steps (path_id, title, description, xp_reward, sort_order) VALUES
    (student_path, 'Map your interests', 'Identify 3 subjects that excite you the most.', 40, 1),
    (student_path, 'Set a weekly study rhythm', 'Draft a realistic weekly study calendar.', 60, 2),
    (student_path, 'Master one core concept', 'Pick one topic and teach it back in your own words.', 80, 3),
    (student_path, 'Ship a mini-project', 'Turn what you learned into a shareable artifact.', 100, 4);

  INSERT INTO public.learning_paths (role, title, description, sort_order)
    VALUES ('job_seeker', 'Land Your Next Role', 'A focused sprint from resume to signed offer.', 1)
    RETURNING id INTO seeker_path;
  INSERT INTO public.learning_steps (path_id, title, description, xp_reward, sort_order) VALUES
    (seeker_path, 'Clarify your target role', 'Write a 2-line job title and seniority target.', 40, 1),
    (seeker_path, 'Refresh your resume', 'Tailor bullets around outcomes, not tasks.', 60, 2),
    (seeker_path, 'Run 3 mock interviews', 'Practice with a peer or AI and log your answers.', 80, 3),
    (seeker_path, 'Send 10 tailored applications', 'Track every application in one place.', 100, 4);

  INSERT INTO public.learning_paths (role, title, description, sort_order)
    VALUES ('mentor', 'Mentorship Mastery', 'Sharpen the skills that make you a great mentor.', 1)
    RETURNING id INTO mentor_path;
  INSERT INTO public.learning_steps (path_id, title, description, xp_reward, sort_order) VALUES
    (mentor_path, 'Define your mentorship focus', 'Pick the topics you love to coach on.', 40, 1),
    (mentor_path, 'Craft an intro session template', 'Design a first meeting your mentees will love.', 60, 2),
    (mentor_path, 'Give feedback that lands', 'Practice the SBI (Situation-Behavior-Impact) model.', 80, 3),
    (mentor_path, 'Publish a mentorship offer', 'Write a short public post inviting mentees.', 100, 4);

  INSERT INTO public.tasks (role, title, description, xp_reward) VALUES
    ('student',    'Complete a study session',        'Do a 25-minute focused study block today.', 20),
    ('student',    'Reflect on today',                'Write 3 sentences about what you learned.', 15),
    ('student',    'Ask one question',                'Post a question in a class or community.', 25),
    ('job_seeker', 'Update your LinkedIn headline',   'Make sure it matches your target role.', 20),
    ('job_seeker', 'Log 2 job applications',          'Track them with company + role + status.', 25),
    ('job_seeker', 'Do one 15-min interview drill',   'Answer one behavioral question out loud.', 30),
    ('mentor',     'Check in with a mentee',          'Send a supportive message to someone this week.', 20),
    ('mentor',     'Share one learning resource',     'Post a link, book, or thread you loved.', 25),
    ('mentor',     'Reflect on your last session',    'Note what worked and what to improve.', 15);
END $$;
