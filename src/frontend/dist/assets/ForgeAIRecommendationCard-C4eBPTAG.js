import { r as reactExports, j as jsxRuntimeExports, ac as ChevronUp, k as ChevronDown, X } from "./index-DvFvlUBj.js";
function timeAgo(ts) {
  const ms = Number(ts);
  const diffMs = Date.now() - ms;
  const diffMin = Math.floor(diffMs / 6e4);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}
const RISK_CONFIG = {
  Critical: {
    label: "Critical",
    colorClass: "forgeai-risk-critical forgeai-badge",
    dotColor: "#f87171"
  },
  High: {
    label: "High Risk",
    colorClass: "forgeai-risk-high forgeai-badge",
    dotColor: "#fb923c"
  },
  Medium: {
    label: "Medium Risk",
    colorClass: "forgeai-risk-medium forgeai-badge",
    dotColor: "#facc15"
  },
  Low: {
    label: "Low Risk",
    colorClass: "forgeai-risk-low forgeai-badge",
    dotColor: "#4ade80"
  },
  Opportunity: {
    label: "Opportunity",
    colorClass: "forgeai-risk-opportunity forgeai-badge",
    dotColor: "#60a5fa"
  }
};
const ENTITY_TYPE_LABEL = {
  Account: "Account",
  Deal: "Deal Registration",
  Reseller: "Reseller",
  Distributor: "Distributor"
};
function ForgeAIRecommendationCard({
  recommendation: rec,
  onDismiss,
  showExpand = true
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const riskCfg = RISK_CONFIG[rec.riskTier] ?? RISK_CONFIG.Medium;
  const entityLabel = ENTITY_TYPE_LABEL[rec.affectedEntityType] ?? rec.affectedEntityType;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "article",
    {
      className: "forgeai-recommendation",
      "data-ocid": `forgeai.recommendation.${rec.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: riskCfg.colorClass,
                style: { fontSize: "11px", gap: "5px" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "w-1.5 h-1.5 rounded-full flex-shrink-0",
                      style: { background: riskCfg.dotColor, display: "inline-block" }
                    }
                  ),
                  riskCfg.label
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground font-body", children: [
              entityLabel,
              ":",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-300", children: rec.affectedEntityName })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-shrink-0", children: [
            showExpand && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `forgeai.recommendation.${rec.id}.expand`,
                onClick: () => setExpanded((v) => !v),
                className: "p-1 rounded text-muted-foreground hover:text-foreground transition-colors",
                "aria-label": expanded ? "Collapse details" : "Expand details",
                children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 13 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 13 })
              }
            ),
            onDismiss && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `forgeai.recommendation.${rec.id}.dismiss`,
                onClick: () => onDismiss(rec.id),
                className: "p-1 rounded text-muted-foreground hover:text-foreground transition-colors",
                "aria-label": "Dismiss recommendation",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-slate-300 font-body", children: rec.summary }),
        expanded && rec.fullDetail && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs leading-relaxed rounded-[0.375rem] p-3 bg-orange-500/5 border border-orange-500/10 text-slate-400 font-body", children: rec.fullDetail }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs rounded-[0.375rem] px-3 py-2 flex items-start gap-2 bg-orange-500/[0.06] border border-orange-500/15", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold flex-shrink-0 mt-[1px] text-orange-500", children: "Action:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 font-body", children: rec.suggestedNextAction })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-slate-400", children: "Confidence" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-1 rounded-full overflow-hidden bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full rounded-full transition-all duration-500",
                  style: {
                    width: `${rec.confidence}%`,
                    background: rec.confidence >= 85 ? "oklch(0.65 0.24 32)" : rec.confidence >= 65 ? "oklch(0.85 0.16 85)" : "oklch(0.55 0.05 250)"
                  }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-slate-400", children: [
                rec.confidence,
                "%"
              ] })
            ] }),
            rec.dataSources && rec.dataSources.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-1", children: [
              rec.dataSources.slice(0, 2).map((src) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[9px] px-1.5 py-0.5 rounded-sm bg-slate-400/10 text-slate-400 border border-slate-400/15",
                  children: src
                },
                src
              )),
              rec.dataSources.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-slate-500", children: [
                "+",
                rec.dataSources.length - 2
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 font-mono", children: timeAgo(rec.recommendedAt) })
        ] })
      ]
    }
  );
}
export {
  ForgeAIRecommendationCard as F
};
