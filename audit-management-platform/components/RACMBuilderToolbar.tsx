
import React from 'react';
import { AddIcon, DeleteIcon, CopyIcon, ImportIcon, ExportIcon, FilterIcon, SortBarsIcon, SearchIcon } from './icons/Icons';

interface RACMBuilderToolbarProps {
    onAddRow: () => void;
    onDelete: () => void;
    onCopy: () => void;
    onImport: () => void;
    onExport: () => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onFilterClick: () => void;
    onSortClick: () => void;
    disabled: boolean;
}

const Button: React.FC<{ onClick: () => void; disabled: boolean; icon: React.ReactNode; children: React.ReactNode }> = ({ onClick, disabled, icon, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="inline-flex items-center gap-x-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {icon}
        {children}
    </button>
);

const ToolbarDivider: React.FC = () => <div className="h-6 w-px bg-gray-300"></div>;

const RACMBuilderToolbar: React.FC<RACMBuilderToolbarProps> = (props) => {
    return (
        <div className="p-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
                <Button onClick={props.onAddRow} disabled={props.disabled} icon={<AddIcon className="h-5 w-5 text-gray-500" />}>Add Row</Button>
                <Button onClick={props.onDelete} disabled={props.disabled} icon={<DeleteIcon className="h-5 w-5 text-gray-500" />}>Delete</Button>
                <ToolbarDivider />
                <Button onClick={props.onCopy} disabled={props.disabled} icon={<CopyIcon className="h-5 w-5 text-gray-500" />}>Copy</Button>
                <ToolbarDivider />
                <Button onClick={props.onImport} disabled={props.disabled} icon={<ImportIcon className="h-5 w-5 text-gray-500" />}>Import</Button>
                <Button onClick={props.onExport} disabled={false} icon={<ExportIcon className="h-5 w-5 text-gray-500" />}>Export</Button>
            </div>
             <div className="flex items-center gap-3 flex-wrap">
                <Button onClick={props.onFilterClick} disabled={false} icon={<FilterIcon className="h-5 w-5 text-gray-500" />}>Filter</Button>
                <Button onClick={props.onSortClick} disabled={false} icon={<SortBarsIcon className="h-5 w-5 text-gray-500" />}>Sort</Button>
                <div className="relative flex-grow sm:flex-grow-0 sm:w-60 rounded-lg border-2 border-blue-600 overflow-hidden">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search Risk - Control"
                        value={props.searchTerm}
                        onChange={(e) => props.onSearchChange(e.target.value)}
                        className="block w-full border-transparent pl-10 py-2 bg-white text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default RACMBuilderToolbar;
