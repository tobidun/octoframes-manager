"use client";

import { useState } from "react";
import { Invoice, Client, Project } from "@/lib/types";
import { INVOICE_STATUS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { fmtMoney } from "@/lib/utils";

interface InvoicesProps {
  invoices: Invoice[];
  clients: Client[];
  projects: Project[];
  cName: (id: string) => string;
  pName: (id: string) => string;
  onAdd: () => void;
  onEdit: (i: Invoice) => void;
  onDel: (id: string) => void;
  onStatus: (i: Invoice, s: any) => void;
  onPreview: (i: Invoice) => void;
}

import { FiEye, FiEdit3, FiTrash2, FiDownload } from "react-icons/fi";

export function Invoices({
  invoices,
  cName,
  pName,
  onAdd,
  onEdit,
  onDel,
  onStatus,
  onPreview,
}: InvoicesProps) {
  const [filter, setFilter] = useState("All");
  const filtered = invoices.filter(
    (i) => filter === "All" || i.status === filter,
  );

  const invTotal = (inv: Invoice) => {
    const sub = inv.items.reduce(
      (s, i) => s + (Number(i.qty) || 0) * (Number(i.rate) || 0),
      0,
    );
    return sub + (sub * (Number(inv.taxRate) || 0)) / 100;
  };

  const getClient = (inv: Invoice) => inv.customClient || cName(inv.clientId);
  const getProj = (inv: Invoice) =>
    inv.customProject || (inv.projectId ? pName(inv.projectId) : "");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 p-1 bg-[#16161a] rounded-xl border border-[#27272a] w-full md:w-auto overflow-x-auto">
          {["All", ...INVOICE_STATUS].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                filter === s
                  ? "bg-[#a78bfa] text-white shadow-lg"
                  : "text-[#71717a] hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          className="bg-[#a78bfa] hover:bg-[#9061f9] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-500/10 transition-all w-full md:w-auto"
          onClick={onAdd}
        >
          + New Invoice
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#52525b] border border-dashed border-[#27272a] rounded-2xl">
          No invoices found
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inv) => {
            const total = invTotal(inv);
            const projectLabel = getProj(inv);
            return (
              <div
                key={inv.id}
                className="bg-[#16161a] border border-[#1e1e24] rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:border-[#a78bfa]/30 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-lg font-bold text-white tracking-tighter">
                      INV-
                      {inv.invoiceNumber || inv.id.slice(0, 6).toUpperCase()}
                    </span>
                    <Badge text={inv.status} />
                  </div>
                  <div className="text-sm font-semibold text-[#a1a1aa] truncate">
                    {getClient(inv)}{" "}
                    {projectLabel && (
                      <span className="text-[#52525b] font-normal mx-2">•</span>
                    )}{" "}
                    {projectLabel}
                  </div>
                  <div className="text-[11px] text-[#52525b] mt-2 flex gap-4 uppercase font-bold tracking-widest">
                    <span>Issued {inv.issueDate}</span>
                    {inv.dueDate && (
                      <span className="text-[#ef4444]">Due {inv.dueDate}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-1">
                  <div className="text-2xl font-bold text-white tracking-tight">
                    {fmtMoney(total, inv.currency)}
                  </div>
                  <select
                    className="bg-[#0c0c0f] border border-[#27272a] rounded-lg px-2 py-1 text-[10px] font-bold text-[#a1a1aa] outline-none cursor-pointer focus:border-[#a78bfa]/50"
                    value={inv.status}
                    onChange={(e) => onStatus(inv, e.target.value)}
                  >
                    {INVOICE_STATUS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-[#1e1e24]">
                  <button
                    className="flex-1 md:flex-none p-2.5 bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white rounded-lg transition-colors flex items-center justify-center"
                    onClick={() => onPreview(inv)}
                    title="Preview"
                  >
                    <FiEye size={14} />
                  </button>
                  <button
                    className="flex-1 md:flex-none p-2.5 bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white rounded-lg transition-colors flex items-center justify-center"
                    onClick={() => onEdit(inv)}
                    title="Edit"
                  >
                    <FiEdit3 size={14} />
                  </button>
                  <button
                    className="flex-1 md:flex-none p-2.5 bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white rounded-lg transition-colors flex items-center justify-center"
                    onClick={() => onPreview(inv)}
                    title="Download PDF"
                  >
                    <FiDownload size={14} />
                  </button>
                  <button
                    className="flex-1 md:flex-none p-2.5 bg-[#27272a] hover:bg-[#ef4444]/20 text-[#ef4444] rounded-lg transition-colors flex items-center justify-center"
                    onClick={() => {
                      if (confirm("Delete?")) onDel(inv.id);
                    }}
                    title="Delete"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
