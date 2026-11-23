'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ApiResponse } from '../api/types';

export type ListFetcher<T> = (params: Record<string, any>) => Promise<ApiResponse<T[]>>;

export function useAdminList<T>(fetcher: ListFetcher<T>, options?: { pageSize?: number; initialSearch?: string; extraParams?: Record<string, any> }) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(options?.initialSearch ?? '');
  const [debouncedSearch, setDebouncedSearch] = useState(options?.initialSearch ?? '');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(options?.pageSize ?? 10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pageSize, JSON.stringify(options?.extraParams ?? {})]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetcher({
        page,
        limit: pageSize,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(options?.extraParams ?? {}),
      });
      setItems(Array.isArray(res.data) ? res.data : []);
      setTotal(res.meta?.total ?? (Array.isArray(res.data) ? res.data.length : 0));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load data.');
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [fetcher, page, pageSize, debouncedSearch, options?.extraParams]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));

  return useMemo(() => ({
    items,
    loading,
    error,
    setError,
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    totalPages,
    refresh: load,
    setItems,
  }), [items, loading, error, search, page, pageSize, total, totalPages, load]);
}
