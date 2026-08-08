// supabase/functions/ai-goal-plan/index.ts

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, content-type, apikey, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const jwt = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!jwt) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: {
            ...CORS,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const goal = await req.json();

    const apiKey = Deno.env.get("OPENAI_API_KEY");

    const openAIRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.7,
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
                    items: { type: "string" }
                  }
                },
                required: ["steps"],
                additionalProperties: false
              }
            }
          },
          messages: [
            {
              role: "system",
              content: `
You are a goal planning assistant.

Your task is to generate a structured plan of milestone steps for a user goal.

---

STRICT REQUIREMENTS (must follow exactly):
- Output MUST be valid JSON
- Output MUST contain a field called "steps"
- "steps" MUST be an array of strings
- "steps" MUST contain between 5 and 10 items (inclusive)
- Do NOT output fewer than 5 steps under any condition
- Do NOT output more than 10 steps
- Each step must be a short, actionable instruction
- Steps must follow a logical progression from start to finish
- Do NOT include explanations, markdown, or extra keys

---

GOAL TYPE RULE:
- If goalType = "max" → increasing values means progress
- If goalType = "min" → decreasing values means progress
- If goalType = "binary" → this is a checklist goal with NO numeric progress values (no currentValue, targetValue, or unit will be provided). The goal is considered complete only once every step you generate has been checked off. Break the goal's title down into the concrete, sequential actions required to fully accomplish it — do not invent or reference any numeric metric.
- NEVER assume higher numbers are always better

---

OUTPUT FORMAT (example):
{
  "steps": [
    "Step 1",
    "Step 2",
    "Step 3",
    "Step 4",
    "Step 5"
  ]
}

---

IMPORTANT:
If you are unsure, still output 5–10 valid steps. Never reduce the number of steps below 5.
              `,
            },
            {
              role: "user",
              content: JSON.stringify(goal),
            },
          ],
        }),
      }
    );

    const data = await openAIRes.json();

    const content =
      data.choices?.[0]?.message?.content ?? '{"steps":[]}';

    return new Response(content, {
      status: 200,
      headers: {
        ...CORS,
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...CORS,
          "Content-Type": "application/json",
        },
      }
    );
  }
});