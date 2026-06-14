import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type LeaderboardEntry = {
  id: string;
  username: string;
  xp: number;
  pulse?: boolean;
};

export function useLeaderboard(limit = 10) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    let active = true;
    supabase
      .from("profiles")
      .select("id, username, xp")
      .order("xp", { ascending: false })
      .limit(limit)
      .then(({ data }) => {
        if (active && data) setEntries(data as LeaderboardEntry[]);
      });

    const channel = supabase
      .channel("leaderboard-profiles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          setEntries((prev) => {
            let next = [...prev];
            if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
              const r = payload.new as LeaderboardEntry;
              const idx = next.findIndex((e) => e.id === r.id);
              if (idx >= 0) next[idx] = { ...r, pulse: true };
              else next.push({ ...r, pulse: true });
            } else if (payload.eventType === "DELETE") {
              const r = payload.old as LeaderboardEntry;
              next = next.filter((e) => e.id !== r.id);
            }
            next.sort((a, b) => b.xp - a.xp);
            return next.slice(0, limit);
          });
          // clear pulse after animation
          setTimeout(() => {
            setEntries((prev) => prev.map((e) => ({ ...e, pulse: false })));
          }, 1500);
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [limit]);

  return entries;
}

export type ActivityEvent = {
  id: string;
  username: string;
  message: string;
  type: string;
  created_at: string;
};

export function useActivityFeed(limit = 12) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    let active = true;
    supabase
      .from("activity_feed")
      .select("id, username, message, type, created_at")
      .order("created_at", { ascending: false })
      .limit(limit)
      .then(({ data }) => {
        if (active && data) setEvents(data as ActivityEvent[]);
      });

    const channel = supabase
      .channel("activity-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_feed" },
        (payload) => {
          setEvents((prev) => [payload.new as ActivityEvent, ...prev].slice(0, limit));
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [limit]);

  return events;
}

export function useMyProfile() {
  const [profile, setProfile] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        if (active) setProfile(null);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("id, username, xp")
        .eq("id", u.user.id)
        .maybeSingle();
      if (active && data) setProfile(data as LeaderboardEntry);
    }
    load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => load());

    const channel = supabase
      .channel("my-profile")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        (payload) => {
          setProfile((prev) => {
            const r = payload.new as LeaderboardEntry;
            if (prev && prev.id === r.id) return r;
            return prev;
          });
        },
      )
      .subscribe();

    return () => {
      active = false;
      sub.subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  return profile;
}
