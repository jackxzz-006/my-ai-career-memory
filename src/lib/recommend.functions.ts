import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const inputSchema = z.object({
  education_level: z.string().trim().min(1).max(120),
  skills: z.string().trim().min(1).max(1000),
  goals: z.string().trim().min(1).max(1000),
  constraints: z.string().trim().max(1000).optional().default(""),
});

const pathSchema = z.object({
  title: z.string(),
  why_it_fits: z.string(),
  next_steps: z.array(z.string()).min(1).max(6),
});

export type RecommendationPath = z.infer<typeof pathSchema>;

const outputSchema = z.object({
  paths: z.array(pathSchema).min(2).max(3),
});

export const getCareerRecommendations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured");

    const { createLovableAiGatewayProvider } = await import("@/lib/ai-gateway.server");
    const { generateText } = await import("ai");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const prompt = `Student input:
- Education level: ${data.education_level}
- Skills / interests: ${data.skills}
- Career goals: ${data.goals}
- Constraints (location/budget/timeline): ${data.constraints || "none"}

Return STRICT JSON only (no markdown fences, no prose) matching:
{"paths":[{"title":"...","why_it_fits":"...","next_steps":["...","..."]}]}
Return 2 or 3 tailored career/education paths.`;

    const { text } = await generateText({
      model,
      system:
        "You are CareerTwin AI, a pragmatic career & education advisor. Always respond with valid JSON only — no code fences, no commentary.",
      prompt,
    });

    // Strip potential ```json fences defensively
    const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    let parsed: z.infer<typeof outputSchema>;
    try {
      parsed = outputSchema.parse(JSON.parse(cleaned));
    } catch {
      throw new Error("The AI returned an unexpected format. Please try again.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("recommendations")
      .insert({
        user_id: context.userId,
        education_level: data.education_level,
        skills: data.skills,
        goals: data.goals,
        constraints: data.constraints || null,
        paths: parsed.paths,
      })
      .select("id, created_at")
      .single();
    if (error) throw new Error(error.message);

    return { id: row!.id, created_at: row!.created_at, paths: parsed.paths };
  });

export const listMyRecommendations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("recommendations")
      .select("id, education_level, skills, goals, constraints, paths, created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });
