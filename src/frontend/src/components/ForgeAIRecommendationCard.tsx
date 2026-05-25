import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useState } from "react";
import type { ForgeAIRecommendation } from "../types";

interface ForgeAIRecommendationCardProps {
  recommendation: ForgeAIRecommendation;
  onDismiss?: (id: string) => void;
  showExpand?: boolean;
}

function timeAgo(ts: bigint): string {
  const ms = Number(ts);
  const diffMs = Date.now() - ms;
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}

const RISK_CONFIG: Record<
  string,
  { label: string; colorClass: string; dotColor: string }
> = {
  Critical: {
    label: "Critical",
    colorClass: "forgeai-risk-critical forgeai-badge",
    dotColor: "#f87171",
  },
  High: {
    label: "High Risk",
    colorClass: "forgeai-risk-high forgeai-badge",
    dotColor: "#fb923c",
  },
  Medium: {
    label: "Medium Risk",
    colorClass: "forgeai-risk-medium forgeai-badge",
    dotColor: "#facc15",
  },
  Low: {
    label: "Low Risk",
    colorClass: "forgeai-risk-low forgeai-badge",
    dotColor: "#4ade80",
  },
  Opportunity: {
    label: "Opportunity",
    colorClass: "forgeai-risk-opportunity forgeai-badge",
    dotColor: "#60a5fa",
  },
};

const ENTITY_TYPE_LABEL: Record<string, string> = {
  Account: "Account",
  Deal: "Deal Registration",
  Reseller: "Reseller",
  Distributor: "Distributor",
};

export function ForgeAIRecommendationCard({
  recommendation: rec,
  onDismiss,
  showExpand = true,
}: ForgeAIRecommendationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const riskCfg = RISK_CONFIG[rec.riskTier] ?? RISK_CONFIG.Medium;
  const entityLabel =
    ENTITY_TYPE_LABEL[rec.affectedEntityType] ?? rec.affectedEntityType;

  return (
    <article
      className="forgeai-recommendation"
      data-ocid={`forgeai.recommendation.${rec.id}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={riskCfg.colorClass}
            style={{ fontSize: "11px", gap: "5px" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: riskCfg.dotColor, display: "inline-block" }}
            />
            {riskCfg.label}
          </span>
          <span className="text-[11px] text-muted-foreground font-body">
            {entityLabel}:{" "}
            <span className="font-medium text-slate-300">
              {rec.affectedEntityName}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {showExpand && (
            <button
              type="button"
              data-ocid={`forgeai.recommendation.${rec.id}.expand`}
              onClick={() => setExpanded((v) => !v)}
              className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
              aria-label={expanded ? "Collapse details" : "Expand details"}
            >
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          )}
          {onDismiss && (
            <button
              type="button"
              data-ocid={`forgeai.recommendation.${rec.id}.dismiss`}
              onClick={() => onDismiss(rec.id)}
              className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss recommendation"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm leading-relaxed text-slate-300 font-body">
        {rec.summary}
      </p>

      {/* Expanded details */}
      {expanded && rec.fullDetail && (
        <div className="text-xs leading-relaxed rounded-[0.375rem] p-3 bg-orange-500/5 border border-orange-500/10 text-slate-400 font-body">
          {rec.fullDetail}
        </div>
      )}

      {/* Next action */}
      <div className="text-xs rounded-[0.375rem] px-3 py-2 flex items-start gap-2 bg-orange-500/[0.06] border border-orange-500/15">
        <span className="font-semibold flex-shrink-0 mt-[1px] text-orange-500">
          Action:
        </span>
        <span className="text-slate-300 font-body">
          {rec.suggestedNextAction}
        </span>
      </div>

      {/* Footer row — confidence + data sources + timestamp */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          {/* Confidence bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-slate-400">
              Confidence
            </span>
            <div className="w-16 h-1 rounded-full overflow-hidden bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${rec.confidence}%`,
                  background:
                    rec.confidence >= 85
                      ? "oklch(0.65 0.24 32)"
                      : rec.confidence >= 65
                        ? "oklch(0.85 0.16 85)"
                        : "oklch(0.55 0.05 250)",
                }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              {rec.confidence}%
            </span>
          </div>

          {/* Data sources */}
          {rec.dataSources && rec.dataSources.length > 0 && (
            <div className="hidden sm:flex items-center gap-1">
              {rec.dataSources.slice(0, 2).map((src) => (
                <span
                  key={src}
                  className="text-[9px] px-1.5 py-0.5 rounded-sm bg-slate-400/10 text-slate-400 border border-slate-400/15"
                >
                  {src}
                </span>
              ))}
              {rec.dataSources.length > 2 && (
                <span className="text-[9px] text-slate-500">
                  +{rec.dataSources.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-slate-500 font-mono">
          {timeAgo(rec.recommendedAt)}
        </span>
      </div>
    </article>
  );
}
