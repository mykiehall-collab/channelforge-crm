import { useNavigate } from "@tanstack/react-router";
import {
  Brain,
  Building2,
  Clock,
  FileText,
  Plus,
  Search,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const RECENT_KEY = "cf_recent_searches";

const MOCK_ACCOUNTS = [
  { id: "1", name: "Acme Technologies", customerId: "ACME-0012" },
  { id: "2", name: "Global Dynamics Ltd", customerId: "GDYN-0034" },
  { id: "3", name: "Nexus Solutions", customerId: "NXSOL-0078" },
];
const MOCK_OPPS = [
  { id: "1", name: "Q3 Renewal - Acme", value: "£48,500" },
  {
    id: "2",
    name: "Enterprise Expansion - Global Dynamics",
    value: "£112,000",
  },
];
const MOCK_CONTACTS = [
  { id: "1", name: "Sarah Mitchell", company: "Acme Technologies" },
  { id: "2", name: "David Chen", company: "Nexus Solutions" },
];
const MOCK_REPORTS = [
  { id: "1", name: "Q3 Renewal Pipeline Report" },
  { id: "2", name: "Channel Partner Performance" },
];

const QUICK_ACTIONS = [
  { label: "Create New Account", to: "/accounts", icon: Building2 },
  { label: "New Opportunity", to: "/opportunities", icon: TrendingUp },
  { label: "New Deal Registration", to: "/deal-registrations", icon: FileText },
];

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function saveRecentSearch(q: string) {
  const prev = getRecentSearches();
  const updated = [q, ...prev.filter((s) => s !== q)].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

export function GlobalSearch() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recents on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Click-outside close
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const q = query.toLowerCase().trim();
  const filteredAccounts = q
    ? MOCK_ACCOUNTS.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.customerId.toLowerCase().includes(q),
      )
    : [];
  const filteredOpps = q
    ? MOCK_OPPS.filter((o) => o.name.toLowerCase().includes(q))
    : [];
  const filteredContacts = q
    ? MOCK_CONTACTS.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q),
      )
    : [];
  const filteredReports = q
    ? MOCK_REPORTS.filter((r) => r.name.toLowerCase().includes(q))
    : [];

  const hasResults =
    filteredAccounts.length > 0 ||
    filteredOpps.length > 0 ||
    filteredContacts.length > 0 ||
    filteredReports.length > 0;

  const forgeAISuggestion = q
    ? `Analyse accounts matching "${q}" for renewal risk`
    : "Show me accounts with renewal risk this quarter";

  function handleSelect(to: string, label: string) {
    saveRecentSearch(label);
    setRecentSearches(getRecentSearches());
    navigate({ to });
    setOpen(false);
    setQuery("");
  }

  function handleRecentClick(s: string) {
    setQuery(s);
    inputRef.current?.focus();
  }

  return (
    <div
      ref={containerRef}
      className="global-search-wrapper"
      data-ocid="global_search.container"
    >
      {/* Input */}
      <div className="global-search-bar">
        <Search size={14} className="global-search-icon" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search accounts, opportunities, reports…"
          className="global-search-input"
          aria-label="Global search"
          aria-expanded={open}
          aria-haspopup="listbox"
          data-ocid="global_search.search_input"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="global-search-clear"
            aria-label="Clear search"
          >
            <X size={12} />
          </button>
        ) : (
          <span className="global-search-shortcut">⌘K</span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="dropdown-panel global-search-dropdown"
          aria-label="Search results"
          tabIndex={-1}
          data-ocid="global_search.dropdown"
        >
          {/* Recent searches — show when no query */}
          {!q && recentSearches.length > 0 && (
            <div className="search-group">
              <div className="search-group-label">
                <Clock size={10} className="inline mr-1" />
                Recent
              </div>
              {recentSearches.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleRecentClick(s)}
                  className="search-result-row"
                  data-ocid="global_search.recent_item"
                >
                  <Clock
                    size={12}
                    className="search-result-icon text-muted-foreground"
                  />
                  <span className="text-sm text-foreground">{s}</span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Actions — show when no query */}
          {!q && (
            <div className="search-group">
              <div className="search-group-label">
                <Plus size={10} className="inline mr-1" />
                Quick Actions
              </div>
              {QUICK_ACTIONS.map(({ label, to, icon: Icon }) => (
                <button
                  key={to}
                  type="button"
                  onClick={() => handleSelect(to, label)}
                  className="search-result-row"
                  data-ocid="global_search.quick_action"
                >
                  <Icon size={12} className="search-result-icon text-accent" />
                  <span className="text-sm text-foreground">{label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Live results */}
          {q && (
            <>
              {filteredAccounts.length > 0 && (
                <div className="search-group">
                  <div className="search-group-label">
                    <Building2 size={10} className="inline mr-1" />
                    Accounts
                  </div>
                  {filteredAccounts.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => handleSelect(`/accounts/${a.id}`, a.name)}
                      className="search-result-row"
                      data-ocid="global_search.account_result"
                    >
                      <Building2
                        size={12}
                        className="search-result-icon text-accent"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">
                          {a.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {a.customerId}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {filteredOpps.length > 0 && (
                <div className="search-group">
                  <div className="search-group-label">
                    <TrendingUp size={10} className="inline mr-1" />
                    Opportunities
                  </div>
                  {filteredOpps.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => handleSelect("/opportunities", o.name)}
                      className="search-result-row"
                      data-ocid="global_search.opportunity_result"
                    >
                      <TrendingUp
                        size={12}
                        className="search-result-icon text-accent"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">
                          {o.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {o.value}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {filteredContacts.length > 0 && (
                <div className="search-group">
                  <div className="search-group-label">
                    <Users size={10} className="inline mr-1" />
                    Contacts
                  </div>
                  {filteredContacts.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelect("/contacts", c.name)}
                      className="search-result-row"
                      data-ocid="global_search.contact_result"
                    >
                      <Users
                        size={12}
                        className="search-result-icon text-accent"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">
                          {c.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {c.company}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {filteredReports.length > 0 && (
                <div className="search-group">
                  <div className="search-group-label">
                    <FileText size={10} className="inline mr-1" />
                    Reports
                  </div>
                  {filteredReports.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleSelect("/reports", r.name)}
                      className="search-result-row"
                      data-ocid="global_search.report_result"
                    >
                      <FileText
                        size={12}
                        className="search-result-icon text-accent"
                      />
                      <span className="text-sm text-foreground">{r.name}</span>
                    </button>
                  ))}
                </div>
              )}
              {!hasResults && (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}
            </>
          )}

          {/* ForgeAI suggestion */}
          <div
            className="search-forgeai-row"
            data-ocid="global_search.forgeai_suggestion"
          >
            <Brain
              size={13}
              className="text-accent flex-shrink-0 intelligence-pulse"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">
                ForgeAI suggests
              </span>
              <span className="text-xs text-foreground truncate">
                {forgeAISuggestion}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
