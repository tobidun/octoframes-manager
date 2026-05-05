"use client";

import { useState } from "react";
import { Client } from "@/lib/types";
import { Label, Input, Textarea, SaveButton } from "@/components/ui/FormElements";

interface ClientFormProps {
  initial?: Client | null;
  onSave: (client: Partial<Client>) => void;
}

export function ClientForm({ initial, onSave }: ClientFormProps) {
  const [f, setF] = useState(initial || { 
    name: "", 
    company: "", 
    email: "", 
    phone: "", 
    location: "", 
    notes: "" 
  });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Full Name *</Label>
          <Input 
            placeholder="e.g. John Doe" 
            value={f.name} 
            onChange={(e) => setF({...f, name: e.target.value})} 
          />
        </div>
        <div>
          <Label>Company</Label>
          <Input 
            placeholder="e.g. Acme Corp" 
            value={f.company} 
            onChange={(e) => setF({...f, company: e.target.value})} 
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Email Address</Label>
          <Input 
            type="email" 
            placeholder="john@example.com" 
            value={f.email} 
            onChange={(e) => setF({...f, email: e.target.value})} 
          />
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input 
            placeholder="+44 ..." 
            value={f.phone} 
            onChange={(e) => setF({...f, phone: e.target.value})} 
          />
        </div>
      </div>
      <div>
        <Label>Office Location</Label>
        <Input 
          placeholder="City, Country" 
          value={f.location} 
          onChange={(e) => setF({...f, location: e.target.value})} 
        />
      </div>
      <div>
        <Label>Additional Notes</Label>
        <Textarea 
          rows={3} 
          placeholder="Any specific details about this client..." 
          value={f.notes} 
          onChange={(e) => setF({...f, notes: e.target.value})} 
        />
      </div>
      <SaveButton 
        onClick={() => onSave(f)} 
        disabled={!f.name}
      >
        {initial ? "Update Client Profile" : "Create New Client"}
      </SaveButton>
    </div>
  );
}
