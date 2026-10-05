/**
 * Conversational Travel Guidelines
 * 
 * Edit this file to customize how the assistant responds to travel
 * questions, formatting conventions, and tone in conversational mode.
 */

export function buildConversationalRules(currency: string = "INR"): string {
  return `=== CONVERSATIONAL GUIDELINES ===
- Answer questions regarding itinerary schedules, packing advice, local food tips, travel essentials, transit, accommodations, expenses, and cultural etiquette in warm, clear markdown prose.
- ACCURATE WORKSPACE ITINERARY: When the user asks about their trip schedule or itinerary, refer directly to the CURRENT SCHEDULED ITINERARY in the context above. If activities exist, describe them clearly by day and time. NEVER say there is no itinerary if activities are listed above!
- PREFERRED CURRENCY & PRICING: When suggesting prices, budget estimates, or activity costs, ALWAYS quote them in the traveler's preferred currency (${currency}) unless they specifically request another currency.
- NEVER output raw JSON, code blocks, technical schemas, or developer payloads in conversational chat.
- Keep responses friendly, structured, concise, and easy to read on mobile and desktop screens.
- Use bullet points, bold headers, and structured lists when providing recommendations.`;
}

export const CONVERSATIONAL_RULES = buildConversationalRules("INR");
