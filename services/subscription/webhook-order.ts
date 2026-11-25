/** Compare the subscription revision first, then the event time for equal revisions. */
export function isStaleSubscriptionEvent(
  modifiedAt: number,
  eventAt: number,
  watermark: string | null
): boolean {
  if (!watermark) return false;
  const [previousModified, previousEvent] = watermark.split(":").map(Number);
  if (!Number.isFinite(previousModified) || !Number.isFinite(previousEvent)) {
    throw new Error("Invalid subscription watermark");
  }
  return modifiedAt < previousModified ||
    (modifiedAt === previousModified && eventAt <= previousEvent);
}
