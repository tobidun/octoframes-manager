"use client";

import { useState } from "react";
import { useStudioApi } from "@/hooks/useStudioApi";
import { Invoice, Client, Project } from "@/lib/types";
import { Invoices } from "@/components/features/Invoices";
import { InvoicePreview } from "@/components/features/InvoicePreview";
import { Modal } from "@/components/ui/Modal";
import { InvoiceForm } from "@/components/features/Forms";
import { DUMMY_CLIENTS, DUMMY_PROJECTS, DUMMY_INVOICES } from "@/lib/dummyData";

export default function InvoicesPage() {
  const { data: invoices, save: apiSave, remove: apiRemove, loading: invoicesLoading } = useStudioApi<Invoice>("invoices", DUMMY_INVOICES);
  const { data: clients, loading: clientsLoading } = useStudioApi<Client>("clients", DUMMY_CLIENTS);
  const { data: projects, loading: projectsLoading } = useStudioApi<Project>("projects", DUMMY_PROJECTS);
  
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState<Invoice | null>(null);
  const [invPreview, setInvPreview] = useState<Invoice | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (item: any) => {
    const success = await apiSave(item);
    if (success) {
      flash(item.id ? "Invoice updated" : "Invoice generated");
      setModal(false);
      setEditItem(null);
    }
  };

  const handleDel = async (id: string) => {
    const success = await apiRemove(id);
    if (success) {
      flash("Invoice removed");
    }
  };

  const cName = (id: string) => clients.find(c => c.id === id)?.name || "—";
  const pName = (id: string) => projects.find(p => p.id === id)?.name || "—";

  if (invoicesLoading || clientsLoading || projectsLoading) {
    return <div className="py-20 text-center animate-pulse font-black text-[#52525b] uppercase tracking-widest text-xs">Syncing Ledger...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-white tracking-tight">Financial Ledger</h1>
        <p className="text-sm text-[#71717a] font-medium">Manage billings, payments, and tax records.</p>
      </div>

      <Invoices 
        invoices={invoices} 
        clients={clients}
        projects={projects}
        cName={cName}
        pName={pName}
        onAdd={() => { setEditItem(null); setModal(true); }}
        onEdit={(i) => { setEditItem(i); setModal(true); }}
        onDel={handleDel}
        onStatus={(inv, s) => handleSave({ ...inv, status: s })}
        onPreview={setInvPreview}
      />

      {modal && (
        <Modal title={editItem ? "Edit Invoice" : "Generate New Invoice"} onClose={() => setModal(false)} wide>
          <InvoiceForm initial={editItem} clients={clients} projects={projects} onSave={handleSave} />
        </Modal>
      )}

      {invPreview && (
        <Modal title="Invoice Preview" onClose={() => setInvPreview(null)} wide>
          <InvoicePreview invoice={invPreview} cName={cName} pName={pName} />
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
