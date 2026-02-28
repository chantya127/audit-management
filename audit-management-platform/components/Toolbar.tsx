
import React from 'react';
import { SearchIcon, ExportIcon } from './icons/Icons';

interface ToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedFramework: string;
  onFrameworkChange: (framework: string) => void;
  frameworkOptions: string[];
  onExport: () => void;
  onCreate: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  searchTerm,
  onSearchChange,
  selectedFramework,
  onFrameworkChange,
  frameworkOptions,
  onExport,
  onCreate
}) => {
  return (
    <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
      <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search RACMs..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <select
          value={selectedFramework}
          onChange={(e) => onFrameworkChange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {frameworkOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <ExportIcon className="-ml-0.5 h-5 w-5 text-gray-400" />
          Export
        </button>
        <button 
          onClick={onCreate}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Create RACM
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
