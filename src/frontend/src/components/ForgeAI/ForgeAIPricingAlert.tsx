import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface ForgeAIPricingAlertProps {
  insight: string;
  priority: "high" | "medium" | "low";
  actionLabel: string;
  onAction: () => void;
  className?: string;
}

const PRIORITY_STYLES: Record<
  ForgeAIPricingAlertProps["priority"],
  { wrapper: string; icon: string; action: string; badge: string }
> = {
  high: {
    wrapper: "border-amber-500/60 bg-amber-500/10",
    icon: "text-amber-400",
    action:
      "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border-amber-500/30",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  medium: {
    wrapper: "border-orange-500/40 bg-orange-500/8",
    icon: "text-orange-400",
    action:
      "text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 border-orange-500/30",
    badge: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  low: {
    wrapper: "border-blue-500/30 bg-blue-500/8",
    icon: "text-blue-400",
    action:
      "text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border-blue-500/20",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
};

const PRIORITY_LABELS: Record<ForgeAIPricingAlertProps["priority"], string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function ForgeAIPricingAlert({
  insight,
  priority,
  actionLabel,
  onAction,
  className,
}: ForgeAIPricingAlertProps) {
  const styles = PRIORITY_STYLES[priority];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3",
        styles.wrapper,
        className,
      )}
      data-ocid="forgeai.pricing_alert"
    >
      {/* Icon */}
      <div className="mt-0.5 shrink-0">
        <Sparkles className={cn("h-4 w-4", styles.icon)} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              styles.badge,
            )}
          >
            ForgeAI
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
              styles.badge,
            )}
          >
            {PRIORITY_LABELS[priority]}
          </span>
        </div>
        <p className="text-xs leading-snug text-foreground/90">{insight}</p>
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={onAction}
        className={cn(
          "shrink-0 rounded border px-2.5 py-1 text-xs font-medium transition-colors",
          styles.action,
        )}
        data-ocid="forgeai.pricing_alert.action_button"
      >
        {actionLabel}
      </button>
    </div>
  );
}
