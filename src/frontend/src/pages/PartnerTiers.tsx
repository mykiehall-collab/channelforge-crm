import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Copy,
  Lock,
  Plus,
  ShieldAlert,
  Trash2,
  TriangleAlert,
  UserCog,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import {
  type CompanyProfile,
  PartnerTier,
  type TierAssignment,
  type TierConfig,
  type TierOverride,
  TierPermission,
  UserRole,
} from "../backend";
import TierBadge from "../components/TierBadge";
import { useActor } from "../hooks/useActor";
import { formatDate } from "../utils/channelforge";

// ── Permission metadata ──────────────────────────────────────────────────────
const PERM_LABELS: Record<TierPermission, string> = {
  [TierPermission.DealRegistrations]: "Deal Registrations",
  [TierPermission.MDFRequests]: "MDF / Funding Requests",
  [TierPermission.PromotionsVisibility]: "Promotions Visibility",
  [TierPermission.PricingDiscounts]: "Pricing & Discounts",
  [TierPermission.ForecastVisibility]: "Forecast Visibility",
  [TierPermission.CustomerAnalytics]: "Customer Analytics",
  [TierPermission.ExportPermissions]: "Data Export",
  [TierPermission.PipelineReporting]: "Pipeline Reporting",
  [TierPermission.AdvancedDashboards]: "Advanced Dashboards",
  [TierPermission.APIAccess]: "API Access",
  [TierPermission.RenewalVisibilityDepth]: "Renewal Visibility Depth",
  [TierPermission.AIRecommendations]: "AI / Recommendations",
  [TierPermission.StrategicAccountInsights]: "Strategic Account Insights",
  [TierPermission.SecondaryAdminAccess]: "Secondary Admin Access",
};

const ALL_PERMISSIONS = Object.values(TierPermission);
// Reseller Tiers page (renamed from Partner Tiers)
const TIERS = [PartnerTier.Silver, PartnerTier.Gold, PartnerTier.Platinum];

// ── Types ────────────────────────────────────────────────────────────────────
interface TierState {
  permissions: TierPermission[];
  maxSecondaryAdmins: number;
  dirty: boolean;
  saving: boolean;
}

type TierStates = Record<PartnerTier, TierState>;

function defaultTierState(): TierState {
  return {
    permissions: [],
    maxSecondaryAdmins: 2,
    dirty: false,
    saving: false,
  };
}

// ── Toggle row ───────────────────────────────────────────────────────────────
function PermToggleRow({
  perm,
  enabled,
  onToggle,
  idx,
  tier,
}: {
  perm: TierPermission;
  enabled: boolean;
  onToggle: () => void;
  idx: number;
  tier: PartnerTier;
}) {
  return (
    <div
      className={`flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors ${
        idx % 2 === 1 ? "bg-secondary/10" : ""
      }`}
      data-ocid={`tiers.${tier.toLowerCase()}.perm.${perm.toLowerCase()}.row`}
    >
      <span className="text-xs text-foreground/90 font-medium">
        {PERM_LABELS[perm]}
      </span>
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-accent scale-90"
        aria-label={`Toggle ${PERM_LABELS[perm]}`}
        data-ocid={`tiers.${tier.toLowerCase()}.perm.${perm.toLowerCase()}.switch`}
      />
    </div>
  );
}

// ── Tier panel ───────────────────────────────────────────────────────────────
function TierPanel({
  tier,
  state,
  onToggle,
  onSave,
  onCloneFrom,
  onMaxAdminsChange,
}: {
  tier: PartnerTier;
  state: TierState;
  onToggle: (perm: TierPermission) => void;
  onSave: () => void;
  onCloneFrom: (source: PartnerTier) => void;
  onMaxAdminsChange: (val: number) => void;
}) {
  const otherTiers = TIERS.filter((t) => t !== tier);
  const [cloneOpen, setCloneOpen] = useState(false);

  return (
    <div
      className="crm-card flex flex-col overflow-hidden"
      data-ocid={`tiers.${tier.toLowerCase()}.panel`}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <TierBadge tier={tier} size="lg" />
          <span className="text-xs text-muted-foreground">
            {state.permissions.length} / {ALL_PERMISSIONS.length} permissions
          </span>
        </div>

        {/* Clone dropdown */}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs h-7 text-muted-foreground hover:text-foreground gap-1"
            onClick={() => setCloneOpen((o) => !o)}
            data-ocid={`tiers.${tier.toLowerCase()}.clone_button`}
          >
            <Copy className="w-3 h-3" />
            Clone from
            <ChevronDown className="w-3 h-3" />
          </Button>
          {cloneOpen && (
            <div
              className="absolute right-0 top-full mt-1 z-20 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[140px]"
              data-ocid={`tiers.${tier.toLowerCase()}.clone_menu`}
            >
              {otherTiers.map((src) => (
                <button
                  key={src}
                  type="button"
                  className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-secondary/40 transition-colors flex items-center gap-2"
                  onClick={() => {
                    onCloneFrom(src);
                    setCloneOpen(false);
                  }}
                  data-ocid={`tiers.${tier.toLowerCase()}.clone_from.${src.toLowerCase()}.button`}
                >
                  <TierBadge tier={src} size="sm" />
                  {src}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Permission toggles */}
      <div className="flex flex-col px-3 py-2 flex-1 overflow-y-auto scrollbar-thin max-h-[520px]">
        {ALL_PERMISSIONS.map((perm, idx) => (
          <PermToggleRow
            key={perm}
            perm={perm}
            enabled={state.permissions.includes(perm)}
            onToggle={() => onToggle(perm)}
            idx={idx}
            tier={tier}
          />
        ))}
      </div>

      {/* Max secondary admins */}
      <div className="px-5 py-3 border-t border-border/60 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <Label className="text-xs text-muted-foreground">
            Max Secondary Admins
          </Label>
          <span className="text-[10px] text-muted-foreground/60">
            Allowed for this tier
          </span>
        </div>
        <Input
          type="number"
          min={0}
          max={50}
          value={state.maxSecondaryAdmins}
          onChange={(e) => onMaxAdminsChange(Number(e.target.value))}
          className="crm-input w-20 text-center text-sm h-8"
          data-ocid={`tiers.${tier.toLowerCase()}.max_admins.input`}
        />
      </div>

      {/* Save button */}
      <div className="px-5 py-3 border-t border-border">
        <Button
          type="button"
          className="w-full"
          disabled={!state.dirty || state.saving}
          onClick={onSave}
          data-ocid={`tiers.${tier.toLowerCase()}.save_button`}
        >
          {state.saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

// ── Assign tier modal ─────────────────────────────────────────────────────────
function AssignTierModal({
  reseller,
  onAssign,
  onClose,
}: {
  reseller: CompanyProfile;
  onAssign: (resellerId: string, tier: PartnerTier) => Promise<void>;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<PartnerTier>(PartnerTier.Silver);
  const [saving, setSaving] = useState(false);

  async function handleConfirm() {
    setSaving(true);
    await onAssign(reseller.id, selected);
    setSaving(false);
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="bg-card border-border max-w-sm"
        data-ocid="tiers.assign_tier.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="w-4 h-4 text-accent" />
            Assign Tier — {reseller.companyName}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2">
          <Label className="text-xs text-muted-foreground">
            Select Reseller Tier
          </Label>
          <div className="flex flex-col gap-2">
            {TIERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelected(t)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-colors ${
                  selected === t
                    ? "border-accent bg-accent/10"
                    : "border-border hover:bg-secondary/30"
                }`}
                data-ocid={`tiers.assign_tier.${t.toLowerCase()}.option`}
              >
                <TierBadge tier={t} size="md" />
                <span className="text-sm font-medium text-foreground">{t}</span>
                {selected === t && (
                  <CheckCircle2 className="w-4 h-4 text-accent ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            data-ocid="tiers.assign_tier.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={saving}
            onClick={handleConfirm}
            data-ocid="tiers.assign_tier.confirm_button"
          >
            {saving ? "Assigning..." : "Assign Tier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Add override modal ────────────────────────────────────────────────────────
function AddOverrideModal({
  resellers,
  onAdd,
  onClose,
}: {
  resellers: CompanyProfile[];
  onAdd: (
    resellerId: string,
    perm: TierPermission,
    granted: boolean,
    reason: string,
  ) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    resellerId: resellers[0]?.id ?? "",
    permission: TierPermission.DealRegistrations as TierPermission,
    granted: true,
    reason: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!form.reason.trim()) {
      toast.error("Reason is required for an override");
      return;
    }
    setSaving(true);
    await onAdd(form.resellerId, form.permission, form.granted, form.reason);
    setSaving(false);
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="tiers.add_override.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-accent" />
            Add Permission Override
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Reseller *</Label>
            <select
              value={form.resellerId}
              onChange={(e) =>
                setForm((f) => ({ ...f, resellerId: e.target.value }))
              }
              className="crm-input text-sm w-full px-3 py-2 bg-input border border-border rounded-[0.5rem] text-foreground"
              data-ocid="tiers.add_override.reseller.select"
            >
              {resellers.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.companyName}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Permission *
            </Label>
            <select
              value={form.permission}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  permission: e.target.value as TierPermission,
                }))
              }
              className="crm-input text-sm w-full px-3 py-2 bg-input border border-border rounded-[0.5rem] text-foreground"
              data-ocid="tiers.add_override.permission.select"
            >
              {ALL_PERMISSIONS.map((p) => (
                <option key={p} value={p}>
                  {PERM_LABELS[p]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Override Type *
            </Label>
            <div className="flex gap-2">
              {([true, false] as const).map((g) => (
                <button
                  key={String(g)}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, granted: g }))}
                  className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                    form.granted === g
                      ? g
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                        : "border-red-500/50 bg-red-500/10 text-red-400"
                      : "border-border text-muted-foreground hover:bg-secondary/30"
                  }`}
                  data-ocid={`tiers.add_override.${g ? "grant" : "revoke"}.toggle`}
                >
                  {g ? "Grant Access" : "Revoke Access"}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Reason *</Label>
            <Input
              value={form.reason}
              onChange={(e) =>
                setForm((f) => ({ ...f, reason: e.target.value }))
              }
              placeholder="e.g. Strategic account — approved by VP Sales"
              className="crm-input"
              data-ocid="tiers.add_override.reason.input"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            data-ocid="tiers.add_override.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={saving || !form.reason.trim()}
            onClick={handleSave}
            data-ocid="tiers.add_override.confirm_button"
          >
            {saving ? "Saving..." : "Add Override"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function PartnerTiers() {
  const { userProfile, companyProfile } = useApp();
  const { actor } = useActor();
  const navigate = useNavigate();

  const isVendorAdmin =
    userProfile?.role === UserRole.VendorAdmin ||
    userProfile?.role === UserRole.VendorPrimaryAdmin;

  const [tierStates, setTierStates] = useState<TierStates>({
    [PartnerTier.Silver]: defaultTierState(),
    [PartnerTier.Gold]: defaultTierState(),
    [PartnerTier.Platinum]: defaultTierState(),
  });
  const [resellers, setResellers] = useState<CompanyProfile[]>([]);
  const [tierAssignments, setTierAssignments] = useState<
    Record<string, TierAssignment | null>
  >({});
  const [allOverrides, setAllOverrides] = useState<TierOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignTarget, setAssignTarget] = useState<CompanyProfile | null>(null);
  const [addOverrideOpen, setAddOverrideOpen] = useState(false);
  const [removingOverride, setRemovingOverride] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!actor || !companyProfile) return;
    setLoading(true);
    try {
      const [configs, resellerList] = await Promise.all([
        actor.getTierConfigs(),
        actor.getResellersForVendor(companyProfile.id),
      ]);

      // Hydrate tier states
      const newStates: TierStates = {
        [PartnerTier.Silver]: defaultTierState(),
        [PartnerTier.Gold]: defaultTierState(),
        [PartnerTier.Platinum]: defaultTierState(),
      };
      for (const cfg of configs) {
        newStates[cfg.tier] = {
          permissions: [...cfg.permissions],
          maxSecondaryAdmins: Number(cfg.maxSecondaryAdmins),
          dirty: false,
          saving: false,
        };
      }
      setTierStates(newStates);
      setResellers([...resellerList]);

      // Load tier assignments for each reseller
      const assignments: Record<string, TierAssignment | null> = {};
      const overrides: TierOverride[] = [];
      await Promise.all(
        resellerList.map(async (r) => {
          const [asgn, ovrs] = await Promise.all([
            actor.getResellerTier(r.id).catch(() => null),
            actor.getOverridesForReseller(r.id).catch(() => []),
          ]);
          assignments[r.id] = asgn ?? null;
          overrides.push(...ovrs);
        }),
      );
      setTierAssignments(assignments);
      setAllOverrides(overrides);
    } catch {
      toast.error("Failed to load tier configuration");
    } finally {
      setLoading(false);
    }
  }, [actor, companyProfile]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Redirect non-vendor-admin — must be after all hooks
  if (!isVendorAdmin) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[400px] gap-4"
        data-ocid="tiers.access_restricted"
      >
        <Lock className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-xl font-bold font-display text-foreground">
          Access Restricted
        </h2>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Reseller Tier Management is only available to Vendor Admins.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/dashboard" })}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  function togglePermission(tier: PartnerTier, perm: TierPermission) {
    setTierStates((prev) => {
      const s = prev[tier];
      const has = s.permissions.includes(perm);
      return {
        ...prev,
        [tier]: {
          ...s,
          permissions: has
            ? s.permissions.filter((p) => p !== perm)
            : [...s.permissions, perm],
          dirty: true,
        },
      };
    });
  }

  function updateMaxAdmins(tier: PartnerTier, val: number) {
    setTierStates((prev) => ({
      ...prev,
      [tier]: { ...prev[tier], maxSecondaryAdmins: val, dirty: true },
    }));
  }

  async function saveTier(tier: PartnerTier) {
    if (!actor) return;
    const s = tierStates[tier];
    setTierStates((prev) => ({
      ...prev,
      [tier]: { ...prev[tier], saving: true },
    }));
    try {
      const ok = await actor.updateTierPermissions(
        tier,
        s.permissions,
        BigInt(s.maxSecondaryAdmins),
      );
      if (ok) {
        toast.success(`${tier} tier configuration saved`);
        setTierStates((prev) => ({
          ...prev,
          [tier]: { ...prev[tier], dirty: false },
        }));
      } else {
        toast.error("Failed to save tier configuration");
      }
    } catch {
      toast.error("Failed to save tier configuration");
    } finally {
      setTierStates((prev) => ({
        ...prev,
        [tier]: { ...prev[tier], saving: false },
      }));
    }
  }

  async function cloneTier(target: PartnerTier, source: PartnerTier) {
    if (!actor) return;
    try {
      const ok = await actor.cloneTierPermissions(source, target);
      if (ok) {
        toast.success(`Cloned ${source} → ${target}`);
        await loadData();
      } else {
        toast.error("Clone failed");
      }
    } catch {
      toast.error("Clone failed");
    }
  }

  async function assignTier(resellerId: string, tier: PartnerTier) {
    if (!actor) return;
    try {
      const ok = await actor.assignTierToReseller(resellerId, tier);
      if (ok) {
        const resellerName =
          resellers.find((r) => r.id === resellerId)?.companyName ?? resellerId;
        toast.success(`${resellerName} assigned to ${tier} tier`);
        setAssignTarget(null);
        await loadData();
      } else {
        toast.error("Failed to assign tier");
      }
    } catch {
      toast.error("Failed to assign tier");
    }
  }

  async function addOverride(
    resellerId: string,
    perm: TierPermission,
    granted: boolean,
    reason: string,
  ) {
    if (!actor) return;
    try {
      const ok = await actor.addTierOverride(resellerId, perm, granted, reason);
      if (ok) {
        toast.success("Override added successfully");
        setAddOverrideOpen(false);
        await loadData();
      } else {
        toast.error("Failed to add override");
      }
    } catch {
      toast.error("Failed to add override");
    }
  }

  const resellerNameMap = Object.fromEntries(
    resellers.map((r) => [r.id, r.companyName]),
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8 p-6 fade-in" data-ocid="tiers.page">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #FF6B2B, #FF8C5A)" }}
          >
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground leading-tight">
              Reseller Tier Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure access rights and permissions for each reseller tier
            </p>
          </div>
        </div>
        {/* Tier legend */}
        <div className="flex items-center gap-3 mt-3 ml-12">
          {TIERS.map((t) => (
            <TierBadge key={t} tier={t} size="md" />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            Tiers are full permission systems — not visual labels only.
          </span>
        </div>
      </div>

      {/* Tier permission panels */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {TIERS.map((t) => (
            <div
              key={t}
              className="crm-card"
              data-ocid={`tiers.${t.toLowerCase()}.loading_state`}
            >
              <div className="p-5 flex flex-col gap-3">
                <Skeleton className="h-8 w-28 bg-secondary/30" />
                {Array.from({ length: 8 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                  <Skeleton key={i} className="h-8 w-full bg-secondary/20" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
          data-ocid="tiers.panels.list"
        >
          {TIERS.map((tier) => (
            <TierPanel
              key={tier}
              tier={tier}
              state={tierStates[tier]}
              onToggle={(perm) => togglePermission(tier, perm)}
              onSave={() => saveTier(tier)}
              onCloneFrom={(src) => cloneTier(tier, src)}
              onMaxAdminsChange={(val) => updateMaxAdmins(tier, val)}
            />
          ))}
        </div>
      )}

      {/* ── Tier Assignments ──────────────────────────────────────────────────── */}
      <section data-ocid="tiers.assignments.section">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-display text-foreground">
              Tier Assignments
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Assign reseller tiers to reseller organizations
            </p>
          </div>
        </div>

        <div className="crm-card overflow-hidden">
          {loading ? (
            <div
              className="p-4 flex flex-col gap-2"
              data-ocid="tiers.assignments.loading_state"
            >
              {["s1", "s2", "s3"].map((k) => (
                <Skeleton key={k} className="h-12 w-full bg-secondary/30" />
              ))}
            </div>
          ) : resellers.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 gap-2"
              data-ocid="tiers.assignments.empty_state"
            >
              <AlertTriangle className="w-10 h-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No resellers found
              </p>
              <p className="text-xs text-muted-foreground">
                Create reseller partners in Admin Settings first
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "Reseller",
                      "Current Tier",
                      "Assigned Date",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resellers.map((r, idx) => {
                    const assignment = tierAssignments[r.id];
                    return (
                      <tr
                        key={r.id}
                        data-ocid={`tiers.assignments.item.${idx + 1}`}
                        className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${
                          idx % 2 === 1 ? "bg-secondary/10" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0">
                              {r.companyName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-foreground font-medium text-sm">
                                {r.companyName}
                              </p>
                              <p className="text-[10px] text-muted-foreground font-mono">
                                @{r.emailDomain}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {assignment ? (
                            <TierBadge tier={assignment.tier} size="md" />
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              No tier assigned
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {assignment ? formatDate(assignment.assignedAt) : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="border-border text-xs h-7 gap-1.5"
                            onClick={() => setAssignTarget(r)}
                            data-ocid={`tiers.assignments.assign.button.${idx + 1}`}
                          >
                            <UserCog className="w-3 h-3" />
                            {assignment ? "Change Tier" : "Assign Tier"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ── Per-Account Overrides ─────────────────────────────────────────────── */}
      <section data-ocid="tiers.overrides.section">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-display text-foreground">
              Per-Account Overrides
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Grant or revoke individual permissions outside the standard tier
              configuration
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            className="gap-1.5"
            onClick={() => setAddOverrideOpen(true)}
            disabled={resellers.length === 0}
            data-ocid="tiers.overrides.add_button"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Override
          </Button>
        </div>

        <div className="crm-card overflow-hidden">
          {loading ? (
            <div
              className="p-4 flex flex-col gap-2"
              data-ocid="tiers.overrides.loading_state"
            >
              {["s1", "s2", "s3"].map((k) => (
                <Skeleton key={k} className="h-10 w-full bg-secondary/30" />
              ))}
            </div>
          ) : allOverrides.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-10 gap-2"
              data-ocid="tiers.overrides.empty_state"
            >
              <TriangleAlert className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No overrides configured
              </p>
              <p className="text-xs text-muted-foreground">
                Use overrides to grant or revoke specific permissions for
                individual resellers.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "Reseller",
                      "Permission",
                      "Access",
                      "Reason",
                      "Date",
                      "Applied By",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allOverrides.map((ov, idx) => (
                    <tr
                      key={`${ov.resellerId}-${ov.permission}`}
                      data-ocid={`tiers.overrides.item.${idx + 1}`}
                      className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${
                        idx % 2 === 1 ? "bg-secondary/10" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {resellerNameMap[ov.resellerId] ?? ov.resellerId}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {PERM_LABELS[ov.permission] ?? ov.permission}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`status-badge text-[11px] font-semibold ${
                            ov.granted
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                              : "bg-red-500/15 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {ov.granted ? "Granted" : "Revoked"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">
                        {ov.reason}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(ov.overriddenAt)}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono truncate max-w-[140px]">
                        {ov.overriddenBy?.toString().slice(0, 12) ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 text-xs h-7 px-2"
                          disabled={
                            removingOverride ===
                            `${ov.resellerId}-${ov.permission}`
                          }
                          onClick={async () => {
                            if (!actor) return;
                            const key = `${ov.resellerId}-${ov.permission}`;
                            setRemovingOverride(key);
                            try {
                              await actor.addTierOverride(
                                ov.resellerId,
                                ov.permission,
                                false,
                                "revoked",
                              );
                              toast.success(
                                "Override revoked — audit trail updated",
                              );
                              await loadData();
                            } catch {
                              toast.error("Failed to revoke override");
                            } finally {
                              setRemovingOverride(null);
                            }
                          }}
                          aria-label="Revoke override"
                          data-ocid={`tiers.overrides.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      {assignTarget && (
        <AssignTierModal
          reseller={assignTarget}
          onAssign={assignTier}
          onClose={() => setAssignTarget(null)}
        />
      )}
      {addOverrideOpen && resellers.length > 0 && (
        <AddOverrideModal
          resellers={resellers}
          onAdd={addOverride}
          onClose={() => setAddOverrideOpen(false)}
        />
      )}
    </div>
  );
}
