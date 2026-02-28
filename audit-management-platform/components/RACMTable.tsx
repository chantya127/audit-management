
import React, { useRef, useEffect } from 'react';
import type { RACM, SortConfig, SortKey } from '../types';
import { SortIcon, LockIcon, UnlockIcon, EyeIcon, PencilIcon, DuplicateIcon } from './icons/Icons';

interface RACMTableProps {
  racms: RACM[];
  sortConfig: SortConfig;
  onSort: (key: SortKey) => void;
  onDuplicate: (id: number) => void;
  selectedIds: Set<number>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<number>>>;
  highlightedRowId: number | null;
  onRowClick: (racm: RACM) => void;
}

const StatusBadge: React.FC<{ status: RACM['status'] }> = ({ status }) => {
  const baseClasses = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  const statusClasses = {
    Active: "bg-green-100 text-green-800",
    Draft: "bg-yellow-100 text-yellow-800",
    Archived: "bg-gray-100 text-gray-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const RACMTable: React.FC<RACMTableProps> = ({ racms, sortConfig, onSort, onDuplicate, selectedIds, setSelectedIds, highlightedRowId, onRowClick }) => {
  
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isIndeterminate = selectedIds.size > 0 && selectedIds.size < racms.length;
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [selectedIds, racms.length]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelectedIds = new Set(racms.map(r => r.id));
      setSelectedIds(newSelectedIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: number) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };
  
  const headers: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'RACM Name' },
    { key: 'framework', label: 'Framework' },
    { key: 'financialYear', label: 'Financial Year' },
    { key: 'version', label: 'Version' },
    { key: 'status', label: 'Status' },
    { key: 'locked', label: 'Locked' },
    { key: 'linkedEngagements', label: 'Linked Engagements' },
    { key: 'lastUpdated', label: 'Last Updated' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                ref={selectAllCheckboxRef}
                checked={racms.length > 0 && selectedIds.size === racms.length}
                onChange={handleSelectAll}
              />
            </th>
            {headers.map(({ key, label }) => (
              <th
                key={key}
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                onClick={() => onSort(key)}
              >
                <div className="group inline-flex items-center">
                  {label}
                  <SortIcon
                    className={`ml-2 h-4 w-4 ${sortConfig.key === key ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500'}`}
                    direction={sortConfig.key === key ? sortConfig.direction : 'none'}
                  />
                </div>
              </th>
            ))}
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {racms.length > 0 ? (
            racms.map((racm) => (
              <tr key={racm.id} className={`${racm.id === highlightedRowId ? 'bg-indigo-50' : ''} hover:bg-gray-50 transition-colors duration-1000`}>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                   <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                    checked={selectedIds.has(racm.id)}
                    onChange={() => handleSelectOne(racm.id)}
                   />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                  <a href="#" onClick={(e) => { e.preventDefault(); onRowClick(racm); }} className="text-indigo-600 hover:text-indigo-900">
                    {racm.name}
                  </a>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{racm.framework}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{racm.financialYear}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{racm.version}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <StatusBadge status={racm.status} />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                  {racm.status === 'Active' ? (
                    racm.locked ? (
                      <LockIcon className="h-5 w-5 text-gray-700 inline-block" />
                    ) : (
                      <UnlockIcon className="h-5 w-5 text-gray-700 inline-block" />
                    )
                  ) : (
                    <UnlockIcon className="h-5 w-5 text-gray-400 inline-block" />
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{racm.linkedEngagements}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{racm.lastUpdated}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    <button onClick={() => onRowClick(racm)} className="text-gray-400 hover:text-indigo-600">
                      <EyeIcon className="h-5 w-5"/>
                    </button>
                    <button 
                      onClick={() => {
                        if (racm.locked) {
                          alert('Locked RACM cannot be edited.');
                        } else if (racm.status === 'Archived') {
                          alert('Archived RACM cannot be edited.');
                        } else {
                          onRowClick(racm); // Navigate to builder for drafts
                        }
                      }} 
                      className={`text-gray-400 ${racm.locked || racm.status === 'Archived' ? 'cursor-not-allowed' : 'hover:text-indigo-600'}`}
                      disabled={racm.locked || racm.status === 'Archived'}
                    >
                      <PencilIcon className="h-5 w-5"/>
                    </button>
                    <button onClick={() => onDuplicate(racm.id)} className="text-gray-400 hover:text-indigo-600">
                      <DuplicateIcon className="h-5 w-5"/>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={11} className="text-center py-10 text-gray-500">
                No RACMs match the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RACMTable;
