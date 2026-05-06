"use client";

import { Invoice } from "@/lib/types";
import { fmtMoney } from "@/lib/utils";
import { generateInvoicePDF } from "@/lib/invoiceUtils";
import {
  FaHashtag,
  FaClock,
  FaUser,
  FaBriefcase,
  FaCreditCard,
  FaDownload,
  FaCircleCheck,
} from "react-icons/fa6";

interface InvPreviewProps {
  invoice: Invoice;
  cName: (id: string) => string;
  pName: (id: string) => string;
}

export function InvoicePreview({ invoice, cName, pName }: InvPreviewProps) {
  const sub = (invoice.items || []).reduce(
    (s, i) => s + (Number(i.qty) || 0) * (Number(i.rate) || 0),
    0,
  );
  const tax = (sub * (Number(invoice.taxRate) || 0)) / 100;
  const total = sub + tax;
  const cur = invoice.currency || "GBP";

  const clientLabel = invoice.customClient || cName(invoice.clientId);
  const projectLabel =
    invoice.customProject ||
    (invoice.projectId ? pName(invoice.projectId) : "");

  const handleDownload = async () => {
    await generateInvoicePDF(invoice, cName, pName);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-[#16161a] border border-[#1e1e24] p-4 rounded-2xl">
        <div className="flex items-center gap-3 text-xs font-black text-[#52525b] uppercase tracking-widest">
          <FaCircleCheck className="text-[#34d399]" /> Preview Mode
        </div>
        <button
          onClick={handleDownload}
          className="bg-[#a78bfa] hover:bg-[#9061f9] text-[#0c0c0f] px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20 active:scale-95"
        >
          <FaDownload size={14} />
          Download PDF
        </button>
      </div>

      <div
        className="bg-[#09090b] text-white overflow-hidden rounded-3xl"
      >
        <div className="max-w-4xl mx-auto bg-[#111116] border border-[#1e1e24] overflow-hidden">
          {/* Top Glow Accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#a78bfa] to-transparent opacity-50" />

          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
              <div>
                <div className="text-2xl font-black text-[#a78bfa] tracking-[0.25em] mb-2">
                  OCTOFRAMES
                </div>
                <div className="text-[10px] text-[#52525b] font-black uppercase tracking-[0.3em]">
                  Technical Animation Studio
                </div>
              </div>
              <div className="md:text-right">
                <div className="text-[11px] font-black text-[#a78bfa] uppercase tracking-[0.3em] mb-1">
                  Official Invoice
                </div>
                <div className="text-4xl font-black tracking-tighter mb-2">
                  #
                  {invoice.invoiceNumber ||
                    invoice.id?.slice(0, 6).toUpperCase()}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#16161a] border border-[#1e1e24] rounded-full text-[10px] font-black text-[#71717a] uppercase tracking-widest">
                  <FaHashtag size={10} /> Reference ID: {invoice.id?.slice(0, 8)}
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-[#52525b] uppercase tracking-widest border-b border-[#1e1e24] pb-2">
                  <FaUser className="text-[#a78bfa]" /> Billed To
                </div>
                <div>
                  <div className="text-lg font-black text-white leading-tight mb-1">
                    {clientLabel}
                  </div>
                  <div className="text-xs text-[#71717a] font-medium">
                    {invoice.customClient
                      ? "Independent Partner"
                      : "Client Directory"}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-[#52525b] uppercase tracking-widest border-b border-[#1e1e24] pb-2">
                  <FaBriefcase className="text-[#a78bfa]" /> Project Scope
                </div>
                <div>
                  <div className="text-sm font-bold text-[#a1a1aa] leading-relaxed">
                    {projectLabel || "General Studio Services"}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-[#52525b] uppercase tracking-widest border-b border-[#1e1e24] pb-2">
                  <FaClock className="text-[#a78bfa]" /> Timeline
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[9px] font-black text-[#3f3f46] uppercase tracking-widest mb-1">
                      Issued
                    </div>
                    <div className="text-xs font-bold text-white">
                      {invoice.issueDate}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-[#ef4444]/60 uppercase tracking-widest mb-1">
                      Due Date
                    </div>
                    <div className="text-xs font-bold text-[#ef4444]">
                      {invoice.dueDate || "On Receipt"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-16">
              {/* Desktop Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 text-[10px] font-black text-[#52525b] uppercase tracking-widest mb-4 px-4">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
              
              <div className="space-y-2 md:space-y-1">
                {(invoice.items || []).map((item, i) => (
                  <div key={i} className="group">
                    {/* Desktop View */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center bg-[#16161a]/30 border border-[#1e1e24]/30 rounded-xl p-4">
                      <div className="col-span-6 text-sm font-bold text-white">{item.description}</div>
                      <div className="col-span-2 text-center text-xs font-bold text-[#71717a]">{item.qty}</div>
                      <div className="col-span-2 text-right text-xs font-bold text-[#71717a]">{fmtMoney(item.rate, cur)}</div>
                      <div className="col-span-2 text-right text-sm font-black text-white">
                        {fmtMoney((Number(item.qty) || 0) * (Number(item.rate) || 0), cur)}
                      </div>
                    </div>
                    
                    {/* Mobile View */}
                    <div className="md:hidden bg-[#16161a]/30 border border-[#1e1e24]/30 rounded-2xl p-5 space-y-3">
                      <div className="text-sm font-bold text-white">{item.description}</div>
                      <div className="flex justify-between items-center pt-2 border-t border-[#1e1e24]/50">
                        <div className="text-[10px] font-black text-[#52525b] uppercase tracking-widest">Details</div>
                        <div className="text-xs font-bold text-[#71717a]">{item.qty} × {fmtMoney(item.rate, cur)}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-[10px] font-black text-[#52525b] uppercase tracking-widest">Subtotal</div>
                        <div className="text-sm font-black text-[#a78bfa]">
                          {fmtMoney((Number(item.qty) || 0) * (Number(item.rate) || 0), cur)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-12 pt-8 border-t border-[#1e1e24]">
              <div className="flex-1 w-full md:w-auto">
                <div className="flex items-center gap-2 text-[10px] font-black text-[#52525b] uppercase tracking-widest mb-4">
                  <FaCreditCard className="text-[#a78bfa]" /> Payment
                  Information
                </div>
                <div className="p-5 bg-[#0c0c0f] border border-[#1e1e24] rounded-2xl">
                  <p className="text-[11px] text-[#71717a] leading-relaxed italic">
                    {invoice.notes ||
                      "Please include the invoice number as a reference for all bank transfers. Payments are due within the specified timeframe to ensure uninterrupted project delivery."}
                  </p>
                </div>
              </div>

              <div className="w-full md:w-80 space-y-3">
                <div className="flex justify-between text-xs font-bold text-[#71717a]">
                  <span>Subtotal</span>
                  <span>{fmtMoney(sub, cur)}</span>
                </div>
                {Number(invoice.taxRate) > 0 && (
                  <div className="flex justify-between text-xs font-bold text-[#71717a]">
                    <span>Vat / Tax ({invoice.taxRate}%)</span>
                    <span>{fmtMoney(tax, cur)}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-[#1e1e24] flex justify-between items-baseline">
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
                    Total Balance
                  </span>
                  <span className="text-3xl font-black text-[#a78bfa] tracking-tighter">
                    {fmtMoney(total, cur)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#0c0c0f] px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black text-[#3f3f46] uppercase tracking-widest">
            <div>Octoframes Studio © 2026</div>
            <div className="flex gap-6">
              <span>Terms of Service</span>
              <span>Support@octoframes.io</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
