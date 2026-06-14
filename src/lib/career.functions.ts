import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// POST /ai equivalent — generate AI career suggestion + store in ai_results.
export const askCareerAI = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ prompt: z.string().trim().min(2).max(2000) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured");

    const { createLovableAiGatewayProvider } = await import("@/lib/ai-gateway.server");
    const { generateText } = await import("ai");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const { text } = await generateText({
      model,
      system:
        "You are CareerTwin AI, a sharp career strategist. For each user question, respond in concise markdown with three sections: **Career Path**, **Skills to Improve**, **Roadmap (next 3 steps)**. Keep it under 180 words.",
      prompt: data.prompt,
    });

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("ai_results")
      .insert({ user_id: context.userId, prompt: data.prompt, response: text })
      .select("id, prompt, response, created_at")
      .single();

    return { id: row?.id, prompt: data.prompt, response: text, created_at: row?.created_at };
  });

// Complete a task → award XP + log to activity feed.
export const completeTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        title: z.string().trim().min(1).max(120),
        xp: z.number().int().min(1).max(2000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profile, error: pErr } = await supabaseAdmin
      .from("profiles")
      .select("username, xp")
      .eq("id", context.userId)
      .single();
    if (pErr || !profile) throw new Error("Profile not found");

    const prevLevel = Math.floor(profile.xp / 1000);
    const newXp = profile.xp + data.xp;
    const newLevel = Math.floor(newXp / 1000);

    const { error: uErr } = await supabaseAdmin
      .from("profiles")
      .update({ xp: newXp })
      .eq("id", context.userId);
    if (uErr) throw new Error(uErr.message);

    await supabaseAdmin.from("activity_feed").insert({
      user_id: context.userId,
      username: profile.username,
      message: `Completed "${data.title}" — +${data.xp} XP`,
      type: "task",
    });

    if (newLevel > prevLevel) {
      await supabaseAdmin.from("activity_feed").insert({
        user_id: context.userId,
        username: profile.username,
        message: `Level Up! Reached Lv.${newLevel + 1}`,
        type: "levelup",
      });
    }

    return { xp: newXp, leveledUp: newLevel > prevLevel };
  });
