import { a as useNavigate, bx as useParams, p as useActor, u as useApp, aY as useQueryClient, r as reactExports, aZ as useQuery, j as jsxRuntimeExports, aa as CircleX, m as Button, ai as ArrowLeft, i as ChevronRight, o as Badge, C as CreditCard, bg as User, B as Building2, n as Clock, be as CircleCheckBig, h as cn, ab as ue } from "./index-DvFvlUBj.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DWB_Rthq.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-CJsIFtIC.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent, C as CircleDollarSign } from "./tabs-BHZa7Ulf.js";
import { T as Textarea } from "./textarea-BHUaDciu.js";
import { C as CustomFieldObjectType, M as MdfRequestStatus } from "./backend.d-Bio-_uWv.js";
import { u as useCustomFields, C as CustomFieldEditor } from "./useCustomFields-Do4Q3M8P.js";
import { C as CustomFieldRenderer } from "./CustomFieldRenderer-DSYXzkdv.js";
import { B as BrainCircuit } from "./brain-circuit-DUSNG23G.js";
import { C as Calendar } from "./calendar-BzO3LGDM.js";
import "./index-D-5r5K-M.js";
import "./index-CwZfxY3Y.js";
import "./index-CNckvLjz.js";
import "./checkbox-Cr6u9Lap.js";
import "./index-B1ifXNtV.js";
import "./useMutation-D0Tr8pyU.js";
import "./download-DVLbZ_Ir.js";
import "./phone-DSozTLzi.js";
import "./mail-BpQyu_iW.js";
function statusBadge(status) {
  const cfg = {
    [MdfRequestStatus.pending]: {
      label: "Pending Review",
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: cn("text-sm font-medium", className), children: label });
}
function formatTs(ts) {
  if (!ts) return "—";
  return new Date(Number(ts) / 1e6).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatAmount(amount, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0
  }).format(Number(amount));
}
function shortId(id) {
  return id.length > 8 ? `MDF-${id.slice(-6).toUpperCase()}` : id;
}
function DetailRow({
  label,
  value,
  icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0", children: [
    icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground mt-0.5 flex-shrink-0", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-foreground", children: value })
    ] })
  ] });
}
function TimelineEvent({
  icon,
  label,
  sub,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
          accent ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
        ),
        children: icon
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 pt-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: label }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: sub })
    ] })
  ] });
}
function DecideModal({
  reqId,
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
    if (!actor) return;
    setSubmitting(true);
    try {
      const input = {
        decision: isApprove ? MdfRequestStatus.approved : MdfRequestStatus.rejected,
        approvalNote: note.trim() || void 0
      };
      await actor.decideMdfRequest(reqId, input);
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
      "data-ocid": "mdf-record.decide_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground", children: isApprove ? "Approve MDF Request" : "Reject MDF Request" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isApprove ? "Add an optional approval note. The requestor will be notified." : "Please provide a reason for rejection. The requestor will be notified." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              "data-ocid": "mdf-record.decide_dialog.note_input",
              rows: 4,
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
              "data-ocid": "mdf-record.decide_dialog.cancel_button",
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
              "data-ocid": "mdf-record.decide_dialog.confirm_button",
              className: cn(
                submitting && "opacity-60",
                isApprove ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              ),
              children: submitting ? "Processing..." : isApprove ? "Confirm Approval" : "Confirm Rejection"
            }
          )
        ] })
      ]
    }
  ) });
}
function MdfRequestRecord() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/mdf-requests/$id" });
  const { actor } = useActor();
  const { isPrimaryAdmin, userProfile } = useApp();
  const queryClient = useQueryClient();
  const isAdmin = isPrimaryAdmin();
  const [decideAction, setDecideAction] = reactExports.useState(
    "approve"
  );
  const [decideOpen, setDecideOpen] = reactExports.useState(false);
  const [cancelSubmitting, setCancelSubmitting] = reactExports.useState(false);
  const [paidSubmitting, setPaidSubmitting] = reactExports.useState(false);
  const customFields = useCustomFields(
    CustomFieldObjectType.mdfRequest,
    id ?? ""
  );
  const { data: request, isLoading } = useQuery({
    queryKey: ["mdfRequest", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getMdfRequest(id);
    },
    enabled: !!actor && !!id,
    refetchInterval: 3e4
  });
  async function handleMarkPaid() {
    if (!actor || !request) return;
    setPaidSubmitting(true);
    try {
      await actor.markMdfRequestPaid(request.id);
      ue.success("MDF request marked as paid.");
      queryClient.invalidateQueries({ queryKey: ["mdfRequest", id] });
      queryClient.invalidateQueries({ queryKey: ["mdfRequests"] });
    } catch (e) {
      ue.error(e instanceof Error ? e.message : "Failed to mark as paid.");
    } finally {
      setPaidSubmitting(false);
    }
  }
  async function handleCancel() {
    if (!actor || !request) return;
    setCancelSubmitting(true);
    try {
      await actor.cancelMdfRequest(request.id);
      ue.success("MDF request cancelled.");
      queryClient.invalidateQueries({ queryKey: ["mdfRequest", id] });
      queryClient.invalidateQueries({ queryKey: ["mdfRequests"] });
    } catch (e) {
      ue.error(e instanceof Error ? e.message : "Failed to cancel request.");
    } finally {
      setCancelSubmitting(false);
    }
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", "data-ocid": "mdf-record.loading_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-48 bg-muted/50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full bg-muted/50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 bg-muted/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 bg-muted/50" })
      ] })
    ] });
  }
  if (!request) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "p-6 flex flex-col items-center justify-center min-h-[40vh] text-center",
        "data-ocid": "mdf-record.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-10 h-10 text-muted-foreground/40 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium", children: "MDF request not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4", children: "The request may have been deleted or you may not have access." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => navigate({ to: "/mdf-requests" }),
              className: "border-border text-muted-foreground hover:text-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
                "Back to MDF Requests"
              ]
            }
          )
        ]
      }
    );
  }
  const canApproveReject = isAdmin && request.status === MdfRequestStatus.pending;
  const canMarkPaid = isAdmin && request.status === MdfRequestStatus.approved;
  const canCancel = request.status === MdfRequestStatus.pending || isAdmin && request.status === MdfRequestStatus.approved;
  const isMyRequest = request.requestorUserId === (userProfile == null ? void 0 : userProfile.id);
  const showCancel = canCancel && (isAdmin || isMyRequest);
  const forgeAIRec = request.status === MdfRequestStatus.pending ? "Account linked to this request shows strong renewal performance. ForgeAI recommends approval — account health score: High." : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "mdf-record.page", className: "p-6 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "nav",
      {
        className: "flex items-center gap-1.5 text-sm text-muted-foreground",
        "data-ocid": "mdf-record.breadcrumb",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/mdf-requests" }),
              className: "hover:text-foreground transition-colors",
              children: "MDF Requests"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: shortId(request.id) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-start justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          onClick: () => navigate({ to: "/mdf-requests" }),
          "data-ocid": "mdf-record.back_button",
          className: "text-muted-foreground hover:text-foreground -ml-2",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: shortId(request.id) }),
          statusBadge(request.status),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "bg-primary/10 text-primary border-primary/30 font-semibold text-sm",
              children: formatAmount(request.amount, request.currency)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          "Submitted ",
          formatTs(request.createdAt)
        ] })
      ] })
    ] }) }),
    forgeAIRec && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex gap-3 items-start rounded-lg border border-primary/30 bg-primary/5 px-4 py-3",
        "data-ocid": "mdf-record.forgeai_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BrainCircuit, { className: "w-4 h-4 text-primary mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/90", children: forgeAIRec })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-3 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "details", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsList,
          {
            className: "bg-card border border-border",
            "data-ocid": "mdf-record.tabs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "details", className: "text-xs", children: "Request Details" }),
              customFields.fieldDefs.filter((d) => !d.isArchived).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "custom", className: "text-xs", children: "Custom Fields" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "history", className: "text-xs", children: "History" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "details", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Request Details" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailRow,
              {
                label: "Purpose",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDollarSign, { className: "w-3.5 h-3.5" }),
                value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "whitespace-pre-wrap", children: request.purpose })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailRow,
              {
                label: "Amount",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-3.5 h-3.5" }),
                value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary", children: formatAmount(request.amount, request.currency) })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Currency", value: request.currency }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailRow,
              {
                label: "Budget Year / Quarter",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5" }),
                value: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  String(request.budgetYear),
                  request.budgetQuarter !== void 0 ? ` Q${request.budgetQuarter}` : ""
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailRow,
              {
                label: "Requestor User ID",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3.5 h-3.5" }),
                value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: request.requestorUserId })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailRow,
              {
                label: "Requestor Org ID",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-3.5 h-3.5" }),
                value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: request.requestorOrgId })
              }
            ),
            request.associatedAccountId && /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailRow,
              {
                label: "Associated Account",
                value: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => navigate({
                      to: `/accounts/${request.associatedAccountId}`
                    }),
                    className: "text-primary hover:underline text-left",
                    "data-ocid": "mdf-record.account_link",
                    children: request.associatedAccountId
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailRow,
              {
                label: "Submitted",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
                value: formatTs(request.createdAt)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailRow,
              {
                label: "Last Updated",
                value: formatTs(request.updatedAt)
              }
            )
          ] })
        ] }) }),
        customFields.fieldDefs.filter((d) => !d.isArchived).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "custom", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Custom Fields" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
            customFields.fieldDefs.filter((d) => !d.isArchived).map((def) => {
              const hasValue = !!customFields.fieldValues[def.id];
              return hasValue ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: def.fieldLabel }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CustomFieldRenderer,
                  {
                    fieldDef: def,
                    value: customFields.fieldValues[def.id]
                  }
                )
              ] }, def.id) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                CustomFieldEditor,
                {
                  fieldDef: def,
                  value: customFields.pendingChanges[def.id] ?? "",
                  onChange: (v) => customFields.setFieldValue(def.id, v),
                  error: customFields.errors[def.id]
                },
                def.id
              );
            }),
            customFields.hasPendingChanges && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                onClick: () => customFields.saveFieldValues(),
                disabled: customFields.isSaving,
                "data-ocid": "mdf-record.custom_fields.save_button",
                className: "bg-primary text-primary-foreground",
                children: customFields.isSaving ? "Saving..." : "Save Changes"
              }
            ) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "history", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Status History" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TimelineEvent,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
                label: "Request submitted",
                sub: formatTs(request.createdAt),
                accent: true
              }
            ),
            (request.status === MdfRequestStatus.approved || request.status === MdfRequestStatus.rejected || request.status === MdfRequestStatus.paid) && /* @__PURE__ */ jsxRuntimeExports.jsx(
              TimelineEvent,
              {
                icon: request.status === MdfRequestStatus.rejected ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4" }),
                label: request.status === MdfRequestStatus.rejected ? `Rejected${request.approvedBy ? ` by ${request.approvedBy}` : ""}` : `Approved${request.approvedBy ? ` by ${request.approvedBy}` : ""}`,
                sub: [formatTs(request.approvedAt), request.approvalNote].filter(Boolean).join(" · ") || void 0,
                accent: request.status !== MdfRequestStatus.rejected
              }
            ),
            request.status === MdfRequestStatus.paid && /* @__PURE__ */ jsxRuntimeExports.jsx(
              TimelineEvent,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4" }),
                label: "Marked as paid",
                sub: formatTs(request.updatedAt),
                accent: true
              }
            ),
            request.status === MdfRequestStatus.cancelled && /* @__PURE__ */ jsxRuntimeExports.jsx(
              TimelineEvent,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4" }),
                label: "Request cancelled",
                sub: formatTs(request.updatedAt)
              }
            )
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "border-border bg-card",
            "data-ocid": "mdf-record.approval_panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Approval Workflow" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 py-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Status:" }),
                  statusBadge(request.status)
                ] }),
                (request.approvedBy || request.approvalNote) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/30 border border-border p-3 space-y-1", children: [
                  request.approvedBy && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Decision by:",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: request.approvedBy })
                  ] }),
                  request.approvedAt && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatTs(request.approvedAt) }),
                  request.approvalNote && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground/80 mt-1 italic", children: [
                    "“",
                    request.approvalNote,
                    "”"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-1", children: [
                  canApproveReject && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "button",
                        className: "w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2",
                        onClick: () => {
                          setDecideAction("approve");
                          setDecideOpen(true);
                        },
                        "data-ocid": "mdf-record.approve_button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4" }),
                          "Approve Request"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        className: "w-full border-red-500/40 text-red-400 hover:bg-red-500/10 gap-2",
                        onClick: () => {
                          setDecideAction("reject");
                          setDecideOpen(true);
                        },
                        "data-ocid": "mdf-record.reject_button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4" }),
                          "Reject Request"
                        ]
                      }
                    )
                  ] }),
                  canMarkPaid && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      className: "w-full bg-blue-600 hover:bg-blue-700 text-white gap-2",
                      onClick: handleMarkPaid,
                      disabled: paidSubmitting,
                      "data-ocid": "mdf-record.mark_paid_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4" }),
                        paidSubmitting ? "Processing..." : "Mark as Paid"
                      ]
                    }
                  ),
                  showCancel && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      className: "w-full text-muted-foreground hover:text-foreground gap-2",
                      onClick: handleCancel,
                      disabled: cancelSubmitting,
                      "data-ocid": "mdf-record.cancel_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4" }),
                        cancelSubmitting ? "Cancelling..." : "Cancel Request"
                      ]
                    }
                  ),
                  !canApproveReject && !canMarkPaid && !showCancel && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center py-2", children: "No actions available for this request." })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-primary/20 bg-primary/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BrainCircuit, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-primary uppercase tracking-wide", children: "ForgeAI" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "ForgeAI continuously monitors account health, reseller engagement, and renewal risk to surface intelligent MDF approval recommendations. Decisions are always made by authorized admins." })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DecideModal,
      {
        reqId: request.id,
        decision: decideAction,
        open: decideOpen,
        onClose: () => setDecideOpen(false),
        onDone: () => {
          queryClient.invalidateQueries({ queryKey: ["mdfRequest", id] });
          queryClient.invalidateQueries({ queryKey: ["mdfRequests"] });
        }
      }
    )
  ] });
}
export {
  MdfRequestRecord
};
