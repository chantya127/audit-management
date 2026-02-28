
import React from 'react';
import type { TestingSummary } from '../types';

interface TestingSummaryPanelProps {
  summary: TestingSummary;
}

const SummaryItem: React.FC<{label: string, value: number, color?: string}> = ({ label, value, color = 'text-gray-900' }) => (
    <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className={`text-lg font-bold ${color}`}>{value}</span>
    </div>
);

const TestingSummaryPanel: React.FC<TestingSummaryPanelProps> = ({ summary }) => {
    const { total, tested, passed, failed, notApplicable, notTested } = summary;
    const testedPercentage = total > 0 ? (tested / total) * 100 : 0;
    const failureRate = tested > 0 ? (failed / tested) * 100 : 0;
    const isEffective = failureRate <= 10;

  return (
    <aside className="w-72 flex-shrink-0 border-l border-gray-200 bg-white p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Control Summary</h3>

        <div className="space-y-4">
            <SummaryItem label="Total Samples" value={total} />
            <hr/>
            <SummaryItem label="Tested" value={tested} color="text-blue-600" />
            <SummaryItem label="Passed" value={passed} color="text-green-600" />
            <SummaryItem label="Failed" value={failed} color="text-red-600" />
            <SummaryItem label="N/A" value={notApplicable} color="text-gray-600" />
            <SummaryItem label="Not Tested" value={notTested} />
        </div>
        
        <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Testing Progress</h4>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${testedPercentage}%` }}
                ></div>
            </div>
            <p className="text-right text-sm text-gray-500 mt-1">{Math.round(testedPercentage)}% Complete</p>
        </div>
        
        <div className="mt-6">
             <h4 className="text-sm font-semibold text-gray-700 mb-2">Control Effectiveness</h4>
             {tested > 0 ? (
                <div className={`p-3 rounded-md text-center font-semibold text-sm ${isEffective ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                    {isEffective ? 'Effective' : 'Ineffective'}
                </div>
             ) : (
                 <p className="text-sm p-3 bg-gray-100 rounded-md text-gray-600">
                     Not yet determined.
                 </p>
             )}
        </div>
    </aside>
  );
};

export default TestingSummaryPanel;