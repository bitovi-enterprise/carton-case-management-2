import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { formatCaseNumber } from '@carton/shared/client';
import { RelationshipManagerAccordion } from '@/components/common/RelationshipManagerAccordion';
import { RelationshipManagerDialog } from '@/components/common/RelationshipManagerDialog';
import type { RelatedCasesManagerProps } from './types';

export function RelatedCasesManager({ caseId }: RelatedCasesManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);

  const utils = trpc.useUtils();

  // Query for related cases
  const { data: relatedCases = [] } = trpc.case.getRelatedCases.useQuery({
    caseId,
  });

  // Query for available cases (only when dialog is open)
  const { data: availableCases = [] } = trpc.case.getAvailableCasesForRelation.useQuery(
    { caseId },
    { enabled: isDialogOpen }
  );

  // Mutation for adding related cases
  const addRelatedCasesMutation = trpc.case.addRelatedCases.useMutation({
    onSuccess: () => {
      // Invalidate queries to refresh the data
      utils.case.getRelatedCases.invalidate({ caseId });
      utils.case.getAvailableCasesForRelation.invalidate({ caseId });
      
      setIsDialogOpen(false);
      setSelectedCaseIds([]);
    },
    onError: (error) => {
      console.error('Failed to add related cases:', error);
    },
  });

  const handleAddClick = () => {
    setIsDialogOpen(true);
    setSelectedCaseIds([]);
  };

  const handleAdd = (selectedIds: string[]) => {
    addRelatedCasesMutation.mutate({
      caseId,
      relatedCaseIds: selectedIds,
    });
  };

  // Transform related cases for accordion display
  const accordionItems = relatedCases.map((relatedCase) => ({
    id: relatedCase.id,
    title: relatedCase.title,
    subtitle: formatCaseNumber(relatedCase.id, relatedCase.createdAt || ''),
    to: `/cases/${relatedCase.id}`,
  }));

  // Transform available cases for dialog display
  const dialogItems = availableCases.map((availableCase) => ({
    id: availableCase.id,
    title: availableCase.title,
    subtitle: formatCaseNumber(availableCase.id, availableCase.createdAt),
  }));

  return (
    <>
      <RelationshipManagerAccordion
        accordionTitle="Related Cases"
        items={accordionItems}
        defaultOpen={true}
        onAddClick={handleAddClick}
      />
      
      <RelationshipManagerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Add Related Cases"
        items={dialogItems}
        selectedItems={selectedCaseIds}
        onSelectionChange={setSelectedCaseIds}
        onAdd={handleAdd}
      />
    </>
  );
}
