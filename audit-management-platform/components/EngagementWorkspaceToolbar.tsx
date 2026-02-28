
import React from 'react';
import { SearchIcon, FilterIcon, SortBarsIcon } from './icons/Icons';

interface EngagementWorkspaceToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  totalCount: number;
  filteredCount: number;
}

const EngagementWorkspaceToolbar: React.FC<EngagementWorkspaceToolbarProps> = ({ searchTerm, onSearchChange, totalCount, filteredCount }) => {
  return (
    <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
      <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search controls..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <button className="flex items-center gap-1 hover:text-gray-900">
            <FilterIcon className="h-5 w-5 text-gray-500" />
            Filter
        </button>
        <button className="flex items-center gap-1 hover:text-gray-900">
            <SortBarsIcon className="h-5 w-5 text-gray-500" />
            Sort
        </button>
        <span>
            Showing <span className="font-semibold text-gray-800">{filteredCount}</span> of <span className="font-semibold text-gray-800">{totalCount}</span> controls
        </span>
      </div>
    </div>
  );
};

export default EngagementWorkspaceToolbar;
