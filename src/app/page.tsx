"use client";

import { useStorage } from "@/hooks/useStorage";
import { Client, Project, Task, Invoice } from "@/lib/types";
import { Dashboard } from "@/components/features/Dashboard";
import { DUMMY_CLIENTS, DUMMY_PROJECTS, DUMMY_TASKS, DUMMY_INVOICES } from "@/lib/dummyData";
import { useState } from "react";

export default function Home() {
  const [clients, setClients, clientsLoading] = useStorage<Client[]>("octo-clients", DUMMY_CLIENTS);
  const [projects, setProjects, projectsLoading] = useStorage<Project[]>("octo-projects", DUMMY_PROJECTS);
  const [tasks, setTasks, tasksLoading] = useStorage<Task[]>("octo-tasks", DUMMY_TASKS);
  const [invoices, setInvoices, invoicesLoading] = useStorage<Invoice[]>("octo-invoices", DUMMY_INVOICES);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadDemo = () => {
    setClients(DUMMY_CLIENTS);
    setProjects(DUMMY_PROJECTS);
    setTasks(DUMMY_TASKS);
    setInvoices(DUMMY_INVOICES);
    flash("Demo data loaded successfully");
  };

  const cName = (id: string) => clients.find(c => c.id === id)?.name || "—";

  if (clientsLoading || projectsLoading || tasksLoading || invoicesLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-4xl font-black text-[#a78bfa] animate-pulse mb-4 tracking-tighter">⬡</div>
        <div className="text-[10px] font-bold text-[#52525b] uppercase tracking-[0.3em]">Syncing Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Dashboard {...{ clients, projects, tasks, invoices, cName, onLoadDemo: loadDemo }} />
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] bg-[#34d399] text-[#0c0c0f] px-6 py-3 rounded-2xl font-black text-sm shadow-2xl shadow-green-500/20 animate-in slide-in-from-bottom-4 duration-300">
          {toast}
        </div>
      )}
    </div>
  );
}
