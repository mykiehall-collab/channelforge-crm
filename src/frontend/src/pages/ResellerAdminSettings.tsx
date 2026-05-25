import { CustomFieldManager } from "@/components/CustomFieldManager";
import { DepartmentAllocation } from "@/components/DepartmentAllocation";
import { AIProviderSettings } from "@/components/ForgeAI/AIProviderSettings";
import { ForgeAIAlertConfig } from "@/components/ForgeAIAlertConfig";
import { NotificationRulesConfig } from "@/components/NotificationRulesConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  Bot,
  Building2,
  ClipboardList,
  Lock,
  Moon,
  Palette,
  Shield,
  Sliders,
  Sun,
  Upload,
  Users,
} from "lucide-react";
import { useState } from "react";
import type React from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import { UserRole } from "../backend";
import { useTheme } from "../hooks/useTheme";
import { formatDate } from "../utils/channelforge";

type ResellerAdminTab =
  | "profile"
  | "notifications"
  | "forgeai"
  | "users"
  | "security"
  | "audit"
  | "customfields"
  | "appearance";

const TABS: {
  id: ResellerAdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "profile", label: "Organisation Profile", icon: Building2 },
  { id: "notifications", label: "Notification Rules", icon: Bell },
  { id: "forgeai", label: "ForgeAI Alerts", icon: Bot },
  { id: "users", label: "User Management", icon: Users },
  { id: "security", label: "Security & Auth", icon: Shield },
  { id: "audit", label: "Audit Log", icon: ClipboardList },
  { id: "customfields", label: "Custom Fields", icon: Sliders },
  { id: "appearance", label: "Appearance", icon: Palette },
];

const SAMPLE_USERS = [
  {
    id: "u1",
    name: "Emma Clarke",
    email: "emma.clarke@acmesolutions.com",
    role: "Primary Admin",
    status: "Active",
    lastLogin: "2026-05-09T08:45:00Z",
  },
  {
    id: "u2",
    name: "Liam O'Brien",
    email: "liam.obrien@acmesolutions.com",
    role: "Secondary Admin",
    status: "Active",
    lastLogin: "2026-05-08T13:30:00Z",
  },
  {
    id: "u3",
    name: "Priya Mehta",
    email: "priya.mehta@acmesolutions.com",
    role: "Sales User",
    status: "Active",
    lastLogin: "2026-05-07T11:20:00Z",
  },
  {
    id: "u4",
    name: "Dan Fowler",
    email: "dan.fowler@acmesolutions.com",
    role: "Sales User",
    status: "Pending",
    lastLogin: "—",
  },
];

const SAMPLE_AUDIT = [
  {
    id: "a1",
    action: "Notification rule updated",
    user: "Emma Clarke",
    timestamp: "2026-05-09T09:00:00Z",
    detail: "Renewal alert threshold changed from 30 to 60 days",
  },
  {
    id: "a2",
    action: "User invited",
    user: "Emma Clarke",
    timestamp: "2026-05-08T10:15:00Z",
    detail: "Invited dan.fowler@acmesolutions.com as Sales User",
  },
  {
    id: "a3",
    action: "ForgeAI alert config changed",
    user: "Liam O'Brien",
    timestamp: "2026-05-07T15:00:00Z",
    detail: "Deal registration warnings enabled for Primary Admin",
  },
  {
    id: "a4",
    action: "Password policy updated",
    user: "Emma Clarke",
    timestamp: "2026-05-06T08:30:00Z",
    detail: "Minimum password length increased to 10 characters",
  },
];

// ─── Access Denied ────────────────────────────────────────────────────────────
function AccessDenied() {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[500px] gap-6 p-8"
      data-ocid="reseller_admin.access_denied"
    >
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{
          background: "rgba(249,115,22,0.08)",
          border: "1.5px solid rgba(249,115,22,0.35)",
          boxShadow: "0 0 32px rgba(249,115,22,0.12)",
        }}
      >
        <Lock className="w-9 h-9" style={{ color: "#F97316" }} />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h2
          className="text-2xl font-bold font-display"
          style={{ color: "#E2E8F0" }}
        >
          Access Denied
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          This area is restricted to Reseller administrators only.
        </p>
        <p className="text-xs text-muted-foreground max-w-sm">
          If you believe this is an error, contact your Primary Admin.
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        className="border-border text-sm"
        onClick={() => navigate({ to: "/dashboard" })}
        data-ocid="reseller_admin.access_denied.back_button"
      >
        ← Back to Dashboard
      </Button>
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    orgName: "Acme Solutions Ltd",
    contactEmail: "admin@acmesolutions.com",
    contactPhone: "+44 20 7946 1234",
    region: "UK & Ireland",
    website: "https://acmesolutions.com",
  });

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Organisation profile saved");
  }

  return (
    <div
      className="crm-card p-6 flex flex-col gap-6 max-w-xl"
      data-ocid="reseller_admin.profile.panel"
    >
      {/* Logo upload */}
      <div className="flex flex-col gap-3">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Organisation Logo
        </Label>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-xl border border-border flex items-center justify-center"
            style={{ background: "rgba(30,41,59,0.8)" }}
          >
            <Building2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-border text-xs h-8 gap-1.5"
            data-ocid="reseller_admin.profile.logo_upload_button"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Logo
          </Button>
        </div>
      </div>

      <div className="border-t border-border/50" />

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">
              Organisation Name
            </Label>
            <Input
              value={form.orgName}
              onChange={(e) =>
                setForm((f) => ({ ...f, orgName: e.target.value }))
              }
              className="crm-input"
              data-ocid="reseller_admin.profile.org_name.input"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Region</Label>
            <Input
              value={form.region}
              onChange={(e) =>
                setForm((f) => ({ ...f, region: e.target.value }))
              }
              className="crm-input"
              data-ocid="reseller_admin.profile.region.input"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">
              Contact Email
            </Label>
            <Input
              type="email"
              value={form.contactEmail}
              onChange={(e) =>
                setForm((f) => ({ ...f, contactEmail: e.target.value }))
              }
              className="crm-input"
              data-ocid="reseller_admin.profile.contact_email.input"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">
              Contact Phone
            </Label>
            <Input
              value={form.contactPhone}
              onChange={(e) =>
                setForm((f) => ({ ...f, contactPhone: e.target.value }))
              }
              className="crm-input"
              data-ocid="reseller_admin.profile.contact_phone.input"
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label className="text-xs text-muted-foreground">Website</Label>
            <Input
              value={form.website}
              onChange={(e) =>
                setForm((f) => ({ ...f, website: e.target.value }))
              }
              className="crm-input"
              data-ocid="reseller_admin.profile.website.input"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={saving}
            style={{ background: "#F97316" }}
            className="text-white text-xs"
            data-ocid="reseller_admin.profile.save_button"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ─── Notification Rules Tab ───────────────────────────────────────────────────
function NotificationRulesTab({ isPrimaryAdmin }: { isPrimaryAdmin: boolean }) {
  return (
    <div
      className="flex flex-col gap-4"
      data-ocid="reseller_admin.notifications.panel"
    >
      <NotificationRulesConfig
        companyType="Reseller"
        orgId="mock-res-001"
        isPrimaryAdmin={isPrimaryAdmin}
      />
    </div>
  );
}

// ─── ForgeAI Alerts Tab ───────────────────────────────────────────────────────
function ForgeAIAlertsTab({
  isPrimaryAdmin,
  canManageForgeAIAlerts,
}: {
  isPrimaryAdmin: boolean;
  canManageForgeAIAlerts: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-4"
      data-ocid="reseller_admin.forgeai.panel"
    >
      <ForgeAIAlertConfig
        companyType="Reseller"
        orgId="mock-res-001"
        isPrimaryAdmin={isPrimaryAdmin}
        canManageForgeAIAlerts={canManageForgeAIAlerts}
      />
    </div>
  );
}

// ─── User Management Tab ─────────────────────────────────────────────────────
function UserManagementTab({ isPrimaryAdmin }: { isPrimaryAdmin: boolean }) {
  return (
    <div className="flex flex-col gap-4" data-ocid="reseller_admin.users.panel">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {SAMPLE_USERS.length} users in organisation
        </p>
        <Button
          type="button"
          size="sm"
          style={{ background: "#F97316" }}
          className="text-white text-xs gap-1.5"
          data-ocid="reseller_admin.users.invite_button"
        >
          + Invite User
        </Button>
      </div>
      <div className="crm-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {[
                  "Name",
                  "Email",
                  "Role",
                  "Department",
                  "Status",
                  "Last Login",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_USERS.map((u, i) => (
                <tr
                  key={u.id}
                  className="border-b border-border/40 hover:bg-secondary/10 transition-colors"
                  data-ocid={`reseller_admin.users.item.${i + 1}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ background: "#F97316" }}
                      >
                        {u.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="font-medium text-foreground text-xs">
                        {u.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {u.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background:
                          u.role === "Primary Admin"
                            ? "rgba(249,115,22,0.15)"
                            : u.role === "Secondary Admin"
                              ? "rgba(100,140,220,0.15)"
                              : "rgba(100,116,139,0.2)",
                        color:
                          u.role === "Primary Admin"
                            ? "#F97316"
                            : u.role === "Secondary Admin"
                              ? "#8AABDC"
                              : "#94a3b8",
                        border: `1px solid ${
                          u.role === "Primary Admin"
                            ? "rgba(249,115,22,0.3)"
                            : u.role === "Secondary Admin"
                              ? "rgba(100,140,220,0.3)"
                              : "rgba(100,116,139,0.3)"
                        }`,
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`status-badge text-[11px] font-semibold ${
                        u.status === "Active"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">—</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {u.lastLogin === "—"
                      ? "—"
                      : formatDate(BigInt(new Date(u.lastLogin).getTime()))}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-border"
                      data-ocid={`reseller_admin.users.edit_button.${i + 1}`}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department & Reporting Permissions */}
      <DepartmentAllocation
        users={SAMPLE_USERS.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          isPrimary: u.role === "Primary Admin",
        }))}
        isPrimaryAdmin={isPrimaryAdmin}
        orgType="reseller"
      />
    </div>
  );
}

// ─── Security & Auth Tab ──────────────────────────────────────────────────────
function SecurityAuthTab() {
  return (
    <div
      className="flex flex-col gap-4"
      data-ocid="reseller_admin.security.panel"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          {
            title: "Password Policy",
            value: "Min 8 chars · 1 uppercase · 1 symbol",
            status: "Configured",
          },
          {
            title: "MFA Requirement",
            value: "Optional for all users",
            status: "Configured",
          },
          {
            title: "Account Lockout",
            value: "5 failed attempts · 30 min lockout",
            status: "Active",
          },
          {
            title: "Session Duration",
            value: "8 hours · Auto-expire on inactivity",
            status: "Active",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="crm-card p-4 flex flex-col gap-2"
            data-ocid={`reseller_admin.security.${item.title.toLowerCase().replace(/\s+/g, "_")}.card`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                {item.title}
              </span>
              <span
                className={`status-badge text-[10px] font-semibold ${
                  item.status === "Active"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                }`}
              >
                {item.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Audit Log Tab ────────────────────────────────────────────────────────────
function AuditLogTab() {
  return (
    <div className="flex flex-col gap-4" data-ocid="reseller_admin.audit.panel">
      <div className="crm-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Action", "User", "Timestamp", "Detail"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_AUDIT.map((entry, i) => (
                <tr
                  key={entry.id}
                  className="border-b border-border/40 hover:bg-secondary/10 transition-colors"
                  data-ocid={`reseller_admin.audit.item.${i + 1}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: "#F97316" }}
                      />
                      <span className="text-xs font-medium text-foreground">
                        {entry.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {entry.user}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(BigInt(new Date(entry.timestamp).getTime()))}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {entry.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Appearance Tab ──────────────────────────────────────────────────────────
function AppearanceTab() {
  const { effectiveTheme, setTheme } = useTheme();

  return (
    <div
      className="flex flex-col gap-6"
      data-ocid="reseller_admin.appearance.panel"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-foreground">
          Theme &amp; Display
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose your preferred display theme for authenticated workspace areas.
          Pre-login screens always use the CHANNELFORGE dark identity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        <button
          type="button"
          onClick={() => setTheme("dark")}
          data-ocid="reseller_admin.appearance.dark_mode.toggle"
          className={`flex flex-col gap-3 p-5 rounded-xl border-2 text-left transition-all ${
            effectiveTheme === "dark"
              ? "border-accent bg-accent/8 shadow-[0_0_20px_rgba(249,115,22,0.1)]"
              : "border-border bg-card hover:border-border/80 hover:bg-secondary/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                effectiveTheme === "dark" ? "bg-accent/15" : "bg-secondary/50"
              }`}
            >
              <Moon
                className={`w-5 h-5 ${
                  effectiveTheme === "dark"
                    ? "text-accent"
                    : "text-muted-foreground"
                }`}
              />
            </div>
            <div>
              <p
                className={`text-sm font-semibold ${
                  effectiveTheme === "dark" ? "text-accent" : "text-foreground"
                }`}
              >
                Dark Mode
              </p>
              {effectiveTheme === "dark" && (
                <p className="text-[11px] text-accent/70 font-medium">
                  Currently active
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Navy backgrounds, dark gradients, orange highlights. Operational
            command-center feel.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setTheme("light")}
          data-ocid="reseller_admin.appearance.light_mode.toggle"
          className={`flex flex-col gap-3 p-5 rounded-xl border-2 text-left transition-all ${
            effectiveTheme === "light"
              ? "border-accent bg-accent/8 shadow-[0_0_20px_rgba(249,115,22,0.1)]"
              : "border-border bg-card hover:border-border/80 hover:bg-secondary/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                effectiveTheme === "light" ? "bg-accent/15" : "bg-secondary/50"
              }`}
            >
              <Sun
                className={`w-5 h-5 ${
                  effectiveTheme === "light"
                    ? "text-accent"
                    : "text-muted-foreground"
                }`}
              />
            </div>
            <div>
              <p
                className={`text-sm font-semibold ${
                  effectiveTheme === "light" ? "text-accent" : "text-foreground"
                }`}
              >
                Light Mode
              </p>
              {effectiveTheme === "light" && (
                <p className="text-[11px] text-accent/70 font-medium">
                  Currently active
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            White/light grey backgrounds, navy typography, orange accents. Clean
            productivity feel.
          </p>
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function ResellerAdminSettings() {
  const { userProfile, companyProfile, canManageForgeAIAlerts } = useApp();
  const [activeTab, setActiveTab] = useState<ResellerAdminTab>("profile");

  const isResellerOrg = companyProfile?.companyType === "Reseller";
  const isPrimaryAdmin = userProfile?.isPrimaryAdmin === true;
  const isSecondaryAdmin =
    userProfile?.isPrimaryAdmin !== true &&
    (userProfile?.role === UserRole.ResellerAdmin ||
      userProfile?.role === UserRole.ResellerSalesUser);
  const hasAccess = isResellerOrg && (isPrimaryAdmin || isSecondaryAdmin);

  if (!hasAccess) {
    return <AccessDenied />;
  }

  return (
    <div
      className="flex flex-col gap-6 p-6 fade-in"
      data-ocid="reseller_admin.page"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Reseller Admin Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your reseller workspace, users, notifications, and ForgeAI
            alerts
          </p>
        </div>
        <span
          className="text-[11px] font-semibold px-3 py-1 rounded-full"
          style={{
            background: "rgba(249,115,22,0.1)",
            color: "#F97316",
            border: "1px solid rgba(249,115,22,0.25)",
          }}
        >
          Reseller Workspace
        </span>
      </div>

      {/* Tab navigation */}
      <div
        className="flex gap-1 border-b border-border overflow-x-auto scrollbar-thin pb-0"
        data-ocid="reseller_admin.tabs"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              data-ocid={`reseller_admin.${tab.id}.tab`}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="fade-in">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "notifications" && (
          <NotificationRulesTab isPrimaryAdmin={isPrimaryAdmin} />
        )}
        {activeTab === "forgeai" && (
          <ForgeAIAlertsTab
            isPrimaryAdmin={isPrimaryAdmin}
            canManageForgeAIAlerts={canManageForgeAIAlerts}
          />
        )}
        {activeTab === "forgeai" && (
          <div className="mt-6">
            <AIProviderSettings wsType="reseller" />
          </div>
        )}
        {activeTab === "users" && (
          <UserManagementTab isPrimaryAdmin={isPrimaryAdmin} />
        )}
        {activeTab === "security" && <SecurityAuthTab />}
        {activeTab === "audit" && <AuditLogTab />}
        {activeTab === "customfields" && (
          <CustomFieldManager
            orgType="reseller"
            canCreate
            canArchive={false}
            canLock={false}
          />
        )}
        {activeTab === "appearance" && <AppearanceTab />}
      </div>
    </div>
  );
}
