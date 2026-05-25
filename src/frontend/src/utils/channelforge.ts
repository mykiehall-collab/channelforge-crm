import { AccountStatus, DealStatus } from "../backend";

/** Convert nanosecond timestamp to readable date string */
export function formatDate(ns: bigint): string {
  if (!ns) return "—";
  const ms = Number(ns) / 1_000_000;
  const d = new Date(ms);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Format a number as USD currency */
/** Format a number as currency, defaulting to USD for backward compatibility */
export function formatCurrency(val: number, currency = "USD"): string {
  if (currency === "BTC") {
    return `\u20bf ${val.toFixed(8)}`;
  }
  const isWholeNumber = currency === "JPY" || currency === "CNY";
  const symbol =
    (
      {
        EUR: "\u20ac",
        USD: "$",
        GBP: "\u00a3",
        JPY: "\u00a5",
        CNY: "\u00a5",
        AUD: "A$",
      } as Record<string, string>
    )[currency] ?? currency;
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: isWholeNumber ? 0 : 0,
    maximumFractionDigits: isWholeNumber ? 0 : 0,
  }).format(Math.abs(val));
  return `${val < 0 ? "-" : ""}${symbol}${formatted}`;
}

/** Returns Tailwind class string for deal status badge */
export function dealStatusColor(status: string): string {
  const map: Record<string, string> = {
    [DealStatus.Approved]: "status-badge status-approved",
    [DealStatus.Won]: "status-badge status-won",
    [DealStatus.UnderReview]: "status-badge status-review",
    [DealStatus.Submitted]: "status-badge status-review",
    [DealStatus.Rejected]: "status-badge status-rejected",
    [DealStatus.Lost]: "status-badge status-rejected",
    [DealStatus.Expired]: "status-badge status-rejected",
    [DealStatus.Draft]: "status-badge status-draft",
  };
  return map[status] ?? "status-badge status-draft";
}

/** Human-readable label for deal status */
export function dealStatusLabel(status: string): string {
  const map: Record<string, string> = {
    [DealStatus.Approved]: "Approved",
    [DealStatus.Won]: "Won",
    [DealStatus.UnderReview]: "Under Review",
    [DealStatus.Submitted]: "Submitted",
    [DealStatus.Rejected]: "Rejected",
    [DealStatus.Lost]: "Lost",
    [DealStatus.Expired]: "Expired",
    [DealStatus.Draft]: "Draft",
  };
  return map[status] ?? status;
}

/** Returns Tailwind class for renewal risk color based on days until renewal */
export function renewalRiskColor(daysUntilRenewal: number): string {
  if (daysUntilRenewal <= 30) return "text-red-400";
  if (daysUntilRenewal <= 90) return "text-yellow-400";
  return "text-green-400";
}

/** Returns Tailwind class for account status badge */
export function accountStatusColor(status: string): string {
  const map: Record<string, string> = {
    [AccountStatus.Active]: "status-badge status-approved",
    [AccountStatus.AtRisk]: "status-badge status-review",
    [AccountStatus.Churned]: "status-badge status-rejected",
    [AccountStatus.Prospect]: "status-badge status-draft",
  };
  return map[status] ?? "status-badge status-draft";
}

/** Extract initials from a full name */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Human-readable time-ago from nanosecond timestamp */
export function timeAgo(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
