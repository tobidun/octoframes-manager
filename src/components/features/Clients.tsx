"use client";

import { useState } from "react";
import { Client, Project } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import {
  FiSearch,
  FiPlus,
  FiMail,
  FiPhone,
  FiMapPin,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiBriefcase,
  FiUser,
} from "react-icons/fi";

interface ClientsProps {
  clients: Client[];
  projects: Project[];
  onAdd: () => void;
  onEdit: (client: Client) => void;
  onDel: (id: string) => void;
}

export function Clients({
  clients,
  projects,
  onAdd,
  onEdit,
  onDel,
}: ClientsProps) {
  const [query, setQuery] = useState("");

  const filtered = clients.filter((c) =>
    `${c.name} ${c.email} ${c.company}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Search and Add Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#52525b] group-focus-within:text-[#a78bfa] transition-colors" />
          <input
            className="bg-[#111116] border border-[#1e1e24] rounded-2xl pl-11 pr-4 py-3 text-sm w-full outline-none focus:border-[#a78bfa]/50 focus:ring-4 focus:ring-[#a78bfa]/5 transition-all"
            placeholder="Search clients by name, email or company..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          className="bg-[#a78bfa] hover:bg-[#9061f9] text-white px-6 py-3 rounded-2xl font-black text-sm transition-all w-full sm:w-auto shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 group hover:-translate-y-0.5 active:translate-y-0"
          onClick={onAdd}
        >
          <FiPlus className="text-lg group-hover:rotate-90 transition-transform duration-300" />
          <span>New Client</span>
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-[#111116] border border-dashed border-[#1e1e24] rounded-3xl">
          <div className="w-16 h-16 bg-[#16161a] rounded-full flex items-center justify-center mb-4 text-[#27272a]">
            <FiUser size={32} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            No clients found
          </h3>
          <p className="text-sm text-[#52525b] max-w-xs mx-auto">
            {query
              ? `We couldn't find any results for "${query}"`
              : "Your client list is empty. Start by adding your first client."}
          </p>
          {!query && (
            <button
              onClick={onAdd}
              className="mt-6 text-[#a78bfa] text-xs font-black uppercase tracking-widest hover:underline"
            >
              Add Client Now
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((client) => {
            const clientProjects = projects.filter(
              (p) => p.clientId === client.id,
            );
            const activeProjects = clientProjects.filter(
              (p) => !["Delivered", "Archived"].includes(p.status),
            ).length;

            return (
              <div
                key={client.id}
                className="group relative bg-[#111116] border border-[#1e1e24] rounded-3xl p-6 hover:border-[#a78bfa]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#a78bfa]/5"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e1e24] to-[#16161a] border border-[#27272a] text-[#a78bfa] flex items-center justify-center font-black text-xl shadow-inner group-hover:scale-105 transition-transform duration-500">
                      {client.name[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <h4 className="font-black text-white text-lg leading-tight group-hover:text-[#a78bfa] transition-colors">
                        {client.name}
                      </h4>
                      <p className="text-[10px] font-black text-[#71717a] uppercase tracking-widest mt-1">
                        {client.company || "Independent"}
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge
                      text={`${clientProjects.length} Projects`}
                      color="#60a5fa"
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <ContactItem icon={<FiMail />} text={client.email} />
                  <ContactItem icon={<FiPhone />} text={client.phone} />
                  <ContactItem icon={<FiMapPin />} text={client.location} />
                </div>

                {/* Project Stats */}
                <div className="flex items-center gap-2 p-3 bg-[#16161a] border border-[#1e1e24] rounded-2xl mb-6">
                  <div className="w-8 h-8 rounded-lg bg-[#a78bfa]/10 flex items-center justify-center text-[#a78bfa]">
                    <FiBriefcase size={14} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[9px] font-black text-[#52525b] uppercase tracking-widest">
                      Active Status
                    </div>
                    <div className="text-xs font-bold text-[#a1a1aa]">
                      {activeProjects} Active / {clientProjects.length} Total
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {client.notes && (
                  <div className="mb-8">
                    <p className="text-[11px] text-[#52525b] leading-relaxed line-clamp-2 italic">
                      "{client.notes}"
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-[#1e1e24]">
                  <button
                    className="flex-1 bg-[#16161a] hover:bg-[#1e1e24] border border-[#1e1e24] text-[#a1a1aa] hover:text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                    onClick={() => onEdit(client)}
                  >
                    <FiEdit2 size={12} />
                    Edit
                  </button>
                  <button
                    className="flex-1 bg-[#ef4444]/5 hover:bg-[#ef4444]/10 border border-[#ef4444]/10 hover:border-[#ef4444]/30 text-[#ef4444] text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                    onClick={() => {
                      if (
                        confirm(
                          "Remove client? This will not delete their projects.",
                        )
                      )
                        onDel(client.id);
                    }}
                  >
                    <FiTrash2 size={12} />
                    Delete
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

function ContactItem({ icon, text }: { icon: React.ReactNode; text?: string }) {
  if (!text) return null;
  return (
    <div className="flex items-center gap-3 text-xs text-[#a1a1aa] font-medium group/item hover:text-white transition-colors cursor-default">
      <span className="text-[#52525b] group-hover/item:text-[#a78bfa] transition-colors">
        {icon}
      </span>
      <span className="truncate">{text}</span>
    </div>
  );
}
