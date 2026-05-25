import { Lock, X } from "lucide-react";
import type React from "react";

interface ChannelLinkBannerProps {
  linkedOrgName: string;
  linkedOrgType: "VENDOR" | "DISTRIBUTOR" | "RESELLER";
  onDismiss: () => void;
}

const orgBadgeStyles: Record<string, string> = {
  VENDOR: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  DISTRIBUTOR: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  RESELLER: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export function ChannelLinkBanner({
  linkedOrgName,
  linkedOrgType,
  onDismiss,
}: ChannelLinkBannerProps) {
  return (
    <div
      className="sticky top-0 z-50 w-full border-l-4 border-orange-500 bg-slate-900/95 backdrop-blur"
      data-ocid="channel_link.banner"
    >
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <Lock className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <span className="text-sm text-slate-300">
            You are viewing this workspace via Channel Link from{" "}
            <span className="font-bold text-orange-400">{linkedOrgName}</span>
            <span className="text-slate-400">
              . Access is limited to approved data only.
            </span>
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${orgBadgeStyles[linkedOrgType]}`}
          >
            {linkedOrgType}
          </span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded-md text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
          aria-label="Dismiss banner"
          data-ocid="channel_link.banner.dismiss_button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
