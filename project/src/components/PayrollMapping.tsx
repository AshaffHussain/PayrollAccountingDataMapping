import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Select from 'react-select';
import { useStore } from '../store';
import { AccountMapping, GroupingOption, JournalEntry } from '../types';
import { generateId } from '../utils';

export default function PayrollMapping() {
  const { payItems, accounts, mappings, addMapping, updateMapping, deleteMapping } = useStore();
  const [selectedPayItem, setSelectedPayItem] = useState<string | null>(null);

  const unmappedPayItems = payItems.filter(
    item => item.requiresMapping && !mappings.some(m => m.payItemId === item.id)
  );

  const groupingOptions = [
    { value: 'location', label: 'Location (Abu Dhabi, Dubai)' },
    { value: 'department', label: 'Department (Marketing, Finance, Engineering)' },
  ];

  const handleAddMapping = () => {
    if (!selectedPayItem) return;

    const newMapping: AccountMapping = {
      id: generateId(),
      payItemId: selectedPayItem,
      mappingType: 'single',
      lineItemType: 'single',
      journalEntries: [
        {
          id: generateId(),
          accountId: '',
          description: '',
          type: 'debit',
        },
      ],
    };

    addMapping(newMapping);
    setSelectedPayItem(null);
  };

  const handleUpdateMapping = (mapping: AccountMapping) => {
    updateMapping(mapping);
  };

  const getGroupingValues = (groupingType: GroupingOption) => {
    const values = new Set(useStore.getState().employees.map(e => e[groupingType]));
    return Array.from(values);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Payroll Account Mapping</h1>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Pay Items Requiring Mapping</h2>
          <div className="flex gap-4 items-center">
            <Select
              className="w-64"
              value={selectedPayItem ? {
                value: selectedPayItem,
                label: payItems.find(item => item.id === selectedPayItem)?.name
              } : null}
              options={unmappedPayItems.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              onChange={(option) => setSelectedPayItem(option?.value || null)}
              placeholder="Select Pay Item"
            />
            <button
              onClick={handleAddMapping}
              disabled={!selectedPayItem}
              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50 hover:bg-blue-600 transition-colors"
            >
              <Plus size={20} /> Start Mapping
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {mappings.map((mapping) => {
            const payItem = payItems.find((p) => p.id === mapping.payItemId);
            
            return (
              <div key={mapping.id} className="border rounded-lg p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">{payItem?.name}</h3>
                  <button
                    onClick={() => deleteMapping(mapping.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Mapping Type Selection */}
                  <div>
                    <h4 className="font-medium mb-3">Account Mapping Type</h4>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={mapping.mappingType === 'single'}
                          onChange={() => handleUpdateMapping({
                            ...mapping,
                            mappingType: 'single',
                            primaryGrouping: undefined,
                            secondaryGrouping: undefined,
                            journalEntries: [{
                              id: generateId(),
                              accountId: '',
                              description: '',
                              type: 'debit',
                            }],
                          })}
                          className="text-blue-500"
                        />
                        Single Account
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={mapping.mappingType === 'multiple'}
                          onChange={() => handleUpdateMapping({
                            ...mapping,
                            mappingType: 'multiple',
                            journalEntries: [],
                          })}
                          className="text-blue-500"
                        />
                        Multiple Accounts
                      </label>
                    </div>
                  </div>

                  {/* Line Item Type Selection */}
                  <div>
                    <h4 className="font-medium mb-3">Line Item Type</h4>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={mapping.lineItemType === 'single'}
                          onChange={() => handleUpdateMapping({
                            ...mapping,
                            lineItemType: 'single',
                            secondaryGrouping: undefined,
                          })}
                          className="text-blue-500"
                        />
                        Single Line Item
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={mapping.lineItemType === 'multiple'}
                          onChange={() => handleUpdateMapping({
                            ...mapping,
                            lineItemType: 'multiple',
                          })}
                          className="text-blue-500"
                        />
                        Multiple Line Items
                      </label>
                    </div>
                  </div>

                  {/* Primary Grouping Selection */}
                  {mapping.mappingType === 'multiple' && (
                    <div>
                      <h4 className="font-medium mb-3">Primary Employee Grouping</h4>
                      <Select
                        className="w-64"
                        value={mapping.primaryGrouping ? {
                          value: mapping.primaryGrouping,
                          label: groupingOptions.find(opt => opt.value === mapping.primaryGrouping)?.label
                        } : null}
                        options={groupingOptions}
                        onChange={(option) => {
                          if (!option) return;
                          const groupingValues = getGroupingValues(option.value as GroupingOption);
                          handleUpdateMapping({
                            ...mapping,
                            primaryGrouping: option.value as GroupingOption,
                            journalEntries: groupingValues.map(value => ({
                              id: generateId(),
                              accountId: '',
                              description: '',
                              type: 'debit',
                              groupingValue: value,
                            })),
                          });
                        }}
                        placeholder="Select Grouping Option"
                      />
                    </div>
                  )}

                  {/* Secondary Grouping Selection */}
                  {mapping.lineItemType === 'multiple' && mapping.primaryGrouping && (
                    <div>
                      <h4 className="font-medium mb-3">Secondary Employee Grouping</h4>
                      <Select
                        className="w-64"
                        value={mapping.secondaryGrouping ? {
                          value: mapping.secondaryGrouping,
                          label: groupingOptions.find(opt => opt.value === mapping.secondaryGrouping)?.label
                        } : null}
                        options={groupingOptions.filter(opt => opt.value !== mapping.primaryGrouping)}
                        onChange={(option) => {
                          const secondaryGrouping = option?.value as GroupingOption;
                          if (!secondaryGrouping) return;

                          const newJournalEntries: JournalEntry[] = [];
                          const primaryValues = getGroupingValues(mapping.primaryGrouping!);
                          const secondaryValues = getGroupingValues(secondaryGrouping);

                          primaryValues.forEach(primaryValue => {
                            secondaryValues.forEach(secondaryValue => {
                              newJournalEntries.push({
                                id: generateId(),
                                accountId: '',
                                description: '',
                                type: 'debit',
                                groupingValue: primaryValue,
                                secondaryGroupingValue: secondaryValue,
                              });
                            });
                          });

                          handleUpdateMapping({
                            ...mapping,
                            secondaryGrouping,
                            journalEntries: newJournalEntries,
                          });
                        }}
                        placeholder="Select Secondary Grouping"
                      />
                    </div>
                  )}

                  {/* Journal Entries */}
                  <div>
                    <h4 className="font-medium mb-3">Journal Entries</h4>
                    <div className="space-y-4">
                      {mapping.journalEntries.map((entry, index) => (
                        <div key={entry.id} className="flex gap-4 items-start bg-white p-4 rounded-md shadow-sm">
                          {entry.groupingValue && (
                            <div className="w-32">
                              <div className="text-sm font-medium text-gray-500">{mapping.primaryGrouping}</div>
                              <div className="text-gray-900">{entry.groupingValue}</div>
                              {entry.secondaryGroupingValue && (
                                <>
                                  <div className="text-sm font-medium text-gray-500 mt-2">{mapping.secondaryGrouping}</div>
                                  <div className="text-gray-900">{entry.secondaryGroupingValue}</div>
                                </>
                              )}
                            </div>
                          )}
                          <div className="flex-1 space-y-3">
                            <Select
                              className="w-full"
                              value={entry.accountId ? {
                                value: entry.accountId,
                                label: accounts.find(a => a.id === entry.accountId)?.name
                              } : null}
                              options={accounts.map(account => ({
                                value: account.id,
                                label: account.name,
                              }))}
                              onChange={(option) => {
                                const updatedEntries = [...mapping.journalEntries];
                                updatedEntries[index] = {
                                  ...entry,
                                  accountId: option?.value || '',
                                };
                                handleUpdateMapping({
                                  ...mapping,
                                  journalEntries: updatedEntries,
                                });
                              }}
                              placeholder="Select Account"
                            />
                            <div className="flex gap-3">
                              <Select
                                className="w-32"
                                value={{
                                  value: entry.type,
                                  label: entry.type.charAt(0).toUpperCase() + entry.type.slice(1),
                                }}
                                options={[
                                  { value: 'debit', label: 'Debit' },
                                  { value: 'credit', label: 'Credit' },
                                ]}
                                onChange={(option) => {
                                  const updatedEntries = [...mapping.journalEntries];
                                  updatedEntries[index] = {
                                    ...entry,
                                    type: option?.value as 'debit' | 'credit',
                                  };
                                  handleUpdateMapping({
                                    ...mapping,
                                    journalEntries: updatedEntries,
                                  });
                                }}
                              />
                              <input
                                type="text"
                                value={entry.description || ''}
                                onChange={(e) => {
                                  const updatedEntries = [...mapping.journalEntries];
                                  updatedEntries[index] = {
                                    ...entry,
                                    description: e.target.value,
                                  };
                                  handleUpdateMapping({
                                    ...mapping,
                                    journalEntries: updatedEntries,
                                  });
                                }}
                                placeholder="Description"
                                className="flex-1 border rounded-md px-3 py-2"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}