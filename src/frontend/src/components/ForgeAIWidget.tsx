import { useNavigate } from "@tanstack/react-router";
import { Activity, AlertTriangle, ArrowRight, Brain } from "lucide-react";
import { useForgeAI } from "../hooks/useForgeAI";
import { ForgeAIRecommendationCard } from "./ForgeAIRecommendationCard";

export function ForgeAIWidget() {
  const navigate = useNavigate();
  const {
    recommendations,
    engagementGaps,
    isAnalyzing,
    lastAnalyzedAt,
    dismissRecommendation,
  } = useForgeAI();

  const topRecs = recommendations.slice(0, 4);
  const criticalCount = recommendations.filter(
    (r) => r.riskTier === "Critical",
  ).length;
  const activeGapCount = engagementGaps.length;

  return (
    <section
      className="forgeai-card intelligence-pulse flex flex-col gap-4 border-orange-500/20"
      data-ocid="forgeai.widget"
    >
      {/* Widget header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[0.375rem] flex items-center justify-center flex-shrink-0 bg-orange-500/10 border border-orange-500/20">
            <Brain size={14} className="text-orange-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground font-display">
                ForgeAI
              </span>
              {/* Live pulse dot */}
              <span
                className="forgeai-pulse forgeai-pulse-dot"
                aria-label="Analysis active"
              />
            </div>
            <p className="text-[10px] text-slate-500 font-body">
              {isAnalyzing
                ? "Analyzing ecosystem…"
                : lastAnalyzedAt
                  ? `Last analysis ${formatTime(lastAnalyzedAt)}`
                  : "Operational Intelligence"}
            </p>
          </div>
        </div>

        <button
          type="button"
          data-ocid="forgeai.widget.view_all"
          onClick={() => navigate({ to: "/forge-ai" })}
          className="flex items-center gap-1 text-[11px] font-medium transition-colors text-orange-500"
        >
          View All
          <ArrowRight size={11} />
        </button>
      </div>

      {/* Ecosystem health summary */}
      <div className="flex items-center gap-4 rounded-[0.375rem] px-3 py-2 bg-white/5 border border-white/10">
        {criticalCount > 0 && (
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={12} className="text-amber-400" />
            <span className="text-[11px] font-semibold text-amber-400">
              {criticalCount} critical
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Activity size={12} className="text-slate-400" />
          <span className="text-[11px] text-slate-400">
            {recommendations.length} active insight
            {recommendations.length !== 1 ? "s" : ""}
          </span>
        </div>
        {activeGapCount > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-yellow-400" />
            <span className="text-[11px] text-slate-400">
              {activeGapCount} engagement gap
              {activeGapCount !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Recommendation cards */}
      <div
        className="flex flex-col gap-2"
        data-ocid="forgeai.widget.recommendations_list"
      >
        {topRecs.length === 0 ? (
          <div
            className="text-center py-6"
            data-ocid="forgeai.widget.empty_state"
          >
            <p className="text-sm text-slate-500">No active recommendations</p>
          </div>
        ) : (
          topRecs.map((rec, i) => (
            <div key={rec.id} data-ocid={`forgeai.widget.item.${i + 1}`}>
              <ForgeAIRecommendationCard
                recommendation={rec}
                onDismiss={dismissRecommendation}
                showExpand={false}
              />
            </div>
          ))
        )}
      </div>

      {recommendations.length > 4 && (
        <button
          type="button"
          data-ocid="forgeai.widget.view_more"
          onClick={() => navigate({ to: "/forge-ai" })}
          className="w-full text-center text-xs py-2 rounded-[0.375rem] transition-colors text-slate-400 border border-slate-700/40 bg-slate-400/5"
        >
          +{recommendations.length - 4} more insight
          {recommendations.length - 4 !== 1 ? "s" : ""} — View ForgeAI
        </button>
      )}
    </section>
  );
}

function formatTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  return `${Math.floor(diffMin / 60)}h ago`;
}
