// supabase/functions/ai-goal-plan/index.ts
//
// Deploy:
//   supabase functions deploy ai-goal-plan
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
 * Supabase admin client.
 *
 * IMPORTANT:
 * The service-role key is only available inside this Edge Function.
 * Never expose it to the mobile application.
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

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: CORS,
  });
}

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
     * We deliberately do not trust a user ID supplied by the client.
     * The authenticated user's ID comes from Supabase.
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
    // 2. Check Pro entitlement
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
    // 3. Parse and validate goal
    // ─────────────────────────────────────────────────────────────────────────

    let goal: unknown;

    try {
      goal = await req.json();
    } catch {
      return jsonResponse(
        { error: "Invalid JSON body" },
        400,
      );
    }

    if (
      typeof goal !== "object" ||
      goal === null ||
      Array.isArray(goal)
    ) {
      return jsonResponse(
        { error: "Invalid goal payload" },
        400,
      );
    }

    const goalData = goal as Record<string, unknown>;

    // ─────────────────────────────────────────────────────────────────────────
    // Validate title
    // ─────────────────────────────────────────────────────────────────────────

    if (
      typeof goalData.title !== "string" ||
      !goalData.title.trim()
    ) {
      return jsonResponse(
        { error: "Goal title is required" },
        400,
      );
    }

    if (goalData.title.length > 500) {
      return jsonResponse(
        { error: "Goal title is too long" },
        400,
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Validate goal type
    // ─────────────────────────────────────────────────────────────────────────

    const validGoalTypes = ["min", "max", "binary"];

    if (
      typeof goalData.goalType !== "string" ||
      !validGoalTypes.includes(goalData.goalType)
    ) {
      return jsonResponse(
        { error: "Invalid goal type" },
        400,
      );
    }

    const goalType = goalData.goalType;

    // ─────────────────────────────────────────────────────────────────────────
    // Validate numeric goals
    // ─────────────────────────────────────────────────────────────────────────

    if (goalType !== "binary") {
      if (
        typeof goalData.currentValue !== "number" ||
        !Number.isFinite(goalData.currentValue)
      ) {
        return jsonResponse(
          { error: "Invalid current value" },
          400,
        );
      }

      if (
        typeof goalData.targetValue !== "number" ||
        !Number.isFinite(goalData.targetValue)
      ) {
        return jsonResponse(
          { error: "Invalid target value" },
          400,
        );
      }

      if (
        typeof goalData.unit !== "string" ||
        goalData.unit.length > 100
      ) {
        return jsonResponse(
          { error: "Invalid goal unit" },
          400,
        );
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Validate deadline if supplied
    // ─────────────────────────────────────────────────────────────────────────

    if (
      goalData.deadline !== undefined &&
      goalData.deadline !== null &&
      typeof goalData.deadline !== "string"
    ) {
      return jsonResponse(
        { error: "Invalid deadline" },
        400,
      );
    }

    if (
      typeof goalData.deadline === "string" &&
      goalData.deadline.length > 100
    ) {
      return jsonResponse(
        { error: "Deadline is too long" },
        400,
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4. Build a clean goal payload
    //
    // Only send fields that the AI actually needs.
    // ─────────────────────────────────────────────────────────────────────────

    const cleanGoal: Record<string, unknown> = {
      title: goalData.title.trim(),
      goalType,
    };

    if (goalType === "binary") {
      cleanGoal.deadline =
        typeof goalData.deadline === "string"
          ? goalData.deadline.trim()
          : "";
    } else {
      cleanGoal.currentValue = goalData.currentValue;
      cleanGoal.targetValue = goalData.targetValue;
      cleanGoal.unit =
        typeof goalData.unit === "string"
          ? goalData.unit.trim()
          : "";

      cleanGoal.deadline =
        typeof goalData.deadline === "string"
          ? goalData.deadline.trim()
          : "";
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 5. Call OpenAI
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
          temperature: 0.7,
          max_tokens: 400,

          response_format: {
            type: "json_schema",
            json_schema: {
              name: "goal_plan",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  steps: {
                    type: "array",
                    minItems: 5,
                    maxItems: 10,
                    items: {
                      type: "string",
                    },
                  },
                },
                required: ["steps"],
                additionalProperties: false,
              },
            },
          },

          messages: [
            {
              role: "system",
              content: `
You are a goal planning assistant inside a life-tracking application.

Your task is to generate a structured sequence of milestone steps for the user's goal.

STRICT REQUIREMENTS:
- Output MUST be valid JSON matching the provided schema.
- Output MUST contain a "steps" array.
- "steps" MUST contain between 5 and 10 items.
- Each item MUST be a string.
- Each step must be short and actionable.
- Steps must follow a logical progression from start to finish.
- Do not include explanations.
- Do not include markdown.
- Do not include headings.
- Do not include any keys other than "steps".

GOAL TYPE RULES:

For goalType = "max":
- Increasing the tracked value represents progress.
- Create steps that logically help the user move toward the target.
- Do not assume the user should exceed the target.

For goalType = "min":
- Decreasing the tracked value represents progress.
- Create steps that logically help the user move toward the target.
- Do not assume that lower is always better outside the goal's stated context.

For goalType = "binary":
- This is a checklist goal.
- There are no numeric progress values.
- Break the goal title into concrete sequential actions required to accomplish it.
- Do not invent numeric targets or metrics.
- The goal is complete when all generated steps are completed.

IMPORTANT:
- Base the plan only on the information provided in the goal.
- Do not invent facts about the user.
- Do not provide medical, financial, legal, or other professional advice.
- If the goal involves a sensitive professional area, keep the steps general and informational.
- Always generate at least 5 steps.
- Never generate more than 10 steps.
              `,
            },
            {
              role: "user",
              content: JSON.stringify(cleanGoal),
            },
          ],
        }),
      },
    );

    // ─────────────────────────────────────────────────────────────────────────
    // 6. Handle OpenAI errors safely
    // ─────────────────────────────────────────────────────────────────────────

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

    // ─────────────────────────────────────────────────────────────────────────
    // 7. Extract and validate generated response
    // ─────────────────────────────────────────────────────────────────────────

    const content =
      data.choices?.[0]?.message?.content;

    if (typeof content !== "string" || !content.trim()) {
      console.error("OpenAI returned an empty goal plan");

      return jsonResponse(
        {
          error: "AI returned an empty response",
        },
        502,
      );
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(content);
    } catch (error) {
      console.error(
        "Failed to parse OpenAI goal plan:",
        error,
        content,
      );

      return jsonResponse(
        {
          error: "AI returned an invalid response",
        },
        502,
      );
    }

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return jsonResponse(
        {
          error: "AI returned an invalid plan",
        },
        502,
      );
    }

    const result = parsed as Record<string, unknown>;

    if (!Array.isArray(result.steps)) {
      return jsonResponse(
        {
          error: "AI returned an invalid plan",
        },
        502,
      );
    }

    const steps = result.steps.filter(
      (step): step is string =>
        typeof step === "string" && step.trim().length > 0,
    );

    if (steps.length < 5 || steps.length > 10) {
      console.error(
        `AI returned ${steps.length} valid steps`,
      );

      return jsonResponse(
        {
          error: "AI returned an invalid number of steps",
        },
        502,
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 8. Return the validated plan
    // ─────────────────────────────────────────────────────────────────────────

    return jsonResponse({
      steps: steps.map((step) => step.trim()),
    });
  } catch (error) {
    console.error("ai-goal-plan error:", error);

    return jsonResponse(
      {
        error: "Internal server error",
      },
      500,
    );
  }
});