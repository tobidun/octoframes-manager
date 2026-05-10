"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FaTableCellsLarge,
  FaUsers,
  FaBriefcase,
  FaCircleCheck,
  FaFileLines,
  FaBars,
  FaXmark,
} from "react-icons/fa6";
import { STUDIO_NAME, STUDIO_TAGLINE } from "@/lib/constants";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: <FaTableCellsLarge /> },
  { name: "Clients", href: "/clients", icon: <FaUsers /> },
  { name: "Projects", href: "/projects", icon: <FaBriefcase /> },
  { name: "Tasks", href: "/tasks", icon: <FaCircleCheck /> },
  { name: "Invoices", href: "/invoices", icon: <FaFileLines /> },
];

import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-[100] bg-[#0c0c0f]/80 backdrop-blur-xl border-b border-[#1e1e24]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl sm:text-3xl font-black text-[#a78bfa] tracking-tighter group-hover:scale-110 transition-transform">
              ⬡
            </span>
            <div>
              <div className="text-sm sm:text-base font-black text-white tracking-widest leading-none">
                {STUDIO_NAME}
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold text-[#71717a] uppercase tracking-[0.2em] mt-1">
                {STUDIO_TAGLINE}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex bg-[#111116] p-1 rounded-2xl border border-[#1e1e24]">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2
                    ${
                      isActive
                        ? "bg-[#a78bfa] text-[#0c0c0f] shadow-lg shadow-purple-500/20"
                        : "text-[#71717a] hover:text-white hover:bg-[#16161a]"
                    }
                  `}
                >
                  <span
                    className={isActive ? "text-[#0c0c0f]" : "text-[#a78bfa]"}
                  >
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center bg-[#111116] border border-[#1e1e24] rounded-xl text-[#a1a1aa] hover:text-white transition-all"
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {isOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
            </motion.div>
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[99] md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Card */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-[88px] left-6 right-6 bg-[#111116] border border-[#1e1e24] rounded-3xl p-4 shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col gap-1">
                {NAV_ITEMS.map((item, idx) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={`
                          flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-black transition-all
                          ${
                            isActive
                              ? "bg-[#a78bfa] text-[#0c0c0f] shadow-lg shadow-purple-500/20"
                              : "text-[#71717a] hover:text-white hover:bg-[#16161a]"
                          }
                        `}
                      >
                        <span
                          className={
                            isActive
                              ? "text-[#0c0c0f]"
                              : "text-[#a78bfa] text-lg"
                          }
                        >
                          {item.icon}
                        </span>
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
