import { ChevronDown } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { PROVIDER_OPTIONS } from "../../hooks/useForgeAIChat";

interface ForgeAIProviderSelectorProps {
  activeProviderId: string;
  onSelect: (providerId: string) => void;
}

export function ForgeAIProviderSelector({
  activeProviderId,
  onSelect,
}: ForgeAIProviderSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = PROVIDER_OPTIONS.find((p) => p.id === activeProviderId);

  const handleSelect = useCallback(
    (id: string) => {
      onSelect(id);
      setOpen(false);
    },
    [onSelect],
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onKeyDown={handleKeyDown}
      data-ocid="forgeai.provider_selector"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-secondary/40 hover:bg-secondary/70 text-xs font-body text-muted-foreground transition-colors duration-150 min-w-0 max-w-[140px]"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select AI provider"
      >
        <span className="truncate">{active?.name ?? "Native ForgeAI"}</span>
        <ChevronDown className="w-3 h-3 flex-shrink-0" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-label="Close provider selector"
          />
          {/* Dropdown */}
          <div
            className="absolute right-0 top-full mt-1 w-52 z-50 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            data-ocid="forgeai.provider_dropdown"
          >
            <div className="px-3 pt-2.5 pb-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-body">
                AI Provider
              </p>
            </div>
            {PROVIDER_OPTIONS.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={p.id === activeProviderId}
                onClick={() => handleSelect(p.id)}
                className={`w-full text-left px-3 py-2 flex items-center justify-between gap-2 transition-colors duration-100 hover:bg-secondary/50 ${
                  p.id === activeProviderId ? "text-primary" : "text-foreground"
                } ${!p.isAvailable ? "opacity-60" : ""}`}
              >
                <span className="text-xs font-body truncate">{p.name}</span>
                <span className="flex gap-1 flex-shrink-0">
                  {p.id === activeProviderId && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-mono">
                      Active
                    </span>
                  )}
                  {!p.isAvailable && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono">
                      Soon
                    </span>
                  )}
                </span>
              </button>
            ))}
            <div className="px-3 py-2 border-t border-border mt-1">
              <p className="text-[10px] text-muted-foreground font-body">
                External AI activation coming in a future update.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
