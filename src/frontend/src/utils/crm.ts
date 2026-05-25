import { Calendar, FileText, Mail, Phone, TrendingUp } from "lucide-react";
import type React from "react";

export function nsToDate(ns: bigint): Date {
  return new Date(Number(ns) / 1_000_000);
}

export function dateToNs(date: Date): bigint {
  return BigInt(date.getTime()) * BigInt(1_000_000);
}

export function timeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatCurrency(amount: bigint, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const stageLabels: Record<string, string> = {
  lead: "Lead",
  qualified: "Qualified",
  proposal: "Proposal",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

export const STAGE_ORDER = [
  "lead",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const;

export function lookupContactName(
  contacts: { id: bigint; name: string }[],
  id: bigint,
): string {
  return contacts.find((c) => c.id === id)?.name ?? "\u2014";
}

export function lookupAccountName(
  accounts: { id: bigint; name: string }[],
  id: bigint,
): string {
  return accounts.find((a) => a.id === id)?.name ?? "\u2014";
}

export function stageColor(stage: string): string {
  const map: Record<string, string> = {
    lead: "bg-[#2A3548] text-[#A9B6C9]",
    qualified: "bg-[#1E3E73] text-[#BBD7FF]",
    proposal: "bg-[#3D2A6E] text-[#D4BBFF]",
    negotiation: "bg-[#1E3A5F] text-[#9DD4FF]",
    won: "bg-[#1A3D2A] text-[#7DDFAA]",
    lost: "bg-[#3D1A1A] text-[#FFB3B3]",
  };
  return map[stage] ?? "bg-[#2A3548] text-[#A9B6C9]";
}

export function priorityColor(priority: string): string {
  const map: Record<string, string> = {
    low: "bg-[#2A3548] text-[#A9B6C9]",
    medium: "bg-[#5A4420] text-[#F1D08A]",
    high: "bg-[#7A2A2F] text-[#F1B7BE]",
    urgent: "bg-[#6A2A2A] text-[#FFB3B3]",
  };
  return map[priority] ?? "bg-[#2A3548] text-[#A9B6C9]";
}

export const activityTypeConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  email: { label: "Email", color: "#C084FC", bg: "#3B1D5C" },
  call: { label: "Call", color: "#2D7BFF", bg: "#1E3A5F" },
  meeting: { label: "Meeting", color: "#34D399", bg: "#1A3D2A" },
  note: { label: "Note", color: "#94A3B8", bg: "#2A3548" },
  dealUpdate: { label: "Deal Update", color: "#818CF8", bg: "#2D2D5F" },
};

export const activityIconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  email: Mail,
  call: Phone,
  meeting: Calendar,
  note: FileText,
  dealUpdate: TrendingUp,
};

export const kanbanColumns: Array<{
  stage: string;
  label: string;
  accent: string;
}> = [
  { stage: "qualified", label: "Qualified", accent: "#2A3548" },
  { stage: "proposal", label: "Proposal", accent: "#7D4CFF" },
  { stage: "negotiation", label: "Negotiation", accent: "#2D7BFF" },
  { stage: "won", label: "Won", accent: "#2BB673" },
  { stage: "lost", label: "Lost", accent: "#E24B4B" },
];

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

export function groupByDate(
  items: Array<{ date: Date; [key: string]: unknown }>,
): Record<string, typeof items> {
  const groups: Record<string, typeof items> = {};
  for (const item of items) {
    let key: string;
    if (isToday(item.date)) key = "Today";
    else if (isYesterday(item.date)) key = "Yesterday";
    else
      key = item.date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
}

export function groupActivitiesByDate(
  activities: Array<{ createdAt: bigint; [key: string]: unknown }>,
): Record<string, Array<{ createdAt: bigint; [key: string]: unknown }>> {
  const groups: Record<
    string,
    Array<{ createdAt: bigint; [key: string]: unknown }>
  > = {};
  for (const act of activities) {
    const d = nsToDate(act.createdAt);
    let key: string;
    if (isToday(d)) key = "Today";
    else if (isYesterday(d)) key = "Yesterday";
    else
      key = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    if (!groups[key]) groups[key] = [];
    groups[key].push(act);
  }
  return groups;
}
