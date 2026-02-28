
import React from 'react';
import type { RACM, SummaryFilter } from '../types';

interface SummaryStripProps {
  racms: RACM[];
  activeFilter: SummaryFilter | null;
  onFilterClick: (filter: SummaryFilter) => void;
}

const SummaryStrip: React.FC<SummaryStripProps> = ({ racms, activeFilter, onFilterClick }) => {
  const stats = {
    'Total RACMs': racms.length,
    'Active': racms.filter(r => r.status === 'Active').length,
    'Draft': racms.filter(r => r.status === 'Draft').length,
    'Locked': racms.filter(r => r.locked).length,
    'Linked to Engagement': racms.filter(r => r.linkedEngagements > 0).length,
  };

  const StatItem: React.FC<{ label: string; value: number; isFilterable: boolean; filter?: SummaryFilter; }> = ({ label, value, isFilterable, filter }) => {
    const isActive = activeFilter === filter;
    const baseClasses = "bg-white p-4 rounded-lg border";
    const clickableClasses = isFilterable ? "cursor-pointer transition-all duration-200 hover:shadow-md hover:border-indigo-300" : "";
    const activeClasses = isActive ? "border-indigo-500 ring-2 ring-indigo-200" : "border-gray-200";

    return (
      <div
        className={`${baseClasses} ${clickableClasses} ${activeClasses}`}
        onClick={isFilterable && filter ? () => onFilterClick(filter) : undefined}
      >
        <div className="flex items-center space-x-3">
          <p className={`text-3xl font-bold ${isActive ? 'text-indigo-600' : 'text-gray-900'}`}>{value}</p>
          <p className="text-sm font-medium text-gray-600">{label}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatItem label="Total RACMs" value={stats['Total RACMs']} isFilterable={false} />
      <StatItem label="Active" value={stats['Active']} isFilterable={true} filter="Active" />
      <StatItem label="Draft" value={stats['Draft']} isFilterable={true} filter="Draft" />
      <StatItem label="Locked" value={stats['Locked']} isFilterable={true} filter="Locked" />
      <StatItem label="Linked to Engagement" value={stats['Linked to Engagement']} isFilterable={true} filter="Linked to Engagement" />
    </div>
  );
};

export default SummaryStrip;
