import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle,
  ChevronRight,
  Clock,
  Edit3,
  Eye,
  Filter,
  Info,
  MapPin,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import {
  type AccountAccessTraceResult,
  type AuditLogEntry,
  type AuditLogFilters,
  type AuditSeverity,
  DUMMY_USERS,
  type DummyUser,
  type EffectivePermissions,
  type FieldPermissionMatrix,
  type HierarchyLeak,
  type HierarchyNode,
  type HierarchyValidationResult,
  type ModulePermission,
  type ValidationFinding,
  type ValidationSeverity,
  useAccessValidation,
} from "../../stores/accessValidationStore";

type TabId =
  | "dashboard"
  | "permission-validator"
  | "hierarchy"
  | "visibility-diagnostics"
  | "edit-rights"
  | "access-tracer"
  | "audit-log";

type Severity = ValidationSeverity;

const TABS: { id: TabId; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "permission-validator", label: "Permission Validator" },
  { id: "hierarchy", label: "Hierarchy" },
  { id: "visibility-diagnostics", label: "Visibility Diagnostics" },
  { id: "edit-rights", label: "Edit Rights" },
  { id: "access-tracer", label: "Access Tracer" },
  { id: "audit-log", label: "Audit Log" },
];

const SEVERITY_COLORS: Record<Severity, string> = {
  info: "bg-blue-400/20 text-blue-400 border-blue-400/40",
  warning: "bg-yellow-400/20 text-yellow-400 border-yellow-400/40",
  "high-risk": "bg-orange-400/20 text-orange-400 border-orange-400/40",
  critical: "bg-red-400/20 text-red-400 border-red-400/40",
};

const _SEVERITY_DOT: Record<Severity, string> = {
  info: "bg-blue-400",
  warning: "bg-yellow-400",
  "high-risk": "bg-orange-400",
  critical: "bg-red-400",
};

function severityRank(s: Severity): number {
  return { critical: 0, "high-risk": 1, warning: 2, info: 3 }[s];
}

function orgTypeBg(orgType: string): string {
  if (orgType === "Vendor") return "bg-blue-500";
  if (orgType === "Distributor") return "bg-amber-500";
  if (orgType === "Reseller") return "bg-teal-500";
  return "bg-slate-500";
}

function visibilityReasonBg(reason: string): string {
  if (reason === "Direct Owner") return "bg-blue-500";
  if (reason === "Territory Visibility") return "bg-teal-500";
  if (reason === "Department Inheritance") return "bg-purple-500";
  if (reason === "Reseller Relationship") return "bg-orange-500";
  if (reason === "Distributor Governance") return "bg-amber-500";
  if (reason === "Leadership Visibility") return "bg-[#1e3a5f]";
  return "bg-slate-500";
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function CircularScore({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-emerald-400"
      : score >= 60
        ? "text-yellow-400"
        : "text-red-400";
  const bg =
    score >= 80
      ? "bg-emerald-400/10"
      : score >= 60
        ? "bg-yellow-400/10"
        : "bg-red-400/10";
  const border =
    score >= 80
      ? "border-emerald-400/40"
      : score >= 60
        ? "border-yellow-400/40"
        : "border-red-400/40";
  return (
    <div
      className={`flex items-center justify-center w-28 h-28 rounded-full border-4 ${border} ${bg}`}
    >
      <div className="text-center">
        <div className={`text-3xl font-bold ${color}`}>{score}</div>
        <div className="text-[10px] text-slate-400 uppercase tracking-wider">
          Score
        </div>
      </div>
    </div>
  );
}

function normalizeSeverity(s: string): Severity {
  const map: Record<string, Severity> = {
    info: "info",
    warning: "warning",
    "high-risk": "high-risk",
    "high risk": "high-risk",
    critical: "critical",
    Info: "info",
    Warning: "warning",
    "High Risk": "high-risk",
    Critical: "critical",
  };
  return map[s] || "info";
}

function SeverityBadge({ severity }: { severity: string }) {
  const normalized = normalizeSeverity(severity);
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${SEVERITY_COLORS[normalized]}`}
    >
      {normalized === "high-risk"
        ? "High Risk"
        : normalized.charAt(0).toUpperCase() + normalized.slice(1)}
    </span>
  );
}

export default function AccessValidationModule() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [permissions, setPermissions] = useState<EffectivePermissions | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [traceResults, setTraceResults] = useState<AccountAccessTraceResult[]>(
    [],
  );
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [auditFilters, setAuditFilters] = useState<AuditLogFilters>({
    user: "",
    account: "",
    territory: "",
    orgType: "",
    warningType: "",
    dateRange: { from: "", to: "" },
    severity: "",
    admin: "",
  });

  const {
    securityHealthScore,
    lastValidatedAt,
    findings,
    runValidationChecks,
    getEffectivePermissions,
    validateHierarchy,
    traceAccountAccess,
    auditLog,
    setAuditLogFilter,
  } = useAccessValidation();

  const passedCount = findings.filter((f) => f.passFail === "pass").length;
  const warningCount = findings.filter(
    (f) => f.severity === "warning" || f.severity === "info",
  ).length;
  const criticalCount = findings.filter(
    (f) => f.severity === "critical" || f.severity === "high-risk",
  ).length;

  const categoryStatus = [
    { key: "Hierarchy Integrity", label: "Hierarchy Integrity" },
    { key: "Visibility Rules", label: "Visibility Rules" },
    { key: "Permission Boundaries", label: "Permission Boundaries" },
    { key: "Edit Right Governance", label: "Edit Right Governance" },
    { key: "Account Exposure", label: "Account Exposure" },
    { key: "Org Boundary Violations", label: "Org Boundary Violations" },
  ];

  function getCategoryDot(key: string) {
    const catFindings = findings.filter((f) =>
      f.category.toLowerCase().includes(key.toLowerCase()),
    );
    const hasCritical = catFindings.some(
      (f) => f.severity === "critical" || f.severity === "high-risk",
    );
    const hasWarning = catFindings.some((f) => f.severity === "warning");
    if (hasCritical)
      return (
        <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
      );
    if (hasWarning)
      return (
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
      );
    return <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />;
  }

  function handleUserSelect(userId: string) {
    setSelectedUserId(userId);
    const perms = getEffectivePermissions(userId);
    setPermissions(perms);
  }

  function handleSearch() {
    if (!searchTerm.trim()) return;
    const results = traceAccountAccess(searchTerm);
    setTraceResults(results);
    setHasSearched(true);
  }

  function handleAuditFilterChange<K extends keyof AuditLogFilters>(
    field: K,
    value: AuditLogFilters[K],
  ) {
    const next = { ...auditFilters, [field]: value };
    setAuditFilters(next);
    setAuditLogFilter(field, value);
  }

  const filteredAudit = auditLog.filter((entry) => {
    if (
      auditFilters.user &&
      !entry.affectedUser
        .toLowerCase()
        .includes(auditFilters.user.toLowerCase())
    )
      return false;
    if (
      auditFilters.account &&
      !entry.affectedAccount
        .toLowerCase()
        .includes(auditFilters.account.toLowerCase())
    )
      return false;
    if (
      auditFilters.territory &&
      !entry.organization
        .toLowerCase()
        .includes(auditFilters.territory.toLowerCase())
    )
      return false;
    if (
      auditFilters.orgType &&
      !entry.organization
        .toLowerCase()
        .includes(auditFilters.orgType.toLowerCase())
    )
      return false;
    if (
      auditFilters.warningType &&
      !entry.permissionImpacted
        .toLowerCase()
        .includes(auditFilters.warningType.toLowerCase())
    )
      return false;
    if (
      auditFilters.severity &&
      entry.severity.toLowerCase().replace(" ", "-") !== auditFilters.severity
    )
      return false;
    if (
      auditFilters.admin &&
      !entry.adminResponsible
        .toLowerCase()
        .includes(auditFilters.admin.toLowerCase())
    )
      return false;
    if (
      auditFilters.dateRange?.from &&
      new Date(entry.timestamp) < new Date(auditFilters.dateRange.from)
    )
      return false;
    if (
      auditFilters.dateRange?.to &&
      new Date(entry.timestamp) > new Date(auditFilters.dateRange.to)
    )
      return false;
    return true;
  });

  const recentCritical = findings
    .filter((f) => f.severity === "critical" || f.severity === "high-risk")
    .slice(0, 5);

  const visibilityFindings = findings.filter(
    (f) =>
      f.category.toLowerCase().includes("visibility") ||
      f.category.toLowerCase().includes("dashboard"),
  );

  const editFindings = findings
    .filter(
      (f) =>
        f.category.toLowerCase().includes("edit") ||
        f.category.toLowerCase().includes("permission"),
    )
    .sort((a, b) => severityRank(a.severity) - severityRank(b.severity));

  const hierarchyResult: HierarchyValidationResult = validateHierarchy();

  return (
    <div className="min-h-screen bg-[#0f1629] text-slate-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-ocid={`access_validation.tab.${tab.id}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                  : "bg-[#1a2035] text-slate-400 border border-[#1e2d45] hover:text-slate-200 hover:border-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Shield className="w-6 h-6 text-orange-400" />
                  Access Validation & Security Panel
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm text-emerald-400">
                    Live Validation Active
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={runValidationChecks}
                  data-ocid="access_validation.refresh_button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a2035] border border-[#1e2d45] text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Validation
                </button>
                <button
                  type="button"
                  data-ocid="access_validation.deep_scan_button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a2035] border border-[#1e2d45] text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
                >
                  <Activity className="w-4 h-4" />
                  Run Deep Scan
                </button>
                <button
                  type="button"
                  data-ocid="access_validation.detailed_results_button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a2035] border border-[#1e2d45] text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Detailed Results
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Health Score */}
              <div className="lg:col-span-1 bg-[#1a2035] border border-[#1e2d45] rounded-xl p-6 flex flex-col items-center">
                <CircularScore score={securityHealthScore} />
                <div className="mt-4 text-center">
                  <div className="text-sm font-medium text-slate-300">
                    Security Health Score
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Last validated: {lastValidatedAt}
                  </div>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-5">
                  <div className="text-3xl font-bold text-white">
                    {findings.length}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    Total Checks
                  </div>
                </div>
                <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-5">
                  <div className="text-3xl font-bold text-emerald-400">
                    {passedCount}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">Passed</div>
                </div>
                <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-5">
                  <div className="text-3xl font-bold text-yellow-400">
                    {warningCount}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">Warnings</div>
                </div>
                <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-5">
                  <div className="text-3xl font-bold text-red-400">
                    {criticalCount}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    Critical Issues
                  </div>
                </div>
              </div>
            </div>

            {/* Category Status */}
            <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Live Category Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryStatus.map((cat) => (
                  <div
                    key={cat.key}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#0f1629] border border-[#1e2d45]"
                  >
                    {getCategoryDot(cat.key)}
                    <span className="text-sm text-slate-300">{cat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Critical Findings */}
            <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                Recent Critical Findings
              </h3>
              {recentCritical.length === 0 ? (
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>No critical findings detected</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentCritical.map((f: ValidationFinding) => (
                    <div
                      key={f.id}
                      className="p-4 rounded-lg bg-[#0f1629] border border-red-400/20"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <SeverityBadge severity={f.severity} />
                        <span className="text-sm font-medium text-white">
                          {f.title}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{f.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Permission Validator */}
        {activeTab === "permission-validator" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-400" />
              Permission Validator
            </h2>
            <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-6">
              <label
                htmlFor="permission-validator-user-select"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Select User
              </label>
              <select
                id="permission-validator-user-select"
                value={selectedUserId}
                onChange={(e) => handleUserSelect(e.target.value)}
                data-ocid="access_validation.user_select"
                className="w-full md:w-80 px-3 py-2 rounded-lg bg-[#0f1629] border border-[#1e2d45] text-slate-200 focus:outline-none focus:border-orange-500/50"
              >
                <option value="">Choose a user...</option>
                {DUMMY_USERS.map((u: DummyUser) => (
                  <option key={u.userId} value={u.userId}>
                    {u.name} — {u.role}
                  </option>
                ))}
              </select>
            </div>

            {permissions && (
              <div className="space-y-6">
                <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {permissions.userName}
                      </div>
                      <div className="text-sm text-slate-400">
                        {permissions.role} · {permissions.orgType}
                      </div>
                    </div>
                  </div>
                  {permissions.isOverexposed && (
                    <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-orange-400/10 border border-orange-400/30 text-orange-400">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        This user has permissions beyond their role baseline
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
                    Field Permissions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {permissions.fieldMatrix.map(
                      (field: FieldPermissionMatrix) => (
                        <div
                          key={field.fieldName}
                          className="flex items-center justify-between p-3 rounded-lg bg-[#0f1629] border border-[#1e2d45]"
                        >
                          <span className="text-sm text-slate-300">
                            {field.fieldName}
                          </span>
                          <div className="flex items-center gap-2">
                            {field.canView ? (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-400/20 text-emerald-400">
                                View
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-400">
                                View
                              </span>
                            )}
                            {field.canEdit ? (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-400/20 text-emerald-400">
                                Edit
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-400">
                                Edit
                              </span>
                            )}
                            {!field.canView && !field.canEdit && (
                              <Shield className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
                    Module Access
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {permissions.modulePermissions.map(
                      (mod: ModulePermission) => (
                        <span
                          key={mod.moduleId}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                            mod.canView
                              ? "bg-emerald-400/20 text-emerald-400 border-emerald-400/30"
                              : "bg-slate-700 text-slate-400 border-slate-600"
                          }`}
                        >
                          {mod.moduleName}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Hierarchy */}
        {activeTab === "hierarchy" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-400" />
              Hierarchy Validation
            </h2>
            <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
                Organization Tree
              </h3>
              <div className="space-y-3">
                {(() => {
                  const renderNode = (node: HierarchyNode, depth = 0) => (
                    <div
                      key={node.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[#0f1629] border border-[#1e2d45]"
                      style={{ marginLeft: depth * 24 }}
                    >
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            {node.name}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#1e2d45] text-slate-300 border border-[#2a3a55]">
                            {node.type}
                          </span>
                          {node.children.length > 0 && (
                            <span className="text-xs text-slate-500">
                              {node.children.length} children
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                  const renderTree = (node: HierarchyNode, depth = 0) => (
                    <React.Fragment key={node.id}>
                      {renderNode(node, depth)}
                      {node.children.map((child) =>
                        renderTree(child, depth + 1),
                      )}
                    </React.Fragment>
                  );
                  return renderTree(hierarchyResult.tree);
                })()}
              </div>
            </div>

            <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                Detected Leaks
              </h3>
              {hierarchyResult.leaks.length === 0 ? (
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>No hierarchy leaks detected</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {hierarchyResult.leaks.map(
                    (leak: HierarchyLeak, idx: number) => (
                      <div
                        key={`leak-${leak.userId}-${idx}`}
                        className="p-4 rounded-lg bg-[#0f1629] border border-red-400/20"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <SeverityBadge severity={leak.severity} />
                          <span className="text-sm font-medium text-white">
                            {leak.userName}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#1e2d45] text-slate-300 border border-[#2a3a55]">
                            {leak.orgType}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">
                          {leak.leakType}: leaked to {leak.leakedTo}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>

            <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
                Cross-Org Exposure Risks
              </h3>
              {hierarchyResult.crossOrgExposureRisks.length === 0 ? (
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>No cross-organization exposure risks</span>
                </div>
              ) : (
                <ul className="space-y-2">
                  {hierarchyResult.crossOrgExposureRisks.map(
                    (risk: string, idx: number) => (
                      <li
                        key={`risk-${idx}-${risk.substring(0, 20)}`}
                        className="flex items-start gap-2 text-sm text-slate-300"
                      >
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                        {risk}
                      </li>
                    ),
                  )}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Visibility Diagnostics */}
        {activeTab === "visibility-diagnostics" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-orange-400" />
                Visibility Diagnostics
              </h2>
              <span className="text-sm text-slate-400">
                {visibilityFindings.length} Visibility Conflict
                {visibilityFindings.length !== 1 ? "s" : ""} Detected
              </span>
            </div>

            {visibilityFindings.length === 0 ? (
              <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-8 flex items-center gap-3 text-emerald-400">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg font-medium">
                  No visibility conflicts detected
                </span>
              </div>
            ) : (
              <div className="space-y-6">
                {Array.from(
                  new Set(
                    visibilityFindings.map(
                      (f: ValidationFinding) => f.checkType,
                    ),
                  ),
                ).map((checkType) => (
                  <div
                    key={checkType}
                    className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-6"
                  >
                    <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
                      {checkType}
                    </h3>
                    <div className="space-y-3">
                      {visibilityFindings
                        .filter(
                          (f: ValidationFinding) => f.checkType === checkType,
                        )
                        .map((f: ValidationFinding) => (
                          <div
                            key={f.id}
                            className="p-4 rounded-lg bg-[#0f1629] border border-[#1e2d45]"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <SeverityBadge severity={f.severity} />
                              <span className="text-sm font-medium text-white">
                                {f.title}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400 mb-2">
                              {f.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {f.affectedUser && (
                                <span className="px-2 py-0.5 rounded text-xs bg-[#1e2d45] text-slate-300 border border-[#2a3a55]">
                                  <User className="w-3 h-3 inline mr-1" />
                                  {f.affectedUser}
                                </span>
                              )}
                              {f.affectedAccount && (
                                <span className="px-2 py-0.5 rounded text-xs bg-[#1e2d45] text-slate-300 border border-[#2a3a55]">
                                  <Building2 className="w-3 h-3 inline mr-1" />
                                  {f.affectedAccount}
                                </span>
                              )}
                              {f.affectedOrg && (
                                <span className="px-2 py-0.5 rounded text-xs bg-[#1e2d45] text-slate-300 border border-[#2a3a55]">
                                  <Shield className="w-3 h-3 inline mr-1" />
                                  {f.affectedOrg}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500">
                              {f.recommendation}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Edit Rights */}
        {activeTab === "edit-rights" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-orange-400" />
              Edit Rights Governance
            </h2>

            <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-6">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-orange-400" />
                <span className="text-sm font-medium text-slate-300">
                  {editFindings.length} user
                  {editFindings.length !== 1 ? "s" : ""} flagged for edit right
                  violations
                </span>
              </div>
            </div>

            {editFindings.length === 0 ? (
              <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-8 flex items-center gap-3 text-emerald-400">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg font-medium">
                  All edit rights within policy
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {editFindings.map((f: ValidationFinding) => (
                  <div
                    key={f.id}
                    className="p-4 rounded-lg bg-[#1a2035] border border-[#1e2d45]"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <SeverityBadge severity={f.severity} />
                      <span className="text-sm font-medium text-white">
                        {f.title}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">
                      {f.description}
                    </p>
                    {f.affectedUser && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-[#1e2d45] text-slate-300 border border-[#2a3a55] mb-2">
                        <User className="w-3 h-3 mr-1" />
                        {f.affectedUser}
                      </span>
                    )}
                    <p className="text-xs text-slate-500">{f.recommendation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: Access Tracer */}
        {activeTab === "access-tracer" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-orange-400" />
              Account Access Tracer
            </h2>

            <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Enter an account name to trace access..."
                  data-ocid="access_validation.tracer_search_input"
                  className="flex-1 px-4 py-2 rounded-lg bg-[#0f1629] border border-[#1e2d45] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  data-ocid="access_validation.tracer_search_button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/40 hover:bg-orange-500/30 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>

            {!hasSearched ? (
              <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-12 text-center text-slate-500">
                <Search className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                <p>Enter an account name to trace access</p>
              </div>
            ) : traceResults.length === 0 ? (
              <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-8 flex items-center gap-3 text-slate-400">
                <XCircle className="w-6 h-6" />
                <span>No access records found for this account</span>
              </div>
            ) : (
              <div className="space-y-6">
                {["direct", "inherited"].map((type) => {
                  const group = traceResults.filter(
                    (r: AccountAccessTraceResult) => r.accessType === type,
                  );
                  if (group.length === 0) return null;
                  return (
                    <div
                      key={type}
                      className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-6"
                    >
                      <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
                        {type === "direct"
                          ? "Direct Access"
                          : "Inherited Access"}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {group.map((result: AccountAccessTraceResult) => (
                          <div
                            key={result.userId}
                            className="p-4 rounded-lg bg-[#0f1629] border border-[#1e2d45] flex items-start gap-4"
                          >
                            <div
                              className={`w-10 h-10 rounded-full ${orgTypeBg(result.orgType)} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                            >
                              {initials(result.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-white truncate">
                                  {result.name}
                                </span>
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#1e2d45] text-slate-300 border border-[#2a3a55]">
                                  {result.orgType}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                                <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                                  {result.role}
                                </span>
                                <span>{result.department}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                                <MapPin className="w-3 h-3" />
                                {result.territory}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-medium text-white ${visibilityReasonBg(result.visibilityReason)}`}
                                >
                                  {result.visibilityReason}
                                </span>
                                {result.editRights ? (
                                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-400/20 text-emerald-400 border border-emerald-400/30">
                                    Edit Access
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-400 border border-slate-600">
                                    View Only
                                  </span>
                                )}
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#1e2d45] text-slate-300 border border-[#2a3a55]">
                                  {result.accessType === "direct"
                                    ? "Direct"
                                    : "Inherited"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                disabled
                title="Coming soon"
                data-ocid="access_validation.view_full_map_button"
                className="px-4 py-2 rounded-lg bg-[#1a2035] border border-[#1e2d45] text-slate-500 cursor-not-allowed"
              >
                View Full Access Map
              </button>
            </div>
          </div>
        )}

        {/* TAB 7: Audit Log */}
        {activeTab === "audit-log" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              Security Audit Log
            </h2>

            <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-6">
              <div className="flex flex-wrap gap-3">
                <input
                  type="text"
                  placeholder="Filter by user"
                  value={auditFilters.user}
                  onChange={(e) =>
                    handleAuditFilterChange("user", e.target.value)
                  }
                  className="px-3 py-2 rounded-lg bg-[#0f1629] border border-[#1e2d45] text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500/50"
                />
                <input
                  type="text"
                  placeholder="Filter by account"
                  value={auditFilters.account}
                  onChange={(e) =>
                    handleAuditFilterChange("account", e.target.value)
                  }
                  className="px-3 py-2 rounded-lg bg-[#0f1629] border border-[#1e2d45] text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500/50"
                />
                <select
                  value={auditFilters.territory}
                  onChange={(e) =>
                    handleAuditFilterChange("territory", e.target.value)
                  }
                  className="px-3 py-2 rounded-lg bg-[#0f1629] border border-[#1e2d45] text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
                >
                  <option value="">Territory</option>
                  <option value="EMEA">EMEA</option>
                  <option value="APAC">APAC</option>
                  <option value="Americas">Americas</option>
                </select>
                <select
                  value={auditFilters.orgType}
                  onChange={(e) =>
                    handleAuditFilterChange("orgType", e.target.value)
                  }
                  className="px-3 py-2 rounded-lg bg-[#0f1629] border border-[#1e2d45] text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
                >
                  <option value="">Org Type</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Reseller">Reseller</option>
                </select>
                <select
                  value={auditFilters.warningType}
                  onChange={(e) =>
                    handleAuditFilterChange("warningType", e.target.value)
                  }
                  className="px-3 py-2 rounded-lg bg-[#0f1629] border border-[#1e2d45] text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
                >
                  <option value="">Warning Type</option>
                  <option value="Permission">Permission</option>
                  <option value="Visibility">Visibility</option>
                  <option value="Hierarchy">Hierarchy</option>
                  <option value="Edit">Edit</option>
                </select>
                <input
                  type="date"
                  value={auditFilters.dateRange?.from || ""}
                  onChange={(e) =>
                    handleAuditFilterChange("dateRange", {
                      from: e.target.value,
                      to: auditFilters.dateRange?.to || "",
                    })
                  }
                  className="px-3 py-2 rounded-lg bg-[#0f1629] border border-[#1e2d45] text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
                />
                <input
                  type="date"
                  value={auditFilters.dateRange?.to || ""}
                  onChange={(e) =>
                    handleAuditFilterChange("dateRange", {
                      from: auditFilters.dateRange?.from || "",
                      to: e.target.value,
                    })
                  }
                  className="px-3 py-2 rounded-lg bg-[#0f1629] border border-[#1e2d45] text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
                />
                <select
                  value={auditFilters.severity}
                  onChange={(e) =>
                    handleAuditFilterChange("severity", e.target.value)
                  }
                  className="px-3 py-2 rounded-lg bg-[#0f1629] border border-[#1e2d45] text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
                >
                  <option value="">Severity</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="high-risk">High Risk</option>
                  <option value="critical">Critical</option>
                </select>
                <input
                  type="text"
                  placeholder="Filter by admin"
                  value={auditFilters.admin}
                  onChange={(e) =>
                    handleAuditFilterChange("admin", e.target.value)
                  }
                  className="px-3 py-2 rounded-lg bg-[#0f1629] border border-[#1e2d45] text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500/50"
                />
                <button
                  type="button"
                  data-ocid="access_validation.apply_audit_filter_button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/40 hover:bg-orange-500/30 transition-colors text-sm"
                >
                  <Filter className="w-4 h-4" />
                  Apply Filter
                </button>
              </div>
            </div>

            <div className="text-sm text-slate-400">
              Showing {filteredAudit.length} of {auditLog.length} entries
            </div>

            {filteredAudit.length === 0 ? (
              <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl p-8 text-center text-slate-500">
                <Info className="w-8 h-8 mx-auto mb-2" />
                <p>No audit log entries match the current filters</p>
              </div>
            ) : (
              <div className="bg-[#1a2035] border border-[#1e2d45] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#0f1629] border-b border-[#1e2d45]">
                        <th className="text-left px-4 py-3 text-slate-400 font-medium">
                          Timestamp
                        </th>
                        <th className="text-left px-4 py-3 text-slate-400 font-medium">
                          Affected User
                        </th>
                        <th className="text-left px-4 py-3 text-slate-400 font-medium">
                          Affected Account
                        </th>
                        <th className="text-left px-4 py-3 text-slate-400 font-medium">
                          Organization
                        </th>
                        <th className="text-left px-4 py-3 text-slate-400 font-medium">
                          Permission Impacted
                        </th>
                        <th className="text-left px-4 py-3 text-slate-400 font-medium">
                          Severity
                        </th>
                        <th className="text-left px-4 py-3 text-slate-400 font-medium">
                          Action Taken
                        </th>
                        <th className="text-left px-4 py-3 text-slate-400 font-medium">
                          Admin Responsible
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAudit.map((entry: AuditLogEntry) => (
                        <tr
                          key={entry.id}
                          className="border-b border-[#1e2d45] hover:bg-[#0f1629]/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                            {entry.timestamp}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {entry.affectedUser}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {entry.affectedAccount}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {entry.organization}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {entry.permissionImpacted}
                          </td>
                          <td className="px-4 py-3">
                            <SeverityBadge severity={entry.severity} />
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {entry.actionTaken}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {entry.adminResponsible}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
