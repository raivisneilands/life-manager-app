import { ENV } from "@/config/env";
import Purchases, {
  CustomerInfo,
  PurchasesError,
  PurchasesPackage,
} from "react-native-purchases";

const REVENUECAT_API_KEY =
  __DEV__
    ? process.env.EXPO_PUBLIC_REVENUECAT_TEST_KEY
    : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;

console.log("RevenueCat API Key: ", REVENUECAT_API_KEY)

export const PRO_ENTITLEMENT = "Pro";

let configured = false;

/**
 * Initialize RevenueCat for the currently authenticated user.
 */
export async function initializeBilling(userId: string) {
  console.log("RC initializeBilling START", {
    userId,
    configured,
  });

  if (!userId) {
    throw new Error("Cannot initialize billing without a user ID");
  }

  try {
    if (!configured) {
      console.log("RC configuring RevenueCat...");

      Purchases.configure({
        apiKey: REVENUECAT_API_KEY,
        appUserID: userId,
      });

      configured = true;

      console.log("RC configured");
    } else {
      console.log("RC already configured, logging in...");
      await Purchases.logIn(userId);
    }

    console.log("RC getting customer info...");

    const customerInfo = await getCustomerInfo();

    console.log("RC customer info received", {
      pro:
        customerInfo.entitlements.active[PRO_ENTITLEMENT] !== undefined,
    });

    return customerInfo;
  } catch (error) {
    console.error("RC initializeBilling FAILED", error);
    throw error;
  }
}

/**
 * Get the current RevenueCat customer information.
 */
export async function getCustomerInfo(): Promise<CustomerInfo> {
  try {
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.error("Failed to get RevenueCat customer info:", error);
    throw error;
  }
}

/**
 * Check whether the user currently has the Pro entitlement.
 */
export async function checkIsPro(): Promise<boolean> {
  try {
    const customerInfo = await getCustomerInfo();

    return (
      customerInfo.entitlements.active[PRO_ENTITLEMENT] !== undefined
    );
  } catch (error) {
    console.error("Failed to check Pro entitlement:", error);
    return false;
  }
}

/**
 * Get the current RevenueCat offering.
 */
export async function getDefaultOffering() {
  try {
    const offerings = await Purchases.getOfferings();

    return offerings.current;
  } catch (error) {
    console.error("Failed to get RevenueCat offerings:", error);
    throw error;
  }
}

/**
 * Get the Lifetime package from the current offering.
 */
export async function getLifetimePackage(): Promise<PurchasesPackage | null> {
  const offering = await getDefaultOffering();

  if (!offering) {
    return null;
  }

  return (
    offering.availablePackages.find(
      (pkg) => pkg.packageType === "LIFETIME",
    ) ?? null
  );
}

/**
 * Purchase the Lifetime Pro package.
 */
export async function purchasePro(): Promise<CustomerInfo> {
  try {
    const lifetimePackage = await getLifetimePackage();

    if (!lifetimePackage) {
      throw new Error(
        "Lifetime package is not available. Check your RevenueCat offering configuration.",
      );
    }

    const { customerInfo } = await Purchases.purchasePackage(
      lifetimePackage,
    );

    return customerInfo;
  } catch (error) {
    const purchasesError = error as PurchasesError;

    // User cancelled the purchase.
    if (purchasesError.userCancelled) {
      throw new Error("PURCHASE_CANCELLED");
    }

    console.error("Pro purchase failed:", error);
    throw error;
  }
}

export async function syncRevenueCatPro(
  userJwt: string,
): Promise<boolean> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    const response = await fetch(
      `${ENV.supabaseUrl}/functions/v1/sync-revenuecat-pro`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userJwt}`,
          apikey: ENV.supabaseAnonKey,
        },
        signal: controller.signal,
      },
    );

    const text = await response.text();

    let data: any = null;

    try {
      data = JSON.parse(text);
    } catch {
      // Ignore invalid JSON.
    }

    if (!response.ok) {
      throw new Error(
        data?.error ||
          `Pro synchronization failed (${response.status})`,
      );
    }

    return data?.isPro === true;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Restore purchases made by the user.
 */
export async function restorePurchases(): Promise<CustomerInfo> {
  try {
    return await Purchases.restorePurchases();
  } catch (error) {
    console.error("Failed to restore purchases:", error);
    throw error;
  }
}

/**
 * Log the current user out of RevenueCat.
 */
export async function logoutBilling() {
  try {
    await Purchases.logOut();
  } catch (error) {
    console.error("Failed to log out of RevenueCat:", error);
  }

  configured = false;
}