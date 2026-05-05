"use client";

import { useState } from "react";
import { useStorage } from "@/hooks/useStorage";
import { Task, Project } from "@/lib/types";
import { Tasks } from "@/components/features/Tasks";
import { Modal } from "@/components/ui/Modal";
import { TaskForm } from "@/components/features/Forms";
import { uid, today } from "@/lib/utils";
import { DUMMY_PROJECTS, DUMMY_TASKS } from "@/lib/dummyData";

export default function TasksPage() {
  const [tasks, setTasks, loading] = useStorage<Task[]>("octo-tasks", DUMMY_TASKS);
  const [projects] = useStorage<Project[]>("octo-projects", DUMMY_PROJECTS);
  
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<"List" | "Kanban">("List");
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (item: any) => {
    if (item.id) {
      setTasks(tasks.map(i => i.id === item.id ? item : i));
      flash("Task updated");
    } else {
      setTasks([...tasks, { ...item, id: uid(), created: today() }]);
      flash("Task created");
    }
    setModal(false);
    setEditItem(null);
  };

  const handleDel = (id: string) => {
    setTasks(tasks.filter(i => i.id !== id));
    flash("Task removed");
  };

  const pName = (id: string) => projects.find(p => p.id === id)?.name || "—";

  if (loading) return <div className="py-20 text-center animate-pulse font-black text-[#52525b] uppercase tracking-widest text-xs">Syncing Tasks...</div>;

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
        onToggle={(t) => handleSave({ ...t, status: t.status === "Done" ? "To Do" : "Done" })}
        onMove={(t, s) => handleSave({ ...t, status: s })}
      />

      {modal && (
        <Modal title={editItem ? "Edit Task" : "Add New Task"} onClose={() => setModal(false)}>
          <TaskForm initial={editItem} projects={projects} onSave={handleSave} />
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
