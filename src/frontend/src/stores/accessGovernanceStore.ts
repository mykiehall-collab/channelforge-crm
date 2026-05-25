import React, { createContext, useCallback, useContext, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AccessRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "clarification";

export type RoutingTier = "secondary" | "primary";
// ─── Field Permission Types ───────────────────────────────────────────────────

export interface FieldPermissionRule {
  editableByRoles: string[];
  editableByOrgTypes: string[];
  lockedByDefault: boolean;
  requiresPrimaryAdmin: boolean;
}

export const FIELD_PERMISSIONS: Record<string, FieldPermissionRule> = {
  accountName: {
    editableByRoles: ["Primary Admin", "Secondary Admin"],
    editableByOrgTypes: [],
    lockedByDefault: false,
    requiresPrimaryAdmin: false,
  },
  customerDomain: {
    editableByRoles: ["Primary Admin", "Secondary Admin"],
    editableByOrgTypes: [],
    lockedByDefault: false,
    requiresPrimaryAdmin: false,
  },
  customerIdNumber: {
    editableByRoles: ["Primary Admin", "Secondary Admin"],
    editableByOrgTypes: [],
    lockedByDefault: false,
    requiresPrimaryAdmin: false,
  },
  internalNotes: {
    editableByRoles: ["Primary Admin", "Secondary Admin"],
    editableByOrgTypes: [],
    lockedByDefault: false,
    requiresPrimaryAdmin: false,
  },
  resellerOwnerId: {
    editableByRoles: [
      "Sales Rep",
      "Account Manager",
      "Renewal Specialist",
      "Customer Success",
      "Deal Desk",
      "Primary Admin",
      "Secondary Admin",
    ],
    editableByOrgTypes: [],
    lockedByDefault: false,
    requiresPrimaryAdmin: false,
  },
  vendorOwnerId: {
    editableByRoles: [
      "Sales Rep",
      "Account Manager",
      "Renewal Specialist",
      "Customer Success",
      "Deal Desk",
      "Primary Admin",
      "Secondary Admin",
    ],
    editableByOrgTypes: [],
    lockedByDefault: false,
    requiresPrimaryAdmin: false,
  },
  contractType: {
    editableByRoles: [
      "Sales Operations",
      "Primary Admin",
      "Secondary Admin",
      "Deal Desk",
    ],
    editableByOrgTypes: [],
    lockedByDefault: false,
    requiresPrimaryAdmin: false,
  },
  estimatedRenewalValue: {
    editableByRoles: [
      "Renewal Specialist",
      "Account Manager",
      "Deal Desk",
      "Finance",
      "Primary Admin",
      "Secondary Admin",
    ],
    editableByOrgTypes: [],
    lockedByDefault: false,
    requiresPrimaryAdmin: false,
  },
  licenceQuantity: {
    editableByRoles: [
      "Renewal Specialist",
      "Account Manager",
      "Deal Desk",
      "Finance",
      "Primary Admin",
      "Secondary Admin",
    ],
    editableByOrgTypes: [],
    lockedByDefault: false,
    requiresPrimaryAdmin: false,
  },
  products: {
    editableByRoles: [
      "Sales Rep",
      "Account Manager",
      "Renewal Specialist",
      "Customer Success",
      "Deal Desk",
      "Primary Admin",
      "Secondary Admin",
    ],
    editableByOrgTypes: [],
    lockedByDefault: false,
    requiresPrimaryAdmin: false,
  },
  status: {
    editableByRoles: [
      "Sales Rep",
      "Account Manager",
      "Renewal Specialist",
      "Customer Success",
      "Deal Desk",
      "Primary Admin",
      "Secondary Admin",
    ],
    editableByOrgTypes: [],
    lockedByDefault: false,
    requiresPrimaryAdmin: false,
  },
  externalNotes: {
    editableByRoles: [
      "Sales Rep",
      "Account Manager",
      "Renewal Specialist",
      "Customer Success",
      "Deal Desk",
      "Primary Admin",
      "Secondary Admin",
    ],
    editableByOrgTypes: [],
    lockedByDefault: false,
    requiresPrimaryAdmin: false,
  },
  pricingData: {
    editableByRoles: ["Sales Operations", "Deal Desk", "Primary Admin"],
    editableByOrgTypes: [],
    lockedByDefault: true,
    requiresPrimaryAdmin: false,
  },
  territoryMapping: {
    editableByRoles: [
      "Sales Operations",
      "Primary Admin",
      "Secondary Admin",
      "Deal Desk",
    ],
    editableByOrgTypes: [],
    lockedByDefault: false,
    requiresPrimaryAdmin: false,
  },
  campaignData: {
    editableByRoles: ["Marketing User", "Primary Admin", "Secondary Admin"],
    editableByOrgTypes: [],
    lockedByDefault: false,
    requiresPrimaryAdmin: false,
  },
  forecastingData: {
    editableByRoles: [
      "Leadership",
      "Sales Operations",
      "Primary Admin",
      "Secondary Admin",
    ],
    editableByOrgTypes: [],
    lockedByDefault: true,
    requiresPrimaryAdmin: false,
  },
  renewalDates: {
    editableByRoles: [
      "Renewal Specialist",
      "Account Manager",
      "Primary Admin",
      "Secondary Admin",
    ],
    editableByOrgTypes: [],
    lockedByDefault: false,
    requiresPrimaryAdmin: false,
  },
};

export const DEFAULT_OPEN_RULE: FieldPermissionRule = {
  editableByRoles: [],
  editableByOrgTypes: [],
  lockedByDefault: false,
  requiresPrimaryAdmin: false,
};

export type RestrictionType = "role" | "department" | "orgType" | "territory";

export interface LockRestrictions {
  roles: string[];
  departments: string[];
  orgTypes: string[];
  territories: string[];
}

export interface LockConfig {
  isLocked: boolean;
  displayName: string;
  featureType: string;
  restrictions: LockRestrictions;
}

export interface VisibilityRule {
  id: string;
  itemId: string;
  itemDisplayName: string;
  ruleType: RestrictionType;
  ruleValue: string;
  active: boolean;
}

export interface AccessRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterRole: string;
  requesterDepartment?: string;
  feature: string;
  featureDisplayName: string;
  featureType: string;
  reason: string;
  justification: string;
  status: AccessRequestStatus;
  routingTier: RoutingTier;
  submittedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
}

// ─── High-sensitivity feature types requiring Primary Admin approval ──────────

const PRIMARY_ADMIN_FEATURES = new Set([
  "pricing-governance",
  "cross-org-visibility",
  "infrastructure-analytics",
  "security-administration",
  "ai-governance",
  "enterprise-controls",
  "strategic-forecasting",
]);

function resolveRoutingTier(featureType: string): RoutingTier {
  return PRIMARY_ADMIN_FEATURES.has(featureType) ? "primary" : "secondary";
}

// ─── Pre-seeded lock config ───────────────────────────────────────────────────

const INITIAL_LOCK_CONFIG: Record<string, LockConfig> = {
  "advanced-reporting": {
    isLocked: true,
    displayName: "Advanced Reporting",
    featureType: "reporting",
    restrictions: {
      roles: ["Sales Ops", "Finance"],
      departments: ["Sales Operations", "Finance"],
      orgTypes: [],
      territories: [],
    },
  },
  "infrastructure-analytics": {
    isLocked: true,
    displayName: "Infrastructure Analytics",
    featureType: "infrastructure-analytics",
    restrictions: {
      roles: ["Primary Admin"],
      departments: ["IT", "Security"],
      orgTypes: [],
      territories: [],
    },
  },
  "ai-governance": {
    isLocked: true,
    displayName: "AI Governance",
    featureType: "ai-governance",
    restrictions: {
      roles: ["Primary Admin"],
      departments: [],
      orgTypes: [],
      territories: [],
    },
  },
  "cross-region-reporting": {
    isLocked: true,
    displayName: "Cross-Region Reporting",
    featureType: "cross-org-visibility",
    restrictions: {
      roles: ["Leadership", "Primary Admin"],
      departments: ["Leadership", "Strategy"],
      orgTypes: [],
      territories: [],
    },
  },
  "pricing-governance": {
    isLocked: true,
    displayName: "Pricing Governance",
    featureType: "pricing-governance",
    restrictions: {
      roles: ["Sales Ops", "Primary Admin"],
      departments: ["Sales Operations"],
      orgTypes: [],
      territories: [],
    },
  },
};

// ─── Pre-seeded requests ──────────────────────────────────────────────────────

const INITIAL_REQUESTS: AccessRequest[] = [
  {
    id: "req-001",
    requesterId: "usr-011",
    requesterName: "Sofia Mart\u00ednez",
    requesterRole: "Sales Rep",
    requesterDepartment: "Sales",
    feature: "advanced-reporting",
    featureDisplayName: "Advanced Reporting",
    featureType: "reporting",
    reason: "Operational Need",
    justification:
      "Require access to advanced pipeline reports for EMEA renewal forecasting ahead of Q3 close.",
    status: "pending",
    routingTier: "secondary",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "req-002",
    requesterId: "usr-012",
    requesterName: "Tom Whitfield",
    requesterRole: "Marketing Manager",
    requesterDepartment: "Marketing",
    feature: "cross-region-reporting",
    featureDisplayName: "Cross-Region Reporting",
    featureType: "cross-org-visibility",
    reason: "Business Requirement",
    justification:
      "Need cross-region campaign performance data for Board-level marketing review and EMEA/APAC comparison analysis.",
    status: "pending",
    routingTier: "primary",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "req-003",
    requesterId: "usr-013",
    requesterName: "Priya Okoye",
    requesterRole: "Business Analyst",
    requesterDepartment: "Sales Operations",
    feature: "advanced-reporting",
    featureDisplayName: "Advanced Reporting",
    featureType: "reporting",
    reason: "Project Requirement",
    justification:
      "Working on a strategic account health analysis project that requires detailed reporting capabilities beyond my current access.",
    status: "pending",
    routingTier: "secondary",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "req-004",
    requesterId: "usr-014",
    requesterName: "Lars Hansen",
    requesterRole: "Regional Sales Lead",
    requesterDepartment: "Sales",
    feature: "pricing-governance",
    featureDisplayName: "Pricing Governance",
    featureType: "pricing-governance",
    reason: "Business Requirement",
    justification:
      "Handling strategic deal negotiations in Nordics where real-time pricing governance visibility is critical.",
    status: "approved",
    routingTier: "primary",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    resolvedBy: "James Harrington",
    resolutionNote:
      "Approved for Nordics territory deals only. Review in 90 days.",
  },
  {
    id: "req-005",
    requesterId: "usr-015",
    requesterName: "Emma Clarke",
    requesterRole: "Account Executive",
    requesterDepartment: "Sales",
    feature: "advanced-reporting",
    featureDisplayName: "Advanced Reporting",
    featureType: "reporting",
    reason: "Operational Need",
    justification:
      "Need detailed renewal pipeline reports for key account reviews with Desperado and Nordic Energy Group.",
    status: "approved",
    routingTier: "secondary",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(),
    resolvedBy: "Sarah Chen",
    resolutionNote: "Approved for account management reporting purposes.",
  },
  {
    id: "req-006",
    requesterId: "usr-016",
    requesterName: "Daniel Park",
    requesterRole: "IT Engineer",
    requesterDepartment: "IT",
    feature: "ai-governance",
    featureDisplayName: "AI Governance",
    featureType: "ai-governance",
    reason: "Role Expansion",
    justification:
      "Our team is responsible for monitoring AI usage but currently cannot access governance panel.",
    status: "approved",
    routingTier: "primary",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 100).toISOString(),
    resolvedBy: "James Harrington",
    resolutionNote: "Approved for IT infrastructure monitoring role.",
  },
  {
    id: "req-007",
    requesterId: "usr-017",
    requesterName: "Rachel Moore",
    requesterRole: "Channel Partner Manager",
    requesterDepartment: "Channel",
    feature: "infrastructure-analytics",
    featureDisplayName: "Infrastructure Analytics",
    featureType: "infrastructure-analytics",
    reason: "Operational Need",
    justification:
      "Requested to monitor partner ecosystem compute usage for cost attribution reporting.",
    status: "rejected",
    routingTier: "primary",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 130).toISOString(),
    resolvedBy: "James Harrington",
    resolutionNote:
      "Infrastructure analytics is restricted to IT/Security. Please coordinate with IT team for required reports.",
  },
  {
    id: "req-008",
    requesterId: "usr-018",
    requesterName: "Chris Webb",
    requesterRole: "Sales Rep",
    requesterDepartment: "Sales",
    feature: "cross-region-reporting",
    featureDisplayName: "Cross-Region Reporting",
    featureType: "cross-org-visibility",
    reason: "Project Requirement",
    justification:
      "Temporary project requires seeing all EMEA data together for a one-time strategic account analysis.",
    status: "rejected",
    routingTier: "primary",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 155).toISOString(),
    resolvedBy: "James Harrington",
    resolutionNote:
      "Cross-region visibility requires formal business case sign-off from Leadership. Re-submit via your manager.",
  },
];

// ─── Initial visibility rules ─────────────────────────────────────────────────

const INITIAL_RULES: VisibilityRule[] = [
  {
    id: "rule-001",
    itemId: "pricing-governance",
    itemDisplayName: "Pricing Governance",
    ruleType: "role",
    ruleValue: "Sales Ops",
    active: true,
  },
  {
    id: "rule-002",
    itemId: "pricing-governance",
    itemDisplayName: "Pricing Governance",
    ruleType: "department",
    ruleValue: "Sales Operations",
    active: true,
  },
  {
    id: "rule-003",
    itemId: "infrastructure-analytics",
    itemDisplayName: "Infrastructure Analytics",
    ruleType: "department",
    ruleValue: "IT",
    active: true,
  },
  {
    id: "rule-004",
    itemId: "infrastructure-analytics",
    itemDisplayName: "Infrastructure Analytics",
    ruleType: "department",
    ruleValue: "Security",
    active: true,
  },
  {
    id: "rule-005",
    itemId: "ai-governance",
    itemDisplayName: "AI Governance",
    ruleType: "role",
    ruleValue: "Primary Admin",
    active: true,
  },
  {
    id: "rule-006",
    itemId: "cross-region-reporting",
    itemDisplayName: "Cross-Region Reporting",
    ruleType: "role",
    ruleValue: "Leadership",
    active: true,
  },
  {
    id: "rule-007",
    itemId: "advanced-reporting",
    itemDisplayName: "Advanced Reporting",
    ruleType: "role",
    ruleValue: "Sales Ops",
    active: true,
  },
];

// ─── Context shape ────────────────────────────────────────────────────────────

// ─── Context shape ────────────────────────────────────────────────────────────

export type AccountEditOverrides = Record<string, Record<string, string[]>>;

interface AccessGovernanceContextValue {
  lockConfig: Record<string, LockConfig>;
  accessRequests: AccessRequest[];
  visibilityRules: VisibilityRule[];
  submitRequest: (
    feature: string,
    featureDisplayName: string,
    featureType: string,
    reason: string,
    justification: string,
    requesterName?: string,
    requesterRole?: string,
  ) => void;
  approveRequest: (id: string, note?: string) => void;
  rejectRequest: (id: string, reason: string) => void;
  requestClarification: (id: string, note: string) => void;
  revokeGrant: (id: string) => void;
  lockItem: (id: string, restrictions?: Partial<LockRestrictions>) => void;
  unlockItem: (id: string) => void;
  addVisibilityRule: (
    itemId: string,
    itemDisplayName: string,
    ruleType: RestrictionType,
    ruleValue: string,
  ) => void;
  removeVisibilityRule: (ruleId: string) => void;
  toggleVisibilityRule: (ruleId: string) => void;
  isItemLockedForUser: (
    itemId: string,
    userRole: string,
    userDepartment: string,
    userOrgType: string,
    userTerritory?: string,
  ) => boolean;
  accountEditOverrides: AccountEditOverrides;
  getFieldPermission: (fieldName: string) => FieldPermissionRule;
  setFieldPermission: (
    fieldName: string,
    rule: Partial<FieldPermissionRule>,
  ) => void;
  setAccountEditOverride: (
    accountId: string,
    fieldName: string,
    extraRoles: string[],
  ) => void;
}

const AccessGovernanceContext =
  createContext<AccessGovernanceContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AccessGovernanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lockConfig, setLockConfig] =
    useState<Record<string, LockConfig>>(INITIAL_LOCK_CONFIG);
  const [accessRequests, setAccessRequests] =
    useState<AccessRequest[]>(INITIAL_REQUESTS);
  const [visibilityRules, setVisibilityRules] =
    useState<VisibilityRule[]>(INITIAL_RULES);
  const [fieldPermissions, setFieldPermissionsState] = useState<
    Record<string, FieldPermissionRule>
  >({ ...FIELD_PERMISSIONS });
  const [accountEditOverrides, setAccountEditOverridesState] =
    useState<AccountEditOverrides>({});

  const submitRequest = useCallback(
    (
      feature: string,
      featureDisplayName: string,
      featureType: string,
      reason: string,
      justification: string,
      requesterName = "Current User",
      requesterRole = "User",
    ) => {
      const newReq: AccessRequest = {
        id: `req-${Date.now()}`,
        requesterId: `usr-${Date.now()}`,
        requesterName,
        requesterRole,
        feature,
        featureDisplayName,
        featureType,
        reason,
        justification,
        status: "pending",
        routingTier: resolveRoutingTier(featureType),
        submittedAt: new Date().toISOString(),
      };
      setAccessRequests((prev) => [newReq, ...prev]);
    },
    [],
  );

  const approveRequest = useCallback((id: string, note?: string) => {
    setAccessRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "approved" as const,
              resolvedAt: new Date().toISOString(),
              resolvedBy: "Current Admin",
              resolutionNote: note,
            }
          : r,
      ),
    );
  }, []);

  const rejectRequest = useCallback((id: string, reason: string) => {
    setAccessRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "rejected" as const,
              resolvedAt: new Date().toISOString(),
              resolvedBy: "Current Admin",
              resolutionNote: reason,
            }
          : r,
      ),
    );
  }, []);

  const requestClarification = useCallback((id: string, note: string) => {
    setAccessRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "clarification" as const,
              resolvedAt: new Date().toISOString(),
              resolvedBy: "Current Admin",
              resolutionNote: note,
            }
          : r,
      ),
    );
  }, []);

  const revokeGrant = useCallback((id: string) => {
    setAccessRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "rejected" as const,
              resolvedAt: new Date().toISOString(),
              resolvedBy: "Current Admin",
              resolutionNote: "Access grant revoked by admin.",
            }
          : r,
      ),
    );
  }, []);

  const lockItem = useCallback(
    (id: string, restrictions?: Partial<LockRestrictions>) => {
      setLockConfig((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          isLocked: true,
          restrictions: {
            ...{ roles: [], departments: [], orgTypes: [], territories: [] },
            ...prev[id]?.restrictions,
            ...restrictions,
          },
        },
      }));
    },
    [],
  );

  const unlockItem = useCallback((id: string) => {
    setLockConfig((prev) => ({
      ...prev,
      [id]: { ...prev[id], isLocked: false },
    }));
  }, []);

  const addVisibilityRule = useCallback(
    (
      itemId: string,
      itemDisplayName: string,
      ruleType: RestrictionType,
      ruleValue: string,
    ) => {
      const newRule: VisibilityRule = {
        id: `rule-${Date.now()}`,
        itemId,
        itemDisplayName,
        ruleType,
        ruleValue,
        active: true,
      };
      setVisibilityRules((prev) => [...prev, newRule]);
    },
    [],
  );

  const removeVisibilityRule = useCallback((ruleId: string) => {
    setVisibilityRules((prev) => prev.filter((r) => r.id !== ruleId));
  }, []);

  const toggleVisibilityRule = useCallback((ruleId: string) => {
    setVisibilityRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, active: !r.active } : r)),
    );
  }, []);

  const isItemLockedForUser = useCallback(
    (
      itemId: string,
      userRole: string,
      userDepartment: string,
      userOrgType: string,
      userTerritory?: string,
    ): boolean => {
      const config = lockConfig[itemId];
      if (!config || !config.isLocked) return false;
      const r = config.restrictions;
      if (
        r.roles.length === 0 &&
        r.departments.length === 0 &&
        r.orgTypes.length === 0 &&
        r.territories.length === 0
      ) {
        return true;
      }
      if (r.roles.length > 0 && r.roles.includes(userRole)) return false;
      if (r.departments.length > 0 && r.departments.includes(userDepartment))
        return false;
      if (r.orgTypes.length > 0 && r.orgTypes.includes(userOrgType))
        return false;
      if (
        userTerritory &&
        r.territories.length > 0 &&
        r.territories.includes(userTerritory)
      )
        return false;
      return true;
    },
    [lockConfig],
  );

  const getFieldPermission = useCallback(
    (fieldName: string): FieldPermissionRule => {
      return fieldPermissions[fieldName] ?? DEFAULT_OPEN_RULE;
    },
    [fieldPermissions],
  );

  const setFieldPermission = useCallback(
    (fieldName: string, rule: Partial<FieldPermissionRule>) => {
      setFieldPermissionsState((prev) => ({
        ...prev,
        [fieldName]: { ...(prev[fieldName] ?? DEFAULT_OPEN_RULE), ...rule },
      }));
    },
    [],
  );

  const setAccountEditOverride = useCallback(
    (accountId: string, fieldName: string, extraRoles: string[]) => {
      setAccountEditOverridesState((prev) => ({
        ...prev,
        [accountId]: {
          ...(prev[accountId] ?? {}),
          [fieldName]: extraRoles,
        },
      }));
    },
    [],
  );

  const value: AccessGovernanceContextValue = {
    lockConfig,
    accessRequests,
    visibilityRules,
    submitRequest,
    approveRequest,
    rejectRequest,
    requestClarification,
    revokeGrant,
    lockItem,
    unlockItem,
    addVisibilityRule,
    removeVisibilityRule,
    toggleVisibilityRule,
    isItemLockedForUser,
    accountEditOverrides,
    getFieldPermission,
    setFieldPermission,
    setAccountEditOverride,
  };

  return React.createElement(
    AccessGovernanceContext.Provider,
    { value },
    children,
  );
}

export function useAccessGovernance(): AccessGovernanceContextValue {
  const ctx = useContext(AccessGovernanceContext);
  if (!ctx)
    throw new Error(
      "useAccessGovernance must be used inside AccessGovernanceProvider",
    );
  return ctx;
}

// Standalone utility for checking if a view is locked for a given user role/org
export const isViewLockedForRole = (
  viewId: string,
  userRole: string,
  userOrgType: string,
  isPrimaryAdmin: boolean,
): boolean => {
  if (isPrimaryAdmin) return false;
  const locked = (INITIAL_LOCK_CONFIG as Record<string, any>)[viewId];
  if (!locked || !locked.isLocked) return false;
  const restrictions = locked.restrictions || {};
  const allowedRoles: string[] = restrictions.roles || [];
  const allowedOrgTypes: string[] = restrictions.orgTypes || [];
  if (allowedRoles.length === 0 && allowedOrgTypes.length === 0) return true;
  if (allowedRoles.length > 0 && allowedRoles.includes(userRole)) return false;
  if (allowedOrgTypes.length > 0 && allowedOrgTypes.includes(userOrgType))
    return false;
  return true;
};
