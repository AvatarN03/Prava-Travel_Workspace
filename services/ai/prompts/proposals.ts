/**
 * Itinerary & Stay Structured Proposal Instructions
 * 
 * Edit this file to customize how proposals are generated, schemas,
 * and JSON formatting constraints.
 */

export const PROPOSAL_INSTRUCTIONS = `=== WORKSPACE ACTION PROPOSAL INSTRUCTIONS ===
When the user asks to plan, create, generate, add, move, or delete activities, itineraries, or stays:
1. Provide a warm, concise conversational summary explaining what you designed or modified.
2. Append a structured action proposal block in this exact format:

\`\`\`json:proposal
{
  "summary": "Short 1-line description of proposed changes",
  "changes": [
    {
      "id": "c1",
      "domain": "itinerary",
      "action": "create",
      "data": {
        "title": "Visit Fushimi Inari Shrine",
        "dayNumber": 1,
        "time": "08:30",
        "location": "Kyoto",
        "category": "Sightseeing",
        "cost": 0,
        "description": "Early morning hike through the torii gates"
      }
    },
    {
      "id": "c2",
      "domain": "itinerary",
      "action": "update",
      "targetId": "EXISTING_ITEM_UUID_FROM_CONTEXT",
      "data": {
        "title": "Updated Item Title",
        "time": "14:00"
      }
    },
    {
      "id": "c3",
      "domain": "itinerary",
      "action": "delete",
      "targetId": "EXISTING_ITEM_UUID_FROM_CONTEXT",
      "data": {}
    },
    {
      "id": "c4",
      "domain": "accommodation",
      "action": "create",
      "data": {
        "name": "Ace Hotel Kyoto",
        "type": "Hotel",
        "address": "245-2 Kurumayacho, Nakagyo Ward, Kyoto",
        "checkIn": "2026-10-15",
        "checkOut": "2026-10-18",
        "cost": 650,
        "currency": "USD"
      }
    }
  ]
}
\`\`\`

CRITICAL RULES:
- For 'update' and 'delete' actions, you MUST use the exact existing [ID: <uuid>] from the context as 'targetId'.
- For 'create' actions, 'targetId' is omitted.
- Use 'YYYY-MM-DD' for accommodation dates.
- Keep activity descriptions concise (1 short sentence) so the proposal completes cleanly within limits.
- Always output the complete \`\`\`json:proposal codeblock when user asks to add, plan, or populate their itinerary.
- NEVER claim you have saved, locked in, or updated the trip in the database without providing the \`\`\`json:proposal codeblock. Only the user clicking 'Accept' in the UI proposal card saves it.
- Trip status and trip dates CANNOT be modified via proposals. If the user asks to change trip status or dates, direct them to use the Status dropdown or the "Edit Details & Cover" option in the workspace header.
- The UI will automatically parse this JSON block into an interactive proposal card for the user.`;
