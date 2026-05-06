"use client";

import { useStudioApi } from "@/hooks/useStudioApi";
import { Client, Project, Task, Invoice } from "@/lib/types";
import { Dashboard } from "@/components/features/Dashboard";
import { useState } from "react";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

export default function Home() {
  const { data: clients, loading: clientsLoading } = useStudioApi<Client>("clients");
  const { data: projects, loading: projectsLoading } = useStudioApi<Project>("projects");
  const { data: tasks, save: apiSaveTask, remove: apiRemoveTask, loading: tasksLoading } = useStudioApi<Task>("tasks");
  const { data: invoices, loading: invoicesLoading } = useStudioApi<Invoice>("invoices");
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleMarkAllDone = async () => {
    try {
      const pending = tasks.filter(t => t.status !== "Done");
      if (pending.length === 0) return;
      
      flash("Updating agenda...");
      await Promise.all(pending.map(t => apiSaveTask({ ...t, status: "Done" })));
      flash("Daily agenda completed");
    } catch (e) {
      flash("Error updating tasks");
    }
  };

  const cName = (id: string) => clients.find(c => c.id === id)?.name || "—";
  const pName = (id: string) => projects.find(p => p.id === id)?.name || "—";

  if (clientsLoading || projectsLoading || tasksLoading || invoicesLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Dashboard {...{ clients, projects, tasks, invoices, cName, pName }} onMarkAllDone={handleMarkAllDone} />
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] bg-[#34d399] text-[#0c0c0f] px-6 py-3 rounded-2xl font-black text-sm shadow-2xl shadow-green-500/20 animate-in slide-in-from-bottom-4 duration-300">
          {toast}
        </div>
      )}
    </div>
  );
}
