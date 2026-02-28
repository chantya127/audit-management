
import React from 'react';
import type { Engagement } from '../types';
import { ChevronRightIcon, CopyIcon } from './icons/Icons';

interface EngagementWorkspaceHeaderProps {
  engagement: Engagement;
  onBack: () => void;
  isClosed: boolean;
}

const EngagementStatusBadge: React.FC<{ status: Engagement['status'], type: string }> = ({ status, type }) => {
    const typeColor = "bg-gray-800 text-white";
    
    // FIX: Added 'PLANNING' status to support its use for new engagements.
    const statusClasses: Record<Engagement['status'], string> = {
        "IN PROGRESS": "bg-blue-100 text-blue-800",
        "UNDER REVIEW": "bg-gray-200 text-gray-800",
        "NOT STARTED": "bg-gray-100 text-gray-600",
        "CLOSED": "bg-gray-700 text-gray-100",
        "PLANNING": "bg-sky-100 text-sky-800",
    };
    
    const statusColor = statusClasses[status] || "bg-gray-100 text-gray-800";

    return (
        <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${typeColor}`}>{type}</span>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${statusColor}`}>{status}</span>
        </div>
    );
}

const EngagementWorkspaceHeader: React.FC<EngagementWorkspaceHeaderProps> = ({ engagement, onBack, isClosed }) => {
  return (
    <>
      <div className="flex items-center text-sm sm:text-base text-gray-500 mb-4">
        <button onClick={onBack} className="hover:text-gray-900">Audit Management</button>
        <ChevronRightIcon className="h-5 w-5 mx-1" />
        <button onClick={onBack} className="hover:text-gray-900">Engagement</button>
        <ChevronRightIcon className="h-5 w-5 mx-1" />
        <span className="font-medium text-gray-800 truncate">{engagement.name}</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{engagement.name}</h2>
            <EngagementStatusBadge status={engagement.status} type={engagement.type} />
          </div>
      </div>
       <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm">
              <div>
                  <span className="text-gray-500">Linked RACM: </span>
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-800">{engagement.linkedRacmName || 'FY26 SOX v1.0'}</a>
              </div>
              <div>
                  <span className="text-gray-500">Period: </span>
                  <span className="font-medium text-gray-800">1 Apr 2025 - 31 Mar 2026</span>
              </div>
          </div>
          <div className="flex items-center gap-3">
               <div className="relative">
                  <select
                    defaultValue="FY 2026"
                    className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 sm:text-sm"
                  >
                    <option>FY 2026</option>
                    <option>FY 2025</option>
                  </select>
               </div>
               <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md">
                   <CopyIcon className="h-5 w-5" />
               </button>
               <button 
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isClosed}
               >
                   {isClosed ? 'Engagement Closed' : 'Close Engagement'}
               </button>
          </div>
      </div>
    </>
  );
};

export default EngagementWorkspaceHeader;