
import React, { useState, useMemo } from 'react';
import type { Engagement, EngagementFilters, EngagementStatus } from '../types';
import { CloseIcon } from './icons/Icons';

interface EngagementFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  engagements: Engagement[];
  activeFilters: EngagementFilters;
  onApplyFilters: (filters: EngagementFilters) => void;
}

const EngagementFilterModal: React.FC<EngagementFilterModalProps> = ({ isOpen, onClose, engagements, activeFilters, onApplyFilters }) => {
  const [localFilters, setLocalFilters] = useState<EngagementFilters>(activeFilters);

  const filterOptions = useMemo(() => {
    const types = [...new Set(engagements.map(e => e.type))];
    const statuses = [...new Set(engagements.map(e => e.status))];
    const periods = [...new Set(engagements.map(e => e.period))];
    return { types, statuses, periods };
  }, [engagements]);

  const handleCheckboxChange = (category: keyof EngagementFilters, value: string) => {
    setLocalFilters(prev => {
        const currentValues = prev[category] as string[];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
      return { ...prev, [category]: newValues };
    });
  };
  
  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };
  
  const handleClear = () => {
    const clearedFilters = { types: [], statuses: [], periods: [] };
    setLocalFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-40 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <header className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Filter Engagements</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon className="h-6 w-6" /></button>
        </header>

        <main className="p-6 space-y-6">
            <FilterGroup title="Type" options={filterOptions.types} selected={localFilters.types} onChange={(val) => handleCheckboxChange('types', val)} />
            <FilterGroup title="Status" options={filterOptions.statuses} selected={localFilters.statuses as string[]} onChange={(val) => handleCheckboxChange('statuses', val)} />
            <FilterGroup title="Period" options={filterOptions.periods} selected={localFilters.periods} onChange={(val) => handleCheckboxChange('periods', val)} />
        </main>

        <footer className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <button onClick={handleClear} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">Clear All Filters</button>
            <div className="flex gap-3">
                 <button onClick={onClose} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Cancel</button>
                 <button onClick={handleApply} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">Apply Filters</button>
            </div>
        </footer>
      </div>
    </div>
  );
};

const FilterGroup: React.FC<{title: string, options: string[], selected: string[], onChange: (value: string) => void}> = ({ title, options, selected, onChange }) => (
    <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {options.map(option => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={selected.includes(option)}
                        onChange={() => onChange(option)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                </label>
            ))}
        </div>
    </div>
);

export default EngagementFilterModal;
