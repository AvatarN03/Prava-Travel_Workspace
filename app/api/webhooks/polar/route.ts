import { NextRequest, NextResponse } from "next/server";

import { validateEvent } from "@polar-sh/sdk/webhooks";
import { Webhook } from "standardwebhooks";

import { db } from "@/lib/db";
import { isStaleSubscriptionEvent } from "@/services/subscription/webhook-order";

export const dynamic = "force-dynamic";

/**
 * Verify incoming webhook payload using Standard Webhooks specification.
 * Polar sandbox and production issue secrets with a `whsec_` prefix containing a base64-encoded key.
 * Uses native StandardWebhooks verification to avoid SDK double-encoding issues.
 */
function verifyWebhookPayload(
  rawBody: string,
  headers: Record<string, string>,
  secret: string
): any {
  // Strategy 1: Standard Webhooks native verify (handles `whsec_<base64>` correctly)
  try {
    const wh = new Webhook(secret);
    return wh.verify(rawBody, headers);
  } catch (err: unknown) {
    console.warn(
      "[Polar Webhook] StandardWebhooks verification failed with raw secret:",
      err instanceof Error ? err.message : err
    );
  }

  // Strategy 2: If secret starts with whsec_, try stripped base64 key
  if (secret.startsWith("whsec_")) {
    try {
      const strippedSecret = secret.replace(/^whsec_/, "");
      const whStripped = new Webhook(strippedSecret);
      return whStripped.verify(rawBody, headers);
    } catch (err: unknown) {
      console.warn(
        "[Polar Webhook] StandardWebhooks verification failed with stripped secret:",
        err instanceof Error ? err.message : err
      );
    }
  }

  // Strategy 3: Polar SDK validateEvent fallback
  try {
    return validateEvent(rawBody, headers, secret);
  } catch (sdkErr: unknown) {
    console.error(
      "[Polar Webhook] Polar SDK validateEvent also failed:",
      sdkErr instanceof Error ? sdkErr.message : sdkErr
    );
    throw sdkErr;
  }
}

/**
 * POST /api/webhooks/polar
 *
 * Secure webhook receiver for Polar subscription lifecycle events.
 * Cryptographically verifies signatures using Standard Webhooks spec and POLAR_WEBHOOK_SECRET.
 * Enforces idempotency via WebhookEvent records in PostgreSQL.
 */
export async function POST(req: NextRequest) {
  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[Polar Webhook] Missing POLAR_WEBHOOK_SECRET environment variable");
    return NextResponse.json(
      { error: "Webhook secret is unconfigured on the server" },
      { status: 500 }
    );
  }

  // 1. Extract raw request body and headers for verification
  const rawBody = await req.text();
  const headers = Object.fromEntries(req.headers.entries());

  let event: any;

  // 2. Verify signature before parsing or trusting any payload
  try {
    verifyWebhookPayload(rawBody, headers, webhookSecret);
    // Keep Polar's original field names regardless of the verification strategy.
    event = JSON.parse(rawBody);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Invalid signature";
    console.warn("[Polar Webhook] Signature verification rejected request:", errMsg);
    return new Response(`Invalid webhook signature: ${errMsg}`, { status: 403 });
  }

  const eventId = headers["webhook-id"];
  const eventTimestamp = Date.parse(event?.timestamp);
  if (!eventId || !event?.type || !Number.isFinite(eventTimestamp)) {
    return NextResponse.json({ error: "Invalid webhook event" }, { status: 400 });
  }

  const subscriptionEvents = new Set([
    "subscription.created", "subscription.updated", "subscription.active",
    "subscription.canceled", "subscription.revoked", "subscription.uncanceled",
    "subscription.past_due", "subscription.paused", "subscription.resumed",
    "subscription.cycled",
  ]);

  try {
    const outcome = await db.$transaction(async (tx) => {
      // Serializing by delivery ID makes duplicate handling atomic, even for concurrent retries.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`polar-event:${eventId}`}, 0))`;
      if (await tx.webhookEvent.findUnique({ where: { id: eventId } })) return "duplicate";

      if (subscriptionEvents.has(event.type)) {
        const sub = event.data;
        if (!sub?.id || !sub.customer_id || !sub.product_id || !sub.status) {
          throw new Error("Invalid subscription event");
        }
        const modifiedTimestamp = Date.parse(sub.modified_at || sub.created_at || event.timestamp);
        if (!Number.isFinite(modifiedTimestamp)) throw new Error("Invalid subscription timestamp");
        const watermarkId = `polar-subscription-watermark:${sub.id}`;
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${watermarkId}, 0))`;
        const watermark = await tx.webhookEvent.findUnique({ where: { id: watermarkId } });
        const stale = isStaleSubscriptionEvent(modifiedTimestamp, eventTimestamp, watermark?.eventType ?? null);

        if (!stale) {
          const existing = await tx.subscription.findUnique({ where: { polarSubscriptionId: sub.id } });
          let userId: string | null = existing?.userId || sub.customer?.external_id ||
            sub.customer?.external_customer_id || sub.metadata?.userId || sub.customer_metadata?.userId || null;
          if (!userId && sub.customer?.email) {
            userId = (await tx.profile.findUnique({ where: { email: sub.customer.email }, select: { id: true } }))?.id || null;
          }
          if (!userId || !(await tx.profile.findUnique({ where: { id: userId }, select: { id: true } }))) {
            throw new Error("Subscription user could not be resolved");
          }
          const periodStart = sub.current_period_start ? new Date(sub.current_period_start) : null;
          const periodEnd = sub.current_period_end ? new Date(sub.current_period_end) : null;
          if ((periodStart && !Number.isFinite(periodStart.getTime())) || (periodEnd && !Number.isFinite(periodEnd.getTime()))) {
            throw new Error("Invalid subscription period");
          }
          const status = String(sub.status).toLowerCase();
          const values = { polarCustomerId: sub.customer_id, polarProductId: sub.product_id, status,
            currentPeriodStart: periodStart, currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end) };
          const saved = await tx.subscription.upsert({
            where: { polarSubscriptionId: sub.id },
            create: { userId, polarSubscriptionId: sub.id, ...values },
            update: values,
          });
          if (periodStart) {
            await tx.subscriptionPeriod.upsert({
              where: { subscriptionId_periodStart: { subscriptionId: saved.id, periodStart } },
              create: { subscriptionId: saved.id, periodStart, periodEnd, status },
              update: { periodEnd, status },
            });
          }
          await tx.webhookEvent.upsert({
            where: { id: watermarkId },
            create: { id: watermarkId, eventType: `${modifiedTimestamp}:${eventTimestamp}` },
            update: { eventType: `${modifiedTimestamp}:${eventTimestamp}` },
          });
        }
      }
      await tx.webhookEvent.create({ data: { id: eventId, eventType: event.type } });
      return "processed";
    });
    return NextResponse.json({ received: true, duplicate: outcome === "duplicate" });
  } catch (error) {
    console.error("[Polar Webhook] Processing failed:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
