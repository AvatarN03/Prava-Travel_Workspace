/**
 * Modular System Prompts & Guardrails for Ichinose (Prava Travel Assistant)
 * 
 * Re-exports all prompt components and provides clean assembler functions.
 * Edit individual prompt files to tune persona, guardrails, proposals, or boundaries:
 * - persona.ts: Identity, tone, and workspace-first philosophy.
 * - guardrails.ts: Anti-jailbreak, prompt-induction defense, and travel-only scope.
 * - boundaries.ts: Database and workspace mutation limits.
 * - proposals.ts: Structured JSON proposal instructions for itineraries/stays.
 * - conversation.ts: Conversational travel rules and prose formatting.
 */

import { WORKSPACE_MUTATION_BOUNDARIES } from "./boundaries";
import { CONVERSATIONAL_RULES } from "./conversation";
import { TRAVEL_SCOPE_GUARDRAILS } from "./guardrails";
import { ICHINOSE_PERSONA } from "./persona";
import { PROPOSAL_INSTRUCTIONS } from "./proposals";

export * from "./boundaries";
export * from "./conversation";
export * from "./guardrails";
export * from "./persona";
export * from "./proposals";

export interface ActiveTripPromptContext {
  title: string;
  destination: string | null;
  formattedStartDate: string;
  formattedEndDate: string;
  status: string;
  isPastPlanning?: boolean;
}

export interface WorkspaceSummariesBlock {
  itinerarySummary: string;
  accommodationsSummary: string;
  expensesSummary: string;
  notesSummary: string;
  checklistSummary: string;
}

/**
 * Builds the active trip header block injected into both prompts.
 */
export function buildActiveTripContextBlock(ctx: ActiveTripPromptContext): string {
  const pastPlanningNotice = ctx.isPastPlanning
    ? " (⚠️ NOTICE: Scheduled dates have already passed while in PLANNING status. Remind user they can update status or reschedule in the workspace header)"
    : "";

  return `=== ACTIVE TRIP CONTEXT (SOURCE OF TRUTH) ===
Trip Title: "${ctx.title}"
Destination: ${ctx.destination || "Not specified"}
Dates: ${ctx.formattedStartDate} to ${ctx.formattedEndDate}
Trip Status: ${ctx.status}${pastPlanningNotice}`;
}

/**
 * Assembles the full conversational system prompt for Q&A, advice, and essentials.
 */
export function assembleConversationalPrompt(ctx: ActiveTripPromptContext): string {
  const activeTripBlock = buildActiveTripContextBlock(ctx);

  return [
    ICHINOSE_PERSONA,
    "",
    activeTripBlock,
    "",
    TRAVEL_SCOPE_GUARDRAILS,
    "",
    WORKSPACE_MUTATION_BOUNDARIES,
    "",
    CONVERSATIONAL_RULES,
  ].join("\n");
}

/**
 * Assembles the full proposal system prompt for itinerary and lodging planning.
 */
export function assembleProposalPrompt(
  ctx: ActiveTripPromptContext,
  summaries: WorkspaceSummariesBlock
): string {
  const activeTripBlock = buildActiveTripContextBlock(ctx);

  const entitiesBlock = [
    activeTripBlock,
    "",
    `=== SCHEDULED ITINERARY (WITH SYSTEM IDs) ===\n${summaries.itinerarySummary}`,
    "",
    `=== ACCOMMODATIONS & LODGING (WITH SYSTEM IDs) ===\n${summaries.accommodationsSummary}`,
    "",
    `=== EXPENSES & BUDGET ===\n${summaries.expensesSummary}`,
    "",
    `=== USER NOTES & MEMOS ===\n${summaries.notesSummary}`,
    "",
    `=== PREPARATION CHECKLIST ===\n${summaries.checklistSummary}`,
  ].join("\n");

  return [
    ICHINOSE_PERSONA,
    "",
    entitiesBlock,
    "",
    TRAVEL_SCOPE_GUARDRAILS,
    "",
    WORKSPACE_MUTATION_BOUNDARIES,
    "",
    PROPOSAL_INSTRUCTIONS,
  ].join("\n");
}
