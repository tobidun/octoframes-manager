export const STUDIO_NAME = "STUDIO MANAGER";
export const STUDIO_TAGLINE = "Client & Project Manager";
export const STUDIO_SUPPORT_EMAIL = "support@studiomanager.io";

export const TABS = ["Dashboard", "Clients", "Projects", "Tasks", "Invoices"];
export const PROJECT_STATUS = ["Discovery", "In Progress", "Review", "Delivered", "Archived"] as const;
export const TASK_STATUS = ["To Do", "In Progress", "Done"] as const;
export const PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;
export const SERVICE_TYPES = ["Design", "Development", "Consulting", "Marketing", "Video Production", "Photography", "Copywriting", "Strategy", "Social Media", "Other"];
export const CURRENCIES = [
  { code: "GBP", symbol: "£", label: "£ GBP" },
  { code: "NGN", symbol: "₦", label: "₦ NGN" },
  { code: "AUD", symbol: "A$", label: "A$ AUD" },
  { code: "USD", symbol: "$", label: "$ USD" },
  { code: "EUR", symbol: "€", label: "€ EUR" },
];
export const INVOICE_STATUS = ["Draft", "Sent", "Paid", "Overdue", "Cancelled"] as const;

export const STATUS_COLORS: Record<string, string> = {
  Discovery: "#a78bfa",
  "In Progress": "#60a5fa",
  Review: "#fbbf24",
  Delivered: "#34d399",
  Archived: "#6b7280",
  "To Do": "#f87171",
  Done: "#34d399",
  Low: "#6b7280",
  Medium: "#60a5fa",
  High: "#f59e0b",
  Urgent: "#ef4444",
  Draft: "#71717a",
  Sent: "#60a5fa",
  Paid: "#34d399",
  Overdue: "#ef4444",
  Cancelled: "#52525b",
};
