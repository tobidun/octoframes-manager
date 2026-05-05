"use client";

/**
 * barrel file for forms and form-related UI components
 * this maintains backward compatibility while the codebase is being modularized
 */

export * from "./forms/ClientForm";
export * from "./forms/ProjectForm";
export * from "./forms/TaskForm";
export * from "./forms/InvoiceForm";

// also export shared UI elements used by these forms
export * from "@/components/ui/FormElements";
export * from "@/components/ui/CustomSelect";
export * from "@/components/ui/CustomDatePicker";
