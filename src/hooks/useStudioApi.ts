import { useState, useEffect, useCallback } from "react";

type EntityType = "clients" | "projects" | "invoices" | "tasks";

// Simple global cache to prevent redundant fetches across components
const studioCache: Record<string, { data: any[]; timestamp: number }> = {};
const CACHE_TTL = 30000; // 30 seconds

export function useStudioApi<T>(entity: EntityType, options: { lazy?: boolean; skipCache?: boolean } = {}) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(!options.lazy);

  const refresh = useCallback(async (force = false) => {
    // Check cache first
    if (!force && !options.skipCache && studioCache[entity]) {
      const now = Date.now();
      if (now - studioCache[entity].timestamp < CACHE_TTL) {
        setData(studioCache[entity].data);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/${entity}`);
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
        // Update cache
        studioCache[entity] = { data: json, timestamp: Date.now() };
      }
    } catch (e) {
      console.error(`Failed to fetch ${entity}`, e);
    } finally {
      setLoading(false);
    }
  }, [entity, options.skipCache]);

  useEffect(() => {
    if (!options.lazy) {
      refresh();
    }
  }, [refresh, options.lazy]);

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
        await refresh(true); // Force refresh cache on save
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
        await refresh(true); // Force refresh cache on delete
        return true;
      }
    } catch (e) {
      console.error(`Failed to delete ${entity}`, e);
    }
    return false;
  };

  return { data, setData, loading, save, remove, refresh: () => refresh(true) };
}
