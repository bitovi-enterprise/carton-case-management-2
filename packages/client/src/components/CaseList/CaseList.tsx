import { Link, useParams, useNavigate } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { Skeleton } from '@/components/obra/Skeleton';
import { Button } from '@/components/obra/Button';
import { formatCaseNumber, CASE_STATUS_OPTIONS, CASE_PRIORITY_OPTIONS, type CaseStatus, type CasePriority } from '@carton/shared/client';
import { FiltersTrigger } from '@/components/common/FiltersTrigger';
import { FiltersDialog } from '@/components/common/FiltersDialog';
import { useCaseFilters } from '@/hooks/useCaseFilters';
import type { CaseListProps, CaseListItem } from './types';
import type { FilterItem } from '@/components/common/FiltersList';

export function CaseList({ onCaseClick }: CaseListProps) {
  const { id: activeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    appliedFilters,
    draftFilters,
    isDialogOpen,
    activeFilterCount,
    openDialog,
    closeDialog,
    applyFilters,
    clearFilters,
    updateDraftFilter,
  } = useCaseFilters();

  const { data: customers } = trpc.customer.list.useQuery();
  
  const queryInput = {
    ...(appliedFilters.customerIds.length > 0 ? { customerIds: appliedFilters.customerIds } : {}),
    ...(appliedFilters.statuses.length > 0 ? { statuses: appliedFilters.statuses } : {}),
    ...(appliedFilters.priorities.length > 0 ? { priorities: appliedFilters.priorities } : {}),
    ...(appliedFilters.lastUpdated !== 'all' ? { lastUpdated: appliedFilters.lastUpdated } : {}),
  };
  
  const { data: cases, isLoading, error, refetch } = trpc.case.list.useQuery(
    Object.keys(queryInput).length > 0 ? queryInput : undefined
  );

  const customerOptions = (customers || []).map((customer) => ({
    value: customer.id,
    label: `${customer.firstName} ${customer.lastName}`,
  }));

  const filterItems: FilterItem[] = [
    {
      id: 'customer',
      label: 'Customer',
      value: draftFilters.customerIds,
      count: draftFilters.customerIds.length,
      options: [{ value: '', label: 'None selected' }, ...customerOptions],
      multiSelect: true,
      onChange: (value: string | string[]) => updateDraftFilter('customerIds', value as string[]),
    },
    {
      id: 'status',
      label: 'Status',
      value: draftFilters.statuses,
      count: draftFilters.statuses.length,
      options: [
        { value: '', label: 'None selected' },
        ...CASE_STATUS_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
      ],
      multiSelect: true,
      onChange: (value: string | string[]) => {
        const typedValue = value as unknown as CaseStatus[];
        updateDraftFilter('statuses', typedValue);
      },
    },
    {
      id: 'priority',
      label: 'Priority',
      value: draftFilters.priorities,
      count: draftFilters.priorities.length,
      options: [
        { value: '', label: 'None selected' },
        ...CASE_PRIORITY_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
      ],
      multiSelect: true,
      onChange: (value: string | string[]) => {
        const typedValue = value as unknown as CasePriority[];
        updateDraftFilter('priorities', typedValue);
      },
    },
    {
      id: 'lastUpdated',
      label: 'Last updated',
      value: draftFilters.lastUpdated,
      count: draftFilters.lastUpdated !== 'all' ? 1 : 0,
      options: [
        { value: 'all', label: 'All time' },
        { value: 'today', label: 'Today' },
        { value: 'last7days', label: 'Last 7 days' },
        { value: 'last30days', label: 'Last 30 days' },
      ],
      multiSelect: false,
      onChange: (value: string | string[]) => updateDraftFilter('lastUpdated', value as 'all' | 'today' | 'last7days' | 'last30days'),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col w-full lg:w-[200px]">
        <Button
          onClick={() => navigate('/cases/new')}
          variant="secondary"
          className="w-full mb-2"
        >
          Create Case
        </Button>
        <FiltersTrigger
          activeCount={activeFilterCount}
          onClick={openDialog}
          className="mb-2"
        />
        <div className="flex flex-col gap-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between px-4 py-2 rounded-lg">
              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full lg:w-[200px] p-4">
        <Button
          onClick={() => navigate('/cases/new')}
          variant="secondary"
          className="w-full mb-2"
        >
          Create Case
        </Button>
        <FiltersTrigger
          activeCount={activeFilterCount}
          onClick={openDialog}
          className="mb-2"
        />
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error loading cases</p>
          <p className="text-sm text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()} size="small">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!cases || cases.length === 0) {
    return (
      <div className="flex flex-col w-full lg:w-[200px] p-4">
        <Button
          onClick={() => navigate('/cases/new')}
          variant="secondary"
          className="w-full mb-2"
        >
          Create Case
        </Button>
        <FiltersTrigger
          activeCount={activeFilterCount}
          onClick={openDialog}
          className="mb-2"
        />
        <div className="text-center text-gray-500">
          <p className="text-sm">No cases found</p>
        </div>
        <FiltersDialog
          open={isDialogOpen}
          onOpenChange={closeDialog}
          filters={filterItems}
          title="Filters"
          onApply={applyFilters}
          onClear={clearFilters}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full lg:w-[200px]">
      <Button
        onClick={() => navigate('/cases/new')}
        variant="secondary"
        className="w-full mb-2"
      >
        Create Case
      </Button>
      <FiltersTrigger
        activeCount={activeFilterCount}
        onClick={openDialog}
        className="mb-2"
      />
      <div className="flex flex-col gap-2">
        {cases?.map((caseItem: CaseListItem) => {
          const isActive = caseItem.id === activeId;
          return (
            <Link
              key={caseItem.id}
              to={`/cases/${caseItem.id}`}
              onClick={onCaseClick}
              className={`flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-[#e8feff]' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex flex-col items-start text-sm leading-[21px] w-full lg:w-[167px]">
                <p className="font-semibold text-[#00848b] w-full truncate">{caseItem.title}</p>
                <p className="font-normal text-[#192627] w-full truncate">
                  {formatCaseNumber(caseItem.id, caseItem.createdAt)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      <FiltersDialog
        open={isDialogOpen}
        onOpenChange={closeDialog}
        filters={filterItems}
        title="Filters"
        onApply={applyFilters}
        onClear={clearFilters}
      />
    </div>
  );
}
