"use client";

import { useEffect } from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}

import { motion, AnimatePresence } from "framer-motion";

export function Modal({ title, children, onClose, wide }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`
          relative bg-[#0c0c0f] rounded-[2.5rem] w-full overflow-hidden border border-[#1e1e24] shadow-2xl 
          flex flex-col
        `}
        style={{ maxWidth: wide ? "720px" : "480px", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#a78bfa]/50 to-transparent" />

        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-[#1e1e24] bg-[#111116]/50">
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-black text-white tracking-tight"
          >
            {title}
          </motion.h2>
          <button
            className="w-10 h-10 rounded-xl bg-[#16161a] border border-[#1e1e24] text-[#71717a] hover:text-white hover:bg-[#1e1e24] transition-all flex items-center justify-center group"
            onClick={onClose}
          >
            <FiX className="text-lg group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-8 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
