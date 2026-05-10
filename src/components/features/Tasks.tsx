"use client";

import { useState } from "react";
import { Task, Project } from "@/lib/types";
import { TASK_STATUS, STATUS_COLORS, PRIORITIES } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { FaList, FaTableCellsLarge, FaPlus, FaCheck, FaPenToSquare, FaTrashCan } from "react-icons/fa6";
import { Kanban } from "@/components/ui/Kanban";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

interface TasksProps {
  tasks: Task[];
  projects: Project[];
  pName: (id: string) => string;
  viewMode: "List" | "Kanban";
  setViewMode: (v: "List" | "Kanban") => void;
  onAdd: () => void;
  onEdit: (t: Task) => void;
  onDel: (id: string) => void;
  onToggle: (t: Task) => void;
  onMove: (t: Task, s: any) => void;
}

export function Tasks({ 
  tasks, 
  projects, 
  pName, 
  viewMode, 
  setViewMode, 
  onAdd, 
  onEdit, 
  onDel, 
  onToggle, 
  onMove 
}: TasksProps) {
  const [filter, setFilter] = useState("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const priMap: Record<string, number> = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
  const sorted = [...tasks].sort((a, b) => (priMap[a.priority] ?? 4) - (priMap[b.priority] ?? 4));
  const filtered = sorted.filter(t => filter === "All" || t.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#16161a] p-4 rounded-2xl border border-[#1e1e24]">
        <div className="flex gap-2 p-1 bg-[#111116] rounded-xl border border-[#27272a] w-full md:w-auto overflow-x-auto">
          {["All", ...TASK_STATUS].map(s => (
            <button 
              key={s} 
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                filter === s ? "bg-[#a78bfa] text-white shadow-lg" : "text-[#71717a] hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex bg-[#111116] p-1 rounded-xl border border-[#27272a] flex-1">
            <button 
              className={`flex-1 px-4 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-2 ${viewMode === "List" ? "bg-[#27272a] text-white" : "text-[#71717a]"}`}
              onClick={() => setViewMode("List")}
            >
              <FaList size={12} />
              List
            </button>
            <button 
              className={`flex-1 px-4 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-2 ${viewMode === "Kanban" ? "bg-[#27272a] text-white" : "text-[#71717a]"}`}
              onClick={() => setViewMode("Kanban")}
            >
              <FaTableCellsLarge size={12} />
              Kanban
            </button>
          </div>
          <button 
            className="bg-[#a78bfa] hover:bg-[#9061f9] text-[#0c0c0f] px-6 py-2 rounded-xl font-black text-sm shadow-lg shadow-purple-500/10 transition-all flex items-center gap-2 active:scale-95"
            onClick={onAdd}
          >
            <FaPlus />
            New Task
          </button>
        </div>
      </div>

      {viewMode === "List" ? (
        filtered.length === 0 ? (
          <div className="text-center py-20 text-[#52525b] border border-dashed border-[#27272a] rounded-2xl">
            No tasks found
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(t => (
              <div 
                key={t.id} 
                className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-[#16161a] border border-[#1e1e24] rounded-xl p-4 hover:border-[#a78bfa]/30 transition-all ${t.status === "Done" ? "opacity-60" : "opacity-100"}`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <button 
                    className={`w-6 h-6 shrink-0 rounded-lg border-2 flex items-center justify-center text-white text-xs transition-all ${
                      t.status === "Done" ? "bg-[#34d399] border-[#34d399]" : "border-[#3f3f46] hover:border-[#a78bfa]"
                    }`}
                    onClick={() => onToggle(t)}
                  >
                    {t.status === "Done" && <FaCheck size={12} />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-white text-sm md:text-base truncate ${t.status === "Done" ? "line-through text-[#71717a]" : ""}`}>
                      {t.title}
                    </div>
                    <div className="text-[10px] text-[#71717a] mt-1 flex flex-wrap items-center gap-x-2">
                      <span className="font-bold text-[#a78bfa] uppercase">{pName(t.projectId)}</span>
                      {t.dueDate && <span className="before:content-['•'] before:mr-2">Due {t.dueDate}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-4 pl-10 sm:pl-0 border-t border-[#1e1e24] pt-3 sm:border-t-0 sm:pt-0">
                  <div className="flex gap-2">
                    <Badge text={t.priority} />
                    <Badge text={t.status} className="hidden xs:inline-block" />
                  </div>

                  <div className="flex gap-1">
                    <button className="p-2 text-[#71717a] hover:text-white transition-colors" onClick={() => onEdit(t)}>
                      <FaPenToSquare size={14} />
                    </button>
                    <button className="p-2 text-[#71717a] hover:text-[#ef4444] transition-colors" onClick={() => setDeleteId(t.id)}>
                      <FaTrashCan size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <Kanban 
          items={tasks} 
          cols={TASK_STATUS} 
          render={t => (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge text={t.priority} />
                <div className="text-[10px] text-[#52525b] whitespace-nowrap">{t.dueDate || ""}</div>
              </div>
              <div className="font-bold text-white text-sm leading-tight">{t.title}</div>
              <div className="text-[10px] text-[#a78bfa] font-bold uppercase tracking-wider">{pName(t.projectId)}</div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-[#1e1e24]">
                <button className="text-[#71717a] hover:text-white text-sm" onClick={() => onEdit(t)}>
                  <FaPenToSquare />
                </button>
                <button className="text-[#71717a] hover:text-[#ef4444] text-sm" onClick={() => setDeleteId(t.id)}>
                  <FaTrashCan />
                </button>
              </div>
            </div>
          )} 
          onMove={onMove} 
        />
      )}

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) onDel(deleteId);
          setDeleteId(null);
        }}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task? This action cannot be undone."
        confirmText="Delete Task"
      />
    </div>
  );
}
