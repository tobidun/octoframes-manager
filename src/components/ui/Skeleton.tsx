"use client";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-[#16161a] animate-pulse rounded-xl ${className}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-3xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, j) => (
          <div key={j} className="space-y-4">
            <Skeleton className="h-6 w-32" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClientsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-[#111116] border border-[#1e1e24] p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="flex gap-4 mb-8">
        <Skeleton className="h-10 w-32 rounded-full" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-[#111116] border border-[#1e1e24] p-6 rounded-3xl space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-3 w-48" />
            <div className="pt-4 border-t border-[#1e1e24] flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TasksSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-[#111116] border border-[#1e1e24] p-5 rounded-2xl flex items-center gap-4">
            <Skeleton className="w-5 h-5 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function InvoicesSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="bg-[#111116] border border-[#1e1e24] rounded-3xl overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-6 border-b border-[#1e1e24] flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-4 w-24 hidden md:block" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
