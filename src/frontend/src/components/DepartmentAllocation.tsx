import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Crown,
  RefreshCw,
  Share2,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const DEPARTMENTS = [
  "Sales",
  "Marketing",
  "IT",
  "BDR",
  "Sales Management",
  "Sales Operations",
  "Deal Desk",
  "Order Management",
  "Leadership",
  "Finance",
  "Admin",
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export interface DeptUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isPrimary?: boolean;
}

interface SharingRights {
  shareInternal: boolean;
  shareExternal: boolean;
  shareWithVendor?: boolean;
  shareWithDistributor?: boolean;
  shareWithReseller?: boolean;
}

interface UserDeptState {
  department: Department | "";
  sharing: SharingRights;
}

type UserDeptMap = Record<string, UserDeptState>;

function defaultState(users: DeptUser[]): UserDeptMap {
  return Object.fromEntries(
    users.map((u) => [
      u.id,
      {
        department: "" as Department | "",
        sharing: {
          shareInternal: false,
          shareExternal: false,
          shareWithVendor: false,
          shareWithDistributor: false,
          shareWithReseller: false,
        },
      },
    ]),
  );
}

interface Props {
  users: DeptUser[];
  isPrimaryAdmin: boolean;
  /** Which external share options to show */
  orgType: "vendor" | "distributor" | "reseller";
  /** Called when a user's department is changed */
  onDeptChange?: (userId: string, dept: string) => void;
}

export function DepartmentAllocation({
  users,
  isPrimaryAdmin,
  orgType,
  onDeptChange,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [deptMap, setDeptMap] = useState<UserDeptMap>(() =>
    defaultState(users),
  );
  const [reassignOpen, setReassignOpen] = useState(false);
  const [reassignTarget, setReassignTarget] = useState("");
  const [saving, setSaving] = useState(false);

  function setDept(userId: string, dept: Department | "") {
    setDeptMap((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], department: dept },
    }));
    onDeptChange?.(userId, dept);
  }

  function toggleSharing(
    userId: string,
    key: keyof SharingRights,
    value: boolean,
  ) {
    setDeptMap((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        sharing: { ...prev[userId].sharing, [key]: value },
      },
    }));
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Department allocations saved");
    }, 700);
  }

  function handleReassign() {
    if (!reassignTarget) return;
    toast.success(
      `Primary Admin ownership reassigned to ${
        users.find((u) => u.id === reassignTarget)?.name ?? reassignTarget
      }`,
    );
    setReassignOpen(false);
    setReassignTarget("");
  }

  const nonPrimary = users.filter((u) => !u.isPrimary);

  return (
    <div
      className="crm-card overflow-hidden"
      data-ocid="dept_allocation.section"
    >
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/20 hover:bg-secondary/30 transition-colors text-left"
        data-ocid="dept_allocation.toggle"
      >
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Department &amp; Reporting Permissions
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="flex flex-col gap-5 p-4">
          {/* Secondary Admin info banner */}
          {!isPrimaryAdmin && (
            <div
              className="flex items-start gap-2.5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2.5 text-xs text-yellow-300"
              data-ocid="dept_allocation.secondary_admin_banner"
            >
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>
                Secondary Admins can only manage departments and sharing rights
                if granted permission by the Primary Admin
                (canManageDepartments).
              </span>
            </div>
          )}

          {/* Per-user rows */}
          <div className="flex flex-col gap-3">
            {users.map((u, idx) => {
              const state = deptMap[u.id] ?? {
                department: "",
                sharing: {
                  shareInternal: false,
                  shareExternal: false,
                  shareWithVendor: false,
                  shareWithDistributor: false,
                  shareWithReseller: false,
                },
              };
              const canEdit = isPrimaryAdmin;

              return (
                <div
                  key={u.id}
                  className="crm-card p-3 flex flex-col gap-3"
                  data-ocid={`dept_allocation.user.${idx + 1}`}
                >
                  {/* User identity row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent flex-shrink-0">
                      {u.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {u.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate">
                        {u.email}
                      </span>
                    </div>
                    {u.isPrimary && (
                      <span
                        className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/15 text-accent border border-accent/25"
                        data-ocid={`dept_allocation.primary_badge.${idx + 1}`}
                      >
                        <Crown className="w-2.5 h-2.5" />
                        Primary Admin
                      </span>
                    )}
                    {!u.isPrimary && (
                      <span className="ml-auto text-[10px] text-muted-foreground">
                        {u.role}
                      </span>
                    )}
                  </div>

                  {/* Department selector */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wide w-20 flex-shrink-0">
                      Department
                    </Label>
                    <select
                      value={state.department}
                      onChange={(e) =>
                        setDept(u.id, e.target.value as Department | "")
                      }
                      disabled={!canEdit}
                      className="flex-1 min-w-[160px] text-xs bg-input border border-border rounded-[0.5rem] px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50 disabled:cursor-not-allowed"
                      data-ocid={`dept_allocation.dept_select.${idx + 1}`}
                    >
                      <option value="">— Select department —</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    {state.department ? (
                      <span
                        className="text-[10px] text-emerald-400 flex items-center gap-1"
                        data-ocid={`dept_allocation.dept_status.${idx + 1}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        Assigned
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">
                        —
                      </span>
                    )}
                  </div>

                  {/* Sharing rights */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wide">
                      <Share2 className="w-3 h-3" />
                      Report Sharing Rights
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {/* Internal */}
                      <label
                        className="flex items-center gap-2 text-xs cursor-pointer"
                        data-ocid={`dept_allocation.share_internal.${idx + 1}`}
                      >
                        <input
                          type="checkbox"
                          checked={state.sharing.shareInternal}
                          onChange={(e) =>
                            toggleSharing(
                              u.id,
                              "shareInternal",
                              e.target.checked,
                            )
                          }
                          disabled={!canEdit}
                          className="w-3.5 h-3.5 rounded accent-orange-500 border-border cursor-pointer disabled:cursor-not-allowed"
                        />
                        <span className="text-foreground">
                          Share Internally
                        </span>
                        {state.sharing.shareInternal ? (
                          <span className="text-emerald-400 text-[10px]">
                            ✓
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-[10px]">
                            —
                          </span>
                        )}
                      </label>

                      {/* External */}
                      <label
                        className="flex items-center gap-2 text-xs cursor-pointer"
                        data-ocid={`dept_allocation.share_external.${idx + 1}`}
                      >
                        <input
                          type="checkbox"
                          checked={state.sharing.shareExternal}
                          onChange={(e) =>
                            toggleSharing(
                              u.id,
                              "shareExternal",
                              e.target.checked,
                            )
                          }
                          disabled={!canEdit}
                          className="w-3.5 h-3.5 rounded accent-orange-500 border-border cursor-pointer disabled:cursor-not-allowed"
                        />
                        <span className="text-foreground">
                          Share Externally
                        </span>
                        {state.sharing.shareExternal ? (
                          <span className="text-emerald-400 text-[10px]">
                            ✓
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-[10px]">
                            —
                          </span>
                        )}
                      </label>

                      {/* Org-specific external targets */}
                      {state.sharing.shareExternal && (
                        <>
                          {orgType !== "vendor" && (
                            <label
                              className="flex items-center gap-2 text-xs cursor-pointer"
                              data-ocid={`dept_allocation.share_vendor.${idx + 1}`}
                            >
                              <input
                                type="checkbox"
                                checked={state.sharing.shareWithVendor ?? false}
                                onChange={(e) =>
                                  toggleSharing(
                                    u.id,
                                    "shareWithVendor",
                                    e.target.checked,
                                  )
                                }
                                disabled={!canEdit}
                                className="w-3.5 h-3.5 rounded accent-orange-500 border-border cursor-pointer disabled:cursor-not-allowed"
                              />
                              <span className="text-muted-foreground">
                                with Vendor
                              </span>
                            </label>
                          )}
                          {orgType !== "distributor" && (
                            <label
                              className="flex items-center gap-2 text-xs cursor-pointer"
                              data-ocid={`dept_allocation.share_distributor.${idx + 1}`}
                            >
                              <input
                                type="checkbox"
                                checked={
                                  state.sharing.shareWithDistributor ?? false
                                }
                                onChange={(e) =>
                                  toggleSharing(
                                    u.id,
                                    "shareWithDistributor",
                                    e.target.checked,
                                  )
                                }
                                disabled={!canEdit}
                                className="w-3.5 h-3.5 rounded accent-orange-500 border-border cursor-pointer disabled:cursor-not-allowed"
                              />
                              <span className="text-muted-foreground">
                                with Distributor
                              </span>
                            </label>
                          )}
                          {orgType !== "reseller" && (
                            <label
                              className="flex items-center gap-2 text-xs cursor-pointer"
                              data-ocid={`dept_allocation.share_reseller.${idx + 1}`}
                            >
                              <input
                                type="checkbox"
                                checked={
                                  state.sharing.shareWithReseller ?? false
                                }
                                onChange={(e) =>
                                  toggleSharing(
                                    u.id,
                                    "shareWithReseller",
                                    e.target.checked,
                                  )
                                }
                                disabled={!canEdit}
                                className="w-3.5 h-3.5 rounded accent-orange-500 border-border cursor-pointer disabled:cursor-not-allowed"
                              />
                              <span className="text-muted-foreground">
                                with Reseller
                              </span>
                            </label>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Save button */}
          {isPrimaryAdmin && (
            <div className="flex items-center justify-between pt-1">
              <Button
                type="button"
                size="sm"
                className="text-xs gap-1.5"
                onClick={handleSave}
                disabled={saving}
                data-ocid="dept_allocation.save_button"
              >
                {saving ? "Saving..." : "Save Allocations"}
              </Button>
            </div>
          )}

          {/* Primary Admin controls */}
          {isPrimaryAdmin && (
            <div
              className="flex flex-col gap-3 border-t border-border pt-4"
              data-ocid="dept_allocation.primary_admin_controls"
            >
              <div className="flex items-center gap-2">
                <Crown className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Primary Admin Controls
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/20 font-semibold">
                  Primary Admin Only
                </span>
              </div>

              <div className="crm-card p-3 flex flex-col gap-2">
                <p className="text-xs font-semibold text-foreground">
                  Reassign Admin Ownership
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Transfer Primary Admin ownership to another admin. This action
                  is permanent and will demote your current account.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="w-fit text-xs gap-1.5 border-border"
                  onClick={() => setReassignOpen(true)}
                  data-ocid="dept_allocation.reassign_button"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reassign Primary Admin
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reassign confirmation dialog */}
      <Dialog open={reassignOpen} onOpenChange={setReassignOpen}>
        <DialogContent
          className="bg-card border-border max-w-sm"
          data-ocid="dept_allocation.reassign_dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-accent" />
              Reassign Primary Admin
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div
              className="flex items-start gap-2.5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2.5 text-xs text-yellow-300"
              data-ocid="dept_allocation.reassign_warning"
            >
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>
                Warning: transferring Primary Admin ownership will immediately
                demote your account to Secondary Admin. This action cannot be
                undone without the new Primary Admin.
              </span>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="reassign-select"
                className="text-xs text-muted-foreground"
              >
                Select new Primary Admin
              </label>
              <select
                id="reassign-select"
                value={reassignTarget}
                onChange={(e) => setReassignTarget(e.target.value)}
                className="w-full text-sm bg-input border border-border rounded-[0.5rem] px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                data-ocid="dept_allocation.reassign_select"
              >
                <option value="">— Choose admin —</option>
                {nonPrimary.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setReassignOpen(false)}
              data-ocid="dept_allocation.reassign_cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!reassignTarget}
              onClick={handleReassign}
              data-ocid="dept_allocation.reassign_confirm_button"
            >
              Confirm Reassignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
