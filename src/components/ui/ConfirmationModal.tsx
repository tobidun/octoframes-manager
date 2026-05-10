"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
}: ConfirmationModalProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <FiAlertTriangle className="text-[#ef4444] text-2xl" />,
          button: "bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]",
          glow: "via-[#ef4444]/30",
        };
      case "warning":
        return {
          icon: <FiAlertTriangle className="text-[#f59e0b] text-2xl" />,
          button: "bg-[#f59e0b] hover:bg-[#d97706] text-white shadow-[0_0_20px_rgba(245,158,11,0.2)]",
          glow: "via-[#f59e0b]/30",
        };
      default:
        return {
          icon: <FiAlertTriangle className="text-[#a78bfa] text-2xl" />,
          button: "bg-[#a78bfa] hover:bg-[#8b5cf6] text-white shadow-[0_0_20px_rgba(167,139,250,0.2)]",
          glow: "via-[#a78bfa]/30",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#0c0c0f] rounded-[2rem] w-full max-w-md overflow-hidden border border-[#1e1e24] shadow-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle top glow */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent ${styles.glow} to-transparent`} />

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#16161a] border border-[#1e1e24] flex items-center justify-center mb-6">
                {styles.icon}
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight mb-3">
                {title}
              </h2>
              
              <p className="text-[#a1a1aa] text-lg leading-relaxed mb-8">
                {message}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-4 rounded-xl bg-[#16161a] border border-[#1e1e24] text-white font-bold hover:bg-[#1e1e24] transition-all"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all ${styles.button}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>

            <button
              className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-[#16161a] border border-[#1e1e24] text-[#71717a] hover:text-white transition-all flex items-center justify-center group"
              onClick={onClose}
            >
              <FiX className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
