"use client";

import { useState, useRef, useEffect } from "react";
import { format, parse } from "date-fns";
import { DayPicker } from "react-day-picker";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Note: react-day-picker v9 uses a different style approach. 
// We will use custom classNames to ensure it matches the studio aesthetic perfectly.

interface CustomDatePickerProps {
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  className?: string;
}

export function CustomDatePicker({ value, onChange, className = "" }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedDate = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange({ target: { value: format(date, "yyyy-MM-dd") } });
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#111116] border border-[#1e1e24] rounded-lg px-5 py-3.5 text-sm text-white flex items-center justify-between hover:border-[#a78bfa]/30 transition-all text-left group"
      >
        <span className={value ? "text-white" : "text-[#3f3f46]"}>
          {value ? format(selectedDate!, "PPP") : "Select date..."}
        </span>
        <FiCalendar className={`transition-colors duration-300 ${isOpen ? "text-[#a78bfa]" : "text-[#52525b] group-hover:text-[#a78bfa]"}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[500] top-full left-0 mt-2 p-5 bg-[#111116] border border-[#1e1e24] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
          >
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              classNames={{
                root: "p-0",
                months: "flex flex-col space-y-4",
                month: "space-y-4",
                month_caption: "flex justify-center items-center h-10 mb-4 relative",
                caption_label: "text-[10px] font-black uppercase tracking-[0.25em] text-white",
                nav: "flex items-center",
                button_previous: "absolute left-0 h-8 w-8 bg-[#16161a] border border-[#1e1e24] rounded-lg flex items-center justify-center text-[#52525b] hover:text-white hover:border-[#a78bfa]/50 transition-all",
                button_next: "absolute right-0 h-8 w-8 bg-[#16161a] border border-[#1e1e24] rounded-lg flex items-center justify-center text-[#52525b] hover:text-white hover:border-[#a78bfa]/50 transition-all",
                month_grid: "w-full border-collapse",
                weekdays: "grid grid-cols-7 mb-2",
                weekday: "text-[#3f3f46] w-9 font-black text-[9px] uppercase text-center",
                weeks: "flex flex-col gap-1",
                week: "grid grid-cols-7",
                day: "h-9 w-9 p-0 flex items-center justify-center relative",
                day_button: "h-9 w-9 font-bold text-[#a1a1aa] rounded-lg flex items-center justify-center hover:bg-[#1e1e24] hover:text-white transition-all",
                selected: "bg-[#a78bfa] !text-[#0c0c0f] hover:bg-[#a78bfa] hover:text-[#0c0c0f]",
                today: "text-[#a78bfa] font-black after:content-[''] after:absolute after:bottom-1.5 after:w-1 after:h-1 after:bg-[#a78bfa] after:rounded-full",
                outside: "opacity-20 text-[#a1a1aa]",
                disabled: "text-[#52525b] opacity-50",
                hidden: "invisible",
              }}
              components={{
                Chevron: (props) => {
                  if (props.orientation === "left") return <FiChevronLeft className="h-4 w-4" />;
                  return <FiChevronRight className="h-4 w-4" />;
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
