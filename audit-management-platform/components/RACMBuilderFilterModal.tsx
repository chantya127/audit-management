
import React, { useState, useMemo } from 'react';
import type { RACMDetail } from '../types';
import { CloseIcon } from './icons/Icons';

interface RACMFilters {
    keyStatus: 'All' | 'Key' | 'Not Key';
    riskIds: string[];
}

interface RACMBuilderFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: RACMFilters) => void;
  currentFilters: RACMFilters;
  allRows: RACMDetail[];
}

const RACMBuilderFilterModal: React.FC<RACMBuilderFilterModalProps> = ({ isOpen, onClose, onApply, currentFilters, allRows }) => {
  const [localFilters, setLocalFilters] = useState<RACMFilters>(currentFilters);

  const uniqueRiskIds = useMemo(() => [...new Set(allRows.map(r => r.riskId).filter(Boolean).sort())], [allRows]);

  const handleRiskIdChange = (riskId: string) => {
    setLocalFilters(prev => {
        const newRiskIds = prev.riskIds.includes(riskId)
            ? prev.riskIds.filter(id => id !== riskId)
            : [...prev.riskIds, riskId];
      return { ...prev, riskIds: newRiskIds };
    });
  };

  const handleKeyStatusChange = (status: 'All' | 'Key' | 'Not Key') => {
    setLocalFilters(prev => ({ ...prev, keyStatus: status }));
  };

  const handleApply = () => {
    onApply(localFilters);
  };
  
  const handleClear = () => {
    const clearedFilters = { keyStatus: 'All' as 'All', riskIds: [] };
    setLocalFilters(clearedFilters);
    onApply(clearedFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-40 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <header className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Filter RACM Rows</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon className="h-6 w-6" /></button>
        </header>

        <main className="p-6 space-y-6">
            <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3">Key Control</h3>
                <div className="flex space-x-4">
                    {['All', 'Key', 'Not Key'].map(status => (
                        <label key={status} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="keyStatus"
                                value={status}
                                checked={localFilters.keyStatus === status}
                                onChange={() => handleKeyStatusChange(status as any)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">{status}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3">Risk ID</h3>
                <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-2">
                    {uniqueRiskIds.map(riskId => (
                        <label key={riskId} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={localFilters.riskIds.includes(riskId)}
                                onChange={() => handleRiskIdChange(riskId)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">{riskId}</span>
                        </label>
                    ))}
                </div>
            </div>
        </main>

        <footer className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
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

export default RACMBuilderFilterModal;
