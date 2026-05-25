import { Lock } from "lucide-react";
import type React from "react";
import { useState } from "react";

// ─── LockedField ─────────────────────────────────────────────────────────────

interface LockedFieldProps {
  children: React.ReactNode;
  reason?: string;
}

export function LockedField({ children, reason }: LockedFieldProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-ocid="channel_link.locked_field"
    >
      {children}
      {hovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm rounded-md z-10">
          <div className="flex flex-col items-center gap-1">
            <Lock className="w-5 h-5 text-orange-500" />
            <span className="text-[10px] text-muted-foreground font-medium">
              {reason || "Access restricted for external viewers"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AccessDeniedSection ─────────────────────────────────────────────────────

interface AccessDeniedSectionProps {
  section: string;
  linkedOrg?: string;
}

export function AccessDeniedSection({
  section,
  linkedOrg,
}: AccessDeniedSectionProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border border-dashed border-border bg-muted/30"
      data-ocid="channel_link.access_denied_section"
    >
      <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
        <Lock className="w-6 h-6 text-orange-500" />
      </div>
      <h3 className="text-sm font-semibold text-orange-400">Access Denied</h3>
      <p className="text-xs text-muted-foreground text-center max-w-xs">
        {linkedOrg
          ? `${linkedOrg} has not granted access to ${section}.`
          : `You do not have permission to view ${section}.`}
      </p>
      <button
        type="button"
        className="px-4 py-1.5 rounded-md bg-orange-500/10 text-orange-400 text-xs font-medium hover:bg-orange-500/20 transition-colors border border-orange-500/20"
        data-ocid="channel_link.request_access_button"
      >
        Request Access
      </button>
    </div>
  );
}

// ─── VisibilityBadge ───────────────────────────────────────────────────────────

interface VisibilityBadgeProps {
  type: "private" | "shared" | "restricted" | "external-only" | "internal-only";
}

const visibilityStyles: Record<string, string> = {
  private: "bg-red-500/15 text-red-400 border-red-500/25",
  shared: "bg-green-500/15 text-green-400 border-green-500/25",
  restricted: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "external-only": "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "internal-only": "bg-slate-500/15 text-slate-400 border-slate-500/25",
};

export function VisibilityBadge({ type }: VisibilityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${visibilityStyles[type]}`}
      data-ocid={`channel_link.visibility_badge.${type}`}
    >
      {type.replace("-", " ")}
    </span>
  );
}

// ─── OrgTagBadge ───────────────────────────────────────────────────────────────

interface OrgTagBadgeProps {
  orgType: "VENDOR" | "DISTRIBUTOR" | "RESELLER";
  orgName?: string;
}

const orgTagStyles: Record<string, string> = {
  VENDOR: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  DISTRIBUTOR: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  RESELLER: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
};

export function OrgTagBadge({ orgType, orgName }: OrgTagBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${orgTagStyles[orgType]}`}
      data-ocid={`channel_link.org_tag.${orgType}`}
    >
      [{orgType}]{orgName ? ` ${orgName}` : ""}
    </span>
  );
}
