import { db } from "@/lib/db";
import { hasActiveProSubscription } from "@/services/subscription/subscription-service";

/** Check and record a charge under the same per-user transaction lock. */
export async function reserveAiCredits(userId: string, conversationId: string, content: string, cost: number) {
  const isPro = await hasActiveProSubscription(userId);
  const quota = isPro ? 150 : 30;
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  return db.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`ai-credits:${userId}`}, 0))`;
    const conversation = await tx.aiConversation.findFirst({
      where: { id: conversationId, profileId: userId },
      select: { id: true, tripId: true },
    });
    if (!conversation) throw new Error("Conversation not found or unauthorized");
    const usage = await tx.aiCreditUsage.aggregate({
      where: { profileId: userId, createdAt: { gte: startOfMonth } },
      _sum: { creditsCost: true },
    });
    const used = Math.min(quota, usage._sum.creditsCost ?? 0);
    const userQuota = { used, quota, remaining: Math.max(0, quota - used), isPro };
    if (userQuota.remaining < cost) return { success: false as const, userQuota };
    const message = await tx.aiMessage.create({ data: { conversationId, role: "user", content, creditsCost: cost } });
    await tx.aiCreditUsage.create({
      data: {
        profileId: userId,
        tripId: conversation.tripId,
        messageId: message.id,
        creditsCost: cost,
      },
    });
    return { success: true as const, userQuota, message };
  });
}

export async function refundAiCredits(userId: string, messageId: string) {
  await db.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`ai-credits:${userId}`}, 0))`;
    await tx.aiCreditUsage.deleteMany({ where: { messageId, profileId: userId } });
    await tx.aiMessage.deleteMany({ where: { id: messageId, role: "user", conversation: { profileId: userId } } });
  });
}
