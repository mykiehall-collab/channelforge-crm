import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BrainCircuit,
  Building2,
  Calendar,
  CheckCircle,
  ChevronRight,
  CircleDollarSign,
  Clock,
  CreditCard,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import { CustomFieldObjectType, MdfRequestStatus } from "../backend.d";
import type { MdfRequest, MdfRequestDecisionInput } from "../backend.d";
import { CustomFieldEditor } from "../components/CustomFieldEditor";
import { CustomFieldRenderer } from "../components/CustomFieldRenderer";
import { useActor } from "../hooks/useActor";
import { useCustomFields } from "../hooks/useCustomFields";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusBadge(status: MdfRequestStatus) {
  const cfg: Record<MdfRequestStatus, { label: string; className: string }> = {
    [MdfRequestStatus.pending]: {
      label: "Pending Review",
      className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    },
    [MdfRequestStatus.approved]: {
      label: "Approved",
      className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    },
    [MdfRequestStatus.rejected]: {
      label: "Rejected",
      className:
        "bg-[oklch(0.22_0.03_250)]/80 text-[oklch(0.58_0.02_250)] border-[oklch(0.28_0.03_250)]",
    },
    [MdfRequestStatus.paid]: {
      label: "Paid",
      className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    },
    [MdfRequestStatus.cancelled]: {
      label: "Cancelled",
      className: "bg-muted text-muted-foreground border-border",
    },
  };
  const { label, className } = cfg[status] ?? cfg[MdfRequestStatus.pending];
  return (
    <Badge variant="outline" className={cn("text-sm font-medium", className)}>
      {label}
    </Badge>
  );
}

function formatTs(ts: bigint | undefined) {
  if (!ts) return "—";
  return new Date(Number(ts) / 1_000_000).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(amount: bigint, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function shortId(id: string) {
  return id.length > 8 ? `MDF-${id.slice(-6).toUpperCase()}` : id;
}

// ─── Detail Row ───────────────────────────────────────────────────────────────

function DetailRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
      {icon && (
        <span className="text-muted-foreground mt-0.5 flex-shrink-0">
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <div className="text-sm text-foreground">{value}</div>
      </div>
    </div>
  );
}

// ─── Timeline event ───────────────────────────────────────────────────────────

function TimelineEvent({
  icon,
  label,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="flex gap-3 items-start">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
          accent
            ? "bg-primary/20 text-primary"
            : "bg-secondary text-muted-foreground",
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm text-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Decide Modal ─────────────────────────────────────────────────────────────

function DecideModal({
  reqId,
  decision,
  open,
  onClose,
  onDone,
}: {
  reqId: string;
  decision: "approve" | "reject";
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}) {
  const { actor } = useActor();
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isApprove = decision === "approve";

  async function handleDecide() {
    if (!actor) return;
    setSubmitting(true);
    try {
      const input: MdfRequestDecisionInput = {
        decision: isApprove
          ? MdfRequestStatus.approved
          : MdfRequestStatus.rejected,
        approvalNote: note.trim() || undefined,
      };
      await actor.decideMdfRequest(reqId, input);
      toast.success(
        isApprove ? "MDF request approved." : "MDF request rejected.",
      );
      onDone();
      onClose();
      setNote("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md bg-card border-border"
        data-ocid="mdf-record.decide_dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isApprove ? "Approve MDF Request" : "Reject MDF Request"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <p className="text-sm text-muted-foreground">
            {isApprove
              ? "Add an optional approval note. The requestor will be notified."
              : "Please provide a reason for rejection. The requestor will be notified."}
          </p>
          <Textarea
            data-ocid="mdf-record.decide_dialog.note_input"
            rows={4}
            placeholder={
              isApprove ? "Approval note (optional)" : "Rejection reason..."
            }
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-input border-border text-foreground resize-none"
          />
        </div>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-ocid="mdf-record.decide_dialog.cancel_button"
            className="border-border text-muted-foreground"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDecide}
            disabled={submitting}
            data-ocid="mdf-record.decide_dialog.confirm_button"
            className={cn(
              submitting && "opacity-60",
              isApprove
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
            )}
          >
            {submitting
              ? "Processing..."
              : isApprove
                ? "Confirm Approval"
                : "Confirm Rejection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Record Page ─────────────────────────────────────────────────────────

export function MdfRequestRecord() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/mdf-requests/$id" });
  const { actor } = useActor();
  const { isPrimaryAdmin, userProfile } = useApp();
  const queryClient = useQueryClient();
  const isAdmin = isPrimaryAdmin();

  const [decideAction, setDecideAction] = useState<"approve" | "reject">(
    "approve",
  );
  const [decideOpen, setDecideOpen] = useState(false);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [paidSubmitting, setPaidSubmitting] = useState(false);

  const customFields = useCustomFields(
    CustomFieldObjectType.mdfRequest,
    id ?? "",
  );

  const { data: request, isLoading } = useQuery<MdfRequest | null>({
    queryKey: ["mdfRequest", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getMdfRequest(id);
    },
    enabled: !!actor && !!id,
    refetchInterval: 30_000,
  });

  async function handleMarkPaid() {
    if (!actor || !request) return;
    setPaidSubmitting(true);
    try {
      await actor.markMdfRequestPaid(request.id);
      toast.success("MDF request marked as paid.");
      queryClient.invalidateQueries({ queryKey: ["mdfRequest", id] });
      queryClient.invalidateQueries({ queryKey: ["mdfRequests"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to mark as paid.");
    } finally {
      setPaidSubmitting(false);
    }
  }

  async function handleCancel() {
    if (!actor || !request) return;
    setCancelSubmitting(true);
    try {
      await actor.cancelMdfRequest(request.id);
      toast.success("MDF request cancelled.");
      queryClient.invalidateQueries({ queryKey: ["mdfRequest", id] });
      queryClient.invalidateQueries({ queryKey: ["mdfRequests"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to cancel request.");
    } finally {
      setCancelSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4" data-ocid="mdf-record.loading_state">
        <Skeleton className="h-6 w-48 bg-muted/50" />
        <Skeleton className="h-32 w-full bg-muted/50" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-64 bg-muted/50" />
          <Skeleton className="h-64 bg-muted/50" />
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div
        className="p-6 flex flex-col items-center justify-center min-h-[40vh] text-center"
        data-ocid="mdf-record.error_state"
      >
        <XCircle className="w-10 h-10 text-muted-foreground/40 mb-3" />
        <p className="text-foreground font-medium">MDF request not found</p>
        <p className="text-muted-foreground text-sm mb-4">
          The request may have been deleted or you may not have access.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/mdf-requests" })}
          className="border-border text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to MDF Requests
        </Button>
      </div>
    );
  }

  const canApproveReject =
    isAdmin && request.status === MdfRequestStatus.pending;
  const canMarkPaid = isAdmin && request.status === MdfRequestStatus.approved;
  const canCancel =
    request.status === MdfRequestStatus.pending ||
    (isAdmin && request.status === MdfRequestStatus.approved);
  const isMyRequest = request.requestorUserId === userProfile?.id;
  const showCancel = canCancel && (isAdmin || isMyRequest);

  // ForgeAI recommendation
  const forgeAIRec =
    request.status === MdfRequestStatus.pending
      ? "Account linked to this request shows strong renewal performance. ForgeAI recommends approval — account health score: High."
      : null;

  return (
    <div data-ocid="mdf-record.page" className="p-6 space-y-5">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-1.5 text-sm text-muted-foreground"
        data-ocid="mdf-record.breadcrumb"
      >
        <button
          type="button"
          onClick={() => navigate({ to: "/mdf-requests" })}
          className="hover:text-foreground transition-colors"
        >
          MDF Requests
        </button>
        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        <span className="text-foreground font-medium">
          {shortId(request.id)}
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/mdf-requests" })}
            data-ocid="mdf-record.back_button"
            className="text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">
                {shortId(request.id)}
              </h1>
              {statusBadge(request.status)}
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/30 font-semibold text-sm"
              >
                {formatAmount(request.amount, request.currency)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Submitted {formatTs(request.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* ForgeAI Panel */}
      {forgeAIRec && (
        <div
          className="flex gap-3 items-start rounded-lg border border-primary/30 bg-primary/5 px-4 py-3"
          data-ocid="mdf-record.forgeai_panel"
        >
          <BrainCircuit className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground/90">{forgeAIRec}</p>
        </div>
      )}

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left Panel — Request Details + Custom Fields */}
        <div className="lg:col-span-3 space-y-4">
          <Tabs defaultValue="details">
            <TabsList
              className="bg-card border border-border"
              data-ocid="mdf-record.tabs"
            >
              <TabsTrigger value="details" className="text-xs">
                Request Details
              </TabsTrigger>
              {customFields.fieldDefs.filter((d) => !d.isArchived).length >
                0 && (
                <TabsTrigger value="custom" className="text-xs">
                  Custom Fields
                </TabsTrigger>
              )}
              <TabsTrigger value="history" className="text-xs">
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-foreground">
                    Request Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-0">
                  <DetailRow
                    label="Purpose"
                    icon={<CircleDollarSign className="w-3.5 h-3.5" />}
                    value={
                      <span className="whitespace-pre-wrap">
                        {request.purpose}
                      </span>
                    }
                  />
                  <DetailRow
                    label="Amount"
                    icon={<CreditCard className="w-3.5 h-3.5" />}
                    value={
                      <span className="font-semibold text-primary">
                        {formatAmount(request.amount, request.currency)}
                      </span>
                    }
                  />
                  <DetailRow label="Currency" value={request.currency} />
                  <DetailRow
                    label="Budget Year / Quarter"
                    icon={<Calendar className="w-3.5 h-3.5" />}
                    value={
                      <>
                        {String(request.budgetYear)}
                        {request.budgetQuarter !== undefined
                          ? ` Q${request.budgetQuarter}`
                          : ""}
                      </>
                    }
                  />
                  <DetailRow
                    label="Requestor User ID"
                    icon={<User className="w-3.5 h-3.5" />}
                    value={
                      <span className="font-mono text-xs text-muted-foreground">
                        {request.requestorUserId}
                      </span>
                    }
                  />
                  <DetailRow
                    label="Requestor Org ID"
                    icon={<Building2 className="w-3.5 h-3.5" />}
                    value={
                      <span className="font-mono text-xs text-muted-foreground">
                        {request.requestorOrgId}
                      </span>
                    }
                  />
                  {request.associatedAccountId && (
                    <DetailRow
                      label="Associated Account"
                      value={
                        <button
                          type="button"
                          onClick={() =>
                            navigate({
                              to: `/accounts/${request.associatedAccountId}`,
                            })
                          }
                          className="text-primary hover:underline text-left"
                          data-ocid="mdf-record.account_link"
                        >
                          {request.associatedAccountId}
                        </button>
                      }
                    />
                  )}
                  <DetailRow
                    label="Submitted"
                    icon={<Clock className="w-3.5 h-3.5" />}
                    value={formatTs(request.createdAt)}
                  />
                  <DetailRow
                    label="Last Updated"
                    value={formatTs(request.updatedAt)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {customFields.fieldDefs.filter((d) => !d.isArchived).length > 0 && (
              <TabsContent value="custom">
                <Card className="border-border bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-foreground">
                      Custom Fields
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {customFields.fieldDefs
                      .filter((d) => !d.isArchived)
                      .map((def) => {
                        const hasValue = !!customFields.fieldValues[def.id];
                        return hasValue ? (
                          <div key={def.id} className="py-1">
                            <p className="text-xs text-muted-foreground mb-1">
                              {def.fieldLabel}
                            </p>
                            <CustomFieldRenderer
                              fieldDef={def}
                              value={customFields.fieldValues[def.id]}
                            />
                          </div>
                        ) : (
                          <CustomFieldEditor
                            key={def.id}
                            fieldDef={def}
                            value={customFields.pendingChanges[def.id] ?? ""}
                            onChange={(v) =>
                              customFields.setFieldValue(def.id, v)
                            }
                            error={customFields.errors[def.id]}
                          />
                        );
                      })}
                    {customFields.hasPendingChanges && (
                      <div className="pt-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => customFields.saveFieldValues()}
                          disabled={customFields.isSaving}
                          data-ocid="mdf-record.custom_fields.save_button"
                          className="bg-primary text-primary-foreground"
                        >
                          {customFields.isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="history">
              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-foreground">
                    Status History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Submitted */}
                  <TimelineEvent
                    icon={<Clock className="w-4 h-4" />}
                    label="Request submitted"
                    sub={formatTs(request.createdAt)}
                    accent
                  />
                  {/* Approved / Rejected */}
                  {(request.status === MdfRequestStatus.approved ||
                    request.status === MdfRequestStatus.rejected ||
                    request.status === MdfRequestStatus.paid) && (
                    <TimelineEvent
                      icon={
                        request.status === MdfRequestStatus.rejected ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )
                      }
                      label={
                        request.status === MdfRequestStatus.rejected
                          ? `Rejected${request.approvedBy ? ` by ${request.approvedBy}` : ""}`
                          : `Approved${request.approvedBy ? ` by ${request.approvedBy}` : ""}`
                      }
                      sub={
                        [formatTs(request.approvedAt), request.approvalNote]
                          .filter(Boolean)
                          .join(" · ") || undefined
                      }
                      accent={request.status !== MdfRequestStatus.rejected}
                    />
                  )}
                  {/* Paid */}
                  {request.status === MdfRequestStatus.paid && (
                    <TimelineEvent
                      icon={<CreditCard className="w-4 h-4" />}
                      label="Marked as paid"
                      sub={formatTs(request.updatedAt)}
                      accent
                    />
                  )}
                  {/* Cancelled */}
                  {request.status === MdfRequestStatus.cancelled && (
                    <TimelineEvent
                      icon={<XCircle className="w-4 h-4" />}
                      label="Request cancelled"
                      sub={formatTs(request.updatedAt)}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel — Approval Workflow */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            className="border-border bg-card"
            data-ocid="mdf-record.approval_panel"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground">
                Approval Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current status */}
              <div className="flex items-center gap-2 py-1">
                <span className="text-xs text-muted-foreground">Status:</span>
                {statusBadge(request.status)}
              </div>

              {/* Approval chain */}
              {(request.approvedBy || request.approvalNote) && (
                <div className="rounded-lg bg-muted/30 border border-border p-3 space-y-1">
                  {request.approvedBy && (
                    <p className="text-xs text-muted-foreground">
                      Decision by:{" "}
                      <span className="text-foreground font-medium">
                        {request.approvedBy}
                      </span>
                    </p>
                  )}
                  {request.approvedAt && (
                    <p className="text-xs text-muted-foreground">
                      {formatTs(request.approvedAt)}
                    </p>
                  )}
                  {request.approvalNote && (
                    <p className="text-sm text-foreground/80 mt-1 italic">
                      &ldquo;{request.approvalNote}&rdquo;
                    </p>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-2 pt-1">
                {canApproveReject && (
                  <>
                    <Button
                      type="button"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                      onClick={() => {
                        setDecideAction("approve");
                        setDecideOpen(true);
                      }}
                      data-ocid="mdf-record.approve_button"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Request
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-red-500/40 text-red-400 hover:bg-red-500/10 gap-2"
                      onClick={() => {
                        setDecideAction("reject");
                        setDecideOpen(true);
                      }}
                      data-ocid="mdf-record.reject_button"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Request
                    </Button>
                  </>
                )}

                {canMarkPaid && (
                  <Button
                    type="button"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                    onClick={handleMarkPaid}
                    disabled={paidSubmitting}
                    data-ocid="mdf-record.mark_paid_button"
                  >
                    <CreditCard className="w-4 h-4" />
                    {paidSubmitting ? "Processing..." : "Mark as Paid"}
                  </Button>
                )}

                {showCancel && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-muted-foreground hover:text-foreground gap-2"
                    onClick={handleCancel}
                    disabled={cancelSubmitting}
                    data-ocid="mdf-record.cancel_button"
                  >
                    <XCircle className="w-4 h-4" />
                    {cancelSubmitting ? "Cancelling..." : "Cancel Request"}
                  </Button>
                )}

                {!canApproveReject && !canMarkPaid && !showCancel && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    No actions available for this request.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ForgeAI context card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuit className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  ForgeAI
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ForgeAI continuously monitors account health, reseller
                engagement, and renewal risk to surface intelligent MDF approval
                recommendations. Decisions are always made by authorized admins.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Decide Modal */}
      <DecideModal
        reqId={request.id}
        decision={decideAction}
        open={decideOpen}
        onClose={() => setDecideOpen(false)}
        onDone={() => {
          queryClient.invalidateQueries({ queryKey: ["mdfRequest", id] });
          queryClient.invalidateQueries({ queryKey: ["mdfRequests"] });
        }}
      />
    </div>
  );
}
