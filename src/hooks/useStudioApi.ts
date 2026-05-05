"use client";

import { useState, useEffect } from "react";

type EntityType = "clients" | "projects" | "invoices" | "tasks";

export function useStudioApi<T>(entity: EntityType, initialData: T[]) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${entity}`);
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
      }
    } catch (e) {
      console.error(`Failed to fetch ${entity}`, e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [entity]);

  const save = async (item: any) => {
    try {
      const isUpdate = !!item.id;
      const url = isUpdate ? `/api/${entity}/${item.id}` : `/api/${entity}`;
      const method = isUpdate ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (res.ok) {
        await refresh();
        return true;
      }
    } catch (e) {
      console.error(`Failed to save ${entity}`, e);
    }
    return false;
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`/api/${entity}/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await refresh();
        return true;
      }
    } catch (e) {
      console.error(`Failed to delete ${entity}`, e);
    }
    return false;
  };

  return { data, setData, loading, save, remove, refresh };
}
