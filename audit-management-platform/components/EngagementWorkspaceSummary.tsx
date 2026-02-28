
import React, { useMemo } from 'react';
import type { EngagementControl, EngagementControlSummaryFilter } from '../types';

interface EngagementWorkspaceSummaryProps {
  controls: EngagementControl[];
  activeFilter: EngagementControlSummaryFilter | null;
  onFilterClick: (filter: EngagementControlSummaryFilter) => void;
}

const EngagementWorkspaceSummary: React.FC<EngagementWorkspaceSummaryProps> = ({ controls, activeFilter, onFilterClick }) => {

  const stats = useMemo(() => ({
    'Total Controls': controls.length,
    'Key Controls': controls.filter(c => c.key).length,
    'In Progress': controls.filter(c => c.status === 'In Testing').length,
    'Pending Review': controls.filter(c => c.status === 'Pending Review').length,
    'Concluded': controls.filter(c => c.status === 'Concluded').length,
    // FIX: Changed filter logic from 'Deficient' to 'Ineffective' to match ControlConclusion type.
    'Deficient': controls.filter(c => c.conclusion === 'Ineffective').length,
  }), [controls]);

  const StatItem: React.FC<{ label: string, value: number, isFilterable: boolean, isDeficient?: boolean }> = ({ label, value, isFilterable, isDeficient = false }) => {
    const isActive = activeFilter === label;
    const baseClasses = `px-4 py-2 flex items-center gap-3 rounded-md border`;
    const themeClasses = isDeficient 
        ? `bg-red-50 border-red-200 text-red-800` 
        : `bg-white border-gray-200`;
    const activeClasses = isActive ? (isDeficient ? 'ring-2 ring-red-400' : 'ring-2 ring-indigo-400') : '';
    const clickableClasses = isFilterable ? 'cursor-pointer hover:shadow-sm' : '';

    return (
        <div 
            className={`${baseClasses} ${themeClasses} ${activeClasses} ${clickableClasses}`}
            onClick={isFilterable ? () => onFilterClick(label as EngagementControlSummaryFilter) : undefined}
        >
            <span className={`text-2xl font-bold ${isDeficient ? 'text-red-600' : 'text-gray-900'}`}>{value}</span>
            <span className={`text-sm font-medium ${isDeficient ? 'text-red-700' : 'text-gray-600'}`}>{label}</span>
        </div>
    );
  };

  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatItem label="Total Controls" value={stats['Total Controls']} isFilterable={false} />
        <StatItem label="Key Controls" value={stats['Key Controls']} isFilterable={true} />
        <StatItem label="In Progress" value={stats['In Progress']} isFilterable={true} />
        <StatItem label="Pending Review" value={stats['Pending Review']} isFilterable={true} />
        <StatItem label="Concluded" value={stats['Concluded']} isFilterable={true} />
        <StatItem label="Deficient" value={stats['Deficient']} isFilterable={true} isDeficient={true} />
    </div>
  );
};

export default EngagementWorkspaceSummary;