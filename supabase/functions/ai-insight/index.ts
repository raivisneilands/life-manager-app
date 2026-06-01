// supabase/functions/ai-insight/index.ts
// Deploy: supabase functions deploy ai-insight
// Secret:  supabase secrets set OPENAI_API_KEY=sk-...

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    // ── Auth ─────────────────────────────────────────────────────────────────
    const jwt = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!jwt) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // ── Parse body ────────────────────────────────────────────────────────────
    const { screen, context } = await req.json();

    if (!screen || !context) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: screen, context" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // ── Call OpenAI ───────────────────────────────────────────────────────────
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) throw new Error("OPENAI_API_KEY secret is not set");

    const SYSTEM = `You are a concise, warm personal coach embedded in a life-tracking app.
Given the user's data, respond with ONE punchy, actionable insight (2–3 sentences max).
Be specific — reference actual numbers or names from the data.
Avoid generic advice. No bullet points. No headers. Plain prose only.`;

    const SCREEN_PROMPT: Record<string, string> = {
      goals:         "Based on the user's goals and progress, give one specific, motivating insight.",
      habits:        "Based on the user's habits and streaks, give one insight about what to focus on today.",
      health:        "Based on the user's recent health data, give one practical wellness insight.",
      fitness:       "Based on the user's recent workouts, give one specific insight about their training — progress, consistency, or what to focus on next.",
      finance:       "Based on the user's recent finances, give one actionable money insight.",
      relationships: "Based on the user's relationships, give one thoughtful insight about who deserves attention.",
      today:         "Looking across all areas of the user's life, give one high-priority insight for today.",
    };

    const prompt = SCREEN_PROMPT[screen];
    if (!prompt) {
      return new Response(JSON.stringify({ error: `Unknown screen: ${screen}` }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const openAIRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 180,
        temperature: 0.75,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user",   content: `${prompt}\n\n${context}` },
        ],
      }),
    });

    if (!openAIRes.ok) {
      const err = await openAIRes.text();
      throw new Error(`OpenAI ${openAIRes.status}: ${err}`);
    }

    const data = await openAIRes.json();
    const insight = data.choices[0]?.message?.content?.trim() ?? "";

    return new Response(JSON.stringify({ insight }), {
      status: 200,
      headers: { ...CORS, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Internal error" }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
});