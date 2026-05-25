import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Shield, Users } from "lucide-react";
import { type TeamMember, useApp } from "../AppContext";
import { getInitials } from "../utils/channelforge";

const ORANGE = "#FF6B2B";
const BG = "#0b1724";
const BORDER = "#1e3050";
const TEXT_MUTED = "#7D8AA0";

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

function avatarColor(type: TeamMember["userType"]) {
  if (type === "PrimaryAdmin") return ORANGE;
  if (type === "SecondaryAdmin") return "#2C5282";
  return "#2D3748";
}

function userTypeDisplayLabel(type: TeamMember["userType"]) {
  if (type === "PrimaryAdmin") return "Primary Admin";
  if (type === "SecondaryAdmin") return "Secondary Admin";
  return "End User";
}

function getManagerName(member: TeamMember, members: TeamMember[]): string {
  if (!member.reportingToId) return "";
  const manager = members.find((m) => m.id === member.reportingToId);
  return manager ? manager.fullName : "";
}

function TeamMemberCard({
  member,
  allMembers,
}: { member: TeamMember; allMembers: TeamMember[] }) {
  const managerName = getManagerName(member, allMembers);

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 transition-all hover:border-white/20 hover:shadow-lg team-member-card"
      style={{ background: BG, border: `1px solid ${BORDER}` }}
      data-ocid="profile.team.card"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ring-2 ring-offset-2 ${
            member.userType === "PrimaryAdmin"
              ? "ring-accent"
              : "ring-transparent"
          }`}
          style={{ background: avatarColor(member.userType) }}
        >
          {member.profilePhotoUrl ? (
            <img
              src={member.profilePhotoUrl}
              alt={member.fullName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(member.fullName)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground truncate">
              {member.fullName}
            </span>
            <Badge
              style={userTypeBadgeStyle(member.userType)}
              className="text-[10px] px-1.5 py-0"
            >
              {userTypeDisplayLabel(member.userType)}
            </Badge>
          </div>
          {member.jobTitle && (
            <div
              className="text-xs mt-0.5 truncate"
              style={{ color: TEXT_MUTED }}
            >
              {member.jobTitle}
            </div>
          )}
        </div>
      </div>

      <Separator style={{ background: BORDER }} />

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
        {[
          { label: "Department", value: member.department },
          { label: "Territory", value: member.territory },
          { label: "Role", value: member.role },
          {
            label: "Reports To",
            value:
              managerName ||
              (member.userType === "PrimaryAdmin" ? "Top Level" : "—"),
          },
        ].map(({ label, value }) =>
          value ? (
            <div key={label}>
              <span className="block" style={{ color: TEXT_MUTED }}>
                {label}
              </span>
              <span className="text-foreground font-medium">{value}</span>
            </div>
          ) : null,
        )}
      </div>

      <Button
        type="button"
        size="sm"
        className="w-full gap-1.5 text-xs mt-1"
        style={{
          background: "rgba(255,107,43,0.12)",
          color: ORANGE,
          border: "1px solid rgba(255,107,43,0.25)",
        }}
        data-ocid="profile.team.message_button"
      >
        <MessageSquare size={12} /> Message
      </Button>
    </div>
  );
}

export function MyTeamTab() {
  const { teamMembers } = useApp();

  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div
        className="rounded-xl p-10 text-center"
        style={{ background: BG, border: `1px solid ${BORDER}` }}
        data-ocid="profile.team.empty_state"
      >
        <Users
          size={32}
          className="mx-auto mb-3"
          style={{ color: TEXT_MUTED }}
        />
        <p className="text-sm font-medium text-foreground">
          No team members found
        </p>
        <p className="text-xs mt-1" style={{ color: TEXT_MUTED }}>
          Your team members will appear here once your workspace is set up.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="profile.team_tab">
      {/* Privacy notice */}
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-2.5"
        style={{
          background: "rgba(99,179,237,0.08)",
          border: "1px solid rgba(99,179,237,0.2)",
        }}
      >
        <Shield size={14} style={{ color: "#63B3ED", flexShrink: 0 }} />
        <p className="text-xs" style={{ color: "#90CDF4" }}>
          Showing teammates in your organisation. Visible to same-workspace
          members only.
        </p>
      </div>

      {/* Primary Admin section */}
      {teamMembers.filter((m) => m.userType === "PrimaryAdmin").length > 0 && (
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-wider mb-2.5 px-0.5"
            style={{ color: TEXT_MUTED }}
          >
            Primary Admin
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {teamMembers
              .filter((m) => m.userType === "PrimaryAdmin")
              .map((m) => (
                <TeamMemberCard
                  key={m.id}
                  member={m}
                  allMembers={teamMembers}
                />
              ))}
          </div>
        </div>
      )}

      {/* Secondary Admin section */}
      {teamMembers.filter((m) => m.userType === "SecondaryAdmin").length >
        0 && (
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-wider mb-2.5 px-0.5"
            style={{ color: TEXT_MUTED }}
          >
            Secondary Admins
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {teamMembers
              .filter((m) => m.userType === "SecondaryAdmin")
              .map((m) => (
                <TeamMemberCard
                  key={m.id}
                  member={m}
                  allMembers={teamMembers}
                />
              ))}
          </div>
        </div>
      )}

      {/* End Users section */}
      {teamMembers.filter((m) => m.userType === "EndUser").length > 0 && (
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-wider mb-2.5 px-0.5"
            style={{ color: TEXT_MUTED }}
          >
            Team Members
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {teamMembers
              .filter((m) => m.userType === "EndUser")
              .map((m) => (
                <TeamMemberCard
                  key={m.id}
                  member={m}
                  allMembers={teamMembers}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
