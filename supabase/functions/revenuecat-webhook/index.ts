// supabase/functions/revenuecat-webhook/index.ts
//
// RevenueCat → Supabase Pro entitlement synchronization.
//
// Required secrets:
//
// REVENUECAT_WEBHOOK_SECRET
// REVENUECAT_API_KEY
// REVENUECAT_PROJECT_ID
// REVENUECAT_PRO_ENTITLEMENT_ID
//
// Supabase provides:
//
// SUPABASE_URL
// SUPABASE_SERVICE_ROLE_KEY
//
// Deploy:
//
// supabase functions deploy revenuecat-webhook --no-verify-jwt

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, content-type, x-revenuecat-webhook-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PRO_ENTITLEMENT_ID = Deno.env.get(
  "REVENUECAT_PRO_ENTITLEMENT_ID",
);

if (!PRO_ENTITLEMENT_ID) {
  throw new Error(
    "REVENUECAT_PRO_ENTITLEMENT_ID is not configured",
  );
}

// Reject webhook timestamps older/newer than this.
// This protects against replaying an old valid webhook.
const SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Convert a hex string into bytes.
 */
function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hexadecimal string");
  }

  const bytes = new Uint8Array(hex.length / 2);

  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }

  return bytes;
}

/**
 * Constant-time comparison.
 */
function timingSafeEqual(
  a: Uint8Array,
  b: Uint8Array,
): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;

  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }

  return result === 0;
}

/**
 * Verify RevenueCat's HMAC webhook signature.
 *
 * RevenueCat signs:
 *
 *   `${timestamp}.${rawBody}`
 *
 * with the webhook signing secret using HMAC-SHA256.
 */
async function verifyRevenueCatSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): Promise<boolean> {
  if (!signatureHeader) {
    return false;
  }

  const parts = signatureHeader.split(",");

  let timestamp: string | null = null;
  let signature: string | null = null;

  for (const part of parts) {
    const [key, ...valueParts] = part.split("=");
    const value = valueParts.join("=");

    if (key === "t") {
      timestamp = value;
    }

    if (key === "v1") {
      signature = value;
    }
  }

  if (!timestamp || !signature) {
    return false;
  }

  const timestampNumber = Number(timestamp);

  if (!Number.isFinite(timestampNumber)) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);

  if (
    Math.abs(now - timestampNumber) >
    SIGNATURE_TOLERANCE_SECONDS
  ) {
    console.warn(
      "RevenueCat webhook timestamp outside tolerance",
    );

    return false;
  }

  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );

  const signedPayload = `${timestamp}.${rawBody}`;

  const digest = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(signedPayload),
  );

  const expectedSignature = new Uint8Array(digest);

  let receivedSignature: Uint8Array;

  try {
    receivedSignature = hexToBytes(signature);
  } catch {
    return false;
  }

  return timingSafeEqual(
    expectedSignature,
    receivedSignature,
  );
}

/**
 * Ask RevenueCat for the customer's CURRENT active entitlements.
 *
 * We deliberately do this instead of trusting the webhook event type.
 *
 * This protects against:
 *
 * - duplicate webhook deliveries
 * - delayed webhook deliveries
 * - out-of-order webhook deliveries
 * - cancellation events where entitlement is still active
 * - refunds / expirations
 */
async function getRevenueCatCustomerId(
  appUserId: string,
  revenueCatApiKey: string,
  revenueCatProjectId: string,
): Promise<string> {
  const url =
    `https://api.revenuecat.com/v2/projects/` +
    `${encodeURIComponent(revenueCatProjectId)}/customers` +
    `?search=${encodeURIComponent(appUserId)}&limit=20`;

  console.log(
    `Searching RevenueCat customer for App User ID ${appUserId}`,
  );

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${revenueCatApiKey}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `RevenueCat customer search returned ${response.status}: ${body}`,
    );
  }

  const data = await response.json();

  console.log(
    "RevenueCat customer search response:",
    JSON.stringify(data),
  );

  const customers = Array.isArray(data.items)
    ? data.items
    : [];

  if (customers.length === 0) {
    throw new Error(
      `RevenueCat customer not found for App User ID ${appUserId}`,
    );
  }

  // RevenueCat's search endpoint is searching for the supplied
  // App User ID, so the first result should be the matching customer.
  const customer = customers[0];

  if (!customer?.id) {
    throw new Error(
      `RevenueCat customer search returned a customer without an ID for App User ID ${appUserId}`,
    );
  }

  console.log(
    `Resolved RevenueCat App User ID ${appUserId} to customer ID ${customer.id}`,
  );

  return customer.id;
}


async function getProEntitlementId(
  revenueCatApiKey: string,
  revenueCatProjectId: string,
): Promise<string> {
  const url =
    `https://api.revenuecat.com/v2/projects/` +
    `${encodeURIComponent(revenueCatProjectId)}/entitlements` +
    `?limit=100`;

  console.log(
    `Looking up RevenueCat entitlement ${PRO_ENTITLEMENT_ID}`,
  );

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${revenueCatApiKey}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `RevenueCat entitlement lookup returned ${response.status}: ${body}`,
    );
  }

  const data = await response.json();

  console.log(
    "RevenueCat entitlement list:",
    JSON.stringify(data),
  );

  const entitlements = Array.isArray(data.items)
    ? data.items
    : [];

  const proEntitlement = entitlements.find(
    (entitlement: {
      id?: string;
      lookup_key?: string;
      display_name?: string;
    }) =>
      entitlement.lookup_key === PRO_ENTITLEMENT_ID,
  );

  if (!proEntitlement?.id) {
    throw new Error(
      `RevenueCat entitlement "${PRO_ENTITLEMENT_ID}" was not found`,
    );
  }

  console.log(
    `Resolved entitlement ${PRO_ENTITLEMENT_ID} to internal ID ${proEntitlement.id}`,
  );

  return proEntitlement.id;
}


async function hasActiveProEntitlement(
  appUserId: string,
  revenueCatApiKey: string,
  revenueCatProjectId: string,
): Promise<boolean> {
  // Step 1:
  // Resolve the App User ID to RevenueCat's customer ID.
  const customerId = await getRevenueCatCustomerId(
    appUserId,
    revenueCatApiKey,
    revenueCatProjectId,
  );

  // Step 2:
  // Resolve "Pro" to RevenueCat's internal entitlement ID.
  const proEntitlementId = await getProEntitlementId(
    revenueCatApiKey,
    revenueCatProjectId,
  );

  // Step 3:
  // Ask RevenueCat for the customer's currently active entitlements.
  const url =
    `https://api.revenuecat.com/v2/projects/` +
    `${encodeURIComponent(revenueCatProjectId)}/customers/` +
    `${encodeURIComponent(customerId)}/active_entitlements`;

  console.log(
    `Checking active entitlements for RevenueCat customer ${customerId}`,
  );

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${revenueCatApiKey}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `RevenueCat active entitlements returned ${response.status}: ${body}`,
    );
  }

  const data = await response.json();

  console.log(
    "RevenueCat active entitlements response:",
    JSON.stringify(data),
  );

  const entitlements = Array.isArray(data.items)
    ? data.items
    : [];

  const isPro = entitlements.some(
    (entitlement: {
      entitlement_id?: string;
    }) =>
      entitlement.entitlement_id === proEntitlementId,
  );

  console.log(
    `RevenueCat Pro entitlement active for ${appUserId}: ${isPro}`,
  );

  return isPro;
}

/**
 * Synchronize one Supabase profile with RevenueCat's current
 * entitlement state.
 *
 * Returns:
 * - "updated" when a profile was found and updated
 * - "missing" when no matching profile exists
 */
async function syncUserProStatus(
  supabaseAdmin: ReturnType<typeof createClient>,
  appUserId: string,
  revenueCatApiKey: string,
  revenueCatProjectId: string,
): Promise<"updated" | "missing"> {
  console.log(
    `Synchronizing RevenueCat user ${appUserId}`,
  );

  // Make sure the RevenueCat user currently has the Pro
  // entitlement.
  const isPro = await hasActiveProEntitlement(
    appUserId,
    revenueCatApiKey,
    revenueCatProjectId,
  );

  console.log(
    `RevenueCat current Pro state for ${appUserId}: ${isPro}`,
  );

  // Verify that this RevenueCat App User ID corresponds
  // to a Supabase profile.
  const {
    data: profile,
    error: profileLookupError,
  } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("id", appUserId)
    .maybeSingle();

  if (profileLookupError) {
    throw new Error(
      `Profile lookup failed for ${appUserId}: ${profileLookupError.message}`,
    );
  }

  if (!profile) {
    console.warn(
      `No profile found for RevenueCat user ${appUserId}`,
    );

    return "missing";
  }

  // Synchronize the authoritative RevenueCat state.
  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({
      is_pro: isPro,
    })
    .eq("id", appUserId);

  if (updateError) {
    throw new Error(
      `Failed to update profile Pro state for ${appUserId}: ${updateError.message}`,
    );
  }

  console.log(
    `Synchronized profiles.is_pro=${isPro} for ${appUserId}`,
  );

  return "updated";
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: CORS_HEADERS,
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      {
        error: "Method not allowed",
      },
      405,
    );
  }

  try {
    // ────────────────────────────────────────────────────────────────────────
    // Secrets
    // ────────────────────────────────────────────────────────────────────────

    const webhookSecret =
      Deno.env.get("REVENUECAT_WEBHOOK_SECRET");

    const revenueCatApiKey =
      Deno.env.get("REVENUECAT_API_KEY");

    const revenueCatProjectId =
      Deno.env.get("REVENUECAT_PROJECT_ID");

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const supabaseServiceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!webhookSecret) {
      throw new Error(
        "REVENUECAT_WEBHOOK_SECRET is not configured",
      );
    }

    if (!revenueCatApiKey) {
      throw new Error(
        "REVENUECAT_API_KEY is not configured",
      );
    }

    if (!revenueCatProjectId) {
      throw new Error(
        "REVENUECAT_PROJECT_ID is not configured",
      );
    }

    if (!supabaseUrl) {
      throw new Error(
        "SUPABASE_URL is not configured",
      );
    }

    if (!supabaseServiceRoleKey) {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY is not configured",
      );
    }

    // ────────────────────────────────────────────────────────────────────────
    // Read RAW body before JSON.parse().
    // ────────────────────────────────────────────────────────────────────────

    const rawBody = await req.text();

    const signatureHeader = req.headers.get(
      "x-revenuecat-webhook-signature",
    );

    const signatureValid =
      await verifyRevenueCatSignature(
        rawBody,
        signatureHeader,
        webhookSecret,
      );

    if (!signatureValid) {
      console.warn(
        "Rejected RevenueCat webhook: invalid signature",
      );

      return jsonResponse(
        {
          error: "Unauthorized",
        },
        401,
      );
    }

    // ────────────────────────────────────────────────────────────────────────
    // Parse webhook
    // ────────────────────────────────────────────────────────────────────────

    let payload: {
      api_version?: string;

      event?: {
        id?: string;
        type?: string;
        app_user_id?: string;
        entitlement_ids?: string[];
        environment?: string;
        app_id?: string;

        transferred_from?: string[];
        transferred_to?: string[];
      };
    };

    try {
      payload = JSON.parse(rawBody);
    } catch {
      return jsonResponse(
        {
          error: "Invalid JSON",
        },
        400,
      );
    }

    const event = payload.event;

    if (!event) {
      return jsonResponse(
        {
          error: "Missing event",
        },
        400,
      );
    }

    const eventType = event.type;

    console.log(
      `RevenueCat webhook received: ${eventType}`,
    );

    // ────────────────────────────────────────────────────────────────────────
    // Supabase admin client
    // ────────────────────────────────────────────────────────────────────────

    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // ────────────────────────────────────────────────────────────────────────
    // TRANSFER
    //
    // RevenueCat TRANSFER events do not use app_user_id.
    //
    // Instead they provide:
    //
    // transferred_from
    // transferred_to
    //
    // We need to:
    //
    // 1. Remove Pro from the old customer.
    // 2. Grant Pro to the new customer.
    //
    // We determine the actual current entitlement state from
    // RevenueCat for each user instead of blindly setting values.
    // ────────────────────────────────────────────────────────────────────────

    if (eventType === "TRANSFER") {
      const transferredFrom = Array.isArray(
        event.transferred_from,
      )
        ? event.transferred_from
        : [];

      const transferredTo = Array.isArray(
        event.transferred_to,
      )
        ? event.transferred_to
        : [];

      console.log(
        "RevenueCat transfer:",
        JSON.stringify({
          transferredFrom,
          transferredTo,
        }),
      );

      if (
        transferredFrom.length === 0 &&
        transferredTo.length === 0
      ) {
        console.warn(
          "TRANSFER event contains no transferred users",
        );

        return jsonResponse({
          ok: true,
          ignored: true,
          reason: "No transferred users",
        });
      }

      const updatedUsers: string[] = [];
      const missingProfiles: string[] = [];

      // Synchronize the new owner(s) first.
      for (const appUserId of transferredTo) {
        const result = await syncUserProStatus(
          supabaseAdmin,
          appUserId,
          revenueCatApiKey,
          revenueCatProjectId,
        );

        if (result === "updated") {
          updatedUsers.push(appUserId);
        } else {
          missingProfiles.push(appUserId);
        }
      }

      // Then synchronize the old owner(s).
      //
      // In a normal transfer RevenueCat should no longer report
      // the entitlement as active for these users, so this will
      // set profiles.is_pro=false.
      for (const appUserId of transferredFrom) {
        const result = await syncUserProStatus(
          supabaseAdmin,
          appUserId,
          revenueCatApiKey,
          revenueCatProjectId,
        );

        if (result === "updated") {
          updatedUsers.push(appUserId);
        } else {
          missingProfiles.push(appUserId);
        }
      }

      return jsonResponse({
        ok: true,
        event: "TRANSFER",
        updated_users: updatedUsers,
        missing_profiles: missingProfiles,
      });
    }

    // ────────────────────────────────────────────────────────────────────────
    // NORMAL EVENTS
    //
    // All other RevenueCat events should contain app_user_id.
    // ────────────────────────────────────────────────────────────────────────

    const appUserId = event.app_user_id;

    if (!appUserId) {
      console.warn(
        `RevenueCat ${eventType} webhook has no app_user_id`,
      );

      // Acknowledge the webhook so RevenueCat doesn't retry
      // a malformed/unsupported event forever.
      return jsonResponse({
        ok: true,
        ignored: true,
        reason: "Missing app_user_id",
        event: eventType ?? null,
      });
    }

    console.log(
      `RevenueCat webhook: ${eventType} for ${appUserId}`,
    );

    // ────────────────────────────────────────────────────────────────────────
    // Synchronize current RevenueCat entitlement state
    // ────────────────────────────────────────────────────────────────────────

    const result = await syncUserProStatus(
      supabaseAdmin,
      appUserId,
      revenueCatApiKey,
      revenueCatProjectId,
    );

    if (result === "missing") {
      // The webhook was valid, but the corresponding profile
      // does not exist.
      //
      // We acknowledge it rather than retrying forever.
      return jsonResponse({
        ok: true,
        ignored: true,
        reason: "Profile not found",
        user_id: appUserId,
        event: eventType ?? null,
      });
    }

    return jsonResponse({
      ok: true,
      event: eventType ?? null,
      user_id: appUserId,
      synchronized: true,
    });
  } catch (error) {
    console.error(
      "RevenueCat webhook failed:",
      error,
    );

    return jsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      500,
    );
  }
});

