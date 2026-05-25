import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Lock,
  Network,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserMinus,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  ACCOUNT_DATA_SECTIONS,
  type AccountDataSection,
  type ChannelLink,
  type ChannelLinkAuditEntry,
  PERMISSION_TEMPLATE_DEFAULTS,
  type PermissionTemplate,
  type SectionAccessLevel,
} from "../../types/channelLinks";

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_LINKS: ChannelLink[] = [
  {
    id: "cl-1",
    orgName: "Adobe",
    orgType: "VENDOR",
    linkedOrgId: "o-ingram",
    linkedOrgName: "Ingram Micro",
    linkedOrgType: "DISTRIBUTOR",
    status: "Active",
    direction: "VendorToDistributor",
    templateName: "Executive Dashboard Access",
    templateId: "tpl-executive-dashboard",
    invitedBy: "James Harrington",
    invitedAt: "2024-11-15T09:30:00Z",
    approvedBy: "Sarah Mitchell",
    approvedAt: "2024-11-16T14:20:00Z",
    expiresAt: "2025-11-15T09:30:00Z",
    domainVerified: true,
    mfaRequired: true,
  },
  {
    id: "cl-2",
    orgName: "Ingram Micro",
    orgType: "DISTRIBUTOR",
    linkedOrgId: "o-nordic",
    linkedOrgName: "Nordic Cloud Solutions",
    linkedOrgType: "RESELLER",
    status: "Active",
    direction: "DistributorToReseller",
    templateName: "MDF Contributor",
    templateId: "tpl-mdf-contributor",
    invitedBy: "Marcus Webb",
    invitedAt: "2024-10-20T11:00:00Z",
    approvedBy: "Erik Johansson",
    approvedAt: "2024-10-21T08:45:00Z",
    expiresAt: "2025-10-20T11:00:00Z",
    domainVerified: true,
    mfaRequired: false,
  },
  {
    id: "cl-3",
    orgName: "Crayon",
    orgType: "DISTRIBUTOR",
    linkedOrgId: "o-bluepeak",
    linkedOrgName: "BluePeak Consulting",
    linkedOrgType: "RESELLER",
    status: "Pending",
    direction: "DistributorToReseller",
    templateName: "View Only",
    templateId: "tpl-view-only",
    invitedBy: "Rachel Chen",
    invitedAt: "2025-01-08T16:15:00Z",
    domainVerified: false,
    mfaRequired: false,
  },
  {
    id: "cl-4",
    orgName: "Sovereign Systems UK",
    orgType: "RESELLER",
    linkedOrgId: "o-old",
    linkedOrgName: "Legacy Partner Ltd",
    linkedOrgType: "RESELLER",
    status: "Suspended",
    direction: "ResellerToVendor",
    templateName: "Collaborator",
    templateId: "tpl-collaborator",
    invitedBy: "Tom Nakamura",
    invitedAt: "2024-06-10T10:00:00Z",
    approvedBy: "James Harrington",
    approvedAt: "2024-06-11T09:00:00Z",
    expiresAt: "2025-06-10T10:00:00Z",
    domainVerified: true,
    mfaRequired: true,
  },
  {
    id: "cl-5",
    orgName: "Oracle",
    orgType: "VENDOR",
    linkedOrgId: "o-revoked",
    linkedOrgName: "Former Distributor AG",
    linkedOrgType: "DISTRIBUTOR",
    status: "Revoked",
    direction: "VendorToDistributor",
    templateName: "Sales Reporting Access",
    templateId: "tpl-sales-reporting",
    invitedBy: "James Harrington",
    invitedAt: "2024-03-01T08:00:00Z",
    approvedBy: "Sarah Mitchell",
    approvedAt: "2024-03-02T10:00:00Z",
    expiresAt: "2024-12-01T08:00:00Z",
    domainVerified: true,
    mfaRequired: true,
  },
];

const MOCK_TEMPLATES: PermissionTemplate[] = PERMISSION_TEMPLATE_DEFAULTS;

const MOCK_AUDIT_LOG: ChannelLinkAuditEntry[] = [
  {
    entryId: "a1",
    channelLinkId: "cl-3",
    actorId: "u2",
    actorName: "Rachel Chen",
    actorOrg: "Crayon",
    action: "invited",
    targetSection: undefined,
    previousValue: undefined,
    newValue: "BluePeak Consulting",
    timestamp: "2025-01-08T16:15:00Z",
  },
  {
    entryId: "a2",
    channelLinkId: "cl-1",
    actorId: "u1",
    actorName: "James Harrington",
    actorOrg: "Adobe",
    action: "permissions-changed",
    targetSection: "Dashboards",
    previousValue: "read-only",
    newValue: "edit",
    timestamp: "2025-01-07T11:30:00Z",
  },
  {
    entryId: "a3",
    channelLinkId: "cl-2",
    actorId: "u3",
    actorName: "Marcus Webb",
    actorOrg: "Ingram Micro",
    action: "approved",
    targetSection: undefined,
    previousValue: "Pending",
    newValue: "Active",
    timestamp: "2024-10-21T08:45:00Z",
  },
  {
    entryId: "a4",
    channelLinkId: "cl-5",
    actorId: "u1",
    actorName: "James Harrington",
    actorOrg: "Oracle",
    action: "revoked",
    targetSection: undefined,
    previousValue: "Active",
    newValue: "Revoked",
    timestamp: "2024-12-15T09:00:00Z",
  },
  {
    entryId: "a5",
    channelLinkId: "cl-4",
    actorId: "u5",
    actorName: "Tom Nakamura",
    actorOrg: "Sovereign Systems UK",
    action: "suspended",
    targetSection: undefined,
    previousValue: "Active",
    newValue: "Suspended",
    timestamp: "2024-09-20T14:00:00Z",
  },
  {
    entryId: "a6",
    channelLinkId: "cl-1",
    actorId: "u1",
    actorName: "James Harrington",
    actorOrg: "Adobe",
    action: "invited",
    targetSection: undefined,
    previousValue: undefined,
    newValue: "Ingram Micro",
    timestamp: "2024-11-15T09:30:00Z",
  },
  {
    entryId: "a7",
    channelLinkId: "cl-2",
    actorId: "u3",
    actorName: "Marcus Webb",
    actorOrg: "Ingram Micro",
    action: "invited",
    targetSection: undefined,
    previousValue: undefined,
    newValue: "Nordic Cloud Solutions",
    timestamp: "2024-10-20T11:00:00Z",
  },
  {
    entryId: "a8",
    channelLinkId: "cl-1",
    actorId: "u2",
    actorName: "Sarah Mitchell",
    actorOrg: "Ingram Micro",
    action: "approved",
    targetSection: undefined,
    previousValue: "Pending",
    newValue: "Active",
    timestamp: "2024-11-16T14:20:00Z",
  },
  {
    entryId: "a9",
    channelLinkId: "cl-5",
    actorId: "u1",
    actorName: "James Harrington",
    actorOrg: "Oracle",
    action: "permissions-changed",
    targetSection: "Reports",
    previousValue: "read-only",
    newValue: "edit",
    timestamp: "2024-05-10T10:00:00Z",
  },
  {
    entryId: "a10",
    channelLinkId: "cl-3",
    actorId: "u2",
    actorName: "Rachel Chen",
    actorOrg: "Crayon",
    action: "domain-verified",
    targetSection: undefined,
    previousValue: "false",
    newValue: "true",
    timestamp: "2025-01-09T09:00:00Z",
  },
  {
    entryId: "a11",
    channelLinkId: "cl-1",
    actorId: "u1",
    actorName: "James Harrington",
    actorOrg: "Adobe",
    action: "mfa-enabled",
    targetSection: undefined,
    previousValue: "false",
    newValue: "true",
    timestamp: "2024-11-17T10:00:00Z",
  },
  {
    entryId: "a12",
    channelLinkId: "cl-2",
    actorId: "u3",
    actorName: "Marcus Webb",
    actorOrg: "Ingram Micro",
    action: "permissions-changed",
    targetSection: "MDF Requests",
    previousValue: "read-only",
    newValue: "edit",
    timestamp: "2024-11-01T12:00:00Z",
  },
  {
    entryId: "a13",
    channelLinkId: "cl-4",
    actorId: "u5",
    actorName: "Tom Nakamura",
    actorOrg: "Sovereign Systems UK",
    action: "invited",
    targetSection: undefined,
    previousValue: undefined,
    newValue: "Legacy Partner Ltd",
    timestamp: "2024-06-10T10:00:00Z",
  },
  {
    entryId: "a14",
    channelLinkId: "cl-5",
    actorId: "u1",
    actorName: "James Harrington",
    actorOrg: "Oracle",
    action: "invited",
    targetSection: undefined,
    previousValue: undefined,
    newValue: "Former Distributor AG",
    timestamp: "2024-03-01T08:00:00Z",
  },
  {
    entryId: "a15",
    channelLinkId: "cl-1",
    actorId: "u2",
    actorName: "Sarah Mitchell",
    actorOrg: "Ingram Micro",
    action: "permissions-changed",
    targetSection: "Forecasting",
    previousValue: "hidden",
    newValue: "read-only",
    timestamp: "2024-12-20T15:30:00Z",
  },
];

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "pending", label: "Pending Invitations" },
  { id: "active", label: "Active Connections" },
  { id: "templates", label: "Access Templates" },
  { id: "audit", label: "Audit Log" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    Active: "bg-emerald-500/20 text-emerald-400",
    Pending: "bg-yellow-500/20 text-yellow-400",
    Suspended: "bg-orange-500/20 text-orange-400",
    Revoked: "bg-red-500/20 text-red-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] || "bg-muted text-muted-foreground"}`}
    >
      {status === "Active" && <CheckCircle2 size={12} />}
      {status === "Pending" && <Clock size={12} />}
      {status === "Suspended" && <AlertTriangle size={12} />}
      {status === "Revoked" && <XCircle size={12} />}
      {status}
    </span>
  );
}

function orgBadge(type: string) {
  const map: Record<string, string> = {
    VENDOR: "bg-blue-500/20 text-blue-400",
    DISTRIBUTOR: "bg-purple-500/20 text-purple-400",
    RESELLER: "bg-teal-500/20 text-teal-400",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${map[type] || "bg-muted text-muted-foreground"}`}
    >
      {type}
    </span>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ChannelLinksModule() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [links, setLinks] = useState<ChannelLink[]>(MOCK_LINKS);
  const [auditLog] = useState<ChannelLinkAuditEntry[]>(MOCK_AUDIT_LOG);

  // Pending form state
  const [inviteDomain, setInviteDomain] = useState("");
  const [inviteOrgType, setInviteOrgType] = useState<
    "VENDOR" | "DISTRIBUTOR" | "RESELLER"
  >("DISTRIBUTOR");
  const [inviteTemplate, setInviteTemplate] = useState("tpl-view-only");
  const [inviteExpiry, setInviteExpiry] = useState("");

  // Custom template form state
  const [customName, setCustomName] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customSections, setCustomSections] = useState<
    Record<AccountDataSection, SectionAccessLevel>
  >(() => {
    const init: Partial<Record<AccountDataSection, SectionAccessLevel>> = {};
    for (const s of ACCOUNT_DATA_SECTIONS) init[s] = "hidden";
    return init as Record<AccountDataSection, SectionAccessLevel>;
  });
  const [customMdf, setCustomMdf] = useState(false);
  const [customReports, setCustomReports] = useState(false);
  const [customForgeAI, setCustomForgeAI] = useState<
    "none" | "basic" | "operational" | "full"
  >("none");

  // Audit filters
  const [auditSearch, setAuditSearch] = useState("");
  const [auditDateFrom, setAuditDateFrom] = useState("");
  const [auditDateTo, setAuditDateTo] = useState("");
  const [auditPage, setAuditPage] = useState(1);
  const AUDIT_PER_PAGE = 25;

  const activeCount = links.filter((l) => l.status === "Active").length;
  const pendingCount = links.filter((l) => l.status === "Pending").length;
  const revokedCount = links.filter((l) => l.status === "Revoked").length;
  const totalLinked = links.filter(
    (l) => l.status === "Active" || l.status === "Pending",
  ).length;

  const pendingLinks = links.filter((l) => l.status === "Pending");
  const activeLinks = links.filter((l) => l.status === "Active");
  const suspendedLinks = links.filter((l) => l.status === "Suspended");

  const filteredAudit = useMemo(() => {
    let rows = [...auditLog];
    if (auditSearch.trim()) {
      const q = auditSearch.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.actorName.toLowerCase().includes(q) ||
          r.action.toLowerCase().includes(q) ||
          (r.newValue || "").toLowerCase().includes(q),
      );
    }
    if (auditDateFrom) {
      rows = rows.filter((r) => r.timestamp >= auditDateFrom);
    }
    if (auditDateTo) {
      rows = rows.filter((r) => r.timestamp <= `${auditDateTo}T23:59:59Z`);
    }
    rows.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    return rows;
  }, [auditLog, auditSearch, auditDateFrom, auditDateTo]);

  const auditTotalPages = Math.max(
    1,
    Math.ceil(filteredAudit.length / AUDIT_PER_PAGE),
  );
  const auditPageRows = filteredAudit.slice(
    (auditPage - 1) * AUDIT_PER_PAGE,
    auditPage * AUDIT_PER_PAGE,
  );

  function handleApprove(id: string) {
    setLinks((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: "Active" as const,
              approvedBy: "You",
              approvedAt: new Date().toISOString(),
            }
          : l,
      ),
    );
  }

  function handleReject(id: string) {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }

  function handleRevoke(id: string) {
    if (
      !window.confirm(
        "Revoke this channel link? The external organisation will immediately lose access.",
      )
    )
      return;
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "Revoked" as const } : l)),
    );
  }

  function handleSuspend(id: string) {
    setLinks((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: "Suspended" as const } : l,
      ),
    );
  }

  function handleReactivate(id: string) {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "Active" as const } : l)),
    );
  }

  function handleSendInvite() {
    if (!inviteDomain.trim()) return;
    const newLink: ChannelLink = {
      id: `cl-${Date.now()}`,
      orgName: "Your Org",
      orgType: "VENDOR",
      linkedOrgId: `o-${Date.now()}`,
      linkedOrgName: inviteDomain.trim(),
      linkedOrgType: inviteOrgType,
      status: "Pending",
      direction: "VendorToDistributor",
      templateName:
        MOCK_TEMPLATES.find((t) => t.id === inviteTemplate)?.name ||
        "View Only",
      templateId: inviteTemplate,
      invitedBy: "You",
      invitedAt: new Date().toISOString(),
      expiresAt: inviteExpiry ? `${inviteExpiry}T00:00:00Z` : undefined,
      domainVerified: false,
      mfaRequired: false,
    };
    setLinks((prev) => [...prev, newLink]);
    setInviteDomain("");
    setInviteExpiry("");
  }

  function handleSaveCustomTemplate() {
    if (!customName.trim()) return;
    alert(`Custom template "${customName}" saved (mock).`);
    setCustomName("");
    setCustomDesc("");
    setCustomMdf(false);
    setCustomReports(false);
    setCustomForgeAI("none");
    const reset: Partial<Record<AccountDataSection, SectionAccessLevel>> = {};
    for (const s of ACCOUNT_DATA_SECTIONS) reset[s] = "hidden";
    setCustomSections(reset as Record<AccountDataSection, SectionAccessLevel>);
  }

  // ─── Overview ────────────────────────────────────────────────────────────────

  function OverviewTab() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <Network size={18} />
              </div>
              <span className="text-sm text-muted-foreground">
                Total Linked Orgs
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {totalLinked}
            </div>
          </div>
          <div className="bg-card/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 size={18} />
              </div>
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {activeCount}
            </div>
          </div>
          <div className="bg-card/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                <Clock size={18} />
              </div>
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {pendingCount}
            </div>
          </div>
          <div className="bg-card/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                <XCircle size={18} />
              </div>
              <span className="text-sm text-muted-foreground">Revoked</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {revokedCount}
            </div>
          </div>
        </div>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield size={18} className="text-orange-400" />
            Security Monitoring
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="pb-2 pr-4">Organisation</th>
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2 pr-4">Domain Verified</th>
                  <th className="pb-2 pr-4">MFA Required</th>
                  <th className="pb-2 pr-4">Last Activity</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {links.map((l) => (
                  <tr key={l.id} className="border-b border-border/50">
                    <td className="py-3 pr-4 font-medium text-foreground">
                      {l.linkedOrgName}
                    </td>
                    <td className="py-3 pr-4">{orgBadge(l.linkedOrgType)}</td>
                    <td className="py-3 pr-4">
                      {l.domainVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
                          <ShieldCheck size={14} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-yellow-400 text-xs">
                          <AlertTriangle size={14} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {l.mfaRequired ? (
                        <span className="text-emerald-400 text-xs">
                          Enabled
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          Optional
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {formatDate(l.approvedAt || l.invitedAt)}
                    </td>
                    <td className="py-3">{statusBadge(l.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity size={18} className="text-orange-400" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {auditLog.slice(0, 5).map((entry) => (
              <div key={entry.entryId} className="flex gap-3">
                <div className="mt-1">
                  <div className="w-2 h-2 rounded-full bg-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{entry.actorName}</span>{" "}
                    <span className="text-muted-foreground">
                      {entry.action}
                    </span>{" "}
                    {entry.newValue && (
                      <span className="text-orange-400">{entry.newValue}</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDateTime(entry.timestamp)} · {entry.actorOrg}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Pending ───────────────────────────────────────────────────────────────────

  function PendingTab() {
    return (
      <div className="space-y-6">
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Pending Invitations
          </h3>
          {pendingLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No pending invitations.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingLinks.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between bg-card/50 border border-border rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {l.linkedOrgName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {l.linkedOrgType} · {l.templateName} · Invited{" "}
                        {formatDate(l.invitedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprove(l.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                      data-ocid="channel_link.approve_button"
                    >
                      <UserCheck size={14} /> Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(l.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                      data-ocid="channel_link.reject_button"
                    >
                      <UserMinus size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Plus size={18} className="text-orange-400" />
            Send New Invitation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="domain-input"
                className="block text-xs font-medium text-muted-foreground mb-1"
              >
                Domain / Org Name
              </label>
              <input
                id="domain-input"
                type="text"
                value={inviteDomain}
                onChange={(e) => setInviteDomain(e.target.value)}
                placeholder="e.g. partner.com"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                data-ocid="channel_link.invite_domain_input"
              />
            </div>
            <div>
              <label
                htmlFor="orgtype-input"
                className="block text-xs font-medium text-muted-foreground mb-1"
              >
                Org Type
              </label>
              <select
                id="orgtype-input"
                value={inviteOrgType}
                onChange={(e) =>
                  setInviteOrgType(
                    e.target.value as "VENDOR" | "DISTRIBUTOR" | "RESELLER",
                  )
                }
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                data-ocid="channel_link.invite_org_type_select"
              >
                <option value="VENDOR">Vendor</option>
                <option value="DISTRIBUTOR">Distributor</option>
                <option value="RESELLER">Reseller</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="template-input"
                className="block text-xs font-medium text-muted-foreground mb-1"
              >
                Permission Template
              </label>
              <select
                id="template-input"
                value={inviteTemplate}
                onChange={(e) => setInviteTemplate(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                data-ocid="channel_link.invite_template_select"
              >
                {MOCK_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="expiry-input"
                className="block text-xs font-medium text-muted-foreground mb-1"
              >
                Expiry Date (optional)
              </label>
              <input
                id="expiry-input"
                type="date"
                value={inviteExpiry}
                onChange={(e) => setInviteExpiry(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                data-ocid="channel_link.invite_expiry_input"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={handleSendInvite}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              data-ocid="channel_link.send_invite_button"
            >
              Send Invitation
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Active ────────────────────────────────────────────────────────────────────

  function ActiveTab() {
    return (
      <div className="space-y-6">
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Active Connections
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="pb-2 pr-4">Org Name</th>
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2 pr-4">Direction</th>
                  <th className="pb-2 pr-4">Template</th>
                  <th className="pb-2 pr-4">Linked Date</th>
                  <th className="pb-2 pr-4">Domain</th>
                  <th className="pb-2 pr-4">Expires</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeLinks.map((l) => (
                  <tr key={l.id} className="border-b border-border/50">
                    <td className="py-3 pr-4 font-medium text-foreground">
                      {l.linkedOrgName}
                    </td>
                    <td className="py-3 pr-4">{orgBadge(l.linkedOrgType)}</td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {l.direction}
                    </td>
                    <td className="py-3 pr-4 text-orange-400">
                      {l.templateName}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {formatDate(l.approvedAt || l.invitedAt)}
                    </td>
                    <td className="py-3 pr-4">
                      {l.domainVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
                          <ShieldCheck size={14} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-yellow-400 text-xs">
                          <AlertTriangle size={14} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {l.expiresAt ? formatDate(l.expiresAt) : "Never"}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30 transition-colors"
                          data-ocid="channel_link.edit_permissions_button"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSuspend(l.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs hover:bg-orange-500/30 transition-colors"
                          data-ocid="channel_link.suspend_button"
                        >
                          <AlertTriangle size={12} /> Suspend
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRevoke(l.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors"
                          data-ocid="channel_link.revoke_button"
                        >
                          <Trash2 size={12} /> Revoke
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {activeLinks.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-6 text-center text-muted-foreground text-sm"
                    >
                      No active connections.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {suspendedLinks.length > 0 && (
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-orange-400" />
              Suspended Connections
            </h3>
            <div className="space-y-3">
              {suspendedLinks.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between bg-card/50 border border-border rounded-lg p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {l.linkedOrgName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {l.linkedOrgType} · {l.templateName} · Suspended
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleReactivate(l.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                    data-ocid="channel_link.reactivate_button"
                  >
                    <RefreshCw size={14} /> Reactivate
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Templates ─────────────────────────────────────────────────────────────────

  function TemplatesTab() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_TEMPLATES.map((t) => {
            const activeCount = links.filter(
              (l) => l.templateId === t.id && l.status === "Active",
            ).length;
            return (
              <div
                key={t.id}
                className="bg-card/80 backdrop-blur border border-border rounded-xl p-5 hover:border-orange-500/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-foreground">{t.name}</h4>
                  {t.isDefault && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                      System
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {t.description}
                </p>
                <ul className="space-y-1 mb-3">
                  <li className="text-xs text-muted-foreground flex items-center gap-2">
                    <Eye size={12} className="text-orange-400" />
                    ForgeAI: {t.forgeAIAccess}
                  </li>
                  <li className="text-xs text-muted-foreground flex items-center gap-2">
                    <Lock size={12} className="text-orange-400" />
                    Export: {t.canExport ? "Yes" : "No"}
                  </li>
                  <li className="text-xs text-muted-foreground flex items-center gap-2">
                    <Shield size={12} className="text-orange-400" />
                    MDF: {t.canManageMDF ? "Yes" : "No"}
                  </li>
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {activeCount} active link{activeCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Plus size={18} className="text-orange-400" />
            Create Custom Template
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="tplname-input"
                className="block text-xs font-medium text-muted-foreground mb-1"
              >
                Template Name
              </label>
              <input
                id="tplname-input"
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Regional Sales Partner"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                data-ocid="channel_link.custom_template_name_input"
              />
            </div>
            <div>
              <label
                htmlFor="tpldesc-input"
                className="block text-xs font-medium text-muted-foreground mb-1"
              >
                Description
              </label>
              <input
                id="tpldesc-input"
                type="text"
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="Short description..."
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                data-ocid="channel_link.custom_template_desc_input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-4">
            {ACCOUNT_DATA_SECTIONS.map((section) => (
              <div
                key={section}
                className="flex items-center justify-between py-1.5 border-b border-border/30"
              >
                <span className="text-sm text-foreground">{section}</span>
                <select
                  value={customSections[section]}
                  onChange={(e) =>
                    setCustomSections((prev) => ({
                      ...prev,
                      [section]: e.target.value as SectionAccessLevel,
                    }))
                  }
                  className="px-2 py-1 bg-background border border-input rounded text-xs text-foreground focus:outline-none"
                  data-ocid={`channel_link.section_select.${section}`}
                >
                  <option value="hidden">Hidden</option>
                  <option value="read-only">Read-only</option>
                  <option value="comment">Comment</option>
                  <option value="edit">Edit</option>
                  <option value="admin-only">Admin-only</option>
                </select>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-6 mb-4">
            <label className="inline-flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={customMdf}
                onChange={(e) => setCustomMdf(e.target.checked)}
                className="rounded border-border bg-background text-orange-500 focus:ring-orange-500/30"
                data-ocid="channel_link.custom_mdf_toggle"
              />
              MDF Access
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={customReports}
                onChange={(e) => setCustomReports(e.target.checked)}
                className="rounded border-border bg-background text-orange-500 focus:ring-orange-500/30"
                data-ocid="channel_link.custom_reports_toggle"
              />
              Reports Access
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">ForgeAI:</span>
              <select
                value={customForgeAI}
                onChange={(e) =>
                  setCustomForgeAI(
                    e.target.value as "none" | "basic" | "operational" | "full",
                  )
                }
                className="px-2 py-1 bg-background border border-input rounded text-xs text-foreground focus:outline-none"
                data-ocid="channel_link.custom_forgeai_select"
              >
                <option value="none">None</option>
                <option value="basic">Basic</option>
                <option value="operational">Operational</option>
                <option value="full">Full</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveCustomTemplate}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            data-ocid="channel_link.save_template_button"
          >
            Save Template
          </button>
        </div>
      </div>
    );
  }

  // ─── Audit ───────────────────────────────────────────────────────────────────

  function AuditTab() {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={auditSearch}
              onChange={(e) => {
                setAuditSearch(e.target.value);
                setAuditPage(1);
              }}
              placeholder="Search audit log..."
              className="pl-8 pr-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30 w-64"
              data-ocid="channel_link.audit_search_input"
            />
          </div>
          <input
            type="date"
            value={auditDateFrom}
            onChange={(e) => {
              setAuditDateFrom(e.target.value);
              setAuditPage(1);
            }}
            className="px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            data-ocid="channel_link.audit_date_from"
          />
          <input
            type="date"
            value={auditDateTo}
            onChange={(e) => {
              setAuditDateTo(e.target.value);
              setAuditPage(1);
            }}
            className="px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            data-ocid="channel_link.audit_date_to"
          />
          <button
            type="button"
            onClick={() => alert("Export CSV (mock)")}
            className="inline-flex items-center gap-2 ml-auto bg-card/50 border border-border hover:border-orange-500/30 text-foreground px-3 py-2 rounded-lg text-sm transition-colors"
            data-ocid="channel_link.export_csv_button"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left bg-card/50">
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target Org</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {auditPageRows.map((entry) => (
                  <tr key={entry.entryId} className="border-b border-border/50">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatDateTime(entry.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium">
                      {entry.actorName}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {entry.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {entry.newValue || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {entry.targetSection
                        ? `${entry.targetSection}: ${entry.previousValue} → ${entry.newValue}`
                        : "—"}
                    </td>
                  </tr>
                ))}
                {auditPageRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-muted-foreground"
                    >
                      No audit entries match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Showing {auditPageRows.length} of {filteredAudit.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAuditPage((p) => Math.max(1, p - 1))}
                disabled={auditPage <= 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-border bg-card/50 text-foreground disabled:opacity-40 hover:border-orange-500/30 transition-colors"
                data-ocid="channel_link.audit_prev_page"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {auditPage} of {auditTotalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setAuditPage((p) => Math.min(auditTotalPages, p + 1))
                }
                disabled={auditPage >= auditTotalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-border bg-card/50 text-foreground disabled:opacity-40 hover:border-orange-500/30 transition-colors"
                data-ocid="channel_link.audit_next_page"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Network size={22} className="text-orange-400" />
            External Channel Links
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage external organisation links, permissions, and shared access
            governance.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t.id
                ? "border-orange-500 text-orange-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            data-ocid={`channel_link.tab.${t.id}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "pending" && <PendingTab />}
      {activeTab === "active" && <ActiveTab />}
      {activeTab === "templates" && <TemplatesTab />}
      {activeTab === "audit" && <AuditTab />}
    </div>
  );
}
