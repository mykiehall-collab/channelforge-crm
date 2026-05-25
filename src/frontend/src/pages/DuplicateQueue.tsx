import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Clock,
  GitMerge,
  ShieldAlert,
  UserCheck,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { DuplicateDRRecord, DuplicateDRStatus } from "../backend";
import { DuplicateDRStatus as DRStatus } from "../backend";
import type { DealRegistration } from "../backend";
import type { Account } from "../backend";
import { useActor } from "../hooks/useActor";
import { formatCurrency, formatDate } from "../utils/channelforge";

// ── Time waiting helper ────────────────────────────────────────────────────────
function timeWaiting(submittedAt: bigint): string {
  const ms = Number(submittedAt) / 1_000_000;
  const diffMs = Date.now() - ms;
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h`;
  return "< 1h";
}

// ── Confirmation Modal ─────────────────────────────────────────────────────────
interface ActionModalProps {
  action: DuplicateDRStatus;
  record: DuplicateDRRecord;
  onConfirm: (note: string) => Promise<void>;
  onClose: () => void;
}

const ACTION_META: Record<
  DuplicateDRStatus,
  { label: string; color: string; description: string }
> = {
  [DRStatus.Approved]: {
    label: "Approve Duplicate",
    color: "text-green-400",
    description:
      "Allow this duplicate registration. Both resellers will hold an active DR for this product/account.",
  },
  [DRStatus.Rejected]: {
    label: "Reject Submission",
    color: "text-red-400",
    description:
      "Reject this duplicate. The submitting reseller will be notified.",
  },
  [DRStatus.Merged]: {
    label: "Merge Records",
    color: "text-blue-400",
    description:
      "Combine both DRs into a single record. Original ownership is preserved unless reassigned.",
  },
  [DRStatus.Reassigned]: {
    label: "Reassign Ownership",
    color: "text-amber-400",
    description:
      "Transfer ownership of the existing DR to the new submitting reseller.",
  },
  [DRStatus.Escalated]: {
    label: "Escalate for Review",
    color: "text-muted-foreground",
    description:
      "Flag for manual review by a senior admin. Add an internal note below.",
  },
  [DRStatus.PendingVendorReview]: {
    label: "Pending",
    color: "text-orange-400",
    description: "",
  },
};

function ActionModal({ action, record, onConfirm, onClose }: ActionModalProps) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const meta = ACTION_META[action];

  async function handleConfirm() {
    setBusy(true);
    await onConfirm(note);
    setBusy(false);
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4"
      data-ocid="dup_queue.action.dialog"
    >
      <div className="crm-card w-full max-w-md p-6 fade-in space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={`text-sm font-semibold ${meta.color}`}>
              {meta.label}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {meta.description}
            </p>
          </div>
          <button
            type="button"
            data-ocid="dup_queue.action.close_button"
            onClick={onClose}
            className="p-1 rounded hover:bg-secondary/40 text-muted-foreground flex-shrink-0"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        <div className="bg-secondary/20 rounded-lg p-3 text-xs space-y-1">
          <p className="text-muted-foreground">
            Product:{" "}
            <span className="text-orange-400 font-semibold">
              {record.product}
            </span>
          </p>
          <p className="text-muted-foreground">
            Account ID:{" "}
            <span className="text-foreground">
              {record.accountId.slice(0, 12)}…
            </span>
          </p>
          <p className="text-muted-foreground">
            Existing owner:{" "}
            <span className="text-foreground">
              {record.existingResellerId || "—"}
            </span>
          </p>
          <p className="text-muted-foreground">
            New submission by:{" "}
            <span className="text-foreground">{record.resellerId || "—"}</span>
          </p>
        </div>

        <div>
          <label
            htmlFor="dup-action-note"
            className="block text-xs text-muted-foreground mb-1"
          >
            Internal note (optional)
          </label>
          <textarea
            id="dup-action-note"
            data-ocid="dup_queue.action.note.textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="crm-input w-full px-3 py-2 text-xs resize-none"
            placeholder="Add context for the audit trail…"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            data-ocid="dup_queue.action.cancel_button"
            onClick={onClose}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            data-ocid="dup_queue.action.confirm_button"
            disabled={busy}
            onClick={handleConfirm}
            className="text-xs text-white"
            style={{
              background:
                action === DRStatus.Approved
                  ? "#22c55e"
                  : action === DRStatus.Rejected
                    ? "#ef4444"
                    : action === DRStatus.Merged
                      ? "#3b82f6"
                      : action === DRStatus.Reassigned
                        ? "#f59e0b"
                        : "#6b7280",
            }}
          >
            {busy ? "Processing…" : meta.label}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Duplicate Row ──────────────────────────────────────────────────────────────
interface DupRowProps {
  record: DuplicateDRRecord;
  index: number;
  allDeals: DealRegistration[];
  accounts: Account[];
  onAction: (record: DuplicateDRRecord, action: DuplicateDRStatus) => void;
}

function DupRow({ record, index, allDeals, accounts, onAction }: DupRowProps) {
  const [expanded, setExpanded] = useState(false);
  const newDR = allDeals.find((d) => d.id === record.newDRId);
  const existingDR = allDeals.find((d) => d.id === record.existingDRId);
  const account = accounts.find((a) => a.id === record.accountId);
  const isPending = record.status === DRStatus.PendingVendorReview;

  return (
    <div
      className="border border-border/60 rounded-lg overflow-hidden mb-2"
      data-ocid={`dup_queue.item.${index}`}
    >
      {/* Summary row */}
      <div
        className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/10 transition-colors cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => e.key === "Enter" && setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <span className="inline-flex items-center gap-1 bg-red-500/15 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30 flex-shrink-0">
          <AlertTriangle size={9} /> DUPLICATE
        </span>

        <span
          className="text-orange-400 font-semibold text-xs flex-1 min-w-0 truncate"
          title={record.product}
        >
          {record.product}
        </span>

        <span className="text-xs text-muted-foreground hidden sm:block flex-shrink-0">
          {account?.accountName ?? record.accountId.slice(0, 10)}
        </span>

        <span className="text-xs text-muted-foreground hidden md:block flex-shrink-0">
          Existing:{" "}
          <span className="text-foreground">
            {record.existingResellerId || "—"}
          </span>
        </span>

        <span className="text-xs text-muted-foreground hidden lg:block flex-shrink-0">
          New:{" "}
          <span className="text-foreground">{record.resellerId || "—"}</span>
        </span>

        <span className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
          <Clock size={10} />
          {timeWaiting(record.submittedAt)}
        </span>

        <span className="ml-1 text-muted-foreground flex-shrink-0">
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border/50 bg-secondary/5 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Existing DR */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Existing DR
              </p>
              {existingDR ? (
                <div className="bg-secondary/20 rounded-lg p-3 text-xs space-y-1.5">
                  <p>
                    <span className="text-muted-foreground">Ref:</span>{" "}
                    <span className="text-foreground font-mono">
                      {existingDR.id.slice(0, 12)}…
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Reseller:</span>{" "}
                    <span className="text-foreground">
                      {existingDR.resellerId || "—"}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Product:</span>{" "}
                    <span className="text-orange-400 font-semibold">
                      {existingDR.product}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Value:</span>{" "}
                    <span className="text-foreground font-mono">
                      {formatCurrency(existingDR.estimatedValue)}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Account:</span>{" "}
                    <span className="text-foreground">
                      {account?.accountName ??
                        existingDR.accountId.slice(0, 10)}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Submitted:</span>{" "}
                    <span className="text-foreground">
                      {existingDR.submittedDate
                        ? formatDate(existingDR.submittedDate)
                        : "—"}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Status:</span>{" "}
                    <span className="text-green-400">Approved</span>
                  </p>
                </div>
              ) : (
                <div className="bg-secondary/20 rounded-lg p-3 text-xs text-muted-foreground">
                  DR ref: {record.existingDRId.slice(0, 12)}…
                </div>
              )}
            </div>

            {/* New DR */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                New Submission
              </p>
              {newDR ? (
                <div className="bg-secondary/20 rounded-lg p-3 text-xs space-y-1.5">
                  <p>
                    <span className="text-muted-foreground">Ref:</span>{" "}
                    <span className="text-foreground font-mono">
                      {newDR.id.slice(0, 12)}…
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Reseller:</span>{" "}
                    <span className="text-foreground">
                      {newDR.resellerId || "—"}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Product:</span>{" "}
                    <span className="text-orange-400 font-semibold">
                      {newDR.product}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Value:</span>{" "}
                    <span className="text-foreground font-mono">
                      {formatCurrency(newDR.estimatedValue)}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Account:</span>{" "}
                    <span className="text-foreground">
                      {account?.accountName ?? newDR.accountId.slice(0, 10)}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Submitted:</span>{" "}
                    <span className="text-foreground">
                      {formatDate(record.submittedAt)}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Time waiting:</span>{" "}
                    <span className="text-orange-400">
                      {timeWaiting(record.submittedAt)}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="bg-secondary/20 rounded-lg p-3 text-xs text-muted-foreground">
                  DR ref: {record.newDRId.slice(0, 12)}…
                </div>
              )}
            </div>
          </div>

          {/* Product overlap highlight */}
          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 rounded-lg px-3 py-2">
            <ShieldAlert size={13} className="text-orange-400 flex-shrink-0" />
            <p className="text-xs text-orange-300">
              Product overlap detected:{" "}
              <span className="font-bold">{record.product}</span> is already
              registered against this account.
            </p>
          </div>

          {/* Actions (only for pending) */}
          {isPending && (
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                data-ocid={`dup_queue.approve_button.${index}`}
                onClick={() => onAction(record, DRStatus.Approved)}
                className="text-xs px-3 py-1.5 rounded-full border border-green-500/40 text-green-400 hover:bg-green-500/10 transition-colors flex items-center gap-1.5"
              >
                <UserCheck size={11} /> Approve
              </button>
              <button
                type="button"
                data-ocid={`dup_queue.reject_button.${index}`}
                onClick={() => onAction(record, DRStatus.Rejected)}
                className="text-xs px-3 py-1.5 rounded-full border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Reject
              </button>
              <button
                type="button"
                data-ocid={`dup_queue.merge_button.${index}`}
                onClick={() => onAction(record, DRStatus.Merged)}
                className="text-xs px-3 py-1.5 rounded-full border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 transition-colors flex items-center gap-1.5"
              >
                <GitMerge size={11} /> Merge
              </button>
              <button
                type="button"
                data-ocid={`dup_queue.reassign_button.${index}`}
                onClick={() => onAction(record, DRStatus.Reassigned)}
                className="text-xs px-3 py-1.5 rounded-full border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition-colors"
              >
                Reassign
              </button>
              <button
                type="button"
                data-ocid={`dup_queue.escalate_button.${index}`}
                onClick={() => onAction(record, DRStatus.Escalated)}
                className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
              >
                Escalate
              </button>
            </div>
          )}

          {/* Resolved status */}
          {!isPending && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Decision:</span>
              <span
                className={`font-semibold ${
                  record.status === DRStatus.Approved
                    ? "text-green-400"
                    : record.status === DRStatus.Rejected
                      ? "text-red-400"
                      : record.status === DRStatus.Merged
                        ? "text-blue-400"
                        : record.status === DRStatus.Reassigned
                          ? "text-amber-400"
                          : "text-muted-foreground"
                }`}
              >
                {record.status}
              </span>
              {record.reviewNote && (
                <span className="text-muted-foreground">
                  — {record.reviewNote}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Duplicate Queue Component ──────────────────────────────────────────────────
export interface DuplicateQueueProps {
  records: DuplicateDRRecord[];
  allDeals: DealRegistration[];
  accounts: Account[];
  loading: boolean;
  onRefresh: () => Promise<void>;
}

export function DuplicateQueue({
  records,
  allDeals,
  accounts,
  loading,
  onRefresh,
}: DuplicateQueueProps) {
  const { actor } = useActor();
  const [pendingAction, setPendingAction] = useState<{
    record: DuplicateDRRecord;
    action: DuplicateDRStatus;
  } | null>(null);

  const handleAction = useCallback(
    (record: DuplicateDRRecord, action: DuplicateDRStatus) => {
      setPendingAction({ record, action });
    },
    [],
  );

  const handleConfirm = useCallback(
    async (note: string) => {
      if (!pendingAction || !actor) return;
      try {
        const ok = await actor.reviewDuplicateDR(
          pendingAction.record.id,
          pendingAction.action,
          note,
        );
        if (ok) {
          toast.success(`Duplicate DR ${pendingAction.action.toLowerCase()}`);
          await onRefresh();
        } else {
          toast.error("Action failed — check your permissions");
        }
      } catch {
        toast.error("Failed to process action");
      } finally {
        setPendingAction(null);
      }
    },
    [pendingAction, actor, onRefresh],
  );

  const pending = records.filter(
    (r) => r.status === DRStatus.PendingVendorReview,
  );
  const resolved = records.filter(
    (r) => r.status !== DRStatus.PendingVendorReview,
  );

  return (
    <div className="space-y-4" data-ocid="dup_queue.panel">
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div
          className="flex flex-col items-center py-14 px-6"
          data-ocid="dup_queue.empty_state"
        >
          <ShieldAlert size={36} className="text-muted-foreground mb-3" />
          <p className="text-sm font-semibold text-foreground mb-1">
            No duplicate DRs in queue
          </p>
          <p className="text-xs text-muted-foreground text-center max-w-xs">
            Duplicate deal registration attempts will appear here for review.
          </p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Awaiting Decision ({pending.length})
              </p>
              {pending.map((r, i) => (
                <DupRow
                  key={r.id}
                  record={r}
                  index={i + 1}
                  allDeals={allDeals}
                  accounts={accounts}
                  onAction={handleAction}
                />
              ))}
            </div>
          )}

          {resolved.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">
                Resolved ({resolved.length})
              </p>
              {resolved.map((r, i) => (
                <DupRow
                  key={r.id}
                  record={r}
                  index={pending.length + i + 1}
                  allDeals={allDeals}
                  accounts={accounts}
                  onAction={handleAction}
                />
              ))}
            </div>
          )}
        </>
      )}

      {pendingAction && (
        <ActionModal
          action={pendingAction.action}
          record={pendingAction.record}
          onConfirm={handleConfirm}
          onClose={() => setPendingAction(null)}
        />
      )}
    </div>
  );
}
