import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { CASE_STATUS_OPTIONS, CASE_PRIORITY_OPTIONS } from '@carton/shared/client';
import type { FilterItem } from '@/components/common/FiltersList';
import type { CaseFilters, UseCaseFiltersReturn } from './types';

const LAST_UPDATED_OPTIONS = [
  { value: 'all', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: 'last7days', label: 'Last 7 days' },
  { value: 'last30days', label: 'Last 30 days' },
];

export function useCaseFilters(): UseCaseFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get customers for filter options
  const { data: customers = [] } = trpc.customer.list.useQuery();
  
  // Parse filters from URL params
  const parseFiltersFromUrl = (): CaseFilters => {
    return {
      status: searchParams.getAll('status') as CaseFilters['status'],
      priority: searchParams.getAll('priority') as CaseFilters['priority'],
      customerId: searchParams.getAll('customerId'),
      lastUpdated: (searchParams.get('lastUpdated') as CaseFilters['lastUpdated']) || 'all',
    };
  };

  const appliedFilters = parseFiltersFromUrl();
  const [draftFilters, setDraftFilters] = useState<CaseFilters>(appliedFilters);

  // Update draft filter state
  const updateDraftFilter = <K extends keyof CaseFilters>(
    key: K,
    value: CaseFilters[K]
  ) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters (commit draft to URL)
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (draftFilters.status && draftFilters.status.length > 0) {
      draftFilters.status.forEach((s) => params.append('status', s));
    }
    if (draftFilters.priority && draftFilters.priority.length > 0) {
      draftFilters.priority.forEach((p) => params.append('priority', p));
    }
    if (draftFilters.customerId && draftFilters.customerId.length > 0) {
      draftFilters.customerId.forEach((c) => params.append('customerId', c));
    }
    if (draftFilters.lastUpdated && draftFilters.lastUpdated !== 'all') {
      params.set('lastUpdated', draftFilters.lastUpdated);
    }
    
    setSearchParams(params);
  };

  // Clear all filters
  const clearFilters = () => {
    const emptyFilters: CaseFilters = {
      status: [],
      priority: [],
      customerId: [],
      lastUpdated: 'all',
    };
    setDraftFilters(emptyFilters);
  };

  // Reset draft to applied state (on cancel)
  const resetDraftFilters = () => {
    setDraftFilters(appliedFilters);
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.status && appliedFilters.status.length > 0) count += appliedFilters.status.length;
    if (appliedFilters.priority && appliedFilters.priority.length > 0) count += appliedFilters.priority.length;
    if (appliedFilters.customerId && appliedFilters.customerId.length > 0) count += appliedFilters.customerId.length;
    if (appliedFilters.lastUpdated && appliedFilters.lastUpdated !== 'all') count += 1;
    return count;
  }, [appliedFilters]);

  // Build filter items for FiltersDialog
  const filterItems: FilterItem[] = useMemo(() => {
    const customerOptions = customers.map((c) => ({
      value: c.id,
      label: `${c.firstName} ${c.lastName}`,
    }));

    return [
      {
        id: 'customer',
        label: 'Customer',
        value: draftFilters.customerId || [],
        options: customerOptions,
        multiSelect: true,
        count: draftFilters.customerId?.length || 0,
        onChange: (value) => updateDraftFilter('customerId', value as string[]),
      },
      {
        id: 'status',
        label: 'Status',
        value: draftFilters.status || [],
        options: CASE_STATUS_OPTIONS,
        multiSelect: true,
        count: draftFilters.status?.length || 0,
        onChange: (value) => updateDraftFilter('status', value as CaseFilters['status']),
      },
      {
        id: 'priority',
        label: 'Priority',
        value: draftFilters.priority || [],
        options: CASE_PRIORITY_OPTIONS,
        multiSelect: true,
        count: draftFilters.priority?.length || 0,
        onChange: (value) => updateDraftFilter('priority', value as CaseFilters['priority']),
      },
      {
        id: 'lastUpdated',
        label: 'Last Updated',
        value: draftFilters.lastUpdated || 'all',
        options: LAST_UPDATED_OPTIONS,
        multiSelect: false,
        onChange: (value) => updateDraftFilter('lastUpdated', value as CaseFilters['lastUpdated']),
      },
    ];
  }, [draftFilters, customers]);

  return {
    appliedFilters,
    draftFilters,
    filterItems,
    activeFilterCount,
    applyFilters,
    clearFilters,
    resetDraftFilters,
  };
}
