import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

async function callAI(system: string, user: string): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY missing");
  const res = await fetch(LOVABLE_AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (res.status === 429) throw new Error("AI rate limit reached. Please try again shortly.");
  if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in Lovable.");
  if (!res.ok) throw new Error(`AI request failed: ${res.status}`);
  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
}

export const summarizeMeeting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ title: z.string().min(1).max(200), notes: z.string().min(10).max(20000) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const system = `You are an expert meeting notes analyst. Produce a well-structured markdown summary with these sections and headings exactly:
## Executive Summary
## Key Discussion Points
## Decisions Made
## Action Items
## Deadlines
## Follow-up Tasks
Use bullet points. Be concise, professional, and accurate. If a section has no content, write "None identified".`;
    const summary = await callAI(system, data.notes);
    const { data: row, error } = await context.supabase
      .from("meeting_summaries")
      .insert({ user_id: context.userId, title: data.title, input_text: data.notes, summary })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const runResearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ topic: z.string().min(3).max(500) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const system = `You are an AI research assistant. Produce a comprehensive markdown research briefing with these sections:
## Topic Overview
## Key Concepts
## Detailed Explanation
## Important Facts
## Practical Examples
## Suggested Follow-up Questions
Be factual, clear, and well-organized. Use bullet points where helpful.`;
    const response = await callAI(system, data.topic);
    const { data: row, error } = await context.supabase
      .from("research_history")
      .insert({ user_id: context.userId, topic: data.topic, response })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const generateTaskPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      goal: z.string().min(3).max(500),
      deadline: z.string().optional(),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const system = `You are an AI productivity planner. Given a project goal, produce a markdown plan with these sections:
## Step-by-step Action Plan
## Recommended Task Order
## Estimated Completion Time
## Productivity Recommendations
## Daily Workflow Suggestions

Then, on a new line, output a JSON code block starting with \`\`\`json and ending with \`\`\` containing an array of tasks like:
[{"title":"...","description":"...","priority":"high|medium|low","days_from_now":1}]
Return 5-8 actionable tasks. Do not include anything after the JSON block.`;
    const user = `Goal: ${data.goal}${data.deadline ? `\nTarget deadline: ${data.deadline}` : ""}`;
    const raw = await callAI(system, user);

    // Split plan text and tasks JSON
    const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/);
    let tasks: Array<{ title: string; description?: string; priority?: string; days_from_now?: number }> = [];
    if (jsonMatch) {
      try { tasks = JSON.parse(jsonMatch[1]); } catch { /* ignore */ }
    }
    const planText = jsonMatch ? raw.slice(0, jsonMatch.index).trim() : raw;

    const rows = tasks.slice(0, 12).map((t, i) => {
      const deadline = t.days_from_now
        ? new Date(Date.now() + t.days_from_now * 86400000).toISOString().slice(0, 10)
        : null;
      return {
        user_id: context.userId,
        project_goal: data.goal,
        title: String(t.title || `Task ${i + 1}`).slice(0, 200),
        description: t.description ? String(t.description).slice(0, 1000) : null,
        priority: ["high", "medium", "low"].includes(String(t.priority)) ? String(t.priority) : "medium",
        deadline,
        order_index: i,
        ai_plan: i === 0 ? planText : null,
      };
    });

    if (rows.length > 0) {
      const { error } = await context.supabase.from("tasks").insert(rows);
      if (error) throw new Error(error.message);
    }
    return { plan: planText, taskCount: rows.length };
  });