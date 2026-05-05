"use client";

import { Client, Project, Task, Invoice } from "@/lib/types";
import { PROJECT_STATUS, STATUS_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { fmtMoney } from "@/lib/utils";
import { 
  FiUsers, 
  FiBriefcase, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiDollarSign, 
  FiTrendingUp, 
  FiPieChart,
  FiClock,
  FiArrowRight
} from "react-icons/fi";

interface DashboardProps {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  invoices: Invoice[];
  cName: (id: string) => string;
  onLoadDemo?: () => void;
}

export function Dashboard({ clients, projects, tasks, invoices, cName, onLoadDemo }: DashboardProps) {
  const active = projects.filter(p => !["Archived", "Delivered"].includes(p.status));
  const pending = tasks.filter(t => t.status !== "Done");
  const urgent = tasks.filter(t => t.priority === "Urgent" && t.status !== "Done");
  
  const invTotal = (inv: Invoice) => {
    const sub = inv.items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
    return sub + sub * (Number(inv.taxRate) || 0) / 100;
  };

  const totalInvoiced = invoices.reduce((s, i) => s + invTotal(i), 0);
  const paidRevenue = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + invTotal(i), 0);
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
            <FiClock className="text-[#a78bfa]" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Clients" 
          value={clients.length} 
          icon={<FiUsers />} 
          color="#a78bfa" 
          trend="+2 this month"
        />
        <StatCard 
          label="Active Projects" 
          value={active.length} 
          icon={<FiBriefcase />} 
          color="#60a5fa" 
          trend={`${active.length} in progress`}
        />
        <StatCard 
          label="Task Completion" 
          value={`${completionRate}%`} 
          icon={<FiCheckCircle />} 
          color="#34d399" 
          trend={`${tasks.filter(t => t.status === "Done").length} tasks finished`}
        />
        <StatCard 
          label="Urgent Alerts" 
          value={urgent.length} 
          icon={<FiAlertCircle />} 
          color="#ef4444" 
          trend="Action required"
          isAlert={urgent.length > 0}
        />
      </div>

      {/* Financials & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111116] border border-[#1e1e24] rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#a78bfa]/5 blur-[100px] -mr-32 -mt-32 rounded-full transition-all group-hover:bg-[#a78bfa]/10" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#34d399]/10 flex items-center justify-center text-[#34d399]">
                <FiTrendingUp size={20} />
              </div>
              <h3 className="text-lg font-black text-white">Revenue Overview</h3>
            </div>
            <div className="text-[10px] font-black text-[#71717a] uppercase tracking-widest px-3 py-1 bg-[#16161a] border border-[#1e1e24] rounded-full">
              Real-time
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 relative z-10">
            <div>
              <div className="text-[10px] text-[#71717a] font-bold uppercase tracking-widest mb-2">Total Invoiced</div>
              <div className="text-3xl font-black text-white tracking-tight">{fmtMoney(totalInvoiced)}</div>
              <div className="mt-2 h-1.5 w-full bg-[#1e1e24] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] w-full" />
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#71717a] font-bold uppercase tracking-widest mb-2">Paid Revenue</div>
              <div className="text-3xl font-black text-[#34d399] tracking-tight">{fmtMoney(paidRevenue)}</div>
              <div className="mt-2 h-1.5 w-full bg-[#1e1e24] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#34d399]" 
                  style={{ width: totalInvoiced > 0 ? `${(paidRevenue / totalInvoiced) * 100}%` : '0%' }} 
                />
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#71717a] font-bold uppercase tracking-widest mb-2">Overdue</div>
              <div className="text-3xl font-black text-[#ef4444] tracking-tight">{overdueCount}</div>
              <div className="text-[10px] text-[#ef4444] font-bold mt-2 flex items-center gap-1">
                <FiAlertCircle /> Needs attention
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111116] border border-[#1e1e24] rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#60a5fa]/10 flex items-center justify-center text-[#60a5fa]">
              <FiPieChart size={20} />
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
            <button className="text-[10px] font-bold text-[#a78bfa] hover:underline flex items-center gap-1">
              View all <FiArrowRight />
            </button>
          </div>
          <div className="space-y-4">
            {recentProjects.length === 0 ? (
              <div className="bg-[#111116] border border-dashed border-[#1e1e24] rounded-2xl p-12 text-center">
                <div className="w-12 h-12 bg-[#16161a] rounded-full flex items-center justify-center mx-auto mb-4 text-[#27272a]">
                  <FiBriefcase size={24} />
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

        {/* Urgent Tasks */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold text-[#71717a] uppercase tracking-[0.2em]">Priority Tasks</h3>
            <div className="text-[10px] font-black text-[#ef4444] animate-pulse">
              {urgent.length > 0 ? `${urgent.length} URGENT` : "ALL CLEAR"}
            </div>
          </div>
          <div className="space-y-4">
            {urgent.length === 0 ? (
              <div className="bg-[#111116] border border-dashed border-[#1e1e24] rounded-2xl p-12 text-center">
                <div className="w-12 h-12 bg-[#16161a] rounded-full flex items-center justify-center mx-auto mb-4 text-[#34d399]">
                  <FiCheckCircle size={24} />
                </div>
                <p className="text-sm text-[#52525b] font-medium">All priority tasks completed.</p>
              </div>
            ) : (
              urgent.slice(0, 5).map(t => (
                <div key={t.id} className="bg-[#111116] border-l-[4px] border-l-[#ef4444] border border-[#1e1e24] rounded-2xl p-5 hover:bg-[#16161a] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-bold text-white">{t.title}</div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-full text-[9px] font-black text-[#ef4444] uppercase">
                      Urgent
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-[#71717a]">
                    <div className="flex items-center gap-1">
                      <FiClock size={12} />
                      Due {t.dueDate || "Asap"}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiBriefcase size={12} />
                      Project ID: {t.projectId.slice(0, 8)}
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
    `}>
      <div 
        className="absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity rounded-full -mr-8 -mt-8" 
        style={{ backgroundColor: color }} 
      />
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg transition-transform group-hover:scale-110 duration-500" 
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {icon}
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="text-3xl font-black text-white mb-1 tracking-tight">{value}</div>
        <div className="text-[10px] text-[#71717a] uppercase font-black tracking-widest">{label}</div>
        
        {trend && (
          <div className="mt-4 pt-4 border-t border-[#1e1e24] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[9px] font-black uppercase tracking-wider text-[#52525b] group-hover:text-[#a1a1aa] transition-colors">{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}

