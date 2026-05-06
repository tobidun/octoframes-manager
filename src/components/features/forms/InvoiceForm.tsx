"use client";

import { useState } from "react";
import { Invoice, Client, Project } from "@/lib/types";
import { CURRENCIES } from "@/lib/constants";
import { today } from "@/lib/utils";
import {
  Label,
  Input,
  Textarea,
  SaveButton,
} from "@/components/ui/FormElements";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { FaPlus, FaTrashCan } from "react-icons/fa6";

interface InvoiceFormProps {
  initial?: Invoice | null;
  clients: Client[];
  projects: Project[];
  onSave: (invoice: Partial<Invoice>) => void;
  loading?: boolean;
}

export function InvoiceForm({
  initial,
  clients,
  projects,
  onSave,
  loading,
}: InvoiceFormProps) {
  const [f, setF] = useState<any>(
    initial || {
      invoiceNumber: "",
      clientId: "",
      customClient: "",
      projectId: "",
      customProject: "",
      currency: "GBP",
      status: "Draft",
      issueDate: today(),
      dueDate: "",
      taxRate: "0",
      notes: "",
      items: [{ description: "", qty: "1", rate: "" }],
    },
  );

  const [manualClient, setManualClient] = useState(!!initial?.customClient);
  const [manualProject, setManualProject] = useState(!!initial?.customProject);

  const clientOptions = clients.map((c) => ({ label: c.name, value: c.id }));
  const projectOptions = projects.map((p) => ({ label: p.name, value: p.id }));
  const currencyOptions = CURRENCIES.map((c) => ({
    label: c.label,
    value: c.code,
  }));

  const updateItem = (idx: number, k: string, v: any) => {
    const items = [...f.items];
    items[idx] = { ...items[idx], [k]: v };
    setF({ ...f, items });
  };

  const hasClient = manualClient ? f.customClient?.trim() : f.clientId;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Invoice Number</Label>
          <Input
            placeholder="e.g. 1001"
            value={f.invoiceNumber}
            onChange={(e) => setF({ ...f, invoiceNumber: e.target.value })}
          />
        </div>
        <div>
          <Label>Currency</Label>
          <CustomSelect
            value={f.currency}
            options={currencyOptions}
            onChange={(e: any) => setF({ ...f, currency: e.target.value })}
          />
        </div>
      </div>

      <div className="bg-[#16161a]/50 p-6 rounded-3xl border border-[#1e1e24] space-y-6">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <Label>Billing Client *</Label>
            <button
              type="button"
              className="text-[10px] font-black text-[#a78bfa] uppercase tracking-widest hover:underline"
              onClick={() => {
                setManualClient(!manualClient);
                setF({ ...f, clientId: "", customClient: "" });
              }}
            >
              {manualClient ? "Pick from list" : "Type manually"}
            </button>
          </div>
          {manualClient ? (
            <Input
              placeholder="Enter client name..."
              value={f.customClient}
              onChange={(e) => setF({ ...f, customClient: e.target.value })}
            />
          ) : (
            <CustomSelect
              value={f.clientId}
              options={clientOptions}
              placeholder="— Select Client —"
              onChange={(e: any) => setF({ ...f, clientId: e.target.value })}
            />
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <Label>Linked Project</Label>
            <button
              type="button"
              className="text-[10px] font-black text-[#a78bfa] uppercase tracking-widest hover:underline"
              onClick={() => {
                setManualProject(!manualProject);
                setF({ ...f, projectId: "", customProject: "" });
              }}
            >
              {manualProject ? "Pick from list" : "Type manually"}
            </button>
          </div>
          {manualProject ? (
            <Input
              placeholder="Enter project title..."
              value={f.customProject}
              onChange={(e) => setF({ ...f, customProject: e.target.value })}
            />
          ) : (
            <CustomSelect
              value={f.projectId}
              options={projectOptions}
              placeholder="— None —"
              onChange={(e: any) => setF({ ...f, projectId: e.target.value })}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Issue Date</Label>
          <CustomDatePicker
            value={f.issueDate || ""}
            onChange={(e) => setF({ ...f, issueDate: e.target.value })}
          />
        </div>
        <div>
          <Label>Due Date</Label>
          <CustomDatePicker
            value={f.dueDate || ""}
            onChange={(e) => setF({ ...f, dueDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label>Tax Rate (%)</Label>
        <Input
          type="number"
          placeholder="0"
          value={f.taxRate}
          onChange={(e) => setF({ ...f, taxRate: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Line Items</Label>
          <button
            type="button"
            className="text-[10px] font-black text-[#a78bfa] uppercase tracking-widest flex items-center gap-1 hover:text-[#9061f9]"
            onClick={() =>
              setF({
                ...f,
                items: [...f.items, { description: "", qty: "1", rate: "" }],
              })
            }
          >
            <FaPlus /> Add Item
          </button>
        </div>
        <div className="space-y-3">
          {f.items.map((item: any, i: number) => (
            <div key={i} className="flex flex-col sm:flex-row gap-3 items-start animate-in fade-in slide-in-from-left-2 duration-300 bg-[#111116]/30 p-4 rounded-2xl sm:bg-transparent sm:p-0">
              <div className="w-full sm:flex-1">
                <Input 
                  placeholder="Item description" 
                  value={item.description} 
                  onChange={(e) => updateItem(i, "description", e.target.value)} 
                />
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="flex-1 sm:w-20">
                  <Input 
                    type="number" 
                    placeholder="Qty" 
                    value={item.qty} 
                    onChange={(e) => updateItem(i, "qty", e.target.value)} 
                  />
                </div>
                <div className="flex-1 sm:w-28">
                  <Input 
                    type="number" 
                    placeholder="Rate" 
                    value={item.rate} 
                    onChange={(e) => updateItem(i, "rate", e.target.value)} 
                  />
                </div>
                <button 
                  type="button" 
                  className="p-3.5 bg-[#ef4444]/10 text-[#ef4444] rounded-xl hover:bg-[#ef4444]/20 transition-all" 
                  onClick={() => setF({...f, items: f.items.filter((_:any, idx:number) => idx !== i)})}
                >
                  <FaTrashCan />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Terms & Notes</Label>
        <Textarea
          rows={3}
          placeholder="Payment instructions, thank you notes, etc..."
          value={f.notes || ""}
          onChange={(e) => setF({ ...f, notes: e.target.value })}
        />
      </div>

      <SaveButton onClick={() => onSave(f)} disabled={!hasClient} loading={loading}>
        Generate Invoice
      </SaveButton>
    </div>
  );
}
