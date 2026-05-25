import { useEffect, useRef, useState } from "react";
import { useApp } from "../AppContext";
import {
  FILTER_DIMENSIONS,
  type GlobalFilters,
  type SavedView,
  useFilterContext,
} from "../contexts/FilterContext";
import { useIsMobile } from "../hooks/use-mobile";

const FILTER_OPTIONS: Record<keyof GlobalFilters, string[]> = {
  vendor: ["Adobe", "Microsoft", "NVIDIA", "AWS", "Cisco"],
  distributor: ["ATEA Group", "Crayon", "TD SYNNEX", "Ingram Micro"],
  region: ["EMEA", "APAC", "Americas", "Nordics", "DACH", "UK&I", "Benelux"],
  territory: [
    "North EMEA",
    "South EMEA",
    "APAC Pacific",
    "Americas East",
    "DACH Central",
  ],
  productFamily: [
    "AI Solutions",
    "Cloud Infrastructure",
    "Security",
    "Collaboration",
    "Analytics",
    "Storage",
  ],
  resellerGroup: [
    "Nordic Cloud Group",
    "UK Enterprise Group",
    "DACH Partners",
    "APAC Alliance",
  ],
  opportunityStage: [
    "Prospecting",
    "Qualification",
    "Proposal",
    "Negotiation",
    "Closed Won",
    "Closed Lost",
  ],
  renewalStatus: ["On Track", "At Risk", "Overdue", "Completed"],
  countryTier: ["Tier 1", "Tier 2", "Tier 3"],
  customerSegment: ["Enterprise", "Mid-Market", "SMB", "Public Sector"],
  industry: ["Technology", "Finance", "Healthcare", "Education", "Government"],
  product: [
    "Adobe Acrobat",
    "Microsoft 365",
    "NVIDIA AI Suite",
    "AWS Cloud",
    "Cisco Secure",
  ],
};

const FILTER_LABELS: Record<keyof GlobalFilters, string> = {
  vendor: "Vendor",
  distributor: "Distributor",
  resellerGroup: "Reseller Group",
  product: "Product",
  productFamily: "Product Family",
  territory: "Territory",
  region: "Region",
  countryTier: "Country Tier",
  customerSegment: "Customer Segment",
  industry: "Industry",
  opportunityStage: "Opportunity Stage",
  renewalStatus: "Renewal Status",
};

export function FilterBarSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 flex flex-wrap gap-2 animate-pulse">
      <div className="rounded-full bg-muted h-7 w-24" />
      <div className="rounded-full bg-muted h-7 w-28" />
      <div className="rounded-full bg-muted h-7 w-20" />
      <div className="rounded-full bg-muted h-7 w-32" />
    </div>
  );
}

export default function GlobalFilterBar({ className }: { className?: string }) {
  const {
    filters,
    activeFilterCount,
    savedViews,
    pinnedViews,
    setFilter,
    clearFilters,
    saveCurrentView,
    deleteView,
    pinView,
    unpinView,
    applyView,
    primaryFilters,
    activeFamily,
  } = useFilterContext();

  useApp();

  // Collapse filter bar on screens < 1024px behind a toggle button
  const isCompact = useIsMobile(1024);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<keyof GlobalFilters | null>(
    null,
  );
  const [showSavedViews, setShowSavedViews] = useState(false);
  const [saveViewName, setSaveViewName] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const savedViewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
        setShowMoreFilters(false);
      }
      if (
        savedViewsRef.current &&
        !savedViewsRef.current.contains(event.target as Node)
      ) {
        setShowSavedViews(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const secondaryFilters = FILTER_DIMENSIONS.filter(
    (d) => !primaryFilters.includes(d),
  );

  const activeFilterKeys = FILTER_DIMENSIONS.filter(
    (k) => filters[k] !== null && filters[k] !== "",
  );

  const secondaryFilterCount = secondaryFilters.length;

  const handleSelect = (key: keyof GlobalFilters, value: string) => {
    setFilter(key, value);
    setOpenDropdown(null);
  };

  const handleClearFilter = (key: keyof GlobalFilters) => {
    setFilter(key, null);
  };

  const handleSaveView = () => {
    const name = saveViewName.trim();
    if (name) {
      saveCurrentView(name);
      setSaveViewName("");
    }
  };

  const renderDropdown = (key: keyof GlobalFilters) => {
    if (openDropdown !== key) return null;
    const options = FILTER_OPTIONS[key] || [];
    return (
      <div className="absolute top-full left-0 mt-1 z-50 rounded-lg border border-border shadow-lg bg-card min-w-[180px] py-1 max-h-60 overflow-y-auto">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => handleSelect(key, opt)}
            className={`w-full text-left px-3 py-2 text-xs transition-colors ${
              filters[key] === opt
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-muted"
            }`}
            data-ocid={`filter.${key}.option.${opt}`}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  };

  const renderPill = (key: keyof GlobalFilters) => {
    const isActive = filters[key] !== null && filters[key] !== "";
    const label = FILTER_LABELS[key];
    const value = filters[key];
    // Truncate long display strings inside the pill button itself
    const displayValue = isActive && value ? value : "";

    return (
      <div key={key} className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === key ? null : key)}
          className={`inline-flex items-center gap-1 rounded-full text-xs px-3 py-1.5 max-w-[160px] transition-colors border ${
            isActive
              ? "bg-primary/10 text-primary border-primary/30"
              : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
          }`}
          data-ocid={`filter.${key}.dropdown_button`}
        >
          <span className="truncate">
            {label}
            {isActive ? `: ${displayValue}` : ""}
          </span>
          <span className="inline-block text-[10px] shrink-0">▼</span>
        </button>
        {renderDropdown(key)}
      </div>
    );
  };

  if (!activeFamily) return null;

  // --- Mobile compact mode: show a single toggle button with active count badge ---
  if (isCompact && !mobileOpen) {
    return (
      <div className={`${className ?? ""}`}>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card text-xs px-3 py-2 text-foreground hover:bg-muted transition-colors"
          data-ocid="filter.mobile_toggle_button"
        >
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4h18M7 8h10M11 12h2"
            />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`rounded-lg border border-border bg-card px-3 py-2 flex flex-col gap-2 overflow-visible ${className ?? ""}`}
    >
      {/* Mobile close row */}
      {isCompact && (
        <div className="flex items-center justify-between pb-1 border-b border-border">
          <span className="text-xs font-semibold text-foreground">Filters</span>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              setShowMoreFilters(false);
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="filter.mobile_close_button"
          >
            Done
          </button>
        </div>
      )}

      {/* Primary filters row */}
      <div className="flex flex-wrap items-center gap-2 overflow-visible">
        {primaryFilters.map((key) => renderPill(key))}

        <button
          type="button"
          onClick={() => setShowMoreFilters((s) => !s)}
          className="inline-flex items-center gap-1 rounded-full text-xs px-3 py-1.5 bg-muted text-muted-foreground hover:bg-muted/80 transition-colors border border-transparent shrink-0"
          data-ocid="filter.more_filters_button"
        >
          {showMoreFilters ? "− Less" : `+ ${secondaryFilterCount} more`}
        </button>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={() => clearFilters()}
            className="inline-flex items-center gap-1 rounded-full text-xs px-3 py-1.5 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors border border-destructive/20 shrink-0"
            data-ocid="filter.clear_all_button"
          >
            Clear ({activeFilterCount})
          </button>
        )}

        <div className="relative ml-auto shrink-0" ref={savedViewsRef}>
          <button
            type="button"
            onClick={() => setShowSavedViews((s) => !s)}
            className="inline-flex items-center gap-1.5 rounded-full text-xs px-3 py-1.5 bg-muted text-muted-foreground hover:bg-muted/80 transition-colors border border-transparent"
            data-ocid="filter.saved_views_button"
          >
            Saved Views
            {pinnedViews.length > 0 && (
              <span className="inline-flex items-center justify-center text-[9px] font-bold text-primary-foreground rounded-full bg-primary min-w-[16px] h-[16px] px-1">
                {pinnedViews.length}
              </span>
            )}
          </button>

          {showSavedViews && (
            <div className="absolute right-0 top-full mt-1 z-50 rounded-lg border border-border shadow-lg bg-card min-w-[240px] p-3">
              <div className="text-xs font-semibold text-foreground mb-2">
                Saved Views
              </div>
              {savedViews.length === 0 ? (
                <div className="text-xs text-muted-foreground py-2">
                  No saved views yet.
                </div>
              ) : (
                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto mb-3">
                  {savedViews.map((view) => (
                    <SavedViewItem
                      key={view.id}
                      view={view}
                      onApply={() => {
                        applyView(view);
                        setShowSavedViews(false);
                      }}
                      onDelete={() => deleteView(view.id)}
                      onPin={() => pinView(view.id)}
                      onUnpin={() => unpinView(view.id)}
                    />
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-2 border-t border-border">
                <input
                  type="text"
                  value={saveViewName}
                  onChange={(e) => setSaveViewName(e.target.value)}
                  placeholder="View name..."
                  className="flex-1 rounded-md border border-input bg-background text-xs px-2 py-1 text-foreground outline-none focus:border-primary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveView();
                  }}
                  data-ocid="filter.save_view_input"
                />
                <button
                  type="button"
                  onClick={handleSaveView}
                  className="rounded-md bg-primary text-primary-foreground text-xs px-3 py-1 hover:bg-primary/90 transition-colors"
                  data-ocid="filter.save_view_confirm_button"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active filter pills row — shown when filters are active */}
      {activeFilterKeys.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilterKeys.map((key) => (
            <span
              key={key}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs px-2 py-1 max-w-[200px]"
              data-ocid={`filter.active_pill.${key}`}
            >
              <span className="truncate max-w-[140px]">
                {FILTER_LABELS[key]}: {filters[key]}
              </span>
              <button
                type="button"
                onClick={() => handleClearFilter(key)}
                className="shrink-0 text-primary hover:text-primary/70 font-bold leading-none"
                aria-label={`Remove ${FILTER_LABELS[key]} filter`}
                data-ocid={`filter.active_pill.${key}.remove_button`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Secondary filters row */}
      {showMoreFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
          {secondaryFilters.map((key) => renderPill(key))}
        </div>
      )}
    </div>
  );
}

function SavedViewItem({
  view,
  onApply,
  onDelete,
  onPin,
  onUnpin,
}: {
  view: SavedView;
  onApply: () => void;
  onDelete: () => void;
  onPin: () => void;
  onUnpin: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors">
      <button
        type="button"
        onClick={onApply}
        className="flex-1 min-w-0 text-left text-xs text-foreground truncate max-w-[160px]"
        data-ocid={`filter.saved_view.${view.id}.apply_button`}
      >
        {view.isPinned && <span className="mr-1 text-primary">★</span>}
        <span className="truncate">{view.name}</span>
      </button>
      <div className="flex items-center gap-1 shrink-0">
        {view.isPinned ? (
          <button
            type="button"
            onClick={onUnpin}
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            data-ocid={`filter.saved_view.${view.id}.unpin_button`}
          >
            Unpin
          </button>
        ) : (
          <button
            type="button"
            onClick={onPin}
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            data-ocid={`filter.saved_view.${view.id}.pin_button`}
          >
            Pin
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="text-[10px] text-destructive hover:text-destructive/70 transition-colors"
          data-ocid={`filter.saved_view.${view.id}.delete_button`}
        >
          Del
        </button>
      </div>
    </div>
  );
}
