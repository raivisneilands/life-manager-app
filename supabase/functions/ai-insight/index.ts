// supabase/functions/ai-insight/index.ts
//
// Deploy:
//   supabase functions deploy ai-insight
//
// Required secrets:
//   OPENAI_API_KEY
//   SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, content-type, apikey, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get(
  "SUPABASE_SERVICE_ROLE_KEY",
);
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

if (!SUPABASE_URL) {
  throw new Error("SUPABASE_URL is not configured");
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
}

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not configured");
}

/**
 * Supabase client using the service-role key.
 *
 * IMPORTANT:
 * This exists ONLY inside the Edge Function.
 * Never expose the service-role key to the mobile app.
 */
const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const SCREEN_PROMPT: Record<string, string> = {
  goals:
    "Based on the user's goals and progress, summarize their progress and suggest one small next step. Avoid presenting advice as certain or authoritative.",

  habits:
    "Based on the user's habits and streaks, give one insight about what to focus on today.",

  health:
    "Based only on the available health data, summarize observable patterns related to wellness habits such as sleep, hydration or movement. Do not diagnose, assess health risks, recommend treatment, or provide medical advice. If appropriate, encourage the user to consult a qualified healthcare professional.",

  fitness:
    "Based only on the user's recorded workouts, summarize their consistency or progress. Avoid prescribing workout programs, training intensity, or injury-related advice. Keep suggestions general and encouraging.",

  finance:
    "Based only on the user's recorded finances, summarize spending or saving patterns. Avoid investment, tax, legal, or financial advice. Do not recommend major lifestyle changes. Keep suggestions focused on awareness and budgeting habits.",

  relationships:
    "Based on the user's relationship information and activity in the app, give one thoughtful insight or reminder. Do not assume recent interactions or communication that the app cannot observe.",

  today:
    "Looking across the user's tracked areas, summarize one notable pattern or opportunity for reflection today. Keep the insight general and avoid professional advice.",
};

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
- No bullet points or headings.
- Plain prose only.`;

/**
 * Create a JSON response with CORS headers.
 */
function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: CORS,
  });
}

/**
 * Extract the bearer token from the Authorization header.
 */
function getBearerToken(req: Request): string | null {
  const authorization = req.headers.get("authorization");

  if (!authorization) {
    return null;
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);

  return match?.[1] ?? null;
}

Deno.serve(async (req) => {
  // ───────────────────────────────────────────────────────────────────────────
  // CORS preflight
  // ───────────────────────────────────────────────────────────────────────────

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: CORS,
    });
  }

  // Only POST is supported.
  if (req.method !== "POST") {
    return jsonResponse(
      { error: "Method not allowed" },
      405,
    );
  }

  try {
    // ─────────────────────────────────────────────────────────────────────────
    // 1. Authenticate the user
    // ─────────────────────────────────────────────────────────────────────────

    const jwt = getBearerToken(req);

    if (!jwt) {
      return jsonResponse(
        { error: "Unauthorized" },
        401,
      );
    }

    /**
     * Validate the JWT with Supabase Auth.
     *
     * We do NOT trust the user ID sent by the client.
     * The authenticated user ID comes from Supabase.
     */
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(jwt);

    if (authError || !user) {
      console.error("Authentication failed:", authError);

      return jsonResponse(
        { error: "Unauthorized" },
        401,
      );
    }

    const userId = user.id;

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Check the user's Pro entitlement
    // ─────────────────────────────────────────────────────────────────────────

    const {
      data: profile,
      error: profileError,
    } = await supabaseAdmin
      .from("profiles")
      .select("is_pro")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Failed to load profile:", profileError);

      return jsonResponse(
        { error: "Unable to verify Pro status" },
        500,
      );
    }

    if (!profile) {
      return jsonResponse(
        { error: "Profile not found" },
        403,
      );
    }

    if (profile.is_pro !== true) {
      return jsonResponse(
        {
          error: "Pro access required",
          code: "PRO_REQUIRED",
        },
        403,
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Parse and validate request body
    // ─────────────────────────────────────────────────────────────────────────

    let body: {
      screen?: unknown;
      context?: unknown;
    };

    try {
      body = await req.json();
    } catch {
      return jsonResponse(
        { error: "Invalid JSON body" },
        400,
      );
    }

    const { screen, context } = body;

    if (typeof screen !== "string" || !screen) {
      return jsonResponse(
        { error: "Missing required field: screen" },
        400,
      );
    }

    if (typeof context !== "string" || !context) {
      return jsonResponse(
        { error: "Missing required field: context" },
        400,
      );
    }

    // Prevent arbitrary/unknown screens from reaching OpenAI.
    const prompt = SCREEN_PROMPT[screen];

    if (!prompt) {
      return jsonResponse(
        {
          error: `Unknown screen: ${screen}`,
        },
        400,
      );
    }

    /**
     * Protect the OpenAI endpoint from unexpectedly large requests.
     *
     * The mobile app should only send a relatively small summary of
     * the user's tracked data.
     */
    const MAX_CONTEXT_LENGTH = 20_000;

    if (context.length > MAX_CONTEXT_LENGTH) {
      return jsonResponse(
        {
          error: "Context is too large",
        },
        413,
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4. Call OpenAI
    // ─────────────────────────────────────────────────────────────────────────

    const openAIRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: 180,
          temperature: 0.75,
          messages: [
            {
              role: "system",
              content: SYSTEM,
            },
            {
              role: "user",
              content: `${prompt}\n\n${context}`,
            },
          ],
        }),
      },
    );

    if (!openAIRes.ok) {
      const errorText = await openAIRes.text();

      console.error(
        `OpenAI request failed (${openAIRes.status}):`,
        errorText,
      );

      return jsonResponse(
        {
          error: "AI service unavailable",
        },
        502,
      );
    }

    const data = await openAIRes.json();

    const insight =
      data.choices?.[0]?.message?.content?.trim() ?? "";

    if (!insight) {
      console.error("OpenAI returned an empty insight");

      return jsonResponse(
        {
          error: "AI returned an empty response",
        },
        502,
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 5. Return result
    // ─────────────────────────────────────────────────────────────────────────

    return jsonResponse({
      insight,
    });
  } catch (error) {
    console.error("ai-insight error:", error);

    return jsonResponse(
      {
        error: "Internal server error",
      },
      500,
    );
  }
});