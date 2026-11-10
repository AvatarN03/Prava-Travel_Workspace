import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

function hasValidAuthorization(request: Request, expectedSecret: string): boolean {
  const authorization = request.headers.get("authorization");
  const match = authorization?.match(/^Bearer ([^\s]+)$/);

  if (!match) {
    return false;
  }

  const providedSecret = Buffer.from(match[1]);
  const configuredSecret = Buffer.from(expectedSecret);

  return (
    providedSecret.length === configuredSecret.length &&
    timingSafeEqual(providedSecret, configuredSecret)
  );
}

/**
 * POST /api/internal/keepalive
 *
 * Authenticated, no-data database heartbeat for the scheduled GitHub workflow.
 */
export async function POST(request: Request) {
  const keepaliveSecret = process.env.SUPABASE_KEEPALIVE_SECRET;

  if (!keepaliveSecret) {
    console.error("[Keepalive] SUPABASE_KEEPALIVE_SECRET is not configured.");
    return NextResponse.json({ ok: false }, { status: 503, headers: NO_STORE_HEADERS });
  }

  if (!hasValidAuthorization(request, keepaliveSecret)) {
    return NextResponse.json({ ok: false }, { status: 401, headers: NO_STORE_HEADERS });
  }

  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.error(`[Keepalive] Database heartbeat failed (${errorName}).`);
    return NextResponse.json({ ok: false }, { status: 503, headers: NO_STORE_HEADERS });
  }
}
