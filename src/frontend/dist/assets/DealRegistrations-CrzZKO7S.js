import { c as createLucideIcon, p as useActor, r as reactExports, ab as ue, ao as DuplicateDRStatus, j as jsxRuntimeExports, T as TriangleAlert, n as Clock, k as ChevronDown, i as ChevronRight, W as formatCurrency, af as formatDate, X, m as Button, u as useApp, P as DealStatus, ak as dealStatusLabel, a8 as Plus, S as Search, ad as Input, Q as Briefcase, al as dealStatusColor, Z as Zap, ac as ChevronUp, a as useNavigate, ah as CustomFieldObjectType } from "./index-DvFvlUBj.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { C as ClickableAccountName } from "./ClickableAccountName-DlLteLE7.js";
import { u as useCustomFields, C as CustomFieldEditor } from "./useCustomFields-Do4Q3M8P.js";
import { C as CustomFieldRenderer } from "./CustomFieldRenderer-DSYXzkdv.js";
import { F as ForgeAIRecommendationCard } from "./ForgeAIRecommendationCard-C4eBPTAG.js";
import { P as PriceCalculator } from "./PriceCalculator-Cfqa4XfP.js";
import { u as useForgeAI } from "./useForgeAI-CFLYJlF1.js";
import { S as ShieldAlert } from "./shield-alert-BCLvkGRD.js";
import { U as UserCheck } from "./user-check-B5oPdNCD.js";
import { C as Calculator } from "./calculator-hUciaH5t.js";
import { L as LayoutGrid } from "./layout-grid-CWVFWNqK.js";
import "./checkbox-Cr6u9Lap.js";
import "./index-CwZfxY3Y.js";
import "./index-B1ifXNtV.js";
import "./textarea-BHUaDciu.js";
import "./useMutation-D0Tr8pyU.js";
import "./download-DVLbZ_Ir.js";
import "./phone-DSozTLzi.js";
import "./mail-BpQyu_iW.js";
import "./minus-OwCcNK6_.js";
import "./backend.d-Bio-_uWv.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "18", cy: "18", r: "3", key: "1xkwt0" }],
  ["circle", { cx: "6", cy: "6", r: "3", key: "1lh9wr" }],
  ["path", { d: "M6 21V9a9 9 0 0 0 9 9", key: "7kw0sc" }]
];
const GitMerge = createLucideIcon("git-merge", __iconNode);
function timeWaiting(submittedAt) {
  const ms = Number(submittedAt) / 1e6;
  const diffMs = Date.now() - ms;
  const hours = Math.floor(diffMs / 36e5);
  const days = Math.floor(diffMs / 864e5);
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h`;
  return "< 1h";
}
const ACTION_META = {
  [DuplicateDRStatus.Approved]: {
    label: "Approve Duplicate",
    color: "text-green-400",
    description: "Allow this duplicate registration. Both resellers will hold an active DR for this product/account."
  },
  [DuplicateDRStatus.Rejected]: {
    label: "Reject Submission",
    color: "text-red-400",
    description: "Reject this duplicate. The submitting reseller will be notified."
  },
  [DuplicateDRStatus.Merged]: {
    label: "Merge Records",
    color: "text-blue-400",
    description: "Combine both DRs into a single record. Original ownership is preserved unless reassigned."
  },
  [DuplicateDRStatus.Reassigned]: {
    label: "Reassign Ownership",
    color: "text-amber-400",
    description: "Transfer ownership of the existing DR to the new submitting reseller."
  },
  [DuplicateDRStatus.Escalated]: {
    label: "Escalate for Review",
    color: "text-muted-foreground",
    description: "Flag for manual review by a senior admin. Add an internal note below."
  },
  [DuplicateDRStatus.PendingVendorReview]: {
    label: "Pending",
    color: "text-orange-400",
    description: ""
  }
};
function ActionModal({ action, record, onConfirm, onClose }) {
  const [note, setNote] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const meta = ACTION_META[action];
  async function handleConfirm() {
    setBusy(true);
    await onConfirm(note);
    setBusy(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4",
      "data-ocid": "dup_queue.action.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card w-full max-w-md p-6 fade-in space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-semibold ${meta.color}`, children: meta.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: meta.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "dup_queue.action.close_button",
              onClick: onClose,
              className: "p-1 rounded hover:bg-secondary/40 text-muted-foreground flex-shrink-0",
              "aria-label": "Close",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/20 rounded-lg p-3 text-xs space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
            "Product:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 font-semibold", children: record.product })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
            "Account ID:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground", children: [
              record.accountId.slice(0, 12),
              "…"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
            "Existing owner:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: record.existingResellerId || "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
            "New submission by:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: record.resellerId || "—" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "dup-action-note",
              className: "block text-xs text-muted-foreground mb-1",
              children: "Internal note (optional)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "dup-action-note",
              "data-ocid": "dup_queue.action.note.textarea",
              value: note,
              onChange: (e) => setNote(e.target.value),
              rows: 3,
              className: "crm-input w-full px-3 py-2 text-xs resize-none",
              placeholder: "Add context for the audit trail…"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              "data-ocid": "dup_queue.action.cancel_button",
              onClick: onClose,
              className: "text-xs",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              "data-ocid": "dup_queue.action.confirm_button",
              disabled: busy,
              onClick: handleConfirm,
              className: "text-xs text-white",
              style: {
                background: action === DuplicateDRStatus.Approved ? "#22c55e" : action === DuplicateDRStatus.Rejected ? "#ef4444" : action === DuplicateDRStatus.Merged ? "#3b82f6" : action === DuplicateDRStatus.Reassigned ? "#f59e0b" : "#6b7280"
              },
              children: busy ? "Processing…" : meta.label
            }
          )
        ] })
      ] })
    }
  );
}
function DupRow({ record, index, allDeals, accounts, onAction }) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const newDR = allDeals.find((d) => d.id === record.newDRId);
  const existingDR = allDeals.find((d) => d.id === record.existingDRId);
  const account = accounts.find((a) => a.id === record.accountId);
  const isPending = record.status === DuplicateDRStatus.PendingVendorReview;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border border-border/60 rounded-lg overflow-hidden mb-2",
      "data-ocid": `dup_queue.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 px-4 py-3 hover:bg-secondary/10 transition-colors cursor-pointer",
            onClick: () => setExpanded((v) => !v),
            onKeyDown: (e) => e.key === "Enter" && setExpanded((v) => !v),
            "aria-expanded": expanded,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-red-500/15 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30 flex-shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 9 }),
                " DUPLICATE"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-orange-400 font-semibold text-xs flex-1 min-w-0 truncate",
                  title: record.product,
                  children: record.product
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground hidden sm:block flex-shrink-0", children: (account == null ? void 0 : account.accountName) ?? record.accountId.slice(0, 10) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground hidden md:block flex-shrink-0", children: [
                "Existing:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: record.existingResellerId || "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground hidden lg:block flex-shrink-0", children: [
                "New:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: record.resellerId || "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
                timeWaiting(record.submittedAt)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-muted-foreground flex-shrink-0", children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 }) })
            ]
          }
        ),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/50 bg-secondary/5 p-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Existing DR" }),
              existingDR ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/20 rounded-lg p-3 text-xs space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Ref:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-mono", children: [
                    existingDR.id.slice(0, 12),
                    "…"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Reseller:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: existingDR.resellerId || "—" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Product:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 font-semibold", children: existingDR.product })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Value:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-mono", children: formatCurrency(existingDR.estimatedValue) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Account:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: (account == null ? void 0 : account.accountName) ?? existingDR.accountId.slice(0, 10) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Submitted:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: existingDR.submittedDate ? formatDate(existingDR.submittedDate) : "—" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Status:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400", children: "Approved" })
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/20 rounded-lg p-3 text-xs text-muted-foreground", children: [
                "DR ref: ",
                record.existingDRId.slice(0, 12),
                "…"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "New Submission" }),
              newDR ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/20 rounded-lg p-3 text-xs space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Ref:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-mono", children: [
                    newDR.id.slice(0, 12),
                    "…"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Reseller:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: newDR.resellerId || "—" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Product:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 font-semibold", children: newDR.product })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Value:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-mono", children: formatCurrency(newDR.estimatedValue) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Account:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: (account == null ? void 0 : account.accountName) ?? newDR.accountId.slice(0, 10) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Submitted:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: formatDate(record.submittedAt) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Time waiting:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400", children: timeWaiting(record.submittedAt) })
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/20 rounded-lg p-3 text-xs text-muted-foreground", children: [
                "DR ref: ",
                record.newDRId.slice(0, 12),
                "…"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 rounded-lg px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 13, className: "text-orange-400 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-orange-300", children: [
              "Product overlap detected:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: record.product }),
              " is already registered against this account."
            ] })
          ] }),
          isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": `dup_queue.approve_button.${index}`,
                onClick: () => onAction(record, DuplicateDRStatus.Approved),
                className: "text-xs px-3 py-1.5 rounded-full border border-green-500/40 text-green-400 hover:bg-green-500/10 transition-colors flex items-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { size: 11 }),
                  " Approve"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `dup_queue.reject_button.${index}`,
                onClick: () => onAction(record, DuplicateDRStatus.Rejected),
                className: "text-xs px-3 py-1.5 rounded-full border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors",
                children: "Reject"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": `dup_queue.merge_button.${index}`,
                onClick: () => onAction(record, DuplicateDRStatus.Merged),
                className: "text-xs px-3 py-1.5 rounded-full border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 transition-colors flex items-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(GitMerge, { size: 11 }),
                  " Merge"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `dup_queue.reassign_button.${index}`,
                onClick: () => onAction(record, DuplicateDRStatus.Reassigned),
                className: "text-xs px-3 py-1.5 rounded-full border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition-colors",
                children: "Reassign"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `dup_queue.escalate_button.${index}`,
                onClick: () => onAction(record, DuplicateDRStatus.Escalated),
                className: "text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors",
                children: "Escalate"
              }
            )
          ] }),
          !isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Decision:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `font-semibold ${record.status === DuplicateDRStatus.Approved ? "text-green-400" : record.status === DuplicateDRStatus.Rejected ? "text-red-400" : record.status === DuplicateDRStatus.Merged ? "text-blue-400" : record.status === DuplicateDRStatus.Reassigned ? "text-amber-400" : "text-muted-foreground"}`,
                children: record.status
              }
            ),
            record.reviewNote && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "— ",
              record.reviewNote
            ] })
          ] })
        ] })
      ]
    }
  );
}
function DuplicateQueue({
  records,
  allDeals,
  accounts,
  loading,
  onRefresh
}) {
  const { actor } = useActor();
  const [pendingAction, setPendingAction] = reactExports.useState(null);
  const handleAction = reactExports.useCallback(
    (record, action) => {
      setPendingAction({ record, action });
    },
    []
  );
  const handleConfirm = reactExports.useCallback(
    async (note) => {
      if (!pendingAction || !actor) return;
      try {
        const ok = await actor.reviewDuplicateDR(
          pendingAction.record.id,
          pendingAction.action,
          note
        );
        if (ok) {
          ue.success(`Duplicate DR ${pendingAction.action.toLowerCase()}`);
          await onRefresh();
        } else {
          ue.error("Action failed — check your permissions");
        }
      } catch {
        ue.error("Failed to process action");
      } finally {
        setPendingAction(null);
      }
    },
    [pendingAction, actor, onRefresh]
  );
  const pending = records.filter(
    (r) => r.status === DuplicateDRStatus.PendingVendorReview
  );
  const resolved = records.filter(
    (r) => r.status !== DuplicateDRStatus.PendingVendorReview
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "dup_queue.panel", children: [
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-lg" }, i)) }) : records.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-14 px-6",
        "data-ocid": "dup_queue.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 36, className: "text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-1", children: "No duplicate DRs in queue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center max-w-xs", children: "Duplicate deal registration attempts will appear here for review." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      pending.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: [
          "Awaiting Decision (",
          pending.length,
          ")"
        ] }),
        pending.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          DupRow,
          {
            record: r,
            index: i + 1,
            allDeals,
            accounts,
            onAction: handleAction
          },
          r.id
        ))
      ] }),
      resolved.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4", children: [
          "Resolved (",
          resolved.length,
          ")"
        ] }),
        resolved.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          DupRow,
          {
            record: r,
            index: pending.length + i + 1,
            allDeals,
            accounts,
            onAction: handleAction
          },
          r.id
        ))
      ] })
    ] }),
    pendingAction && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ActionModal,
      {
        action: pendingAction.action,
        record: pendingAction.record,
        onConfirm: handleConfirm,
        onClose: () => setPendingAction(null)
      }
    )
  ] });
}
const ALL_STATUSES = [
  DealStatus.Draft,
  DealStatus.Submitted,
  DealStatus.UnderReview,
  DealStatus.Approved,
  DealStatus.Rejected,
  DealStatus.Won,
  DealStatus.Lost,
  DealStatus.Expired
];
const STATUS_PILL_COLORS = {
  [DealStatus.Draft]: "bg-muted/40 text-muted-foreground",
  [DealStatus.Submitted]: "bg-indigo-500/20 text-indigo-300",
  [DealStatus.UnderReview]: "bg-yellow-500/20 text-yellow-300",
  [DealStatus.Approved]: "bg-green-500/20 text-green-300",
  [DealStatus.Rejected]: "bg-red-500/20 text-red-300",
  [DealStatus.Won]: "bg-emerald-500/20 text-emerald-300",
  [DealStatus.Lost]: "bg-muted/30 text-muted-foreground",
  [DealStatus.Expired]: "bg-orange-500/10 text-orange-400/80"
};
function dateInputToNs(val) {
  if (!val) return BigInt(0);
  return BigInt(new Date(val).getTime() * 1e6);
}
const EMPTY_FORM = {
  accountId: "",
  opportunityName: "",
  product: "",
  estimatedValue: "",
  quantity: "1",
  closeDate: "",
  dealStage: "",
  competitor: "",
  notes: "",
  resellerId: "",
  vendorOwnerId: "",
  customerDomain: "",
  status: DealStatus.Draft
};
function DealForm({ accounts, prefill, onClose, onSaved }) {
  const { actor } = useActor();
  const [form, setForm] = reactExports.useState({
    ...EMPTY_FORM,
    ...prefill
  });
  const [saving, setSaving] = reactExports.useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  async function handleSubmit(e) {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const input = {
        accountId: form.accountId,
        opportunityName: form.opportunityName,
        product: form.product,
        estimatedValue: Number.parseFloat(form.estimatedValue) || 0,
        quantity: BigInt(Number.parseInt(form.quantity) || 1),
        closeDate: dateInputToNs(form.closeDate),
        dealStage: form.dealStage,
        competitor: form.competitor,
        notes: form.notes,
        resellerId: form.resellerId,
        vendorOwnerId: form.vendorOwnerId,
        customerDomain: form.customerDomain,
        status: form.status,
        submittedBy: "",
        submittedDate: void 0
      };
      const result = await actor.createDealRegistration(input);
      if (result.__kind__ === "err") {
        ue.error(result.err);
        return;
      }
      ue.success("Deal registration created");
      onSaved();
      onClose();
    } catch {
      ue.error("Failed to create deal");
    } finally {
      setSaving(false);
    }
  }
  const selectedAccount = accounts.find((a) => a.id === form.accountId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "deal-account",
            className: "block text-xs text-muted-foreground mb-1",
            children: "Account *"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "deal-account",
            required: true,
            "data-ocid": "deal.account.select",
            value: form.accountId,
            onChange: (e) => {
              const acc = accounts.find((a) => a.id === e.target.value);
              setForm((f) => ({
                ...f,
                accountId: e.target.value,
                customerDomain: (acc == null ? void 0 : acc.customerDomain) ?? f.customerDomain
              }));
            },
            className: "w-full crm-input px-3 py-2 text-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select account…" }),
              accounts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: a.id, children: a.accountName }, a.id))
            ]
          }
        ),
        selectedAccount && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
          "Domain: ",
          selectedAccount.customerDomain
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "deal-opp-name",
            className: "block text-xs text-muted-foreground mb-1",
            children: "Opportunity Name *"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "deal-opp-name",
            required: true,
            "data-ocid": "deal.name.input",
            value: form.opportunityName,
            onChange: (e) => set("opportunityName", e.target.value),
            className: "crm-input",
            placeholder: "Q3 Renewal Expansion"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "deal-product",
            className: "block text-xs text-muted-foreground mb-1",
            children: "Product *"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "deal-product",
            required: true,
            "data-ocid": "deal.product.input",
            value: form.product,
            onChange: (e) => set("product", e.target.value),
            className: "crm-input",
            placeholder: "Security Suite Pro"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "deal-value",
            className: "block text-xs text-muted-foreground mb-1",
            children: "Estimated Value (USD)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "deal-value",
            type: "number",
            min: "0",
            "data-ocid": "deal.value.input",
            value: form.estimatedValue,
            onChange: (e) => set("estimatedValue", e.target.value),
            className: "crm-input",
            placeholder: "25000"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "deal-quantity",
            className: "block text-xs text-muted-foreground mb-1",
            children: "Quantity"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "deal-quantity",
            type: "number",
            min: "1",
            "data-ocid": "deal.quantity.input",
            value: form.quantity,
            onChange: (e) => set("quantity", e.target.value),
            className: "crm-input",
            placeholder: "10"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "deal-close-date",
            className: "block text-xs text-muted-foreground mb-1",
            children: "Close Date *"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "deal-close-date",
            type: "date",
            required: true,
            "data-ocid": "deal.close_date.input",
            value: form.closeDate,
            onChange: (e) => set("closeDate", e.target.value),
            className: "crm-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "deal-stage",
            className: "block text-xs text-muted-foreground mb-1",
            children: "Deal Stage"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "deal-stage",
            "data-ocid": "deal.stage.input",
            value: form.dealStage,
            onChange: (e) => set("dealStage", e.target.value),
            className: "crm-input",
            placeholder: "Negotiation"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "deal-reseller",
            className: "block text-xs text-muted-foreground mb-1",
            children: "Reseller Company"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "deal-reseller",
            "data-ocid": "deal.reseller.input",
            value: form.resellerId,
            onChange: (e) => set("resellerId", e.target.value),
            className: "crm-input",
            placeholder: "Reseller name or ID"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "deal-vendor-owner",
            className: "block text-xs text-muted-foreground mb-1",
            children: "Vendor Owner"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "deal-vendor-owner",
            "data-ocid": "deal.vendor_owner.input",
            value: form.vendorOwnerId,
            onChange: (e) => set("vendorOwnerId", e.target.value),
            className: "crm-input",
            placeholder: "Vendor name or ID"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "deal-competitor",
            className: "block text-xs text-muted-foreground mb-1",
            children: "Competitor"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "deal-competitor",
            "data-ocid": "deal.competitor.input",
            value: form.competitor,
            onChange: (e) => set("competitor", e.target.value),
            className: "crm-input",
            placeholder: "CompetitorName"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "deal-notes",
            className: "block text-xs text-muted-foreground mb-1",
            children: "Notes"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            id: "deal-notes",
            "data-ocid": "deal.notes.textarea",
            value: form.notes,
            onChange: (e) => set("notes", e.target.value),
            rows: 3,
            className: "crm-input w-full px-3 py-2 text-sm resize-none",
            placeholder: "Additional context…"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          "data-ocid": "deal.cancel_button",
          onClick: onClose,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          "data-ocid": "deal.submit_button",
          disabled: saving,
          className: "text-white bg-orange-500",
          children: saving ? "Creating…" : "Create Deal"
        }
      )
    ] })
  ] });
}
function DetailPanel({
  deal,
  onClose,
  onStatusChange,
  isVendor
}) {
  const [changing, setChanging] = reactExports.useState(false);
  const [detailTab, setDetailTab] = reactExports.useState(
    "details"
  );
  const [editingCF, setEditingCF] = reactExports.useState(false);
  const navigate = useNavigate();
  const customFields = useCustomFields(
    CustomFieldObjectType.dealRegistration,
    deal.id
  );
  async function handleStatus(status) {
    setChanging(true);
    await onStatusChange(deal.id, status);
    setChanging(false);
  }
  const vendorActions = [
    { label: "Approve", status: DealStatus.Approved, color: "text-green-400" },
    { label: "Reject", status: DealStatus.Rejected, color: "text-red-400" },
    {
      label: "Under Review",
      status: DealStatus.UnderReview,
      color: "text-yellow-400"
    }
  ];
  const resellerActions = [
    { label: "Submit", status: DealStatus.Submitted, color: "text-indigo-300" }
  ];
  const actions = isVendor ? vendorActions : resellerActions;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col fade-in",
      "data-ocid": "deal_reg.detail.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-5 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Deal Registration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-foreground truncate", children: deal.opportunityName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "deal_reg.detail.close_button",
              onClick: onClose,
              className: "ml-3 p-1.5 rounded-md hover:bg-secondary/40 text-muted-foreground transition-colors flex-shrink-0",
              "aria-label": "Close panel",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-border space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Status:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: dealStatusColor(deal.status), children: dealStatusLabel(deal.status) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: actions.filter((a) => a.status !== deal.status).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `deal_reg.status_${a.status.toLowerCase()}_button`,
              disabled: changing,
              onClick: () => handleStatus(a.status),
              className: `text-xs px-3 py-1.5 rounded-full border border-border hover:border-accent transition-colors ${a.color} disabled:opacity-50`,
              children: a.label
            },
            a.status
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex border-b border-border px-2",
            "data-ocid": "deal_reg.detail.tabs",
            children: [
              { id: "details", label: "Details" },
              {
                id: "customFields",
                label: `Custom Fields${customFields.fieldDefs.length > 0 ? ` (${customFields.fieldDefs.length})` : ""}`
              }
            ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setDetailTab(tab.id),
                "data-ocid": `deal_reg.detail.tab.${tab.id}`,
                className: `flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${detailTab === tab.id ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`,
                children: [
                  tab.id === "customFields" && /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { size: 11 }),
                  tab.label
                ]
              },
              tab.id
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto scrollbar-thin", children: [
          detailTab === "details" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
            [
              ["Account ID", deal.accountId],
              ["Customer Domain", deal.customerDomain],
              ["Product", deal.product],
              ["Estimated Value", formatCurrency(deal.estimatedValue)],
              ["Quantity", String(deal.quantity)],
              ["Close Date", formatDate(deal.closeDate)],
              ["Deal Stage", deal.dealStage || "—"],
              ["Competitor", deal.competitor || "—"],
              ["Reseller", deal.resellerId || "—"],
              ["Vendor Owner", deal.vendorOwnerId || "—"],
              ["Submitted By", deal.submittedBy || "—"],
              [
                "Submitted Date",
                deal.submittedDate ? formatDate(deal.submittedDate) : "—"
              ],
              ["Created", formatDate(deal.createdAt)],
              ["Last Updated", formatDate(deal.updatedAt)]
            ].map(([label, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground text-right break-all", children: value })
            ] }, label)),
            deal.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground bg-secondary/20 rounded-md p-3 leading-relaxed", children: deal.notes })
            ] })
          ] }),
          detailTab === "customFields" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { size: 12, className: "text-orange-500" }),
                "Custom Fields"
              ] }),
              !editingCF && customFields.fieldDefs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setEditingCF(true),
                  className: "text-[11px] text-accent hover:text-accent/80 transition-colors",
                  "data-ocid": "deal_reg.custom_fields.edit_button",
                  children: "Edit"
                }
              )
            ] }),
            customFields.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "space-y-3",
                "data-ocid": "deal_reg.custom_fields.loading_state",
                children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-12 rounded bg-secondary/30 animate-pulse"
                  },
                  i
                ))
              }
            ) : customFields.fieldDefs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center py-10",
                "data-ocid": "deal_reg.custom_fields.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { size: 28, className: "text-muted-foreground mb-2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground", children: "No custom fields defined" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 text-center", children: "Admins can create custom fields under Admin Settings." })
                ]
              }
            ) : editingCF ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              customFields.fieldDefs.filter((d) => !d.isArchived).map((def) => {
                var _a;
                const existing = ((_a = customFields.fieldValues[def.id]) == null ? void 0 : _a.value) ?? "";
                const pending = customFields.pendingChanges[def.id];
                const current = pending !== void 0 ? pending : existing;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CustomFieldEditor,
                  {
                    fieldDef: def,
                    value: current,
                    onChange: (v) => customFields.setFieldValue(def.id, v),
                    error: customFields.errors[def.id]
                  },
                  def.id
                );
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: async () => {
                      const errs = customFields.validateAll();
                      if (Object.keys(errs).length > 0) return;
                      await customFields.saveFieldValues();
                      setEditingCF(false);
                    },
                    disabled: customFields.isSaving,
                    className: "px-3 py-1.5 text-xs font-medium text-white rounded-md bg-orange-500",
                    "data-ocid": "deal_reg.custom_fields.save_button",
                    children: customFields.isSaving ? "Saving…" : "Save"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setEditingCF(false),
                    className: "px-3 py-1.5 text-xs font-medium border border-border text-muted-foreground rounded-md hover:text-foreground transition-colors",
                    "data-ocid": "deal_reg.custom_fields.cancel_button",
                    children: "Cancel"
                  }
                )
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: customFields.fieldDefs.filter((d) => !d.isArchived).map((def) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              CustomFieldRenderer,
              {
                fieldDef: def,
                value: customFields.fieldValues[def.id]
              },
              def.id
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "deal_reg.view_account_link",
            onClick: () => navigate({ to: "/accounts/$id", params: { id: deal.accountId } }),
            className: "flex items-center gap-1.5 text-xs text-accent hover:underline",
            children: [
              "View Account ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 12 })
            ]
          }
        ) })
      ]
    }
  );
}
function DealIntelligencePanel({
  selectedDealId,
  totalActive,
  stalledCount,
  duplicateCount
}) {
  const { recommendations, dismissRecommendation, isAnalyzing } = useForgeAI();
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const dealRecs = reactExports.useMemo(
    () => recommendations.filter((r) => r.affectedEntityType === "Deal"),
    [recommendations]
  );
  const visibleRecs = reactExports.useMemo(() => {
    if (!selectedDealId) return dealRecs;
    const specific = dealRecs.filter(
      (r) => r.affectedEntityId === selectedDealId
    );
    return specific.length > 0 ? specific : dealRecs;
  }, [dealRecs, selectedDealId]);
  const hasRecs = visibleRecs.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "crm-card overflow-hidden border-orange-500/20 bg-slate-950/97",
      "data-ocid": "deal_intelligence.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "deal_intelligence.panel.toggle",
            onClick: () => setCollapsed((v) => !v),
            className: "w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/20 transition-colors duration-150",
            "aria-expanded": !collapsed,
            "aria-controls": "deal-intelligence-body",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 13, className: "flex-shrink-0 text-orange-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground font-display", children: "Deal Intelligence" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "inline-flex items-center text-[9px] px-1.5 py-0.5 rounded font-bold bg-orange-500/15 text-orange-500 border border-orange-500/30",
                    style: { letterSpacing: "0.06em" },
                    children: "ForgeAI"
                  }
                ),
                isAnalyzing && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "forgeai-pulse-dot", title: "ForgeAI is analyzing" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                hasRecs && !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-medium px-2 py-0.5 rounded-full inline-flex items-center justify-center bg-orange-500/10 text-orange-500 border border-orange-500/20", children: [
                  visibleRecs.length,
                  " insight",
                  visibleRecs.length !== 1 ? "s" : ""
                ] }),
                collapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 13, className: "text-slate-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 13, className: "text-slate-400" })
              ] })
            ]
          }
        ),
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            id: "deal-intelligence-body",
            className: "border-t border-orange-500/10 px-4 pb-4 pt-3 space-y-3",
            children: [
              !selectedDealId && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "grid grid-cols-3 gap-2 mb-3",
                  "data-ocid": "deal_intelligence.health_summary",
                  children: [
                    { label: "Active DRs", value: totalActive, color: "#8AABDC" },
                    {
                      label: "Stalled",
                      value: stalledCount,
                      color: stalledCount > 0 ? "#fb923c" : "#8AABDC"
                    },
                    {
                      label: "Duplicates",
                      value: duplicateCount,
                      color: duplicateCount > 0 ? "#fb923c" : "#8AABDC"
                    }
                  ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex flex-col items-center gap-0.5 rounded-[0.375rem] py-2",
                      style: {
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.05)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-base font-bold",
                            style: {
                              color: stat.color,
                              fontFamily: "var(--font-mono)"
                            },
                            children: stat.value
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-slate-500", children: stat.label })
                      ]
                    },
                    stat.label
                  ))
                }
              ),
              selectedDealId && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] mb-2 text-slate-400 font-body", children: "Showing insights for selected deal" }),
              hasRecs ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "space-y-2.5",
                  "data-ocid": "deal_intelligence.recommendations_list",
                  children: visibleRecs.map((rec) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ForgeAIRecommendationCard,
                    {
                      recommendation: rec,
                      onDismiss: dismissRecommendation,
                      showExpand: true
                    },
                    rec.id
                  ))
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center py-6 gap-2",
                  "data-ocid": "deal_intelligence.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full flex items-center justify-center bg-orange-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14, className: "text-orange-500" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-center text-slate-400 font-body", children: [
                      "No deal intelligence signals detected.",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "ForgeAI is monitoring deal registrations in real time." })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 mt-1 border-t border-orange-500/[0.08]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-600 font-mono", children: "ForgeAI recommendations are assistive only — no auto-approvals." }) })
            ]
          }
        )
      ]
    }
  );
}
function DealRegistrations() {
  const {
    dealRegistrations,
    accounts,
    loading,
    isVendor,
    refreshDealRegistrations
  } = useApp();
  const { actor } = useActor();
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [duplicateQueue, setDuplicateQueue] = reactExports.useState([]);
  const [dupLoading, setDupLoading] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const [statusFilters, setStatusFilters] = reactExports.useState(/* @__PURE__ */ new Set());
  const [resellerFilter, setResellerFilter] = reactExports.useState("");
  const [closeDateFrom, setCloseDateFrom] = reactExports.useState("");
  const [closeDateTo, setCloseDateTo] = reactExports.useState("");
  const [selectedDeal, setSelectedDeal] = reactExports.useState(
    null
  );
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [calcOpenForDeal, setCalcOpenForDeal] = reactExports.useState(null);
  const refreshDuplicateQueue = reactExports.useCallback(async () => {
    if (!actor || !isVendor()) return;
    setDupLoading(true);
    try {
      const queue = await actor.getDuplicateDRQueue();
      setDuplicateQueue(queue);
    } catch {
    } finally {
      setDupLoading(false);
    }
  }, [actor, isVendor]);
  reactExports.useEffect(() => {
    if (actor && isVendor()) refreshDuplicateQueue();
  }, [actor, isVendor, refreshDuplicateQueue]);
  const duplicateDRIds = reactExports.useMemo(
    () => new Set(duplicateQueue.map((r) => r.newDRId)),
    [duplicateQueue]
  );
  const pendingDupCount = reactExports.useMemo(
    () => duplicateQueue.filter(
      (r) => r.status === DuplicateDRStatus.PendingVendorReview
    ).length,
    [duplicateQueue]
  );
  const stalledDealCount = reactExports.useMemo(
    () => dealRegistrations.filter((d) => d.status === DealStatus.UnderReview).length,
    [dealRegistrations]
  );
  function toggleStatus(s) {
    setStatusFilters((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }
  const resellers = reactExports.useMemo(() => {
    const ids = new Set(
      dealRegistrations.map((d) => d.resellerId).filter(Boolean)
    );
    return Array.from(ids);
  }, [dealRegistrations]);
  const filtered = reactExports.useMemo(() => {
    return dealRegistrations.filter((d) => {
      if (search) {
        const q = search.toLowerCase();
        const acc = accounts.find((a) => a.id === d.accountId);
        if (!d.opportunityName.toLowerCase().includes(q) && !(acc == null ? void 0 : acc.accountName.toLowerCase().includes(q)))
          return false;
      }
      if (statusFilters.size > 0 && !statusFilters.has(d.status)) return false;
      if (resellerFilter && d.resellerId !== resellerFilter) return false;
      if (closeDateFrom) {
        const from = new Date(closeDateFrom).getTime() * 1e6;
        if (Number(d.closeDate) < from) return false;
      }
      if (closeDateTo) {
        const to = new Date(closeDateTo).getTime() * 1e6;
        if (Number(d.closeDate) > to) return false;
      }
      return true;
    });
  }, [
    dealRegistrations,
    accounts,
    search,
    statusFilters,
    resellerFilter,
    closeDateFrom,
    closeDateTo
  ]);
  const handleStatusChange = reactExports.useCallback(
    async (id, status) => {
      if (!actor) return;
      try {
        const result = await actor.updateDealStatus(id, status);
        if (result.__kind__ === "err") {
          ue.error(result.err);
          return;
        }
        ue.success(`Status updated to ${dealStatusLabel(status)}`);
        await refreshDealRegistrations();
        setSelectedDeal(
          (prev) => (prev == null ? void 0 : prev.id) === id ? { ...prev, status } : prev
        );
      } catch {
        ue.error("Failed to update status");
      }
    },
    [actor, refreshDealRegistrations]
  );
  const totalValue = reactExports.useMemo(
    () => filtered.reduce((sum, d) => sum + d.estimatedValue, 0),
    [filtered]
  );
  const underReviewDeals = reactExports.useMemo(
    () => dealRegistrations.filter((d) => d.status === DealStatus.UnderReview),
    [dealRegistrations]
  );
  const accountsArr = reactExports.useMemo(
    () => accounts.map((a) => ({
      id: a.id,
      accountName: a.accountName,
      customerDomain: a.customerDomain
    })),
    [accounts]
  );
  const tableDeals = activeTab === "under_review" ? underReviewDeals : filtered;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 fade-in", "data-ocid": "deal_registrations.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground font-display", children: "Deal Registrations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          filtered.length,
          " deal",
          filtered.length !== 1 ? "s" : "",
          " ·",
          " ",
          formatCurrency(totalValue),
          " total pipeline",
          isVendor() && pendingDupCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 inline-flex items-center gap-1 text-orange-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 11 }),
            pendingDupCount,
            " duplicate",
            pendingDupCount !== 1 ? "s" : "",
            " ",
            "awaiting review"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "deal_reg.new_deal_button",
          onClick: () => setShowCreate(true),
          className: "text-white flex-shrink-0 bg-orange-500",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "mr-1.5" }),
            " New Deal"
          ]
        }
      )
    ] }),
    isVendor() && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center gap-1 border-b border-border",
        "data-ocid": "deal_reg.tabs",
        children: [
          {
            id: "all",
            label: "All Deals",
            count: dealRegistrations.length,
            alert: false
          },
          {
            id: "under_review",
            label: "Under Review",
            count: underReviewDeals.length,
            alert: false
          },
          {
            id: "duplicate_queue",
            label: "Duplicate Queue",
            count: pendingDupCount,
            alert: pendingDupCount > 0
          }
        ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": `deal_reg.tab.${tab.id}`,
            onClick: () => setActiveTab(tab.id),
            className: `flex items-center gap-1.5 text-xs px-4 py-2.5 border-b-2 transition-colors ${activeTab === tab.id ? "border-accent text-accent font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"}`,
            children: [
              tab.label,
              tab.count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold px-1 ${tab.alert ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "bg-secondary/60 text-muted-foreground"}`,
                  children: tab.count
                }
              )
            ]
          },
          tab.id
        ))
      }
    ),
    isVendor() && activeTab === "duplicate_queue" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DuplicateQueue,
      {
        records: duplicateQueue,
        allDeals: dealRegistrations,
        accounts,
        loading: dupLoading,
        onRefresh: async () => {
          await Promise.all([
            refreshDuplicateQueue(),
            refreshDealRegistrations()
          ]);
        }
      }
    ),
    activeTab !== "duplicate_queue" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Search,
            {
              size: 13,
              className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "deal_reg.search_input",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              placeholder: "Search by opportunity or account…",
              className: "crm-input pl-8 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            "data-ocid": "deal_reg.reseller.select",
            value: resellerFilter,
            onChange: (e) => setResellerFilter(e.target.value),
            className: "crm-input px-3 py-2 text-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Resellers" }),
              resellers.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r, children: r }, r))
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Close date:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "date",
            "data-ocid": "deal_reg.close_from.input",
            value: closeDateFrom,
            onChange: (e) => setCloseDateFrom(e.target.value),
            className: "crm-input text-xs w-36"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "to" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "date",
            "data-ocid": "deal_reg.close_to.input",
            value: closeDateTo,
            onChange: (e) => setCloseDateTo(e.target.value),
            className: "crm-input text-xs w-36"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
        ALL_STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": `deal_reg.filter_${s.toLowerCase()}.toggle`,
            onClick: () => toggleStatus(s),
            className: `text-xs px-2.5 py-1 rounded-full border transition-colors ${statusFilters.has(s) ? `${STATUS_PILL_COLORS[s]} border-transparent` : "border-border text-muted-foreground hover:border-accent/50"}`,
            children: dealStatusLabel(s)
          },
          s
        )),
        statusFilters.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "deal_reg.clear_filters.button",
            onClick: () => setStatusFilters(/* @__PURE__ */ new Set()),
            className: "text-xs px-2 py-1 text-muted-foreground hover:text-foreground flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 10 }),
              " Clear"
            ]
          }
        )
      ] })
    ] }),
    showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4",
        "data-ocid": "deal_reg.create.dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 fade-in scrollbar-thin", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-foreground", children: "New Deal Registration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "deal_reg.create.close_button",
                onClick: () => setShowCreate(false),
                className: "p-1.5 rounded-md hover:bg-secondary/40 text-muted-foreground",
                "aria-label": "Close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 15 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DealForm,
            {
              accounts: accountsArr,
              onClose: () => setShowCreate(false),
              onSaved: refreshDealRegistrations
            }
          )
        ] })
      }
    ),
    activeTab !== "duplicate_queue" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card overflow-hidden", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)) }) : tableDeals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-16 px-6",
        "data-ocid": "deal_reg.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { size: 40, className: "text-muted-foreground mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground mb-1", children: activeTab === "under_review" ? "No deals under review" : "No deal registrations found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6 text-center max-w-sm", children: dealRegistrations.length === 0 ? "Create your first deal registration to track partner opportunities." : "Adjust your filters or search to see more results." }),
          dealRegistrations.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "deal_reg.empty.create_button",
              onClick: () => setShowCreate(true),
              style: { background: "#FF6B2B" },
              className: "text-white",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "mr-1.5" }),
                " Create Deal Registration"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
        "Opportunity",
        "Account",
        "Reseller",
        "Value",
        "Close Date",
        "Status",
        "Vendor Owner",
        "Submitted",
        "Actions"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: tableDeals.map((d, i) => {
        var _a;
        const acc = accounts.find((a) => a.id === d.accountId);
        const isDup = duplicateDRIds.has(d.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `deal_reg.item.${i + 1}`,
            onClick: () => setSelectedDeal(d),
            onKeyDown: (e) => e.key === "Enter" && setSelectedDeal(d),
            tabIndex: 0,
            className: `border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer${isDup ? " bg-orange-500/5" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 font-medium text-foreground max-w-[160px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold bg-orange-500/15 text-orange-500", children: ((_a = d.opportunityName[0]) == null ? void 0 : _a.toUpperCase()) ?? "D" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[120px]", children: d.opportunityName })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ClickableAccountName,
                {
                  accountName: (acc == null ? void 0 : acc.accountName) ?? d.accountId.slice(0, 8),
                  accountId: d.accountId,
                  context: "deal-registration",
                  className: "text-muted-foreground"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 text-muted-foreground", children: d.resellerId || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 text-foreground font-mono text-xs", children: formatCurrency(d.estimatedValue) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 text-muted-foreground whitespace-nowrap", children: formatDate(d.closeDate) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5", children: isDup ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "inline-flex items-center gap-1 bg-orange-500/15 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-500/30",
                    title: "Duplicate registration — pending vendor review",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 8 }),
                      " Pending Vendor Review"
                    ]
                  }
                ),
                isVendor() && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 bg-orange-500/10 text-orange-400 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-orange-500/25", children: "DUPLICATE" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: dealStatusColor(d.status), children: dealStatusLabel(d.status) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 text-muted-foreground", children: d.vendorOwnerId || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 text-muted-foreground whitespace-nowrap", children: d.submittedDate ? formatDate(d.submittedDate) : "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    setCalcOpenForDeal(d.id);
                  },
                  className: "p-1.5 rounded text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors",
                  title: "Price Calculator",
                  type: "button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, { size: 14 })
                }
              ) })
            ]
          },
          d.id
        );
      }) })
    ] }) }) }),
    activeTab !== "duplicate_queue" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DealIntelligencePanel,
      {
        selectedDealId: (selectedDeal == null ? void 0 : selectedDeal.id) ?? null,
        totalActive: dealRegistrations.length,
        stalledCount: stalledDealCount,
        duplicateCount: pendingDupCount
      }
    ),
    calcOpenForDeal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-y-0 right-0 w-[600px] bg-slate-900 border-l border-slate-700 z-50 flex flex-col shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border-b border-slate-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-white font-semibold", children: "Price Calculator" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setCalcOpenForDeal(null),
            className: "text-slate-400 hover:text-white",
            type: "button",
            children: "✕"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PriceCalculator, { readOnly: false }) })
    ] }),
    selectedDeal && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "fixed inset-0 bg-black/40 z-40",
          onClick: () => setSelectedDeal(null),
          onKeyDown: (e) => e.key === "Escape" && setSelectedDeal(null),
          "aria-hidden": "true"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DetailPanel,
        {
          deal: selectedDeal,
          onClose: () => setSelectedDeal(null),
          onStatusChange: handleStatusChange,
          isVendor: isVendor()
        }
      )
    ] })
  ] });
}
export {
  DealRegistrations
};
