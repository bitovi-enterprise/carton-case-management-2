import type { CaseStatus, CasePriority } from '@carton/shared/client';
import type { FilterItem } from '@/components/common/FiltersList';

export interface CaseFilters {
  status?: CaseStatus[];
  priority?: CasePriority[];
  customerId?: string[];
  lastUpdated?: 'all' | 'today' | 'last7days' | 'last30days';
}

export interface UseCaseFiltersReturn {
  /**
   * Currently applied filters (from URL params)
   */
  appliedFilters: CaseFilters;
  
  /**
   * Draft filters (user selections in dialog before Apply)
   */
  draftFilters: CaseFilters;
  
  /**
   * Filter items configured for FiltersDialog
   */
  filterItems: FilterItem[];
  
  /**
   * Count of active filters
   */
  activeFilterCount: number;
  
  /**
   * Apply draft filters (commit to URL)
   */
  applyFilters: () => void;
  
  /**
   * Clear all filters (both draft and applied)
   */
  clearFilters: () => void;
  
  /**
   * Reset draft filters to applied state (on cancel)
   */
  resetDraftFilters: () => void;
}
