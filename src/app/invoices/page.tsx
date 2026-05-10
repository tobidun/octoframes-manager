"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useStudioApi } from "@/hooks/useStudioApi";
import { Invoice, Client, Project } from "@/lib/types";
import { Invoices } from "@/components/features/Invoices";
import { InvoicePreview } from "@/components/features/InvoicePreview";
import { Modal } from "@/components/ui/Modal";
import { InvoicesSkeleton } from "@/components/ui/Skeleton";
import { InvoiceForm } from "@/components/features/Forms";
import { generateInvoicePDF } from "@/lib/invoiceUtils";

function InvoicesPageInner() {
  const { data: invoices, save: apiSave, remove: apiRemove, loading: invoicesLoading } = useStudioApi<Invoice>("invoices");
  const { data: clients, loading: clientsLoading } = useStudioApi<Client>("clients");
  const { data: projects, loading: projectsLoading } = useStudioApi<Project>("projects");
  
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState<Invoice | null>(null);
  const [invPreview, setInvPreview] = useState<Invoice | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const cid = searchParams.get("clientId");
    if (cid && clients.length > 0) {
      setEditItem({ clientId: cid } as any);
      setModal(true);
    }
  }, [searchParams, clients]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (item: any) => {
    setSaving(true);
    const success = await apiSave(item);
    setSaving(false);
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

  const handleDownload = async (inv: Invoice) => {
    try {
      flash("Generating PDF...");
      await generateInvoicePDF(inv, cName, pName);
      flash("Download started");
    } catch (err) {
      flash("Export failed. Please try again.");
      console.error(err);
    }
  };

  if (invoicesLoading || clientsLoading || projectsLoading) {
    return <InvoicesSkeleton />;
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
        onStatus={(inv, s) => {
          flash("Updating status...");
          handleSave({ ...inv, status: s });
        }}
        onPreview={setInvPreview}
        onDownload={handleDownload}
      />

      {modal && (
        <Modal title={editItem ? "Edit Invoice" : "Generate New Invoice"} onClose={() => setModal(false)} wide>
          <InvoiceForm initial={editItem} clients={clients} projects={projects} onSave={handleSave} loading={saving} />
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

export default function InvoicesPage() {
  return (
    <Suspense fallback={<InvoicesSkeleton />}>
      <InvoicesPageInner />
    </Suspense>
  );
}
