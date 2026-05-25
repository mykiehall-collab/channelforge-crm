import { c as createLucideIcon, u as useApp, p as useActor, a as useNavigate, q as UserRole, r as reactExports, bm as PartnerTier, ab as ue, j as jsxRuntimeExports, L as Lock, m as Button, T as TriangleAlert, af as formatDate, a8 as Plus, aC as Trash2, az as Copy, k as ChevronDown, aF as Label, ad as Input, bn as TierPermission, J as CircleCheck } from "./index-DvFvlUBj.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-CJsIFtIC.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { S as Switch } from "./switch-7D4xT4MC.js";
import { T as TierBadge } from "./TierBadge-juuOTVtt.js";
import { S as ShieldAlert } from "./shield-alert-BCLvkGRD.js";
import "./index-D-5r5K-M.js";
import "./index-CwZfxY3Y.js";
import "./index-B1ifXNtV.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M10 15H6a4 4 0 0 0-4 4v2", key: "1nfge6" }],
  ["path", { d: "m14.305 16.53.923-.382", key: "1itpsq" }],
  ["path", { d: "m15.228 13.852-.923-.383", key: "eplpkm" }],
  ["path", { d: "m16.852 12.228-.383-.923", key: "13v3q0" }],
  ["path", { d: "m16.852 17.772-.383.924", key: "1i8mnm" }],
  ["path", { d: "m19.148 12.228.383-.923", key: "1q8j1v" }],
  ["path", { d: "m19.53 18.696-.382-.924", key: "vk1qj3" }],
  ["path", { d: "m20.772 13.852.924-.383", key: "n880s0" }],
  ["path", { d: "m20.772 16.148.924.383", key: "1g6xey" }],
  ["circle", { cx: "18", cy: "15", r: "3", key: "gjjjvw" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCog = createLucideIcon("user-cog", __iconNode);
const PERM_LABELS = {
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
  [TierPermission.SecondaryAdminAccess]: "Secondary Admin Access"
};
const ALL_PERMISSIONS = Object.values(TierPermission);
const TIERS = [PartnerTier.Silver, PartnerTier.Gold, PartnerTier.Platinum];
function defaultTierState() {
  return {
    permissions: [],
    maxSecondaryAdmins: 2,
    dirty: false,
    saving: false
  };
}
function PermToggleRow({
  perm,
  enabled,
  onToggle,
  idx,
  tier
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors ${idx % 2 === 1 ? "bg-secondary/10" : ""}`,
      "data-ocid": `tiers.${tier.toLowerCase()}.perm.${perm.toLowerCase()}.row`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground/90 font-medium", children: PERM_LABELS[perm] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            checked: enabled,
            onCheckedChange: onToggle,
            className: "data-[state=checked]:bg-accent scale-90",
            "aria-label": `Toggle ${PERM_LABELS[perm]}`,
            "data-ocid": `tiers.${tier.toLowerCase()}.perm.${perm.toLowerCase()}.switch`
          }
        )
      ]
    }
  );
}
function TierPanel({
  tier,
  state,
  onToggle,
  onSave,
  onCloneFrom,
  onMaxAdminsChange
}) {
  const otherTiers = TIERS.filter((t) => t !== tier);
  const [cloneOpen, setCloneOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "crm-card flex flex-col overflow-hidden",
      "data-ocid": `tiers.${tier.toLowerCase()}.panel`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TierBadge, { tier, size: "lg" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              state.permissions.length,
              " / ",
              ALL_PERMISSIONS.length,
              " permissions"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                className: "text-xs h-7 text-muted-foreground hover:text-foreground gap-1",
                onClick: () => setCloneOpen((o) => !o),
                "data-ocid": `tiers.${tier.toLowerCase()}.clone_button`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" }),
                  "Clone from",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3 h-3" })
                ]
              }
            ),
            cloneOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute right-0 top-full mt-1 z-20 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[140px]",
                "data-ocid": `tiers.${tier.toLowerCase()}.clone_menu`,
                children: otherTiers.map((src) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "w-full text-left px-3 py-2 text-xs text-foreground hover:bg-secondary/40 transition-colors flex items-center gap-2",
                    onClick: () => {
                      onCloneFrom(src);
                      setCloneOpen(false);
                    },
                    "data-ocid": `tiers.${tier.toLowerCase()}.clone_from.${src.toLowerCase()}.button`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TierBadge, { tier: src, size: "sm" }),
                      src
                    ]
                  },
                  src
                ))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col px-3 py-2 flex-1 overflow-y-auto scrollbar-thin max-h-[520px]", children: ALL_PERMISSIONS.map((perm, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          PermToggleRow,
          {
            perm,
            enabled: state.permissions.includes(perm),
            onToggle: () => onToggle(perm),
            idx,
            tier
          },
          perm
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-t border-border/60 flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Max Secondary Admins" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60", children: "Allowed for this tier" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 0,
              max: 50,
              value: state.maxSecondaryAdmins,
              onChange: (e) => onMaxAdminsChange(Number(e.target.value)),
              className: "crm-input w-20 text-center text-sm h-8",
              "data-ocid": `tiers.${tier.toLowerCase()}.max_admins.input`
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            className: "w-full",
            disabled: !state.dirty || state.saving,
            onClick: onSave,
            "data-ocid": `tiers.${tier.toLowerCase()}.save_button`,
            children: state.saving ? "Saving..." : "Save Changes"
          }
        ) })
      ]
    }
  );
}
function AssignTierModal({
  reseller,
  onAssign,
  onClose
}) {
  const [selected, setSelected] = reactExports.useState(PartnerTier.Silver);
  const [saving, setSaving] = reactExports.useState(false);
  async function handleConfirm() {
    setSaving(true);
    await onAssign(reseller.id, selected);
    setSaving(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-sm",
      "data-ocid": "tiers.assign_tier.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "w-4 h-4 text-accent" }),
          "Assign Tier — ",
          reseller.companyName
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Select Reseller Tier" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: TIERS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setSelected(t),
              className: `flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-colors ${selected === t ? "border-accent bg-accent/10" : "border-border hover:bg-secondary/30"}`,
              "data-ocid": `tiers.assign_tier.${t.toLowerCase()}.option`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TierBadge, { tier: t, size: "md" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: t }),
                selected === t && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-accent ml-auto" })
              ]
            },
            t
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              onClick: onClose,
              "data-ocid": "tiers.assign_tier.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              disabled: saving,
              onClick: handleConfirm,
              "data-ocid": "tiers.assign_tier.confirm_button",
              children: saving ? "Assigning..." : "Assign Tier"
            }
          )
        ] })
      ]
    }
  ) });
}
function AddOverrideModal({
  resellers,
  onAdd,
  onClose
}) {
  var _a;
  const [form, setForm] = reactExports.useState({
    resellerId: ((_a = resellers[0]) == null ? void 0 : _a.id) ?? "",
    permission: TierPermission.DealRegistrations,
    granted: true,
    reason: ""
  });
  const [saving, setSaving] = reactExports.useState(false);
  async function handleSave() {
    if (!form.reason.trim()) {
      ue.error("Reason is required for an override");
      return;
    }
    setSaving(true);
    await onAdd(form.resellerId, form.permission, form.granted, form.reason);
    setSaving(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-md",
      "data-ocid": "tiers.add_override.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-4 h-4 text-accent" }),
          "Add Permission Override"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Reseller *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                value: form.resellerId,
                onChange: (e) => setForm((f) => ({ ...f, resellerId: e.target.value })),
                className: "crm-input text-sm w-full px-3 py-2 bg-input border border-border rounded-[0.5rem] text-foreground",
                "data-ocid": "tiers.add_override.reseller.select",
                children: resellers.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r.id, children: r.companyName }, r.id))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Permission *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                value: form.permission,
                onChange: (e) => setForm((f) => ({
                  ...f,
                  permission: e.target.value
                })),
                className: "crm-input text-sm w-full px-3 py-2 bg-input border border-border rounded-[0.5rem] text-foreground",
                "data-ocid": "tiers.add_override.permission.select",
                children: ALL_PERMISSIONS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p, children: PERM_LABELS[p] }, p))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Override Type *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [true, false].map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setForm((f) => ({ ...f, granted: g })),
                className: `flex-1 py-2 rounded-lg border text-xs font-semibold transition-colors ${form.granted === g ? g ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-red-500/50 bg-red-500/10 text-red-400" : "border-border text-muted-foreground hover:bg-secondary/30"}`,
                "data-ocid": `tiers.add_override.${g ? "grant" : "revoke"}.toggle`,
                children: g ? "Grant Access" : "Revoke Access"
              },
              String(g)
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Reason *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.reason,
                onChange: (e) => setForm((f) => ({ ...f, reason: e.target.value })),
                placeholder: "e.g. Strategic account — approved by VP Sales",
                className: "crm-input",
                "data-ocid": "tiers.add_override.reason.input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              onClick: onClose,
              "data-ocid": "tiers.add_override.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              disabled: saving || !form.reason.trim(),
              onClick: handleSave,
              "data-ocid": "tiers.add_override.confirm_button",
              children: saving ? "Saving..." : "Add Override"
            }
          )
        ] })
      ]
    }
  ) });
}
function PartnerTiers() {
  const { userProfile, companyProfile } = useApp();
  const { actor } = useActor();
  const navigate = useNavigate();
  const isVendorAdmin = (userProfile == null ? void 0 : userProfile.role) === UserRole.VendorAdmin || (userProfile == null ? void 0 : userProfile.role) === UserRole.VendorPrimaryAdmin;
  const [tierStates, setTierStates] = reactExports.useState({
    [PartnerTier.Silver]: defaultTierState(),
    [PartnerTier.Gold]: defaultTierState(),
    [PartnerTier.Platinum]: defaultTierState()
  });
  const [resellers, setResellers] = reactExports.useState([]);
  const [tierAssignments, setTierAssignments] = reactExports.useState({});
  const [allOverrides, setAllOverrides] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [assignTarget, setAssignTarget] = reactExports.useState(null);
  const [addOverrideOpen, setAddOverrideOpen] = reactExports.useState(false);
  const [removingOverride, setRemovingOverride] = reactExports.useState(null);
  const loadData = reactExports.useCallback(async () => {
    if (!actor || !companyProfile) return;
    setLoading(true);
    try {
      const [configs, resellerList] = await Promise.all([
        actor.getTierConfigs(),
        actor.getResellersForVendor(companyProfile.id)
      ]);
      const newStates = {
        [PartnerTier.Silver]: defaultTierState(),
        [PartnerTier.Gold]: defaultTierState(),
        [PartnerTier.Platinum]: defaultTierState()
      };
      for (const cfg of configs) {
        newStates[cfg.tier] = {
          permissions: [...cfg.permissions],
          maxSecondaryAdmins: Number(cfg.maxSecondaryAdmins),
          dirty: false,
          saving: false
        };
      }
      setTierStates(newStates);
      setResellers([...resellerList]);
      const assignments = {};
      const overrides = [];
      await Promise.all(
        resellerList.map(async (r) => {
          const [asgn, ovrs] = await Promise.all([
            actor.getResellerTier(r.id).catch(() => null),
            actor.getOverridesForReseller(r.id).catch(() => [])
          ]);
          assignments[r.id] = asgn ?? null;
          overrides.push(...ovrs);
        })
      );
      setTierAssignments(assignments);
      setAllOverrides(overrides);
    } catch {
      ue.error("Failed to load tier configuration");
    } finally {
      setLoading(false);
    }
  }, [actor, companyProfile]);
  reactExports.useEffect(() => {
    loadData();
  }, [loadData]);
  if (!isVendorAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-[400px] gap-4",
        "data-ocid": "tiers.access_restricted",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-16 h-16 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-display text-foreground", children: "Access Restricted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center max-w-xs", children: "Reseller Tier Management is only available to Vendor Admins." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => navigate({ to: "/dashboard" }),
              children: "Back to Dashboard"
            }
          )
        ]
      }
    );
  }
  function togglePermission(tier, perm) {
    setTierStates((prev) => {
      const s = prev[tier];
      const has = s.permissions.includes(perm);
      return {
        ...prev,
        [tier]: {
          ...s,
          permissions: has ? s.permissions.filter((p) => p !== perm) : [...s.permissions, perm],
          dirty: true
        }
      };
    });
  }
  function updateMaxAdmins(tier, val) {
    setTierStates((prev) => ({
      ...prev,
      [tier]: { ...prev[tier], maxSecondaryAdmins: val, dirty: true }
    }));
  }
  async function saveTier(tier) {
    if (!actor) return;
    const s = tierStates[tier];
    setTierStates((prev) => ({
      ...prev,
      [tier]: { ...prev[tier], saving: true }
    }));
    try {
      const ok = await actor.updateTierPermissions(
        tier,
        s.permissions,
        BigInt(s.maxSecondaryAdmins)
      );
      if (ok) {
        ue.success(`${tier} tier configuration saved`);
        setTierStates((prev) => ({
          ...prev,
          [tier]: { ...prev[tier], dirty: false }
        }));
      } else {
        ue.error("Failed to save tier configuration");
      }
    } catch {
      ue.error("Failed to save tier configuration");
    } finally {
      setTierStates((prev) => ({
        ...prev,
        [tier]: { ...prev[tier], saving: false }
      }));
    }
  }
  async function cloneTier(target, source) {
    if (!actor) return;
    try {
      const ok = await actor.cloneTierPermissions(source, target);
      if (ok) {
        ue.success(`Cloned ${source} → ${target}`);
        await loadData();
      } else {
        ue.error("Clone failed");
      }
    } catch {
      ue.error("Clone failed");
    }
  }
  async function assignTier(resellerId, tier) {
    var _a;
    if (!actor) return;
    try {
      const ok = await actor.assignTierToReseller(resellerId, tier);
      if (ok) {
        const resellerName = ((_a = resellers.find((r) => r.id === resellerId)) == null ? void 0 : _a.companyName) ?? resellerId;
        ue.success(`${resellerName} assigned to ${tier} tier`);
        setAssignTarget(null);
        await loadData();
      } else {
        ue.error("Failed to assign tier");
      }
    } catch {
      ue.error("Failed to assign tier");
    }
  }
  async function addOverride(resellerId, perm, granted, reason) {
    if (!actor) return;
    try {
      const ok = await actor.addTierOverride(resellerId, perm, granted, reason);
      if (ok) {
        ue.success("Override added successfully");
        setAddOverrideOpen(false);
        await loadData();
      } else {
        ue.error("Failed to add override");
      }
    } catch {
      ue.error("Failed to add override");
    }
  }
  const resellerNameMap = Object.fromEntries(
    resellers.map((r) => [r.id, r.companyName])
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-8 p-6 fade-in", "data-ocid": "tiers.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
            style: { background: "linear-gradient(135deg, #FF6B2B, #FF8C5A)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-5 h-5 text-white" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-display text-foreground leading-tight", children: "Reseller Tier Management" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Configure access rights and permissions for each reseller tier" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-3 ml-12", children: [
        TIERS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(TierBadge, { tier: t, size: "md" }, t)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-1", children: "Tiers are full permission systems — not visual labels only." })
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: TIERS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "crm-card",
        "data-ocid": `tiers.${t.toLowerCase()}.loading_state`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-28 bg-secondary/30" }),
          Array.from({ length: 8 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full bg-secondary/20" }, i)
          ))
        ] })
      },
      t
    )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-5",
        "data-ocid": "tiers.panels.list",
        children: TIERS.map((tier) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          TierPanel,
          {
            tier,
            state: tierStates[tier],
            onToggle: (perm) => togglePermission(tier, perm),
            onSave: () => saveTier(tier),
            onCloneFrom: (src) => cloneTier(tier, src),
            onMaxAdminsChange: (val) => updateMaxAdmins(tier, val)
          },
          tier
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "tiers.assignments.section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold font-display text-foreground", children: "Tier Assignments" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Assign reseller tiers to reseller organizations" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card overflow-hidden", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "p-4 flex flex-col gap-2",
          "data-ocid": "tiers.assignments.loading_state",
          children: ["s1", "s2", "s3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full bg-secondary/30" }, k))
        }
      ) : resellers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-12 gap-2",
          "data-ocid": "tiers.assignments.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-10 h-10 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No resellers found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Create reseller partners in Admin Settings first" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto scrollbar-thin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
          "Reseller",
          "Current Tier",
          "Assigned Date",
          "Actions"
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: resellers.map((r, idx) => {
          const assignment = tierAssignments[r.id];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              "data-ocid": `tiers.assignments.item.${idx + 1}`,
              className: `border-b border-border/50 hover:bg-secondary/20 transition-colors ${idx % 2 === 1 ? "bg-secondary/10" : ""}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0", children: r.companyName.slice(0, 2).toUpperCase() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium text-sm", children: r.companyName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground font-mono", children: [
                      "@",
                      r.emailDomain
                    ] })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: assignment ? /* @__PURE__ */ jsxRuntimeExports.jsx(TierBadge, { tier: assignment.tier, size: "md" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground italic", children: "No tier assigned" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground whitespace-nowrap", children: assignment ? formatDate(assignment.assignedAt) : "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    className: "border-border text-xs h-7 gap-1.5",
                    onClick: () => setAssignTarget(r),
                    "data-ocid": `tiers.assignments.assign.button.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "w-3 h-3" }),
                      assignment ? "Change Tier" : "Assign Tier"
                    ]
                  }
                ) })
              ]
            },
            r.id
          );
        }) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "tiers.overrides.section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold font-display text-foreground", children: "Per-Account Overrides" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Grant or revoke individual permissions outside the standard tier configuration" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            size: "sm",
            className: "gap-1.5",
            onClick: () => setAddOverrideOpen(true),
            disabled: resellers.length === 0,
            "data-ocid": "tiers.overrides.add_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
              "Add Override"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card overflow-hidden", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "p-4 flex flex-col gap-2",
          "data-ocid": "tiers.overrides.loading_state",
          children: ["s1", "s2", "s3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-secondary/30" }, k))
        }
      ) : allOverrides.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-10 gap-2",
          "data-ocid": "tiers.overrides.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-8 h-8 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No overrides configured" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Use overrides to grant or revoke specific permissions for individual resellers." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto scrollbar-thin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
          "Reseller",
          "Permission",
          "Access",
          "Reason",
          "Date",
          "Applied By",
          ""
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: allOverrides.map((ov, idx) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              "data-ocid": `tiers.overrides.item.${idx + 1}`,
              className: `border-b border-border/50 hover:bg-secondary/20 transition-colors ${idx % 2 === 1 ? "bg-secondary/10" : ""}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: resellerNameMap[ov.resellerId] ?? ov.resellerId }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: PERM_LABELS[ov.permission] ?? ov.permission }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `status-badge text-[11px] font-semibold ${ov.granted ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-red-500/15 text-red-400 border border-red-500/20"}`,
                    children: ov.granted ? "Granted" : "Revoked"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate", children: ov.reason }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground whitespace-nowrap", children: formatDate(ov.overriddenAt) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground font-mono truncate max-w-[140px]", children: ((_a = ov.overriddenBy) == null ? void 0 : _a.toString().slice(0, 12)) ?? "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "ghost",
                    className: "text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 text-xs h-7 px-2",
                    disabled: removingOverride === `${ov.resellerId}-${ov.permission}`,
                    onClick: async () => {
                      if (!actor) return;
                      const key = `${ov.resellerId}-${ov.permission}`;
                      setRemovingOverride(key);
                      try {
                        await actor.addTierOverride(
                          ov.resellerId,
                          ov.permission,
                          false,
                          "revoked"
                        );
                        ue.success(
                          "Override revoked — audit trail updated"
                        );
                        await loadData();
                      } catch {
                        ue.error("Failed to revoke override");
                      } finally {
                        setRemovingOverride(null);
                      }
                    },
                    "aria-label": "Revoke override",
                    "data-ocid": `tiers.overrides.delete_button.${idx + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                ) })
              ]
            },
            `${ov.resellerId}-${ov.permission}`
          );
        }) })
      ] }) }) })
    ] }),
    assignTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AssignTierModal,
      {
        reseller: assignTarget,
        onAssign: assignTier,
        onClose: () => setAssignTarget(null)
      }
    ),
    addOverrideOpen && resellers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddOverrideModal,
      {
        resellers,
        onAdd: addOverride,
        onClose: () => setAddOverrideOpen(false)
      }
    )
  ] });
}
export {
  PartnerTiers
};
