import { PROJECT_STATUS, TASK_STATUS, PRIORITIES, INVOICE_STATUS } from "./constants";

export type ProjectStatus = typeof PROJECT_STATUS[number];
export type TaskStatus = typeof TASK_STATUS[number];
export type Priority = typeof PRIORITIES[number];
export type InvoiceStatus = typeof INVOICE_STATUS[number];

export interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  location?: string;
  notes?: string;
  created: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: ProjectStatus;
  serviceType: string;
  budget: string | number;
  currency: string;
  deadline?: string;
  description?: string;
  created: string;
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  notes?: string;
  created: string;
}

export interface InvoiceItem {
  description: string;
  qty: string | number;
  rate: string | number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  customClient?: string;
  projectId?: string;
  customProject?: string;
  currency: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate?: string;
  taxRate: string | number;
  notes?: string;
  items: InvoiceItem[];
  created: string;
}
