"use client";

import { useState } from "react";
import { useStudioApi } from "@/hooks/useStudioApi";
import { Task, Project } from "@/lib/types";
import { Tasks } from "@/components/features/Tasks";
import { Modal } from "@/components/ui/Modal";
import { TasksSkeleton } from "@/components/ui/Skeleton";
import { TaskForm } from "@/components/features/Forms";

export default function TasksPage() {
  const { data: tasks, save: apiSave, remove: apiRemove, loading: tasksLoading } = useStudioApi<Task>("tasks");
  const { data: projects, loading: projectsLoading } = useStudioApi<Project>("projects");
  
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<"List" | "Kanban">("List");
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (item: any) => {
    setSaving(true);
    const success = await apiSave(item);
    setSaving(false);
    if (success) {
      flash(item.id ? "Task updated" : "Task created");
      setModal(false);
      setEditItem(null);
    }
  };

  const handleDel = async (id: string) => {
    const success = await apiRemove(id);
    if (success) {
      flash("Task removed");
    }
  };

  const pName = (id: string) => projects.find(p => p.id === id)?.name || "—";

  if (tasksLoading || projectsLoading) return <TasksSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-white tracking-tight">Studio Tasks</h1>
        <p className="text-sm text-[#71717a] font-medium">Keep track of every detail in your production workflow.</p>
      </div>

      <Tasks 
        tasks={tasks} 
        projects={projects}
        pName={pName}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAdd={() => { setEditItem(null); setModal(true); }}
        onEdit={(t) => { setEditItem(t); setModal(true); }}
        onDel={handleDel}
        onToggle={(t) => {
          flash("Updating task...");
          handleSave({ ...t, status: t.status === "Done" ? "To Do" : "Done" });
        }}
        onMove={(t, s) => {
          flash("Moving task...");
          handleSave({ ...t, status: s });
        }}
      />

      {modal && (
        <Modal title={editItem ? "Edit Task" : "Add New Task"} onClose={() => setModal(false)}>
          <TaskForm initial={editItem} projects={projects} onSave={handleSave} loading={saving} />
        </Modal>
      )}

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] bg-[#34d399] text-[#0c0c0f] px-6 py-3 rounded-2xl font-black text-sm shadow-2xl shadow-green-500/20 animate-in slide-in-from-bottom-4 duration-300">
          {toast}
        </div>
      )}
    </div>
  );
}
