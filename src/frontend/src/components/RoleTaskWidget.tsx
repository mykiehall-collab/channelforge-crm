import { useNavigate } from "@tanstack/react-router";
import { CheckSquare, ChevronRight, Square } from "lucide-react";
import { useState } from "react";
import type { UserRole } from "../backend";

type FunctionalRole =
  | "Sales"
  | "Marketing"
  | "IT"
  | "BDR"
  | "Sales Manager"
  | "Sales Operations"
  | "Deal Desk"
  | "Order Management"
  | "Directors/Leadership";

const TASK_MAP: Record<string, string[]> = {
  "Sales+vendor": [
    "Follow up on renewal risks",
    "Progress channel opportunities",
    "Review high-risk partner accounts",
    "Check pending deal registrations",
    "Update pipeline stages",
  ],
  "Sales+distributor": [
    "Review reseller pipeline",
    "Follow up on stalled deals",
    "Check regional renewal risk",
    "Update opportunity forecasts",
    "Review reseller activity",
  ],
  "Sales+reseller": [
    "Follow up on customer renewals",
    "Progress open opportunities",
    "Review accounts with no recent activity",
    "Check pending deal registrations",
    "Update customer pipeline",
  ],
  Marketing: [
    "Review campaign tasks",
    "Upload new partner materials",
    "Check MDF actions",
    "Review partner engagement metrics",
    "Update promotional assets",
  ],
  IT: [
    "Review integration issues",
    "Check API sync status",
    "Manage user access requests",
    "Monitor data import errors",
    "Review system health",
  ],
  BDR: [
    "Call target accounts",
    "Qualify new leads",
    "Update contact records",
    "Book meetings for sales",
    "Log outreach activity",
  ],
  "Sales Manager": [
    "Review team pipeline",
    "Check forecast gaps",
    "Approve escalations",
    "Monitor high-risk renewals",
    "Review rep activity",
  ],
  "Sales Operations": [
    "Review data quality",
    "Manage account allocation",
    "Validate report accuracy",
    "Check dashboard updates",
    "Process import exceptions",
  ],
  "Deal Desk": [
    "Review pending deal registrations",
    "Check pricing exceptions",
    "Approve or reject deal requests",
    "Track SLA breaches",
    "Review deal terms",
  ],
  "Order Management": [
    "Review stuck orders",
    "Check renewal processing",
    "Track provisioning issues",
    "Monitor order errors",
    "Review billing exceptions",
  ],
  "Directors/Leadership": [
    "Review revenue KPIs",
    "Monitor forecast health",
    "Check partner performance",
    "Review escalation risks",
    "Assess channel health score",
  ],
};

const BADGE_LABELS = ["Today", "This Week", "Today", "This Week", "Today"];

function resolveFunctionalRole(
  role: string,
  isVendor: boolean,
  isDistributor: boolean,
  _isReseller: boolean,
): { label: FunctionalRole; taskKey: string } {
  const r = role.toLowerCase();
  // Primary admins → Directors
  if (r.includes("primaryadmin") || r.includes("primary_admin")) {
    return { label: "Directors/Leadership", taskKey: "Directors/Leadership" };
  }
  // Marketing-specific roles
  if (r.includes("marketing")) {
    return { label: "Marketing", taskKey: "Marketing" };
  }
  // IT
  if (r.includes("it") || r.includes("tech")) {
    return { label: "IT", taskKey: "IT" };
  }
  // BDR
  if (r.includes("bdr")) {
    return { label: "BDR", taskKey: "BDR" };
  }
  // Sales Manager
  if (r.includes("manager")) {
    return { label: "Sales Manager", taskKey: "Sales Manager" };
  }
  // Sales Operations / Secondary Admins
  if (
    r.includes("salesop") ||
    r.includes("sales_op") ||
    r.includes("salesoper") ||
    r.includes("secondaryadmin") ||
    r.includes("secondary")
  ) {
    return { label: "Sales Operations", taskKey: "Sales Operations" };
  }
  // Deal Desk
  if (r.includes("deal") && r.includes("desk")) {
    return { label: "Deal Desk", taskKey: "Deal Desk" };
  }
  // Order Management
  if (r.includes("order")) {
    return { label: "Order Management", taskKey: "Order Management" };
  }
  // Sales — entity-aware
  const entity = isVendor
    ? "vendor"
    : isDistributor
      ? "distributor"
      : "reseller";
  return { label: "Sales", taskKey: `Sales+${entity}` };
}

interface RoleTaskWidgetProps {
  userRole: UserRole | string;
  isVendor: boolean;
  isDistributor: boolean;
  isReseller: boolean;
}

export function RoleTaskWidget({
  userRole,
  isVendor,
  isDistributor,
  isReseller,
}: RoleTaskWidgetProps) {
  const navigate = useNavigate();
  const { label, taskKey } = resolveFunctionalRole(
    String(userRole),
    isVendor,
    isDistributor,
    isReseller,
  );
  const tasks = TASK_MAP[taskKey] ?? TASK_MAP["Directors/Leadership"];
  const [checked, setChecked] = useState<boolean[]>(tasks.map(() => false));

  function toggle(i: number) {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  const completedCount = checked.filter(Boolean).length;

  return (
    <div className="crm-card p-5" data-ocid="dashboard.tasks.widget">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <CheckSquare size={15} className="text-orange-500" />
          <h3 className="text-sm font-semibold text-foreground">
            Today's Tasks
          </h3>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(255,107,43,0.12)",
              color: "#FF6B2B",
              border: "1px solid rgba(255,107,43,0.2)",
            }}
          >
            {label}
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">
          {completedCount}/{tasks.length} done
        </span>
      </div>

      {/* Task list */}
      <ul className="space-y-2">
        {tasks.map((task, i) => (
          <li key={task}>
            <button
              type="button"
              onClick={() => toggle(i)}
              data-ocid={`dashboard.task.item.${i + 1}`}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/30 transition-colors group"
            >
              {checked[i] ? (
                <CheckSquare
                  size={16}
                  className="flex-shrink-0 transition-colors"
                  style={{ color: "#FF6B2B" }}
                />
              ) : (
                <Square
                  size={16}
                  className="flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors"
                />
              )}
              <span
                className={`flex-1 text-sm text-left transition-colors ${
                  checked[i]
                    ? "line-through text-muted-foreground/60"
                    : "text-foreground"
                }`}
              >
                {task}
              </span>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                style={
                  BADGE_LABELS[i] === "Today"
                    ? {
                        background: "rgba(255,107,43,0.1)",
                        color: "#FF6B2B",
                        border: "1px solid rgba(255,107,43,0.2)",
                      }
                    : {
                        background: "rgba(100,116,139,0.15)",
                        color: "#94a3b8",
                        border: "1px solid rgba(100,116,139,0.2)",
                      }
                }
              >
                {BADGE_LABELS[i]}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Footer CTA */}
      <div className="mt-4 pt-3 border-t border-border/60">
        <button
          type="button"
          onClick={() => navigate({ to: "/tasks" })}
          data-ocid="dashboard.tasks.view_all.link"
          className="flex items-center gap-1 text-xs font-medium text-orange-500 hover:text-orange-400 transition-colors"
        >
          View all tasks <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
