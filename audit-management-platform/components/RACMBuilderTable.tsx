
import React, { useRef, useEffect, useState } from 'react';
import type { RACMDetail, RACMDetailSortKey, SortDirection, ValidationErrors, AssertionType } from '../types';
import { ChevronDownIcon, CheckIcon, SortIcon } from './icons/Icons';
import { CONTROL_LIBRARY } from '../constants';

interface RACMBuilderTableProps {
    rows: RACMDetail[];
    setRows: React.Dispatch<React.SetStateAction<RACMDetail[]>>;
    isLocked: boolean;
    selectedRowIds: Set<number>;
    setSelectedRowIds: React.Dispatch<React.SetStateAction<Set<number>>>;
    validationErrors: ValidationErrors;
    sortConfig: { key: RACMDetailSortKey; direction: SortDirection };
    onSort: (key: RACMDetailSortKey) => void;
}

const EditableCell: React.FC<{ value: string; isLocked: boolean; onChange: (newValue: string) => void; error?: string; }> = ({ value, isLocked, onChange, error }) => {
    if (isLocked) {
        return <div className={`px-2 py-3 text-sm text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis ${error ? 'bg-red-50' : ''}`} title={value}>{value || <span className="text-gray-400"></span>}</div>;
    }
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full h-full text-sm bg-transparent px-2 py-3 border-none outline-none focus:bg-indigo-50 focus:ring-1 focus:ring-indigo-400 ${error ? 'bg-red-50' : ''}`}
        />
    );
};

const ASSERTION_OPTIONS: AssertionType[] = ['Existence', 'Completeness', 'Accuracy', 'Valuation', 'Cut-off'];

const AssertionCell: React.FC<{ value: AssertionType | ''; isLocked: boolean; onChange: (newValue: AssertionType) => void; error?: string; }> = ({ value, isLocked, onChange, error }) => {
    if (isLocked) {
        return <div className={`px-2 py-3 text-sm text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis ${error ? 'bg-red-50' : ''}`} title={value}>{value || <span className="text-gray-400"></span>}</div>;
    }
    return (
        <div className="h-full">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value as AssertionType)}
            className={`w-full h-full text-sm bg-transparent px-2 py-3 border-none outline-none focus:bg-indigo-50 focus:ring-1 focus:ring-indigo-400 ${error ? 'bg-red-50' : ''}`}
          >
            <option value="" disabled>Select...</option>
            {ASSERTION_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
    );
};


const ControlNameCell: React.FC<{ value: string; isLocked: boolean; onChange: (newValue: string) => void; error?: string; }> = ({ value, isLocked, onChange, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (isLocked) {
        return <div className={`px-2 py-3 text-sm text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis ${error ? 'bg-red-50' : ''}`} title={value}>{value}</div>;
    }

    const filteredControls = CONTROL_LIBRARY.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSelectControl = (controlName: string) => {
        onChange(controlName);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="relative h-full" ref={containerRef}>
            <div className={`flex items-center h-full w-full ${error ? 'bg-red-50' : ''}`}>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-full text-sm bg-transparent px-2 py-3 border-none outline-none focus:bg-indigo-50 focus:ring-1 focus:ring-indigo-400"
                    aria-autocomplete="list"
                    aria-controls="control-library-list"
                />
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex-shrink-0 h-full px-2 text-gray-400 hover:text-gray-600"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <ChevronDownIcon className="h-5 w-5" />
                </button>
            </div>
            {isOpen && (
                <div className="absolute z-10 top-full mt-0.5 w-full min-w-[300px] max-w-md bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2 border-b">
                        <input
                            type="text"
                            placeholder="Search controls..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            autoFocus
                        />
                    </div>
                    <ul id="control-library-list" role="listbox">
                        {filteredControls.length > 0 ? filteredControls.map((control, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelectControl(control)}
                                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                role="option"
                                aria-selected={control === value}
                            >
                                {control}
                            </li>
                        )) : (
                            <li className="px-3 py-2 text-sm text-gray-500">No controls found.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

const LockedCheckbox: React.FC<{ checked: boolean, isKeyControl?: boolean }> = ({ checked, isKeyControl }) => (
    <div className={`h-5 w-5 rounded-sm flex items-center justify-center ${checked ? 'bg-gray-700' : 'bg-white border border-gray-400'}`}>
        {checked && isKeyControl && <CheckIcon className="h-4 w-4 text-white" />}
    </div>
);


const RACMBuilderTable: React.FC<RACMBuilderTableProps> = ({ rows, setRows, isLocked, selectedRowIds, setSelectedRowIds, validationErrors, sortConfig, onSort }) => {
    const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectAllCheckboxRef.current) {
            selectAllCheckboxRef.current.indeterminate = selectedRowIds.size > 0 && selectedRowIds.size < rows.length;
        }
    }, [selectedRowIds, rows.length]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRowIds(e.target.checked ? new Set(rows.map(r => r.id)) : new Set());
    };

    const handleSelectOne = (id: number) => {
        const newSelectedIds = new Set(selectedRowIds);
        newSelectedIds.has(id) ? newSelectedIds.delete(id) : newSelectedIds.add(id);
        setSelectedRowIds(newSelectedIds);
    };
    
    const handleCellChange = (id: number, field: keyof Omit<RACMDetail, 'id'>, value: any) => {
        setRows(currentRows => currentRows.map(row => row.id === id ? { ...row, [field]: value } : row));
    };

    const handleKeyChange = (id: number, riskId: string, isChecked: boolean) => {
        setRows(currentRows =>
          currentRows.map(row => {
            if (row.riskId === riskId) {
              return { ...row, key: row.id === id ? isChecked : false };
            }
            return row;
          })
        );
    };
    
    const headers: { key: RACMDetailSortKey; label: string; className: string }[] = [
        { key: 'riskId', label: 'Risk ID', className: 'w-[10%]' },
        { key: 'riskDescription', label: 'Risk Description', className: 'w-[22.5%]' },
        { key: 'assertion', label: 'Assertion', className: 'w-[10%]' },
        { key: 'controlName', label: 'Control Name', className: 'w-[22.5%]' },
        { key: 'controlDescription', label: 'Control Description', className: 'w-[22.5%]' },
        { key: 'key', label: 'Key Control', className: 'w-[10%]' },
    ];


    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="w-12 px-4 py-2 border-b border-r border-gray-200">
                             {isLocked ? (
                                <LockedCheckbox checked={selectedRowIds.size === rows.length && rows.length > 0} />
                            ) : (
                                <input 
                                    type="checkbox" 
                                    ref={selectAllCheckboxRef} 
                                    onChange={handleSelectAll} 
                                    checked={rows.length > 0 && selectedRowIds.size === rows.length}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                            )}
                        </th>
                        {headers.map(({ key, label, className }) => (
                            <th key={key} onClick={() => onSort(key)} className={`px-2 py-3 text-left text-sm font-semibold text-gray-800 border-b border-r border-gray-200 cursor-pointer select-none ${className}`}>
                                <div className="flex items-center justify-between">
                                    {label}
                                    <SortIcon
                                        className="h-4 w-4"
                                        direction={sortConfig.key === key ? sortConfig.direction : 'none'}
                                    />
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {rows.length > 0 ? rows.map((row) => (
                        <tr key={row.id}>
                            <td className="w-12 text-center border-b border-r border-gray-200">
                                <div className="flex items-center justify-center">
                                    {isLocked ? (
                                        <LockedCheckbox checked={selectedRowIds.has(row.id)} />
                                    ) : (
                                        <input 
                                            type="checkbox" 
                                            checked={selectedRowIds.has(row.id)} 
                                            onChange={() => handleSelectOne(row.id)}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                    )}
                                </div>
                            </td>
                            <td className="p-0 align-middle border-b border-r border-gray-200"><EditableCell value={row.riskId} isLocked={isLocked} onChange={val => handleCellChange(row.id, 'riskId', val)} error={validationErrors[row.id]?.riskId} /></td>
                            <td className="p-0 align-middle border-b border-r border-gray-200"><EditableCell value={row.riskDescription} isLocked={isLocked} onChange={val => handleCellChange(row.id, 'riskDescription', val)} error={validationErrors[row.id]?.riskDescription} /></td>
                            <td className="p-0 align-middle border-b border-r border-gray-200">
                                <AssertionCell
                                    value={row.assertion}
                                    isLocked={isLocked}
                                    onChange={val => handleCellChange(row.id, 'assertion', val)}
                                    error={validationErrors[row.id]?.assertion}
                                />
                            </td>
                            <td className="p-0 align-middle border-b border-r border-gray-200">
                                <ControlNameCell 
                                    value={row.controlName} 
                                    isLocked={isLocked} 
                                    onChange={val => handleCellChange(row.id, 'controlName', val)} 
                                    error={validationErrors[row.id]?.controlName} 
                                />
                            </td>
                            <td className="p-0 align-middle border-b border-r border-gray-200"><EditableCell value={row.controlDescription} isLocked={isLocked} onChange={val => handleCellChange(row.id, 'controlDescription', val)} error={validationErrors[row.id]?.controlDescription} /></td>
                            <td className="text-center align-middle border-b border-gray-200">
                                 <div className="flex items-center justify-center">
                                    {isLocked ? (
                                        <LockedCheckbox checked={row.key} isKeyControl={true}/>
                                    ) : (
                                        <input 
                                            type="checkbox" 
                                            checked={row.key} 
                                            disabled={isLocked} 
                                            onChange={e => handleKeyChange(row.id, row.riskId, e.target.checked)} 
                                            className="h-5 w-5 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500 accent-gray-700"
                                        />
                                    )}
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan={7} className="text-center py-10 text-gray-500 border-b border-gray-200">No risks and controls defined. Add a row to begin.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RACMBuilderTable;