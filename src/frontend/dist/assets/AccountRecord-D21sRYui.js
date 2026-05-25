import { c as createLucideIcon, ag as useRouterState, a as useNavigate, p as useActor, u as useApp, r as reactExports, ah as CustomFieldObjectType, O as AccountStatus, j as jsxRuntimeExports, B as Building2, m as Button, ai as ArrowLeft, ae as accountStatusColor, E as ExternalLink, W as formatCurrency, af as formatDate, ab as ue, y as Target, a8 as Plus, U as Users, e as TrendingUp, Z as Zap, V as FileText, J as CircleCheck, a9 as Globe, N as MessageSquare, a3 as GitBranch, L as Lock, G as RefreshCcw, ad as Input, T as TriangleAlert, a6 as RefreshCw, aj as getInitials, ak as dealStatusLabel, al as dealStatusColor, o as Badge, am as Sparkles, an as timeAgo } from "./index-DvFvlUBj.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { u as useCustomFields, C as CustomFieldEditor } from "./useCustomFields-Do4Q3M8P.js";
import { C as CustomFieldRenderer } from "./CustomFieldRenderer-DSYXzkdv.js";
import { F as ForgeAIRecommendationCard } from "./ForgeAIRecommendationCard-C4eBPTAG.js";
import { P as PriceCalculator } from "./PriceCalculator-Cfqa4XfP.js";
import { u as useForgeAI } from "./useForgeAI-CFLYJlF1.js";
import { P as Pencil } from "./pencil-CSymqQ5s.js";
import { U as UserCheck } from "./user-check-B5oPdNCD.js";
import { C as Calendar } from "./calendar-BzO3LGDM.js";
import { P as Pen } from "./pen-CQ3Xm2Uu.js";
import { B as BrainCircuit } from "./brain-circuit-DUSNG23G.js";
import { C as Calculator } from "./calculator-hUciaH5t.js";
import { M as Mail } from "./mail-BpQyu_iW.js";
import { P as Phone } from "./phone-DSozTLzi.js";
import { M as MapPin } from "./map-pin-BB_ykcTK.js";
import { L as LayoutGrid } from "./layout-grid-CWVFWNqK.js";
import "./checkbox-Cr6u9Lap.js";
import "./index-CwZfxY3Y.js";
import "./index-B1ifXNtV.js";
import "./textarea-BHUaDciu.js";
import "./useMutation-D0Tr8pyU.js";
import "./download-DVLbZ_Ir.js";
import "./minus-OwCcNK6_.js";
import "./backend.d-Bio-_uWv.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "m9 14 2 2 4-4", key: "df797q" }]
];
const ClipboardCheck = createLucideIcon("clipboard-check", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ]
];
const Clipboard = createLucideIcon("clipboard", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
      key: "1kt360"
    }
  ]
];
const Folder = createLucideIcon("folder", __iconNode);
const VISIBILITY_PREFIXES = {
  internal: "[INTERNAL] ",
  "external-vendor": "[EXTERNAL:vendor] ",
  "external-distributor": "[EXTERNAL:distributor] ",
  "external-reseller": "[EXTERNAL:reseller] "
};
const TABS = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "opportunities", label: "Opportunities", icon: TrendingUp },
  { id: "renewals", label: "Renewals", icon: Calendar },
  { id: "deal-regs", label: "Deal Registrations", icon: Pen },
  { id: "products", label: "Products & Subscriptions", icon: Zap },
  { id: "timeline", label: "Activity Timeline", icon: Target },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "documents", label: "Documents", icon: Folder },
  { id: "tasks", label: "Tasks", icon: CircleCheck },
  { id: "marketing", label: "Marketing Activity", icon: Globe },
  { id: "mdf", label: "MDF Activity", icon: MessageSquare },
  { id: "stakeholders", label: "Stakeholders", icon: UserCheck },
  {
    id: "channel-relationships",
    label: "Channel Relationships",
    icon: GitBranch
  },
  { id: "ai-insights", label: "AI Insights", icon: BrainCircuit },
  { id: "external-access", label: "External Access", icon: Lock },
  { id: "price-calculator", label: "Price Calculator", icon: Calculator }
];
function parseNoteVisibility(content) {
  if (content.startsWith("[EXTERNAL:vendor] "))
    return {
      visibility: "external-vendor",
      displayContent: content.slice("[EXTERNAL:vendor] ".length)
    };
  if (content.startsWith("[EXTERNAL:distributor] "))
    return {
      visibility: "external-distributor",
      displayContent: content.slice("[EXTERNAL:distributor] ".length)
    };
  if (content.startsWith("[EXTERNAL:reseller] "))
    return {
      visibility: "external-reseller",
      displayContent: content.slice("[EXTERNAL:reseller] ".length)
    };
  if (content.startsWith("[INTERNAL] "))
    return {
      visibility: "internal",
      displayContent: content.slice("[INTERNAL] ".length)
    };
  return { visibility: "internal", displayContent: content };
}
function getDaysUntilRenewal(renewalDate) {
  if (renewalDate <= BigInt(0)) return null;
  return Math.round(
    (Number(renewalDate) / 1e6 - Date.now()) / 864e5
  );
}
function getHealthScore(status, daysUntilRenewal) {
  if (status === AccountStatus.Churned) return 15;
  if (status === AccountStatus.AtRisk) return 35;
  if (daysUntilRenewal !== null && daysUntilRenewal <= 30) return 52;
  if (daysUntilRenewal !== null && daysUntilRenewal <= 90) return 68;
  return 82;
}
function HealthGauge({ score }) {
  const colorClass = score >= 80 ? "text-emerald-400" : score >= 50 ? "text-orange-400" : "text-red-400/70";
  const label = score >= 80 ? "Healthy" : score >= 50 ? "Moderate" : "At Risk";
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = score / 100 * circ;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        width: "52",
        height: "52",
        viewBox: "0 0 52 52",
        role: "img",
        "aria-label": `Health score: ${score}`,
        className: colorClass,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("title", { children: [
            "Health score: ",
            score
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "circle",
            {
              cx: "26",
              cy: "26",
              r,
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "5",
              className: "text-white/[0.08]"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "circle",
            {
              cx: "26",
              cy: "26",
              r,
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "5",
              strokeDasharray: `${dash} ${circ - dash}`,
              strokeDashoffset: circ / 4,
              strokeLinecap: "round"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "text",
            {
              x: "26",
              y: "30",
              textAnchor: "middle",
              fontSize: "11",
              fontWeight: "700",
              fill: "currentColor",
              children: score
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-semibold uppercase tracking-wide text-muted-foreground", children: label })
  ] });
}
function AccountRecord() {
  var _a;
  const routerState = useRouterState();
  const id = routerState.location.pathname.split("/accounts/")[1];
  const navigate = useNavigate();
  const { actor } = useActor();
  const {
    accounts,
    dealRegistrations,
    refreshAccounts,
    userProfile,
    isVendor,
    companyProfile,
    canEditField,
    canEditAccount
  } = useApp();
  const account = accounts.find((a) => a.id === id);
  const [contacts, setContacts] = reactExports.useState([]);
  const [notes, setNotes] = reactExports.useState([]);
  const [detailLoading, setDetailLoading] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const [copiedId, setCopiedId] = reactExports.useState(false);
  const [editingCustomFields, setEditingCustomFields] = reactExports.useState(false);
  const customFields = useCustomFields(
    CustomFieldObjectType.customerAccount,
    id ?? ""
  );
  const [resellerProfiles, setResellerProfiles] = reactExports.useState(
    []
  );
  const [showReassign, setShowReassign] = reactExports.useState(false);
  const [newResellerId, setNewResellerId] = reactExports.useState("");
  const [reassigning, setReassigning] = reactExports.useState(false);
  const [noteContent, setNoteContent] = reactExports.useState("");
  const [noteVisibility, setNoteVisibility] = reactExports.useState("internal");
  const [savingNote, setSavingNote] = reactExports.useState(false);
  const [editingNoteId, setEditingNoteId] = reactExports.useState(null);
  const [editNoteContent, setEditNoteContent] = reactExports.useState("");
  const [timelineFilter, setTimelineFilter] = reactExports.useState("All");
  const [showEdit, setShowEdit] = reactExports.useState(false);
  const [editForm, setEditForm] = reactExports.useState({
    accountName: "",
    customerDomain: "",
    resellerOwnerId: "",
    vendorOwnerId: "",
    contractType: "",
    estimatedRenewalValue: "",
    licenceQuantity: "",
    products: "",
    status: AccountStatus.Active,
    customerIdNumber: ""
  });
  const [saving, setSaving] = reactExports.useState(false);
  const [duplicateCheck, setDuplicateCheck] = reactExports.useState(null);
  const [checkingDuplicate, setCheckingDuplicate] = reactExports.useState(false);
  const [customerIdStatus, setCustomerIdStatus] = reactExports.useState("idle");
  const [customerIdMsg, setCustomerIdMsg] = reactExports.useState("");
  const [generatingId, setGeneratingId] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!id || !actor) return;
    setDetailLoading(true);
    Promise.all([
      actor.getContactsByAccount(id).catch(() => []),
      actor.getNotesByAccount(id).catch(() => [])
    ]).then(([c, n]) => {
      setContacts(c);
      setNotes([...n].sort((a, b) => Number(b.createdAt - a.createdAt)));
    }).finally(() => setDetailLoading(false));
  }, [id, actor]);
  reactExports.useEffect(() => {
    if (!actor || !isVendor() || !(companyProfile == null ? void 0 : companyProfile.id)) return;
    actor.getResellersForVendor(companyProfile.id).then(setResellerProfiles).catch(() => {
    });
  }, [actor, isVendor, companyProfile]);
  reactExports.useEffect(() => {
    if (account) {
      setEditForm({
        accountName: account.accountName,
        customerDomain: account.customerDomain,
        resellerOwnerId: account.resellerOwnerId,
        vendorOwnerId: account.vendorOwnerId,
        contractType: account.contractType,
        estimatedRenewalValue: account.estimatedRenewalValue.toString(),
        licenceQuantity: account.licenceQuantity.toString(),
        products: account.productList.join(", "),
        status: account.status,
        customerIdNumber: account.customerIdNumber ?? ""
      });
    }
  }, [account]);
  async function checkDuplicate(name, domain) {
    if (!actor || !name || !domain) return;
    setCheckingDuplicate(true);
    try {
      const result = await actor.checkAccountDuplicate(name, domain);
      if (result.isDuplicate && result.existingAccountId !== id)
        setDuplicateCheck(result);
      else setDuplicateCheck(null);
    } finally {
      setCheckingDuplicate(false);
    }
  }
  async function handleReassignReseller(e) {
    e.preventDefault();
    if (!actor || !id || !newResellerId) return;
    setReassigning(true);
    try {
      const result = await actor.reassignAccountReseller(id, newResellerId);
      if (result.__kind__ === "err") {
        ue.error(result.err);
        return;
      }
      await refreshAccounts();
      setShowReassign(false);
      setNewResellerId("");
      ue.success("Reseller reassigned successfully");
    } catch {
      ue.error("Failed to reassign reseller");
    } finally {
      setReassigning(false);
    }
  }
  async function handleSaveAccount(e) {
    e.preventDefault();
    if (!actor || !id || !account) return;
    setSaving(true);
    try {
      const result = await actor.updateAccount(id, {
        distributorIds: account.distributorIds ?? [],
        sites: account.sites ?? [],
        accountName: editForm.accountName,
        customerDomain: editForm.customerDomain,
        resellerOwnerId: editForm.resellerOwnerId,
        vendorOwnerId: editForm.vendorOwnerId,
        contractType: editForm.contractType,
        estimatedRenewalValue: Number.parseFloat(editForm.estimatedRenewalValue) || 0,
        licenceQuantity: BigInt(editForm.licenceQuantity || "0"),
        productList: editForm.products.split(",").map((p) => p.trim()).filter(Boolean),
        renewalDate: account.renewalDate,
        status: editForm.status,
        customerIdNumber: editForm.customerIdNumber || void 0
      });
      if (result.__kind__ === "err") {
        ue.error(result.err);
        return;
      }
      await refreshAccounts();
      setShowEdit(false);
      setDuplicateCheck(null);
      ue.success("Account updated");
    } catch {
      ue.error("Failed to update account");
    } finally {
      setSaving(false);
    }
  }
  async function handleAddNote(e) {
    e.preventDefault();
    if (!actor || !id || !noteContent.trim()) return;
    setSavingNote(true);
    try {
      await actor.createNote({
        accountId: id,
        content: VISIBILITY_PREFIXES[noteVisibility] + noteContent,
        authorName: (userProfile == null ? void 0 : userProfile.fullName) ?? "User",
        authorRole: (userProfile == null ? void 0 : userProfile.role) ?? "Admin"
      });
      const updated = await actor.getNotesByAccount(id);
      setNotes([...updated].sort((a, b) => Number(b.createdAt - a.createdAt)));
      setNoteContent("");
      setNoteVisibility("internal");
      ue.success("Note added");
    } catch {
      ue.error("Failed to add note");
    } finally {
      setSavingNote(false);
    }
  }
  async function handleEditNote(note) {
    if (!actor) return;
    try {
      await actor.updateNote(note.id, note.content);
      const updated = await actor.getNotesByAccount(id);
      setNotes([...updated].sort((a, b) => Number(b.createdAt - a.createdAt)));
      setEditingNoteId(null);
      ue.success("Note updated");
    } catch {
      ue.error("Failed to update note");
    }
  }
  async function checkCustomerIdDuplicate(value) {
    if (!value.trim() || !actor || !(companyProfile == null ? void 0 : companyProfile.id)) {
      setCustomerIdStatus("idle");
      return;
    }
    setCustomerIdStatus("checking");
    try {
      const isDup = await actor.isCustomerIdDuplicate(
        companyProfile.id,
        value.trim()
      );
      if (isDup && value !== ((account == null ? void 0 : account.customerIdNumber) ?? "")) {
        setCustomerIdStatus("duplicate");
        setCustomerIdMsg("This Customer ID is already in use.");
      } else {
        setCustomerIdStatus("valid");
        setCustomerIdMsg("");
      }
    } catch {
      setCustomerIdStatus("idle");
    }
  }
  async function handleAutoGenerateId() {
    if (!actor || !(companyProfile == null ? void 0 : companyProfile.id)) return;
    setGeneratingId(true);
    try {
      const result = await actor.generateCustomerId({
        vendorId: companyProfile.id
      });
      if (result.isValid && result.formattedId) {
        setEditForm((f) => ({
          ...f,
          customerIdNumber: result.formattedId ?? ""
        }));
        setCustomerIdStatus("valid");
        setCustomerIdMsg("");
      }
    } catch {
    } finally {
      setGeneratingId(false);
    }
  }
  function copyCustomerId(cid) {
    navigator.clipboard.writeText(cid).then(() => {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2e3);
    });
  }
  const accountDeals = dealRegistrations.filter((d) => d.accountId === id);
  const { recommendations, engagementGaps, dismissRecommendation } = useForgeAI();
  const RISK_ORDER = {
    Critical: 0,
    High: 1,
    Medium: 2,
    Low: 3,
    Opportunity: 4
  };
  const accountRecommendations = recommendations.filter(
    (r) => r.affectedEntityId === id || r.affectedEntityType === "Account"
  ).sort(
    (a, b) => (RISK_ORDER[a.riskTier] ?? 5) - (RISK_ORDER[b.riskTier] ?? 5)
  ).slice(0, 5);
  const accountEngagementGaps = engagementGaps.filter(
    (g) => g.entityId === id || g.entityId === (account == null ? void 0 : account.resellerOwnerId) || g.entityId === (account == null ? void 0 : account.vendorOwnerId)
  );
  if (!account) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 40, className: "text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Account not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          onClick: () => navigate({ to: "/accounts" }),
          className: "mt-4",
          children: "Back to Accounts"
        }
      )
    ] });
  }
  const daysUntilRenewal = getDaysUntilRenewal(account.renewalDate);
  const healthScore = getHealthScore(account.status, daysUntilRenewal);
  const riskLevel = healthScore >= 80 ? "LOW" : healthScore >= 50 ? "MEDIUM" : "HIGH";
  const riskBadgeClass = riskLevel === "LOW" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" : riskLevel === "MEDIUM" ? "bg-amber-500/15 text-amber-400 border border-amber-500/25" : "bg-red-500/15 text-red-400 border border-red-500/25";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fade-in flex flex-col h-full flex-1 min-h-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => navigate({ to: "/accounts" }),
        className: "flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors mb-4",
        "data-ocid": "account_record.back.button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14 }),
          " Back to Accounts"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-20 crm-card border-b border-border mb-0 rounded-b-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0 bg-accent/15 text-accent", children: (_a = account.accountName[0]) == null ? void 0 : _a.toUpperCase() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground font-display truncate", children: account.accountName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: accountStatusColor(account.status), children: account.status }),
            account.customerIdNumber && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/25",
                  "data-ocid": "account_record.customer_id.display",
                  children: account.customerIdNumber
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => copyCustomerId(account.customerIdNumber ?? ""),
                  className: "text-muted-foreground hover:text-foreground transition-colors",
                  "aria-label": "Copy Customer ID",
                  "data-ocid": "account_record.customer_id.copy_button",
                  children: copiedId ? /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCheck, { size: 12, className: "text-emerald-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { size: 12 })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5 flex-wrap", children: [
            account.vendorOwnerId && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded bg-secondary/50 text-muted-foreground border border-border", children: account.vendorOwnerId }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs", children: "→" })
            ] }),
            account.resellerOwnerId && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20", children: account.resellerOwnerId }),
            account.customerDomain && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 9 }),
              account.customerDomain
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1.5 flex-wrap", children: [
            daysUntilRenewal !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-xs font-medium ${daysUntilRenewal <= 30 ? "text-red-400" : daysUntilRenewal <= 90 ? "text-amber-400" : "text-emerald-400"}`,
                children: daysUntilRenewal <= 0 ? "Renewal overdue" : `Renewal in ${daysUntilRenewal}d`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-accent", children: formatCurrency(account.estimatedRenewalValue) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              account.licenceQuantity.toString(),
              " seats"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(HealthGauge, { score: healthScore }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 items-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${riskBadgeClass} ${riskLevel === "HIGH" ? "intelligence-pulse" : ""}`,
                children: [
                  "ForgeAI: ",
                  riskLevel
                ]
              }
            ),
            daysUntilRenewal !== null && daysUntilRenewal <= 90 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20", children: [
              "Due ",
              formatDate(account.renewalDate)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-1", children: [
              !canEditAccount(account) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => ue.info(
                    "Contact your admin to request edit access for this account.",
                    {
                      description: "Edit access is governed by your organization's Account Governance settings.",
                      duration: 5e3
                    }
                  ),
                  className: "px-3 py-1.5 text-xs border border-orange-500 text-orange-400 rounded hover:bg-orange-500/10 flex items-center gap-1",
                  "data-ocid": "account_record.request_edit_access.button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Request Edit Access" })
                }
              ),
              canEditAccount(account) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowEdit(true),
                  className: "action-icon-btn",
                  "aria-label": "Edit account",
                  "data-ocid": "account_record.edit.open_modal_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 14 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setActiveTab("timeline");
                  },
                  className: "action-icon-btn",
                  "aria-label": "Log Activity",
                  "data-ocid": "account_record.log_activity.button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 14 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => ue.info("New Opportunity coming soon"),
                  className: "action-icon-btn action-icon-btn-accent",
                  "aria-label": "New Opportunity",
                  "data-ocid": "account_record.new_opportunity.button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 })
                }
              ),
              isVendor() && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowReassign(true),
                  className: "action-icon-btn",
                  "aria-label": "Reassign reseller",
                  "data-ocid": "account_record.reassign.open_modal_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { size: 14 })
                }
              )
            ] })
          ] })
        ] })
      ] }),
      !canEditAccount(account) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-6 mb-1 flex items-center gap-2 px-3 py-1 border-l-2 border-orange-500/50 bg-orange-500/5 text-orange-300/80 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🔒" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "You have view-only access to this account. Contact your admin to request edit permissions." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex gap-1 overflow-x-auto scrollbar-hide border-t border-border px-5",
          "data-ocid": "account_record.tabs",
          children: TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const countMap = {
              contacts: contacts.length,
              notes: notes.length,
              "deal-regs": accountDeals.length
            };
            const count = countMap[tab.id];
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setActiveTab(tab.id),
                "data-ocid": `account_record.tab.${tab.id}`,
                className: `flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${isActive ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(tab.icon, { size: 12 }),
                  tab.label,
                  count !== void 0 && count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] bg-secondary text-muted-foreground px-1 py-0.5 rounded-full font-bold", children: count })
                ]
              },
              tab.id
            );
          })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card rounded-t-none border-t-0 flex-1 overflow-y-auto min-h-0 flex flex-col", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccountTabContent,
      {
        tab: activeTab,
        account,
        contacts,
        notes,
        accountDeals,
        detailLoading,
        noteContent,
        setNoteContent,
        noteVisibility,
        setNoteVisibility,
        savingNote,
        editingNoteId,
        setEditingNoteId,
        editNoteContent,
        setEditNoteContent,
        handleAddNote,
        handleEditNote,
        parseNoteVisibility,
        userProfile,
        VISIBILITY_PREFIXES,
        timelineFilter,
        setTimelineFilter,
        accountRecommendations,
        accountEngagementGaps,
        dismissRecommendation,
        editingCustomFields,
        setEditingCustomFields,
        customFields,
        daysUntilRenewal,
        healthScore,
        setShowEdit,
        setActiveTab
      }
    ) }),
    showReassign && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm",
        "data-ocid": "account_record.reassign.dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card w-full max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { size: 14, className: "text-accent" }),
              " Reassign Reseller"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setShowReassign(false);
                  setNewResellerId("");
                },
                className: "text-muted-foreground hover:text-foreground",
                "data-ocid": "account_record.reassign.close_button",
                children: "✕"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleReassignReseller, className: "p-6 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Reassigning",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: account.accountName }),
              " ",
              "to a new reseller. This action is audited."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "reassign-reseller",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Select Reseller *"
                }
              ),
              resellerProfiles.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  id: "reassign-reseller",
                  required: true,
                  value: newResellerId,
                  onChange: (e) => setNewResellerId(e.target.value),
                  className: "crm-input w-full text-sm px-3 py-2 rounded-lg h-10",
                  "data-ocid": "account_record.reassign.reseller.select",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select a reseller…" }),
                    resellerProfiles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r.id, children: r.companyName }, r.id))
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  required: true,
                  value: newResellerId,
                  onChange: (e) => setNewResellerId(e.target.value),
                  className: "crm-input",
                  placeholder: "Reseller company ID",
                  "data-ocid": "account_record.reassign.reseller_id.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => {
                    setShowReassign(false);
                    setNewResellerId("");
                  },
                  "data-ocid": "account_record.reassign.cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: reassigning || !newResellerId,
                  className: "bg-accent text-accent-foreground hover:bg-accent/90",
                  "data-ocid": "account_record.reassign.confirm_button",
                  children: reassigning ? "Reassigning…" : "Confirm Reassign"
                }
              )
            ] })
          ] })
        ] })
      }
    ),
    showEdit && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm",
        "data-ocid": "account_record.edit.dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card w-full max-w-2xl max-h-[90vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Edit Account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setShowEdit(false);
                  setDuplicateCheck(null);
                },
                className: "text-muted-foreground hover:text-foreground",
                "data-ocid": "account_record.edit.close_button",
                children: "✕"
              }
            )
          ] }),
          duplicateCheck && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mx-6 mt-4 flex items-start gap-3 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/25",
              "data-ocid": "account_record.duplicate_warning",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TriangleAlert,
                  {
                    size: 15,
                    className: "text-amber-400 flex-shrink-0 mt-0.5"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-amber-300", children: "Possible duplicate detected" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-0.5", children: duplicateCheck.suggestion })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              onSubmit: handleSaveAccount,
              className: "p-6 grid grid-cols-1 sm:grid-cols-2 gap-4",
              children: [
                [
                  {
                    id: "edit-name",
                    label: "Account Name *",
                    required: true,
                    fieldKey: "accountName",
                    value: editForm.accountName,
                    onChange: (v) => {
                      setEditForm({ ...editForm, accountName: v });
                      checkDuplicate(v, editForm.customerDomain);
                    }
                  },
                  {
                    id: "edit-domain",
                    label: "Customer Domain *",
                    required: true,
                    fieldKey: "customerDomain",
                    value: editForm.customerDomain,
                    onChange: (v) => {
                      setEditForm({ ...editForm, customerDomain: v });
                      checkDuplicate(editForm.accountName, v);
                    },
                    placeholder: "customer.com"
                  },
                  {
                    id: "edit-reseller",
                    label: "Reseller Owner",
                    fieldKey: "resellerOwnerId",
                    value: editForm.resellerOwnerId,
                    onChange: (v) => setEditForm({ ...editForm, resellerOwnerId: v })
                  },
                  {
                    id: "edit-vendor",
                    label: "Vendor Owner",
                    fieldKey: "vendorOwnerId",
                    value: editForm.vendorOwnerId,
                    onChange: (v) => setEditForm({ ...editForm, vendorOwnerId: v })
                  },
                  {
                    id: "edit-contract",
                    label: "Contract Type",
                    fieldKey: "contractType",
                    value: editForm.contractType,
                    onChange: (v) => setEditForm({ ...editForm, contractType: v }),
                    placeholder: "Annual, 3-year…"
                  },
                  {
                    id: "edit-value",
                    label: "Est. Renewal Value",
                    type: "number",
                    fieldKey: "estimatedRenewalValue",
                    value: editForm.estimatedRenewalValue,
                    onChange: (v) => setEditForm({ ...editForm, estimatedRenewalValue: v })
                  },
                  {
                    id: "edit-licences",
                    label: "Licence Quantity",
                    type: "number",
                    fieldKey: "licenceQuantity",
                    value: editForm.licenceQuantity,
                    onChange: (v) => setEditForm({ ...editForm, licenceQuantity: v })
                  }
                ].map((f) => {
                  const fKey = f.fieldKey ?? f.id;
                  const editable = canEditField(fKey, account == null ? void 0 : account.id);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: f.id,
                        className: "block text-xs text-muted-foreground mb-1",
                        children: f.label
                      }
                    ),
                    editable ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: f.id,
                        required: f.required,
                        type: f.type,
                        value: f.value,
                        onChange: (e) => f.onChange(e.target.value),
                        className: "crm-input",
                        placeholder: f.placeholder
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 rounded bg-slate-800/50 text-slate-300 text-sm border border-slate-700", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3 inline text-slate-400" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f.value || "Not set" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-slate-500", children: "Read only" })
                    ] }),
                    f.id === "edit-domain" && checkingDuplicate && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Checking for duplicates…" })
                  ] }, f.id);
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "edit-status",
                      className: "block text-xs text-muted-foreground mb-1",
                      children: "Status"
                    }
                  ),
                  !canEditField("status", account == null ? void 0 : account.id) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 rounded bg-slate-800/50 text-slate-300 text-sm border border-slate-700", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🔒" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: editForm.status || "Not set" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-slate-500", children: "Read only" })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      id: "edit-status",
                      value: editForm.status,
                      onChange: (e) => setEditForm({
                        ...editForm,
                        status: e.target.value
                      }),
                      className: "crm-input w-full text-sm px-3 py-2 rounded-lg h-10",
                      "data-ocid": "account_record.edit.status.select",
                      children: Object.values(AccountStatus).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
                    }
                  )
                ] }),
                canEditField("customerIdNumber", account == null ? void 0 : account.id) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "edit-customer-id",
                      className: "block text-xs text-muted-foreground mb-1",
                      children: "Customer ID"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "edit-customer-id",
                          value: editForm.customerIdNumber,
                          onChange: (e) => {
                            setEditForm({
                              ...editForm,
                              customerIdNumber: e.target.value
                            });
                            checkCustomerIdDuplicate(e.target.value);
                          },
                          className: `crm-input pr-8 ${customerIdStatus === "duplicate" ? "border-red-500/60" : customerIdStatus === "valid" && editForm.customerIdNumber ? "border-emerald-500/40" : ""}`,
                          placeholder: "e.g. UK-LON-000145",
                          "data-ocid": "account_record.edit.customer_id.input"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-2.5 top-1/2 -translate-y-1/2", children: [
                        customerIdStatus === "checking" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          RefreshCw,
                          {
                            size: 12,
                            className: "animate-spin text-muted-foreground"
                          }
                        ),
                        customerIdStatus === "valid" && editForm.customerIdNumber && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CircleCheck,
                          {
                            size: 12,
                            className: "text-emerald-400"
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: handleAutoGenerateId,
                        disabled: generatingId,
                        className: "px-2.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors",
                        "data-ocid": "account_record.edit.customer_id_auto_generate.button",
                        children: generatingId ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 12, className: "animate-spin" }) : "Auto-gen"
                      }
                    )
                  ] }),
                  customerIdStatus === "duplicate" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-[10px] text-red-400 mt-1",
                      "data-ocid": "account_record.edit.customer_id.field_error",
                      children: customerIdMsg
                    }
                  )
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "block text-xs text-muted-foreground mb-1", children: "Customer ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 rounded bg-slate-800/50 text-slate-300 text-sm border border-slate-700", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🔒" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: editForm.customerIdNumber || "Not set" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-slate-500", children: "Read only" })
                  ] })
                ] }),
                canEditField("products", account == null ? void 0 : account.id) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "edit-products",
                      className: "block text-xs text-muted-foreground mb-1",
                      children: "Products (comma-separated)"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "edit-products",
                      value: editForm.products,
                      onChange: (e) => setEditForm({ ...editForm, products: e.target.value }),
                      className: "crm-input",
                      placeholder: "Product A, Product B"
                    }
                  )
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "block text-xs text-muted-foreground mb-1", children: "Products" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 rounded bg-slate-800/50 text-slate-300 text-sm border border-slate-700", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🔒" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: editForm.products || "Not set" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-slate-500", children: "Read only" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 flex gap-3 justify-end pt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      onClick: () => {
                        setShowEdit(false);
                        setDuplicateCheck(null);
                      },
                      "data-ocid": "account_record.edit.cancel_button",
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      disabled: saving,
                      className: "bg-accent text-accent-foreground hover:bg-accent/90",
                      "data-ocid": "account_record.edit.save_button",
                      children: saving ? "Saving…" : "Save Changes"
                    }
                  )
                ] })
              ]
            }
          )
        ] })
      }
    )
  ] });
}
function AccountTabContent(props) {
  const {
    tab,
    account,
    contacts,
    notes,
    accountDeals,
    detailLoading,
    noteContent,
    setNoteContent,
    noteVisibility,
    setNoteVisibility,
    savingNote,
    editingNoteId,
    setEditingNoteId,
    editNoteContent,
    setEditNoteContent,
    handleAddNote,
    handleEditNote,
    parseNoteVisibility: pnv,
    userProfile,
    VISIBILITY_PREFIXES: VP,
    timelineFilter,
    setTimelineFilter,
    accountRecommendations,
    accountEngagementGaps,
    dismissRecommendation,
    editingCustomFields,
    setEditingCustomFields,
    customFields,
    daysUntilRenewal,
    healthScore,
    setShowEdit,
    setActiveTab
  } = props;
  if (tab === "overview")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabOverview,
      {
        account,
        contacts,
        accountDeals,
        daysUntilRenewal,
        healthScore,
        notes,
        setShowEdit,
        setActiveTab
      }
    );
  if (tab === "contacts")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TabContacts, { contacts, detailLoading });
  if (tab === "opportunities")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TabOpportunities, { accountDeals });
  if (tab === "renewals")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TabRenewals, { account, daysUntilRenewal });
  if (tab === "deal-regs") return /* @__PURE__ */ jsxRuntimeExports.jsx(TabDealRegs, { accountDeals });
  if (tab === "products") return /* @__PURE__ */ jsxRuntimeExports.jsx(TabProducts, { account });
  if (tab === "price-calculator")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Price Calculator" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PriceCalculator, { accountId: (account == null ? void 0 : account.id) ?? "", readOnly: false })
    ] });
  if (tab === "timeline")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabTimeline,
      {
        timelineFilter,
        setTimelineFilter
      }
    );
  if (tab === "notes")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabNotes,
      {
        account,
        notes,
        noteContent,
        setNoteContent,
        noteVisibility,
        setNoteVisibility,
        savingNote,
        editingNoteId,
        setEditingNoteId,
        editNoteContent,
        setEditNoteContent,
        handleAddNote,
        handleEditNote,
        parseNoteVisibility: pnv,
        userProfile,
        VISIBILITY_PREFIXES: VP,
        detailLoading
      }
    );
  if (tab === "documents")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabSimple,
      {
        title: "Documents",
        icon: Folder,
        emptyMsg: "Upload contracts, presentations, or documents related to this account.",
        actionLabel: "Upload Document"
      }
    );
  if (tab === "tasks")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabSimple,
      {
        title: "Tasks",
        icon: CircleCheck,
        emptyMsg: "Create tasks to track follow-ups and actions for this account.",
        actionLabel: "New Task"
      }
    );
  if (tab === "marketing")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabSimple,
      {
        title: "Marketing Activity",
        icon: Globe,
        emptyMsg: "No marketing activity recorded for this account.",
        actionLabel: "Log Activity"
      }
    );
  if (tab === "mdf")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabSimple,
      {
        title: "MDF Activity",
        icon: MessageSquare,
        emptyMsg: "MDF requests linked to this account will appear here.",
        actionLabel: "New MDF Request"
      }
    );
  if (tab === "stakeholders")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabSimple,
      {
        title: "Stakeholders",
        icon: UserCheck,
        emptyMsg: "Add key stakeholders to track relationship ownership and contacts.",
        actionLabel: "Add Stakeholder"
      }
    );
  if (tab === "channel-relationships")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelRelationshipsContent, { account });
  if (tab === "ai-insights")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabAIInsights,
      {
        account,
        accountRecommendations,
        accountEngagementGaps,
        dismissRecommendation,
        daysUntilRenewal,
        healthScore
      }
    );
  if (tab === "external-access") return /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalAccessTab, { account });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    TabCustomFields,
    {
      customFields,
      editingCustomFields,
      setEditingCustomFields
    }
  );
}
const MOCK_LINKED_ORGS = [
  {
    id: "adobe",
    name: "Adobe",
    orgType: "VENDOR",
    status: "Active",
    template: "Executive Dashboard"
  },
  {
    id: "ingram",
    name: "Ingram Micro",
    orgType: "DISTRIBUTOR",
    status: "Active",
    template: "MDF Contributor"
  },
  {
    id: "nordic",
    name: "Nordic Cloud Solutions",
    orgType: "RESELLER",
    status: "Pending",
    template: "View Only"
  }
];
const DATA_SECTIONS = [
  "Account Summary",
  "Renewal Dates",
  "Opportunity Pipeline",
  "Deal Registrations",
  "MDF Requests",
  "Pricing/Promotions",
  "Internal Notes",
  "External Shared Notes",
  "Sales Tasks",
  "Escalations",
  "Reports",
  "Dashboards",
  "Forecasting",
  "Stakeholder Mapping",
  "ForgeAI Insights"
];
const SECTION_CATEGORIES = {
  "Internal Notes": {
    label: "Private",
    color: "bg-red-500/20 text-red-400 border-red-500/30"
  },
  "External Shared Notes": {
    label: "Shared",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
  },
  "Pricing/Promotions": {
    label: "Restricted",
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30"
  },
  "ForgeAI Insights": {
    label: "AI",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  }
};
const ORG_TYPE_STYLES = {
  VENDOR: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  DISTRIBUTOR: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  RESELLER: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
};
const MOCK_ACCESS_REQUESTS = [
  {
    id: "r1",
    orgName: "Adobe",
    section: "Pricing/Promotions",
    reason: "Need visibility for Q3 campaign planning"
  },
  {
    id: "r2",
    orgName: "Ingram Micro",
    section: "Forecasting",
    reason: "Required for joint pipeline review"
  },
  {
    id: "r3",
    orgName: "Nordic Cloud Solutions",
    section: "Deal Registrations",
    reason: "To validate partner-sourced deals"
  }
];
const MOCK_ACTIVITIES = [
  {
    id: "a1",
    org: "VENDOR",
    orgName: "Adobe",
    action: "Updated account health score to 87",
    time: "2 hours ago"
  },
  {
    id: "a2",
    org: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    action: "Approved MDF request #MDF-2024-089",
    time: "4 hours ago"
  },
  {
    id: "a3",
    org: "RESELLER",
    orgName: "Nordic Cloud Solutions",
    action: "Added external shared note on renewal timeline",
    time: "6 hours ago"
  },
  {
    id: "a4",
    org: "VENDOR",
    orgName: "Adobe",
    action: "Changed permission template to Executive Dashboard",
    time: "1 day ago"
  },
  {
    id: "a5",
    org: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    action: "Requested access to Forecasting section",
    time: "1 day ago"
  },
  {
    id: "a6",
    org: "RESELLER",
    orgName: "Nordic Cloud Solutions",
    action: "Uploaded deal registration DR-2024-112",
    time: "2 days ago"
  },
  {
    id: "a7",
    org: "VENDOR",
    orgName: "Adobe",
    action: "Revoked access to Internal Notes for all linked orgs",
    time: "3 days ago"
  },
  {
    id: "a8",
    org: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    action: "Shared QTD pipeline dashboard with Reseller view",
    time: "3 days ago"
  }
];
function ExternalAccessTab({ account: _account }) {
  const [permissions, setPermissions] = reactExports.useState(() => {
    const initial = {};
    for (const org of MOCK_LINKED_ORGS) {
      for (const section of DATA_SECTIONS) {
        const key = `${org.id}::${section}`;
        initial[key] = section === "Internal Notes" ? "hidden" : "read-only";
      }
    }
    return initial;
  });
  const [previewOrgId, setPreviewOrgId] = reactExports.useState("");
  const [requests, setRequests] = reactExports.useState(MOCK_ACCESS_REQUESTS);
  const updatePermission = (orgId, section, value) => {
    setPermissions((prev) => ({ ...prev, [`${orgId}::${section}`]: value }));
  };
  const resetToTemplate = (orgId) => {
    var _a;
    setPermissions((prev) => {
      const next = { ...prev };
      for (const section of DATA_SECTIONS) {
        next[`${orgId}::${section}`] = section === "Internal Notes" ? "hidden" : "read-only";
      }
      return next;
    });
    ue.success(
      `Reset permissions to template defaults for ${(_a = MOCK_LINKED_ORGS.find((o) => o.id === orgId)) == null ? void 0 : _a.name}`
    );
  };
  const handleApprove = (reqId) => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
    ue.success("Access request approved");
  };
  const handleDeny = (reqId) => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
    ue.error("Access request denied");
  };
  const previewOrg = MOCK_LINKED_ORGS.find((o) => o.id === previewOrgId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "space-y-6",
      "data-ocid": "account_record.external_access.section",
      children: [
        previewOrg && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Previewing as ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: previewOrg.name }),
            " — restricted fields shown as locked"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 18, className: "text-accent" }),
              "External Channel Link Access"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Control what each linked organisation can see and do on this account." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "preview-org-select",
                className: "text-xs text-muted-foreground",
                children: "Preview as:"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                id: "preview-org-select",
                className: "text-sm rounded-md border border-border bg-card px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-accent",
                value: previewOrgId,
                onChange: (e) => setPreviewOrgId(e.target.value),
                "data-ocid": "account_record.external_access.preview_select",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select org —" }),
                  MOCK_LINKED_ORGS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.id, children: o.name }, o.id))
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/5 border border-border rounded-xl overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Permission Matrix" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => ue.success("Permission changes saved"),
                className: "px-3 py-1.5 text-xs font-medium rounded-md bg-accent text-accent-foreground hover:bg-accent/90 transition-colors",
                "data-ocid": "account_record.external_access.save_button",
                children: "Save Changes"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b border-border flex flex-wrap gap-2", children: DATA_SECTIONS.map((section) => {
            const cat = SECTION_CATEGORIES[section];
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${cat ? cat.color : "bg-blue-500/20 text-blue-400 border-blue-500/30"}`,
                children: [
                  cat ? cat.label : "Shared",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 opacity-70", children: section })
                ]
              },
              section
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-medium text-muted-foreground sticky left-0 bg-muted/30 z-10 min-w-[180px]", children: "Linked Organisation" }),
              DATA_SECTIONS.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: "px-3 py-3 font-medium text-muted-foreground text-center min-w-[110px]",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "block truncate max-w-[100px] mx-auto",
                      title: section,
                      children: section
                    }
                  )
                },
                section
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium text-muted-foreground text-left sticky right-0 bg-muted/30 z-10 min-w-[140px]", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: MOCK_LINKED_ORGS.map((org) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 sticky left-0 bg-card/5 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground text-sm", children: org.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${ORG_TYPE_STYLES[org.orgType] || "bg-muted text-muted-foreground border-border"}`,
                          children: org.orgType
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${org.status === "Active" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}`,
                          children: org.status
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: org.template })
                  ] }) }),
                  DATA_SECTIONS.map((section) => {
                    const key = `${org.id}::${section}`;
                    const value = permissions[key] || "read-only";
                    const isLocked = previewOrgId === org.id && value === "hidden";
                    return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "select",
                      {
                        value,
                        onChange: (e) => updatePermission(org.id, section, e.target.value),
                        disabled: isLocked,
                        className: `w-full rounded-md border border-border bg-card px-1.5 py-1 text-[10px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent ${isLocked ? "opacity-40 cursor-not-allowed" : ""}`,
                        "data-ocid": `account_record.external_access.permission.${org.id}.${section}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "hidden", children: "Hidden" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "read-only", children: "Read Only" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "comment", children: "Comment" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "edit", children: "Edit" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "admin-only", children: "Admin Only" })
                        ]
                      }
                    ) }, section);
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 sticky right-0 bg-card/5 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => resetToTemplate(org.id),
                      className: "text-[10px] text-muted-foreground hover:text-foreground underline transition-colors",
                      "data-ocid": `account_record.external_access.reset_button.${org.id}`,
                      children: "Reset to Template Defaults"
                    }
                  ) })
                ]
              },
              org.id
            )) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/5 border border-border rounded-xl overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Access Requests" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Pending requests from linked organisations for additional account access." })
          ] }),
          requests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "px-5 py-8 text-center text-sm text-muted-foreground",
              "data-ocid": "account_record.external_access.requests.empty_state",
              children: "No pending access requests."
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: requests.map((req) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-5 py-4 flex items-start justify-between gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: req.orgName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded", children: req.section })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: req.reason })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleApprove(req.id),
                      className: "px-3 py-1.5 text-xs font-medium rounded-md bg-accent text-accent-foreground hover:bg-accent/90 transition-colors",
                      "data-ocid": `account_record.external_access.request.approve_button.${req.id}`,
                      children: "Approve"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleDeny(req.id),
                      className: "px-3 py-1.5 text-xs font-medium rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors",
                      "data-ocid": `account_record.external_access.request.deny_button.${req.id}`,
                      children: "Deny"
                    }
                  )
                ] })
              ]
            },
            req.id
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/5 border border-border rounded-xl overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Shared Activity Feed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Recent actions and updates from linked organisations on this account." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: MOCK_ACTIVITIES.map((act) => {
            const badgeStyle = act.org === "VENDOR" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : act.org === "DISTRIBUTOR" ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border shrink-0 ${badgeStyle}`,
                  children: [
                    "[",
                    act.org,
                    "]"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: act.orgName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground mx-1", children: "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: act.action })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground shrink-0", children: act.time })
            ] }, act.id);
          }) })
        ] })
      ]
    }
  );
}
function ChannelRelationshipsContent({ account }) {
  var _a, _b;
  const ownershipRoles = (account == null ? void 0 : account.ownershipRoles) || {};
  const roleOrder = [
    { key: "strategic", label: "Strategic Owner" },
    { key: "renewal", label: "Renewal Owner" },
    { key: "operational", label: "Operational Owner" },
    { key: "servicing", label: "Servicing Owner" },
    { key: "escalation", label: "Escalation Owner" }
  ];
  const ownerTypeClass = (type) => {
    switch (type) {
      case "vendor":
        return "bg-accent text-accent-foreground";
      case "distributor":
        return "bg-amber-500 text-white";
      case "reseller":
        return "bg-emerald-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/5 rounded-xl border border-border p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 16, className: "text-accent" }),
        "Account Ownership"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3", children: roleOrder.map((role) => {
        const owner = ownershipRoles[role.key];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between py-2 border-b border-border/50 last:border-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: role.label }),
              owner ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: owner.ownerName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: owner.ownerOrgName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: `text-[10px] ${ownerTypeClass(owner.ownerType)}`,
                    children: owner.ownerType
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm italic text-muted-foreground/60", children: "Not assigned" })
            ]
          },
          role.key
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/5 rounded-xl border border-border p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 16, className: "text-accent" }),
        "Current Incumbent Distributors"
      ] }),
      ((_a = account == null ? void 0 : account.incumbentDistributors) == null ? void 0 : _a.length) > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: account.incumbentDistributors.map((d, i) => {
        var _a2, _b2;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col gap-2 p-3 rounded-lg bg-background/40 border border-border/60",
            "data-ocid": `account_record.distributor.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: d.distributorName }),
                d.isPrimary && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] bg-accent/20 text-accent border-accent/30", children: "Primary" })
              ] }),
              ((_a2 = d.territories) == null ? void 0 : _a2.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: d.territories.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border",
                  children: t
                },
                t
              )) }),
              ((_b2 = d.servicingResponsibilities) == null ? void 0 : _b2.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc list-inside text-xs text-muted-foreground space-y-0.5", children: d.servicingResponsibilities.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: r }, r)) })
            ]
          },
          d.distributorId ?? d.distributorName
        );
      }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground italic", children: "No incumbent distributors assigned." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/5 rounded-xl border border-border p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 16, className: "text-accent" }),
        "Current Incumbent Resellers"
      ] }),
      ((_b = account == null ? void 0 : account.incumbentResellers) == null ? void 0 : _b.length) > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: account.incumbentResellers.map((r, i) => {
        var _a2;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col gap-2 p-3 rounded-lg bg-background/40 border border-border/60",
            "data-ocid": `account_record.reseller.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: r.resellerName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  r.isPrimary && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] bg-accent/20 text-accent border-accent/30", children: "Primary" }),
                  r.servicingType && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: `text-[10px] ${r.servicingType === "renewals" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : r.servicingType === "support" ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "bg-slate-500/20 text-slate-400 border-slate-500/30"}`,
                      children: r.servicingType
                    }
                  )
                ] })
              ] }),
              ((_a2 = r.territories) == null ? void 0 : _a2.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: r.territories.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border",
                  children: t
                },
                t
              )) })
            ]
          },
          r.resellerId ?? r.resellerName
        );
      }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground italic", children: "No incumbent resellers assigned." })
    ] })
  ] });
}
function TabOverview({
  account,
  contacts,
  accountDeals,
  daysUntilRenewal,
  healthScore,
  notes,
  setShowEdit,
  setActiveTab
}) {
  const fields = [
    { label: "Company Name", value: account.accountName },
    { label: "Customer Domain", value: account.customerDomain || "—" },
    { label: "Customer ID", value: account.customerIdNumber || "Not assigned" },
    { label: "Account Status", value: account.status },
    { label: "Contract Type", value: account.contractType || "—" },
    {
      label: "Assigned Reseller",
      value: account.resellerOwnerId || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-muted-foreground/60", children: "Unassigned" })
    },
    { label: "Vendor Manager", value: account.vendorOwnerId || "—" },
    {
      label: "Renewal Date",
      value: account.renewalDate > BigInt(0) ? formatDate(account.renewalDate) : "—"
    },
    {
      label: "ARR / Contract Value",
      value: formatCurrency(account.estimatedRenewalValue)
    },
    { label: "Licence Seats", value: account.licenceQuantity.toString() },
    {
      label: "Products",
      value: account.productList.length > 0 ? account.productList.join(", ") : "—"
    },
    { label: "Industry", value: "Technology" },
    {
      label: "Annual Revenue",
      value: formatCurrency(account.estimatedRenewalValue * 4.2)
    },
    { label: "Employee Count", value: "250–500" }
  ];
  const quickStats = [
    {
      label: "Open Opportunities",
      value: String(
        accountDeals.filter((d) => d.dealStage && d.dealStage !== "Closed").length
      ),
      sub: formatCurrency(
        accountDeals.reduce((s, d) => s + (d.estimatedValue || 0), 0)
      ),
      tab: "opportunities"
    },
    {
      label: "Active Renewals",
      value: daysUntilRenewal !== null ? "1" : "0",
      sub: daysUntilRenewal !== null ? `Due in ${daysUntilRenewal}d` : "None scheduled",
      tab: "renewals"
    },
    {
      label: "Deal Registrations",
      value: String(accountDeals.length),
      sub: `${accountDeals.length} total`,
      tab: "deal-regs"
    },
    {
      label: "Contacts",
      value: String(contacts.length),
      sub: "Key relationships",
      tab: "contacts"
    },
    {
      label: "Notes",
      value: String(notes.length),
      sub: "Internal + external",
      tab: "notes"
    },
    {
      label: "Account Health",
      value: `${healthScore}/100`,
      sub: healthScore >= 80 ? "Healthy" : healthScore >= 50 ? "Moderate" : "At Risk",
      tab: null
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3", children: "Account Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: fields.map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-secondary/20 rounded-lg px-3 py-2.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-sm text-foreground font-medium break-words", children: value })
            ]
          },
          label
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/10 rounded-lg px-4 py-3 border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Custom Fields" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowEdit(true),
              className: "text-[10px] text-accent hover:underline",
              children: "Edit"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2", children: [
          "Contract Tier",
          "Region Code",
          "SLA Level",
          "Support Plan"
        ].map((cf) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            cf,
            ":"
          ] }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "—" })
        ] }, cf)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Quick Stats" }),
      quickStats.map(({ label, value, sub, tab }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            if (tab) setActiveTab(tab);
          },
          className: "w-full bg-secondary/20 hover:bg-secondary/35 border border-border/50 rounded-lg px-4 py-3 text-left transition-colors",
          "data-ocid": `account_record.overview.stat.${label.toLowerCase().replace(/ /g, "_")}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-accent font-display", children: value })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-0.5", children: sub })
          ]
        },
        label
      ))
    ] })
  ] }) });
}
const MOCK_CONTACTS = [
  {
    id: "m1",
    firstName: "Sarah",
    lastName: "Mitchell",
    jobTitle: "VP of Technology",
    email: "s.mitchell@customer.com",
    phone: "+44 7700 900123",
    isPrimary: true
  },
  {
    id: "m2",
    firstName: "James",
    lastName: "Harrington",
    jobTitle: "IT Director",
    email: "j.harrington@customer.com",
    phone: "+44 7700 900456",
    isPrimary: false
  },
  {
    id: "m3",
    firstName: "Emma",
    lastName: "Thornton",
    jobTitle: "Procurement Manager",
    email: "e.thornton@customer.com",
    phone: "+44 7700 900789",
    isPrimary: false
  }
];
function TabContacts({
  contacts,
  detailLoading
}) {
  const display = contacts.length > 0 ? contacts.map((c) => ({
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    jobTitle: c.jobTitle,
    email: c.email,
    phone: c.phone ?? "",
    isPrimary: false
  })) : MOCK_CONTACTS;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-y-auto min-h-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground", children: [
        "Contacts (",
        display.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          onClick: () => ue.info("Add Contact coming soon"),
          className: "bg-accent text-accent-foreground hover:bg-accent/90",
          "data-ocid": "account_record.contacts.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13, className: "mr-1" }),
            " Add Contact"
          ]
        }
      )
    ] }),
    detailLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 space-y-3", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: display.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors",
        "data-ocid": `account_record.contact.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 bg-accent/15 text-accent", children: getInitials(`${c.firstName} ${c.lastName}`) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
                c.firstName,
                " ",
                c.lastName
              ] }),
              c.isPrimary && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25", children: "PRIMARY" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: c.jobTitle })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0 hidden sm:block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 11 }),
              c.email
            ] }),
            c.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground justify-end mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 11 }),
              c.phone
            ] })
          ] })
        ]
      },
      c.id
    )) })
  ] });
}
const STAGE_COLOR = {
  Prospecting: "bg-secondary/50 text-muted-foreground",
  Qualification: "bg-blue-500/15 text-blue-400",
  Proposal: "bg-amber-500/15 text-amber-400",
  Approval: "bg-accent/15 text-accent",
  Negotiation: "bg-yellow-500/15 text-yellow-400",
  "Closed Won": "bg-emerald-500/15 text-emerald-400",
  "Closed Lost": "bg-red-500/15 text-red-400"
};
const MOCK_OPPS = [
  {
    id: "o1",
    name: "Security Suite Renewal",
    stage: "Proposal",
    value: 48e3,
    closeDate: "Mar 31, 2025",
    owner: "Alex Turner",
    prob: 65
  },
  {
    id: "o2",
    name: "Cloud Platform Upsell",
    stage: "Qualification",
    value: 22e3,
    closeDate: "Apr 15, 2025",
    owner: "Sam Chen",
    prob: 35
  },
  {
    id: "o3",
    name: "Professional Services",
    stage: "Closed Won",
    value: 15e3,
    closeDate: "Jan 10, 2025",
    owner: "Alex Turner",
    prob: 100
  }
];
function TabOpportunities({
  accountDeals
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-y-auto min-h-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Opportunities" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          onClick: () => ue.info("New Opportunity coming soon"),
          className: "bg-accent text-accent-foreground hover:bg-accent/90",
          "data-ocid": "account_record.opportunities.new_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13, className: "mr-1" }),
            " New Opportunity"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto scrollbar-thin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-secondary/20", children: [
        "Name",
        "Stage",
        "Value",
        "Close Date",
        "Owner",
        "Probability"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "text-left text-[10px] text-muted-foreground uppercase tracking-wide px-5 py-3",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: MOCK_OPPS.map((opp, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/40 hover:bg-secondary/10 transition-colors",
          "data-ocid": `account_record.opportunity.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium text-foreground", children: opp.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-[10px] font-semibold px-2 py-0.5 rounded-full ${STAGE_COLOR[opp.stage] ?? "bg-secondary/50 text-muted-foreground"}`,
                children: opp.stage
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-accent font-bold", children: formatCurrency(opp.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground text-xs", children: opp.closeDate }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs text-foreground", children: opp.owner }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 bg-secondary/50 rounded-full overflow-hidden max-w-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full bg-accent rounded-full",
                  style: { width: `${opp.prob}%` }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                opp.prob,
                "%"
              ] })
            ] }) })
          ]
        },
        opp.id
      )) })
    ] }) }),
    accountDeals.length === 0 && MOCK_OPPS.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-12",
        "data-ocid": "account_record.opportunities.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 32, className: "text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium", children: "No opportunities" })
        ]
      }
    )
  ] });
}
const MOCK_RENEWALS = [
  {
    id: "r1",
    product: "Security Suite Enterprise",
    renewalDate: "Mar 15, 2025",
    value: 48e3,
    status: "At Risk",
    owner: "Alex Turner"
  },
  {
    id: "r2",
    product: "Cloud Backup Pro",
    renewalDate: "Jun 30, 2025",
    value: 12e3,
    status: "Healthy",
    owner: "Sam Chen"
  },
  {
    id: "r3",
    product: "Monitoring & Analytics",
    renewalDate: "Sep 01, 2025",
    value: 8500,
    status: "Due Soon",
    owner: "Alex Turner"
  }
];
function TabRenewals({
  account,
  daysUntilRenewal
}) {
  const rstyle = (s) => s === "At Risk" ? "bg-red-500/15 text-red-400 border border-red-500/25" : s === "Due Soon" ? "bg-amber-500/15 text-amber-400 border border-amber-500/25" : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-y-auto min-h-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Renewals" }),
      daysUntilRenewal !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: `text-xs font-semibold px-3 py-1 rounded-full ${daysUntilRenewal <= 30 ? "bg-red-500/15 text-red-400" : daysUntilRenewal <= 90 ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400"}`,
          children: [
            "Next: ",
            formatDate(account.renewalDate)
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto scrollbar-thin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-secondary/20", children: [
        "Product / SKU",
        "Renewal Date",
        "Value",
        "Status",
        "Owner"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "text-left text-[10px] text-muted-foreground uppercase tracking-wide px-5 py-3",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: MOCK_RENEWALS.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/40 hover:bg-secondary/10 transition-colors",
          "data-ocid": `account_record.renewal.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium text-foreground", children: r.product }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs text-muted-foreground", children: r.renewalDate }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-accent font-bold", children: formatCurrency(r.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-[10px] font-semibold px-2 py-0.5 rounded-full ${rstyle(r.status)}`,
                children: r.status
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs text-foreground", children: r.owner })
          ]
        },
        r.id
      )) })
    ] }) })
  ] });
}
function TabDealRegs({ accountDeals }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-y-auto min-h-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground", children: [
      "Deal Registrations (",
      accountDeals.length,
      ")"
    ] }) }),
    accountDeals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-12",
        "data-ocid": "account_record.deals.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 32, className: "text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No deal registrations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Deal registrations linked to this account will appear here." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: accountDeals.map((deal, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between px-5 py-3.5 hover:bg-secondary/20 transition-colors",
        "data-ocid": `account_record.deal.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: deal.opportunityName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              formatCurrency(deal.estimatedValue),
              " · ",
              deal.product || "—"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `${dealStatusColor(deal.status)} ml-4 flex-shrink-0`,
              children: dealStatusLabel(deal.status)
            }
          )
        ]
      },
      deal.id
    )) })
  ] });
}
function TabProducts({ account }) {
  const channelProducts = account.channelProducts;
  const statusBadge = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "expiring":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "at-risk":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "expired":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-y-auto min-h-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Products & Services" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          onClick: () => ue.info("Add product coming soon"),
          className: "bg-accent text-accent-foreground hover:bg-accent/90",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13, className: "mr-1" }),
            " Add Product"
          ]
        }
      )
    ] }),
    channelProducts && channelProducts.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: channelProducts.map((product, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "px-5 py-4",
        "data-ocid": `account_record.subscription.item.${i + 1}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: product.productName }),
              product.productCategory && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border", children: product.productCategory })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
              product.licenseType,
              product.seats ? ` · ${product.seats} seats` : ""
            ] }),
            (product.suppliedBy || product.servicedBy) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2 flex-wrap", children: [
              product.suppliedBy && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25", children: [
                "Supplied by: ",
                product.suppliedBy
              ] }),
              product.servicedBy && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25", children: [
                "Serviced by: ",
                product.servicedBy
              ] })
            ] }),
            product.operationalNotes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs italic text-muted-foreground/70 mt-2", children: product.operationalNotes })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1.5 flex-shrink-0", children: [
            product.contractValue !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: formatCurrency(product.contractValue) }),
            product.renewalDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
              "Renews ",
              product.renewalDate
            ] }),
            product.serviceStatus && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusBadge(product.serviceStatus)}`,
                children: product.serviceStatus
              }
            )
          ] })
        ] })
      },
      product.productId ?? product.productName
    )) }) : account.productList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-12",
        "data-ocid": "account_record.products.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 32, className: "text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No products recorded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Add products via Edit Account." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: account.productList.map((product, i) => {
      var _a;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between px-5 py-3.5",
          "data-ocid": `account_record.subscription.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-accent/15 text-accent", children: (_a = product[0]) == null ? void 0 : _a.toUpperCase() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: product }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  account.licenceQuantity.toString(),
                  " seats · Annual"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold", children: "Active" })
          ]
        },
        product
      );
    }) })
  ] });
}
const TIMELINE_EVENTS = [
  {
    id: "t1",
    type: "call",
    icon: Phone,
    title: "Discovery call with VP Technology",
    actor: "Alex Turner",
    time: "2 hours ago",
    note: "Discussed renewal timeline and satisfaction levels. Customer expressed concern about support response times.",
    borderColor: "border-accent"
  },
  {
    id: "t2",
    type: "meeting",
    icon: Users,
    title: "Quarterly Business Review (QBR)",
    actor: "Sam Chen",
    time: "3 days ago",
    note: "Reviewed KPIs. Customer happy with product performance. Agreed on next QBR in Q2.",
    borderColor: "border-accent"
  },
  {
    id: "t3",
    type: "note",
    icon: FileText,
    title: "Internal note added",
    actor: "Alex Turner",
    time: "5 days ago",
    note: "Flagged for renewal risk review — procurement cycle starting earlier this year.",
    borderColor: "border-border"
  },
  {
    id: "t4",
    type: "email",
    icon: Mail,
    title: "Renewal proposal sent",
    actor: "Alex Turner",
    time: "1 week ago",
    note: "Sent customised renewal proposal with 3-year pricing option.",
    borderColor: "border-blue-500/40"
  },
  {
    id: "t5",
    type: "system",
    icon: CircleCheck,
    title: "Account status updated to Active",
    actor: "System",
    time: "2 weeks ago",
    note: null,
    borderColor: "border-border"
  },
  {
    id: "t6",
    type: "call",
    icon: Phone,
    title: "Follow-up call re: pricing concerns",
    actor: "Sam Chen",
    time: "3 weeks ago",
    note: "Customer requested competitive pricing comparison. Escalated to Deal Desk.",
    borderColor: "border-accent"
  },
  {
    id: "t7",
    type: "meeting",
    icon: MapPin,
    title: "On-site kick-off meeting",
    actor: "Alex Turner",
    time: "6 weeks ago",
    note: "Successful kick-off. Introduced implementation team. Key stakeholders mapped.",
    borderColor: "border-accent"
  },
  {
    id: "t8",
    type: "email",
    icon: Mail,
    title: "Welcome email sent after contract signature",
    actor: "System",
    time: "2 months ago",
    note: null,
    borderColor: "border-blue-500/40"
  }
];
const TIMELINE_FILTERS = [
  "All",
  "Calls",
  "Meetings",
  "Notes",
  "Emails",
  "System"
];
const FILTER_MAP = {
  Calls: ["call"],
  Meetings: ["meeting"],
  Notes: ["note"],
  Emails: ["email"],
  System: ["system"]
};
function TabTimeline({
  timelineFilter,
  setTimelineFilter
}) {
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const filtered = timelineFilter === "All" ? TIMELINE_EVENTS : TIMELINE_EVENTS.filter(
    (e) => (FILTER_MAP[timelineFilter] ?? []).includes(e.type)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-y-auto min-h-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border flex items-center justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Activity Timeline" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex rounded-lg overflow-hidden border border-border",
            "data-ocid": "account_record.timeline.filter",
            children: TIMELINE_FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setTimelineFilter(f),
                className: `px-3 py-1.5 text-xs font-medium transition-colors ${timelineFilter === f ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"}`,
                "data-ocid": `account_record.timeline.filter.${f.toLowerCase()}`,
                children: f
              },
              f
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            size: "sm",
            onClick: () => ue.info("Log Activity coming soon"),
            className: "bg-accent text-accent-foreground hover:bg-accent/90",
            "data-ocid": "account_record.timeline.log_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13, className: "mr-1" }),
              " Log Activity"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-0", children: [
      filtered.map((event, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative flex gap-4",
          "data-ocid": `account_record.timeline.item.${i + 1}`,
          children: [
            i < filtered.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-5 top-10 bottom-0 w-px bg-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${event.borderColor} bg-card z-10`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(event.icon, { size: 14, className: "text-foreground" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 pb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: event.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: [
                    event.actor,
                    " · ",
                    event.time
                  ] })
                ] }),
                event.note && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setExpandedId(expandedId === event.id ? null : event.id),
                    className: "text-[10px] text-accent hover:underline flex-shrink-0",
                    children: expandedId === event.id ? "Less" : "More"
                  }
                )
              ] }),
              expandedId === event.id && event.note && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground bg-secondary/20 rounded-lg px-3 py-2 border-l-2 border-accent", children: event.note })
            ] })
          ]
        },
        event.id
      )),
      filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center py-12",
          "data-ocid": "account_record.timeline.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 32, className: "text-muted-foreground mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium", children: "No activities match this filter" })
          ]
        }
      )
    ] })
  ] });
}
const MOCK_INTERNAL_NOTES = [
  {
    id: "in1",
    accountId: "",
    authorName: "Alex Turner",
    authorRole: "Account Manager",
    authorId: "",
    createdAt: BigInt(Date.now() - 864e5) * BigInt(1e6),
    updatedAt: BigInt(0),
    content: "[INTERNAL] Customer seems happy with Q4 results. Renewal risk is low if we can book the renewal meeting before March."
  },
  {
    id: "in2",
    accountId: "",
    authorName: "Sam Chen",
    authorRole: "Sales Manager",
    authorId: "",
    createdAt: BigInt(Date.now() - 6048e5) * BigInt(1e6),
    updatedAt: BigInt(0),
    content: "[INTERNAL] Competitor approach noted — need to run ROI comparison for renewal deck."
  }
];
const MOCK_EXTERNAL_NOTES = [
  {
    id: "ex1",
    accountId: "",
    authorName: "Alex Turner",
    authorRole: "Account Manager",
    authorId: "",
    createdAt: BigInt(Date.now() - 1728e5) * BigInt(1e6),
    updatedAt: BigInt(0),
    content: "[EXTERNAL:vendor] Renewal proposal shared with customer on 12 Feb. Awaiting sign-off from procurement."
  }
];
function TabNotes(props) {
  const { canEditField } = useApp();
  const {
    notes,
    noteContent,
    setNoteContent,
    noteVisibility,
    setNoteVisibility,
    savingNote,
    editingNoteId,
    setEditingNoteId,
    editNoteContent,
    setEditNoteContent,
    handleAddNote,
    handleEditNote,
    parseNoteVisibility: pnv,
    userProfile,
    VISIBILITY_PREFIXES: VP,
    detailLoading
  } = props;
  const allNotes = notes.length > 0 ? notes : [...MOCK_INTERNAL_NOTES, ...MOCK_EXTERNAL_NOTES];
  const internalNotes = allNotes.filter(
    (n) => pnv(n.content).visibility === "internal"
  );
  const externalNotes = allNotes.filter(
    (n) => pnv(n.content).visibility !== "internal"
  );
  function renderNote(note, idx) {
    const { visibility, displayContent } = pnv(note.content);
    const isAuthor = (userProfile == null ? void 0 : userProfile.id) === note.authorId;
    const isEditing = editingNoteId === note.id;
    const visLabel = visibility === "external-vendor" ? "Shared w/ Vendor" : visibility === "external-distributor" ? "Shared w/ Distributor" : visibility === "external-reseller" ? "Shared w/ Reseller" : "Internal Only";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "crm-card p-4",
        "data-ocid": `account_record.note.item.${idx + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 bg-accent/15 text-accent", children: getInitials(note.authorName) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: note.authorName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground ml-1", children: [
                  "· ",
                  note.authorRole
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${visibility === "internal" ? "bg-secondary text-muted-foreground border border-border" : "bg-accent/15 text-accent border border-accent/30"}`,
                  children: visLabel
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: timeAgo(note.createdAt) }),
              isAuthor && !isEditing && canEditField("internalNotes") && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setEditingNoteId(note.id);
                    setEditNoteContent(displayContent);
                  },
                  className: "text-muted-foreground hover:text-foreground transition-colors",
                  "data-ocid": `account_record.note.edit_button.${idx + 1}`,
                  "aria-label": "Edit note",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 11 })
                }
              )
            ] })
          ] }),
          isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: editNoteContent,
                onChange: (e) => setEditNoteContent(e.target.value),
                rows: 3,
                className: "crm-input w-full rounded-lg px-3 py-2 text-sm resize-none mb-2 focus:border-accent outline-none",
                "data-ocid": `account_record.note.edit_textarea.${idx + 1}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  onClick: () => handleEditNote({
                    ...note,
                    content: VP[visibility] + editNoteContent
                  }),
                  className: "bg-accent text-accent-foreground hover:bg-accent/90",
                  "data-ocid": `account_record.note.save_button.${idx + 1}`,
                  children: "Save"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  onClick: () => setEditingNoteId(null),
                  "data-ocid": `account_record.note.cancel_button.${idx + 1}`,
                  children: "Cancel"
                }
              )
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap", children: displayContent })
        ]
      },
      note.id
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 space-y-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 13, className: "text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-foreground", children: "Internal Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border", children: internalNotes.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground ml-auto", children: "Visible to your org only" })
      ] }),
      canEditField("internalNotes") && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddNote, className: "crm-card p-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: noteVisibility === "internal" ? noteContent : "",
            onChange: (e) => {
              setNoteContent(e.target.value);
              setNoteVisibility("internal");
            },
            placeholder: "Write an internal note…",
            rows: 3,
            className: "crm-input w-full rounded-lg px-3 py-2 text-sm resize-none focus:border-accent outline-none",
            "data-ocid": "account_record.internal_note.textarea"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            size: "sm",
            disabled: savingNote || noteVisibility !== "internal" || !noteContent.trim(),
            onClick: () => setNoteVisibility("internal"),
            className: "bg-accent text-accent-foreground hover:bg-accent/90",
            "data-ocid": "account_record.internal_note.submit_button",
            children: savingNote && noteVisibility === "internal" ? "Saving…" : "Add Internal Note"
          }
        )
      ] }),
      detailLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" }) : internalNotes.map((n, i) => renderNote(n, i)),
      !detailLoading && internalNotes.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground px-3", children: "No internal notes yet." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 13, className: "text-accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-foreground", children: "External Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30", children: externalNotes.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddNote, className: "crm-card p-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: noteVisibility !== "internal" ? noteContent : "",
            onChange: (e) => setNoteContent(e.target.value),
            placeholder: "Write an external note…",
            rows: 3,
            className: "crm-input w-full rounded-lg px-3 py-2 text-sm resize-none focus:border-accent outline-none",
            "data-ocid": "account_record.external_note.textarea"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: noteVisibility !== "internal" ? noteVisibility : "external-vendor",
              onChange: (e) => setNoteVisibility(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  if (noteVisibility === "internal")
                    setNoteVisibility("external-vendor");
                }
              },
              className: "crm-input flex-1 rounded-lg px-2 py-1.5 text-xs focus:border-accent outline-none",
              "data-ocid": "account_record.external_note.visibility_select",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "external-vendor", children: "Share with Vendor" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "external-distributor", children: "Share with Distributor" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "external-reseller", children: "Share with Reseller" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              size: "sm",
              disabled: savingNote || noteVisibility === "internal" || !noteContent.trim(),
              onClick: () => {
                if (noteVisibility === "internal")
                  setNoteVisibility("external-vendor");
              },
              className: "bg-accent text-accent-foreground hover:bg-accent/90 flex-shrink-0",
              "data-ocid": "account_record.external_note.submit_button",
              children: savingNote && noteVisibility !== "internal" ? "Saving…" : "Add"
            }
          )
        ] })
      ] }),
      detailLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" }) : externalNotes.map((n, i) => renderNote(n, internalNotes.length + i)),
      !detailLoading && externalNotes.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground px-3", children: "No external notes yet." })
    ] })
  ] }) });
}
function TabSimple({
  title,
  icon: Icon,
  emptyMsg,
  actionLabel
}) {
  const ocid = title.toLowerCase().replace(/ /g, "_");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-y-auto min-h-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          onClick: () => ue.info(`${actionLabel} coming soon`),
          className: "bg-accent text-accent-foreground hover:bg-accent/90",
          "data-ocid": `account_record.${ocid}.add_button`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13, className: "mr-1" }),
            " ",
            actionLabel
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-14",
        "data-ocid": `account_record.${ocid}.empty_state`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 36, className: "text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-1", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center max-w-xs", children: emptyMsg })
        ]
      }
    )
  ] });
}
const NEXT_ACTIONS = [
  {
    id: 1,
    action: "Schedule renewal kickoff call before month-end",
    priority: "HIGH"
  },
  {
    id: 2,
    action: "Send competitive ROI comparison document to procurement",
    priority: "MEDIUM"
  },
  {
    id: 3,
    action: "Introduce new support contact — previous rep departed",
    priority: "MEDIUM"
  },
  { id: 4, action: "Book QBR for Q2 2025", priority: "LOW" },
  {
    id: 5,
    action: "Review licence utilisation data before renewal meeting",
    priority: "LOW"
  }
];
function TabAIInsights({
  account,
  accountRecommendations,
  accountEngagementGaps,
  dismissRecommendation,
  daysUntilRenewal,
  healthScore
}) {
  const riskLevel = healthScore >= 80 ? "LOW" : healthScore >= 50 ? "MEDIUM" : "HIGH";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 space-y-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "forgeai-card-elevated rounded-xl border border-accent/20 intelligence-pulse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-accent/15", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 18, className: "text-accent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-foreground font-display", children: "ForgeAI Account Intelligence" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
          "AI-powered insights for ",
          account.accountName
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-accent forgeai-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Live" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/20 rounded-xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-accent mb-2", children: "Account Health Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground leading-relaxed", children: [
          account.accountName,
          " is currently rated",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
            healthScore,
            "/100"
          ] }),
          " health.",
          " ",
          riskLevel === "HIGH" && "Immediate attention required — multiple risk signals detected. Renewal is at risk without proactive engagement.",
          riskLevel === "MEDIUM" && "Moderate risk indicators detected. Renewal conversation should begin within 30 days to maintain conversion probability.",
          riskLevel === "LOW" && "Account is in a healthy state with strong engagement signals. Continue proactive touchpoints to maintain renewal confidence."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/20 rounded-xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-accent mb-2", children: "Renewal Risk Assessment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: daysUntilRenewal === null ? "No renewal date set. Configure a renewal date to enable risk tracking." : daysUntilRenewal <= 0 ? "Renewal date has passed. Immediate outreach required." : daysUntilRenewal <= 30 ? `Renewal is due in ${daysUntilRenewal} days. HIGH RISK — engage immediately.` : daysUntilRenewal <= 90 ? `Renewal is due in ${daysUntilRenewal} days. MEDIUM risk window. Begin renewal conversation now.` : `Renewal is due in ${daysUntilRenewal} days. LOW risk. Continue standard engagement cadence.` })
      ] }),
      accountEngagementGaps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-accent", children: "Engagement Gap Alerts" }),
        accountEngagementGaps.map((gap) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-accent/10 border border-accent/20",
            "data-ocid": `account_record.ai_insights.gap.${gap.alertId}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground truncate", children: gap.entityName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
                  gap.daysSinceLastEngagement,
                  " days without engagement"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25", children: gap.severity })
            ]
          },
          gap.alertId
        ))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-accent mb-2", children: "Recommended Next Actions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: NEXT_ACTIONS.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-secondary/20 border border-border",
            "data-ocid": `account_record.ai_insights.action.${a.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 13, className: "text-accent flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground flex-1", children: a.action }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-[9px] font-bold px-1.5 py-0.5 rounded-full ${a.priority === "HIGH" ? "bg-red-500/15 text-red-400 border border-red-500/25" : a.priority === "MEDIUM" ? "bg-amber-500/15 text-amber-400 border border-amber-500/25" : "bg-secondary text-muted-foreground border border-border"}`,
                  children: a.priority
                }
              )
            ]
          },
          a.id
        )) })
      ] }),
      accountRecommendations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-accent", children: "Live ForgeAI Signals" }),
        accountRecommendations.map((rec) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ForgeAIRecommendationCard,
          {
            recommendation: rec,
            onDismiss: dismissRecommendation,
            showExpand: true
          },
          rec.id
        ))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/20 rounded-xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-accent mb-2", children: "Historical Activity Pattern" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed", children: [
          "This account has an average touchpoint frequency of",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "2.4 interactions per month" }),
          ". Last engagement was via phone 2 hours ago. Engagement velocity is trending upward vs. last quarter, indicating positive renewal momentum."
        ] })
      ] }),
      (() => {
        var _a, _b, _c, _d, _e;
        const rich = account;
        const cards = [];
        if (((_a = rich.incumbentDistributors) == null ? void 0 : _a.length) >= 2) {
          cards.push(
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl border-l-2 border-orange-400 bg-orange-400/5 p-3 mb-2 flex items-start gap-2 text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-orange-400 mt-0.5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Multi-Distributor Servicing" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-0.5", children: [
                      "This account is currently serviced by",
                      " ",
                      rich.incumbentDistributors.length,
                      " Distributors across regions. Review territorial alignment to avoid channel conflict."
                    ] })
                  ] })
                ]
              },
              "multi-dist"
            )
          );
        }
        if (((_b = rich.ownershipRoles) == null ? void 0 : _b.renewalOwner) && ((_c = rich.ownershipRoles) == null ? void 0 : _c.operationalOwner) && rich.ownershipRoles.renewalOwner !== rich.ownershipRoles.operationalOwner) {
          cards.push(
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl border-l-2 border-orange-400 bg-orange-400/5 p-3 mb-2 flex items-start gap-2 text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-orange-400 mt-0.5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Ownership Divergence" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-0.5", children: "Renewal ownership differs from operational servicing ownership. Ensure escalation paths are clearly defined." })
                  ] })
                ]
              },
              "owner-mismatch"
            )
          );
        }
        if (((_d = rich.incumbentResellers) == null ? void 0 : _d.length) >= 2) {
          cards.push(
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl border-l-2 border-orange-400 bg-orange-400/5 p-3 mb-2 flex items-start gap-2 text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-orange-400 mt-0.5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Overlapping Reseller Relationships" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-0.5", children: [
                      rich.incumbentResellers.length,
                      " Resellers are mapped to this account. Clarify primary vs. secondary servicing responsibilities."
                    ] })
                  ] })
                ]
              },
              "multi-reseller"
            )
          );
        }
        if ((_e = rich.channelProducts) == null ? void 0 : _e.some(
          (p) => p.serviceStatus === "at-risk" || p.serviceStatus === "expiring"
        )) {
          cards.push(
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl border-l-2 border-orange-400 bg-orange-400/5 p-3 mb-2 flex items-start gap-2 text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-orange-400 mt-0.5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Product-Level Renewal Risk" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-0.5", children: "One or more products/services on this account are flagged at-risk or expiring. Review contract timelines and renewal ownership." })
                  ] })
                ]
              },
              "product-risk"
            )
          );
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-orange-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-accent uppercase tracking-wider", children: "Channel Ecosystem Intelligence" })
          ] }),
          cards.length > 0 ? cards : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground", children: "No channel ecosystem insights detected for this account." })
        ] });
      })()
    ] })
  ] }) });
}
function TabCustomFields({
  customFields,
  editingCustomFields,
  setEditingCustomFields
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-y-auto min-h-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { size: 14, className: "text-accent" }),
        " Custom Fields",
        customFields.fieldDefs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-full", children: customFields.fieldDefs.length })
      ] }),
      !editingCustomFields && customFields.fieldDefs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setEditingCustomFields(true),
          className: "text-xs text-accent hover:text-accent/80 flex items-center gap-1.5 transition-colors",
          "data-ocid": "account_record.custom_fields.edit_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 12 }),
            " Edit"
          ]
        }
      )
    ] }),
    customFields.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "p-5 space-y-3",
        "data-ocid": "account_record.custom_fields.loading_state",
        children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-14 rounded bg-secondary/30 animate-pulse"
          },
          i
        ))
      }
    ) : customFields.fieldDefs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-14",
        "data-ocid": "account_record.custom_fields.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { size: 32, className: "text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No custom fields defined" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Admins can create custom fields under Admin Settings." })
        ]
      }
    ) : editingCustomFields ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-5", children: customFields.fieldDefs.filter((d) => !d.isArchived).map((def) => {
        var _a;
        const existing = ((_a = customFields.fieldValues[def.id]) == null ? void 0 : _a.value) ?? "";
        const pending = customFields.pendingChanges[def.id];
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          CustomFieldEditor,
          {
            fieldDef: def,
            value: pending !== void 0 ? pending : existing,
            onChange: (v) => customFields.setFieldValue(def.id, v),
            error: customFields.errors[def.id]
          },
          def.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: async () => {
              const errs = customFields.validateAll();
              if (Object.keys(errs).length > 0) return;
              await customFields.saveFieldValues();
              setEditingCustomFields(false);
              ue.success("Custom fields saved");
            },
            disabled: customFields.isSaving,
            className: "px-4 py-2 text-sm font-medium text-accent-foreground rounded-lg bg-accent hover:bg-accent/90 transition-colors",
            "data-ocid": "account_record.custom_fields.save_button",
            children: customFields.isSaving ? "Saving…" : "Save All"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setEditingCustomFields(false),
            className: "px-4 py-2 text-sm font-medium border border-border text-muted-foreground rounded-lg hover:text-foreground transition-colors",
            "data-ocid": "account_record.custom_fields.cancel_button",
            children: "Cancel"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: customFields.fieldDefs.filter((d) => !d.isArchived).map((def) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      CustomFieldRenderer,
      {
        fieldDef: def,
        value: customFields.fieldValues[def.id]
      },
      def.id
    )) })
  ] });
}
export {
  AccountRecord
};
