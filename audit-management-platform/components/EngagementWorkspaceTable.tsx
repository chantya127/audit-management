
import React, { useRef, useEffect } from 'react';
import type { EngagementControl, EngagementControlSortConfig, EngagementControlSortKey, ControlStatus, ControlConclusion } from '../types';
import { SortIcon } from './icons/Icons';

interface EngagementWorkspaceTableProps {
  controls: EngagementControl[];
  sortConfig: EngagementControlSortConfig;
  onSort: (key: EngagementControlSortKey) => void;
  selectedIds: Set<number>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<number>>>;
  onControlClick: (control: EngagementControl) => void;
  isEngagementClosed: boolean;
}

const StatusBadge: React.FC<{ status: ControlStatus }> = ({ status }) => {
  const statusClasses: Record<ControlStatus, string> = {
    'Concluded': 'bg-gray-200 text-gray-800',
    'In Testing': 'bg-blue-100 text-blue-800',
    'Not Started': 'bg-gray-100 text-gray-600',
    'Pending Review': 'bg-pink-100 text-pink-800',
    'Planning': 'bg-sky-100 text-sky-800',
  };
  return <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>{status}</span>;
};

const ConclusionBadge: React.FC<{ conclusion: ControlConclusion | null }> = ({ conclusion }) => {
    if (!conclusion) return <span className="text-gray-500">- Not Concluded</span>;
    const conclusionClasses: Record<ControlConclusion, string> = {
        'Effective': 'bg-green-100 text-green-800',
        'Ineffective': 'bg-red-100 text-red-800',
    };
    return <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${conclusionClasses[conclusion]}`}>{conclusion}</span>;
};

const EngagementWorkspaceTable: React.FC<EngagementWorkspaceTableProps> = ({ controls, sortConfig, onSort, selectedIds, setSelectedIds, onControlClick, isEngagementClosed }) => {
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
        selectAllCheckboxRef.current.indeterminate = selectedIds.size > 0 && selectedIds.size < controls.length;
    }
  }, [selectedIds, controls.length]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(e.target.checked ? new Set(controls.map(c => c.id)) : new Set());
  };

  const handleSelectOne = (id: number) => {
    const newSelectedIds = new Set(selectedIds);
    newSelectedIds.has(id) ? newSelectedIds.delete(id) : newSelectedIds.add(id);
    setSelectedIds(newSelectedIds);
  };
  
  const headers: { key: EngagementControlSortKey; label: string }[] = [
    { key: 'controlId', label: 'Control ID' },
    { key: 'controlName', label: 'Control Name' },
    { key: 'domain', label: 'Domain' },
    { key: 'key', label: 'Key Control' },
    { key: 'status', label: 'Status' },
    { key: 'samplesTested', label: 'Samples Tested' },
    { key: 'exceptions', label: 'Exceptions' },
    { key: 'conclusion', label: 'Conclusion' },
    { key: 'lastUpdated', label: 'Last Updated' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3.5">
              <input type="checkbox" ref={selectAllCheckboxRef} onChange={handleSelectAll} checked={controls.length > 0 && selectedIds.size === controls.length} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
            </th>
            {headers.map(({ key, label }) => (
              <th key={key} scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer" onClick={() => onSort(key)}>
                <div className="group inline-flex items-center">
                  {label}
                  <SortIcon className={`ml-2 h-4 w-4 ${sortConfig.key === key ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500'}`} direction={sortConfig.key === key ? sortConfig.direction : 'none'}/>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {controls.length > 0 ? (
            controls.map(control => (
              <tr 
                key={control.id} 
                className={!isEngagementClosed ? 'hover:bg-gray-50' : ''}
                onClick={!isEngagementClosed ? () => onControlClick(control) : undefined}
              >
                <td className="px-4 py-4"><input type="checkbox" checked={selectedIds.has(control.id)} onChange={() => handleSelectOne(control.id)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" /></td>
                <td className={`whitespace-nowrap px-3 py-4 text-sm font-medium ${isEngagementClosed ? 'text-gray-600' : 'cursor-pointer text-indigo-600 hover:text-indigo-800'}`}>{control.controlId}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">{control.controlName}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">{control.domain}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-gray-800">{control.key ? 'Y' : 'N'}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600"><StatusBadge status={control.status} /></td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">{control.samplesTested}</td>
                <td className={`whitespace-nowrap px-3 py-4 text-sm font-semibold ${control.exceptions > 0 ? 'text-red-600' : 'text-gray-800'}`}>{control.exceptions > 0 ? control.exceptions : '-'}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600"><ConclusionBadge conclusion={control.conclusion} /></td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">{control.lastUpdated}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center py-10 text-gray-500">No controls match the selected filters.</td>
            </tr>
          )}
           {Array.from({ length: Math.max(0, 10 - controls.length) }).map((_, i) => (
             <tr key={`empty-${i}`} className="h-14">
                <td colSpan={10}></td>
            </tr>
           ))}
        </tbody>
      </table>
    </div>
  );
};

export default EngagementWorkspaceTable;