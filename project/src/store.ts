import { create } from 'zustand';
import { Account, Employee, PayItem, AccountMapping } from './types';

interface Store {
  accounts: Account[];
  employees: Employee[];
  payItems: PayItem[];
  mappings: AccountMapping[];
  setAccounts: (accounts: Account[]) => void;
  setEmployees: (employees: Employee[]) => void;
  setPayItems: (payItems: PayItem[]) => void;
  addMapping: (mapping: AccountMapping) => void;
  updateMapping: (mapping: AccountMapping) => void;
  deleteMapping: (id: string) => void;
}

const mockAccounts: Account[] = [
  { id: '1', code: '1000', name: 'Basic Salary - Dubai' },
  { id: '2', code: '1001', name: 'Basic Salary - Abu Dhabi' },
  { id: '3', code: '1002', name: 'Transport Allowance' },
  { id: '4', code: '1003', name: 'Housing Allowance' },
  { id: '5', code: '2000', name: 'Social Security Payable' },
];

const mockEmployees: Employee[] = [
  { id: '1', name: 'John Doe', location: 'Dubai', department: 'Engineering' },
  { id: '2', name: 'Jane Smith', location: 'Abu Dhabi', department: 'Marketing' },
  { id: '3', name: 'Mike Johnson', location: 'Dubai', department: 'Finance' },
];

const mockPayItems: PayItem[] = [
  { id: '1', name: 'Basic Salary', type: 'earning', requiresMapping: true },
  { id: '2', name: 'Transport Allowance', type: 'earning', requiresMapping: true },
  { id: '3', name: 'Housing Allowance', type: 'earning', requiresMapping: true },
  { id: '4', name: 'Social Security', type: 'deduction', requiresMapping: true },
];

export const useStore = create<Store>((set) => ({
  accounts: mockAccounts,
  employees: mockEmployees,
  payItems: mockPayItems,
  mappings: [],
  setAccounts: (accounts) => set({ accounts }),
  setEmployees: (employees) => set({ employees }),
  setPayItems: (payItems) => set({ payItems }),
  addMapping: (mapping) =>
    set((state) => ({ mappings: [...state.mappings, mapping] })),
  updateMapping: (mapping) =>
    set((state) => ({
      mappings: state.mappings.map((m) =>
        m.id === mapping.id ? mapping : m
      ),
    })),
  deleteMapping: (id) =>
    set((state) => ({
      mappings: state.mappings.filter((m) => m.id !== id),
    })),
}));