import { useState, useEffect, useCallback } from 'react';
import type { CaseStatus, CasePriority } from '@carton/shared/client';

export interface CaseFilters {
  customerIds: string[];
  statuses: CaseStatus[];
  priorities: CasePriority[];
  lastUpdated: 'all' | 'today' | 'last7days' | 'last30days';
}

export interface CaseFiltersDraft extends CaseFilters {}

const STORAGE_KEY = 'case-filters';

const defaultFilters: CaseFilters = {
  customerIds: [],
  statuses: [],
  priorities: [],
  lastUpdated: 'all',
};

function loadFiltersFromStorage(): CaseFilters {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as CaseFilters;
    }
  } catch (error) {
    console.error('Failed to load filters from localStorage:', error);
  }
  return defaultFilters;
}

function saveFiltersToStorage(filters: CaseFilters): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error('Failed to save filters to localStorage:', error);
  }
}

export function clearFiltersFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear filters from localStorage:', error);
  }
}

export function useCaseFilters() {
  const [appliedFilters, setAppliedFilters] = useState<CaseFilters>(() => loadFiltersFromStorage());
  const [draftFilters, setDraftFilters] = useState<CaseFiltersDraft>(appliedFilters);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const activeFilterCount = useCallback(() => {
    let count = 0;
    if (appliedFilters.customerIds.length > 0) count++;
    if (appliedFilters.statuses.length > 0) count++;
    if (appliedFilters.priorities.length > 0) count++;
    if (appliedFilters.lastUpdated !== 'all') count++;
    return count;
  }, [appliedFilters]);

  const openDialog = useCallback(() => {
    setDraftFilters(appliedFilters);
    setIsDialogOpen(true);
  }, [appliedFilters]);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const applyFilters = useCallback(() => {
    setAppliedFilters(draftFilters);
    saveFiltersToStorage(draftFilters);
    setIsDialogOpen(false);
  }, [draftFilters]);

  const clearFilters = useCallback(() => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    saveFiltersToStorage(defaultFilters);
    setIsDialogOpen(false);
  }, []);

  const updateDraftFilter = useCallback(
    <K extends keyof CaseFiltersDraft>(key: K, value: CaseFiltersDraft[K]) => {
      setDraftFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  useEffect(() => {
    if (isDialogOpen) {
      setDraftFilters(appliedFilters);
    }
  }, [isDialogOpen, appliedFilters]);

  return {
    appliedFilters,
    draftFilters,
    isDialogOpen,
    activeFilterCount: activeFilterCount(),
    openDialog,
    closeDialog,
    applyFilters,
    clearFilters,
    updateDraftFilter,
  };
}
