import type { Prisma } from "@prisma/client";

import { TIER_CONFIG } from "@/services/subscription/constants";

export type TripCapacityAction = "create" | "duplicate" | "clone";

const TRIP_CAPACITY_LOCK_PREFIX = "trip-capacity";

export function getTripLimit(isPro: boolean): number {
  return TIER_CONFIG[isPro ? "pro" : "free"].tripsQuota;
}

function getActionDescription(action: TripCapacityAction): string {
  switch (action) {
    case "duplicate":
      return "duplicate trips";
    case "clone":
      return "clone templates";
    default:
      return "create trips";
  }
}

/**
 * Error returned when a user has reached the trip quota for their current tier.
 * Keeping this as a typed error lets every trip-creation flow share the same
 * transaction-safe check while preserving a user-friendly action-specific message.
 */
export class TripCapacityExceededError extends Error {
  constructor(
    public readonly count: number,
    public readonly maxTrips: number,
    public readonly isPro: boolean,
    action: TripCapacityAction
  ) {
    const tierName = isPro ? "Pro Wanderer" : "Free Explorer";
    const nextStep = isPro
      ? "Please archive older trips before continuing."
      : "Please upgrade to Pro Wanderer for up to 25 trips.";

    super(
      `${tierName} workspace limit reached (${count}/${maxTrips} trips). ` +
        `${nextStep} You cannot ${getActionDescription(action)} until space is available.`
    );
    this.name = "TripCapacityExceededError";
  }
}

/**
 * Reserve one trip slot inside the transaction that creates the trip.
 *
 * PostgreSQL's transaction-scoped advisory lock serializes all trip-creating
 * flows for the same user. The count and insert therefore cannot race each
 * other and exceed the tier quota under concurrent requests.
 */
export async function assertTripCapacity(
  tx: Prisma.TransactionClient,
  userId: string,
  isPro: boolean,
  action: TripCapacityAction
): Promise<void> {
  await tx.$executeRaw`
    SELECT pg_advisory_xact_lock(
      hashtextextended(${`${TRIP_CAPACITY_LOCK_PREFIX}:${userId}`}, 0)
    )
  `;

  const count = await tx.trip.count({
    where: { profileId: userId },
  });
  const maxTrips = getTripLimit(isPro);

  if (count >= maxTrips) {
    throw new TripCapacityExceededError(count, maxTrips, isPro, action);
  }
}
