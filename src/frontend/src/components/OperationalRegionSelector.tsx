import { useState } from "react";
import { OPERATIONAL_REGIONS } from "../data/operationalRegions";

interface OperationalRegionSelectorProps {
  selectedRegionId: string | null;
  isLocked: boolean;
  onSelect: (regionId: string) => void;
}

export default function OperationalRegionSelector({
  selectedRegionId,
  isLocked,
  onSelect,
}: OperationalRegionSelectorProps) {
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {OPERATIONAL_REGIONS.map((region) => {
        const isSelected = region.id === selectedRegionId;
        const isExpanded = expandedRegion === region.id;

        return (
          <div
            key={region.id}
            className={[
              "rounded-xl border p-5 transition-all cursor-pointer",
              isSelected
                ? "border-orange-500 ring-1 ring-orange-500/50 bg-[#0f2040]"
                : "border-white/10 bg-[#0a1628] hover:border-white/20",
            ].join(" ")}
          >
            {/* Top row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl" role="img" aria-label={region.name}>
                  {region.icon}
                </span>
                <h3 className="font-bold text-white text-sm">{region.name}</h3>
              </div>
              {isSelected && (
                <span className="flex items-center gap-1 text-orange-400 text-xs font-medium">
                  🔒 Current Region
                </span>
              )}
            </div>

            {/* Sub-regions */}
            <div className="flex flex-wrap gap-1 mt-2">
              {region.subRegions.map((sub) => (
                <span
                  key={sub.name}
                  className="bg-white/5 text-white/60 text-xs rounded px-2 py-0.5"
                >
                  {sub.name}
                </span>
              ))}
            </div>

            {/* Toggle details */}
            <button
              type="button"
              onClick={() => setExpandedRegion(isExpanded ? null : region.id)}
              className="text-white/40 text-xs flex items-center gap-1 mt-3 hover:text-white/60 transition-colors"
            >
              <span>{isExpanded ? "▲" : "▼"}</span>
              <span>{isExpanded ? "Hide details" : "View details"}</span>
            </button>

            {isExpanded && region.optimizedFor && (
              <ul className="mt-2 space-y-1">
                {region.optimizedFor.map((item) => (
                  <li
                    key={item}
                    className="text-white/50 text-xs list-disc ml-4"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {/* Action area */}
            {!isLocked && (
              <button
                type="button"
                onClick={() => onSelect(region.id)}
                className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
              >
                Select Region
              </button>
            )}

            {isLocked && isSelected && (
              <div className="mt-3 flex items-center justify-center gap-2 text-orange-400 text-sm">
                🔒 Region Locked
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
