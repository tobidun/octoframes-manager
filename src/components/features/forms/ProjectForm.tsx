"use client";

import { useState } from "react";
import { Project, Client } from "@/lib/types";
import { PROJECT_STATUS, SERVICE_TYPES, CURRENCIES } from "@/lib/constants";
import { Label, Input, Textarea, SaveButton } from "@/components/ui/FormElements";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";

interface ProjectFormProps {
  initial?: Project | null;
  clients: Client[];
  onSave: (project: Partial<Project>) => void;
}

export function ProjectForm({ initial, clients, onSave }: ProjectFormProps) {
  const [f, setF] = useState<any>(initial || { 
    name: "", 
    clientId: "", 
    status: "Discovery", 
    serviceType: "", 
    budget: "", 
    currency: "GBP", 
    deadline: "", 
    description: "" 
  });
  
  const clientOptions = clients.map(c => ({ label: c.name, value: c.id }));
  const statusOptions = PROJECT_STATUS.map(s => ({ label: s, value: s }));
  const serviceOptions = SERVICE_TYPES.map(s => ({ label: s, value: s }));
  const currencyOptions = CURRENCIES.map(c => ({ label: c.label, value: c.code }));

  return (
    <div className="space-y-5">
      <div>
        <Label>Project Name *</Label>
        <Input 
          placeholder="e.g. Brand Refresh 2026" 
          value={f.name} 
          onChange={(e) => setF({...f, name: e.target.value})} 
        />
      </div>
      <div>
        <Label>Assigned Client</Label>
        <CustomSelect 
          value={f.clientId} 
          options={clientOptions} 
          placeholder="— Select Client —"
          onChange={(e: any) => setF({...f, clientId: e.target.value})} 
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Project Status</Label>
          <CustomSelect 
            value={f.status} 
            options={statusOptions} 
            onChange={(e: any) => setF({...f, status: e.target.value})} 
          />
        </div>
        <div>
          <Label>Service Category</Label>
          <CustomSelect 
            value={f.serviceType} 
            options={serviceOptions} 
            placeholder="— Select —"
            onChange={(e: any) => setF({...f, serviceType: e.target.value})} 
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Budget Allocation</Label>
          <Input 
            type="number" 
            placeholder="0.00" 
            value={f.budget} 
            onChange={(e) => setF({...f, budget: e.target.value})} 
          />
        </div>
        <div>
          <Label>Currency</Label>
          <CustomSelect 
            value={f.currency} 
            options={currencyOptions} 
            onChange={(e: any) => setF({...f, currency: e.target.value})} 
          />
        </div>
      </div>
      <div>
        <Label>Final Deadline</Label>
        <CustomDatePicker 
          value={f.deadline || ""} 
          onChange={(e: any) => setF({...f, deadline: e.target.value})} 
        />
      </div>
      <div>
        <Label>Scope Description</Label>
        <Textarea 
          rows={3} 
          placeholder="Describe the project goals..." 
          value={f.description || ""} 
          onChange={(e) => setF({...f, description: e.target.value})} 
        />
      </div>
      <SaveButton 
        onClick={() => onSave(f)} 
        disabled={!f.name || !f.clientId}
      >
        {initial ? "Update Project" : "Launch Project"}
      </SaveButton>
    </div>
  );
}
