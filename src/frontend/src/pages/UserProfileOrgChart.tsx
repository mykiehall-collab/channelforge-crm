import { Badge } from "@/components/ui/badge";
import { Lock, Mail, MapPin, X } from "lucide-react";
import { useState } from "react";
import { type TeamMember, useApp } from "../AppContext";
import { getInitials } from "../utils/channelforge";

const ORANGE = "#FF6B2B";
const BG = "#0b1724";
const BORDER = "#1e3050";
const TEXT_MUTED = "#7D8AA0";

interface OrgNode extends TeamMember {
  directReports: OrgNode[];
}

function buildOrgTree(members: TeamMember[]): OrgNode[] {
  const nodeMap = new Map<string, OrgNode>();
  for (const m of members) nodeMap.set(m.id, { ...m, directReports: [] });
  const roots: OrgNode[] = [];
  for (const [, node] of nodeMap) {
    if (!node.reportingToId || !nodeMap.has(node.reportingToId)) {
      roots.push(node);
    } else {
      nodeMap.get(node.reportingToId)!.directReports.push(node);
    }
  }
  return roots;
}

function avatarColor(type: TeamMember["userType"]) {
  if (type === "PrimaryAdmin") return ORANGE;
  if (type === "SecondaryAdmin") return "#2C5282";
  return "#2D3748";
}

function userTypeBadgeStyle(type: TeamMember["userType"]) {
  if (type === "PrimaryAdmin")
    return {
      background: "rgba(255,107,43,0.18)",
      color: ORANGE,
      border: "1px solid rgba(255,107,43,0.35)",
    };
  if (type === "SecondaryAdmin")
    return {
      background: "rgba(99,179,237,0.15)",
      color: "#63B3ED",
      border: "1px solid rgba(99,179,237,0.3)",
    };
  return {
    background: "rgba(148,163,184,0.12)",
    color: "#94A3B8",
    border: "1px solid rgba(148,163,184,0.25)",
  };
}

function userTypeDisplayLabel(type: TeamMember["userType"]) {
  if (type === "PrimaryAdmin") return "Primary Admin";
  if (type === "SecondaryAdmin") return "Secondary Admin";
  return "End User";
}

function ProfilePopover({
  member,
  onClose,
  allMembers,
}: {
  member: TeamMember;
  onClose: () => void;
  allMembers: TeamMember[];
}) {
  const manager = allMembers.find((m) => m.id === member.reportingToId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="presentation"
      style={{ background: "rgba(0,0,0,0.7)" }}
      data-ocid="profile.org_node.dialog"
    >
      <div
        className="rounded-2xl p-5 w-full max-w-sm shadow-2xl"
        style={{ background: "#0e1e35", border: `1px solid ${BORDER}` }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ring-2 ring-offset-2"
              style={{ background: avatarColor(member.userType) }}
            >
              {member.profilePhotoUrl ? (
                <img
                  src={member.profilePhotoUrl}
                  alt={member.fullName}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                getInitials(member.fullName)
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {member.fullName}
              </h3>
              <Badge
                style={userTypeBadgeStyle(member.userType)}
                className="text-[10px] mt-1"
              >
                {userTypeDisplayLabel(member.userType)}
              </Badge>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-white/10 transition-colors"
            aria-label="Close"
            data-ocid="profile.org_node.close_button"
          >
            <X size={16} style={{ color: TEXT_MUTED }} />
          </button>
        </div>

        <div className="space-y-2.5">
          {[
            { Icon: Mail, label: "Email", value: member.email },
            { Icon: MapPin, label: "Territory", value: member.territory },
            { Icon: null, label: "Job Title", value: member.jobTitle },
            { Icon: null, label: "Department", value: member.department },
            {
              Icon: null,
              label: "Reports To",
              value:
                manager?.fullName ??
                (member.userType === "PrimaryAdmin" ? "Top Level" : "—"),
            },
          ].map(({ Icon, label, value }) =>
            value ? (
              <div key={label} className="flex items-start gap-2.5">
                {Icon && (
                  <Icon
                    size={13}
                    style={{ color: TEXT_MUTED, flexShrink: 0, marginTop: 2 }}
                  />
                )}
                {!Icon && <span className="w-[13px] flex-shrink-0" />}
                <div>
                  <div
                    className="text-[10px] uppercase tracking-wider"
                    style={{ color: TEXT_MUTED }}
                  >
                    {label}
                  </div>
                  <div className="text-sm text-foreground">{value}</div>
                </div>
              </div>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}

function OrgTreeNode({
  node,
  allMembers,
  isRoot = false,
}: {
  node: OrgNode;
  allMembers: TeamMember[];
  isRoot?: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const hasChildren = node.directReports.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Connector line from parent */}
      {!isRoot && (
        <div
          className="w-px h-5 flex-shrink-0"
          style={{ background: BORDER }}
        />
      )}

      {/* Node card */}
      <button
        type="button"
        className="rounded-xl px-3 py-2.5 cursor-pointer transition-all hover:border-white/20 hover:shadow-md select-none org-chart-node text-left w-full"
        style={{
          background: isRoot
            ? "rgba(255,107,43,0.08)"
            : "rgba(255,255,255,0.03)",
          border: isRoot
            ? "1px solid rgba(255,107,43,0.3)"
            : `1px solid ${BORDER}`,
          minWidth: "160px",
          maxWidth: "200px",
        }}
        onClick={() => setShowProfile(true)}
        data-ocid="profile.org.card"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
            style={{ background: avatarColor(node.userType) }}
          >
            {node.profilePhotoUrl ? (
              <img
                src={node.profilePhotoUrl}
                alt={node.fullName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(node.fullName)
            )}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-foreground truncate">
              {node.fullName}
            </div>
            {node.jobTitle && (
              <div
                className="text-[10px] truncate"
                style={{ color: TEXT_MUTED }}
              >
                {node.jobTitle}
              </div>
            )}
            <Badge
              style={userTypeBadgeStyle(node.userType)}
              className="text-[9px] px-1 py-0 mt-0.5"
            >
              {userTypeDisplayLabel(node.userType)}
            </Badge>
          </div>
        </div>
        {(node.department || node.territory) && (
          <div className="mt-2 flex flex-wrap gap-1">
            {node.department && (
              <span
                className="text-[9px] px-1.5 py-0.5 rounded"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: TEXT_MUTED,
                }}
              >
                {node.department}
              </span>
            )}
            {node.territory && (
              <span
                className="text-[9px] px-1.5 py-0.5 rounded"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: TEXT_MUTED,
                }}
              >
                {node.territory}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Expand / collapse toggle */}
      {hasChildren && (
        <div className="flex flex-col items-center">
          <div className="w-px h-3" style={{ background: BORDER }} />
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center transition-colors hover:bg-white/20"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: TEXT_MUTED,
              border: `1px solid ${BORDER}`,
            }}
            aria-label={expanded ? "Collapse" : "Expand"}
            data-ocid="profile.org.toggle"
          >
            {expanded ? "−" : "+"}
          </button>
        </div>
      )}

      {/* Children row */}
      {hasChildren && expanded && (
        <div className="flex flex-col items-center">
          <div className="w-px h-3" style={{ background: BORDER }} />
          {/* Horizontal connector */}
          {node.directReports.length > 1 && (
            <div
              className="h-px"
              style={{
                background: BORDER,
                width: `calc(${node.directReports.length} * 200px + ${node.directReports.length - 1} * 16px)`,
                maxWidth: "90vw",
              }}
            />
          )}
          <div className="flex items-start gap-4 mt-0">
            {node.directReports.map((child) => (
              <OrgTreeNode
                key={child.id}
                node={child}
                allMembers={allMembers}
              />
            ))}
          </div>
        </div>
      )}

      {showProfile && (
        <ProfilePopover
          member={node}
          onClose={() => setShowProfile(false)}
          allMembers={allMembers}
        />
      )}
    </div>
  );
}

export function OrgChartTab() {
  const { teamMembers } = useApp();

  const roots = buildOrgTree(teamMembers ?? []);

  return (
    <div className="space-y-4" data-ocid="profile.orgchart_tab">
      {/* Privacy notice */}
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-2.5"
        style={{
          background: "rgba(255,107,43,0.06)",
          border: "1px solid rgba(255,107,43,0.2)",
        }}
      >
        <Lock size={14} style={{ color: ORANGE, flexShrink: 0 }} />
        <p className="text-xs" style={{ color: "#FFA970" }}>
          This org chart is private to your organisation. External partners
          cannot view this.
        </p>
      </div>

      {/* Chart container */}
      <div
        className="rounded-xl p-6 overflow-x-auto org-chart-container"
        style={{ background: BG, border: `1px solid ${BORDER}` }}
        data-ocid="profile.org.chart"
      >
        {roots.length === 0 ? (
          <div className="text-center py-8" data-ocid="profile.org.empty_state">
            <p className="text-sm" style={{ color: TEXT_MUTED }}>
              No org chart data available.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-0 min-w-max pb-4">
            {roots.map((root) => (
              <OrgTreeNode
                key={root.id}
                node={root}
                allMembers={teamMembers ?? []}
                isRoot
              />
            ))}
          </div>
        )}
      </div>

      <p className="text-center text-[10px]" style={{ color: TEXT_MUTED }}>
        Click any card to view full profile. Click +/− to expand or collapse a
        branch.
      </p>
    </div>
  );
}
