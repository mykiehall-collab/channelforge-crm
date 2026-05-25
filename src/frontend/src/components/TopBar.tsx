import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Brain,
  Building2,
  CheckSquare,
  ChevronDown,
  FileText,
  Home,
  Menu,
  MessageSquare,
  Moon,
  Plus,
  Sun,
  TrendingUp,
  UserCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { useApp } from "../AppContext";
import { CurrencySelector } from "../components/CurrencySelector";
import { GlobalSearch } from "../components/GlobalSearch";
import { NotificationBell } from "../components/NotificationBell";
import { useForex } from "../hooks/useForex";
import { useTheme } from "../hooks/useTheme";
import { getInitials } from "../utils/channelforge";
import { IS_TEST_MODE } from "../utils/testMode";
import { TestModeDropdown } from "./TestModeDropdown";

// routeTitles kept for potential future use but TopBar no longer shows page title
const _routeTitles: Record<string, string> = {};

function _getTitle(_pathname: string): string {
  return "";
}

function _roleLabel(_role: string): string {
  return "";
}

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const navigate = useNavigate();
  const {
    userProfile,
    companyProfile,
    alerts,
    unreadCount,
    userProfileDetail,
    isTestModeActive,
    testModeRole,
    testModeOrgType,
  } = useApp();
  const forex = useForex();
  const { effectiveTheme, setTheme } = useTheme();
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [forgeAIOpen, setForgeAIOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const quickCreateRef = useRef<HTMLDivElement>(null);
  const forgeAIRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadAlerts = alerts.filter((a) => !a.isRead).length;

  const quickCreateItems = [
    { label: "New Account", icon: Building2, to: "/accounts" },
    { label: "New Opportunity", icon: TrendingUp, to: "/opportunities" },
    {
      label: "New Deal Registration",
      icon: FileText,
      to: "/deal-registrations",
    },
    { label: "New Task", icon: CheckSquare, to: "/tasks" },
    { label: "New Message", icon: MessageSquare, to: "/messages" },
  ];

  const forgeAIItems = [
    { text: "3 renewals are at high risk this week", level: "high" },
    { text: "2 opportunities stalled for 14+ days", level: "medium" },
    { text: "Acme Technologies engagement dropped 40%", level: "high" },
    { text: "Q3 pipeline is 18% below forecast", level: "medium" },
  ];

  function handleLogout() {
    const keys = [
      "cf_session_token",
      "cf_company_type",
      "cf_company_id",
      "cf_subscription",
      "cf_pending_mfa_token",
      "cf_pending_mfa_user_id",
      "cf_prepopulation_dismissed",
    ];
    for (const k of keys) {
      sessionStorage.removeItem(k);
      localStorage.removeItem(k);
    }
    try {
      localStorage.setItem("channelforge-theme", "dark");
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    } catch {}
    navigate({ to: "/login" });
  }

  return (
    <header className="action-bar" data-ocid="topbar.container">
      {IS_TEST_MODE &&
        isTestModeActive &&
        (() => {
          const roleLabel = testModeRole
            ? testModeRole
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (c) => c.toUpperCase())
                .trim()
            : null;
          const orgLabel = testModeOrgType
            ? testModeOrgType
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (c) => c.toUpperCase())
                .trim()
            : null;
          const parts = [roleLabel, orgLabel].filter(Boolean).join(" | ");
          return (
            <div
              data-ocid="topbar.simulation_banner"
              className="w-full bg-orange-500/10 border-b border-orange-500/20 text-orange-400 text-xs text-center py-0.5 font-medium tracking-wide flex items-center justify-center gap-2"
            >
              <span className="text-orange-500/70">⬡</span>
              <span>SIMULATION{parts ? `: ${parts}` : " ACTIVE"}</span>
            </div>
          );
        })()}
      {/* Left: hamburger (mobile) */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden action-icon-btn"
          aria-label="Open menu"
          data-ocid="topbar.menu.button"
        >
          <Menu size={18} />
        </button>
        {/* Company name pill — desktop only */}
        {companyProfile?.companyName && (
          <span className="hidden lg:inline-block text-xs font-semibold text-muted-foreground px-2 py-1 rounded-md bg-secondary/40 border border-border">
            {companyProfile.companyName}
          </span>
        )}
      </div>

      {/* Center: Global search + TestMode + Home icon */}
      <div className="flex-1 flex items-center justify-center px-4 gap-2">
        <GlobalSearch />
        {IS_TEST_MODE && <TestModeDropdown />}
        <button
          type="button"
          data-ocid="topbar.home.button"
          onClick={() => navigate({ to: "/dashboard" })}
          aria-label="Go to Dashboard"
          title="Go to Dashboard"
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-accent transition-all duration-200 hover:bg-accent/10 hover:shadow-[0_0_12px_oklch(var(--accent)/0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Home size={16} />
        </button>
      </div>

      {/* Right: action icons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Quick Create */}
        <div ref={quickCreateRef} className="relative">
          <button
            type="button"
            data-ocid="topbar.quick_create.button"
            onClick={() => {
              setQuickCreateOpen((v) => !v);
              setForgeAIOpen(false);
              setProfileOpen(false);
            }}
            className="action-icon-btn action-icon-btn-accent"
            aria-label="Quick create"
            title="Create new"
          >
            <Plus size={16} />
          </button>
          {quickCreateOpen && (
            <div
              className="dropdown-panel topbar-dropdown-right"
              data-ocid="topbar.quick_create.dropdown"
            >
              {quickCreateItems.map(({ label, icon: Icon, to }) => (
                <button
                  key={to}
                  type="button"
                  onClick={() => {
                    navigate({ to });
                    setQuickCreateOpen(false);
                  }}
                  className="search-result-row"
                  data-ocid={`topbar.quick_create.${label.toLowerCase().replace(/\s+/g, "_")}`}
                >
                  <Icon size={13} className="text-accent flex-shrink-0" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tasks */}
        <button
          type="button"
          data-ocid="topbar.tasks.button"
          onClick={() => navigate({ to: "/tasks" })}
          className="action-icon-btn"
          aria-label="Tasks"
          title="Tasks"
        >
          <CheckSquare size={16} />
        </button>

        {/* Messages */}
        <button
          type="button"
          data-ocid="topbar.messages.button"
          onClick={() => navigate({ to: "/messages" })}
          className="action-icon-btn relative"
          aria-label="Messages"
          title="Messages"
        >
          <MessageSquare size={16} />
          {unreadCount > 0 && (
            <span className="action-badge">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* ForgeAI alerts */}
        <div ref={forgeAIRef} className="relative">
          <button
            type="button"
            data-ocid="topbar.forgeai_alerts.button"
            onClick={() => {
              setForgeAIOpen((v) => !v);
              setQuickCreateOpen(false);
              setProfileOpen(false);
            }}
            className="action-icon-btn action-icon-btn-forgeai relative"
            aria-label="ForgeAI alerts"
            title="ForgeAI Alerts"
          >
            <Brain size={16} />
            {forgeAIItems.length > 0 && (
              <span className="action-badge">{forgeAIItems.length}</span>
            )}
          </button>
          {forgeAIOpen && (
            <div
              className="dropdown-panel topbar-dropdown-right"
              style={{ width: 320 }}
              data-ocid="topbar.forgeai_alerts.dropdown"
            >
              <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
                <Brain size={13} className="text-accent" />
                <span className="text-xs font-semibold text-accent">
                  ForgeAI Operational Alerts
                </span>
              </div>
              {forgeAIItems.map((item, i) => (
                <div
                  key={item.text}
                  className="px-4 py-3 border-b border-border/30 last:border-b-0 flex items-start gap-3"
                  data-ocid={`topbar.forgeai_alert.item.${i + 1}`}
                >
                  <span
                    className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.level === "high" ? "bg-accent" : "bg-yellow-400"}`}
                  />
                  <span className="text-xs text-foreground leading-relaxed">
                    {item.text}
                  </span>
                </div>
              ))}
              <div className="px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => {
                    navigate({ to: "/forge-ai" });
                    setForgeAIOpen(false);
                  }}
                  className="text-xs text-accent hover:text-accent/80 transition-colors"
                  data-ocid="topbar.forgeai_alerts.view_all"
                >
                  View all ForgeAI insights →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications bell */}
        <div className="relative">
          {unreadAlerts > 0 && (
            <span className="action-badge" style={{ top: 6, right: 6 }}>
              {unreadAlerts > 99 ? "99+" : unreadAlerts}
            </span>
          )}
          <NotificationBell />
        </div>

        {/* Theme toggle */}
        {userProfile && (
          <button
            type="button"
            aria-label={
              effectiveTheme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            data-ocid="topbar.theme_toggle.button"
            onClick={() =>
              setTheme(effectiveTheme === "dark" ? "light" : "dark")
            }
            className="action-icon-btn"
          >
            {effectiveTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        )}

        {/* Currency */}
        <CurrencySelector forex={forex} compact />

        {/* User profile */}
        {userProfile && (
          <div ref={profileRef} className="relative">
            <button
              type="button"
              data-ocid="topbar.profile.button"
              onClick={() => {
                setProfileOpen((v) => !v);
                setQuickCreateOpen(false);
                setForgeAIOpen(false);
              }}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-secondary/40 transition-colors"
            >
              {userProfileDetail?.profilePhotoUrl ? (
                <div className="w-6 h-6 rounded-full flex-shrink-0 ring-2 ring-accent p-[1px] bg-accent">
                  <img
                    src={userProfileDetail.profilePhotoUrl}
                    alt={userProfile.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white font-bold text-[9px] flex-shrink-0 ring-2 ring-accent/40">
                  {getInitials(userProfile.fullName)}
                </div>
              )}
              <span className="hidden sm:block text-xs font-medium text-foreground">
                {userProfile.fullName.split(" ")[0]}
              </span>
              <ChevronDown size={12} className="text-muted-foreground" />
            </button>
            {profileOpen && (
              <div
                className="dropdown-panel topbar-dropdown-right"
                style={{ minWidth: 180 }}
                data-ocid="topbar.profile.dropdown"
              >
                <div className="px-4 py-3 border-b border-border/50">
                  <div className="text-xs font-semibold text-foreground">
                    {userProfile.fullName}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {userProfile.role}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigate({
                      to: "/profile/$userId",
                      params: { userId: userProfile.id },
                    });
                    setProfileOpen(false);
                  }}
                  className="search-result-row"
                  data-ocid="topbar.profile.view_profile"
                >
                  <UserCircle size={13} className="text-accent flex-shrink-0" />
                  <span className="text-sm">View Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate({ to: "/admin" });
                    setProfileOpen(false);
                  }}
                  className="search-result-row"
                  data-ocid="topbar.profile.settings"
                >
                  <span className="text-sm">Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setProfileOpen(false);
                  }}
                  className="search-result-row text-destructive"
                  data-ocid="topbar.profile.logout"
                >
                  <span className="text-sm">Sign out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
