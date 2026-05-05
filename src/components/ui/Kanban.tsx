"use client";

import { useState } from "react";
import { STATUS_COLORS } from "@/lib/constants";

interface KanbanProps<T> {
  items: T[];
  cols: readonly string[];
  render: (item: T) => React.ReactNode;
  onMove: (item: T, newStatus: string) => void;
  statusField?: keyof T;
}

export function Kanban<T extends { id: string }>({ 
  items, 
  cols, 
  render, 
  onMove,
  statusField = "status" as keyof T
}: KanbanProps<T>) {
  const [dragId, setDragId] = useState<string | null>(null);

  const handleDrop = (col: string) => {
    if (dragId) {
      const item = items.find(i => i.id === dragId);
      if (item) onMove(item, col);
      setDragId(null);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
      {cols.map(col => (
        <div 
          key={col} 
          className="flex-1 min-w-[250px] bg-[#111116] rounded-xl p-3 border border-[#1e1e24] transition-colors"
          onDragOver={e => e.preventDefault()}
          onDrop={() => handleDrop(col)}
        >
          <div className="flex items-center gap-2 mb-4 px-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: STATUS_COLORS[col] }} 
            />
            <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">{col}</span>
            <span className="text-[10px] text-[#52525b] ml-auto bg-[#18181b] px-2 py-0.5 rounded-md border border-[#27272a]">
              {items.filter(i => i[statusField] === col).length}
            </span>
          </div>
          
          <div className="flex flex-col gap-3">
            {items
              .filter(i => i[statusField] === col)
              .map(item => (
                <div 
                  key={item.id} 
                  draggable 
                  className={dragId === item.id ? "opacity-50" : "opacity-100"}
                  onDragStart={() => setDragId(item.id)} 
                  onDragEnd={() => setDragId(null)}
                >
                  <div className="bg-[#16161a] rounded-lg p-3 border border-[#27272a] cursor-grab hover:border-[#a78bfa]/50 transition-all shadow-sm">
                    {render(item)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
