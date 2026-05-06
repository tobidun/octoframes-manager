"use client";

import { useState } from "react";
import { useStudioApi } from "@/hooks/useStudioApi";
import { Project, Client, Task } from "@/lib/types";
import { Projects } from "@/components/features/Projects";
import { Modal } from "@/components/ui/Modal";
import { ProjectsSkeleton } from "@/components/ui/Skeleton";
import { ProjectForm } from "@/components/features/Forms";

export default function ProjectsPage() {
  const { data: projects, save: apiSave, remove: apiRemove, loading: projectsLoading } = useStudioApi<Project>("projects");
  const { data: clients, loading: clientsLoading } = useStudioApi<Client>("clients");
  const { data: tasks, loading: tasksLoading } = useStudioApi<Task>("tasks");
  
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState<Project | null>(null);
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
      flash(item.id ? "Project updated" : "Project created");
      setModal(false);
      setEditItem(null);
    }
  };

  const handleDel = async (id: string) => {
    const success = await apiRemove(id);
    if (success) {
      flash("Project removed");
    }
  };

  const cName = (id: string) => clients.find(c => c.id === id)?.name || "—";

  if (projectsLoading || clientsLoading || tasksLoading) {
    return <ProjectsSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-white tracking-tight">Project Pipeline</h1>
        <p className="text-sm text-[#71717a] font-medium">Track your active productions and deliveries.</p>
      </div>

      <Projects 
        projects={projects} 
        clients={clients}
        tasks={tasks}
        cName={cName}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAdd={() => { setEditItem(null); setModal(true); }}
        onEdit={(p) => { setEditItem(p); setModal(true); }}
        onDel={handleDel}
        onStatus={(p, s) => handleSave({ ...p, status: s })}
      />

      {modal && (
        <Modal title={editItem ? "Edit Project" : "Launch New Project"} onClose={() => setModal(false)}>
          <ProjectForm initial={editItem} clients={clients} onSave={handleSave} loading={saving} />
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
