import { Building2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Account } from "../backend";

interface AccountSearchBarProps {
  accounts: Account[];
  onSelect: (account: Account) => void;
}

export function AccountSearchBar({
  accounts,
  onSelect,
}: AccountSearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? accounts
        .filter((a) => {
          const q = query.toLowerCase();
          return (
            a.accountName.toLowerCase().includes(q) ||
            (a.customerIdNumber ?? "").toLowerCase().includes(q) ||
            a.id.toLowerCase().includes(q)
          );
        })
        .slice(0, 8)
    : [];

  useEffect(() => {
    setActiveIdx(-1);
    setOpen(filtered.length > 0);
  }, [filtered.length]);

  // Close on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(filtered[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  function handleSelect(account: Account) {
    onSelect(account);
    setQuery("");
    setOpen(false);
    setActiveIdx(-1);
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      data-ocid="dashboard.search.section"
    >
      {/* Input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => filtered.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search accounts by name, number or Customer ID…"
          aria-label="Search accounts"
          aria-autocomplete="list"
          aria-expanded={open}
          data-ocid="dashboard.search.input"
          className="w-full crm-input pl-11 pr-10 py-3 text-sm rounded-xl transition-colors focus:border-orange-500/60 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            aria-label="Clear search"
            data-ocid="dashboard.search.clear_button"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <div
          className="absolute top-full mt-2 left-0 right-0 z-50 rounded-xl border border-border overflow-hidden shadow-2xl"
          style={{
            background: "rgba(10,20,38,0.98)",
            backdropFilter: "blur(12px)",
          }}
          tabIndex={-1}
          aria-label="Search results"
          data-ocid="dashboard.search.results.dropdown"
        >
          {filtered.map((account, idx) => (
            <button
              key={account.id}
              type="button"
              aria-selected={activeIdx === idx}
              data-ocid={`dashboard.search.result.${idx + 1}`}
              onClick={() => handleSelect(account)}
              onMouseEnter={() => setActiveIdx(idx)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-border/40 last:border-0 ${
                activeIdx === idx ? "bg-orange-500/10" : "hover:bg-secondary/30"
              }`}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: "rgba(255,107,43,0.12)",
                  color: "#FF6B2B",
                }}
              >
                {account.accountName[0]?.toUpperCase() ?? (
                  <Building2 size={12} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {account.accountName}
                </p>
                {account.customerIdNumber && (
                  <p className="text-[11px] text-muted-foreground truncate font-mono">
                    {account.customerIdNumber}
                  </p>
                )}
              </div>
              {account.resellerOwnerId && (
                <span className="text-[10px] text-muted-foreground flex-shrink-0 truncate max-w-[100px]">
                  {account.resellerOwnerId}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
