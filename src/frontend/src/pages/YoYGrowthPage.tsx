import type { KPIStatus } from "@/types/kpi";
import {
  BarChart3,
  Globe,
  Minus,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useKPIGovernance } from "../hooks/useKPIGovernance";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  KPIStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  exceeding: {
    label: "Exceeding",
    color: "text-purple-300",
    bg: "bg-purple-500/15",
    border: "border-purple-500/40",
  },
  ahead: {
    label: "Ahead",
    color: "text-blue-300",
    bg: "bg-blue-500/15",
    border: "border-blue-500/40",
  },
  on_track: {
    label: "On Track",
    color: "text-green-300",
    bg: "bg-green-500/15",
    border: "border-green-500/40",
  },
  growth_risk: {
    label: "Growth Risk",
    color: "text-amber-300",
    bg: "bg-amber-500/15",
    border: "border-amber-500/40",
  },
  underperforming: {
    label: "Underperforming",
    color: "text-red-300",
    bg: "bg-red-500/15",
    border: "border-red-500/40",
  },
};

const HEATMAP_COLS = [
  "Renewal Rev",
  "AI Adoption",
  "Pipeline",
  "MDF ROI",
  "Forecast Acc.",
] as const;

const HEATMAP_DATA = [
  {
    territory: "Nordics",
    yoy: -8,
    statuses: [
      "growth_risk",
      "on_track",
      "underperforming",
      "on_track",
      "growth_risk",
    ],
  },
  {
    territory: "DACH",
    yoy: +12,
    statuses: ["on_track", "ahead", "on_track", "on_track", "on_track"],
  },
  {
    territory: "UK & Ireland",
    yoy: +22,
    statuses: ["ahead", "on_track", "ahead", "exceeding", "on_track"],
  },
  {
    territory: "Benelux",
    yoy: +5,
    statuses: ["on_track", "on_track", "growth_risk", "on_track", "on_track"],
  },
  {
    territory: "Southern Europe",
    yoy: -3,
    statuses: [
      "growth_risk",
      "growth_risk",
      "underperforming",
      "growth_risk",
      "growth_risk",
    ],
  },
  {
    territory: "North America",
    yoy: +31,
    statuses: ["exceeding", "exceeding", "exceeding", "ahead", "exceeding"],
  },
  {
    territory: "APAC",
    yoy: +18,
    statuses: ["ahead", "ahead", "on_track", "ahead", "ahead"],
  },
] as const;

const STAT_TILES = [
  {
    label: "YoY Pipeline Growth",
    value: "+21.4%",
    sub: "vs +18% target",
    status: "ahead" as KPIStatus,
  },
  {
    label: "Renewal Retention",
    value: "87.2%",
    sub: "vs 85% benchmark",
    status: "on_track" as KPIStatus,
  },
  {
    label: "Territories Ahead",
    value: "5 / 7",
    sub: "2 growth risk zones",
    status: "ahead" as KPIStatus,
  },
  {
    label: "Forecast Accuracy",
    value: "91.3%",
    sub: "+4.1pp vs prior year",
    status: "exceeding" as KPIStatus,
  },
];

const FORECAST_CARDS = [
  {
    id: "fc-1",
    title: "Revenue Attainment",
    priorYear: 2.4,
    currentTarget: 3.0,
    forecast: 2.7,
    unit: "£M",
    yoyExpected: 25,
    yoyForecast: 12.5,
    status: "growth_risk" as KPIStatus,
    insight:
      "Nordics and Southern Europe are dragging overall revenue attainment. Q3 pipeline needs acceleration.",
  },
  {
    id: "fc-2",
    title: "Pipeline Coverage",
    priorYear: 8.1,
    currentTarget: 10.2,
    forecast: 10.8,
    unit: "£M",
    yoyExpected: 26,
    yoyForecast: 33.3,
    status: "exceeding" as KPIStatus,
    insight:
      "North America and APAC are driving strong pipeline generation above YoY expectations.",
  },
  {
    id: "fc-3",
    title: "Renewal Revenue",
    priorYear: 1.8,
    currentTarget: 2.1,
    forecast: 2.05,
    unit: "£M",
    yoyExpected: 16.7,
    yoyForecast: 13.9,
    status: "on_track" as KPIStatus,
    insight:
      "Renewal performance stabilizing. Tier 1 territories tracking well; Nordics require intervention.",
  },
];

type Period = "Q1" | "Q2" | "Q3" | "Q4" | "FY";

// ─── Component ────────────────────────────────────────────────────────────────
export function YoYGrowthPage() {
  const [period, setPeriod] = useState<Period>("Q1");
  const { getForgeInsights } = useKPIGovernance();
  const insights = getForgeInsights().slice(0, 4);

  const heatCell = (s: string) => {
    const cfg = STATUS_CONFIG[s as KPIStatus];
    return cfg ? `${cfg.bg} ${cfg.border} border` : "bg-slate-700/30";
  };

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-6 space-y-8"
      data-ocid="yoy_growth.page"
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-orange-400" />
            YoY Growth Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Year-over-year performance tracking, territory health and strategic
            forecast
          </p>
        </div>
        <div className="flex items-center gap-1 bg-[#1e293b] rounded-lg p-1 border border-slate-700/50">
          {(["Q1", "Q2", "Q3", "Q4", "FY"] as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              data-ocid={`yoy_growth.period.${p.toLowerCase()}`}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                period === p
                  ? "bg-orange-500 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stat Tiles ── */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        data-ocid="yoy_growth.stats.section"
      >
        {STAT_TILES.map((tile) => {
          const cfg = STATUS_CONFIG[tile.status];
          return (
            <div
              key={tile.label}
              className={`bg-[#1e293b] rounded-lg p-4 border ${cfg.border}`}
              data-ocid={`yoy_growth.stat.${tile.label.toLowerCase().replace(/\s+/g, "_")}`}
            >
              <p className="text-xs text-slate-400 mb-1">{tile.label}</p>
              <p className="text-2xl font-bold text-white">{tile.value}</p>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
              >
                {tile.sub}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Territory Heatmap ── */}
      <div
        className="bg-[#1e293b] rounded-xl border border-slate-700/50 overflow-hidden"
        data-ocid="yoy_growth.heatmap.section"
      >
        <div className="px-5 py-4 border-b border-slate-700/40 flex items-center gap-2">
          <Globe className="w-4 h-4 text-orange-400" />
          <h2 className="text-sm font-semibold text-white">
            Territory Growth Heatmap
          </h2>
          <span className="ml-auto text-xs text-slate-500">{period} 2025</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700/40">
                <th className="text-left px-4 py-3 text-slate-400 font-medium w-40">
                  Territory
                </th>
                <th className="text-right px-3 py-3 text-slate-400 font-medium">
                  YoY Δ
                </th>
                {HEATMAP_COLS.map((col) => (
                  <th
                    key={col}
                    className="text-center px-3 py-3 text-slate-400 font-medium"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HEATMAP_DATA.map((row, ri) => (
                <tr
                  key={row.territory}
                  className="border-b border-slate-700/20 hover:bg-slate-700/10"
                  data-ocid={`yoy_growth.heatmap.row.${ri + 1}`}
                >
                  <td className="px-4 py-3 text-slate-200 font-medium">
                    {row.territory}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span
                      className={`flex items-center justify-end gap-1 font-semibold ${row.yoy >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {row.yoy >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {row.yoy > 0 ? "+" : ""}
                      {row.yoy}%
                    </span>
                  </td>
                  {row.statuses.map((s) => (
                    <td key={s} className="px-3 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${heatCell(s)} ${STATUS_CONFIG[s as KPIStatus]?.color ?? "text-slate-300"}`}
                      >
                        {STATUS_CONFIG[s as KPIStatus]?.label ?? s}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Strategic Forecast Cards ── */}
      <div data-ocid="yoy_growth.forecast.section">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-orange-400" />
          <h2 className="text-sm font-semibold text-white">
            Strategic Forecast vs YoY Target
          </h2>
          <span className="ml-auto text-xs text-slate-500">{period} 2025</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FORECAST_CARDS.map((card) => {
            const cfg = STATUS_CONFIG[card.status];
            const pct = Math.min(
              100,
              Math.round((card.forecast / card.currentTarget) * 100),
            );
            const fillColor =
              card.status === "exceeding"
                ? "bg-purple-500"
                : card.status === "ahead"
                  ? "bg-blue-500"
                  : card.status === "on_track"
                    ? "bg-green-500"
                    : card.status === "growth_risk"
                      ? "bg-amber-500"
                      : "bg-red-500";
            return (
              <div
                key={card.id}
                className={`bg-[#1e293b] rounded-xl p-5 border ${cfg.border}`}
                data-ocid={`yoy_growth.forecast.${card.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">
                    {card.title}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.color}`}
                  >
                    {cfg.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  <div>
                    <p className="text-xs text-slate-500">Prior Year</p>
                    <p className="text-base font-bold text-slate-300">
                      {card.unit}
                      {card.priorYear}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Target</p>
                    <p className="text-base font-bold text-white">
                      {card.unit}
                      {card.currentTarget}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Forecast</p>
                    <p
                      className={`text-base font-bold ${card.forecast >= card.currentTarget ? "text-green-400" : "text-amber-400"}`}
                    >
                      {card.unit}
                      {card.forecast}
                    </p>
                  </div>
                </div>

                <div className="h-1.5 bg-slate-700 rounded-full mb-3">
                  <div
                    className={`h-1.5 rounded-full ${fillColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-slate-400">YoY Expected</span>
                  <div className="flex items-center gap-1">
                    {card.yoyForecast >= card.yoyExpected ? (
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    )}
                    <span
                      className={
                        card.yoyForecast >= card.yoyExpected
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      +{card.yoyForecast}%
                    </span>
                    <span className="text-slate-500">
                      / +{card.yoyExpected}% target
                    </span>
                  </div>
                </div>

                <div
                  className={`rounded-lg p-3 ${cfg.bg} border ${cfg.border}`}
                >
                  <div className="flex items-start gap-2">
                    <BarChart3
                      className={`w-3 h-3 mt-0.5 flex-shrink-0 ${cfg.color}`}
                    />
                    <p className={`text-xs leading-relaxed ${cfg.color}`}>
                      {card.insight}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ForgeAI Insights ── */}
      {insights.length > 0 && (
        <div
          className="bg-[#1e293b] rounded-xl border border-orange-500/20 p-5"
          data-ocid="yoy_growth.forge_insights.section"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
              <span className="text-orange-400 text-xs font-bold">AI</span>
            </div>
            <h2 className="text-sm font-semibold text-white">
              ForgeAI Growth Intelligence
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {insights.map((ins, i) => (
              <div
                key={ins.id}
                className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3"
                data-ocid={`yoy_growth.insight.item.${i + 1}`}
              >
                {(ins.type === "trending_up" ||
                  ins.type === "growth_acceleration") && (
                  <TrendingUp className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                )}
                {(ins.type === "trending_down" ||
                  ins.type === "underperformance_warning") && (
                  <TrendingDown className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                )}
                {ins.type !== "trending_up" &&
                  ins.type !== "growth_acceleration" &&
                  ins.type !== "trending_down" &&
                  ins.type !== "underperformance_warning" && (
                    <Minus className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  )}
                <div className="min-w-0">
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {ins.message}
                  </p>
                  {ins.territory && (
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      {ins.territory}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
