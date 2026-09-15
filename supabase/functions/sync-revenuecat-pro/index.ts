import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const REVENUECAT_API_KEY = Deno.env.get("REVENUECAT_API_KEY")!;
const REVENUECAT_PROJECT_ID = Deno.env.get("REVENUECAT_PROJECT_ID")!;
const REVENUECAT_PRO_ENTITLEMENT_ID =
  Deno.env.get("REVENUECAT_PRO_ENTITLEMENT_ID")!;

const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
);

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader) return null;

  const match = authHeader.match(/^Bearer\s+(.+)$/i);

  return match?.[1] ?? null;
}

async function revenueCatFetch(path: string) {
  const response = await fetch(
    `https://api.revenuecat.com/v2${path}`,
    {
      headers: {
        Authorization: `Bearer ${REVENUECAT_API_KEY}`,
        Accept: "application/json",
      },
    },
  );

  const text = await response.text();

  let data: any = null;

  try {
    data = JSON.parse(text);
  } catch {
    // Keep data as null if RevenueCat returned non-JSON.
  }

  if (!response.ok) {
    console.error(
      `RevenueCat API error ${response.status}:`,
      text,
    );

    throw new Error(
      `RevenueCat API request failed with status ${response.status}`,
    );
  }

  return data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      { error: "Method not allowed" },
      405,
    );
  }

  try {
    const jwt = getBearerToken(req);

    if (!jwt) {
      return jsonResponse(
        { error: "Missing authorization token" },
        401,
      );
    }

    // Authenticate the user with Supabase.
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(jwt);

    if (authError || !user) {
      console.error("Supabase authentication failed:", authError);

      return jsonResponse(
        { error: "Invalid authentication token" },
        401,
      );
    }

    const userId = user.id;

    console.log(
      `Synchronizing RevenueCat Pro status for user ${userId}`,
    );

    /*
     * 1. Find the RevenueCat customer using the authenticated
     *    Supabase user's ID as the App User ID.
     */
    const customerSearch = await revenueCatFetch(
      `/projects/${REVENUECAT_PROJECT_ID}/customers` +
        `?search=${encodeURIComponent(userId)}&limit=20`,
    );

    const customers = customerSearch?.items ?? [];

    if (customers.length === 0) {
      console.log(
        `No RevenueCat customer found for ${userId}`,
      );

      // No RevenueCat customer means there is no Pro purchase
      // associated with this user.
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ is_pro: false })
        .eq("id", userId);

      if (updateError) {
        throw new Error(
          `Failed to update profile: ${updateError.message}`,
        );
      }

      return jsonResponse({
        isPro: false,
      });
    }

    const customer = customers[0];

    console.log(
      `RevenueCat customer found: ${customer.id}`,
    );

    /*
     * 2. Resolve the Pro entitlement.
     *
     * Your secret is currently expected to contain the
     * RevenueCat lookup key "Pro".
     *
     * If you later store the internal entitlement ID instead,
     * this also supports that.
     */
    let internalProEntitlementId =
      REVENUECAT_PRO_ENTITLEMENT_ID;

    if (!REVENUECAT_PRO_ENTITLEMENT_ID.startsWith("entl")) {
      const entitlements = await revenueCatFetch(
        `/projects/${REVENUECAT_PROJECT_ID}/entitlements?limit=100`,
      );

      const proEntitlement = (
        entitlements?.items ?? []
      ).find(
        (entitlement: any) =>
          entitlement.lookup_key ===
          REVENUECAT_PRO_ENTITLEMENT_ID,
      );

      if (!proEntitlement) {
        throw new Error(
          `RevenueCat entitlement "${REVENUECAT_PRO_ENTITLEMENT_ID}" not found`,
        );
      }

      internalProEntitlementId = proEntitlement.id;
    }

    console.log(
      `Using RevenueCat entitlement ${internalProEntitlementId}`,
    );

    /*
     * 3. Ask RevenueCat for the customer's CURRENT
     *    active entitlements.
     */
    const activeEntitlements = await revenueCatFetch(
      `/projects/${REVENUECAT_PROJECT_ID}` +
        `/customers/${encodeURIComponent(customer.id)}` +
        `/active_entitlements`,
    );

    const isPro =
      (activeEntitlements?.items ?? []).some(
        (entitlement: any) =>
          entitlement.entitlement_id ===
          internalProEntitlementId,
      );

    console.log(
      `RevenueCat Pro entitlement active: ${isPro}`,
    );

    /*
     * 4. ONLY THE SERVER writes profiles.is_pro.
     */
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        is_pro: isPro,
      })
      .eq("id", userId);

    if (updateError) {
      console.error(
        "Failed to update profile:",
        updateError,
      );

      return jsonResponse(
        {
          error: "Failed to synchronize Pro status",
        },
        500,
      );
    }

    console.log(
      `profiles.is_pro updated to ${isPro} for ${userId}`,
    );

    return jsonResponse({
      isPro,
    });
  } catch (error) {
    console.error(
      "sync-revenuecat-pro failed:",
      error,
    );

    /*
     * IMPORTANT:
     * We don't modify profiles.is_pro when RevenueCat itself
     * fails. A temporary RevenueCat/API problem must not
     * accidentally revoke somebody's Pro access.
     */
    return jsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : "Pro synchronization failed",
      },
      502,
    );
  }
});