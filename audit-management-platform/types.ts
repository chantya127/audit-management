

export interface RACM {
  id: number;
  name: string;
  framework: string;
  financialYear: string;
  version: string;
  status: 'Active' | 'Draft' | 'Archived';
  locked: boolean;
  linkedEngagements: number;
  lastUpdated: string;
  owner: string;
}

export type SortDirection = 'ascending' | 'descending';

export type SortKey = keyof RACM | '';

export interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

export type SummaryFilter = 'Active' | 'Draft' | 'Locked' | 'Linked to Engagement';

export type AssertionType = 'Existence' | 'Completeness' | 'Accuracy' | 'Valuation' | 'Cut-off';

export type RACMStatus = 'Draft' | 'Validated' | 'Locked';

export interface RACMDetail {
  id: number;
  riskId: string;
  riskDescription: string;
  assertion: AssertionType | '';
  controlName: string;
  controlDescription: string;
  key: boolean;
}

export type RACMDetailSortKey = keyof RACMDetail;

export type ValidationErrors = Record<number, Partial<Record<keyof Omit<RACMDetail, 'id' | 'key'>, string>>>;


// Engagement Types
// FIX: Added 'PLANNING' to EngagementStatus to allow its use for new engagements.
export type EngagementStatus = "NOT STARTED" | "IN PROGRESS" | "UNDER REVIEW" | "CLOSED" | "PLANNING";
export type EngagementType = "SOX" | "Internal Audit" | "Operational" | "IT Audit" | "Compliance";

export interface Engagement {
  id: number;
  name: string;
  type: EngagementType | string; // Allow string for future flexibility
  period: string;
  totalDeficiencies: number;
  status: EngagementStatus;
  linkedRacmName?: string;
  leadPartner?: string;
  // FIX: Added optional description property to align with its usage in the CreateEngagementModal form.
  description?: string;
}

export type NewEngagementData = Omit<Engagement, 'id' | 'totalDeficiencies' | 'status' | 'period'> & {
    periodStart: string;
    periodEnd: string;
    linkedRacmId?: number;
};

export type EngagementSortKey = keyof Engagement | '';

export interface EngagementSortConfig {
  key: EngagementSortKey;
  direction: SortDirection;
}

export type EngagementSummaryFilter = "Total Active" | "Completed (YTD)" | "Open Deficiencies" | "Under Review";

export interface EngagementFilters {
    types: string[];
    statuses: EngagementStatus[];
    periods: string[];
}


// Engagement Workspace Types
export type ControlStatus = 'Concluded' | 'In Testing' | 'Not Started' | 'Pending Review' | 'Planning';
export type ControlConclusion = 'Effective' | 'Ineffective';

export interface EngagementControl {
  id: number;
  controlId: string;
  controlName: string;
  domain: string;
  key: boolean;
  status: ControlStatus;
  samplesTested: string;
  exceptions: number;
  conclusion: ControlConclusion | null;
  lastUpdated: string;
  submittedBy?: string;
  submittedOn?: string;
  // NEW properties for Test Script info
  process?: string;
  frequency?: string;
}

export type EngagementControlSortKey = keyof EngagementControl | '';

export interface EngagementControlSortConfig {
    key: EngagementControlSortKey;
    direction: SortDirection;
}

export type EngagementControlSummaryFilter = 'Key Controls' | 'In Progress' | 'Pending Review' | 'Concluded' | 'Deficient';

// Control Detail Panel Types
export interface ControlOverview {
    controlId: string;
    controlName: string;
    description: string;
    classification: string;
    assertions: string[];
}

export type SampleRecord = Record<string, any>;

export interface PopulationSnapshot {
    snapshotId: string;
    datasetName: string;
    recordCount: number;
    uploadedBy: string;
    uploadDate: string;
    status: 'Frozen' | 'Active';
}

// NEW types for dynamic testing
export type SystemResult = 'PASS' | 'FAIL' | 'NOT_APPLICABLE';
export type AuditorOverride = 'PASS' | 'FAIL' | 'NOT_APPLICABLE' | null;
export type SampleFinalStatus = 'PASS' | 'FAIL' | 'NOT_APPLICABLE' | 'OVERRIDDEN' | 'NOT TESTED';

export interface RuleLogic {
    fieldName: string;
    operator: string;
    expectedValue: any;
    referenceField?: string;
}

export interface TestScriptRule {
    id: number;
    name: string;
    description: string;
    type: 'Completeness' | 'Accuracy' | 'Validity' | 'Custom';
    logic: RuleLogic;
}

export interface TestScript {
    version: string;
    generatedDate: string;
    rules: TestScriptRule[];
}

// FIX: Added TestScriptAttribute to properly type legacy control attributes.
export interface TestScriptAttribute {
  attributeId: number;
  name: string;
  mandatory: boolean;
  ruleLogic: (sample: any) => boolean;
}

export interface ControlFullDetail {
    overview: ControlOverview;
    testScript?: TestScript; // NEW, replacing attributes
    // FIX: Changed attributes from any[] to TestScriptAttribute[] for type safety.
    attributes?: TestScriptAttribute[]; // Keep for backward compatibility with other controls
    snapshot: PopulationSnapshot | null;
    samples: SampleRecord[];
}

// Testing Workspace Types
// FIX: Added AuditorResult and TestingResult types for use in the legacy TestingPanel component.
export type AuditorResult = 'Pass' | 'Fail' | 'Not Applicable';

export interface TestingResult {
    auditorResult?: AuditorResult;
    comment?: string;
    evidence?: string;
}

export interface AuditorRuleInput {
    override: AuditorOverride;
    comment: string;
    evidence: string;
}
export type AllSamplesResultsState = Record<string, Record<number, AuditorRuleInput>>; // sampleId -> ruleId -> AuditorRuleInput

export interface RuleExecutionResult {
    systemResult: SystemResult;
    evaluatedValue: any;
    expectedValue: any;
}


export interface TestingSummary {
    total: number;
    tested: number;
    passed: number;
    failed: number;
    notApplicable: number;
    notTested: number;
}

// Reviewer Workspace Types
export interface AuditTrailEntry {
    date: string;
    user: string;
    action: string;
    details?: string;
}