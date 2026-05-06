"use client";

import React from "react";
import { FaCheck, FaSpinner } from "react-icons/fa6";

export const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="flex items-center gap-2 text-[10px] font-black text-[#52525b] uppercase tracking-[0.2em] mb-2 ml-1">
    {children}
  </label>
);

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props} 
    className={`w-full bg-[#111116] border border-[#1e1e24] rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:border-[#a78bfa]/50 focus:ring-4 focus:ring-[#a78bfa]/5 transition-all placeholder:text-[#3f3f46] ${props.className || ""}`} 
  />
);

export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea 
    {...props} 
    className={`w-full bg-[#111116] border border-[#1e1e24] rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:border-[#a78bfa]/50 focus:ring-4 focus:ring-[#a78bfa]/5 transition-all resize-none placeholder:text-[#3f3f46] ${props.className || ""}`} 
  />
);

export const SaveButton = ({ onClick, disabled, children, loading }: any) => (
  <button 
    onClick={onClick} 
    disabled={disabled || loading}
    className="w-full bg-[#a78bfa] hover:bg-[#9061f9] disabled:opacity-50 disabled:cursor-not-allowed text-[#0c0c0f] font-black text-sm py-4 rounded-xl shadow-xl shadow-purple-500/10 transition-all mt-6 flex items-center justify-center gap-2 group active:scale-95"
  >
    {loading ? (
      <FaSpinner className="text-lg animate-spin" />
    ) : (
      <FaCheck className="text-lg group-hover:scale-125 transition-transform" />
    )}
    {loading ? "Processing..." : children}
  </button>
);
