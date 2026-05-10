"use client";

import { useState } from "react";
import { Project, Client, Task } from "@/lib/types";
import { PROJECT_STATUS, STATUS_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Kanban } from "@/components/ui/Kanban";
import { fmtMoney } from "@/lib/utils";

interface ProjectsProps {
  projects: Project[];
  clients: Client[];
  tasks: Task[];
  cName: (id: string) => string;
  viewMode: "List" | "Kanban";
  setViewMode: (v: "List" | "Kanban") => void;
  onAdd: () => void;
  onEdit: (p: Project) => void;
  onDel: (id: string) => void;
  onStatus: (p: Project, s: any) => void;
}

import { FaList, FaTableCellsLarge, FaPlus, FaMagnifyingGlass, FaCheck } from "react-icons/fa6";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

export function Projects({ 
  projects, 
  clients, 
  tasks, 
  cName, 
  viewMode, 
  setViewMode, 
  onAdd, 
  onEdit, 
  onDel, 
  onStatus 
}: ProjectsProps) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = projects
    .filter(p => filter === "All" || p.status === filter)
    .filter(p => p.name?.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4 w-full max-w-2xl">
          <div className="relative flex-1 group">
            <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52525b] group-focus-within:text-[#a78bfa] transition-colors" />
            <input 
              className="bg-[#111116] border border-[#1e1e24] rounded-xl pl-10 pr-4 py-2.5 text-sm w-full outline-none focus:border-[#a78bfa]/50 focus:ring-4 focus:ring-[#a78bfa]/5 transition-all placeholder:text-[#3f3f46]"
              placeholder="Search productions..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="flex bg-[#0c0c0f] p-1 rounded-xl border border-[#1e1e24] overflow-x-auto scrollbar-hide">
            {["All", ...PROJECT_STATUS].map(s => (
              <button 
                key={s} 
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  filter === s ? "bg-[#a78bfa]/20 text-[#a78bfa] border border-[#a78bfa]/30" : "text-[#52525b] hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto">
          <div className="flex bg-[#111116] p-1 rounded-xl border border-[#1e1e24] flex-1 xl:flex-initial">
            <button 
              className={`flex-1 xl:px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${viewMode === "List" ? "bg-[#a78bfa] text-[#0c0c0f] shadow-lg" : "text-[#52525b] hover:text-white"}`}
              onClick={() => setViewMode("List")}
            >
              <FaList size={14} />
              List
            </button>
            <button 
              className={`flex-1 xl:px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${viewMode === "Kanban" ? "bg-[#a78bfa] text-[#0c0c0f] shadow-lg" : "text-[#52525b] hover:text-white"}`}
              onClick={() => setViewMode("Kanban")}
            >
              <FaTableCellsLarge size={14} />
              Kanban
            </button>
          </div>
          <button 
            className="bg-[#a78bfa] hover:bg-[#9061f9] text-[#0c0c0f] px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-500/10 transition-all whitespace-nowrap flex items-center gap-2 active:scale-95"
            onClick={onAdd}
          >
            <FaPlus size={16} />
            New Project
          </button>
        </div>
      </div>

      {viewMode === "List" ? (
        filtered.length === 0 ? (
          <div className="text-center py-20 text-[#52525b] border border-dashed border-[#27272a] rounded-2xl">
            No projects found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(p => {
              const projectTasks = tasks.filter(t => t.projectId === p.id);
              const doneTasks = projectTasks.filter(t => t.status === "Done").length;
              const progress = projectTasks.length > 0 ? (doneTasks / projectTasks.length) * 100 : 0;

              return (
                <div key={p.id} className="bg-[#16161a] border border-[#1e1e24] rounded-2xl p-5 hover:border-[#a78bfa]/30 transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-[10px] text-[#52525b] font-mono tracking-widest uppercase">{p.id.slice(0, 4)}</div>
                    <select 
                      className="bg-[#0c0c0f] border border-[#27272a] rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-widest text-[#a1a1aa] outline-none cursor-pointer focus:border-[#a78bfa]/50 transition-all hover:bg-[#1e1e24] hover:text-white"
                      value={p.status}
                      onChange={(e) => onStatus(p, e.target.value)}
                    >
                      {PROJECT_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  
                  <h4 className="font-bold text-lg text-white mb-1 group-hover:text-[#a78bfa] transition-colors">{p.name}</h4>
                  <p className="text-sm text-[#71717a] mb-6">{cName(p.clientId)}</p>

                  <div className="space-y-3 mb-6">
                    {p.serviceType && <div className="text-xs text-[#a1a1aa] flex items-center gap-2">🎬 {p.serviceType}</div>}
                    {p.budget && <div className="text-xs text-[#a1a1aa] flex items-center gap-2 font-semibold">💰 {fmtMoney(p.budget, p.currency)}</div>}
                    {p.deadline && <div className="text-xs text-[#a1a1aa] flex items-center gap-2">📅 Due {p.deadline}</div>}
                  </div>

                  {projectTasks.length > 0 && (
                    <div className="mb-6 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-[#71717a] uppercase tracking-wider">
                        <span>Progress</span>
                        <span>{doneTasks}/{projectTasks.length}</span>
                      </div>
                      <div className="h-1.5 bg-[#1e1e24] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#a78bfa] transition-all duration-500 shadow-[0_0_8px_rgba(167,139,250,0.5)]" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-[#1e1e24]">
                    <button 
                      className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-2"
                      onClick={() => onEdit(p)}
                    >
                      Edit
                    </button>
                    <button 
                      className="flex-1 border border-[#3f3f46] hover:border-[#ef4444] text-[#ef4444] text-[11px] font-bold py-2 rounded-lg transition-all"
                      onClick={() => setDeleteId(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <Kanban 
          items={projects} 
          cols={PROJECT_STATUS} 
          render={p => (
            <div className="space-y-3">
              <div className="text-[10px] text-[#71717a] font-bold uppercase tracking-wider">{cName(p.clientId)}</div>
              <div className="font-bold text-white text-sm leading-tight">{p.name}</div>
              <div className="text-[11px] font-semibold text-[#a78bfa]">{fmtMoney(p.budget, p.currency)}</div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-[#1e1e24]">
                <button className="text-[#71717a] hover:text-white text-sm" onClick={() => onEdit(p)}>✎</button>
                <button className="text-[#71717a] hover:text-[#ef4444] text-sm" onClick={() => setDeleteId(p.id)}>✕</button>
              </div>
            </div>
          )} 
          onMove={onStatus} 
        />
      )}

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) onDel(deleteId);
          setDeleteId(null);
        }}
        title="Delete Project"
        message="Are you sure you want to delete this project? All associated data will be removed from the view."
        confirmText="Delete Project"
      />
    </div>
  );
}
