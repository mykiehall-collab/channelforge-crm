import type React from "react";
import { PartnerTier } from "../backend";

interface TierBadgeProps {
  tier: PartnerTier | "Silver" | "Gold" | "Platinum";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const TIER_STYLES: Record<
  string,
  {
    background: string;
    color: string;
    border: string;
    shimmer?: string;
    label: string;
  }
> = {
  [PartnerTier.Silver]: {
    background:
      "linear-gradient(135deg, #A8A9AD 0%, #C4C5C9 50%, #A8A9AD 100%)",
    color: "#1a1a1a",
    border: "rgba(196,197,201,0.4)",
    label: "Silver",
  },
  [PartnerTier.Gold]: {
    background:
      "linear-gradient(135deg, #C9A227 0%, #F0CC5A 50%, #C9A227 100%)",
    color: "#1a1a0a",
    border: "rgba(240,204,90,0.4)",
    label: "Gold",
  },
  [PartnerTier.Platinum]: {
    background:
      "linear-gradient(135deg, #4A4A4F 0%, #6B6B70 40%, #5a5a60 70%, #4A4A4F 100%)",
    color: "#f0f0f2",
    border: "rgba(107,107,112,0.5)",
    shimmer:
      "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent after:rounded-full",
    label: "Platinum",
  },
};

const SIZE_CLASSES: Record<
  string,
  { container: string; text: string; dot: string }
> = {
  sm: {
    container: "px-2 py-0.5 gap-1",
    text: "text-[10px] font-bold tracking-wide",
    dot: "w-1.5 h-1.5",
  },
  md: {
    container: "px-2.5 py-1 gap-1.5",
    text: "text-xs font-bold tracking-wide",
    dot: "w-2 h-2",
  },
  lg: {
    container: "px-4 py-1.5 gap-2",
    text: "text-sm font-bold tracking-wide uppercase",
    dot: "w-2.5 h-2.5",
  },
};

export default function TierBadge({
  tier,
  size = "md",
  showLabel = true,
}: TierBadgeProps) {
  const styles = TIER_STYLES[tier as string] ?? TIER_STYLES[PartnerTier.Silver];
  const sizes = SIZE_CLASSES[size];

  return (
    <span
      className={`relative inline-flex items-center rounded-full overflow-hidden border ${sizes.container}`}
      style={{
        background: styles.background,
        borderColor: styles.border,
        boxShadow: `0 1px 4px ${styles.border}`,
      }}
      aria-label={`${styles.label} tier`}
    >
      {/* Dot indicator */}
      <span
        className={`rounded-full flex-shrink-0 ${sizes.dot}`}
        style={{
          background: styles.color,
          opacity: 0.55,
        }}
      />
      {/* Label */}
      {showLabel && (
        <span
          className={sizes.text}
          style={{ color: styles.color, letterSpacing: "0.04em" }}
        >
          {styles.label}
        </span>
      )}
    </span>
  );
}

export { TierBadge };
