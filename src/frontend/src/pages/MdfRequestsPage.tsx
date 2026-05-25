import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  AlertCircle,
  BrainCircuit,
  Building2,
  Calendar,
  CheckCircle,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  MessageSquare,
  Milestone,
  MinusCircle,
  Paperclip,
  Pencil,
  Plus,
  Reply,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import { CustomFieldObjectType, MdfRequestStatus } from "../backend.d";
import type { MdfRequest, MdfRequestDecisionInput } from "../backend.d";
import { CustomFieldEditor } from "../components/CustomFieldEditor";
import { useActor } from "../hooks/useActor";
import { useCustomFields } from "../hooks/useCustomFields";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent?: boolean;
}

type StatusFilter = "all" | MdfRequestStatus;

// ─── Status helpers ───────────────────────────────────────────────────────────

function statusBadge(status: MdfRequestStatus) {
  const cfg: Record<MdfRequestStatus, { label: string; className: string }> = {
    [MdfRequestStatus.pending]: {
      label: "Pending",
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
    <Badge variant="outline" className={cn("text-xs font-medium", className)}>
      {label}
    </Badge>
  );
}

function formatAmount(amount: bigint, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function shortId(id: string) {
  return id.length > 8 ? `MDF-${id.slice(-6).toUpperCase()}` : id;
}

// ─── Org types & Collaboration data ─────────────────────────────────────────────

type OrgType = "VENDOR" | "DISTRIBUTOR" | "RESELLER";

interface MdfComment {
  id: string;
  orgType: OrgType;
  orgName: string;
  authorName: string;
  text: string;
  timestamp: string;
  isOwn?: boolean;
}

interface MdfActivity {
  id: string;
  orgType: OrgType;
  orgName: string;
  actorName: string;
  action: string;
  timestamp: string;
}

interface MdfApproval {
  orgType: OrgType;
  orgName: string;
  status: "Approved" | "Pending" | "Not Required";
  approverName?: string;
  timestamp?: string;
}

function orgBadgeClass(orgType: OrgType) {
  switch (orgType) {
    case "VENDOR":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "DISTRIBUTOR":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "RESELLER":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  }
}

function orgBorderClass(orgType: OrgType) {
  switch (orgType) {
    case "VENDOR":
      return "border-l-blue-500";
    case "DISTRIBUTOR":
      return "border-l-purple-500";
    case "RESELLER":
      return "border-l-emerald-500";
  }
}

// ─── Mock collaboration data ────────────────────────────────────────────────────

const MOCK_COMMENTS: MdfComment[] = [
  {
    id: "c1",
    orgType: "VENDOR",
    orgName: "Adobe",
    authorName: "Sarah Chen",
    text: "We've reviewed the campaign proposal and the ROI targets look achievable at 4.2x. Please proceed with the detailed budget breakdown and media plan.",
    timestamp: "2024-05-15T09:30:00Z",
  },
  {
    id: "c2",
    orgType: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    authorName: "Marcus Webb",
    text: "Budget breakdown attached. We're requesting an increase to £68,000 to cover additional digital channels and event sponsorships in Q3.",
    timestamp: "2024-05-15T11:45:00Z",
  },
  {
    id: "c3",
    orgType: "VENDOR",
    orgName: "Adobe",
    authorName: "Sarah Chen",
    text: "Approved the increase to £68,000. Please ensure the revised forecast reflects the additional pipeline expected from the digital expansion.",
    timestamp: "2024-05-16T08:20:00Z",
  },
  {
    id: "c4",
    orgType: "RESELLER",
    orgName: "Nordic Cloud Solutions",
    authorName: "Elena Berg",
    text: "Campaign creative assets are ready for review. We've aligned the messaging with the Nordic market positioning document shared last week.",
    timestamp: "2024-05-17T13:10:00Z",
  },
  {
    id: "c5",
    orgType: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    authorName: "Marcus Webb",
    text: "Creative looks strong. One minor change: please update the CTA to reflect the local language variant for Denmark and Sweden markets.",
    timestamp: "2024-05-17T15:30:00Z",
  },
  {
    id: "c6",
    orgType: "RESELLER",
    orgName: "Nordic Cloud Solutions",
    authorName: "Elena Berg",
    text: "Updated CTAs delivered. Also attaching the preliminary event attendee list — 240 confirmed registrations so far, targeting 350.",
    timestamp: "2024-05-18T09:00:00Z",
  },
  {
    id: "c7",
    orgType: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    authorName: "Marcus Webb",
    text: "Excellent registration numbers. I've updated the spend tracker. Current committed: £42,000 of £68,000. Remaining budget reserved for post-event nurture.",
    timestamp: "2024-05-20T10:15:00Z",
  },
  {
    id: "c8",
    orgType: "RESELLER",
    orgName: "Nordic Cloud Solutions",
    authorName: "Elena Berg",
    text: "Event completed successfully. Uploading evidence pack now: photos, attendee feedback scores (4.6/5), and lead scan reports.",
    timestamp: "2024-05-22T16:45:00Z",
  },
];

const MOCK_ACTIVITIES: MdfActivity[] = [
  {
    id: "a1",
    orgType: "VENDOR",
    orgName: "Adobe",
    actorName: "Sarah Chen",
    action: "Created MDF request for Nordic Q3 Campaign",
    timestamp: "2024-05-10T14:00:00Z",
  },
  {
    id: "a2",
    orgType: "VENDOR",
    orgName: "Adobe",
    actorName: "Sarah Chen",
    action: "Submitted request for approval",
    timestamp: "2024-05-10T14:05:00Z",
  },
  {
    id: "a3",
    orgType: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    actorName: "Marcus Webb",
    action: "Requested budget increase from £55,000 to £68,000",
    timestamp: "2024-05-15T11:45:00Z",
  },
  {
    id: "a4",
    orgType: "VENDOR",
    orgName: "Adobe",
    actorName: "Sarah Chen",
    action: "Approved budget increase to £68,000",
    timestamp: "2024-05-16T08:20:00Z",
  },
  {
    id: "a5",
    orgType: "RESELLER",
    orgName: "Nordic Cloud Solutions",
    actorName: "Elena Berg",
    action: "Uploaded campaign evidence and ROI documentation",
    timestamp: "2024-05-22T16:45:00Z",
  },
  {
    id: "a6",
    orgType: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    actorName: "Marcus Webb",
    action: "Marked MDF request as complete and closed",
    timestamp: "2024-05-23T09:00:00Z",
  },
];

const MOCK_APPROVALS: MdfApproval[] = [
  {
    orgType: "VENDOR",
    orgName: "Adobe",
    status: "Approved",
    approverName: "Sarah Chen",
    timestamp: "2024-05-16T08:20:00Z",
  },
  {
    orgType: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    status: "Pending",
  },
  {
    orgType: "RESELLER",
    orgName: "Nordic Cloud Solutions",
    status: "Not Required",
  },
];

const TIMELINE_MILESTONES = [
  {
    label: "Created",
    orgType: "VENDOR" as OrgType,
    orgName: "Adobe",
    done: true,
  },
  {
    label: "Submitted",
    orgType: "VENDOR" as OrgType,
    orgName: "Adobe",
    done: true,
  },
  {
    label: "Under Review",
    orgType: "DISTRIBUTOR" as OrgType,
    orgName: "Ingram Micro",
    done: true,
  },
  {
    label: "Approved",
    orgType: "VENDOR" as OrgType,
    orgName: "Adobe",
    done: true,
  },
  {
    label: "Campaign Active",
    orgType: "RESELLER" as OrgType,
    orgName: "Nordic Cloud",
    done: true,
  },
  {
    label: "Evidence Submitted",
    orgType: "RESELLER" as OrgType,
    orgName: "Nordic Cloud",
    done: true,
  },
  {
    label: "Closed",
    orgType: "DISTRIBUTOR" as OrgType,
    orgName: "Ingram Micro",
    done: true,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, accent }: StatCardProps) {
  return (
    <Card
      className={cn(
        "border-border bg-card",
        accent && "border-primary/40 bg-primary/5",
      )}
    >
      <CardContent className="p-4 flex items-start gap-3">
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
            accent
              ? "bg-primary/20 text-primary"
              : "bg-secondary text-muted-foreground",
          )}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div
            className={cn(
              "text-xl font-bold",
              accent ? "text-primary" : "text-foreground",
            )}
          >
            {value}
          </div>
          <div className="text-xs text-muted-foreground">{label}</div>
          {sub && (
            <div className="text-xs text-muted-foreground/70 mt-0.5">{sub}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── New MDF Request form (uses custom fields) ────────────────────────────────

const CURRENCIES = ["EUR", "USD", "GBP", "JPY", "AUD", "CAD", "CHF"];
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
const currentYear = new Date().getFullYear();

function NewMdfModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const { actor } = useActor();
  const { companyProfile } = useApp();
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [purpose, setPurpose] = useState("");
  const [budgetYear, setBudgetYear] = useState(String(currentYear));
  const [budgetQuarter, setBudgetQuarter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dummy objectId for custom fields on a new record — we'll use a temp key
  const customFields = useCustomFields(
    CustomFieldObjectType.mdfRequest,
    "__new__",
  );

  async function handleSubmit() {
    const errs: Record<string, string> = {};
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
      const vendorId =
        companyProfile?.vendorId ?? companyProfile?.companyId ?? "";
      await actor!.createMdfRequest(vendorId, {
        amount: BigInt(Math.round(Number(amount))),
        currency,
        purpose: purpose.trim(),
        budgetYear: BigInt(Number(budgetYear)),
        budgetQuarter: budgetQuarter
          ? BigInt(budgetQuarter.replace("Q", ""))
          : undefined,
        associatedAccountId: undefined,
        vendorOwnerId: vendorId,
      });
      toast.success("MDF request submitted successfully.");
      onCreated();
      onClose();
      // reset
      setAmount("");
      setPurpose("");
      setBudgetYear(String(currentYear));
      setBudgetQuarter("");
      setErrors({});
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to submit MDF request.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-xl bg-card border-border"
        data-ocid="mdf-requests.new_modal"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground text-lg font-semibold">
            New MDF Request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1 max-h-[68vh] overflow-y-auto pr-1">
          {/* Amount + Currency */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="text-muted-foreground text-xs mb-1 block">
                Amount <span className="text-destructive">*</span>
              </Label>
              <Input
                data-ocid="mdf-requests.amount_input"
                type="number"
                min="0"
                placeholder="50000"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors((p) => ({ ...p, amount: "" }));
                }}
                className={cn(
                  "bg-input border-border text-foreground",
                  errors.amount && "border-destructive",
                )}
              />
              {errors.amount && (
                <p className="text-destructive text-xs mt-1">{errors.amount}</p>
              )}
            </div>
            <div className="w-28">
              <Label className="text-muted-foreground text-xs mb-1 block">
                Currency
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger
                  data-ocid="mdf-requests.currency_select"
                  className="bg-input border-border text-foreground"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c} className="text-foreground">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <Label className="text-muted-foreground text-xs mb-1 block">
              Purpose <span className="text-destructive">*</span>
            </Label>
            <Textarea
              data-ocid="mdf-requests.purpose_input"
              rows={3}
              placeholder="Describe the marketing development activity..."
              value={purpose}
              onChange={(e) => {
                setPurpose(e.target.value);
                setErrors((p) => ({ ...p, purpose: "" }));
              }}
              className={cn(
                "bg-input border-border text-foreground resize-none",
                errors.purpose && "border-destructive",
              )}
            />
            {errors.purpose && (
              <p className="text-destructive text-xs mt-1">{errors.purpose}</p>
            )}
          </div>

          {/* Budget Year / Quarter */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="text-muted-foreground text-xs mb-1 block">
                Budget Year
              </Label>
              <Select value={budgetYear} onValueChange={setBudgetYear}>
                <SelectTrigger
                  data-ocid="mdf-requests.budget_year_select"
                  className="bg-input border-border text-foreground"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {[currentYear, currentYear + 1].map((y) => (
                    <SelectItem
                      key={y}
                      value={String(y)}
                      className="text-foreground"
                    >
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className="text-muted-foreground text-xs mb-1 block">
                Budget Quarter (optional)
              </Label>
              <Select value={budgetQuarter} onValueChange={setBudgetQuarter}>
                <SelectTrigger
                  data-ocid="mdf-requests.budget_quarter_select"
                  className="bg-input border-border text-foreground"
                >
                  <SelectValue placeholder="Any quarter" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="" className="text-muted-foreground">
                    Any quarter
                  </SelectItem>
                  {QUARTERS.map((q) => (
                    <SelectItem key={q} value={q} className="text-foreground">
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom Fields */}
          {customFields.fieldDefs.length > 0 && (
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                Additional Fields
              </p>
              <div className="space-y-3">
                {customFields.fieldDefs
                  .filter((d) => !d.isArchived)
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
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-ocid="mdf-requests.new_modal.cancel_button"
            className="border-border text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            data-ocid="mdf-requests.new_modal.submit_button"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Quick Decide Modal ───────────────────────────────────────────────────────

function QuickDecideModal({
  request,
  decision,
  open,
  onClose,
  onDone,
}: {
  request: MdfRequest | null;
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
    if (!request || !actor) return;
    setSubmitting(true);
    try {
      const input: MdfRequestDecisionInput = {
        decision: isApprove
          ? MdfRequestStatus.approved
          : MdfRequestStatus.rejected,
        approvalNote: note.trim() || undefined,
      };
      await actor.decideMdfRequest(request.id, input);
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
        data-ocid="mdf-requests.decide_dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isApprove ? "Approve MDF Request" : "Reject MDF Request"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <p className="text-sm text-muted-foreground">
            {isApprove
              ? "Add an optional approval note before confirming."
              : "Please provide a reason for rejecting this request."}
          </p>
          <Textarea
            data-ocid="mdf-requests.decide_dialog.note_input"
            rows={3}
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
            data-ocid="mdf-requests.decide_dialog.cancel_button"
            className="border-border text-muted-foreground"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDecide}
            disabled={submitting}
            data-ocid="mdf-requests.decide_dialog.confirm_button"
            className={cn(
              submitting && "opacity-60",
              isApprove
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
            )}
          >
            {submitting ? "Processing..." : isApprove ? "Approve" : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── MDF Detail Modal with Collaboration ────────────────────────────────────────

function MdfDetailModal({
  request,
  open,
  onClose,
}: {
  request: MdfRequest | null;
  open: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"comments" | "activity">(
    "comments",
  );
  const [comments, setComments] = useState<MdfComment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const maxChars = 2000;

  const currentUserOrgType: OrgType = "VENDOR";
  const currentUserOrgName = "Adobe";

  function handleAddComment() {
    if (!newComment.trim()) return;
    const comment: MdfComment = {
      id: `c${Date.now()}`,
      orgType: currentUserOrgType,
      orgName: currentUserOrgName,
      authorName: "You",
      text: newComment.trim(),
      timestamp: new Date().toISOString(),
      isOwn: true,
    };
    setComments((prev) => [...prev, comment]);
    setNewComment("");
    toast.success("Comment added to thread.");
  }

  function formatTime(ts: string) {
    return new Date(ts).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-4xl bg-card border-border max-h-[90vh] overflow-y-auto"
        data-ocid="mdf-requests.detail_modal"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground text-lg font-semibold flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5 text-primary" />
            MDF Request {shortId(request.id)}
          </DialogTitle>
        </DialogHeader>

        {/* Request summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-muted/30 rounded-lg p-3 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Amount</div>
            <div className="font-semibold text-foreground">
              {formatAmount(request.amount, request.currency)}
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Status</div>
            <div>{statusBadge(request.status)}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 border border-border">
            <div className="text-xs text-muted-foreground mb-1">
              Budget Period
            </div>
            <div className="text-foreground">
              {String(request.budgetYear)}
              {request.budgetQuarter !== undefined
                ? ` Q${request.budgetQuarter}`
                : ""}
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Submitted</div>
            <div className="text-foreground">
              {formatDate(request.createdAt)}
            </div>
          </div>
        </div>

        <div className="bg-muted/20 rounded-lg p-3 border border-border">
          <div className="text-xs text-muted-foreground mb-1">Purpose</div>
          <p className="text-sm text-foreground">{request.purpose}</p>
        </div>

        {/* Collaboration Section */}
        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Collaboration
          </h3>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "comments" | "activity")}
          >
            <TabsList className="bg-card border border-border mb-4">
              <TabsTrigger value="comments" className="text-xs gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="activity" className="text-xs gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Comments Tab */}
            <TabsContent value="comments" className="space-y-4">
              {/* Comment list */}
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={cn(
                      "bg-card border border-border rounded-lg p-3 border-l-4",
                      orgBorderClass(comment.orgType),
                    )}
                    data-ocid={`mdf-requests.comment.${comment.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            orgBadgeClass(comment.orgType),
                          )}
                        >
                          [{comment.orgType}]
                        </Badge>
                        <span className="text-sm font-medium text-foreground">
                          {comment.authorName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {comment.orgName}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {comment.text}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {comment.isOwn && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Reply className="w-3 h-3 mr-1" />
                        Reply
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Paperclip className="w-3 h-3 mr-1" />
                        Attach
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment input */}
              <div className="border-t border-border pt-3 space-y-3">
                <div className="flex items-start gap-2 rounded-lg bg-blue-500/5 border border-blue-500/20 px-3 py-2">
                  <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-300">
                    Your comment will be tagged as [{currentUserOrgType}]. All
                    linked organisations with MDF access will see this.
                  </p>
                </div>
                <Textarea
                  data-ocid="mdf-requests.comment_input"
                  rows={3}
                  placeholder="Add a comment to the thread..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="bg-input border-border text-foreground resize-none"
                />
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-xs",
                      newComment.length > maxChars
                        ? "text-destructive"
                        : "text-muted-foreground",
                    )}
                  >
                    {newComment.length}/{maxChars}
                  </span>
                  <Button
                    type="button"
                    onClick={handleAddComment}
                    disabled={
                      !newComment.trim() || newComment.length > maxChars
                    }
                    data-ocid="mdf-requests.add_comment_button"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add to thread
                  </Button>
                </div>
              </div>

              {/* Shared Timeline */}
              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Milestone className="w-3.5 h-3.5" />
                  Shared Timeline
                </h4>
                <div className="flex items-center gap-1 overflow-x-auto pb-2">
                  {TIMELINE_MILESTONES.map((m, i) => (
                    <div
                      key={m.label}
                      className="flex items-center flex-shrink-0"
                    >
                      <div className="flex flex-col items-center text-center min-w-[100px]">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border-2 mb-1",
                            m.done
                              ? "bg-primary/20 border-primary text-primary"
                              : "bg-muted border-border text-muted-foreground",
                          )}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-medium text-foreground">
                          {m.label}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] mt-0.5",
                            orgBadgeClass(m.orgType),
                          )}
                        >
                          [{m.orgType}] {m.orgName}
                        </Badge>
                      </div>
                      {i < TIMELINE_MILESTONES.length - 1 && (
                        <div className="w-6 h-0.5 bg-border flex-shrink-0 mb-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Joint Approvals */}
              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" />
                  Joint Approvals
                </h4>
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/20">
                        <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase">
                          Organisation
                        </th>
                        <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase">
                          Type
                        </th>
                        <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase">
                          Status
                        </th>
                        <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase">
                          Approver
                        </th>
                        <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_APPROVALS.map((appr, idx) => (
                        <tr
                          key={appr.orgName}
                          data-ocid={`mdf-requests.approval_row.${idx + 1}`}
                          className={cn(
                            "border-b border-border/50",
                            appr.status === "Not Required" &&
                              "opacity-50 bg-muted/10",
                          )}
                        >
                          <td className="px-3 py-2 text-foreground font-medium">
                            {appr.orgName}
                          </td>
                          <td className="px-3 py-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px]",
                                orgBadgeClass(appr.orgType),
                              )}
                            >
                              [{appr.orgType}]
                            </Badge>
                          </td>
                          <td className="px-3 py-2">
                            {appr.status === "Approved" && (
                              <span className="flex items-center gap-1 text-emerald-400 text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Approved
                              </span>
                            )}
                            {appr.status === "Pending" && (
                              <span className="flex items-center gap-1 text-amber-400 text-xs">
                                <Clock className="w-3.5 h-3.5" />
                                Pending
                              </span>
                            )}
                            {appr.status === "Not Required" && (
                              <span className="flex items-center gap-1 text-muted-foreground text-xs">
                                <MinusCircle className="w-3.5 h-3.5" />
                                Not Required
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground text-xs">
                            {appr.approverName || "—"}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground text-xs">
                            {appr.timestamp ? formatTime(appr.timestamp) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-3">
              <div className="space-y-3">
                {MOCK_ACTIVITIES.map((act) => (
                  <div
                    key={act.id}
                    className={cn(
                      "flex items-start gap-3 bg-card border border-border rounded-lg p-3 border-l-4",
                      orgBorderClass(act.orgType),
                    )}
                    data-ocid={`mdf-requests.activity.${act.id}`}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border",
                        orgBadgeClass(act.orgType),
                      )}
                    >
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px]",
                              orgBadgeClass(act.orgType),
                            )}
                          >
                            [{act.orgType}]
                          </Badge>
                          <span className="text-sm font-medium text-foreground">
                            {act.actorName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {act.orgName}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(act.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80">{act.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-ocid="mdf-requests.detail_modal.close_button"
            className="border-border text-muted-foreground hover:text-foreground"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function MdfRequestsPage() {
  const { actor } = useActor();
  const { userProfile, companyProfile, isPrimaryAdmin } = useApp();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showNew, setShowNew] = useState(false);
  const [decideTarget, setDecideTarget] = useState<MdfRequest | null>(null);
  const [decideAction, setDecideAction] = useState<"approve" | "reject">(
    "approve",
  );
  const [decideOpen, setDecideOpen] = useState(false);
  const [detailRequest, setDetailRequest] = useState<MdfRequest | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const isAdmin = isPrimaryAdmin();

  const { data: requests = [], isLoading } = useQuery<MdfRequest[]>({
    queryKey: ["mdfRequests"],
    queryFn: async () => {
      if (!actor) return [];
      const orgId = companyProfile?.companyId ?? "";
      const role = userProfile?.role ?? "";
      return actor.listMdfRequestsForCaller(null, orgId, role, null, null);
    },
    enabled: !!actor,
    refetchInterval: 30_000,
  });

  // ── Stats ──
  const totalAmount = requests.reduce((acc, r) => acc + Number(r.amount), 0);
  const pendingCount = requests.filter(
    (r) => r.status === MdfRequestStatus.pending,
  ).length;
  const now = new Date();
  const qtdApproved = requests.filter(
    (r) =>
      r.status === MdfRequestStatus.approved &&
      r.approvedAt &&
      now.getFullYear() ===
        new Date(Number(r.approvedAt) / 1_000_000).getFullYear() &&
      Math.floor(now.getMonth() / 3) ===
        Math.floor(new Date(Number(r.approvedAt) / 1_000_000).getMonth() / 3),
  );
  const qtdApprovedAmount = qtdApproved.reduce(
    (acc, r) => acc + Number(r.amount),
    0,
  );

  // ── Filtered rows ──
  const filtered =
    statusFilter === "all"
      ? requests
      : requests.filter((r) => r.status === statusFilter);

  // ForgeAI recommendation (placeholder)
  const forgeRec =
    pendingCount > 0
      ? `ForgeAI: ${pendingCount} pending MDF request${pendingCount !== 1 ? "s" : ""} awaiting review. High-health accounts detected in queue — recommend prioritising approvals.`
      : null;

  function openDecide(r: MdfRequest, action: "approve" | "reject") {
    setDecideTarget(r);
    setDecideAction(action);
    setDecideOpen(true);
  }

  return (
    <div data-ocid="mdf-requests.page" className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">MDF Requests</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Market Development Fund requests and approval workflow
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setShowNew(true)}
          data-ocid="mdf-requests.new_request_button"
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          <Plus className="w-4 h-4" />
          New MDF Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total Requests"
          value={requests.length}
          icon={<CircleDollarSign className="w-4 h-4" />}
        />
        <StatCard
          label="Total Requested"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
            maximumFractionDigits: 1,
          }).format(totalAmount)}
          icon={<CircleDollarSign className="w-4 h-4" />}
        />
        <StatCard
          label="Pending Approval"
          value={pendingCount}
          icon={<Clock className="w-4 h-4" />}
          accent={pendingCount > 0}
        />
        <StatCard
          label="Approved This QTD"
          value={qtdApproved.length}
          sub={
            qtdApproved.length > 0
              ? `$${(qtdApprovedAmount / 1000).toFixed(0)}k total`
              : undefined
          }
          icon={<CheckCircle className="w-4 h-4" />}
        />
      </div>

      {/* ForgeAI Panel */}
      {forgeRec && (
        <div
          className="flex gap-3 items-start rounded-lg border border-primary/30 bg-primary/5 px-4 py-3"
          data-ocid="mdf-requests.forgeai_panel"
        >
          <BrainCircuit className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground/90">{forgeRec}</p>
        </div>
      )}

      {/* Filter Tabs + Table */}
      <div className="space-y-3">
        <Tabs
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
        >
          <TabsList
            className="bg-card border border-border"
            data-ocid="mdf-requests.filter.tab"
          >
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value={MdfRequestStatus.pending} className="text-xs">
              Pending
            </TabsTrigger>
            <TabsTrigger value={MdfRequestStatus.approved} className="text-xs">
              Approved
            </TabsTrigger>
            <TabsTrigger value={MdfRequestStatus.rejected} className="text-xs">
              Rejected
            </TabsTrigger>
            <TabsTrigger value={MdfRequestStatus.paid} className="text-xs">
              Paid
            </TabsTrigger>
            <TabsTrigger value={MdfRequestStatus.cancelled} className="text-xs">
              Cancelled
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {isLoading ? (
            <div
              className="p-4 space-y-3"
              data-ocid="mdf-requests.loading_state"
            >
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full bg-muted/50" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-14 px-6 text-center"
              data-ocid="mdf-requests.empty_state"
            >
              <CircleDollarSign className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="text-foreground font-medium">
                {statusFilter === "all"
                  ? "No MDF requests yet"
                  : `No ${statusFilter} requests`}
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                {statusFilter === "all"
                  ? "Submit your first Market Development Fund request to get started."
                  : "Try a different status filter."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Request ID
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Purpose
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Budget Year
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Submitted
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req, idx) => (
                    <tr
                      key={req.id}
                      data-ocid={`mdf-requests.item.${idx + 1}`}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => {
                        setDetailRequest(req);
                        setDetailOpen(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setDetailRequest(req);
                          setDetailOpen(true);
                        }
                      }}
                      tabIndex={0}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-primary">
                        {shortId(req.id)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-foreground truncate max-w-[220px]">
                          {req.purpose}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">
                        {formatAmount(req.amount, req.currency)}
                      </td>
                      <td className="px-4 py-3">{statusBadge(req.status)}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {String(req.budgetYear)}
                        {req.budgetQuarter !== undefined
                          ? ` Q${req.budgetQuarter}`
                          : ""}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(req.createdAt)}
                      </td>
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        {isAdmin && req.status === MdfRequestStatus.pending && (
                          <div className="flex gap-1.5">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => openDecide(req, "approve")}
                              data-ocid={`mdf-requests.approve_button.${idx + 1}`}
                              className="h-7 px-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-600/30"
                              variant="outline"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => openDecide(req, "reject")}
                              data-ocid={`mdf-requests.reject_button.${idx + 1}`}
                              className="h-7 px-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/30"
                              variant="outline"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                        {(!isAdmin ||
                          req.status !== MdfRequestStatus.pending) && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setDetailRequest(req);
                              setDetailOpen(true);
                            }}
                            data-ocid={`mdf-requests.view_button.${idx + 1}`}
                            className="h-7 px-2 text-muted-foreground hover:text-foreground text-xs"
                          >
                            View
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <NewMdfModal
        open={showNew}
        onClose={() => setShowNew(false)}
        onCreated={() =>
          queryClient.invalidateQueries({ queryKey: ["mdfRequests"] })
        }
      />
      <QuickDecideModal
        request={decideTarget}
        decision={decideAction}
        open={decideOpen}
        onClose={() => setDecideOpen(false)}
        onDone={() =>
          queryClient.invalidateQueries({ queryKey: ["mdfRequests"] })
        }
      />
      <MdfDetailModal
        request={detailRequest}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setDetailRequest(null);
        }}
      />
    </div>
  );
}
