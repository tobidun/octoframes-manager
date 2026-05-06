"use client";

import { useState } from "react";
import { Task, Project } from "@/lib/types";
import { TASK_STATUS, PRIORITIES } from "@/lib/constants";
import { Label, Input, Textarea, SaveButton } from "@/components/ui/FormElements";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";

interface TaskFormProps {
  initial?: Task | null;
  projects: Project[];
  onSave: (task: Partial<Task>) => void;
  loading?: boolean;
}

export function TaskForm({ initial, projects, onSave, loading }: TaskFormProps) {
  const [f, setF] = useState<any>(initial || { 
    title: "", 
    projectId: "", 
    status: "To Do", 
    priority: "Medium", 
    dueDate: "", 
    notes: "" 
  });
  
  const projectOptions = projects.map(p => ({ label: p.name, value: p.id }));
  const statusOptions = TASK_STATUS.map(s => ({ label: s, value: s }));
  const priorityOptions = PRIORITIES.map(p => ({ label: p, value: p }));

  return (
    <div className="space-y-5">
      <div>
        <Label>Task Title *</Label>
        <Input 
          placeholder="What needs to be done?" 
          value={f.title} 
          onChange={(e) => setF({...f, title: e.target.value})} 
        />
      </div>
      <div>
        <Label>Associated Project</Label>
        <CustomSelect 
          value={f.projectId} 
          options={projectOptions} 
          placeholder="— Select Project —"
          onChange={(e: any) => setF({...f, projectId: e.target.value})} 
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Current Status</Label>
          <CustomSelect 
            value={f.status} 
            options={statusOptions} 
            onChange={(e: any) => setF({...f, status: e.target.value})} 
          />
        </div>
        <div>
          <Label>Priority Level</Label>
          <CustomSelect 
            value={f.priority} 
            options={priorityOptions} 
            onChange={(e: any) => setF({...f, priority: e.target.value})} 
          />
        </div>
      </div>
      <div>
        <Label>Due Date</Label>
        <CustomDatePicker 
          value={f.dueDate || ""} 
          onChange={(e: any) => setF({...f, dueDate: e.target.value})} 
        />
      </div>
      <div>
        <Label>Task Details</Label>
        <Textarea 
          rows={3} 
          placeholder="Add any specific instructions..." 
          value={f.notes || ""} 
          onChange={(e) => setF({...f, notes: e.target.value})} 
        />
      </div>
      <SaveButton 
        onClick={() => onSave(f)} 
        disabled={!f.title || !f.projectId}
        loading={loading}
      >
        {initial ? "Save Changes" : "Assign Task"}
      </SaveButton>
    </div>
  );
}
