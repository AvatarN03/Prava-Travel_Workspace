import { db, getDb } from "@/lib/db";

import { TIER_CONFIG } from "./constants";
import type { UserSubscriptionDetails, UserTierAndQuotas } from "./types";

export * from "./constants";
export * from "./types";

function getClient(): any {
  let client = db as any;
  if (!client?.subscription) {
    client = getDb() as any;
  }
  return client;
}

/**
 * Checks whether a given subscription record represents an active Pro entitlement.
 */
export function isSubscriptionActive(subscription: UserSubscriptionDetails | null): boolean {
  if (!subscription) return false;
  const isActive = ["active", "trialing"].includes(subscription.status.toLowerCase());
  if (!isActive) return false;
  if (subscription.currentPeriodEnd) {
    return new Date(subscription.currentPeriodEnd) > new Date();
  }
  return true;
}

/**
 * Selects the subscription that currently represents a user's entitlement.
 *
 * Subscription rows are an audit trail: a user can have a prior cancelled
 * subscription and a newer active subscription. Reading entitlement data must
 * never delete those records, because Usage relies on them for cycle history.
 */
async function getCanonicalUserSubscription(
  userId: string
): Promise<UserSubscriptionDetails | null> {
  if (!userId) return null;

  try {
    const client = getClient();
    if (!client?.subscription) return null;

    const subscriptions: UserSubscriptionDetails[] = await client.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!subscriptions || subscriptions.length === 0) {
      return null;
    }

    if (subscriptions.length === 1) {
      return subscriptions[0];
    }

    // Multiple subscriptions are valid. Determine the current entitlement only.
    const now = new Date();
    const activeSubs = subscriptions.filter(
      (s) =>
        ["active", "trialing"].includes(s.status.toLowerCase()) &&
        (!s.currentPeriodEnd || new Date(s.currentPeriodEnd) > now)
    );

    let canonical: UserSubscriptionDetails;

    if (activeSubs.length > 0) {
      // Pick active sub with latest currentPeriodEnd, or latest updatedAt
      canonical = activeSubs.sort((a, b) => {
        const endA = a.currentPeriodEnd ? new Date(a.currentPeriodEnd).getTime() : 0;
        const endB = b.currentPeriodEnd ? new Date(b.currentPeriodEnd).getTime() : 0;
        if (endA !== endB) return endB - endA;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      })[0];
    } else {
      // If no active subscriptions, pick latest updated/created subscription
      canonical = subscriptions.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0];
    }

    return canonical;
  } catch (error) {
    console.error("Error selecting a canonical user subscription:", error);
    return null;
  }
}

/**
 * Retrieve the database-backed subscription that currently controls entitlement.
 */
export async function getUserSubscription(
  userId: string
): Promise<UserSubscriptionDetails | null> {
  if (!userId) return null;

  try {
    const canonical = await getCanonicalUserSubscription(userId);
    return canonical;
  } catch (error) {
    console.error("Error retrieving user subscription from database:", error);
    return null;
  }
}

/**
 * Single source of truth for Pro entitlement checking across Prava.
 *
 * Rules:
 * 1. Must have a persisted Subscription record in PostgreSQL.
 * 2. Status must be "active" or "trialing".
 * 3. currentPeriodEnd (if populated) must be in the future.
 * 4. Never trusts client parameters, local storage, or browser-supplied headers.
 */
export async function hasActiveProSubscription(userId: string): Promise<boolean> {
  if (!userId) return false;

  try {
    const subscription = await getUserSubscription(userId);
    return isSubscriptionActive(subscription);
  } catch (error) {
    console.error("Error checking active pro subscription:", error);
    return false;
  }
}

/**
 * Returns tier metadata and quota allowances for an authenticated user.
 * Queries the database exactly once and derives entitlement in-memory.
 */
export async function getUserTierAndQuotas(userId: string): Promise<UserTierAndQuotas> {
  const subscription = await getUserSubscription(userId);
  const isPro = isSubscriptionActive(subscription);
  const config = isPro ? TIER_CONFIG.pro : TIER_CONFIG.free;

  return {
    isPro,
    ...config,
    subscription,
  };
}
