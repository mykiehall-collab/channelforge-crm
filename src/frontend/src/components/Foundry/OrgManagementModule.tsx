import {
  Building2,
  ChevronDown,
  ChevronUp,
  Pencil,
  Save,
  Users,
  X,
} from "lucide-react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { type TeamMember, useApp } from "../../AppContext";

// ─── Local re-used mini-components ───────────────────────────────────────────

function GlassCard({
  children,
  className = "",
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border backdrop-blur-sm transition-all ${
        glow
          ? "border-orange-500/30 shadow-[0_0_24px_rgba(249,115,22,0.08),inset_0_1px_0_rgba(255,255,255,0.05)]"
          : "border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      } bg-white/[0.04] ${className}`}
    >
      {children}
    </div>
  );
}

function UserTypeBadge({ userType }: { userType: TeamMember["userType"] }) {
  const map: Record<TeamMember["userType"], string> = {
    PrimaryAdmin:
      "bg-orange-500/15 text-orange-400 border border-orange-500/30",
    SecondaryAdmin: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    EndUser: "bg-white/5 text-muted-foreground border border-white/10",
  };
  const label: Record<TeamMember["userType"], string> = {
    PrimaryAdmin: "Primary Admin",
    SecondaryAdmin: "Secondary Admin",
    EndUser: "End User",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${map[userType]}`}
    >
      {label[userType]}
    </span>
  );
}

function Avatar({ member }: { member: TeamMember }) {
  if (member.profilePhotoUrl) {
    return (
      <img
        src={member.profilePhotoUrl}
        alt={member.fullName}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
    );
  }
  const initials = member.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const colours = [
    "bg-orange-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-purple-500",
    "bg-rose-500",
  ];
  const colour =
    colours[member.id.charCodeAt(member.id.length - 1) % colours.length];
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 ${colour}`}
    >
      {initials}
    </div>
  );
}

// ─── Edit row ─────────────────────────────────────────────────────────────────

type EditState = {
  department: string;
  territory: string;
  jobTitle: string;
  reportingToId: string;
};

function EditRow({
  member,
  managers,
  onSave,
  onCancel,
}: {
  member: TeamMember;
  managers: TeamMember[];
  onSave: (id: string, updates: Partial<TeamMember>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<EditState>({
    department: member.department,
    territory: member.territory,
    jobTitle: member.jobTitle,
    reportingToId: member.reportingToId ?? "",
  });

  function set(field: keyof EditState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <tr
      data-ocid={`foundry.org.edit_row.${member.id}`}
      className="bg-orange-500/[0.03] border-b border-orange-500/10"
    >
      <td colSpan={7} className="px-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label
              htmlFor={`dept-${member.id}`}
              className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium"
            >
              Department
            </label>
            <input
              id={`dept-${member.id}`}
              data-ocid={`foundry.org.department_input.${member.id}`}
              type="text"
              value={form.department}
              onChange={(e) => set("department", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground focus:outline-none focus:border-orange-500/50 placeholder:text-muted-foreground/50"
              placeholder="e.g. Sales"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor={`territory-${member.id}`}
              className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium"
            >
              Territory
            </label>
            <input
              id={`territory-${member.id}`}
              data-ocid={`foundry.org.territory_input.${member.id}`}
              type="text"
              value={form.territory}
              onChange={(e) => set("territory", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground focus:outline-none focus:border-orange-500/50 placeholder:text-muted-foreground/50"
              placeholder="e.g. EMEA"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor={`jobtitle-${member.id}`}
              className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium"
            >
              Job Title
            </label>
            <input
              id={`jobtitle-${member.id}`}
              data-ocid={`foundry.org.jobtitle_input.${member.id}`}
              type="text"
              value={form.jobTitle}
              onChange={(e) => set("jobTitle", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground focus:outline-none focus:border-orange-500/50 placeholder:text-muted-foreground/50"
              placeholder="e.g. Account Executive"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor={`reportsto-${member.id}`}
              className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium"
            >
              Reports To
            </label>
            <select
              id={`reportsto-${member.id}`}
              data-ocid={`foundry.org.reports_to_select.${member.id}`}
              value={form.reportingToId}
              onChange={(e) => set("reportingToId", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground focus:outline-none focus:border-orange-500/50"
            >
              <option value="">— None —</option>
              {managers
                .filter((m) => m.id !== member.id)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} (
                    {m.userType === "PrimaryAdmin"
                      ? "Primary Admin"
                      : "Secondary Admin"}
                    )
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            data-ocid={`foundry.org.save_button.${member.id}`}
            onClick={() =>
              onSave(member.id, {
                department: form.department,
                territory: form.territory,
                jobTitle: form.jobTitle,
                reportingToId: form.reportingToId || null,
              })
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-colors"
          >
            <Save size={12} />
            Save Changes
          </button>
          <button
            type="button"
            data-ocid={`foundry.org.cancel_button.${member.id}`}
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 transition-colors"
          >
            <X size={12} />
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main module ──────────────────────────────────────────────────────────────

export function OrgManagementModule() {
  const { teamMembers, setTeamMembers, isPrimaryAdmin, userProfile } = useApp();

  // Derive current user id from team members by matching email to logged-in profile
  const currentUserId: string | null =
    teamMembers.find(
      (m) =>
        userProfile &&
        m.email.toLowerCase() === (userProfile.email ?? "").toLowerCase(),
    )?.id ?? null;

  const isAdmin = isPrimaryAdmin();

  // For Secondary Admin: only manage their direct reports
  const visibleMembers = isAdmin
    ? teamMembers
    : teamMembers.filter((m) => m.reportingToId === currentUserId);

  // Employee number visibility toggle
  const [showEmpNumbers, setShowEmpNumbers] = useState<boolean>(() => {
    try {
      return localStorage.getItem("cf_show_employee_numbers") === "true";
    } catch {
      return false;
    }
  });

  const handleToggleEmpNumbers = useCallback((val: boolean) => {
    setShowEmpNumbers(val);
    try {
      localStorage.setItem("cf_show_employee_numbers", String(val));
    } catch {}
  }, []);

  // Track which row is open for editing
  const [editingId, setEditingId] = useState<string | null>(null);

  // Managers = PrimaryAdmin + SecondaryAdmin in the team
  const managers = teamMembers.filter(
    (m) => m.userType === "PrimaryAdmin" || m.userType === "SecondaryAdmin",
  );

  function handleSave(id: string, updates: Partial<TeamMember>) {
    const updated = teamMembers.map((m) =>
      m.id === id ? { ...m, ...updates } : m,
    );
    setTeamMembers(updated);
    setEditingId(null);
  }

  // Stats
  const totalCount = visibleMembers.length;
  const adminCount = visibleMembers.filter(
    (m) => m.userType === "PrimaryAdmin" || m.userType === "SecondaryAdmin",
  ).length;
  const deptSet = new Set(
    visibleMembers.map((m) => m.department).filter(Boolean),
  );

  // Sort: PrimaryAdmin first, then SecondaryAdmin, then EndUser, alphabetically within
  const sortedMembers = [...visibleMembers].sort((a, b) => {
    const order = { PrimaryAdmin: 0, SecondaryAdmin: 1, EndUser: 2 };
    const diff = order[a.userType] - order[b.userType];
    return diff !== 0 ? diff : a.fullName.localeCompare(b.fullName);
  });

  function getReportsToName(id: string | null): string {
    if (!id) return "—";
    return teamMembers.find((m) => m.id === id)?.fullName ?? "—";
  }

  // Department grouping state
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  useEffect(() => {
    if (deptSet.size > 0) {
      setExpandedDept(null);
    }
  }, [deptSet.size]);

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Team &amp; Org Structure
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isAdmin
              ? "Manage all team members, reporting lines, departments, and territories"
              : "Manage your direct reports, reporting lines, and team allocation"}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Team Members",
            value: String(totalCount),
            icon: Users,
            color: "text-orange-400",
          },
          {
            label: "Admins",
            value: String(adminCount),
            icon: Users,
            color: "text-blue-400",
          },
          {
            label: "Departments",
            value: String(deptSet.size),
            icon: Building2,
            color: "text-emerald-400",
          },
        ].map((s) => (
          <GlassCard key={s.label} className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={13} className={s.color} />
              <span className="text-[11px] text-muted-foreground">
                {s.label}
              </span>
            </div>
            <div className="text-xl font-bold text-foreground">{s.value}</div>
          </GlassCard>
        ))}
      </div>

      {/* Employee number visibility toggle */}
      {isAdmin && (
        <GlassCard className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Show employee numbers on profiles
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                When enabled, employee numbers are visible on user profile pages
                across the platform.
              </p>
            </div>
            <button
              type="button"
              data-ocid="foundry.org.emp_number_toggle"
              role="switch"
              aria-checked={showEmpNumbers}
              onClick={() => handleToggleEmpNumbers(!showEmpNumbers)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                showEmpNumbers
                  ? "bg-orange-500 border-orange-500"
                  : "bg-white/10 border-white/10"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 mt-0.5 ${
                  showEmpNumbers ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </GlassCard>
      )}

      {/* Team members table */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {[
                  "Name",
                  "User Type",
                  "Job Title",
                  "Department",
                  "Territory",
                  "Reports To",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedMembers.map((member, i) => {
                const isEditing = editingId === member.id;
                return (
                  <Fragment key={member.id}>
                    <tr
                      data-row-id={member.id}
                      data-ocid={`foundry.org.item.${i + 1}`}
                      className={`border-b border-white/5 last:border-0 transition-colors ${
                        isEditing
                          ? "bg-orange-500/[0.04]"
                          : "hover:bg-white/[0.03]"
                      }`}
                    >
                      {/* Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar member={member} />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">
                              {member.fullName}
                            </div>
                            <div className="text-[11px] text-muted-foreground truncate">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* User Type */}
                      <td className="px-4 py-3">
                        <UserTypeBadge userType={member.userType} />
                      </td>
                      {/* Job Title */}
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {member.jobTitle || (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                      {/* Department */}
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {member.department || (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                      {/* Territory */}
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {member.territory || (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                      {/* Reports To */}
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {getReportsToName(member.reportingToId)}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          data-ocid={`foundry.org.edit_button.${i + 1}`}
                          onClick={() =>
                            setEditingId(isEditing ? null : member.id)
                          }
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isEditing
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                              : "border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20"
                          }`}
                        >
                          {isEditing ? (
                            <ChevronUp size={12} />
                          ) : (
                            <Pencil size={12} />
                          )}
                          {isEditing ? "Close" : "Edit"}
                        </button>
                      </td>
                    </tr>
                    {isEditing && (
                      <EditRow
                        member={member}
                        managers={managers}
                        onSave={handleSave}
                        onCancel={() => setEditingId(null)}
                      />
                    )}
                  </Fragment>
                );
              })}
              {sortedMembers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-muted-foreground"
                    data-ocid="foundry.org.empty_state"
                  >
                    <Users
                      size={32}
                      className="mx-auto mb-3 text-muted-foreground/30"
                    />
                    <p className="font-medium text-foreground/60">
                      No team members found
                    </p>
                    <p className="text-xs mt-1 text-muted-foreground/60">
                      {isAdmin
                        ? "Add users to your workspace to manage them here."
                        : "You have no direct reports assigned to you yet."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Department overview accordion */}
      {isAdmin && deptSet.size > 0 && (
        <GlassCard className="overflow-hidden">
          <div className="px-4 py-3 border-b border-white/8">
            <h4 className="text-sm font-semibold text-foreground">
              Department Overview
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Expand a department to see members grouped by reporting line
            </p>
          </div>
          <div className="divide-y divide-white/5">
            {Array.from(deptSet).map((dept) => {
              const members = sortedMembers.filter(
                (m) => m.department === dept,
              );
              const isExpanded = expandedDept === dept;
              const secondaryAdmins = members.filter(
                (m) => m.userType === "SecondaryAdmin",
              );
              return (
                <div key={dept}>
                  <button
                    type="button"
                    data-ocid={`foundry.org.dept_${dept.toLowerCase().replace(/\s+/g, "_")}.toggle`}
                    onClick={() => setExpandedDept(isExpanded ? null : dept)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-orange-500/10">
                        <Building2 size={12} className="text-orange-400" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">
                          {dept}
                        </span>
                        <span className="ml-2 text-[11px] text-muted-foreground">
                          {members.length} member
                          {members.length !== 1 ? "s" : ""}
                          {secondaryAdmins.length > 0 &&
                            ` · ${secondaryAdmins.map((a) => a.fullName).join(", ")} (Head)`}
                        </span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp
                        size={14}
                        className="text-muted-foreground flex-shrink-0"
                      />
                    ) : (
                      <ChevronDown
                        size={14}
                        className="text-muted-foreground flex-shrink-0"
                      />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 space-y-2">
                      {members.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/5"
                        >
                          <Avatar member={m} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground truncate">
                                {m.fullName}
                              </span>
                              <UserTypeBadge userType={m.userType} />
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">
                              {m.jobTitle}
                              {m.territory ? ` · ${m.territory}` : ""}
                              {m.reportingToId
                                ? ` · Reports to ${getReportsToName(m.reportingToId)}`
                                : ""}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
