"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiCheck } from "react-icons/fi";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export function CustomSelect({ value, onChange, options, placeholder = "Select...", className = "" }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-[#111116] border border-[#1e1e24] rounded-lg px-5 py-3.5 text-sm text-white flex items-center justify-between hover:border-[#1e1e24]/80 transition-all text-left"
      >
        <span className={selected ? "text-white" : "text-[#3f3f46]"}>
          {selected ? selected.label : placeholder}
        </span>
        <FiChevronDown className={`transition-transform duration-300 ${open ? "rotate-180 text-[#a78bfa]" : "text-[#52525b]"}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[200] top-full left-0 right-0 bg-[#16161a] border border-[#1e1e24] rounded-xl shadow-2xl overflow-hidden py-1"
          >
            <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
              {options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => { onChange({ target: { value: o.value } }); setOpen(false); }}
                  className={`w-full text-left px-5 py-3 text-xs font-bold transition-all flex items-center justify-between
                    ${value === o.value ? "bg-[#a78bfa] text-[#0c0c0f]" : "text-[#a1a1aa] hover:bg-[#1e1e24] hover:text-white"}
                  `}
                >
                  {o.label}
                  {value === o.value && <FiCheck className="text-sm" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
