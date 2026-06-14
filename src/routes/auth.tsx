import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — CareerTwin AI" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { username: username || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created — welcome to CareerTwin AI");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      }
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-electric-purple/20 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <Link to="/" className="mb-10 flex items-center justify-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-royal-purple to-electric-purple shadow-glow">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-lg font-semibold">CareerTwin AI</span>
        </Link>

        <div className="rounded-3xl glass-strong p-8">
          <h1 className="font-display text-2xl font-semibold">
            {mode === "signup" ? "Create your Career Twin" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-soft-gray">
            {mode === "signup"
              ? "Start tracking XP, achievements, and AI suggestions."
              : "Sign in to continue building your career memory."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs uppercase tracking-wider text-soft-gray">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="aarav_dev"
                  className="mt-1 w-full rounded-xl glass px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-electric-purple"
                />
              </div>
            )}
            <div>
              <label className="text-xs uppercase tracking-wider text-soft-gray">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl glass px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-electric-purple"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-soft-gray">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl glass px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-electric-purple"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-royal-purple to-electric-purple py-3 text-sm font-medium shadow-glow transition hover:scale-[1.01] disabled:opacity-60"
            >
              {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="mt-6 w-full text-center text-xs text-soft-gray hover:text-white"
          >
            {mode === "signup"
              ? "Already have an account? Sign in"
              : "New here? Create your Career Twin"}
          </button>
        </div>
      </div>
    </div>
  );
}
