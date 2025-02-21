export interface Account {
  id: string;
  code: string;
  name: string;
}

export interface Employee {
  id: string;
  name: string;
  location: string;
  department: string;
}

export interface PayItem {
  id: string;
  name: string;
  type: 'earning' | 'deduction';
  requiresMapping?: boolean;
}

export type GroupingOption = 'location' | 'department';

export interface AccountMapping {
  id: string;
  payItemId: string;
  mappingType: 'single' | 'multiple';
  lineItemType: 'single' | 'multiple';
  primaryGrouping?: GroupingOption;
  secondaryGrouping?: GroupingOption;
  journalEntries: JournalEntry[];
}

export interface JournalEntry {
  id: string;
  accountId: string;
  description: string;
  type: 'debit' | 'credit';
  groupingValue?: string;
  secondaryGroupingValue?: string;
}