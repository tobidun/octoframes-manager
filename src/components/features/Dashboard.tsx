"use client";

import { useState } from "react";
import Link from "next/link";
import { Client, Project, Task, Invoice } from "@/lib/types";
import { PROJECT_STATUS, STATUS_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { fmtMoney } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { 
  FaUsers, 
  FaBriefcase, 
  FaCircleCheck, 
  FaCircleExclamation, 
  FaDollarSign, 
  FaArrowTrendUp, 
  FaChartPie,
  FaClock,
  FaArrowRight,
  FaTrashCan
} from "react-icons/fa6";

interface DashboardProps {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  invoices: Invoice[];
  cName: (id: string) => string;
  pName: (id: string) => string;
  onLoadDemo?: () => void;
  onMarkAllDone?: () => void;
}

export function Dashboard({ clients, projects, tasks, invoices, cName, pName, onLoadDemo, onMarkAllDone }: DashboardProps) {
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [activeCur, setActiveCur] = useState<string | null>(null);
  const active = projects.filter(p => !["Archived", "Delivered"].includes(p.status));
  const pending = tasks.filter(t => t.status !== "Done");
  
  // Filtering for "Today's Agenda"
  const today = new Date().toISOString().split('T')[0];
  const todaysAgenda = tasks.filter(t => t.status !== "Done"); // Showing all pending as "Agenda"
  // If we want specifically today's due date:
  // const todaysAgenda = tasks.filter(t => t.status !== "Done" && (t.dueDate === today || !t.dueDate));
  
  // For the urgent stat card, we still want to show urgent count
  const urgentCount = tasks.filter(t => t.priority === "Urgent" && t.status !== "Done").length;
  
  const invTotal = (inv: Invoice) => {
    const sub = Number(inv.amount) || inv.items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
    return sub + sub * (Number(inv.taxRate) || 0) / 100;
  };

  const revByCur = invoices.reduce((acc: any, inv) => {
    const cur = inv.currency || "GBP";
    if (!acc[cur]) acc[cur] = { total: 0, paid: 0 };
    const t = invTotal(inv);
    acc[cur].total += t;
    if (inv.status === "Paid") acc[cur].paid += t;
    return acc;
  }, {});

  const currencies = Object.keys(revByCur).sort();
  const selectedCur = activeCur && revByCur[activeCur] ? activeCur : (currencies[0] ?? null);
  const overdueCount = invoices.filter(i => i.status === "Overdue").length;
  
  const recentProjects = [...projects]
    .sort((a, b) => (b.created || "").localeCompare(a.created || ""))
    .slice(0, 5);

  const completionRate = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.status === "Done").length / tasks.length) * 100) 
    : 0;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Studio Overview</h2>
          <p className="text-sm text-[#71717a] mt-1 font-medium">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          {onLoadDemo && clients.length === 0 && (
            <button 
              onClick={onLoadDemo}
              className="px-4 py-2 bg-[#a78bfa]/10 border border-[#a78bfa]/20 rounded-xl text-xs font-black text-[#a78bfa] hover:bg-[#a78bfa]/20 transition-all"
            >
              Load Demo Data
            </button>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#16161a] border border-[#1e1e24] rounded-xl text-xs font-bold text-[#a1a1aa]">
            <FaClock className="text-[#a78bfa]" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Clients" 
          value={clients.length} 
          icon={<FaUsers />} 
          color="#a78bfa" 
          trend="+2 this month"
        />
        <StatCard 
          label="Active Projects" 
          value={active.length} 
          icon={<FaBriefcase />} 
          color="#60a5fa" 
          trend={`${active.length} in progress`}
        />
        <StatCard 
          label="Task Completion" 
          value={`${completionRate}%`} 
          icon={<FaCircleCheck />} 
          color="#34d399" 
          trend={`${tasks.filter(t => t.status === "Done").length} tasks finished`}
        />
        <StatCard 
          label="Urgent Alerts" 
          value={urgentCount} 
          icon={<FaCircleExclamation />} 
          color="#ef4444" 
          trend="Action required"
          isAlert={urgentCount > 0}
        />
      </div>

      {/* Financials & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111116] border border-[#1e1e24] rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#a78bfa]/5 blur-[100px] -mr-32 -mt-32 rounded-full transition-all group-hover:bg-[#a78bfa]/10" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#34d399]/10 flex items-center justify-center text-[#34d399]">
                <FaArrowTrendUp size={20} />
              </div>
              <h3 className="text-lg font-black text-white">Revenue Overview</h3>
            </div>
            <div className="text-[10px] font-black text-[#71717a] uppercase tracking-widest px-3 py-1 bg-[#16161a] border border-[#1e1e24] rounded-full">
              Real-time
            </div>
          </div>

          <div className="relative z-10">
            {currencies.length > 0 ? (
              <>
                {/* Currency Tab Switcher */}
                <div className="flex gap-2 mb-8 flex-wrap">
                  {currencies.map(cur => (
                    <button
                      key={cur}
                      onClick={() => setActiveCur(cur)}
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        selectedCur === cur
                          ? "bg-[#a78bfa] text-[#0c0c0f] shadow-lg shadow-purple-500/20"
                          : "bg-[#16161a] border border-[#1e1e24] text-[#71717a] hover:text-white hover:border-[#3f3f46]"
                      }`}
                    >
                      {cur}
                    </button>
                  ))}
                </div>

                {/* Active Currency Stats */}
                {selectedCur && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div>
                      <div className="text-[10px] text-[#71717a] font-bold uppercase tracking-widest mb-2">Total Invoiced</div>
                      <div className="text-3xl font-black text-white tracking-tight">{fmtMoney(revByCur[selectedCur].total, selectedCur)}</div>
                      <div className="mt-3 h-1.5 w-full bg-[#1e1e24] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] w-full" />
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a] font-bold uppercase tracking-widest mb-2">Paid Revenue</div>
                      <div className="text-3xl font-black text-[#34d399] tracking-tight">{fmtMoney(revByCur[selectedCur].paid, selectedCur)}</div>
                      <div className="mt-3 h-1.5 w-full bg-[#1e1e24] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#34d399] transition-all duration-500"
                          style={{ width: revByCur[selectedCur].total > 0 ? `${(revByCur[selectedCur].paid / revByCur[selectedCur].total) * 100}%` : '0%' }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#71717a] font-bold uppercase tracking-widest mb-2">Outstanding</div>
                      <div className="text-3xl font-black text-[#f59e0b] tracking-tight">{fmtMoney(revByCur[selectedCur].total - revByCur[selectedCur].paid, selectedCur)}</div>
                      <div className="mt-3 text-[10px] text-[#52525b] font-bold uppercase tracking-widest">
                        {overdueCount > 0 ? <span className="text-[#ef4444] flex items-center gap-1"><FaCircleExclamation /> {overdueCount} overdue</span> : "All clear"}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10 text-[#71717a] font-bold italic">
                No financial data recorded yet.
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#111116] border border-[#1e1e24] rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#60a5fa]/10 flex items-center justify-center text-[#60a5fa]">
              <FaChartPie size={20} />
            </div>
            <h3 className="text-lg font-black text-white">Pipeline</h3>
          </div>
          
          <div className="space-y-4">
            {PROJECT_STATUS.filter(s => s !== "Archived").map(status => {
              const count = projects.filter(p => p.status === status).length;
              const total = projects.length || 1;
              const pct = (count / total) * 100;
              
              return (
                <div key={status} className="group cursor-default">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-[#a1a1aa] group-hover:text-white transition-colors">{status}</span>
                    <span className="text-xs font-black text-white">{count}</span>
                  </div>
                  <div className="h-2 w-full bg-[#16161a] border border-[#1e1e24] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ 
                        backgroundColor: STATUS_COLORS[status],
                        width: `${pct}%`
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects Feed */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold text-[#71717a] uppercase tracking-[0.2em]">Recent Activity</h3>
            <Link href="/projects" className="text-[10px] font-bold text-[#a78bfa] hover:underline flex items-center gap-1">
              View all <FaArrowRight />
            </Link>
          </div>
          <div className="space-y-4">
            {recentProjects.length === 0 ? (
              <div className="bg-[#111116] border border-dashed border-[#1e1e24] rounded-2xl p-12 text-center">
                <div className="w-12 h-12 bg-[#16161a] rounded-full flex items-center justify-center mx-auto mb-4 text-[#27272a]">
                  <FaBriefcase size={24} />
                </div>
                <p className="text-sm text-[#52525b] font-medium">No projects found. Start by adding one!</p>
              </div>
            ) : (
              recentProjects.map(p => (
                <div key={p.id} className="group bg-[#111116] border border-[#1e1e24] rounded-2xl p-5 hover:border-[#a78bfa]/50 transition-all hover:translate-x-1">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e1e24] to-[#16161a] border border-[#27272a] flex items-center justify-center text-xs font-black text-[#a78bfa]">
                        {cName(p.clientId).charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-[#a78bfa] transition-colors">{p.name}</div>
                        <div className="text-[10px] text-[#71717a] font-bold uppercase tracking-wide mt-0.5">
                          {cName(p.clientId)} • {p.serviceType || "Motion Design"}
                        </div>
                      </div>
                    </div>
                    <Badge text={p.status} />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[10px] font-bold">
                    <div className="text-[#52525b]">
                      Budget: <span className="text-[#a1a1aa]">{fmtMoney(p.budget, p.currency)}</span>
                    </div>
                    <div className="text-[#52525b]">
                      Created: <span className="text-[#a1a1aa]">{p.created}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Daily Agenda */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold text-[#71717a] uppercase tracking-[0.2em]">Daily Agenda</h3>
            <button 
              onClick={() => todaysAgenda.length > 0 && setShowDoneModal(true)}
              className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all border ${
                todaysAgenda.length > 0 
                  ? "bg-[#34d399]/10 text-[#34d399] border-[#34d399]/20 hover:bg-[#34d399]/20" 
                  : "bg-[#16161a] text-[#52525b] border-[#1e1e24] cursor-default"
              }`}
            >
              Mark all as completed
            </button>
          </div>

          {showDoneModal && (
            <Modal title="Complete Agenda" onClose={() => setShowDoneModal(false)}>
              <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 bg-[#34d399]/10 rounded-full flex items-center justify-center mx-auto text-[#34d399]">
                  <FaCircleCheck size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-white">Finish Daily Agenda?</h4>
                  <p className="text-sm text-[#71717a]">
                    You are about to mark <span className="text-white font-bold">{todaysAgenda.length} tasks</span> as completed. 
                    This will update your studio progress.
                  </p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    className="flex-1 px-6 py-4 bg-[#16161a] border border-[#1e1e24] rounded-2xl text-xs font-black uppercase tracking-widest text-[#71717a] hover:text-white transition-all"
                    onClick={() => setShowDoneModal(false)}
                  >
                    Not Yet
                  </button>
                  <button 
                    className="flex-1 px-6 py-4 bg-[#34d399] text-[#0c0c0f] rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-green-500/20 hover:bg-[#10b981] transition-all"
                    onClick={() => {
                      onMarkAllDone?.();
                      setShowDoneModal(false);
                    }}
                  >
                    Confirm All Done
                  </button>
                </div>
              </div>
            </Modal>
          )}
          
          <div className="space-y-4">
            {todaysAgenda.length === 0 ? (
              <div className="bg-[#111116] border border-dashed border-[#1e1e24] rounded-2xl p-12 text-center">
                <div className="w-12 h-12 bg-[#16161a] rounded-full flex items-center justify-center mx-auto mb-4 text-[#34d399]">
                  <FaCircleCheck size={24} />
                </div>
                <p className="text-sm text-[#52525b] font-medium">Your agenda is clear for today.</p>
              </div>
            ) : (
              todaysAgenda.slice(0, 5).map(t => (
                <div key={t.id} className={`bg-[#111116] border-l-[4px] border border-[#1e1e24] rounded-2xl p-5 hover:bg-[#16161a] transition-colors ${t.priority === 'Urgent' ? 'border-l-[#ef4444]' : 'border-l-[#a78bfa]'}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="text-sm font-bold text-white flex-1">{t.title}</div>
                    <div className={`shrink-0 px-2 py-0.5 border rounded-full text-[9px] font-black uppercase ${
                      t.priority === 'Urgent' 
                        ? 'bg-[#ef4444]/10 border-[#ef4444]/20 text-[#ef4444]' 
                        : 'bg-[#a78bfa]/10 border-[#a78bfa]/20 text-[#a78bfa]'
                    }`}>
                      {t.priority}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[10px] font-bold text-[#71717a]">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <FaClock size={12} className="text-[#a78bfa]" />
                      Due {t.dueDate || "Asap"}
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <FaBriefcase size={12} className="text-[#a78bfa] shrink-0" />
                      <span className="truncate">{pName(t.projectId)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, trend, isAlert }: { 
  label: string; 
  value: string | number; 
  icon: React.ReactNode; 
  color: string;
  trend?: string;
  isAlert?: boolean;
}) {
  return (
    <div className={`
      relative group bg-[#111116] rounded-3xl p-6 border border-[#1e1e24] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[${color}]/10
      ${isAlert ? 'border-[#ef4444]/30' : ''}
      flex flex-col items-center text-center sm:items-start sm:text-left
    `}>
      <div 
        className="absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity rounded-full -mr-8 -mt-8" 
        style={{ backgroundColor: color }} 
      />
      
      <div className="flex items-center justify-center mb-4 relative z-10 sm:justify-start w-full">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg transition-transform group-hover:scale-110 duration-500" 
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {icon}
        </div>
      </div>
      
      <div className="relative z-10 w-full">
        <div className="text-3xl font-black text-white mb-1 tracking-tight">{value}</div>
        <div className="text-[10px] text-[#71717a] uppercase font-black tracking-widest">{label}</div>
        
        {trend && (
          <div className="mt-4 pt-4 border-t border-[#1e1e24] flex items-center justify-center sm:justify-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[9px] font-black uppercase tracking-wider text-[#52525b] group-hover:text-[#a1a1aa] transition-colors">{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}

