"use client";

import { useState } from "react";
import { useStudioApi } from "@/hooks/useStudioApi";
import { Client, Project } from "@/lib/types";
import { Clients } from "@/components/features/Clients";
import { Modal } from "@/components/ui/Modal";
import { ClientForm } from "@/components/features/Forms";
import { DUMMY_CLIENTS, DUMMY_PROJECTS } from "@/lib/dummyData";

export default function ClientsPage() {
  const { data: clients, save: apiSave, remove: apiRemove, loading: clientsLoading } = useStudioApi<Client>("clients", DUMMY_CLIENTS);
  const { data: projects, loading: projectsLoading } = useStudioApi<Project>("projects", DUMMY_PROJECTS);
  
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState<Client | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (item: any) => {
    const success = await apiSave(item);
    if (success) {
      flash(item.id ? "Client updated" : "Client added");
      setModal(false);
      setEditItem(null);
    }
  };

  const handleDel = async (id: string) => {
    const success = await apiRemove(id);
    if (success) {
      flash("Client removed");
    }
  };

  if (clientsLoading || projectsLoading) {
    return <div className="py-20 text-center animate-pulse font-black text-[#52525b] uppercase tracking-widest text-xs">Synchronizing Directory...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-white tracking-tight">Client Directory</h1>
        <p className="text-sm text-[#71717a] font-medium">Manage your agency relationships and contacts.</p>
      </div>

      <Clients 
        clients={clients} 
        projects={projects}
        onAdd={() => { setEditItem(null); setModal(true); }}
        onEdit={(c) => { setEditItem(c); setModal(true); }}
        onDel={handleDel}
      />

      {modal && (
        <Modal title={editItem ? "Edit Client" : "Add New Client"} onClose={() => setModal(false)}>
          <ClientForm initial={editItem} onSave={handleSave} />
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
