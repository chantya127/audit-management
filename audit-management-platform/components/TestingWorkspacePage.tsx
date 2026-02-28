import React, { useState, useMemo, useCallback } from "react";
import type {
  EngagementControl,
  Engagement,
  ControlFullDetail,
  AllSamplesResultsState,
  TestScriptRule,
  AuditorOverride,
  SampleFinalStatus,
  SystemResult,
  TestingSummary,
  ControlConclusion,
  RuleExecutionResult,
  RuleLogic,
  TestingResult,
} from "../types";
import { detailedControlData } from "../constants";
import SampleNavigator from "./SampleNavigator";
import TestingSummaryPanel from "./TestingSummary";
import Toast from "./Toast";
import TestingPanel from "./TestingPanel";
import { ChevronRightIcon, UploadIcon, InfoCircleIcon } from "./icons/Icons";

// --- HELPER & SUB-COMPONENTS (scoped to this file) ---

const RuleLogicTooltip: React.FC<{ logic: RuleLogic }> = ({ logic }) => {
  return (
    <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded-md p-2 w-64 z-10 -mt-24 -ml-4 shadow-lg">
      <h4 className="font-bold mb-1">Rule Logic</h4>
      <div className="font-mono bg-gray-700 p-1.5 rounded text-gray-300">
        <div>
          <span className="text-cyan-400">field:</span> "{logic.fieldName}"
        </div>
        <div>
          <span className="text-cyan-400">operator:</span> "{logic.operator}"
        </div>
        <div>
          <span className="text-cyan-400">expected:</span>{" "}
          <span className="text-orange-300">{String(logic.expectedValue)}</span>
        </div>
        {logic.referenceField && (
          <div>
            <span className="text-cyan-400">reference:</span> "
            {logic.referenceField}"
          </div>
        )}
      </div>
    </div>
  );
};

const TestScriptHeader: React.FC<{
  control: EngagementControl;
  controlDetails: ControlFullDetail;
}> = ({ control, controlDetails }) => (
  <div className="mb-6">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-2">
          Control & Test Script Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
          <div className="font-medium text-gray-500">Control ID:</div>
          <div className="text-gray-900 font-semibold">{control.controlId}</div>
          <div className="font-medium text-gray-500">Control Name:</div>
          <div className="col-span-2 text-gray-900">{control.controlName}</div>
          {controlDetails.testScript && (
            <>
              <div className="font-medium text-gray-500">Process:</div>
              <div className="text-gray-900">{control.process || "N/A"}</div>
              <div className="font-medium text-gray-500">Frequency:</div>
              <div className="text-gray-900">{control.frequency || "N/A"}</div>
              <div className="font-medium text-gray-500">Test Script Ver:</div>
              <div className="text-gray-900">
                {controlDetails.testScript?.version || "N/A"}
              </div>
              <div className="font-medium text-gray-500">Generated Date:</div>
              <div className="text-gray-900">
                {controlDetails.testScript?.generatedDate || "N/A"}
              </div>
            </>
          )}
        </div>
      </div>
      {controlDetails.testScript && (
        <div className="flex gap-2">
          <button
            onClick={() =>
              window.open("/Sample-Test-Script-Cash-and-Bank.xlsx", "_blank")
            }
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            View Test Script
          </button>
          <button
            onClick={() => {
              const a = document.createElement("a");
              a.href = "/Sample-Test-Script-Cash-and-Bank.xlsx";
              a.download = "Sample 1 Test script - Cash and Bank.xlsx";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Download Test Script
          </button>
        </div>
      )}
    </div>
  </div>
);

const SampleData: React.FC<{ recordData: Record<string, any> }> = ({
  recordData,
}) => (
  <div className="mb-6">
    <h3 className="text-base font-semibold text-gray-800 mb-3">Sample Data</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3 text-sm p-4 border border-gray-200 rounded-lg bg-gray-50">
      {Object.entries(recordData).map(([key, value]) => (
        <div key={key}>
          <dt className="font-medium text-gray-500 capitalize truncate">
            {key.replace(/([A-Z])/g, " $1")}
          </dt>
          <dd className="text-gray-900 font-semibold truncate">
            {String(value ?? "null")}
          </dd>
        </div>
      ))}
    </div>
  </div>
);

const RuleEvaluationTable: React.FC<{
  rules: TestScriptRule[];
  executionResults: Record<number, RuleExecutionResult>;
  auditorInputs: Record<
    number,
    { override: AuditorOverride; comment: string; evidence: string }
  >;
  onUpdate: (ruleId: number, newResultData: any) => void;
  isLocked: boolean;
}> = ({ rules, executionResults, auditorInputs, onUpdate, isLocked }) => (
  <div>
    <h3 className="text-base font-semibold text-gray-800 mb-3">
      Rule Evaluation
    </h3>
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 w-1/3">
              Rule Name
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              System Result
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Auditor Override
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 w-1/4">
              Comments
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Evidence
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rules.map((rule) => {
            const systemResult =
              executionResults[rule.id]?.systemResult || "NOT_APPLICABLE";
            const { override, comment, evidence } = auditorInputs[rule.id] || {
              override: null,
              comment: "",
              evidence: "",
            };
            const currentOverride = override || systemResult;
            const isOverridden = override !== null && override !== systemResult;

            return (
              <tr key={rule.id} className={isOverridden ? "bg-yellow-50" : ""}>
                <td className="px-4 py-3 text-sm text-gray-800 group relative">
                  <InfoCircleIcon className="h-4 w-4 inline-block mr-2 text-gray-400" />
                  {rule.description}
                  <RuleLogicTooltip logic={rule.logic} />
                </td>
                <td className="px-4 py-3 text-sm font-semibold">
                  <span
                    className={
                      systemResult === "PASS"
                        ? "text-green-600"
                        : systemResult === "FAIL"
                          ? "text-red-600"
                          : "text-gray-500"
                    }
                  >
                    {systemResult === "NOT_APPLICABLE" ? "N/A" : systemResult}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={currentOverride}
                    onChange={(e) =>
                      onUpdate(rule.id, { override: e.target.value })
                    }
                    disabled={isLocked}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                  >
                    <option value="PASS">PASS</option>
                    <option value="FAIL">FAIL</option>
                    <option value="NOT_APPLICABLE">N/A</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <textarea
                    rows={1}
                    value={comment}
                    onChange={(e) =>
                      onUpdate(rule.id, { comment: e.target.value })
                    }
                    disabled={isLocked}
                    className="block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                  />
                </td>
                <td className="px-4 py-3 text-sm">
                  {evidence ? (
                    <span className="text-indigo-600 text-xs font-semibold truncate">
                      {evidence}
                    </span>
                  ) : (
                    <label
                      className={`inline-block ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <input
                        type="file"
                        className="hidden"
                        disabled={isLocked}
                        onChange={(e) =>
                          onUpdate(rule.id, {
                            evidence: e.target.files
                              ? e.target.files[0].name
                              : "",
                          })
                        }
                      />
                      <UploadIcon
                        className={`h-5 w-5 ${isLocked ? "text-gray-300" : "text-gray-500 hover:text-indigo-600"}`}
                      />
                    </label>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

const TestingWorkspacePage: React.FC<{
  control: EngagementControl;
  engagement: Engagement;
  onExit: (c?: EngagementControl) => void;
}> = ({ control, engagement, onExit }) => {
  const controlDetails: ControlFullDetail | undefined = useMemo(
    () => detailedControlData[control.controlId],
    [control.controlId],
  );

  const isDynamicTestScript = !!controlDetails?.testScript;

  const [resultsState, setResultsState] = useState<AllSamplesResultsState>(
    () => {
      const initialState: AllSamplesResultsState = {};
      if (controlDetails && isDynamicTestScript) {
        controlDetails.samples.forEach((sample) => {
          initialState[sample.sampleId] = {};
          controlDetails.testScript?.rules.forEach((rule) => {
            initialState[sample.sampleId][rule.id] = {
              override: null,
              comment: "",
              evidence: "",
            };
          });
        });
      }
      return initialState;
    },
  );

  const [legacyResultsState, setLegacyResultsState] = useState<
    Record<string, Record<number, TestingResult>>
  >(() => {
    const initialState: Record<string, Record<number, TestingResult>> = {};
    if (controlDetails && !isDynamicTestScript && controlDetails.attributes) {
      controlDetails.samples.forEach((sample) => {
        initialState[sample.sampleId] = {};
        controlDetails.attributes!.forEach((attr) => {
          initialState[sample.sampleId][attr.attributeId] = {
            auditorResult: undefined,
            comment: "",
            evidence: "",
          };
        });
      });
    }
    return initialState;
  });

  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
  const [overallStatus, setOverallStatus] = useState<
    "In Progress" | "Submitted"
  >("In Progress");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [finalSampleDecisions, setFinalSampleDecisions] = useState<
    Record<string, AuditorOverride>
  >({});

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const evaluateRule = useCallback(
    (sample: any, rule: TestScriptRule): RuleExecutionResult => {
      const actualValue = sample.recordData[rule.logic.fieldName];
      if (actualValue === undefined || actualValue === null) {
        return {
          systemResult: "NOT_APPLICABLE",
          evaluatedValue: actualValue,
          expectedValue: rule.logic.expectedValue,
        };
      }
      let pass = false;
      switch (rule.logic.operator) {
        case "===":
          pass = actualValue === rule.logic.expectedValue;
          break;
        // Add more operators as needed
        default:
          pass = false;
      }
      return {
        systemResult: pass ? "PASS" : "FAIL",
        evaluatedValue: actualValue,
        expectedValue: rule.logic.expectedValue,
      };
    },
    [],
  );

  const getDynamicSampleFinalStatus = useCallback(
    (sampleId: string): SampleFinalStatus => {
      const sample = controlDetails?.samples.find(
        (s) => s.sampleId === sampleId,
      );
      const rules = controlDetails?.testScript?.rules;
      if (!sample || !rules) return "NOT TESTED";

      const finalAuditorDecision = finalSampleDecisions[sampleId];
      if (finalAuditorDecision) return finalAuditorDecision;

      const sampleResults = resultsState[sampleId];
      if (!sampleResults || rules.some((rule) => !sampleResults[rule.id]))
        return "NOT TESTED";

      let isFail = false;
      let isOverridden = false;
      let allNotApplicable = true;
      for (const rule of rules) {
        const { systemResult } = evaluateRule(sample, rule);
        const auditorOverride = sampleResults[rule.id]?.override;
        if (auditorOverride !== null && auditorOverride !== systemResult)
          isOverridden = true;

        const effectiveResult =
          auditorOverride !== null ? auditorOverride : systemResult;
        if (effectiveResult === "FAIL") {
          isFail = true;
          break;
        }
        if (effectiveResult !== "NOT_APPLICABLE") {
          allNotApplicable = false;
        }
      }

      if (isFail) return "FAIL";
      if (allNotApplicable) return "NOT_APPLICABLE";
      if (isOverridden) return "OVERRIDDEN";
      return "PASS";
    },
    [controlDetails, resultsState, finalSampleDecisions, evaluateRule],
  );

  const getLegacySampleFinalStatus = useCallback(
    (sampleId: string): SampleFinalStatus => {
      const sample = controlDetails?.samples.find(
        (s) => s.sampleId === sampleId,
      );
      const attributes = controlDetails?.attributes;
      if (!sample || !attributes) return "NOT TESTED";

      const sampleResults = legacyResultsState[sampleId];
      if (
        !sampleResults ||
        attributes.some((attr) => !sampleResults[attr.attributeId])
      )
        return "NOT TESTED";

      let allNotApplicable = true;
      const hasFailure = attributes.some((attr) => {
        const result = sampleResults[attr.attributeId];
        const auditorResult = result.auditorResult;

        const systemResult = attr.ruleLogic(sample);
        const effectiveResult =
          auditorResult !== undefined
            ? auditorResult
            : systemResult
              ? "Pass"
              : "Fail";

        if (effectiveResult !== "Not Applicable") {
          allNotApplicable = false;
        }

        if (effectiveResult === "Fail") return true;
        return false;
      });

      if (hasFailure) return "FAIL";
      if (allNotApplicable) return "NOT_APPLICABLE";
      return "PASS";
    },
    [controlDetails, legacyResultsState],
  );

  const sampleStatuses = useMemo(() => {
    const statuses: Record<string, SampleFinalStatus> = {};
    if (!controlDetails) return statuses;

    const statusFn = isDynamicTestScript
      ? getDynamicSampleFinalStatus
      : getLegacySampleFinalStatus;

    controlDetails.samples.forEach((s) => {
      statuses[s.sampleId] = statusFn(s.sampleId);
    });
    return statuses;
  }, [
    controlDetails,
    isDynamicTestScript,
    getDynamicSampleFinalStatus,
    getLegacySampleFinalStatus,
  ]);

  const summary: TestingSummary = useMemo(() => {
    const statuses = Object.values(sampleStatuses);
    const total = statuses.length;
    const notTested = statuses.filter((s) => s === "NOT TESTED").length;
    const tested = total - notTested;
    const failed = statuses.filter((s) => s === "FAIL").length;
    const notApplicable = statuses.filter((s) => s === "NOT_APPLICABLE").length;
    const passed = tested - failed - notApplicable;
    return { total, tested, passed, failed, notApplicable, notTested };
  }, [sampleStatuses]);

  const handleUpdateRuleResult = (ruleId: number, newResultData: any) => {
    const sampleId = controlDetails!.samples[currentSampleIndex].sampleId;
    setResultsState((prev) => ({
      ...prev,
      [sampleId]: {
        ...prev[sampleId],
        [ruleId]: { ...prev[sampleId][ruleId], ...newResultData },
      },
    }));
  };

  const handleUpdateLegacyResult = (
    sampleId: string,
    attributeId: number,
    newResultData: Partial<TestingResult>,
  ) => {
    setLegacyResultsState((prev) => ({
      ...prev,
      [sampleId]: {
        ...prev[sampleId],
        [attributeId]: {
          ...(prev[sampleId]?.[attributeId] || {}),
          ...newResultData,
        },
      },
    }));
  };

  const handleSubmitForReview = () => {
    if (summary.notTested > 0) {
      alert("All samples must be tested before submitting for review.");
      return;
    }
    if (
      window.confirm(
        "Are you sure you want to submit for review? This action will lock testing.",
      )
    ) {
      const finalConclusion: ControlConclusion =
        summary.failed / summary.total > 0.1 ? "Ineffective" : "Effective";
      const updatedControl: EngagementControl = {
        ...control,
        status: "Pending Review",
        conclusion: finalConclusion,
        samplesTested: `${summary.tested}/${summary.total}`,
        exceptions: summary.failed,
        // FIX: Removed redundant .replace() call.
        lastUpdated: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        submittedBy: "Aarav Mehta",
        // FIX: Removed redundant .replace() call which was causing a runtime error.
        submittedOn: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      };
      setOverallStatus("Submitted");
      showToast("Control submitted for review.");
      setTimeout(() => onExit(updatedControl), 500);
    }
  };

  if (
    !controlDetails ||
    (!controlDetails.testScript && !controlDetails.attributes)
  ) {
    return (
      <div className="p-8 text-center">
        Error: Control details or test script/attributes not found for this
        control.
      </div>
    );
  }

  const currentSample = controlDetails.samples[currentSampleIndex];

  const currentSampleExecutionResults = useMemo(
    () =>
      isDynamicTestScript
        ? controlDetails.testScript!.rules.reduce(
            (acc, rule) => {
              acc[rule.id] = evaluateRule(currentSample, rule);
              return acc;
            },
            {} as Record<number, RuleExecutionResult>,
          )
        : {},
    [isDynamicTestScript, controlDetails, currentSample, evaluateRule],
  );

  const systemDeterminedResult = useMemo(() => {
    if (!isDynamicTestScript) return "N/A";
    const results = Object.values(currentSampleExecutionResults);
    if (results.some((r) => r.systemResult === "FAIL")) return "FAIL";
    if (
      results.length > 0 &&
      results.every((r) => r.systemResult === "NOT_APPLICABLE")
    )
      return "NOT_APPLICABLE";
    return "PASS";
  }, [isDynamicTestScript, currentSampleExecutionResults]);

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white rounded-lg border border-gray-200 shadow-sm">
      <header className="flex-shrink-0 p-4 border-b border-gray-200">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <button onClick={() => onExit()} className="hover:text-gray-900">
            Engagement
          </button>
          <ChevronRightIcon className="h-4 w-4 mx-1" />
          <span className="font-medium text-gray-800">Perform Testing</span>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {control.controlId}: {control.controlName}
          </h2>
          <div className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
            Sample{" "}
            <span className="text-indigo-600">{currentSampleIndex + 1}</span> of{" "}
            {summary.total}
          </div>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        <SampleNavigator
          samples={controlDetails.samples}
          statuses={sampleStatuses}
          currentIndex={currentSampleIndex}
          onSelect={setCurrentSampleIndex}
        />

        <main className="flex-grow p-6 overflow-y-auto">
          <TestScriptHeader control={control} controlDetails={controlDetails} />
          {isDynamicTestScript ? (
            <>
              <SampleData recordData={currentSample.recordData} />
              <RuleEvaluationTable
                rules={controlDetails.testScript!.rules}
                executionResults={currentSampleExecutionResults}
                auditorInputs={resultsState[currentSample.sampleId]}
                onUpdate={handleUpdateRuleResult}
                isLocked={overallStatus === "Submitted"}
              />
              <div className="mt-6 p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Final Sample Result
                  </h4>
                  <p className="text-sm text-gray-500">
                    System Determined Result:{" "}
                    <span
                      className={`font-bold ${systemDeterminedResult === "PASS" ? "text-green-600" : systemDeterminedResult === "FAIL" ? "text-red-600" : "text-gray-500"}`}
                    >
                      {systemDeterminedResult === "NOT_APPLICABLE"
                        ? "N/A"
                        : systemDeterminedResult}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="finalDecision"
                    className="text-sm font-medium"
                  >
                    Auditor Final Decision:
                  </label>
                  <select
                    id="finalDecision"
                    value={finalSampleDecisions[currentSample.sampleId] || ""}
                    onChange={(e) =>
                      setFinalSampleDecisions((prev) => ({
                        ...prev,
                        [currentSample.sampleId]: e.target
                          .value as AuditorOverride,
                      }))
                    }
                    disabled={overallStatus === "Submitted"}
                    className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                  >
                    <option value="">System</option>
                    <option value="PASS">PASS</option>
                    <option value="FAIL">FAIL</option>
                    <option value="NOT_APPLICABLE">N/A</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <TestingPanel
              sample={currentSample}
              attributes={controlDetails.attributes!}
              results={legacyResultsState[currentSample.sampleId] || {}}
              onUpdate={handleUpdateLegacyResult}
              isLocked={overallStatus === "Submitted"}
            />
          )}
        </main>

        <TestingSummaryPanel summary={summary} />
      </div>

      <footer className="flex-shrink-0 p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentSampleIndex((i) => i - 1)}
            disabled={currentSampleIndex === 0}
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous Sample
          </button>
          <button
            onClick={() => setCurrentSampleIndex((i) => i + 1)}
            disabled={currentSampleIndex === summary.total - 1}
            className="rounded-md bg-white px-4 py-2 text-sm font-bold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            Next Sample
          </button>
        </div>
        <button
          onClick={handleSubmitForReview}
          disabled={
            summary.notTested > 0 ||
            overallStatus === "Submitted" ||
            engagement.status !== "IN PROGRESS"
          }
          className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          Submit for Review
        </button>
      </footer>
      <Toast message={toastMessage} />
    </div>
  );
};

export default TestingWorkspacePage;
