import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  AlertTriangle,
  Award,
  BarChart2,
  Bell,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
  Flame,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquare,
  Moon,
  Network,
  Newspaper,
  Receipt,
  RefreshCcw,
  ScrollText,
  Settings,
  Sun,
  Tag,
  TrendingUp,
  User,
} from "lucide-react";
import type React from "react";
import { useMemo, useRef, useState } from "react";
import { useApp } from "../AppContext";
import { UserRole } from "../backend";
import { useTheme } from "../hooks/useTheme";
import { getInitials } from "../utils/channelforge";
import {
  type OperationalRole,
  ROLE_DISPLAY_NAMES,
  ROLE_NAV_PRIORITY,
  ROLE_PRIMARY_TABS,
  ROLE_SECONDARY_TABS,
  deriveOperationalRoleFromString,
} from "../utils/roleIntelligenceEngine";
import { IS_TEST_MODE } from "../utils/testMode";

const allNavItems: {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact: boolean;
  alwaysVisible: boolean;
  vendorAdminOnly?: boolean;
  primaryAdminOnly?: boolean;
  reportsSubItem?: boolean;
  distributorAdminOnly?: boolean;
  resellerAdminOnly?: boolean;
  profileItem?: boolean;
}[] = [
  // NOTE: Home is intentionally removed from the sidebar nav list.
  // It is accessible via the Home icon in the TopBar (beside the search bar).
  {
    to: "/profile/$userId",
    label: "Profile",
    icon: User,
    exact: false,
    alwaysVisible: true,
    profileItem: true,
  },
  {
    to: "/tasks",
    label: "Tasks",
    icon: CheckSquare,
    exact: false,
    alwaysVisible: true,
  },
  {
    to: "/forge-ai",
    label: "ForgeAI",
    icon: Brain,
    exact: false,
    alwaysVisible: true,
  },
  {
    to: "/accounts",
    label: "Accounts",
    icon: Building2,
    exact: false,
    alwaysVisible: true,
  },
  {
    to: "/deal-registrations",
    label: "Deal Registrations",
    icon: Briefcase,
    exact: false,
    alwaysVisible: true,
  },
  {
    to: "/opportunities",
    label: "Opportunities",
    icon: TrendingUp,
    exact: false,
    alwaysVisible: true,
  },
  {
    to: "/quotes",
    label: "Quotes",
    icon: Receipt,
    exact: false,
    alwaysVisible: true,
  },
  {
    to: "/renewals",
    label: "Renewals",
    icon: RefreshCcw,
    exact: false,
    alwaysVisible: true,
  },
  {
    to: "/reports",
    label: "Reports",
    icon: BarChart2,
    exact: false,
    alwaysVisible: true,
  },
  {
    to: "/business-plans",
    label: "Business Plans",
    icon: BookOpen,
    exact: false,
    alwaysVisible: false,
  },
  {
    to: "/promotions",
    label: "Promotions",
    icon: Tag,
    exact: false,
    alwaysVisible: false,
  },
  {
    to: "/mdf-requests",
    label: "MDF Requests",
    icon: DollarSign,
    exact: false,
    alwaysVisible: false,
  },
  {
    to: "/marketing-activities",
    label: "Marketing Activities",
    icon: Megaphone,
    exact: false,
    alwaysVisible: false,
  },
  {
    to: "/price-lists",
    label: "Price Lists",
    icon: FileText,
    exact: false,
    alwaysVisible: false,
  },
  {
    to: "/news",
    label: "Latest News",
    icon: Newspaper,
    exact: false,
    alwaysVisible: true,
  },
  {
    to: "/alerts",
    label: "Alerts",
    icon: Bell,
    exact: false,
    alwaysVisible: true,
  },
  {
    to: "/foundry",
    label: "The Foundry",
    icon: Flame,
    exact: false,
    alwaysVisible: false,
  },
  {
    to: "/foundry-lite",
    label: "Foundry Lite",
    icon: Layers,
    exact: false,
    alwaysVisible: true,
  },
  {
    to: "/admin",
    label: "Admin Settings",
    icon: Settings,
    exact: false,
    alwaysVisible: false,
  },
  {
    to: "/distributor-admin",
    label: "Distributor Admin",
    icon: Settings,
    exact: false,
    alwaysVisible: false,
    distributorAdminOnly: true,
  },
  {
    to: "/reseller-admin",
    label: "Reseller Admin",
    icon: Settings,
    exact: false,
    alwaysVisible: false,
    resellerAdminOnly: true,
  },
  {
    to: "/admin/tiers",
    label: "Reseller Tiers",
    icon: Award,
    exact: false,
    alwaysVisible: false,
    vendorAdminOnly: true,
  },
  {
    to: "/messages",
    label: "Messages",
    icon: MessageSquare,
    exact: false,
    alwaysVisible: true,
  },
  {
    to: "/linked-workspaces",
    label: "Linked Workspaces",
    icon: Network,
    exact: false,
    alwaysVisible: false,
  },
  {
    to: "/reports/qtd",
    label: "QTD Dashboard",
    icon: BarChart2,
    exact: true,
    alwaysVisible: false,
    vendorAdminOnly: false,
    reportsSubItem: true,
  },
  {
    to: "/admin/quarter-setup",
    label: "Quarter Setup",
    icon: Settings,
    exact: true,
    alwaysVisible: false,
    vendorAdminOnly: true,
  },
  {
    to: "/admin/targets",
    label: "Target Measures",
    icon: Award,
    exact: true,
    alwaysVisible: false,
    vendorAdminOnly: false,
    primaryAdminOnly: true,
  },
  {
    to: "/audit-log",
    label: "Audit Log",
    icon: ScrollText,
    exact: true,
    alwaysVisible: false,
    vendorAdminOnly: true,
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const {
    userProfile,
    userProfileDetail,
    alerts,
    isVendor,
    isDistributor,
    isReseller,
    hasPermission,
    isPrimaryAdmin,
    isSecondaryAdmin,
    unreadCount,
    channelLinks,
    companyProfile,
    testModeOrgType,
    testModeRole,
    isTestModeActive,
  } = useApp();

  // Effective org type and role — driven by Test Experience Mode when active
  const effectiveOrgType: string =
    IS_TEST_MODE && testModeOrgType
      ? testModeOrgType
      : (companyProfile?.companyType ?? "Vendor");

  const effectiveRole = useMemo<OperationalRole>(() => {
    if (IS_TEST_MODE && testModeRole) {
      return testModeRole as OperationalRole;
    }
    const roleStr = String(userProfile?.role ?? "");
    return deriveOperationalRoleFromString(roleStr);
  }, [testModeRole, userProfile?.role]);
  const activeChannelLinkCount = (channelLinks ?? []).filter(
    (l: any) => l?.status === "Active",
  ).length;
  const { effectiveTheme, setTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  // View All expansion — session-only (ref so it doesn't persist on refresh)
  const viewAllSessionRef = useRef<Record<string, boolean>>({});
  const [viewAllExpanded, setViewAllExpanded] = useState(false);

  function handleToggleViewAll() {
    const next = !viewAllExpanded;
    setViewAllExpanded(next);
    viewAllSessionRef.current[effectiveRole] = next;
  }

  // Collapse state — persisted in localStorage
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("cf_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  function toggleCollapse() {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem("cf_sidebar_collapsed", String(next));
    } catch {}
  }

  const pathname = routerState.location.pathname;
  const unreadAlerts = alerts.filter((a) => !a.isRead).length;

  function isActive(to: string, exact?: boolean) {
    if (exact) return pathname === to;
    return pathname.startsWith(to);
  }

  // Is this user a full admin? Admins bypass tab gating.
  const isAdmin = isPrimaryAdmin() || isSecondaryAdmin();

  function canSeeItem(item: (typeof allNavItems)[number]) {
    // Org-type checks use effectiveOrgType so Test Mode persona switching is reflected
    const effIsVendor =
      IS_TEST_MODE && testModeOrgType
        ? effectiveOrgType === "Vendor"
        : isVendor();
    const effIsDistributor =
      IS_TEST_MODE && testModeOrgType
        ? effectiveOrgType === "Distributor" ||
          effectiveOrgType === "Global Distributor"
        : isDistributor();
    const effIsReseller =
      IS_TEST_MODE && testModeOrgType
        ? effectiveOrgType === "Reseller" ||
          effectiveOrgType === "Multi-Group Reseller"
        : isReseller();

    // Hard access gates — always enforced regardless of role tab gating
    if (item.distributorAdminOnly) {
      return effIsDistributor && (isPrimaryAdmin() || isSecondaryAdmin());
    }
    if (item.resellerAdminOnly) {
      return effIsReseller && (isPrimaryAdmin() || isSecondaryAdmin());
    }
    if (item.primaryAdminOnly) {
      return isPrimaryAdmin();
    }
    if (item.vendorAdminOnly) {
      return (
        userProfile?.role === UserRole.VendorAdmin ||
        userProfile?.role === UserRole.VendorPrimaryAdmin
      );
    }
    if (item.reportsSubItem) {
      return isVendor() || isDistributor() || hasPermission("view_reports");
    }
    // Profile item is always visible
    if (item.profileItem) return true;

    // The Foundry: only admins and Sales Ops see this
    if (item.to === "/foundry") {
      return (
        isPrimaryAdmin() ||
        isSecondaryAdmin() ||
        effectiveRole === "salesOps" ||
        effectiveRole === "itOperations" ||
        effectiveRole === "securityAdmin" ||
        effectiveRole === "finance"
      );
    }

    // Admins bypass all role tab gating — they always see everything accessible
    if (isPrimaryAdmin()) {
      if (item.alwaysVisible) return true;
      if (effIsVendor) return true;
      if (effIsDistributor)
        return item.to !== "/admin" && item.to !== "/admin/tiers";
      return effIsReseller || item.alwaysVisible;
    }
    if (isSecondaryAdmin()) {
      // Secondary admin: all tabs except foundry infrastructure-level
      if (item.to === "/foundry") return false;
      if (item.alwaysVisible) return true;
      if (effIsVendor) return true;
      if (effIsDistributor)
        return item.to !== "/admin" && item.to !== "/admin/tiers";
      return effIsReseller || item.alwaysVisible;
    }

    // ── Role-based tab gating ──────────────────────────────────────────────
    // All non-admin users: only items in their primary + secondary tab list
    // are ever accessible. Items not listed are never shown.
    const primaryPaths = ROLE_PRIMARY_TABS[effectiveRole] ?? [];
    const secondaryPaths = ROLE_SECONDARY_TABS[effectiveRole] ?? [];
    const allAllowedPaths = new Set([...primaryPaths, ...secondaryPaths]);

    // Always allow foundry-lite for all end users
    if (item.to === "/foundry-lite") return true;
    // Always allow alerts for everyone
    if (item.to === "/alerts") return true;
    // Always allow news for everyone
    if (item.to === "/news")
      return (
        allAllowedPaths.has("/news") ||
        secondaryPaths.includes("/news") ||
        primaryPaths.includes("/news")
      );

    return allAllowedPaths.has(item.to);
  }

  function handleLogout() {
    const storageKeys = [
      "cf_session_token",
      "cf_company_type",
      "cf_company_id",
      "cf_subscription",
      "cf_pending_mfa_token",
      "cf_pending_mfa_user_id",
      "cf_prepopulation_dismissed",
    ];
    for (const key of storageKeys) {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    }
    try {
      localStorage.setItem("channelforge-theme", "dark");
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    } catch {}
    navigate({ to: "/login" });
  }

  const visibleItems = allNavItems.filter(canSeeItem);

  // Admin paths — always rendered in separate admin section
  const adminPaths = [
    "/admin",
    "/distributor-admin",
    "/reseller-admin",
    "/admin/tiers",
    "/admin/quarter-setup",
    "/admin/targets",
    "/audit-log",
  ];

  // Foundry path shows in primary nav for relevant roles; admins see it in admin section
  const foundryPath = "/foundry";

  // Map role priority keys to nav item `to` paths (for admin reordering)
  const PRIORITY_KEY_TO_PATH: Record<string, string> = {
    accounts: "/accounts",
    opportunities: "/opportunities",
    renewals: "/renewals",
    tasks: "/tasks",
    messaging: "/messages",
    forgeai: "/forge-ai",
    reports: "/reports",
    foundry: "/foundry",
    dealRegistrations: "/deal-registrations",
  };

  // Split items into primary, secondary, and admin buckets
  const { primaryItems, secondaryItems, adminItems } = useMemo(() => {
    const nonAdmin = visibleItems.filter(
      (i) => !adminPaths.includes(i.to) && !i.profileItem,
    );

    if (isAdmin) {
      // Admins: reorder by ROLE_NAV_PRIORITY but show everything in main nav
      const priorityKeys = ROLE_NAV_PRIORITY[effectiveRole] ?? [];
      const priorityPaths = priorityKeys
        .map((k) => PRIORITY_KEY_TO_PATH[k])
        .filter(Boolean);
      const prioritised = priorityPaths
        .map((path) => nonAdmin.find((i) => i.to === path))
        .filter((i): i is (typeof nonAdmin)[number] => i !== undefined);
      const prioritisedSet = new Set(priorityPaths);
      const remaining = nonAdmin.filter((i) => !prioritisedSet.has(i.to));
      return {
        primaryItems: [...prioritised, ...remaining],
        secondaryItems: [] as typeof nonAdmin,
        adminItems: visibleItems.filter(
          (i) => adminPaths.includes(i.to) || i.to === foundryPath,
        ),
      };
    }

    // Non-admin: strict primary/secondary split
    const primaryPaths = ROLE_PRIMARY_TABS[effectiveRole] ?? [];
    const secondaryPaths = ROLE_SECONDARY_TABS[effectiveRole] ?? [];

    // Primary: in defined order from ROLE_PRIMARY_TABS
    const primary = primaryPaths
      .map((path) => nonAdmin.find((i) => i.to === path))
      .filter((i): i is (typeof nonAdmin)[number] => i !== undefined);

    // Secondary: items in ROLE_SECONDARY_TABS that aren't already in primary
    const primarySet = new Set(primaryPaths);
    const secondary = secondaryPaths
      .map((path) => nonAdmin.find((i) => i.to === path))
      .filter((i): i is (typeof nonAdmin)[number] => i !== undefined)
      .filter((i) => !primarySet.has(i.to));

    // Utility items always shown at bottom of primary (alerts, news, foundry-lite)
    const utilityPaths = new Set(["/alerts", "/news", "/foundry-lite"]);
    const utilities = nonAdmin.filter(
      (i) =>
        utilityPaths.has(i.to) &&
        !primarySet.has(i.to) &&
        !secondaryPaths.includes(i.to),
    );

    return {
      primaryItems: [...primary, ...utilities],
      secondaryItems: secondary,
      adminItems: visibleItems.filter((i) => adminPaths.includes(i.to)),
    };
  }, [visibleItems, effectiveRole, isAdmin]);

  const w = collapsed ? "nav-rail-collapsed" : "nav-rail-expanded";

  return (
    <aside
      className={`nav-rail ${w} flex flex-col flex-shrink-0`}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="nav-rail-header">
        <div
          className="flex flex-col justify-center"
          style={{
            lineHeight: 1,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          <div className="flex items-baseline">
            <span className="font-black text-[13px] text-muted-foreground">
              {collapsed ? "CF" : "CHANNEL"}
            </span>
            {!collapsed && (
              <span className="font-black text-[13px] text-accent forge-pulse">
                FORGE
              </span>
            )}
          </div>
          {!collapsed && (
            <div className="text-[8px] font-medium tracking-[0.28em] uppercase text-muted-foreground mt-0.5">
              CRM
            </div>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
            aria-label="Close sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Distributor badge */}
      {(IS_TEST_MODE && testModeOrgType
        ? effectiveOrgType === "Distributor" ||
          effectiveOrgType === "Global Distributor"
        : isDistributor()) &&
        !collapsed && (
          <div className="nav-workspace-badge">
            <Network size={12} className="text-accent flex-shrink-0" />
            <span className="text-[11px] font-semibold text-accent/80">
              Distributor Workspace
            </span>
          </div>
        )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto scrollbar-thin space-y-0.5">
        {/* Primary tabs */}
        {primaryItems.map((item) => {
          const { to, label, icon: Icon, exact } = item;
          const active = isActive(to, exact);
          const isAlerts = to === "/alerts";
          const isMessages = to === "/messages";
          const badge =
            (isAlerts && unreadAlerts > 0 && unreadAlerts) ||
            (isMessages && unreadCount > 0 && unreadCount) ||
            0;
          return (
            <button
              key={to}
              type="button"
              title={collapsed ? label : undefined}
              data-ocid={`nav.${label.toLowerCase().replace(/\s+/g, "_")}.link`}
              onClick={() => {
                navigate(
                  item.profileItem && userProfile
                    ? {
                        to: "/profile/$userId",
                        params: { userId: userProfile.id },
                      }
                    : { to },
                );
                onClose?.();
              }}
              className={`nav-item ${active ? "nav-item-active" : "nav-item-inactive"} ${collapsed ? "nav-item-collapsed" : ""}`}
            >
              <Icon size={16} className="flex-shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{label}</span>}
              {!collapsed && badge > 0 && (
                <span className="nav-badge">{badge > 99 ? "99+" : badge}</span>
              )}
              {collapsed && badge > 0 && <span className="nav-badge-dot" />}
            </button>
          );
        })}

        {/* View All expansion — only for non-admin roles with secondary tabs */}
        {!isAdmin && secondaryItems.length > 0 && !collapsed && (
          <>
            <button
              type="button"
              data-ocid="nav.view_all.toggle"
              onClick={handleToggleViewAll}
              className="w-full flex items-center gap-1.5 px-2 py-1.5 mt-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/20 transition-colors group"
              aria-expanded={viewAllExpanded}
            >
              <span className="text-[10px] font-medium tracking-wide uppercase flex-1 text-left">
                {viewAllExpanded ? "− Collapse" : "+ View All"}
              </span>
              {!viewAllExpanded && (
                <span className="text-[9px] text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                  {secondaryItems.length} more
                </span>
              )}
            </button>

            {/* Secondary tabs — visible after View All expansion */}
            {viewAllExpanded && (
              <div className="space-y-0.5 mt-0.5">
                {/* Subtle divider line */}
                <div className="mx-2 border-t border-border/40 mb-1" />
                {secondaryItems.map((item) => {
                  const { to, label, icon: Icon, exact } = item;
                  const active = isActive(to, exact);
                  const isMessages = to === "/messages";
                  const badge = isMessages && unreadCount > 0 ? unreadCount : 0;
                  return (
                    <button
                      key={to}
                      type="button"
                      title={collapsed ? label : undefined}
                      data-ocid={`nav.secondary.${label.toLowerCase().replace(/\s+/g, "_")}.link`}
                      onClick={() => {
                        navigate({ to });
                        onClose?.();
                      }}
                      className={`nav-item text-[11px] opacity-80 ${
                        active
                          ? "nav-item-active"
                          : "nav-item-inactive text-muted-foreground"
                      } ${collapsed ? "nav-item-collapsed" : "pl-5"}`}
                    >
                      <Icon size={13} className="flex-shrink-0 opacity-70" />
                      {!collapsed && (
                        <span className="flex-1 truncate">{label}</span>
                      )}
                      {!collapsed && badge > 0 && (
                        <span className="nav-badge">
                          {badge > 99 ? "99+" : badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Role indicator pill */}
        {!collapsed && effectiveRole && (
          <div className="mt-3 mb-1 px-1">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent/10 border border-accent/20">
              <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
              <span className="text-[10px] font-medium text-accent/80 truncate">
                {ROLE_DISPLAY_NAMES[effectiveRole]}
              </span>
            </div>
          </div>
        )}

        {/* Admin separator */}
        {adminItems.length > 0 && (
          <div className="nav-separator">
            {!collapsed && <span className="nav-separator-label">Admin</span>}
          </div>
        )}

        {adminItems.map(({ to, label, icon: Icon, exact }) => {
          const active = isActive(to, exact);
          return (
            <button
              key={to}
              type="button"
              title={collapsed ? label : undefined}
              data-ocid={`nav.${label.toLowerCase().replace(/\s+/g, "_")}.link`}
              onClick={() => {
                navigate({ to });
                onClose?.();
              }}
              className={`nav-item ${active ? "nav-item-active" : "nav-item-inactive"} ${collapsed ? "nav-item-collapsed" : ""}`}
            >
              <Icon size={16} className="flex-shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{label}</span>}
            </button>
          );
        })}

        {/* Channel Links — admin nav item rendered inline after The Foundry */}
        {(isPrimaryAdmin() || isSecondaryAdmin()) && (
          <button
            type="button"
            title={collapsed ? "Channel Links" : undefined}
            data-ocid="nav.channel_links.link"
            onClick={() => {
              navigate({ to: "/foundry" });
              onClose?.();
            }}
            className={`nav-item ${isActive("/foundry") ? "nav-item-active" : "nav-item-inactive"} ${collapsed ? "nav-item-collapsed" : ""}`}
          >
            <Network size={16} className="flex-shrink-0" />
            {!collapsed && (
              <span className="flex-1 truncate">Channel Links</span>
            )}
            {!collapsed && activeChannelLinkCount > 0 && (
              <span className="nav-badge text-accent">
                {activeChannelLinkCount > 99 ? "99+" : activeChannelLinkCount}
              </span>
            )}
            {collapsed && activeChannelLinkCount > 0 && (
              <span className="nav-badge-dot" />
            )}
          </button>
        )}
      </nav>

      {/* Test Mode simulation indicator */}
      {IS_TEST_MODE &&
        isTestModeActive &&
        !collapsed &&
        (() => {
          const roleLabel = testModeRole
            ? testModeRole
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (c) => c.toUpperCase())
                .trim()
            : null;
          return roleLabel ? (
            <div
              data-ocid="sidebar.simulation_indicator"
              className="mx-2 mb-2 px-2.5 py-1.5 rounded-lg bg-orange-500/8 border border-orange-500/20 flex items-center gap-1.5"
            >
              <span className="text-orange-500/60 text-[10px]">⬡</span>
              <span className="text-[10px] text-orange-400/70 truncate">
                Simulating: {roleLabel}
              </span>
            </div>
          ) : null;
        })()}

      {/* Collapse toggle — desktop only */}
      <button
        type="button"
        onClick={toggleCollapse}
        className="hidden md:flex nav-collapse-btn"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        data-ocid="sidebar.collapse.button"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        {!collapsed && <span className="text-xs">Collapse</span>}
      </button>

      {/* User block */}
      <div className="border-t border-border px-2 py-3 relative">
        {userProfile ? (
          <>
            {profileOpen && (
              <div className="dropdown-panel absolute bottom-full left-2 right-2 mb-2 z-50">
                <div className="px-4 py-3 border-b border-border/50">
                  <div className="text-foreground text-xs font-semibold truncate">
                    {userProfile.fullName}
                  </div>
                  <div className="text-muted-foreground text-[10px] truncate mt-0.5">
                    {userProfile.role}
                  </div>
                </div>

                <div className="px-4 py-2.5 flex items-center justify-between border-b border-border/50">
                  <div className="flex items-center gap-2">
                    {effectiveTheme === "dark" ? (
                      <Moon size={13} className="text-muted-foreground" />
                    ) : (
                      <Sun size={13} className="text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {effectiveTheme === "dark" ? "Dark Mode" : "Light Mode"}
                    </span>
                  </div>
                  <button
                    type="button"
                    data-ocid="sidebar.theme_toggle.button"
                    aria-label={
                      effectiveTheme === "dark"
                        ? "Switch to light mode"
                        : "Switch to dark mode"
                    }
                    onClick={() =>
                      setTheme(effectiveTheme === "dark" ? "light" : "dark")
                    }
                    className="nav-theme-toggle"
                  >
                    <span
                      className="nav-theme-toggle-thumb"
                      style={{
                        transform:
                          effectiveTheme === "dark"
                            ? "translate(0.5px, 0.5px)"
                            : "translate(16px, 0.5px)",
                      }}
                    />
                  </button>
                </div>

                <button
                  type="button"
                  data-ocid="sidebar.logout.button"
                  onClick={() => {
                    setProfileOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors"
                >
                  <LogOut size={13} />
                  <span>Log out</span>
                </button>
              </div>
            )}

            <button
              type="button"
              data-ocid="sidebar.profile.button"
              onClick={() => setProfileOpen((v) => !v)}
              title={collapsed ? userProfile.fullName : undefined}
              className={`w-full flex items-center rounded-lg hover:bg-secondary/30 transition-colors ${collapsed ? "justify-center p-2" : "gap-3 px-3 py-2.5"}`}
            >
              {userProfileDetail?.profilePhotoUrl ? (
                <div className="w-7 h-7 rounded-full flex-shrink-0 ring-2 ring-accent p-[1px] bg-accent">
                  <img
                    src={userProfileDetail.profilePhotoUrl}
                    alt={userProfile.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full flex items-center justify-center bg-accent text-white font-bold text-[10px] flex-shrink-0">
                  {getInitials(userProfile.fullName)}
                </div>
              )}
              {!collapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-foreground text-xs font-medium truncate">
                    {userProfile.fullName}
                  </div>
                  <div className="text-muted-foreground text-[10px] truncate">
                    {userProfile.role}
                  </div>
                </div>
              )}
              {!collapsed && (
                <LogOut
                  size={13}
                  className="text-muted-foreground flex-shrink-0"
                />
              )}
            </button>
          </>
        ) : (
          <div
            className={`flex items-center ${collapsed ? "justify-center p-2" : "gap-3 px-3 py-2.5"}`}
          >
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0" />
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="text-muted-foreground text-xs truncate">
                    Not signed in
                  </div>
                </div>
                <button
                  type="button"
                  data-ocid="sidebar.logout.button"
                  onClick={handleLogout}
                  title="Log out"
                  className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 p-1 rounded"
                >
                  <LogOut size={13} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
