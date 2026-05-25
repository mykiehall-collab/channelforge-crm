import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ValidationSeverity = "info" | "warning" | "high-risk" | "critical";
export type AuditSeverity = "Info" | "Warning" | "High Risk" | "Critical";

export type CheckType =
  | "hierarchy-integrity"
  | "user-visibility-scope"
  | "edit-right-appropriateness"
  | "cross-org-isolation"
  | "dashboard-visibility"
  | "territory-conflict"
  | "account-exposure"
  | "org-boundary-violation"
  | "role-permission-mismatch"
  | "inheritance-anomaly"
  | "stale-access"
  | "self-approval-risk"
  | "pricing-field-exposure"
  | "financial-reporting-access"
  | "reseller-territory-conflict"
  | "distributor-vendor-leak"
  | "leadership-edit-anomaly"
  | "secondary-admin-escalation"
  | "external-link-permission"
  | "ai-governance-access"
  | "renewal-ownership-gap"
  | "department-visibility-leak";

export interface ValidationFinding {
  id: string;
  checkType: CheckType;
  severity: ValidationSeverity;
  title: string;
  description: string;
  affectedUser?: string;
  affectedAccount?: string;
  affectedOrg?: string;
  category: string;
  passFail: "pass" | "fail";
  recommendation: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  affectedUser: string;
  affectedAccount: string;
  organization: string;
  permissionImpacted: string;
  severity: AuditSeverity;
  actionTaken: string;
  adminResponsible: string;
}

export interface AuditLogFilters {
  user: string;
  account: string;
  territory: string;
  orgType: string;
  warningType: string;
  dateRange: { from: string; to: string };
  severity: string;
  admin: string;
}

export interface AccountAccessTraceResult {
  userId: string;
  name: string;
  orgType: string;
  role: string;
  department: string;
  territory: string;
  visibilityReason:
    | "Direct Owner"
    | "Territory Visibility"
    | "Department Inheritance"
    | "Reseller Relationship"
    | "Distributor Governance"
    | "Leadership Visibility";
  editRights: boolean;
  accessType: "direct" | "inherited";
  initials: string;
}

export interface HierarchyNode {
  id: string;
  name: string;
  type: "Vendor" | "Distributor" | "Reseller" | "Customer";
  children: HierarchyNode[];
}

export interface HierarchyLeak {
  userId: string;
  userName: string;
  orgType: string;
  leakedTo: string;
  leakType: string;
  severity: ValidationSeverity;
}

export interface HierarchyValidationResult {
  tree: HierarchyNode;
  leaks: HierarchyLeak[];
  crossOrgExposureRisks: string[];
}

export interface FieldPermissionMatrix {
  fieldName: string;
  canView: boolean;
  canEdit: boolean;
}

export interface ModulePermission {
  moduleId: string;
  moduleName: string;
  canView: boolean;
  canEdit: boolean;
}

export interface EffectivePermissions {
  userId: string;
  userName: string;
  role: string;
  orgType: string;
  fieldMatrix: FieldPermissionMatrix[];
  modulePermissions: ModulePermission[];
  isOverexposed: boolean;
  overexposedFields: string[];
  overexposedModules: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AUDIT_LOG_STORAGE_KEY = "cf_security_audit_log";

const ALL_CHECK_TYPES: CheckType[] = [
  "hierarchy-integrity",
  "user-visibility-scope",
  "edit-right-appropriateness",
  "cross-org-isolation",
  "dashboard-visibility",
  "territory-conflict",
  "account-exposure",
  "org-boundary-violation",
  "role-permission-mismatch",
  "inheritance-anomaly",
  "stale-access",
  "self-approval-risk",
  "pricing-field-exposure",
  "financial-reporting-access",
  "reseller-territory-conflict",
  "distributor-vendor-leak",
  "leadership-edit-anomaly",
  "secondary-admin-escalation",
  "external-link-permission",
  "ai-governance-access",
  "renewal-ownership-gap",
  "department-visibility-leak",
];

const ACCOUNT_FIELDS = [
  "accountName",
  "customerDomain",
  "customerIdNumber",
  "internalNotes",
  "resellerOwnerId",
  "vendorOwnerId",
  "contractType",
  "estimatedRenewalValue",
  "licenceQuantity",
  "products",
  "status",
  "externalNotes",
  "pricingData",
  "territoryMapping",
  "campaignData",
  "forecastingData",
  "renewalDates",
];

const FOUNDRY_MODULES = [
  { id: "infrastructure-compute", name: "Infrastructure & Compute" },
  { id: "access-governance", name: "Access Governance" },
  { id: "account-governance", name: "Account Governance" },
  { id: "external-channel-links", name: "External Channel Links" },
  { id: "credit-usage-insights", name: "Credit Usage Insights" },
  { id: "report-builder", name: "Report Builder" },
  { id: "dashboard-manager", name: "Dashboard Manager" },
  { id: "forge-ai", name: "ForgeAI" },
];

// ─── Dummy user database for tracing ──────────────────────────────────────────

interface DummyUser {
  userId: string;
  name: string;
  orgType: string;
  role: string;
  department: string;
  territory: string;
  assignedAccounts: string[];
  editAccounts: string[];
}

const DUMMY_USERS: DummyUser[] = [
  {
    userId: "usr-001",
    name: "James Harrington",
    orgType: "Vendor",
    role: "Primary Admin",
    department: "Leadership",
    territory: "Global",
    assignedAccounts: [
      "Desperado",
      "Nordic Energy Group",
      "Global Pharma Holdings",
      "UK Education Trust",
      "City Infrastructure Authority",
    ],
    editAccounts: [
      "Desperado",
      "Nordic Energy Group",
      "Global Pharma Holdings",
      "UK Education Trust",
      "City Infrastructure Authority",
    ],
  },
  {
    userId: "usr-002",
    name: "Sarah Chen",
    orgType: "Vendor",
    role: "Secondary Admin",
    department: "Sales Operations",
    territory: "EMEA",
    assignedAccounts: ["Desperado", "Nordic Energy Group", "EuroRetail Group"],
    editAccounts: ["Desperado", "Nordic Energy Group"],
  },
  {
    userId: "usr-003",
    name: "Marcus Okafor",
    orgType: "Vendor",
    role: "Sales Rep",
    department: "Sales",
    territory: "EMEA",
    assignedAccounts: ["Desperado", "Nordic Energy Group"],
    editAccounts: ["Desperado"],
  },
  {
    userId: "usr-004",
    name: "Elena Volkov",
    orgType: "Vendor",
    role: "Account Manager",
    department: "Sales",
    territory: "Nordics",
    assignedAccounts: ["Nordic Energy Group", "Northern Telecom Networks"],
    editAccounts: ["Nordic Energy Group", "Northern Telecom Networks"],
  },
  {
    userId: "usr-005",
    name: "David Kim",
    orgType: "Vendor",
    role: "Renewal Specialist",
    department: "Customer Success",
    territory: "Global",
    assignedAccounts: [
      "Desperado",
      "Global Pharma Holdings",
      "Apex Financial Services",
    ],
    editAccounts: [
      "Desperado",
      "Global Pharma Holdings",
      "Apex Financial Services",
    ],
  },
  {
    userId: "usr-006",
    name: "Amara Johnson",
    orgType: "Vendor",
    role: "Marketing User",
    department: "Marketing",
    territory: "Global",
    assignedAccounts: [
      "Desperado",
      "EuroRetail Group",
      "Horizon Manufacturing",
    ],
    editAccounts: ["Desperado", "EuroRetail Group", "Horizon Manufacturing"],
  },
  {
    userId: "usr-007",
    name: "Liam O'Brien",
    orgType: "Distributor",
    role: "Primary Admin",
    department: "Leadership",
    territory: "EMEA",
    assignedAccounts: [
      "Desperado",
      "Nordic Energy Group",
      "UK Education Trust",
      "City Infrastructure Authority",
    ],
    editAccounts: [
      "Desperado",
      "Nordic Energy Group",
      "UK Education Trust",
      "City Infrastructure Authority",
    ],
  },
  {
    userId: "usr-008",
    name: "Ingrid Svensson",
    orgType: "Distributor",
    role: "Sales Operations",
    department: "Sales Operations",
    territory: "Nordics",
    assignedAccounts: ["Nordic Energy Group", "Northern Telecom Networks"],
    editAccounts: ["Nordic Energy Group"],
  },
  {
    userId: "usr-009",
    name: "Raj Patel",
    orgType: "Reseller",
    role: "Primary Admin",
    department: "Leadership",
    territory: "UK",
    assignedAccounts: [
      "Desperado",
      "UK Education Trust",
      "Apex Financial Services",
    ],
    editAccounts: ["Desperado", "UK Education Trust"],
  },
  {
    userId: "usr-010",
    name: "Hannah Müller",
    orgType: "Reseller",
    role: "Account Manager",
    department: "Sales",
    territory: "DACH",
    assignedAccounts: ["Global Pharma Holdings", "EuroRetail Group"],
    editAccounts: ["Global Pharma Holdings"],
  },
  {
    userId: "usr-011",
    name: "Sofia Martínez",
    orgType: "Vendor",
    role: "Sales Rep",
    department: "Sales",
    territory: "EMEA",
    assignedAccounts: ["Desperado", "EuroRetail Group"],
    editAccounts: ["Desperado"],
  },
  {
    userId: "usr-012",
    name: "Tom Whitfield",
    orgType: "Vendor",
    role: "Marketing Manager",
    department: "Marketing",
    territory: "Global",
    assignedAccounts: ["Desperado", "Horizon Manufacturing"],
    editAccounts: ["Desperado", "Horizon Manufacturing"],
  },
  {
    userId: "usr-013",
    name: "Priya Okoye",
    orgType: "Vendor",
    role: "Business Analyst",
    department: "Sales Operations",
    territory: "Global",
    assignedAccounts: [
      "Desperado",
      "Nordic Energy Group",
      "Global Pharma Holdings",
      "City Infrastructure Authority",
    ],
    editAccounts: ["Desperado", "Nordic Energy Group"],
  },
  {
    userId: "usr-014",
    name: "Lars Hansen",
    orgType: "Vendor",
    role: "Regional Sales Lead",
    department: "Sales",
    territory: "Nordics",
    assignedAccounts: ["Nordic Energy Group", "Northern Telecom Networks"],
    editAccounts: ["Nordic Energy Group", "Northern Telecom Networks"],
  },
  {
    userId: "usr-015",
    name: "Emma Clarke",
    orgType: "Vendor",
    role: "Account Executive",
    department: "Sales",
    territory: "UK",
    assignedAccounts: ["Desperado", "UK Education Trust"],
    editAccounts: ["Desperado", "UK Education Trust"],
  },
  {
    userId: "usr-016",
    name: "Daniel Park",
    orgType: "Vendor",
    role: "IT Engineer",
    department: "IT",
    territory: "Global",
    assignedAccounts: [
      "Desperado",
      "Nordic Energy Group",
      "Global Pharma Holdings",
    ],
    editAccounts: [],
  },
  {
    userId: "usr-017",
    name: "Rachel Moore",
    orgType: "Vendor",
    role: "Channel Partner Manager",
    department: "Channel",
    territory: "EMEA",
    assignedAccounts: ["Desperado", "EuroRetail Group"],
    editAccounts: ["Desperado"],
  },
  {
    userId: "usr-018",
    name: "Chris Webb",
    orgType: "Vendor",
    role: "Sales Rep",
    department: "Sales",
    territory: "UK",
    assignedAccounts: ["UK Education Trust", "City Infrastructure Authority"],
    editAccounts: ["UK Education Trust"],
  },
  {
    userId: "usr-019",
    name: "Fatima Al-Rashid",
    orgType: "Distributor",
    role: "Secondary Admin",
    department: "Sales Operations",
    territory: "EMEA",
    assignedAccounts: ["Desperado", "Nordic Energy Group", "EuroRetail Group"],
    editAccounts: ["Desperado", "Nordic Energy Group"],
  },
  {
    userId: "usr-020",
    name: "Jens Bergström",
    orgType: "Reseller",
    role: "Sales Rep",
    department: "Sales",
    territory: "Nordics",
    assignedAccounts: ["Nordic Energy Group", "Northern Telecom Networks"],
    editAccounts: ["Nordic Energy Group"],
  },
];

// ─── Pre-seeded findings ──────────────────────────────────────────────────────

function generateInitialFindings(): ValidationFinding[] {
  return [
    {
      id: "vf-001",
      checkType: "edit-right-appropriateness",
      severity: "high-risk",
      title: "User has edit rights outside assigned territory",
      description:
        "Marcus Okafor (Sales Rep, EMEA) has edit access to Desperado but the account is primarily assigned to the Nordics territory. This creates a territory overlap conflict.",
      affectedUser: "Marcus Okafor",
      affectedAccount: "Desperado",
      affectedOrg: "Vendor",
      category: "Edit Rights",
      passFail: "fail",
      recommendation:
        "Restrict edit rights to accounts within the user's assigned territory or update territory assignment.",
    },
    {
      id: "vf-002",
      checkType: "cross-org-isolation",
      severity: "critical",
      title: "Cross-organization visibility conflict detected",
      description:
        "Raj Patel (Reseller Primary Admin) can view Global Pharma Holdings, which is assigned to a different Reseller partner. This violates cross-Reseller isolation rules.",
      affectedUser: "Raj Patel",
      affectedAccount: "Global Pharma Holdings",
      affectedOrg: "Reseller",
      category: "Org Isolation",
      passFail: "fail",
      recommendation:
        "Immediately revoke cross-Reseller account visibility and audit all Reseller user permissions.",
    },
    {
      id: "vf-003",
      checkType: "dashboard-visibility",
      severity: "warning",
      title: "Dashboard visible to unauthorized department",
      description:
        "The 'Pricing Governance Dashboard' is visible to Marketing department users. Pricing dashboards should be restricted to Sales Operations, Deal Desk, and Leadership.",
      affectedUser: "Amara Johnson",
      affectedAccount: "N/A",
      affectedOrg: "Vendor",
      category: "Dashboard Visibility",
      passFail: "fail",
      recommendation:
        "Update dashboard sharing rules to exclude Marketing department from pricing governance views.",
    },
    {
      id: "vf-004",
      checkType: "inheritance-anomaly",
      severity: "high-risk",
      title: "Reseller user inherited Vendor visibility unexpectedly",
      description:
        "Hannah Müller (Reseller Account Manager) has inherited visibility to Vendor-only forecasting data through a stale channel link. The link was created 90 days ago and may have over-provisioned permissions.",
      affectedUser: "Hannah Müller",
      affectedAccount: "Global Pharma Holdings",
      affectedOrg: "Reseller",
      category: "Inheritance",
      passFail: "fail",
      recommendation:
        "Review and refresh all channel link permission templates. Remove stale inherited permissions.",
    },
    {
      id: "vf-005",
      checkType: "pricing-field-exposure",
      severity: "warning",
      title: "Leadership user has edit access to pricing fields",
      description:
        "James Harrington (Primary Admin, Leadership) retains edit access to pricingData fields on all accounts. While appropriate for a Primary Admin, this should be reviewed periodically to ensure principle of least privilege.",
      affectedUser: "James Harrington",
      affectedAccount: "Desperado",
      affectedOrg: "Vendor",
      category: "Field Permissions",
      passFail: "fail",
      recommendation:
        "Consider delegating pricing field edits to Sales Operations and Deal Desk roles only.",
    },
    {
      id: "vf-006",
      checkType: "self-approval-risk",
      severity: "critical",
      title: "Secondary Admin can approve own access requests",
      description:
        "Fatima Al-Rashid (Distributor Secondary Admin) has both the ability to submit access requests and approve requests at the Secondary Admin tier. This creates a self-approval risk.",
      affectedUser: "Fatima Al-Rashid",
      affectedAccount: "N/A",
      affectedOrg: "Distributor",
      category: "Approval Governance",
      passFail: "fail",
      recommendation:
        "Implement separation of duties: users cannot approve their own access requests at any tier.",
    },
    {
      id: "vf-007",
      checkType: "distributor-vendor-leak",
      severity: "high-risk",
      title: "Distributor user can view unrelated Vendor accounts",
      description:
        "Liam O'Brien (Distributor Primary Admin) has visibility to Apex Financial Services, which is not aligned to any Distributor-managed account in the current hierarchy.",
      affectedUser: "Liam O'Brien",
      affectedAccount: "Apex Financial Services",
      affectedOrg: "Distributor",
      category: "Hierarchy Leak",
      passFail: "fail",
      recommendation:
        "Audit Distributor account alignment. Remove visibility to accounts outside the Distributor's assigned portfolio.",
    },
    {
      id: "vf-008",
      checkType: "financial-reporting-access",
      severity: "warning",
      title: "Marketing user has access to financial reporting",
      description:
        "Tom Whitfield (Marketing Manager) has view access to the 'Revenue Forecasting Report' and 'Credit Usage Insights' panels. Financial reporting should be restricted to Finance, Leadership, and Primary Admin roles.",
      affectedUser: "Tom Whitfield",
      affectedAccount: "N/A",
      affectedOrg: "Vendor",
      category: "Reporting Access",
      passFail: "fail",
      recommendation:
        "Remove Marketing users from financial reporting dashboards and restrict to Finance and Leadership.",
    },
    {
      id: "vf-009",
      checkType: "reseller-territory-conflict",
      severity: "high-risk",
      title: "Reseller edit rights conflict with territory assignment",
      description:
        "Jens Bergström (Reseller Sales Rep, Nordics) has edit rights to Desperado, which is primarily a UK territory account. This creates a cross-territory edit conflict.",
      affectedUser: "Jens Bergström",
      affectedAccount: "Desperado",
      affectedOrg: "Reseller",
      category: "Territory Conflict",
      passFail: "fail",
      recommendation:
        "Align Reseller edit rights with territory assignments. Restrict edits to accounts within assigned territory.",
    },
    {
      id: "vf-010",
      checkType: "stale-access",
      severity: "critical",
      title: "Account access not revoked after role change",
      description:
        "Daniel Park (IT Engineer) was previously an Account Manager and retains edit access to Desperado and Nordic Energy Group after his role change to IT. Access was not revoked during the role transition.",
      affectedUser: "Daniel Park",
      affectedAccount: "Desperado",
      affectedOrg: "Vendor",
      category: "Stale Access",
      passFail: "fail",
      recommendation:
        "Implement automated access revocation on role change. Audit all users who changed roles in the last 90 days.",
    },
    {
      id: "vf-011",
      checkType: "hierarchy-integrity",
      severity: "info",
      title: "Vendor hierarchy integrity verified",
      description:
        "All Vendor accounts correctly map to their assigned Distributors and Resellers. No orphaned accounts detected in the Vendor hierarchy.",
      affectedUser: "N/A",
      affectedAccount: "N/A",
      affectedOrg: "Vendor",
      category: "Hierarchy",
      passFail: "pass",
      recommendation: "No action required. Continue periodic hierarchy audits.",
    },
    {
      id: "vf-012",
      checkType: "user-visibility-scope",
      severity: "info",
      title: "Sales Rep visibility scope is appropriately limited",
      description:
        "Sofia Martínez (Sales Rep, EMEA) can only view accounts assigned to her territory and role. No overexposure detected.",
      affectedUser: "Sofia Martínez",
      affectedAccount: "Desperado",
      affectedOrg: "Vendor",
      category: "Visibility Scope",
      passFail: "pass",
      recommendation:
        "No action required. Visibility scope is correctly configured.",
    },
    {
      id: "vf-013",
      checkType: "territory-conflict",
      severity: "warning",
      title: "Territory overlap detected for Nordic Energy Group",
      description:
        "Nordic Energy Group is assigned to both the Nordics and EMEA territories. This creates a potential conflict for territory-based reporting and commission attribution.",
      affectedUser: "N/A",
      affectedAccount: "Nordic Energy Group",
      affectedOrg: "Vendor",
      category: "Territory Conflict",
      passFail: "fail",
      recommendation:
        "Clarify primary territory assignment. Update territory mappings to remove overlap.",
    },
    {
      id: "vf-014",
      checkType: "account-exposure",
      severity: "high-risk",
      title: "Desperado account exposed to external channel link users",
      description:
        "Desperado has an active external channel link with a Reseller organization, but the link grants view access to internal notes. Internal notes should never be shared externally.",
      affectedUser: "N/A",
      affectedAccount: "Desperado",
      affectedOrg: "Vendor",
      category: "Account Exposure",
      passFail: "fail",
      recommendation:
        "Immediately revoke internal notes visibility from the external channel link. Audit all external link permissions.",
    },
    {
      id: "vf-015",
      checkType: "org-boundary-violation",
      severity: "critical",
      title: "Organization boundary violation between Vendor and Distributor",
      description:
        "Ingrid Svensson (Distributor Sales Operations) can view Vendor-only pricing data for Nordic Energy Group. Distributor users should not have access to Vendor pricing fields.",
      affectedUser: "Ingrid Svensson",
      affectedAccount: "Nordic Energy Group",
      affectedOrg: "Distributor",
      category: "Org Boundary",
      passFail: "fail",
      recommendation:
        "Enforce strict org boundary: Distributor users cannot view Vendor pricing, margin, or forecasting data.",
    },
    {
      id: "vf-016",
      checkType: "role-permission-mismatch",
      severity: "warning",
      title: "Role-permission mismatch for Business Analyst",
      description:
        "Priya Okoye (Business Analyst) has edit access to territoryMapping fields. Territory mappings should only be editable by Sales Operations, Primary Admin, and Secondary Admin roles.",
      affectedUser: "Priya Okoye",
      affectedAccount: "N/A",
      affectedOrg: "Vendor",
      category: "Role Permissions",
      passFail: "fail",
      recommendation:
        "Remove territory mapping edit rights from Business Analyst role. Restrict to Sales Operations and Admin roles.",
    },
    {
      id: "vf-017",
      checkType: "secondary-admin-escalation",
      severity: "high-risk",
      title: "Secondary Admin can escalate to Primary Admin privileges",
      description:
        "Fatima Al-Rashid (Distributor Secondary Admin) has been granted access to AI Governance and Infrastructure Analytics modules, which should be restricted to Primary Admins only.",
      affectedUser: "Fatima Al-Rashid",
      affectedAccount: "N/A",
      affectedOrg: "Distributor",
      category: "Privilege Escalation",
      passFail: "fail",
      recommendation:
        "Revoke high-sensitivity module access from Secondary Admin. Restrict AI Governance and Infrastructure Analytics to Primary Admins.",
    },
    {
      id: "vf-018",
      checkType: "external-link-permission",
      severity: "warning",
      title: "External channel link grants excessive permissions",
      description:
        "An external channel link with a Reseller organization grants 'Edit' access to deal registrations. External links should default to 'View Only' or 'Comment' access.",
      affectedUser: "N/A",
      affectedAccount: "EuroRetail Group",
      affectedOrg: "Vendor",
      category: "External Links",
      passFail: "fail",
      recommendation:
        "Downgrade external link permissions to 'View Only' for deal registrations. Require Primary Admin approval for any edit-level external access.",
    },
    {
      id: "vf-019",
      checkType: "ai-governance-access",
      severity: "high-risk",
      title: "Non-IT user has AI Governance panel access",
      description:
        "Rachel Moore (Channel Partner Manager) has access to the AI Governance panel. AI Governance should be restricted to Primary Admins and IT/Security roles.",
      affectedUser: "Rachel Moore",
      affectedAccount: "N/A",
      affectedOrg: "Vendor",
      category: "AI Governance",
      passFail: "fail",
      recommendation:
        "Revoke AI Governance access from Channel Partner Manager. Restrict to Primary Admin and IT/Security roles.",
    },
    {
      id: "vf-020",
      checkType: "renewal-ownership-gap",
      severity: "warning",
      title: "Renewal ownership gap detected for Apex Financial Services",
      description:
        "Apex Financial Services has a renewal date within 90 days but no assigned Renewal Specialist. This creates a risk of missed renewal.",
      affectedUser: "N/A",
      affectedAccount: "Apex Financial Services",
      affectedOrg: "Vendor",
      category: "Renewal Governance",
      passFail: "fail",
      recommendation:
        "Assign a Renewal Specialist to Apex Financial Services immediately. Set up automated renewal ownership alerts.",
    },
    {
      id: "vf-021",
      checkType: "department-visibility-leak",
      severity: "high-risk",
      title: "Department visibility leak between Sales and Finance",
      description:
        "Chris Webb (Sales Rep, UK) can view the 'Credit Usage Insights' panel, which contains financial data. Financial panels should be restricted to Finance, Leadership, and Primary Admin roles.",
      affectedUser: "Chris Webb",
      affectedAccount: "N/A",
      affectedOrg: "Vendor",
      category: "Department Visibility",
      passFail: "fail",
      recommendation:
        "Remove Sales Rep access to financial panels. Restrict Credit Usage Insights to Finance, Leadership, and Primary Admin.",
    },
    {
      id: "vf-022",
      checkType: "leadership-edit-anomaly",
      severity: "info",
      title: "Leadership edit permissions are appropriately limited",
      description:
        "All Leadership role users have view-only access to operational fields. No anomalous edit permissions detected for Leadership users.",
      affectedUser: "N/A",
      affectedAccount: "N/A",
      affectedOrg: "Vendor",
      category: "Leadership Permissions",
      passFail: "pass",
      recommendation:
        "No action required. Leadership permissions are correctly configured.",
    },
    {
      id: "vf-023",
      checkType: "hierarchy-integrity",
      severity: "warning",
      title: "Distributor hierarchy has unaligned Reseller mappings",
      description:
        "The Distributor hierarchy for ATEA Group contains Reseller mappings that do not align to the Vendor's approved Reseller list. This may indicate unauthorized channel relationships.",
      affectedUser: "N/A",
      affectedAccount: "N/A",
      affectedOrg: "Distributor",
      category: "Hierarchy",
      passFail: "fail",
      recommendation:
        "Audit all Distributor-Reseller mappings against the Vendor's approved channel partner list.",
    },
    {
      id: "vf-024",
      checkType: "account-exposure",
      severity: "info",
      title: "Customer account exposure within acceptable limits",
      description:
        "All customer accounts have visibility scoped to their assigned Vendor, Distributor, and Reseller organizations. No overexposure detected.",
      affectedUser: "N/A",
      affectedAccount: "N/A",
      affectedOrg: "Vendor",
      category: "Account Exposure",
      passFail: "pass",
      recommendation:
        "No action required. Account exposure is within acceptable limits.",
    },
  ];
}

// ─── Pre-seeded audit log ─────────────────────────────────────────────────────

function generateInitialAuditLog(): AuditLogEntry[] {
  return [
    {
      id: "al-001",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      affectedUser: "Marcus Okafor",
      affectedAccount: "Desperado",
      organization: "Vendor",
      permissionImpacted: "Edit Rights",
      severity: "High Risk",
      actionTaken: "Edit rights restricted to assigned territory",
      adminResponsible: "James Harrington",
    },
    {
      id: "al-002",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      affectedUser: "Raj Patel",
      affectedAccount: "Global Pharma Holdings",
      organization: "Reseller",
      permissionImpacted: "Account Visibility",
      severity: "Critical",
      actionTaken: "Cross-Reseller visibility revoked",
      adminResponsible: "James Harrington",
    },
    {
      id: "al-003",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      affectedUser: "Amara Johnson",
      affectedAccount: "N/A",
      organization: "Vendor",
      permissionImpacted: "Dashboard Visibility",
      severity: "Warning",
      actionTaken: "Removed from Pricing Governance Dashboard sharing",
      adminResponsible: "Sarah Chen",
    },
    {
      id: "al-004",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      affectedUser: "Hannah Müller",
      affectedAccount: "Global Pharma Holdings",
      organization: "Reseller",
      permissionImpacted: "Inherited Visibility",
      severity: "High Risk",
      actionTaken: "Stale channel link permissions refreshed",
      adminResponsible: "James Harrington",
    },
    {
      id: "al-005",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      affectedUser: "Fatima Al-Rashid",
      affectedAccount: "N/A",
      organization: "Distributor",
      permissionImpacted: "Self-Approval Risk",
      severity: "Critical",
      actionTaken: "Separation of duties enforced: cannot approve own requests",
      adminResponsible: "Liam O'Brien",
    },
    {
      id: "al-006",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
      affectedUser: "Liam O'Brien",
      affectedAccount: "Apex Financial Services",
      organization: "Distributor",
      permissionImpacted: "Account Visibility",
      severity: "High Risk",
      actionTaken: "Removed visibility to unrelated Vendor account",
      adminResponsible: "James Harrington",
    },
    {
      id: "al-007",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      affectedUser: "Tom Whitfield",
      affectedAccount: "N/A",
      organization: "Vendor",
      permissionImpacted: "Reporting Access",
      severity: "Warning",
      actionTaken: "Removed from Revenue Forecasting Report access",
      adminResponsible: "Sarah Chen",
    },
    {
      id: "al-008",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      affectedUser: "Jens Bergström",
      affectedAccount: "Desperado",
      organization: "Reseller",
      permissionImpacted: "Edit Rights",
      severity: "High Risk",
      actionTaken: "Edit rights aligned with territory assignment",
      adminResponsible: "Raj Patel",
    },
    {
      id: "al-009",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
      affectedUser: "Daniel Park",
      affectedAccount: "Desperado",
      organization: "Vendor",
      permissionImpacted: "Stale Access",
      severity: "Critical",
      actionTaken: "Revoked edit access after role change to IT",
      adminResponsible: "James Harrington",
    },
    {
      id: "al-010",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      affectedUser: "Ingrid Svensson",
      affectedAccount: "Nordic Energy Group",
      organization: "Distributor",
      permissionImpacted: "Org Boundary",
      severity: "Critical",
      actionTaken: "Removed Vendor pricing data visibility",
      adminResponsible: "Liam O'Brien",
    },
    {
      id: "al-011",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      affectedUser: "Priya Okoye",
      affectedAccount: "N/A",
      organization: "Vendor",
      permissionImpacted: "Role Permissions",
      severity: "Warning",
      actionTaken:
        "Removed territory mapping edit rights from Business Analyst",
      adminResponsible: "Sarah Chen",
    },
    {
      id: "al-012",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 54).toISOString(),
      affectedUser: "Fatima Al-Rashid",
      affectedAccount: "N/A",
      organization: "Distributor",
      permissionImpacted: "Privilege Escalation",
      severity: "High Risk",
      actionTaken: "Revoked AI Governance and Infrastructure Analytics access",
      adminResponsible: "Liam O'Brien",
    },
    {
      id: "al-013",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
      affectedUser: "N/A",
      affectedAccount: "EuroRetail Group",
      organization: "Vendor",
      permissionImpacted: "External Link Permissions",
      severity: "Warning",
      actionTaken:
        "Downgraded external link to View Only for deal registrations",
      adminResponsible: "James Harrington",
    },
    {
      id: "al-014",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      affectedUser: "Rachel Moore",
      affectedAccount: "N/A",
      organization: "Vendor",
      permissionImpacted: "AI Governance",
      severity: "High Risk",
      actionTaken: "Revoked AI Governance panel access",
      adminResponsible: "James Harrington",
    },
    {
      id: "al-015",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 84).toISOString(),
      affectedUser: "N/A",
      affectedAccount: "Apex Financial Services",
      organization: "Vendor",
      permissionImpacted: "Renewal Ownership",
      severity: "Warning",
      actionTaken: "Assigned Renewal Specialist David Kim to account",
      adminResponsible: "Sarah Chen",
    },
    {
      id: "al-016",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
      affectedUser: "Chris Webb",
      affectedAccount: "N/A",
      organization: "Vendor",
      permissionImpacted: "Department Visibility",
      severity: "High Risk",
      actionTaken: "Removed Sales Rep access to Credit Usage Insights panel",
      adminResponsible: "Sarah Chen",
    },
    {
      id: "al-017",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 108).toISOString(),
      affectedUser: "N/A",
      affectedAccount: "Nordic Energy Group",
      organization: "Vendor",
      permissionImpacted: "Territory Mapping",
      severity: "Warning",
      actionTaken:
        "Clarified primary territory as Nordics, removed EMEA overlap",
      adminResponsible: "Sarah Chen",
    },
    {
      id: "al-018",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
      affectedUser: "N/A",
      affectedAccount: "Desperado",
      organization: "Vendor",
      permissionImpacted: "External Link Permissions",
      severity: "Critical",
      actionTaken:
        "Revoked internal notes visibility from external channel link",
      adminResponsible: "James Harrington",
    },
    {
      id: "al-019",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 132).toISOString(),
      affectedUser: "N/A",
      affectedAccount: "N/A",
      organization: "Distributor",
      permissionImpacted: "Hierarchy Mapping",
      severity: "Warning",
      actionTaken:
        "Audited Distributor-Reseller mappings against approved list",
      adminResponsible: "Liam O'Brien",
    },
    {
      id: "al-020",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
      affectedUser: "Sofia Martínez",
      affectedAccount: "Desperado",
      organization: "Vendor",
      permissionImpacted: "Visibility Scope",
      severity: "Info",
      actionTaken:
        "Verified Sales Rep visibility scope is appropriately limited",
      adminResponsible: "Sarah Chen",
    },
    {
      id: "al-021",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 156).toISOString(),
      affectedUser: "Emma Clarke",
      affectedAccount: "UK Education Trust",
      organization: "Vendor",
      permissionImpacted: "Edit Rights",
      severity: "Info",
      actionTaken: "Granted edit rights to assigned accounts",
      adminResponsible: "James Harrington",
    },
    {
      id: "al-022",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
      affectedUser: "N/A",
      affectedAccount: "N/A",
      organization: "Vendor",
      permissionImpacted: "Role Change",
      severity: "Info",
      actionTaken:
        "Role changed from Account Manager to Renewal Specialist for David Kim",
      adminResponsible: "James Harrington",
    },
    {
      id: "al-023",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 180).toISOString(),
      affectedUser: "Lars Hansen",
      affectedAccount: "Northern Telecom Networks",
      organization: "Vendor",
      permissionImpacted: "Territory Override",
      severity: "Warning",
      actionTaken:
        "Granted temporary territory override for strategic account review",
      adminResponsible: "Sarah Chen",
    },
    {
      id: "al-024",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 192).toISOString(),
      affectedUser: "N/A",
      affectedAccount: "Global Pharma Holdings",
      organization: "Vendor",
      permissionImpacted: "Visibility Change",
      severity: "Info",
      actionTaken:
        "Added Finance team to account visibility for renewal forecasting",
      adminResponsible: "James Harrington",
    },
  ];
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function loadAuditLog(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AuditLogEntry[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore parse errors
  }
  const seeded = generateInitialAuditLog();
  localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

function saveAuditLog(entries: AuditLogEntry[]) {
  try {
    localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore storage errors
  }
}

// ─── Context shape ────────────────────────────────────────────────────────────

interface AccessValidationContextValue {
  findings: ValidationFinding[];
  securityHealthScore: number;
  lastValidatedAt: string;
  runValidationChecks: () => void;
  auditLog: AuditLogEntry[];
  auditLogFilters: AuditLogFilters;
  setAuditLogFilter: <K extends keyof AuditLogFilters>(
    key: K,
    value: AuditLogFilters[K],
  ) => void;
  filteredAuditLog: AuditLogEntry[];
  addAuditLogEntry: (entry: Omit<AuditLogEntry, "id" | "timestamp">) => void;
  traceAccountAccess: (accountName: string) => AccountAccessTraceResult[];
  getEffectivePermissions: (userId: string) => EffectivePermissions;
  validateHierarchy: () => HierarchyValidationResult;
}

const AccessValidationContext =
  createContext<AccessValidationContextValue | null>(null);

// ─── Helper: compute health score ─────────────────────────────────────────────

function computeHealthScore(findings: ValidationFinding[]): number {
  if (findings.length === 0) return 100;
  const failFindings = findings.filter((f) => f.passFail === "fail");
  if (failFindings.length === 0) return 100;

  const severityWeights: Record<ValidationSeverity, number> = {
    info: 1,
    warning: 3,
    "high-risk": 6,
    critical: 10,
  };

  const totalWeight = findings.reduce(
    (sum, f) => sum + severityWeights[f.severity],
    0,
  );
  const failWeight = failFindings.reduce(
    (sum, f) => sum + severityWeights[f.severity],
    0,
  );

  const ratio = failWeight / totalWeight;
  return Math.max(0, Math.round(100 - ratio * 100));
}

// ─── Helper: trace account access ─────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function computeTraceResults(accountName: string): AccountAccessTraceResult[] {
  const results: AccountAccessTraceResult[] = [];

  for (const user of DUMMY_USERS) {
    const canView = user.assignedAccounts.includes(accountName);
    const canEdit = user.editAccounts.includes(accountName);
    if (!canView) continue;

    let visibilityReason: AccountAccessTraceResult["visibilityReason"] =
      "Direct Owner";
    if (user.role === "Leadership" || user.role === "Primary Admin") {
      visibilityReason = "Leadership Visibility";
    } else if (
      user.territory !== "Global" &&
      user.assignedAccounts.includes(accountName)
    ) {
      visibilityReason = "Territory Visibility";
    } else if (
      user.department === "Sales Operations" &&
      user.role !== "Primary Admin"
    ) {
      visibilityReason = "Department Inheritance";
    } else if (user.orgType === "Reseller") {
      visibilityReason = "Reseller Relationship";
    } else if (user.orgType === "Distributor") {
      visibilityReason = "Distributor Governance";
    }

    results.push({
      userId: user.userId,
      name: user.name,
      orgType: user.orgType,
      role: user.role,
      department: user.department,
      territory: user.territory,
      visibilityReason,
      editRights: canEdit,
      accessType: canEdit ? "direct" : "inherited",
      initials: getInitials(user.name),
    });
  }

  // Sort: direct owners first, then by org type (Vendor > Distributor > Reseller), then by role seniority
  const rolePriority: Record<string, number> = {
    "Primary Admin": 0,
    "Secondary Admin": 1,
    Leadership: 2,
    "Sales Operations": 3,
    "Account Manager": 4,
    "Renewal Specialist": 5,
    "Deal Desk": 6,
    "Customer Success": 7,
    "Sales Rep": 8,
    "Marketing User": 9,
    "Marketing Manager": 9,
    "Business Analyst": 10,
    "IT Engineer": 11,
    "Channel Partner Manager": 12,
    "Regional Sales Lead": 13,
    "Account Executive": 14,
  };

  const orgPriority: Record<string, number> = {
    Vendor: 0,
    Distributor: 1,
    Reseller: 2,
  };

  results.sort((a, b) => {
    if (a.editRights !== b.editRights) return a.editRights ? -1 : 1;
    if (orgPriority[a.orgType] !== orgPriority[b.orgType])
      return orgPriority[a.orgType] - orgPriority[b.orgType];
    return (rolePriority[a.role] ?? 99) - (rolePriority[b.role] ?? 99);
  });

  return results.slice(0, 10);
}

// ─── Helper: effective permissions ──────────────────────────────────────────────

function computeEffectivePermissions(userId: string): EffectivePermissions {
  const user = DUMMY_USERS.find((u) => u.userId === userId);
  if (!user) {
    return {
      userId,
      userName: "Unknown",
      role: "Unknown",
      orgType: "Unknown",
      fieldMatrix: ACCOUNT_FIELDS.map((f) => ({
        fieldName: f,
        canView: false,
        canEdit: false,
      })),
      modulePermissions: FOUNDRY_MODULES.map((m) => ({
        moduleId: m.id,
        moduleName: m.name,
        canView: false,
        canEdit: false,
      })),
      isOverexposed: false,
      overexposedFields: [],
      overexposedModules: [],
    };
  }

  const isAdmin =
    user.role === "Primary Admin" || user.role === "Secondary Admin";
  const isSalesOps = user.role === "Sales Operations";
  const isLeadership =
    user.role === "Leadership" || user.role === "Primary Admin";
  const isFinance = user.role === "Finance";
  const isIT = user.department === "IT" || user.department === "Security";
  const isMarketing = user.department === "Marketing";
  const isRenewal = user.role === "Renewal Specialist";
  const isDealDesk = user.role === "Deal Desk";

  const fieldMatrix: FieldPermissionMatrix[] = ACCOUNT_FIELDS.map((field) => {
    let canView = true;
    let canEdit = false;

    switch (field) {
      case "accountName":
      case "customerDomain":
      case "customerIdNumber":
        canEdit = isAdmin;
        break;
      case "internalNotes":
        canView = true;
        canEdit = isAdmin;
        break;
      case "resellerOwnerId":
      case "vendorOwnerId":
        canEdit =
          isAdmin ||
          [
            "Sales Rep",
            "Account Manager",
            "Renewal Specialist",
            "Customer Success",
            "Deal Desk",
          ].includes(user.role);
        break;
      case "contractType":
        canEdit = isAdmin || isSalesOps || isDealDesk;
        break;
      case "estimatedRenewalValue":
      case "licenceQuantity":
        canEdit =
          isAdmin ||
          isRenewal ||
          isFinance ||
          ["Account Manager", "Deal Desk"].includes(user.role);
        break;
      case "products":
      case "status":
      case "externalNotes":
        canEdit =
          isAdmin ||
          [
            "Sales Rep",
            "Account Manager",
            "Renewal Specialist",
            "Customer Success",
            "Deal Desk",
          ].includes(user.role);
        break;
      case "pricingData":
        canView = isAdmin || isSalesOps || isDealDesk || isFinance;
        canEdit = isAdmin || isSalesOps || isDealDesk;
        break;
      case "territoryMapping":
        canEdit = isAdmin || isSalesOps || isDealDesk;
        break;
      case "campaignData":
        canView = isAdmin || isMarketing;
        canEdit = isAdmin || isMarketing;
        break;
      case "forecastingData":
        canView = isAdmin || isLeadership || isSalesOps || isFinance;
        canEdit = isAdmin || isLeadership || isSalesOps;
        break;
      case "renewalDates":
        canEdit =
          isAdmin || isRenewal || ["Account Manager"].includes(user.role);
        break;
      default:
        canEdit = isAdmin;
    }

    return { fieldName: field, canView, canEdit };
  });

  const modulePermissions: ModulePermission[] = FOUNDRY_MODULES.map((mod) => {
    let canView = true;
    let canEdit = false;

    switch (mod.id) {
      case "infrastructure-compute":
        canView = isAdmin || isIT || isLeadership;
        canEdit = isAdmin;
        break;
      case "access-governance":
        canView = isAdmin || isIT;
        canEdit = isAdmin;
        break;
      case "account-governance":
        canView = isAdmin || isSalesOps;
        canEdit = isAdmin;
        break;
      case "external-channel-links":
        canView =
          isAdmin ||
          isSalesOps ||
          ["Channel Partner Manager"].includes(user.role);
        canEdit = isAdmin;
        break;
      case "credit-usage-insights":
        canView = isAdmin || isFinance || isLeadership;
        canEdit = isAdmin;
        break;
      case "report-builder":
        canView = true;
        canEdit = isAdmin || isSalesOps || isFinance;
        break;
      case "dashboard-manager":
        canView = true;
        canEdit = isAdmin || isSalesOps;
        break;
      case "forge-ai":
        canView = true;
        canEdit = isAdmin || isIT;
        break;
    }

    return { moduleId: mod.id, moduleName: mod.name, canView, canEdit };
  });

  // Determine overexposure based on role baseline
  const overexposedFields: string[] = [];
  const overexposedModules: string[] = [];

  // Simple baseline: Sales Rep should not see pricing, forecasting, or financial modules
  if (user.role === "Sales Rep") {
    for (const fm of fieldMatrix) {
      if (
        ["pricingData", "forecastingData", "campaignData"].includes(
          fm.fieldName,
        ) &&
        fm.canView
      ) {
        overexposedFields.push(fm.fieldName);
      }
    }
    for (const mp of modulePermissions) {
      if (
        ["credit-usage-insights", "infrastructure-compute"].includes(
          mp.moduleId,
        ) &&
        mp.canView
      ) {
        overexposedModules.push(mp.moduleId);
      }
    }
  }

  // Marketing should not see pricing or financial reporting
  if (isMarketing) {
    for (const fm of fieldMatrix) {
      if (
        ["pricingData", "forecastingData", "estimatedRenewalValue"].includes(
          fm.fieldName,
        ) &&
        fm.canView
      ) {
        if (!overexposedFields.includes(fm.fieldName))
          overexposedFields.push(fm.fieldName);
      }
    }
    for (const mp of modulePermissions) {
      if (
        ["credit-usage-insights", "infrastructure-compute"].includes(
          mp.moduleId,
        ) &&
        mp.canView
      ) {
        if (!overexposedModules.includes(mp.moduleId))
          overexposedModules.push(mp.moduleId);
      }
    }
  }

  // IT should not see customer data fields
  if (isIT && user.role !== "Primary Admin") {
    for (const fm of fieldMatrix) {
      if (
        [
          "internalNotes",
          "externalNotes",
          "estimatedRenewalValue",
          "renewalDates",
        ].includes(fm.fieldName) &&
        fm.canView
      ) {
        if (!overexposedFields.includes(fm.fieldName))
          overexposedFields.push(fm.fieldName);
      }
    }
  }

  return {
    userId: user.userId,
    userName: user.name,
    role: user.role,
    orgType: user.orgType,
    fieldMatrix,
    modulePermissions,
    isOverexposed:
      overexposedFields.length > 0 || overexposedModules.length > 0,
    overexposedFields,
    overexposedModules,
  };
}

// ─── Helper: hierarchy validation ─────────────────────────────────────────────

function computeHierarchyValidation(): HierarchyValidationResult {
  const tree: HierarchyNode = {
    id: "vendor-adobe",
    name: "Adobe (Vendor)",
    type: "Vendor",
    children: [
      {
        id: "dist-ingram",
        name: "Ingram Micro (Distributor)",
        type: "Distributor",
        children: [
          {
            id: "res-nordic",
            name: "Nordic Cloud Solutions (Reseller)",
            type: "Reseller",
            children: [
              {
                id: "cust-desperado",
                name: "Desperado",
                type: "Customer",
                children: [],
              },
              {
                id: "cust-nordic-energy",
                name: "Nordic Energy Group",
                type: "Customer",
                children: [],
              },
            ],
          },
          {
            id: "res-enterprise",
            name: "Enterprise Digital Partners (Reseller)",
            type: "Reseller",
            children: [
              {
                id: "cust-uk-edu",
                name: "UK Education Trust",
                type: "Customer",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "dist-crayon",
        name: "Crayon (Distributor)",
        type: "Distributor",
        children: [
          {
            id: "res-bluepeak",
            name: "BluePeak Consulting (Reseller)",
            type: "Reseller",
            children: [
              {
                id: "cust-global-pharma",
                name: "Global Pharma Holdings",
                type: "Customer",
                children: [],
              },
              {
                id: "cust-apex",
                name: "Apex Financial Services",
                type: "Customer",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "dist-atea",
        name: "ATEA Group (Distributor)",
        type: "Distributor",
        children: [
          {
            id: "res-sovereign",
            name: "Sovereign Systems UK (Reseller)",
            type: "Reseller",
            children: [
              {
                id: "cust-city-infra",
                name: "City Infrastructure Authority",
                type: "Customer",
                children: [],
              },
            ],
          },
          {
            id: "res-futurestack",
            name: "FutureStack Technologies (Reseller)",
            type: "Reseller",
            children: [
              {
                id: "cust-horizon",
                name: "Horizon Manufacturing",
                type: "Customer",
                children: [],
              },
              {
                id: "cust-euroretail",
                name: "EuroRetail Group",
                type: "Customer",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  };

  const leaks: HierarchyLeak[] = [
    {
      userId: "usr-009",
      userName: "Raj Patel",
      orgType: "Reseller",
      leakedTo: "Global Pharma Holdings",
      leakType: "Cross-Reseller visibility",
      severity: "high-risk",
    },
    {
      userId: "usr-008",
      userName: "Ingrid Svensson",
      orgType: "Distributor",
      leakedTo: "Vendor pricing data",
      leakType: "Org boundary violation",
      severity: "critical",
    },
    {
      userId: "usr-010",
      userName: "Hannah Müller",
      orgType: "Reseller",
      leakedTo: "Vendor forecasting data",
      leakType: "Inheritance anomaly",
      severity: "high-risk",
    },
  ];

  const crossOrgExposureRisks = [
    "Reseller user may view Distributor-only operational data through stale channel links",
    "Distributor user has visibility to Vendor pricing fields on Nordic Energy Group",
    "Cross-Reseller account visibility detected for Global Pharma Holdings",
  ];

  return { tree, leaks, crossOrgExposureRisks };
}

// ─── Provider ───────────────────────────────────────────────────────────────────

export function AccessValidationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [findings, setFindings] = useState<ValidationFinding[]>(
    generateInitialFindings,
  );
  const [lastValidatedAt, setLastValidatedAt] = useState<string>(
    new Date().toISOString(),
  );
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(loadAuditLog);
  const [auditLogFilters, setAuditLogFiltersState] = useState<AuditLogFilters>({
    user: "",
    account: "",
    territory: "",
    orgType: "",
    warningType: "",
    dateRange: { from: "", to: "" },
    severity: "",
    admin: "",
  });

  const runValidationChecks = useCallback(() => {
    // Recompute findings by shuffling some severities to simulate live checks
    const base = generateInitialFindings();
    const randomized = base.map((f) => {
      // Randomly flip a few info findings to keep it dynamic
      if (f.severity === "info" && Math.random() > 0.85) {
        return {
          ...f,
          passFail: "fail" as const,
          severity: "warning" as ValidationSeverity,
        };
      }
      return f;
    });
    setFindings(randomized);
    setLastValidatedAt(new Date().toISOString());
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      runValidationChecks();
    }, 30000);
    return () => clearInterval(interval);
  }, [runValidationChecks]);

  const setAuditLogFilter = useCallback(
    <K extends keyof AuditLogFilters>(key: K, value: AuditLogFilters[K]) => {
      setAuditLogFiltersState((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const filteredAuditLog = useMemo(() => {
    return auditLog.filter((entry) => {
      if (
        auditLogFilters.user &&
        !entry.affectedUser
          .toLowerCase()
          .includes(auditLogFilters.user.toLowerCase())
      )
        return false;
      if (
        auditLogFilters.account &&
        !entry.affectedAccount
          .toLowerCase()
          .includes(auditLogFilters.account.toLowerCase())
      )
        return false;
      if (
        auditLogFilters.orgType &&
        !entry.organization
          .toLowerCase()
          .includes(auditLogFilters.orgType.toLowerCase())
      )
        return false;
      if (
        auditLogFilters.severity &&
        entry.severity !== auditLogFilters.severity
      )
        return false;
      if (
        auditLogFilters.admin &&
        !entry.adminResponsible
          .toLowerCase()
          .includes(auditLogFilters.admin.toLowerCase())
      )
        return false;
      if (
        auditLogFilters.dateRange.from &&
        entry.timestamp < auditLogFilters.dateRange.from
      )
        return false;
      if (
        auditLogFilters.dateRange.to &&
        entry.timestamp > auditLogFilters.dateRange.to
      )
        return false;
      if (
        auditLogFilters.warningType &&
        !entry.permissionImpacted
          .toLowerCase()
          .includes(auditLogFilters.warningType.toLowerCase())
      )
        return false;
      return true;
    });
  }, [auditLog, auditLogFilters]);

  const addAuditLogEntry = useCallback(
    (entry: Omit<AuditLogEntry, "id" | "timestamp">) => {
      const newEntry: AuditLogEntry = {
        ...entry,
        id: `al-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      setAuditLog((prev) => {
        const updated = [newEntry, ...prev];
        saveAuditLog(updated);
        return updated;
      });
    },
    [],
  );

  const traceAccountAccess = useCallback(
    (accountName: string): AccountAccessTraceResult[] => {
      return computeTraceResults(accountName);
    },
    [],
  );

  const getEffectivePermissions = useCallback(
    (userId: string): EffectivePermissions => {
      return computeEffectivePermissions(userId);
    },
    [],
  );

  const validateHierarchy = useCallback((): HierarchyValidationResult => {
    return computeHierarchyValidation();
  }, []);

  const securityHealthScore = useMemo(
    () => computeHealthScore(findings),
    [findings],
  );

  const value: AccessValidationContextValue = {
    findings,
    securityHealthScore,
    lastValidatedAt,
    runValidationChecks,
    auditLog,
    auditLogFilters,
    setAuditLogFilter,
    filteredAuditLog,
    addAuditLogEntry,
    traceAccountAccess,
    getEffectivePermissions,
    validateHierarchy,
  };

  return React.createElement(
    AccessValidationContext.Provider,
    { value },
    children,
  );
}

export function useAccessValidation(): AccessValidationContextValue {
  const ctx = useContext(AccessValidationContext);
  if (!ctx)
    throw new Error(
      "useAccessValidation must be used inside AccessValidationProvider",
    );
  return ctx;
}

// ─── Standalone exports for direct use ────────────────────────────────────────

export { ALL_CHECK_TYPES, ACCOUNT_FIELDS, FOUNDRY_MODULES };
export type { DummyUser };
export { DUMMY_USERS };
