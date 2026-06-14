import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Send, Sparkles, CheckCircle2, Circle, Activity, Trophy, Zap } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SectionHeader } from "./features";
import { useAuth } from "@/hooks/use-auth";
import { useLeaderboard, useActivityFeed, useMyProfile } from "@/hooks/use-live-data";
import { askCareerAI, completeTask } from "@/lib/career.functions";

/* ---------------- Live Hall of Fame (realtime leaderboard) ---------------- */

const medalFor = (rank: number) =>
  rank === 1 ? "#fbbf24" : rank === 2 ? "#d1d5db" : rank === 3 ? "#f59e0b" : "#a855f7";

export function HallOfFameLive() {
  const entries = useLeaderboard(10);
  const top3 = entries.slice(0, 3);
  const podium = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Career Hall of Fame"
          title={<>Compete With The <span className="text-gradient-purple">Best</span></>}
          subtitle="A live leaderboard powered by realtime updates — XP changes appear instantly."
        />

        {entries.length === 0 ? (
          <div className="mx-auto mt-16 max-w-md rounded-2xl glass p-8 text-center text-sm text-soft-gray">
            No careers tracked yet.{" "}
            <Link to="/auth" className="text-violet-glow hover:underline">
              Create your Career Twin
            </Link>{" "}
            to join the leaderboard.
          </div>
        ) : (
          <>
            {podium.length > 0 && (
              <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 items-end gap-4">
                {podium.map((p, idx) => {
                  const rank = entries.findIndex((e) => e.id === p.id) + 1;
                  const medal = medalFor(rank);
                  const heights = ["h-32", "h-44", "h-24"];
                  return (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="flex flex-col items-center"
                    >
                      <div
                        className="grid h-16 w-16 place-items-center rounded-full font-display text-xl font-semibold text-white shadow-glow"
                        style={{
                          background: `linear-gradient(135deg, ${medal}, #7c3aed)`,
                          boxShadow: `0 0 30px ${medal}80`,
                        }}
                      >
                        {rank}
                      </div>
                      <div className="mt-3 truncate text-sm font-medium text-white">
                        @{p.username}
                      </div>
                      <div className="text-[11px] text-soft-gray">
                        {p.xp.toLocaleString()} XP
                      </div>
                      <div
                        className={`mt-3 w-full ${heights[idx]} rounded-t-xl glass-strong border-b-0`}
                        style={{ boxShadow: `inset 0 0 30px ${medal}30` }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div className="mx-auto mt-12 max-w-3xl space-y-3">
              <AnimatePresence initial={false}>
                {entries.map((p, i) => {
                  const rank = i + 1;
                  const medal = medalFor(rank);
                  return (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        boxShadow: p.pulse
                          ? "0 0 30px rgba(168,85,247,0.6)"
                          : "0 0 0 rgba(0,0,0,0)",
                      }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.4 }}
                      className={`flex items-center justify-between gap-4 rounded-2xl p-4 ${
                        p.pulse ? "glass-strong" : "glass"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-white"
                          style={{ background: `linear-gradient(135deg, ${medal}, #7c3aed)` }}
                        >
                          #{rank}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">@{p.username}</div>
                          <div className="text-xs text-soft-gray">
                            Lv.{Math.floor(p.xp / 1000) + 1} · Career Builder
                          </div>
                        </div>
                      </div>
                      <motion.div
                        key={p.xp}
                        initial={{ scale: 1.2, color: "#c084fc" }}
                        animate={{ scale: 1, color: "#c084fc" }}
                        className="font-display text-lg font-semibold text-gradient-purple"
                      >
                        {p.xp.toLocaleString()} XP
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ---------------- Live Activity Feed ---------------- */

export function ActivityFeedLive() {
  const events = useActivityFeed(15);

  return (
    <section id="activity" className="relative py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8 flex items-center justify-center gap-3">
          <Activity className="h-5 w-5 text-violet-glow animate-pulse" />
          <h3 className="font-display text-xl font-semibold text-white">Live Activity</h3>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            REAL-TIME
          </span>
        </div>

        <div className="rounded-2xl glass-strong p-6">
          {events.length === 0 ? (
            <div className="py-8 text-center text-sm text-soft-gray">
              Waiting for the first career move…
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {events.map((e) => (
                  <motion.div
                    key={e.id}
                    layout
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-2.5 text-sm"
                  >
                    {e.type === "levelup" ? (
                      <Trophy className="h-4 w-4 shrink-0 text-amber-400" />
                    ) : (
                      <Zap className="h-4 w-4 shrink-0 text-violet-glow" />
                    )}
                    <span className="text-white/80">
                      <span className="font-medium text-white">@{e.username}</span> {e.message}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Live Weekly Challenges (real XP) ---------------- */

const challenges = [
  { label: "Complete AWS Module", reward: 300 },
  { label: "Solve 10 Coding Problems", reward: 500 },
  { label: "Update Resume", reward: 250 },
  { label: "Attend Technical Event", reward: 300 },
  { label: "Publish LinkedIn Post", reward: 200 },
  { label: "Mock Interview Session", reward: 400 },
];

export function WeeklyChallengesLive() {
  const { user } = useAuth();
  const profile = useMyProfile();
  const complete = useServerFn(completeTask);
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [done, setDone] = useState<Set<string>>(new Set());

  async function handleComplete(title: string, xp: number) {
    if (!user) {
      toast.error("Sign in to earn XP");
      return;
    }
    if (done.has(title) || pending.has(title)) return;
    setPending((s) => new Set(s).add(title));
    try {
      const res = await complete({ data: { title, xp } });
      setDone((s) => new Set(s).add(title));
      toast.success(`+${xp} XP added!`, {
        description: res.leveledUp ? "🎉 Level up!" : `Total: ${res.xp.toLocaleString()} XP`,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to complete task");
    } finally {
      setPending((s) => {
        const n = new Set(s);
        n.delete(title);
        return n;
      });
    }
  }

  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Weekly Challenges"
          title={<>AI Generated <span className="text-gradient-purple">Career Missions</span></>}
          subtitle="Complete a challenge to earn live XP and climb the leaderboard."
        />

        {profile && (
          <div className="mx-auto mt-10 flex max-w-md items-center justify-between rounded-2xl glass-strong px-6 py-3 text-sm">
            <span className="text-soft-gray">@{profile.username}</span>
            <motion.span
              key={profile.xp}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              className="font-display font-semibold text-gradient-purple"
            >
              {profile.xp.toLocaleString()} XP
            </motion.span>
          </div>
        )}

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((c, i) => {
            const isDone = done.has(c.label);
            const isPending = pending.has(c.label);
            return (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="gradient-border rounded-2xl p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-violet-glow" />
                    ) : (
                      <Circle className="h-5 w-5 text-soft-gray" />
                    )}
                    <div className="text-sm font-medium text-white">{c.label}</div>
                  </div>
                  <span className="shrink-0 rounded-full bg-electric-purple/15 px-2.5 py-1 text-[10px] font-medium text-violet-glow">
                    +{c.reward} XP
                  </span>
                </div>
                <button
                  onClick={() => handleComplete(c.label, c.reward)}
                  disabled={isDone || isPending}
                  className="mt-5 w-full rounded-full bg-gradient-to-r from-royal-purple to-electric-purple py-2 text-xs font-medium text-white shadow-glow transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDone ? "✓ Completed" : isPending ? "Saving…" : "Mark Complete"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Live Future Self AI Chat ---------------- */

export function FutureSelfAILive() {
  const { user } = useAuth();
  const ask = useServerFn(askCareerAI);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    {
      role: "ai",
      text: "Ask me anything about your career — I'll suggest a path, skills to improve, and your next 3 steps.",
    },
  ]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    if (!user) {
      toast.error("Sign in to chat with your Future Self AI");
      return;
    }
    const userMsg = prompt;
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setPrompt("");
    setLoading(true);
    try {
      const res = await ask({ data: { prompt: userMsg } });
      setMessages((m) => [...m, { role: "ai", text: res.response }]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI request failed");
      setMessages((m) => [
        ...m,
        { role: "ai", text: "Sorry, I couldn't reach the AI just now." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Future Self AI"
          title={<>Meet Your <span className="text-gradient-purple">Future Self</span></>}
          subtitle="A live AI strategist powered by Lovable AI — informed by every memory you'll feed it."
        />

        <div className="mx-auto mt-16 max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl glass-strong p-8">
            <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-electric-purple/30 blur-3xl" />

            <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-royal-purple to-electric-purple shadow-glow animate-pulse-glow">
              <Sparkles className="h-9 w-9 text-white" />
            </div>
            <div className="relative mt-3 text-center text-xs uppercase tracking-[0.2em] text-soft-gray">
              CareerTwin · Future Self · {loading ? "Thinking…" : "Online"}
            </div>

            <div className="relative mt-8 max-h-[400px] space-y-4 overflow-y-auto pr-2">
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-royal-purple to-electric-purple px-4 py-3 text-sm text-white shadow-glow"
                  >
                    {m.text}
                  </motion.div>
                ) : (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="max-w-[90%] whitespace-pre-wrap rounded-2xl rounded-tl-sm glass px-4 py-3 text-sm text-white/90"
                  >
                    {m.text}
                  </motion.div>
                ),
              )}
              {loading && (
                <div className="max-w-[60%] rounded-2xl rounded-tl-sm glass px-4 py-3 text-sm text-violet-glow">
                  <span className="inline-flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-violet-glow" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-violet-glow [animation-delay:0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-violet-glow [animation-delay:0.3s]" />
                  </span>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSend}
              className="relative mt-8 flex items-center gap-3 rounded-full glass px-4 py-3"
            >
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  user ? "Ask your future self anything…" : "Sign in to chat with your AI…"
                }
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-soft-gray"
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-royal-purple to-electric-purple shadow-glow disabled:opacity-50"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
