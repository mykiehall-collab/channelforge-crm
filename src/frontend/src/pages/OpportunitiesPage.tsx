import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  BarChart2,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  LineChart,
  List,
  Plus,
  Search,
  Target,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import type { Opportunity, OpportunityStage } from "../backend.d";
import { ClickableAccountName } from "../components/ClickableAccountName";
import { CustomFieldEditor } from "../components/CustomFieldEditor";
import { ForgeAIRecommendationCard } from "../components/ForgeAIRecommendationCard";
import { useFilterContext } from "../contexts/FilterContext";
import { useActor } from "../hooks/useActor";
import { useCustomFields } from "../hooks/useCustomFields";
import { useForgeAI } from "../hooks/useForgeAI";
import { formatCurrency } from "../utils/channelforge";

// ── Types ─────────────────────────────────────────────────────────────────────

type ViewMode = "kanban" | "list" | "forecast";
type WorkspaceFilter = "all" | "vendor" | "distributor" | "reseller";
type DateRangeFilter = "quarter" | "month" | "custom";
type SortKey =
  | "opportunityName"
  | "customerAccountId"
  | "stage"
  | "revenueEstimate"
  | "closeDate"
  | "ownerUserId"
  | "probability"
  | "dealAge";
type SortDir = "asc" | "desc";

// ── Constants ─────────────────────────────────────────────────────────────────

const STAGE_KEYS = [
  "prospecting",
  "qualification",
  "solutionAlignment",
  "proposal",
  "pricingReview",
  "dealRegistration",
  "approval",
  "negotiation",
  "closedWon",
  "closedLost",
] as const;

type PipelineStage = (typeof STAGE_KEYS)[number];

const STAGE_LABEL: Record<PipelineStage, string> = {
  prospecting: "Prospecting",
  qualification: "Qualification",
  solutionAlignment: "Solution Alignment",
  proposal: "Proposal",
  pricingReview: "Pricing Review",
  dealRegistration: "Deal Registration",
  approval: "Approval",
  negotiation: "Negotiation",
  closedWon: "Closed Won",
  closedLost: "Closed Lost",
};

const STAGE_PROBABILITY: Record<PipelineStage, number> = {
  prospecting: 10,
  qualification: 25,
  solutionAlignment: 40,
  proposal: 55,
  pricingReview: 65,
  dealRegistration: 75,
  approval: 80,
  negotiation: 90,
  closedWon: 100,
  closedLost: 0,
};

const STAGE_COLOR: Record<PipelineStage, string> = {
  prospecting: "bg-secondary/60 text-muted-foreground border-border",
  qualification: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  solutionAlignment: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  proposal: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  pricingReview: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  dealRegistration: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  approval: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  negotiation: "bg-accent/15 text-accent border-accent/30",
  closedWon: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  closedLost: "bg-muted/30 text-muted-foreground border-border",
};

const STAGE_HEADER_ACCENT: Record<PipelineStage, string> = {
  prospecting: "border-t-border",
  qualification: "border-t-blue-500/50",
  solutionAlignment: "border-t-violet-500/50",
  proposal: "border-t-yellow-500/50",
  pricingReview: "border-t-orange-500/50",
  dealRegistration: "border-t-cyan-500/50",
  approval: "border-t-purple-500/50",
  negotiation: "border-t-accent/60",
  closedWon: "border-t-emerald-500/50",
  closedLost: "border-t-border",
};

// ── Mock Data ─────────────────────────────────────────────────────────────────

interface MockDeal {
  id: string;
  name: string;
  account: string;
  value: number;
  stage: PipelineStage;
  owner: string;
  ownerInitials: string;
  daysAgo: number;
  closeDate: string;
  risk: "low" | "medium" | "high";
  workspace: WorkspaceFilter;
  probability: number;
}

const MOCK_DEALS: MockDeal[] = [
  {
    id: "d1",
    name: "Meridian Cloud Suite Renewal",
    account: "Meridian Technologies",
    value: 84500,
    stage: "negotiation",
    owner: "Sarah Chen",
    ownerInitials: "SC",
    daysAgo: 38,
    closeDate: "2026-06-30",
    risk: "high",
    workspace: "vendor",
    probability: 90,
  },
  {
    id: "d2",
    name: "Nexus Platform Expansion",
    account: "Nexus Global",
    value: 126000,
    stage: "proposal",
    owner: "James Wright",
    ownerInitials: "JW",
    daysAgo: 12,
    closeDate: "2026-07-15",
    risk: "low",
    workspace: "vendor",
    probability: 55,
  },
  {
    id: "d3",
    name: "Axiom Security Upgrade",
    account: "Axiom Systems",
    value: 47200,
    stage: "approval",
    owner: "Maria Santos",
    ownerInitials: "MS",
    daysAgo: 21,
    closeDate: "2026-06-20",
    risk: "medium",
    workspace: "distributor",
    probability: 80,
  },
  {
    id: "d4",
    name: "Pinnacle ERP Migration",
    account: "Pinnacle Corp",
    value: 215000,
    stage: "pricingReview",
    owner: "David Kim",
    ownerInitials: "DK",
    daysAgo: 5,
    closeDate: "2026-08-01",
    risk: "low",
    workspace: "vendor",
    probability: 65,
  },
  {
    id: "d5",
    name: "Vantage CRM Rollout",
    account: "Vantage Partners",
    value: 33800,
    stage: "prospecting",
    owner: "Emma Thompson",
    ownerInitials: "ET",
    daysAgo: 3,
    closeDate: "2026-09-30",
    risk: "low",
    workspace: "reseller",
    probability: 10,
  },
  {
    id: "d6",
    name: "BlueStar Analytics Suite",
    account: "BlueStar Inc",
    value: 78900,
    stage: "dealRegistration",
    owner: "Tom Reeves",
    ownerInitials: "TR",
    daysAgo: 18,
    closeDate: "2026-07-05",
    risk: "medium",
    workspace: "distributor",
    probability: 75,
  },
  {
    id: "d7",
    name: "Crestline Managed Services",
    account: "Crestline Group",
    value: 62100,
    stage: "closedWon",
    owner: "Sarah Chen",
    ownerInitials: "SC",
    daysAgo: 45,
    closeDate: "2026-05-15",
    risk: "low",
    workspace: "vendor",
    probability: 100,
  },
  {
    id: "d8",
    name: "TechFusion Dev Tools",
    account: "TechFusion Ltd",
    value: 19400,
    stage: "qualification",
    owner: "James Wright",
    ownerInitials: "JW",
    daysAgo: 8,
    closeDate: "2026-08-20",
    risk: "low",
    workspace: "reseller",
    probability: 25,
  },
  {
    id: "d9",
    name: "Orion Infrastructure Deal",
    account: "Orion Solutions",
    value: 340000,
    stage: "solutionAlignment",
    owner: "Maria Santos",
    ownerInitials: "MS",
    daysAgo: 24,
    closeDate: "2026-09-01",
    risk: "medium",
    workspace: "vendor",
    probability: 40,
  },
  {
    id: "d10",
    name: "Harbor Cloud Transition",
    account: "Harbor Systems",
    value: 58700,
    stage: "negotiation",
    owner: "David Kim",
    ownerInitials: "DK",
    daysAgo: 32,
    closeDate: "2026-06-25",
    risk: "high",
    workspace: "distributor",
    probability: 90,
  },
  {
    id: "d11",
    name: "Granite Software Renewal",
    account: "Granite Corp",
    value: 27500,
    stage: "prospecting",
    owner: "Emma Thompson",
    ownerInitials: "ET",
    daysAgo: 2,
    closeDate: "2026-10-01",
    risk: "low",
    workspace: "reseller",
    probability: 10,
  },
  {
    id: "d12",
    name: "Catalyst Data Platform",
    account: "Catalyst Technologies",
    value: 145000,
    stage: "approval",
    owner: "Tom Reeves",
    ownerInitials: "TR",
    daysAgo: 16,
    closeDate: "2026-06-28",
    risk: "low",
    workspace: "vendor",
    probability: 80,
  },
  {
    id: "d13",
    name: "Summit Partner Program",
    account: "Summit Global",
    value: 93200,
    stage: "proposal",
    owner: "Sarah Chen",
    ownerInitials: "SC",
    daysAgo: 10,
    closeDate: "2026-07-22",
    risk: "medium",
    workspace: "distributor",
    probability: 55,
  },
  {
    id: "d14",
    name: "Vertex Reseller Onboarding",
    account: "Vertex Networks",
    value: 41600,
    stage: "closedLost",
    owner: "James Wright",
    ownerInitials: "JW",
    daysAgo: 60,
    closeDate: "2026-05-01",
    risk: "high",
    workspace: "reseller",
    probability: 0,
  },
  {
    id: "d15",
    name: "Horizon Enterprise Stack",
    account: "Horizon Industries",
    value: 188000,
    stage: "pricingReview",
    owner: "Maria Santos",
    ownerInitials: "MS",
    daysAgo: 7,
    closeDate: "2026-07-30",
    risk: "medium",
    workspace: "vendor",
    probability: 65,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtCurrency(val: number): string {
  if (val >= 1_000_000) return `£${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `£${(val / 1_000).toFixed(0)}k`;
  return `£${val.toLocaleString("en-GB")}`;
}

function dealAgeColor(days: number): string {
  if (days <= 14) return "text-emerald-400";
  if (days <= 30) return "text-orange-400";
  return "text-red-400";
}

function riskDot(risk: MockDeal["risk"]): string {
  if (risk === "high") return "bg-red-400";
  if (risk === "medium") return "bg-orange-400";
  return "bg-emerald-400";
}

function getInitialsBg(initials: string): string {
  const map: Record<string, string> = {
    SC: "bg-violet-500/30 text-violet-200",
    JW: "bg-blue-500/30 text-blue-200",
    MS: "bg-emerald-500/30 text-emerald-200",
    DK: "bg-cyan-500/30 text-cyan-200",
    ET: "bg-orange-500/30 text-orange-200",
    TR: "bg-purple-500/30 text-purple-200",
  };
  return map[initials] ?? "bg-secondary text-muted-foreground";
}

function getViewFromStorage(): ViewMode {
  try {
    const v = localStorage.getItem("cf_pipeline_view");
    if (v === "kanban" || v === "list" || v === "forecast") return v;
  } catch {}
  return "kanban";
}

function nowMs(): number {
  return Date.now();
}

function startOfQuarterMs(): number {
  const d = new Date();
  const q = Math.floor(d.getMonth() / 3);
  return new Date(d.getFullYear(), q * 3, 1).getTime();
}

function endOfQuarterMs(): number {
  const d = new Date();
  const q = Math.floor(d.getMonth() / 3);
  return new Date(d.getFullYear(), q * 3 + 3, 0, 23, 59, 59).getTime();
}

function startOfMonthMs(): number {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
}

function endOfMonthMs(): number {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).getTime();
}

function closeDateMs(deal: MockDeal): number {
  return new Date(deal.closeDate).getTime();
}

// ── StageBadge ────────────────────────────────────────────────────────────────

function StageBadge({ stage }: { stage: PipelineStage }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap ${STAGE_COLOR[stage]}`}
    >
      {STAGE_LABEL[stage]}
    </span>
  );
}

// ── Kanban Card ───────────────────────────────────────────────────────────────

function KanbanCard({
  deal,
  index,
  onDragStart,
}: {
  deal: MockDeal;
  index: number;
  onDragStart: (id: string) => void;
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(deal.id)}
      data-ocid={`opportunities.kanban.item.${index}`}
      className="group relative crm-card p-3 flex flex-col gap-2 cursor-grab active:cursor-grabbing hover:border-accent/40 transition-all duration-150 select-none"
    >
      {/* Risk dot */}
      <span
        className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${riskDot(deal.risk)}`}
        title={`${deal.risk} risk`}
      />
      <p className="text-sm font-semibold text-foreground leading-snug pr-4 truncate">
        {deal.name}
      </p>
      <p className="text-base font-bold font-mono text-accent min-w-0 truncate whitespace-nowrap">
        {fmtCurrency(deal.value)}
      </p>
      <ClickableAccountName
        accountName={deal.account}
        accountId={deal.id}
        opportunityId={deal.id}
        context="pipeline"
        className="text-xs text-muted-foreground truncate block"
      />
      <div className="flex items-center justify-between mt-0.5">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${getInitialsBg(deal.ownerInitials)}`}
          >
            {deal.ownerInitials}
          </span>
          <span className={`text-xs font-medium ${dealAgeColor(deal.daysAgo)}`}>
            {deal.daysAgo}d
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
          {new Date(deal.closeDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          })}
        </span>
      </div>
    </div>
  );
}

// ── Kanban Column ─────────────────────────────────────────────────────────────

function KanbanColumn({
  stage,
  deals,
  onDragStart,
  onDrop,
}: {
  stage: PipelineStage;
  deals: MockDeal[];
  onDragStart: (id: string) => void;
  onDrop: (stage: PipelineStage) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const totalValue = deals.reduce((s, d) => s + d.value, 0);

  return (
    <div
      className={`flex-none w-[230px] flex flex-col rounded-xl border-t-2 transition-all duration-150 ${
        dragOver
          ? "border-accent/60 bg-accent/5"
          : `${STAGE_HEADER_ACCENT[stage]} bg-card/50`
      }`}
      data-ocid={`opportunities.kanban.column.${stage}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={() => {
        setDragOver(false);
        onDrop(stage);
      }}
    >
      {/* Column header */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between gap-2 mb-1 min-w-0 overflow-hidden">
          <span className="text-xs font-bold text-foreground truncate">
            {STAGE_LABEL[stage]}
          </span>
          <span className="flex-none text-[10px] font-mono bg-secondary/60 text-muted-foreground rounded-full px-1.5 py-0.5">
            {deals.length}
          </span>
        </div>
        <p className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
          {fmtCurrency(totalValue)}
        </p>
      </div>
      {/* Cards */}
      <div className="flex flex-col gap-2 px-2 pb-3 min-h-[80px]">
        {deals.map((deal, i) => (
          <KanbanCard
            key={deal.id}
            deal={deal}
            index={i + 1}
            onDragStart={onDragStart}
          />
        ))}
        {deals.length === 0 && (
          <div
            className={`rounded-lg border border-dashed py-6 flex items-center justify-center transition-colors ${
              dragOver ? "border-accent/40 bg-accent/5" : "border-border/50"
            }`}
          >
            <span className="text-[10px] text-muted-foreground/60">
              Drop here
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Kanban View ───────────────────────────────────────────────────────────────

function KanbanView({ deals }: { deals: MockDeal[] }) {
  const [localDeals, setLocalDeals] = useState(deals);
  const draggingId = useRef<string | null>(null);

  // sync when parent deals change
  useEffect(() => {
    setLocalDeals(deals);
  }, [deals]);

  const handleDragStart = useCallback((id: string) => {
    draggingId.current = id;
  }, []);

  const handleDrop = useCallback((targetStage: PipelineStage) => {
    const id = draggingId.current;
    if (!id) return;
    setLocalDeals((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              stage: targetStage,
              probability: STAGE_PROBABILITY[targetStage],
            }
          : d,
      ),
    );
    draggingId.current = null;
  }, []);

  const grouped = STAGE_KEYS.reduce<Record<PipelineStage, MockDeal[]>>(
    (acc, s) => {
      acc[s] = localDeals.filter((d) => d.stage === s);
      return acc;
    },
    {} as Record<PipelineStage, MockDeal[]>,
  );

  return (
    <div
      className="flex gap-3 overflow-x-auto pb-4 pt-1"
      data-ocid="opportunities.kanban.board"
      style={{ scrollbarWidth: "thin" }}
    >
      {STAGE_KEYS.map((stage) => (
        <KanbanColumn
          key={stage}
          stage={stage}
          deals={grouped[stage]}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}

// ── List View ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

function ListRow({
  deal,
  index,
}: {
  deal: MockDeal;
  index: number;
}) {
  const relativeDate = (() => {
    const ms = new Date(deal.closeDate).getTime();
    const diff = Math.round((ms - Date.now()) / 86_400_000);
    if (diff < 0) return `${Math.abs(diff)} days ago`;
    if (diff === 0) return "today";
    return `in ${diff} days`;
  })();

  return (
    <tr
      data-ocid={`opportunities.list.item.${index}`}
      className="border-b border-border/40 last:border-0 hover:bg-[var(--hover-bg)] transition-colors duration-150 cursor-pointer"
    >
      <td className="px-4 py-3">
        <span
          className="font-medium text-foreground text-sm truncate max-w-[200px] block"
          title={deal.name}
        >
          {deal.name}
        </span>
      </td>
      <td className="px-4 py-3 text-sm hidden sm:table-cell">
        <ClickableAccountName
          accountName={deal.account}
          accountId={deal.id}
          context="account-table"
          className="text-muted-foreground truncate max-w-[160px] block"
        />
      </td>
      <td className="px-4 py-3">
        <StageBadge stage={deal.stage} />
      </td>
      <td className="px-4 py-3 text-sm font-mono font-bold text-accent text-right whitespace-nowrap tabular-nums">
        {new Intl.NumberFormat("en-GB", {
          style: "currency",
          currency: "GBP",
          notation: "compact",
        }).format(deal.value)}
      </td>
      <td
        className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell whitespace-nowrap text-right tabular-nums"
        title={relativeDate}
      >
        {new Date(deal.closeDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${getInitialsBg(deal.ownerInitials)}`}
          >
            {deal.ownerInitials}
          </span>
          <span className="text-xs text-muted-foreground">{deal.owner}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground text-right hidden lg:table-cell whitespace-nowrap tabular-nums">
        {deal.probability}%
      </td>
      <td className="px-4 py-3 hidden md:table-cell whitespace-nowrap text-right tabular-nums">
        <span
          className={`text-xs font-mono font-medium ${dealAgeColor(deal.daysAgo)}`}
        >
          {deal.daysAgo}d
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap min-w-[80px] ${
            deal.risk === "high"
              ? "bg-red-500/15 text-red-400 border-red-500/30"
              : deal.risk === "medium"
                ? "bg-orange-500/15 text-amber-400 border-orange-500/30"
                : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
          }`}
        >
          {deal.risk.charAt(0).toUpperCase() + deal.risk.slice(1)}
        </span>
      </td>
    </tr>
  );
}

function ListView({
  deals,
  stageFilter,
  ownerFilter,
  setStageFilter,
  setOwnerFilter,
  dateRange: _dateRange,
  minValue,
  setMinValue,
}: {
  deals: MockDeal[];
  stageFilter: PipelineStage | "all";
  ownerFilter: string;
  setStageFilter: (s: PipelineStage | "all") => void;
  setOwnerFilter: (s: string) => void;
  dateRange: DateRangeFilter;
  minValue: string;
  setMinValue: (v: string) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("opportunityName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const owners: string[] = Array.from(new Set(deals.map((d) => d.owner)));

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  const sorted = [...deals].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "opportunityName") cmp = a.name.localeCompare(b.name);
    else if (sortKey === "customerAccountId")
      cmp = a.account.localeCompare(b.account);
    else if (sortKey === "stage") cmp = a.stage.localeCompare(b.stage);
    else if (sortKey === "revenueEstimate") cmp = a.value - b.value;
    else if (sortKey === "closeDate")
      cmp = a.closeDate.localeCompare(b.closeDate);
    else if (sortKey === "ownerUserId") cmp = a.owner.localeCompare(b.owner);
    else if (sortKey === "probability") cmp = a.probability - b.probability;
    else if (sortKey === "dealAge") cmp = a.daysAgo - b.daysAgo;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const paginated = showAll
    ? sorted
    : sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col)
      return <ChevronDown size={11} className="opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp size={11} className="text-accent" />
    ) : (
      <ChevronDown size={11} className="text-accent" />
    );
  }

  const cols: { key: SortKey; label: string; cls?: string }[] = [
    { key: "opportunityName", label: "Deal Name" },
    { key: "customerAccountId", label: "Account", cls: "hidden sm:table-cell" },
    { key: "stage", label: "Stage" },
    {
      key: "revenueEstimate",
      label: "Value",
      cls: "min-w-[160px] whitespace-nowrap text-right",
    },
    {
      key: "closeDate",
      label: "Close Date",
      cls: "hidden md:table-cell whitespace-nowrap",
    },
    { key: "ownerUserId", label: "Owner", cls: "hidden lg:table-cell" },
    {
      key: "probability",
      label: "Prob %",
      cls: "hidden lg:table-cell text-right whitespace-nowrap",
    },
    {
      key: "dealAge",
      label: "Age",
      cls: "hidden md:table-cell text-right whitespace-nowrap",
    },
  ];

  return (
    <div className="space-y-3" data-ocid="opportunities.list.panel">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          data-ocid="opportunities.list.stage.select"
          value={stageFilter}
          onChange={(e) => {
            setStageFilter(e.target.value as PipelineStage | "all");
            setPage(1);
          }}
          className="crm-input text-xs px-3 py-2 h-9 rounded-lg cursor-pointer"
        >
          <option value="all">All Stages</option>
          {STAGE_KEYS.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABEL[s]}
            </option>
          ))}
        </select>
        <select
          data-ocid="opportunities.list.owner.select"
          value={ownerFilter}
          onChange={(e) => {
            setOwnerFilter(e.target.value);
            setPage(1);
          }}
          className="crm-input text-xs px-3 py-2 h-9 rounded-lg cursor-pointer"
        >
          <option value="">All Owners</option>
          {owners.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
            £
          </span>
          <Input
            type="number"
            data-ocid="opportunities.list.min_value.input"
            value={minValue}
            onChange={(e) => {
              setMinValue(e.target.value);
              setPage(1);
            }}
            placeholder="Min value"
            className="crm-input h-9 text-xs pl-6 w-28"
          />
        </div>
      </div>
      {/* Table */}
      <div className="crm-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/20">
                {cols.map((c) => (
                  <th
                    key={c.key}
                    onClick={() => toggleSort(c.key)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") toggleSort(c.key);
                    }}
                    className={`px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:text-foreground transition-colors select-none ${c.cls ?? ""}`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {c.label} <SortIcon col={c.key} />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">
                  Risk
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-16 text-center"
                    data-ocid="opportunities.list.empty_state"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <BarChart2
                        size={32}
                        className="text-muted-foreground/40"
                      />
                      <p className="text-sm font-semibold text-foreground">
                        No deals match your filters
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Try adjusting the stage, owner, or value filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((deal, i) => (
                  <ListRow
                    key={deal.id}
                    deal={deal}
                    index={(page - 1) * PAGE_SIZE + i + 1}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {!showAll && sorted.length > PAGE_SIZE && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Show all {sorted.length}
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-ocid="opportunities.list.pagination_prev"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="text-xs px-2.5 py-1.5 rounded border border-border hover:bg-secondary/40 disabled:opacity-30 transition-colors"
              >
                ‹ Prev
              </button>
              <span className="text-xs text-muted-foreground">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                data-ocid="opportunities.list.pagination_next"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="text-xs px-2.5 py-1.5 rounded border border-border hover:bg-secondary/40 disabled:opacity-30 transition-colors"
              >
                Next ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Forecast View ─────────────────────────────────────────────────────────────

function ForecastView({ deals }: { deals: MockDeal[] }) {
  const _now = nowMs();
  const qStart = startOfQuarterMs();
  const qEnd = endOfQuarterMs();

  const active = deals.filter((d) => d.stage !== "closedLost");
  const bestCase = active.reduce((s, d) => s + d.value, 0);
  const commit = deals
    .filter((d) => d.stage === "approval" || d.stage === "negotiation")
    .reduce((s, d) => s + d.value, 0);
  const closedWonQTD = deals
    .filter((d) => {
      if (d.stage !== "closedWon") return false;
      const ms = closeDateMs(d);
      return ms >= qStart && ms <= qEnd;
    })
    .reduce((s, d) => s + d.value, 0);
  const TARGET = 800000;
  const gap = TARGET - closedWonQTD;

  const summaryCards = [
    {
      label: "Best Case",
      value: fmtCurrency(bestCase),
      sub: "All active pipeline",
      icon: <TrendingUp size={18} />,
      accent: "text-accent",
      border: "border-accent/30",
    },
    {
      label: "Commit",
      value: fmtCurrency(commit),
      sub: "Approval + Negotiation",
      icon: <Target size={18} />,
      accent: "text-violet-400",
      border: "border-violet-500/30",
    },
    {
      label: "Closed Won QTD",
      value: fmtCurrency(closedWonQTD),
      sub: "This quarter",
      icon: <BarChart2 size={18} />,
      accent: "text-emerald-400",
      border: "border-emerald-500/30",
    },
    {
      label: "Gap to Target",
      value: gap > 0 ? fmtCurrency(gap) : "Target met ✓",
      sub: `Target: ${fmtCurrency(TARGET)}`,
      icon: gap > 0 ? <TrendingDown size={18} /> : <TrendingUp size={18} />,
      accent: gap > 0 ? "text-orange-400" : "text-emerald-400",
      border: gap > 0 ? "border-orange-500/30" : "border-emerald-500/30",
    },
  ];

  // Stage breakdown
  const activeStages = STAGE_KEYS.filter((s) => s !== "closedLost");
  const stageRows = activeStages.map((stage) => {
    const stageDeal = deals.filter((d) => d.stage === stage);
    const total = stageDeal.reduce((s, d) => s + d.value, 0);
    const weighted = Math.round(
      stageDeal.reduce((s, d) => s + d.value * (d.probability / 100), 0),
    );
    const avgAge =
      stageDeal.length > 0
        ? Math.round(
            stageDeal.reduce((s, d) => s + d.daysAgo, 0) / stageDeal.length,
          )
        : 0;
    return { stage, count: stageDeal.length, total, weighted, avgAge };
  });

  // Win/loss
  const won = deals.filter((d) => d.stage === "closedWon");
  const lost = deals.filter((d) => d.stage === "closedLost");
  const closed = won.length + lost.length;
  const winRate = closed > 0 ? Math.round((won.length / closed) * 100) : 0;
  const avgDealSize =
    deals.length > 0
      ? Math.round(deals.reduce((s, d) => s + d.value, 0) / deals.length)
      : 0;

  // At risk: high age or high risk
  const atRisk = deals
    .filter((d) => d.stage !== "closedWon" && d.stage !== "closedLost")
    .filter((d) => d.risk === "high" || d.daysAgo > 25)
    .sort((a, b) => b.daysAgo - a.daysAgo)
    .slice(0, 4);

  return (
    <div className="space-y-6" data-ocid="opportunities.forecast.panel">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map((c) => (
          <div
            key={c.label}
            className={`crm-card p-4 border ${c.border} flex flex-col gap-2 min-w-0 overflow-hidden`}
          >
            <div className={`flex items-center gap-2 ${c.accent}`}>
              {c.icon}
              <span className="text-xs font-semibold text-muted-foreground">
                {c.label}
              </span>
            </div>
            <p
              className={`text-base font-bold font-mono ${c.accent} whitespace-nowrap overflow-hidden text-ellipsis`}
            >
              {c.value}
            </p>
            <p className="text-[10px] text-muted-foreground">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Stage breakdown */}
      <div className="crm-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-bold text-foreground">Stage Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/20">
                {["Stage", "Deals", "Total Value", "Weighted", "Avg Age"].map(
                  (h) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap ${
                        h === "Stage" ? "text-left" : "text-right"
                      }`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {stageRows.map((r) => (
                <tr
                  key={r.stage}
                  className="border-b border-border/40 last:border-0 hover:bg-secondary/10 transition-colors"
                >
                  <td className="px-4 py-3 max-w-[140px]">
                    <div className="truncate">
                      <StageBadge stage={r.stage} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground font-mono whitespace-nowrap">
                    {r.count}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-foreground whitespace-nowrap">
                    {fmtCurrency(r.total)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-accent whitespace-nowrap">
                    {fmtCurrency(r.weighted)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-mono text-sm whitespace-nowrap ${dealAgeColor(r.avgAge)}`}
                  >
                    {r.avgAge}d
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Win/loss + at risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Win/loss */}
        <div className="crm-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">
            Win / Loss Analysis
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-emerald-400">
                {winRate}%
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">Win Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-accent whitespace-nowrap">
                {fmtCurrency(avgDealSize)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Avg Deal Size
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-foreground">
                34d
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Avg Days to Close
              </p>
            </div>
          </div>
          <div className="h-px bg-border" />
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-muted-foreground">Won</p>
              <p className="text-lg font-bold text-emerald-400 font-mono">
                {won.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Lost</p>
              <p className="text-lg font-bold text-muted-foreground font-mono">
                {lost.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-lg font-bold text-foreground font-mono">
                {active.length}
              </p>
            </div>
          </div>
        </div>

        {/* At risk */}
        <div className="crm-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-orange-400" />
            <h3 className="text-sm font-bold text-foreground">
              Top Deals at Risk
            </h3>
          </div>
          {atRisk.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No at-risk deals detected
            </p>
          ) : (
            <div className="space-y-2">
              {atRisk.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between gap-3 py-2 border-b border-border/40 last:border-0"
                  data-ocid={`opportunities.forecast.risk.item.${d.id}`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {d.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {d.account}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-none">
                    <span
                      className={`text-xs font-mono font-semibold ${dealAgeColor(d.daysAgo)}`}
                    >
                      {d.daysAgo}d
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${riskDot(d.risk)}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── New Opportunity Modal ─────────────────────────────────────────────────────

interface NewOppForm {
  opportunityName: string;
  customerAccountId: string;
  revenueEstimate: string;
  stage: string;
  closeDate: string;
  ownerUserId: string;
  resellerId: string;
  distributorId: string;
}

const EMPTY_FORM: NewOppForm = {
  opportunityName: "",
  customerAccountId: "",
  revenueEstimate: "",
  stage: "prospecting",
  closeDate: "",
  ownerUserId: "",
  resellerId: "",
  distributorId: "",
};

function NewOpportunityModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const { actor } = useActor();
  const [form, setForm] = useState<NewOppForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [newOppId, setNewOppId] = useState<string | null>(null);

  const customFields = useCustomFields(
    "opportunity" as import("../backend.d").CustomFieldObjectType,
    newOppId ?? "",
  );

  function update(key: keyof NewOppForm, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function dateToNs(val: string): bigint {
    if (!val) return BigInt(0);
    return BigInt(new Date(val).getTime() * 1_000_000);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const created = await actor.createOpportunity({
        opportunityName: form.opportunityName,
        customerAccountId: form.customerAccountId || undefined,
        revenueEstimate: BigInt(Math.round(Number(form.revenueEstimate) || 0)),
        stage: form.stage as OpportunityStage,
        closeDate: dateToNs(form.closeDate),
        vendorOwnerId: form.ownerUserId,
        resellerId: form.resellerId || undefined,
        distributorId: form.distributorId || undefined,
        associatedDealIds: [],
      });
      setNewOppId(created.id);
      toast.success("Opportunity created");
      onSaved();
      onClose();
    } catch {
      toast.error("Failed to create opportunity");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div
        className="crm-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 fade-in"
        data-ocid="opportunities.new_opportunity.dialog"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground font-display">
            New Opportunity
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="opportunities.new_opportunity.close_button"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="opp-name"
                className="block text-xs text-muted-foreground mb-1"
              >
                Opportunity Name *
              </label>
              <Input
                id="opp-name"
                required
                data-ocid="opportunities.new_opportunity.name.input"
                value={form.opportunityName}
                onChange={(e) => update("opportunityName", e.target.value)}
                placeholder="e.g. Meridian Cloud Suite Renewal Q3"
                className="crm-input"
              />
            </div>
            <div>
              <label
                htmlFor="opp-account"
                className="block text-xs text-muted-foreground mb-1"
              >
                Customer Account
              </label>
              <Input
                id="opp-account"
                data-ocid="opportunities.new_opportunity.account.input"
                value={form.customerAccountId}
                onChange={(e) => update("customerAccountId", e.target.value)}
                placeholder="Account ID or name"
                className="crm-input"
              />
            </div>
            <div>
              <label
                htmlFor="opp-revenue"
                className="block text-xs text-muted-foreground mb-1"
              >
                Revenue Estimate (£)
              </label>
              <Input
                id="opp-revenue"
                type="number"
                data-ocid="opportunities.new_opportunity.revenue.input"
                value={form.revenueEstimate}
                onChange={(e) => update("revenueEstimate", e.target.value)}
                placeholder="50000"
                className="crm-input"
              />
            </div>
            <div>
              <label
                htmlFor="opp-stage"
                className="block text-xs text-muted-foreground mb-1"
              >
                Stage
              </label>
              <select
                id="opp-stage"
                data-ocid="opportunities.new_opportunity.stage.select"
                value={form.stage}
                onChange={(e) => update("stage", e.target.value)}
                className="crm-input w-full text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer"
              >
                {STAGE_KEYS.map((s) => (
                  <option key={s} value={s}>
                    {STAGE_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="opp-close-date"
                className="block text-xs text-muted-foreground mb-1"
              >
                Close Date
              </label>
              <Input
                id="opp-close-date"
                type="date"
                data-ocid="opportunities.new_opportunity.close_date.input"
                value={form.closeDate}
                onChange={(e) => update("closeDate", e.target.value)}
                className="crm-input"
              />
            </div>
            <div>
              <label
                htmlFor="opp-owner"
                className="block text-xs text-muted-foreground mb-1"
              >
                Owner
              </label>
              <Input
                id="opp-owner"
                data-ocid="opportunities.new_opportunity.owner.input"
                value={form.ownerUserId}
                onChange={(e) => update("ownerUserId", e.target.value)}
                placeholder="user-id"
                className="crm-input"
              />
            </div>
            <div>
              <label
                htmlFor="opp-reseller"
                className="block text-xs text-muted-foreground mb-1"
              >
                Reseller ID
              </label>
              <Input
                id="opp-reseller"
                data-ocid="opportunities.new_opportunity.reseller.input"
                value={form.resellerId}
                onChange={(e) => update("resellerId", e.target.value)}
                placeholder="Optional"
                className="crm-input"
              />
            </div>
            <div>
              <label
                htmlFor="opp-distributor"
                className="block text-xs text-muted-foreground mb-1"
              >
                Distributor ID
              </label>
              <Input
                id="opp-distributor"
                data-ocid="opportunities.new_opportunity.distributor.input"
                value={form.distributorId}
                onChange={(e) => update("distributorId", e.target.value)}
                placeholder="Optional"
                className="crm-input"
              />
            </div>
          </div>

          {customFields.fieldDefs.length > 0 && (
            <div className="border-t border-border pt-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Custom Fields
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {customFields.fieldDefs
                  .filter((f) => !f.isArchived)
                  .map((def) => (
                    <CustomFieldEditor
                      key={def.id}
                      fieldDef={def}
                      value={
                        customFields.pendingChanges[def.id] ??
                        customFields.fieldValues[def.id]?.value ??
                        ""
                      }
                      onChange={(v) => customFields.setFieldValue(def.id, v)}
                      error={customFields.errors[def.id]}
                    />
                  ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="opportunities.new_opportunity.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              data-ocid="opportunities.new_opportunity.submit_button"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {saving ? "Creating…" : "Create Opportunity"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────

function StatsBar({ deals }: { deals: MockDeal[] }) {
  const active = deals.filter(
    (d) => d.stage !== "closedWon" && d.stage !== "closedLost",
  );
  const pipelineValue = active.reduce((s, d) => s + d.value, 0);
  const won = deals.filter((d) => d.stage === "closedWon");
  const lost = deals.filter((d) => d.stage === "closedLost");
  const closed = won.length + lost.length;
  const winRate = closed > 0 ? Math.round((won.length / closed) * 100) : 0;

  const stats = [
    {
      label: "Total Deals",
      value: deals.length.toString(),
      icon: <BarChart2 size={15} />,
      accent: false,
    },
    {
      label: "Pipeline Value",
      value: fmtCurrency(pipelineValue),
      icon: <TrendingUp size={15} />,
      accent: true,
    },
    {
      label: "Win Rate",
      value: `${winRate}%`,
      icon: <Target size={15} />,
      accent: false,
    },
    {
      label: "Avg Deal Size",
      value:
        active.length > 0
          ? fmtCurrency(Math.round(pipelineValue / active.length))
          : "£0",
      icon: <CalendarDays size={15} />,
      accent: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="metric-tile min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            {s.icon}
            <span className="text-xs font-medium">{s.label}</span>
          </div>
          <div
            className={`text-xl font-bold font-mono whitespace-nowrap overflow-hidden text-ellipsis ${
              s.accent ? "text-accent" : "text-foreground"
            }`}
          >
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function OpportunitiesPage() {
  const { actor } = useActor();
  const { isVendor, isDistributor, isReseller } = useApp();
  useFilterContext();

  // ORG-ISOLATION: filter opportunities to user's org workspace
  const orgFilteredDeals = MOCK_DEALS.filter((d) => {
    if (isVendor()) return d.workspace === "vendor";
    if (isDistributor()) return d.workspace === "distributor";
    if (isReseller()) return d.workspace === "reseller";
    return true;
  });

  const { recommendations } = useForgeAI();

  const [viewMode, setViewMode] = useState<ViewMode>(getViewFromStorage);
  const [wsFilter, setWsFilter] = useState<WorkspaceFilter>("all");
  const [dateRange, setDateRange] = useState<DateRangeFilter>("quarter");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<PipelineStage | "all">("all");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [minValue, setMinValue] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);

  // live opps from backend (unused for mock views but kept for modal refresh)
  const [, setOpps] = useState<Opportunity[]>([]);

  useEffect(() => {
    if (!actor) return;
    actor
      .listOpportunitiesForCaller(null, "", "", null, null)
      .then(setOpps)
      .catch(() => {});
  }, [actor]);

  // persist view
  function changeView(v: ViewMode) {
    setViewMode(v);
    try {
      localStorage.setItem("cf_pipeline_view", v);
    } catch {}
  }

  // filter mock deals
  const filteredDeals = orgFilteredDeals.filter((d) => {
    if (wsFilter !== "all" && d.workspace !== wsFilter) return false;
    if (stageFilter !== "all" && d.stage !== stageFilter) return false;
    if (ownerFilter && d.owner !== ownerFilter) return false;
    if (minValue && d.value < Number(minValue)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !d.name.toLowerCase().includes(q) &&
        !d.account.toLowerCase().includes(q)
      )
        return false;
    }
    // date range filter based on closeDate
    const ms = new Date(d.closeDate).getTime();
    if (
      dateRange === "quarter" &&
      (ms < startOfQuarterMs() || ms > endOfQuarterMs())
    )
      return false;
    if (dateRange === "month" && (ms < startOfMonthMs() || ms > endOfMonthMs()))
      return false;
    return true;
  });

  // use all mock deals for forecast (no date filter)
  const forecastDeals = orgFilteredDeals.filter((d) => {
    if (wsFilter !== "all" && d.workspace !== wsFilter) return false;
    return true;
  });

  const oppRecommendations = recommendations
    .filter(
      (r) =>
        (r.affectedEntityType as string) === "Opportunity" ||
        r.affectedEntityType === "Deal",
    )
    .slice(0, 2);

  function handleSaved() {
    if (!actor) return;
    actor
      .listOpportunitiesForCaller(null, "", "", null, null)
      .then(setOpps)
      .catch(() => {});
  }

  const viewButtons: {
    mode: ViewMode;
    icon: React.ReactNode;
    label: string;
    ocid: string;
  }[] = [
    {
      mode: "kanban",
      icon: <LayoutGrid size={15} />,
      label: "Kanban",
      ocid: "opportunities.view.kanban.toggle",
    },
    {
      mode: "list",
      icon: <List size={15} />,
      label: "List",
      ocid: "opportunities.view.list.toggle",
    },
    {
      mode: "forecast",
      icon: <LineChart size={15} />,
      label: "Forecast",
      ocid: "opportunities.view.forecast.toggle",
    },
  ];

  return (
    <div className="space-y-5 fade-in" data-ocid="opportunities.page">
      {/* ForgeAI strip */}
      {oppRecommendations.length > 0 && (
        <div
          className="p-3 rounded-xl border border-accent/20 bg-accent/5"
          data-ocid="opportunities.forgeai.panel"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap size={13} className="text-accent" />
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              ForgeAI Insights
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {oppRecommendations.map((rec) => (
              <ForgeAIRecommendationCard
                key={rec.id}
                recommendation={rec}
                showExpand={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground font-display">
            Pipeline
            <span className="ml-2 text-base font-normal text-muted-foreground">
              {filteredDeals.length} deals
            </span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your channel opportunity pipeline
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Workspace filter */}
          <select
            data-ocid="opportunities.workspace.select"
            value={wsFilter}
            onChange={(e) => setWsFilter(e.target.value as WorkspaceFilter)}
            className="crm-input text-xs px-3 py-2 h-9 rounded-lg cursor-pointer"
          >
            <option value="all">All Workspaces</option>
            <option value="vendor">Vendor</option>
            <option value="distributor">Distributor</option>
            <option value="reseller">Reseller</option>
          </select>
          {/* Date range */}
          <div
            className="flex items-center gap-0.5 border border-border rounded-lg p-0.5"
            data-ocid="opportunities.date_range.toggle"
          >
            {(["quarter", "month", "custom"] as DateRangeFilter[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDateRange(r)}
                className={`px-2.5 py-1 rounded text-xs transition-colors capitalize ${
                  dateRange === r
                    ? "bg-accent/20 text-accent font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "quarter"
                  ? "This Quarter"
                  : r === "month"
                    ? "This Month"
                    : "Custom"}
              </button>
            ))}
          </div>
          {/* View toggle */}
          <div
            className="flex items-center gap-0.5 border border-border rounded-lg p-0.5"
            data-ocid="opportunities.view.toggle"
          >
            {viewButtons.map((vb) => (
              <button
                key={vb.mode}
                type="button"
                data-ocid={vb.ocid}
                onClick={() => changeView(vb.mode)}
                aria-label={`${vb.label} view`}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs transition-colors ${
                  viewMode === vb.mode
                    ? "bg-accent/20 text-accent font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {vb.icon}
                <span className="hidden sm:inline">{vb.label}</span>
              </button>
            ))}
          </div>
          {/* New opportunity */}
          <Button
            type="button"
            data-ocid="opportunities.new_opportunity.open_modal_button"
            onClick={() => setShowNewModal(true)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground flex-none"
          >
            <Plus size={14} className="mr-1" /> New Opportunity
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatsBar deals={orgFilteredDeals} />

      {/* Search (Kanban + List only) */}
      {viewMode !== "forecast" && (
        <div className="relative max-w-sm">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            data-ocid="opportunities.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deals or accounts…"
            className="crm-input pl-9 h-9 text-sm"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>
      )}

      {/* Views */}
      {viewMode === "kanban" && <KanbanView deals={filteredDeals} />}
      {viewMode === "list" && (
        <ListView
          deals={filteredDeals}
          stageFilter={stageFilter}
          ownerFilter={ownerFilter}
          setStageFilter={setStageFilter}
          setOwnerFilter={setOwnerFilter}
          dateRange={dateRange}
          minValue={minValue}
          setMinValue={setMinValue}
        />
      )}
      {viewMode === "forecast" && <ForecastView deals={forecastDeals} />}

      {/* Modal */}
      {showNewModal && (
        <NewOpportunityModal
          onClose={() => setShowNewModal(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
