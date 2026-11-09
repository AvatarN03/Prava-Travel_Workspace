export interface ExpenseEntry {
  title: string;
  category: string;
  date: string;
  paidBy: string;
  inr: string;
  usd: string;
}

// Static expense entries displayed by ExpensesSection.
export const EXPENSE_ENTRIES: ExpenseEntry[] = [
  { title: "Samode Haveli Heritage Suite", category: "Accommodation", date: "Nov 14", paidBy: "Credit Card", inr: "₹18,500", usd: "≈ $222 USD" },
  { title: "Vande Bharat Express (Delhi — Jaipur AC Exec)", category: "Transport", date: "Nov 15", paidBy: "Personal", inr: "₹3,600", usd: "≈ $43 USD" },
  { title: "Amer Palace & Jantar Mantar Heritage Pass", category: "Activities", date: "Nov 16", paidBy: "UPI", inr: "₹1,800", usd: "≈ $21 USD" },
  { title: "Royal Thali Tasting at 1135 AD Amer", category: "Food & Dining", date: "Nov 16", paidBy: "UPI", inr: "₹3,400", usd: "≈ $41 USD" },
];
