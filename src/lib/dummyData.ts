import { Client, Project, Task, Invoice } from "./types";
import { uid, today } from "./utils";

const cid1 = uid();
const cid2 = uid();
const cid3 = uid();

const pid1 = uid();
const pid2 = uid();
const pid3 = uid();

export const DUMMY_CLIENTS: Client[] = [
  {
    id: cid1,
    name: "Sarah Jenkins",
    company: "Lumina Creative",
    email: "sarah@lumina.com",
    phone: "+44 7700 900123",
    location: "London, UK",
    notes: "High-end fashion brand. Prefers minimal aesthetic.",
    created: today(),
  },
  {
    id: cid2,
    name: "Mark Thompson",
    company: "TechFlow Systems",
    email: "mark@techflow.io",
    phone: "+1 555-0123",
    location: "San Francisco, CA",
    notes: "SaaS startup. Needs explainers for their new API.",
    created: today(),
  },
  {
    id: cid3,
    name: "Elena Rodriguez",
    company: "Solaris Media",
    email: "elena@solaris.media",
    phone: "+34 912 345 678",
    location: "Madrid, Spain",
    notes: "Entertainment agency. Recurring social media content.",
    created: today(),
  },
];

export const DUMMY_PROJECTS: Project[] = [
  {
    id: pid1,
    clientId: cid1,
    name: "Spring Collection 2026",
    status: "In Progress",
    serviceType: "Motion Graphics",
    budget: 4500,
    currency: "GBP",
    deadline: "2026-06-15",
    description: "Animated social ads for the upcoming fashion line.",
    created: today(),
  },
  {
    id: pid2,
    clientId: cid2,
    name: "API Explainer Video",
    status: "Delivered",
    serviceType: "Explainer Video",
    budget: 3200,
    currency: "USD",
    deadline: "2026-05-20",
    description: "2D character animation explaining the new integration flow.",
    created: today(),
  },
  {
    id: pid3,
    clientId: cid3,
    name: "Monthly Social Bundle",
    status: "Discovery",
    serviceType: "Social Media Content",
    budget: 1800,
    currency: "EUR",
    deadline: "2026-05-30",
    description: "15 short animated clips for Instagram and TikTok.",
    created: today(),
  },
];

export const DUMMY_TASKS: Task[] = [
  {
    id: uid(),
    projectId: pid1,
    title: "Storyboard approval",
    status: "Done",
    priority: "High",
    dueDate: "2026-05-10",
    created: today(),
  },
  {
    id: uid(),
    projectId: pid1,
    title: "Initial character sketches",
    status: "In Progress",
    priority: "Urgent",
    dueDate: "2026-05-12",
    created: today(),
  },
  {
    id: uid(),
    projectId: pid2,
    title: "Voiceover recording",
    status: "To Do",
    priority: "Medium",
    dueDate: "2026-05-18",
    created: today(),
  },
  {
    id: uid(),
    projectId: pid3,
    title: "Review branding guidelines",
    status: "To Do",
    priority: "Low",
    dueDate: "2026-05-15",
    created: today(),
  },
];

export const DUMMY_INVOICES: Invoice[] = [
  {
    id: uid(),
    invoiceNumber: "1024",
    clientId: cid1,
    projectId: pid1,
    status: "Paid",
    issueDate: "2026-05-01",
    dueDate: "2026-05-15",
    taxRate: 20,
    currency: "GBP",
    items: [{ description: "Deposit - Spring Collection", qty: 1, rate: 2250 }],
    notes: "Thank you for the deposit!",
    created: today(),
  },
  {
    id: uid(),
    invoiceNumber: "1025",
    clientId: cid2,
    projectId: pid2,
    status: "Overdue",
    issueDate: "2026-04-15",
    dueDate: "2026-04-30",
    taxRate: 0,
    currency: "USD",
    items: [{ description: "Project Kickoff", qty: 1, rate: 1600 }],
    notes: "Payment is now overdue. Please settle as soon as possible.",
    created: today(),
  },
];
