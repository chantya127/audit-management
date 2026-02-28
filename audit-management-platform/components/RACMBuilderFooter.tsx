
import React from 'react';
import { CheckIcon, LockIcon } from './icons/Icons';
import type { RACMStatus } from '../types';

interface RACMBuilderFooterProps {
    racmStatus: RACMStatus;
    onSaveDraft: () => void;
    onValidate: () => void;
    onLock: () => void;
    totalRows: number;
    filteredRows: number;
}

const RACMBuilderFooter: React.FC<RACMBuilderFooterProps> = ({ racmStatus, onSaveDraft, onValidate, onLock, totalRows, filteredRows }) => {
    const isLocked = racmStatus === 'Locked';
    return (
        <div className="p-3 flex items-center justify-between border-t border-gray-200">
            <div>
                <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">{filteredRows}</span> of <span className="font-medium">{totalRows}</span> rows
                </p>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={onSaveDraft}
                    disabled={isLocked}
                    className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                    Save Draft
                </button>
                 <button
                    onClick={onValidate}
                    disabled={isLocked}
                    className="inline-flex items-center gap-x-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                    <CheckIcon className="h-5 w-5 text-gray-500" />
                    Validate
                </button>
                 <button
                    onClick={onLock}
                    disabled={racmStatus !== 'Validated'}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <LockIcon className="h-5 w-5" />
                    {isLocked ? 'Locked' : 'Lock RACM'}
                </button>
            </div>
        </div>
    );
};

export default RACMBuilderFooter;