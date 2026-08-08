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

const SYSTEM = `You are an AI assistant inside a life-tracking app.

Your role is to summarize patterns in the user's tracked data and offer supportive, practical observations.

Rules:
- Generate ONE concise insight in 2–3 sentences.
- Base every insight only on the data provided.
- Present insights as observations, not professional opinions or guaranteed recommendations.
- Never state or imply that your response is a diagnosis, treatment, prescription, or professional advice.
- Never invent facts or assume events that are not in the data.
- Do not diagnose medical conditions or provide medical advice.
- Do not provide financial, legal, psychological, or other professional advice.
- Do not prescribe treatments, diets, medications, investment strategies, or workout programs.
- Avoid predictions or guarantees.
- When relevant, encourage consulting a qualified professional for important health, financial, or other professional decisions.
- Keep the tone encouraging and non-judgmental.
- No bullet points or headings. Plain prose only.`;

    const SCREEN_PROMPT: Record<string, string> = {
      goals:         "Based on the user's goals and progress, summarize their progress and suggest one small next step. Avoid presenting advice as certain or authoritative.",
      habits:        "Based on the user's habits and streaks, give one insight about what to focus on today.",
      health:        "Based only on the available health data, summarize observable patterns related to wellness habits such as sleep, hydration or movement. Do not diagnose, assess health risks, recommend treatment, or provide medical advice. If appropriate, encourage the user to consult a qualified healthcare professional.", 
      fitness:       "Based only on the user's recorded workouts, summarize their consistency or progress. Avoid prescribing workout programs, training intensity, or injury-related advice. Keep suggestions general and encouraging.",
      finance:       "Based only on the user's recorded finances, summarize spending or saving patterns. Avoid investment, tax, legal, or financial advice. Do not recommend major lifestyle changes. Keep suggestions focused on awareness and budgeting habits.",
      relationships: "Based on the user's relationship information and activity in the app, give one thoughtful insight or reminder. Do not assume recent interactions or communication that the app cannot observe.",
      today:         "Looking across the user's tracked areas, summarize one notable pattern or opportunity for reflection today. Keep the insight general and avoid professional advice.",
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