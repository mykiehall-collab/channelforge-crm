import { c as createLucideIcon, p as useActor, u as useApp, aY as useQueryClient, r as reactExports, aZ as useQuery, j as jsxRuntimeExports, m as Button, a8 as Plus, n as Clock, be as CircleCheckBig, aa as CircleX, h as cn, o as Badge, aF as Label, ad as Input, U as Users, N as MessageSquare, I as CircleAlert, J as CircleCheck, ab as ue } from "./index-DvFvlUBj.js";
import { C as Card, a as CardContent } from "./card-DWB_Rthq.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-CJsIFtIC.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D4bdvzsb.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { C as CircleDollarSign, T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHZa7Ulf.js";
import { T as Textarea } from "./textarea-BHUaDciu.js";
import { M as MdfRequestStatus, C as CustomFieldObjectType } from "./backend.d-Bio-_uWv.js";
import { u as useCustomFields, C as CustomFieldEditor } from "./useCustomFields-Do4Q3M8P.js";
import { B as BrainCircuit } from "./brain-circuit-DUSNG23G.js";
import { A as Activity } from "./activity-BzA2r-7b.js";
import { P as Pencil } from "./pencil-CSymqQ5s.js";
import { P as Paperclip } from "./paperclip-BcvCl5-v.js";
import "./index-D-5r5K-M.js";
import "./index-CwZfxY3Y.js";
import "./index-CNckvLjz.js";
import "./index-B1ifXNtV.js";
import "./checkbox-Cr6u9Lap.js";
import "./useMutation-D0Tr8pyU.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }]
];
const CircleMinus = createLucideIcon("circle-minus", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 13v8", key: "1l5pq0" }],
  ["path", { d: "M12 3v3", key: "1n5kay" }],
  [
    "path",
    {
      d: "M4 6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h13a2 2 0 0 0 1.152-.365l3.424-2.317a1 1 0 0 0 0-1.635l-3.424-2.318A2 2 0 0 0 17 6z",
      key: "1btarq"
    }
  ]
];
const Milestone = createLucideIcon("milestone", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M20 18v-2a4 4 0 0 0-4-4H4", key: "5vmcpk" }],
  ["path", { d: "m9 17-5-5 5-5", key: "nvlc11" }]
];
const Reply = createLucideIcon("reply", __iconNode);
function statusBadge(status) {
  const cfg = {
    [MdfRequestStatus.pending]: {
      label: "Pending",
      className: "bg-amber-500/15 text-amber-400 border-amber-500/30"
    },
    [MdfRequestStatus.approved]: {
      label: "Approved",
      className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
    },
    [MdfRequestStatus.rejected]: {
      label: "Rejected",
      className: "bg-[oklch(0.22_0.03_250)]/80 text-[oklch(0.58_0.02_250)] border-[oklch(0.28_0.03_250)]"
    },
    [MdfRequestStatus.paid]: {
      label: "Paid",
      className: "bg-blue-500/15 text-blue-400 border-blue-500/30"
    },
    [MdfRequestStatus.cancelled]: {
      label: "Cancelled",
      className: "bg-muted text-muted-foreground border-border"
    }
  };
  const { label, className } = cfg[status] ?? cfg[MdfRequestStatus.pending];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: cn("text-xs font-medium", className), children: label });
}
function formatAmount(amount, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0
  }).format(Number(amount));
}
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function shortId(id) {
  return id.length > 8 ? `MDF-${id.slice(-6).toUpperCase()}` : id;
}
function orgBadgeClass(orgType) {
  switch (orgType) {
    case "VENDOR":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "DISTRIBUTOR":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "RESELLER":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  }
}
function orgBorderClass(orgType) {
  switch (orgType) {
    case "VENDOR":
      return "border-l-blue-500";
    case "DISTRIBUTOR":
      return "border-l-purple-500";
    case "RESELLER":
      return "border-l-emerald-500";
  }
}
const MOCK_COMMENTS = [
  {
    id: "c1",
    orgType: "VENDOR",
    orgName: "Adobe",
    authorName: "Sarah Chen",
    text: "We've reviewed the campaign proposal and the ROI targets look achievable at 4.2x. Please proceed with the detailed budget breakdown and media plan.",
    timestamp: "2024-05-15T09:30:00Z"
  },
  {
    id: "c2",
    orgType: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    authorName: "Marcus Webb",
    text: "Budget breakdown attached. We're requesting an increase to £68,000 to cover additional digital channels and event sponsorships in Q3.",
    timestamp: "2024-05-15T11:45:00Z"
  },
  {
    id: "c3",
    orgType: "VENDOR",
    orgName: "Adobe",
    authorName: "Sarah Chen",
    text: "Approved the increase to £68,000. Please ensure the revised forecast reflects the additional pipeline expected from the digital expansion.",
    timestamp: "2024-05-16T08:20:00Z"
  },
  {
    id: "c4",
    orgType: "RESELLER",
    orgName: "Nordic Cloud Solutions",
    authorName: "Elena Berg",
    text: "Campaign creative assets are ready for review. We've aligned the messaging with the Nordic market positioning document shared last week.",
    timestamp: "2024-05-17T13:10:00Z"
  },
  {
    id: "c5",
    orgType: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    authorName: "Marcus Webb",
    text: "Creative looks strong. One minor change: please update the CTA to reflect the local language variant for Denmark and Sweden markets.",
    timestamp: "2024-05-17T15:30:00Z"
  },
  {
    id: "c6",
    orgType: "RESELLER",
    orgName: "Nordic Cloud Solutions",
    authorName: "Elena Berg",
    text: "Updated CTAs delivered. Also attaching the preliminary event attendee list — 240 confirmed registrations so far, targeting 350.",
    timestamp: "2024-05-18T09:00:00Z"
  },
  {
    id: "c7",
    orgType: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    authorName: "Marcus Webb",
    text: "Excellent registration numbers. I've updated the spend tracker. Current committed: £42,000 of £68,000. Remaining budget reserved for post-event nurture.",
    timestamp: "2024-05-20T10:15:00Z"
  },
  {
    id: "c8",
    orgType: "RESELLER",
    orgName: "Nordic Cloud Solutions",
    authorName: "Elena Berg",
    text: "Event completed successfully. Uploading evidence pack now: photos, attendee feedback scores (4.6/5), and lead scan reports.",
    timestamp: "2024-05-22T16:45:00Z"
  }
];
const MOCK_ACTIVITIES = [
  {
    id: "a1",
    orgType: "VENDOR",
    orgName: "Adobe",
    actorName: "Sarah Chen",
    action: "Created MDF request for Nordic Q3 Campaign",
    timestamp: "2024-05-10T14:00:00Z"
  },
  {
    id: "a2",
    orgType: "VENDOR",
    orgName: "Adobe",
    actorName: "Sarah Chen",
    action: "Submitted request for approval",
    timestamp: "2024-05-10T14:05:00Z"
  },
  {
    id: "a3",
    orgType: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    actorName: "Marcus Webb",
    action: "Requested budget increase from £55,000 to £68,000",
    timestamp: "2024-05-15T11:45:00Z"
  },
  {
    id: "a4",
    orgType: "VENDOR",
    orgName: "Adobe",
    actorName: "Sarah Chen",
    action: "Approved budget increase to £68,000",
    timestamp: "2024-05-16T08:20:00Z"
  },
  {
    id: "a5",
    orgType: "RESELLER",
    orgName: "Nordic Cloud Solutions",
    actorName: "Elena Berg",
    action: "Uploaded campaign evidence and ROI documentation",
    timestamp: "2024-05-22T16:45:00Z"
  },
  {
    id: "a6",
    orgType: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    actorName: "Marcus Webb",
    action: "Marked MDF request as complete and closed",
    timestamp: "2024-05-23T09:00:00Z"
  }
];
const MOCK_APPROVALS = [
  {
    orgType: "VENDOR",
    orgName: "Adobe",
    status: "Approved",
    approverName: "Sarah Chen",
    timestamp: "2024-05-16T08:20:00Z"
  },
  {
    orgType: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    status: "Pending"
  },
  {
    orgType: "RESELLER",
    orgName: "Nordic Cloud Solutions",
    status: "Not Required"
  }
];
const TIMELINE_MILESTONES = [
  {
    label: "Created",
    orgType: "VENDOR",
    orgName: "Adobe",
    done: true
  },
  {
    label: "Submitted",
    orgType: "VENDOR",
    orgName: "Adobe",
    done: true
  },
  {
    label: "Under Review",
    orgType: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    done: true
  },
  {
    label: "Approved",
    orgType: "VENDOR",
    orgName: "Adobe",
    done: true
  },
  {
    label: "Campaign Active",
    orgType: "RESELLER",
    orgName: "Nordic Cloud",
    done: true
  },
  {
    label: "Evidence Submitted",
    orgType: "RESELLER",
    orgName: "Nordic Cloud",
    done: true
  },
  {
    label: "Closed",
    orgType: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    done: true
  }
];
function StatCard({ label, value, sub, icon, accent }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: cn(
        "border-border bg-card",
        accent && "border-primary/40 bg-primary/5"
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
              accent ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
            ),
            children: icon
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "text-xl font-bold",
                accent ? "text-primary" : "text-foreground"
              ),
              children: value
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label }),
          sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground/70 mt-0.5", children: sub })
        ] })
      ] })
    }
  );
}
const CURRENCIES = ["EUR", "USD", "GBP", "JPY", "AUD", "CAD", "CHF"];
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
function NewMdfModal({
  open,
  onClose,
  onCreated
}) {
  const { actor } = useActor();
  const { companyProfile } = useApp();
  const [amount, setAmount] = reactExports.useState("");
  const [currency, setCurrency] = reactExports.useState("USD");
  const [purpose, setPurpose] = reactExports.useState("");
  const [budgetYear, setBudgetYear] = reactExports.useState(String(currentYear));
  const [budgetQuarter, setBudgetQuarter] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [errors, setErrors] = reactExports.useState({});
  const customFields = useCustomFields(
    CustomFieldObjectType.mdfRequest,
    "__new__"
  );
  async function handleSubmit() {
    const errs = {};
    if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0)
      errs.amount = "Please enter a valid amount.";
    if (!purpose.trim()) errs.purpose = "Purpose is required.";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const cfErrors = customFields.validateAll();
    if (Object.keys(cfErrors).length) return;
    setSubmitting(true);
    try {
      const vendorId = (companyProfile == null ? void 0 : companyProfile.vendorId) ?? (companyProfile == null ? void 0 : companyProfile.companyId) ?? "";
      await actor.createMdfRequest(vendorId, {
        amount: BigInt(Math.round(Number(amount))),
        currency,
        purpose: purpose.trim(),
        budgetYear: BigInt(Number(budgetYear)),
        budgetQuarter: budgetQuarter ? BigInt(budgetQuarter.replace("Q", "")) : void 0,
        associatedAccountId: void 0,
        vendorOwnerId: vendorId
      });
      ue.success("MDF request submitted successfully.");
      onCreated();
      onClose();
      setAmount("");
      setPurpose("");
      setBudgetYear(String(currentYear));
      setBudgetQuarter("");
      setErrors({});
    } catch (e) {
      ue.error(
        e instanceof Error ? e.message : "Failed to submit MDF request."
      );
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-xl bg-card border-border",
      "data-ocid": "mdf-requests.new_modal",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground text-lg font-semibold", children: "New MDF Request" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-1 max-h-[68vh] overflow-y-auto pr-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-muted-foreground text-xs mb-1 block", children: [
                "Amount ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "mdf-requests.amount_input",
                  type: "number",
                  min: "0",
                  placeholder: "50000",
                  value: amount,
                  onChange: (e) => {
                    setAmount(e.target.value);
                    setErrors((p) => ({ ...p, amount: "" }));
                  },
                  className: cn(
                    "bg-input border-border text-foreground",
                    errors.amount && "border-destructive"
                  )
                }
              ),
              errors.amount && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive text-xs mt-1", children: errors.amount })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-28", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground text-xs mb-1 block", children: "Currency" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: currency, onValueChange: setCurrency, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    "data-ocid": "mdf-requests.currency_select",
                    className: "bg-input border-border text-foreground",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border", children: CURRENCIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, className: "text-foreground", children: c }, c)) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-muted-foreground text-xs mb-1 block", children: [
              "Purpose ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                "data-ocid": "mdf-requests.purpose_input",
                rows: 3,
                placeholder: "Describe the marketing development activity...",
                value: purpose,
                onChange: (e) => {
                  setPurpose(e.target.value);
                  setErrors((p) => ({ ...p, purpose: "" }));
                },
                className: cn(
                  "bg-input border-border text-foreground resize-none",
                  errors.purpose && "border-destructive"
                )
              }
            ),
            errors.purpose && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive text-xs mt-1", children: errors.purpose })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground text-xs mb-1 block", children: "Budget Year" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: budgetYear, onValueChange: setBudgetYear, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    "data-ocid": "mdf-requests.budget_year_select",
                    className: "bg-input border-border text-foreground",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border", children: [currentYear, currentYear + 1].map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectItem,
                  {
                    value: String(y),
                    className: "text-foreground",
                    children: y
                  },
                  y
                )) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground text-xs mb-1 block", children: "Budget Quarter (optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: budgetQuarter, onValueChange: setBudgetQuarter, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    "data-ocid": "mdf-requests.budget_quarter_select",
                    className: "bg-input border-border text-foreground",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Any quarter" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-card border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "", className: "text-muted-foreground", children: "Any quarter" }),
                  QUARTERS.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: q, className: "text-foreground", children: q }, q))
                ] })
              ] })
            ] })
          ] }),
          customFields.fieldDefs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide", children: "Additional Fields" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: customFields.fieldDefs.filter((d) => !d.isArchived).map((def) => {
              var _a;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                CustomFieldEditor,
                {
                  fieldDef: def,
                  value: customFields.pendingChanges[def.id] ?? ((_a = customFields.fieldValues[def.id]) == null ? void 0 : _a.value) ?? "",
                  onChange: (v) => customFields.setFieldValue(def.id, v),
                  error: customFields.errors[def.id]
                },
                def.id
              );
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: onClose,
              "data-ocid": "mdf-requests.new_modal.cancel_button",
              className: "border-border text-muted-foreground hover:text-foreground",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: handleSubmit,
              disabled: submitting,
              "data-ocid": "mdf-requests.new_modal.submit_button",
              className: "bg-primary text-primary-foreground hover:bg-primary/90",
              children: submitting ? "Submitting..." : "Submit Request"
            }
          )
        ] })
      ]
    }
  ) });
}
function QuickDecideModal({
  request,
  decision,
  open,
  onClose,
  onDone
}) {
  const { actor } = useActor();
  const [note, setNote] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const isApprove = decision === "approve";
  async function handleDecide() {
    if (!request || !actor) return;
    setSubmitting(true);
    try {
      const input = {
        decision: isApprove ? MdfRequestStatus.approved : MdfRequestStatus.rejected,
        approvalNote: note.trim() || void 0
      };
      await actor.decideMdfRequest(request.id, input);
      ue.success(
        isApprove ? "MDF request approved." : "MDF request rejected."
      );
      onDone();
      onClose();
      setNote("");
    } catch (e) {
      ue.error(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-md bg-card border-border",
      "data-ocid": "mdf-requests.decide_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground", children: isApprove ? "Approve MDF Request" : "Reject MDF Request" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isApprove ? "Add an optional approval note before confirming." : "Please provide a reason for rejecting this request." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              "data-ocid": "mdf-requests.decide_dialog.note_input",
              rows: 3,
              placeholder: isApprove ? "Approval note (optional)" : "Rejection reason...",
              value: note,
              onChange: (e) => setNote(e.target.value),
              className: "bg-input border-border text-foreground resize-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: onClose,
              "data-ocid": "mdf-requests.decide_dialog.cancel_button",
              className: "border-border text-muted-foreground",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: handleDecide,
              disabled: submitting,
              "data-ocid": "mdf-requests.decide_dialog.confirm_button",
              className: cn(
                submitting && "opacity-60",
                isApprove ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              ),
              children: submitting ? "Processing..." : isApprove ? "Approve" : "Reject"
            }
          )
        ] })
      ]
    }
  ) });
}
function MdfDetailModal({
  request,
  open,
  onClose
}) {
  const [activeTab, setActiveTab] = reactExports.useState(
    "comments"
  );
  const [comments, setComments] = reactExports.useState(MOCK_COMMENTS);
  const [newComment, setNewComment] = reactExports.useState("");
  const maxChars = 2e3;
  const currentUserOrgType = "VENDOR";
  const currentUserOrgName = "Adobe";
  function handleAddComment() {
    if (!newComment.trim()) return;
    const comment = {
      id: `c${Date.now()}`,
      orgType: currentUserOrgType,
      orgName: currentUserOrgName,
      authorName: "You",
      text: newComment.trim(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      isOwn: true
    };
    setComments((prev) => [...prev, comment]);
    setNewComment("");
    ue.success("Comment added to thread.");
  }
  function formatTime(ts) {
    return new Date(ts).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  if (!request) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-4xl bg-card border-border max-h-[90vh] overflow-y-auto",
      "data-ocid": "mdf-requests.detail_modal",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-foreground text-lg font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDollarSign, { className: "w-5 h-5 text-primary" }),
          "MDF Request ",
          shortId(request.id)
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-lg p-3 border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground", children: formatAmount(request.amount, request.currency) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-lg p-3 border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: statusBadge(request.status) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-lg p-3 border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Budget Period" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-foreground", children: [
              String(request.budgetYear),
              request.budgetQuarter !== void 0 ? ` Q${request.budgetQuarter}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-lg p-3 border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Submitted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground", children: formatDate(request.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/20 rounded-lg p-3 border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Purpose" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: request.purpose })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-primary" }),
            "Collaboration"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Tabs,
            {
              value: activeTab,
              onValueChange: (v) => setActiveTab(v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-card border border-border mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "comments", className: "text-xs gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-3.5 h-3.5" }),
                    "Comments"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "activity", className: "text-xs gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-3.5 h-3.5" }),
                    "Activity"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "comments", className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 max-h-[320px] overflow-y-auto pr-1", children: comments.map((comment) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: cn(
                        "bg-card border border-border rounded-lg p-3 border-l-4",
                        orgBorderClass(comment.orgType)
                      ),
                      "data-ocid": `mdf-requests.comment.${comment.id}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              Badge,
                              {
                                variant: "outline",
                                className: cn(
                                  "text-[10px] font-bold uppercase tracking-wider",
                                  orgBadgeClass(comment.orgType)
                                ),
                                children: [
                                  "[",
                                  comment.orgType,
                                  "]"
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: comment.authorName }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: comment.orgName })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatTime(comment.timestamp) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/90 leading-relaxed", children: comment.text }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                          comment.isOwn && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Button,
                            {
                              type: "button",
                              variant: "ghost",
                              size: "sm",
                              className: "h-6 px-2 text-xs text-muted-foreground hover:text-foreground",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3 h-3 mr-1" }),
                                "Edit"
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Button,
                            {
                              type: "button",
                              variant: "ghost",
                              size: "sm",
                              className: "h-6 px-2 text-xs text-muted-foreground hover:text-foreground",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Reply, { className: "w-3 h-3 mr-1" }),
                                "Reply"
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Button,
                            {
                              type: "button",
                              variant: "ghost",
                              size: "sm",
                              className: "h-6 px-2 text-xs text-muted-foreground hover:text-foreground",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "w-3 h-3 mr-1" }),
                                "Attach"
                              ]
                            }
                          )
                        ] })
                      ]
                    },
                    comment.id
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3 space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg bg-blue-500/5 border border-blue-500/20 px-3 py-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-blue-300", children: [
                        "Your comment will be tagged as [",
                        currentUserOrgType,
                        "]. All linked organisations with MDF access will see this."
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Textarea,
                      {
                        "data-ocid": "mdf-requests.comment_input",
                        rows: 3,
                        placeholder: "Add a comment to the thread...",
                        value: newComment,
                        onChange: (e) => setNewComment(e.target.value),
                        className: "bg-input border-border text-foreground resize-none"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: cn(
                            "text-xs",
                            newComment.length > maxChars ? "text-destructive" : "text-muted-foreground"
                          ),
                          children: [
                            newComment.length,
                            "/",
                            maxChars
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          type: "button",
                          onClick: handleAddComment,
                          disabled: !newComment.trim() || newComment.length > maxChars,
                          "data-ocid": "mdf-requests.add_comment_button",
                          className: "bg-primary text-primary-foreground hover:bg-primary/90 gap-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                            "Add to thread"
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Milestone, { className: "w-3.5 h-3.5" }),
                      "Shared Timeline"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 overflow-x-auto pb-2", children: TIMELINE_MILESTONES.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex items-center flex-shrink-0",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center min-w-[100px]", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center border-2 mb-1",
                                  m.done ? "bg-primary/20 border-primary text-primary" : "bg-muted border-border text-muted-foreground"
                                ),
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" })
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-foreground", children: m.label }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              Badge,
                              {
                                variant: "outline",
                                className: cn(
                                  "text-[9px] mt-0.5",
                                  orgBadgeClass(m.orgType)
                                ),
                                children: [
                                  "[",
                                  m.orgType,
                                  "] ",
                                  m.orgName
                                ]
                              }
                            )
                          ] }),
                          i < TIMELINE_MILESTONES.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-0.5 bg-border flex-shrink-0 mb-4" })
                        ]
                      },
                      m.label
                    )) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
                      "Joint Approvals"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/20", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase", children: "Organisation" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase", children: "Type" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase", children: "Status" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase", children: "Approver" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase", children: "Date" })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: MOCK_APPROVALS.map((appr, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "tr",
                        {
                          "data-ocid": `mdf-requests.approval_row.${idx + 1}`,
                          className: cn(
                            "border-b border-border/50",
                            appr.status === "Not Required" && "opacity-50 bg-muted/10"
                          ),
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-foreground font-medium", children: appr.orgName }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              Badge,
                              {
                                variant: "outline",
                                className: cn(
                                  "text-[10px]",
                                  orgBadgeClass(appr.orgType)
                                ),
                                children: [
                                  "[",
                                  appr.orgType,
                                  "]"
                                ]
                              }
                            ) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2", children: [
                              appr.status === "Approved" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-emerald-400 text-xs", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
                                "Approved"
                              ] }),
                              appr.status === "Pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-amber-400 text-xs", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
                                "Pending"
                              ] }),
                              appr.status === "Not Required" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-muted-foreground text-xs", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleMinus, { className: "w-3.5 h-3.5" }),
                                "Not Required"
                              ] })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground text-xs", children: appr.approverName || "—" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground text-xs", children: appr.timestamp ? formatTime(appr.timestamp) : "—" })
                          ]
                        },
                        appr.orgName
                      )) })
                    ] }) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "activity", className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: MOCK_ACTIVITIES.map((act) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: cn(
                      "flex items-start gap-3 bg-card border border-border rounded-lg p-3 border-l-4",
                      orgBorderClass(act.orgType)
                    ),
                    "data-ocid": `mdf-requests.activity.${act.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border",
                            orgBadgeClass(act.orgType)
                          ),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-3.5 h-3.5" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              Badge,
                              {
                                variant: "outline",
                                className: cn(
                                  "text-[10px]",
                                  orgBadgeClass(act.orgType)
                                ),
                                children: [
                                  "[",
                                  act.orgType,
                                  "]"
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: act.actorName }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: act.orgName })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatTime(act.timestamp) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80", children: act.action })
                      ] })
                    ]
                  },
                  act.id
                )) }) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: onClose,
            "data-ocid": "mdf-requests.detail_modal.close_button",
            className: "border-border text-muted-foreground hover:text-foreground",
            children: "Close"
          }
        ) })
      ]
    }
  ) });
}
function MdfRequestsPage() {
  const { actor } = useActor();
  const { userProfile, companyProfile, isPrimaryAdmin } = useApp();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [showNew, setShowNew] = reactExports.useState(false);
  const [decideTarget, setDecideTarget] = reactExports.useState(null);
  const [decideAction, setDecideAction] = reactExports.useState(
    "approve"
  );
  const [decideOpen, setDecideOpen] = reactExports.useState(false);
  const [detailRequest, setDetailRequest] = reactExports.useState(null);
  const [detailOpen, setDetailOpen] = reactExports.useState(false);
  const isAdmin = isPrimaryAdmin();
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["mdfRequests"],
    queryFn: async () => {
      if (!actor) return [];
      const orgId = (companyProfile == null ? void 0 : companyProfile.companyId) ?? "";
      const role = (userProfile == null ? void 0 : userProfile.role) ?? "";
      return actor.listMdfRequestsForCaller(null, orgId, role, null, null);
    },
    enabled: !!actor,
    refetchInterval: 3e4
  });
  const totalAmount = requests.reduce((acc, r) => acc + Number(r.amount), 0);
  const pendingCount = requests.filter(
    (r) => r.status === MdfRequestStatus.pending
  ).length;
  const now = /* @__PURE__ */ new Date();
  const qtdApproved = requests.filter(
    (r) => r.status === MdfRequestStatus.approved && r.approvedAt && now.getFullYear() === new Date(Number(r.approvedAt) / 1e6).getFullYear() && Math.floor(now.getMonth() / 3) === Math.floor(new Date(Number(r.approvedAt) / 1e6).getMonth() / 3)
  );
  const qtdApprovedAmount = qtdApproved.reduce(
    (acc, r) => acc + Number(r.amount),
    0
  );
  const filtered = statusFilter === "all" ? requests : requests.filter((r) => r.status === statusFilter);
  const forgeRec = pendingCount > 0 ? `ForgeAI: ${pendingCount} pending MDF request${pendingCount !== 1 ? "s" : ""} awaiting review. High-health accounts detected in queue — recommend prioritising approvals.` : null;
  function openDecide(r, action) {
    setDecideTarget(r);
    setDecideAction(action);
    setDecideOpen(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "mdf-requests.page", className: "p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "MDF Requests" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Market Development Fund requests and approval workflow" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: () => setShowNew(true),
          "data-ocid": "mdf-requests.new_request_button",
          className: "bg-primary text-primary-foreground hover:bg-primary/90 gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "New MDF Request"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Requests",
          value: requests.length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDollarSign, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Requested",
          value: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
            maximumFractionDigits: 1
          }).format(totalAmount),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDollarSign, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Pending Approval",
          value: pendingCount,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
          accent: pendingCount > 0
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Approved This QTD",
          value: qtdApproved.length,
          sub: qtdApproved.length > 0 ? `$${(qtdApprovedAmount / 1e3).toFixed(0)}k total` : void 0,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4" })
        }
      )
    ] }),
    forgeRec && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex gap-3 items-start rounded-lg border border-primary/30 bg-primary/5 px-4 py-3",
        "data-ocid": "mdf-requests.forgeai_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BrainCircuit, { className: "w-4 h-4 text-primary mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/90", children: forgeRec })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Tabs,
        {
          value: statusFilter,
          onValueChange: (v) => setStatusFilter(v),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsList,
            {
              className: "bg-card border border-border",
              "data-ocid": "mdf-requests.filter.tab",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "all", className: "text-xs", children: "All" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: MdfRequestStatus.pending, className: "text-xs", children: "Pending" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: MdfRequestStatus.approved, className: "text-xs", children: "Approved" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: MdfRequestStatus.rejected, className: "text-xs", children: "Rejected" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: MdfRequestStatus.paid, className: "text-xs", children: "Paid" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: MdfRequestStatus.cancelled, className: "text-xs", children: "Cancelled" })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border bg-card overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "p-4 space-y-3",
          "data-ocid": "mdf-requests.loading_state",
          children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-muted/50" }, i))
        }
      ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-14 px-6 text-center",
          "data-ocid": "mdf-requests.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDollarSign, { className: "w-10 h-10 text-muted-foreground/40 mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium", children: statusFilter === "all" ? "No MDF requests yet" : `No ${statusFilter} requests` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: statusFilter === "all" ? "Submit your first Market Development Fund request to get started." : "Try a different status filter." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Request ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Purpose" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Budget Year" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Submitted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((req, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `mdf-requests.item.${idx + 1}`,
            className: "border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer",
            onClick: () => {
              setDetailRequest(req);
              setDetailOpen(true);
            },
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ") {
                setDetailRequest(req);
                setDetailOpen(true);
              }
            },
            tabIndex: 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs text-primary", children: shortId(req.id) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground truncate max-w-[220px]", children: req.purpose }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-semibold text-foreground", children: formatAmount(req.amount, req.currency) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: statusBadge(req.status) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-muted-foreground", children: [
                String(req.budgetYear),
                req.budgetQuarter !== void 0 ? ` Q${req.budgetQuarter}` : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: formatDate(req.createdAt) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "td",
                {
                  className: "px-4 py-3",
                  onClick: (e) => e.stopPropagation(),
                  onKeyDown: (e) => e.stopPropagation(),
                  children: [
                    isAdmin && req.status === MdfRequestStatus.pending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "button",
                          size: "sm",
                          onClick: () => openDecide(req, "approve"),
                          "data-ocid": `mdf-requests.approve_button.${idx + 1}`,
                          className: "h-7 px-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-600/30",
                          variant: "outline",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "button",
                          size: "sm",
                          onClick: () => openDecide(req, "reject"),
                          "data-ocid": `mdf-requests.reject_button.${idx + 1}`,
                          className: "h-7 px-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/30",
                          variant: "outline",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" })
                        }
                      )
                    ] }),
                    (!isAdmin || req.status !== MdfRequestStatus.pending) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        size: "sm",
                        variant: "ghost",
                        onClick: () => {
                          setDetailRequest(req);
                          setDetailOpen(true);
                        },
                        "data-ocid": `mdf-requests.view_button.${idx + 1}`,
                        className: "h-7 px-2 text-muted-foreground hover:text-foreground text-xs",
                        children: "View"
                      }
                    )
                  ]
                }
              )
            ]
          },
          req.id
        )) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NewMdfModal,
      {
        open: showNew,
        onClose: () => setShowNew(false),
        onCreated: () => queryClient.invalidateQueries({ queryKey: ["mdfRequests"] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      QuickDecideModal,
      {
        request: decideTarget,
        decision: decideAction,
        open: decideOpen,
        onClose: () => setDecideOpen(false),
        onDone: () => queryClient.invalidateQueries({ queryKey: ["mdfRequests"] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MdfDetailModal,
      {
        request: detailRequest,
        open: detailOpen,
        onClose: () => {
          setDetailOpen(false);
          setDetailRequest(null);
        }
      }
    )
  ] });
}
export {
  MdfRequestsPage
};
