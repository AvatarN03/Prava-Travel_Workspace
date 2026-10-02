// Common & Shell Components
export { AddToCalendarDialog } from "./common/add-to-calendar-dialog";
export { TripWorkspaceContainer } from "./common/trip-workspace-container";
export { WorkspaceHeader } from "./common/workspace-header";
export { WorkspaceNav } from "./common/workspace-nav";

// Context & State
export {
  useWorkspaceAi,
  WorkspaceAiContext,
  WorkspaceAiProvider,
  type ActiveTripContext,
} from "./context/workspace-ai-context";

// AI Assistant
export { AiProposalCard } from "./ai/components/ai-proposal-card";
export { WorkspaceAiPanel } from "./ai/components/workspace-ai-panel";
export {
  acceptAiProposal,
  clearTripConversation,
  createTripConversationThread,
  deleteTripConversationThread,
  getTripConversation,
  getTripConversationThreads,
  rejectAiProposal,
  sendTripMessage,
  updateTripConversationTitle,
  type ConversationThreadDTO,
  type MessageDTO,
  type UserAiQuotaDTO,
} from "./ai/actions";
export {
  aiProposalChangeSchema,
  aiProposalPayloadSchema,
  type AiProposalChange,
  type AiProposalDTO,
  type AiProposalPayload,
} from "./ai/schema";

// Overview Tab
export { OverviewDashboard } from "./overview/components/overview-dashboard";

// Itinerary Tab
export { AddItineraryDialog } from "./itinerary/components/add-itinerary-dialog";
export { EditItineraryDialog } from "./itinerary/components/edit-itinerary-dialog";
export { ItineraryCard } from "./itinerary/components/itinerary-card";
export { ItineraryView } from "./itinerary/components/itinerary-view";
export {
  createItineraryItem,
  deleteItineraryItem,
  updateItineraryItem,
} from "./itinerary/actions";
export {
  createItinerarySchema,
  deleteItinerarySchema,
  updateItinerarySchema,
  type CreateItineraryInput,
  type DeleteItineraryInput,
  type UpdateItineraryInput,
} from "./itinerary/schema";

// Accommodations Tab
export { AccommodationCard } from "./accommodations/components/accommodation-card";
export { AccommodationList } from "./accommodations/components/accommodation-list";
export { AddAccommodationDialog } from "./accommodations/components/add-accommodation-dialog";
export { EditAccommodationDialog } from "./accommodations/components/edit-accommodation-dialog";
export {
  createAccommodation,
  deleteAccommodation,
  updateAccommodation,
} from "./accommodations/actions";
export {
  createAccommodationSchema,
  deleteAccommodationSchema,
  updateAccommodationSchema,
  type CreateAccommodationInput,
  type DeleteAccommodationInput,
  type UpdateAccommodationInput,
} from "./accommodations/schema";

// Expenses Tab
export { AddExpenseDialog } from "./expenses/components/add-expense-dialog";
export { EditExpenseDialog } from "./expenses/components/edit-expense-dialog";
export { ExpenseTracker } from "./expenses/components/expense-tracker";
export {
  createExpense,
  createGeneralTravelExpense,
  deleteExpense,
  deleteGeneralTravelExpense,
  getGeneralTravelExpenses,
  updateExpense,
  updateTripBudget,
} from "./expenses/actions";
export {
  createExpenseSchema,
  createGeneralExpenseSchema,
  deleteExpenseSchema,
  updateExpenseSchema,
  type CreateExpenseInput,
  type CreateGeneralExpenseInput,
  type DeleteExpenseInput,
  type UpdateExpenseInput,
} from "./expenses/schema";

// Checklist Tab
export { AddTaskDialog } from "./checklist/components/add-task-dialog";
export { ChecklistView } from "./checklist/components/checklist-view";
export { EditTaskDialog } from "./checklist/components/edit-task-dialog";
export { TaskItem } from "./checklist/components/task-item";
export {
  createChecklistItem,
  deleteChecklistItem,
  seedEssentialChecklist,
  toggleChecklistItem,
  updateChecklistItem,
} from "./checklist/actions";
export {
  createChecklistItemSchema,
  deleteChecklistItemSchema,
  toggleChecklistItemSchema,
  updateChecklistItemSchema,
  type CreateChecklistItemInput,
  type DeleteChecklistItemInput,
  type ToggleChecklistItemInput,
  type UpdateChecklistItemInput,
} from "./checklist/schema";

// Notes Tab
export { AddNoteDialog } from "./notes/components/add-note-dialog";
export { EditNoteDialog } from "./notes/components/edit-note-dialog";
export { NoteCard } from "./notes/components/note-card";
export { NotesGrid } from "./notes/components/notes-grid";
export {
  createNote,
  deleteNote,
  togglePinNote,
  updateNote,
} from "./notes/actions";
export {
  createNoteSchema,
  deleteNoteSchema,
  togglePinNoteSchema,
  updateNoteSchema,
  type CreateNoteInput,
  type DeleteNoteInput,
  type TogglePinNoteInput,
  type UpdateNoteInput,
} from "./notes/schema";

// Links Tab
export { AddLinkDialog } from "./links/components/add-link-dialog";
export { EditLinkDialog } from "./links/components/edit-link-dialog";
export { ImportFromVaultDialog } from "./links/components/import-from-vault-dialog";
export { LinkCard } from "./links/components/link-card";
export { LinksGrid } from "./links/components/links-grid";
export {
  createLink,
  deleteLink,
  updateLink,
} from "./links/actions";
export {
  createLinkSchema,
  deleteLinkSchema,
  updateLinkSchema,
  type CreateLinkInput,
  type DeleteLinkInput,
  type UpdateLinkInput,
} from "./links/schema";
