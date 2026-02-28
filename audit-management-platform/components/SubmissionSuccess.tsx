
import React from 'react';
import type { ControlConclusion, TestingSummary } from '../types';
import { CheckCircleIcon } from './icons/Icons';

interface SubmissionSuccessProps {
    controlName: string;
    engagementName: string;
    conclusion: ControlConclusion;
    summary: TestingSummary;
    onReturn: () => void;
}

const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({ controlName, engagementName, conclusion, summary, onReturn }) => {
    const isEffective = conclusion === 'Effective';

    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] bg-white rounded-lg border border-gray-200 p-8 text-center">
            <CheckCircleIcon className="h-20 w-20 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Submission Complete</h2>
            <p className="mt-2 text-base text-gray-600">
                You have successfully submitted the testing for <span className="font-semibold text-gray-800">{controlName}</span>.
            </p>
            <p className="text-sm text-gray-500">
                Engagement: {engagementName}
            </p>

            <div className={`mt-8 p-6 rounded-lg w-full max-w-md ${isEffective ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Final Conclusion</h3>
                <p className={`mt-2 text-3xl font-bold ${isEffective ? 'text-green-700' : 'text-red-700'}`}>
                    Control is {conclusion}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4 text-left">
                    <div>
                        <p className="text-sm text-gray-600">Samples Passed</p>
                        <p className="text-lg font-semibold text-gray-800">{summary.passed}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-600">Samples Failed</p>
                        <p className={`text-lg font-semibold ${summary.failed > 0 ? 'text-red-600' : 'text-gray-800'}`}>{summary.failed}</p>
                    </div>
                </div>
            </div>

            <button
                onClick={onReturn}
                className="mt-10 rounded-md bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                Return to Engagement Workspace
            </button>
        </div>
    );
};

export default SubmissionSuccess;
