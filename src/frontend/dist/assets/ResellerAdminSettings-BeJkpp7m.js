import { u as useApp, r as reactExports, q as UserRole, j as jsxRuntimeExports, B as Building2, a0 as Bell, aP as Bot, U as Users, H as Shield, a as useNavigate, L as Lock, m as Button, aF as Label, a7 as Upload, ad as Input, af as formatDate, T as TriangleAlert, aR as useTheme, aS as Moon, aT as Sun, ab as ue } from "./index-DvFvlUBj.js";
import { S as SlidersVertical, P as Palette, C as CustomFieldManager, D as DepartmentAllocation } from "./CustomFieldManager-CEOFGm2c.js";
import { A as AIProviderSettings } from "./AIProviderSettings-oVXdXmwz.js";
import { N as NotificationRulesConfig, F as ForgeAIAlertConfig } from "./NotificationRulesConfig-CB8BzyHB.js";
import { C as ClipboardList } from "./clipboard-list-BvyAGRk8.js";
import "./dialog-CJsIFtIC.js";
import "./index-D-5r5K-M.js";
import "./index-CwZfxY3Y.js";
import "./share-2-BFP_6Fru.js";
import "./skeleton-Cqz48f6n.js";
import "./switch-7D4xT4MC.js";
import "./index-B1ifXNtV.js";
import "./textarea-BHUaDciu.js";
import "./useMutation-D0Tr8pyU.js";
import "./archive-R3lqk_IO.js";
import "./pencil-CSymqQ5s.js";
import "./minus-OwCcNK6_.js";
import "./activity-BzA2r-7b.js";
import "./shield-check-Bs1OSg8Z.js";
import "./send-Bb1KdK72.js";
const TABS = [
  { id: "profile", label: "Organisation Profile", icon: Building2 },
  { id: "notifications", label: "Notification Rules", icon: Bell },
  { id: "forgeai", label: "ForgeAI Alerts", icon: Bot },
  { id: "users", label: "User Management", icon: Users },
  { id: "security", label: "Security & Auth", icon: Shield },
  { id: "audit", label: "Audit Log", icon: ClipboardList },
  { id: "customfields", label: "Custom Fields", icon: SlidersVertical },
  { id: "appearance", label: "Appearance", icon: Palette }
];
const SAMPLE_USERS = [
  {
    id: "u1",
    name: "Emma Clarke",
    email: "emma.clarke@acmesolutions.com",
    role: "Primary Admin",
    status: "Active",
    lastLogin: "2026-05-09T08:45:00Z"
  },
  {
    id: "u2",
    name: "Liam O'Brien",
    email: "liam.obrien@acmesolutions.com",
    role: "Secondary Admin",
    status: "Active",
    lastLogin: "2026-05-08T13:30:00Z"
  },
  {
    id: "u3",
    name: "Priya Mehta",
    email: "priya.mehta@acmesolutions.com",
    role: "Sales User",
    status: "Active",
    lastLogin: "2026-05-07T11:20:00Z"
  },
  {
    id: "u4",
    name: "Dan Fowler",
    email: "dan.fowler@acmesolutions.com",
    role: "Sales User",
    status: "Pending",
    lastLogin: "—"
  }
];
const SAMPLE_AUDIT = [
  {
    id: "a1",
    action: "Notification rule updated",
    user: "Emma Clarke",
    timestamp: "2026-05-09T09:00:00Z",
    detail: "Renewal alert threshold changed from 30 to 60 days"
  },
  {
    id: "a2",
    action: "User invited",
    user: "Emma Clarke",
    timestamp: "2026-05-08T10:15:00Z",
    detail: "Invited dan.fowler@acmesolutions.com as Sales User"
  },
  {
    id: "a3",
    action: "ForgeAI alert config changed",
    user: "Liam O'Brien",
    timestamp: "2026-05-07T15:00:00Z",
    detail: "Deal registration warnings enabled for Primary Admin"
  },
  {
    id: "a4",
    action: "Password policy updated",
    user: "Emma Clarke",
    timestamp: "2026-05-06T08:30:00Z",
    detail: "Minimum password length increased to 10 characters"
  }
];
function AccessDenied() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center min-h-[500px] gap-6 p-8",
      "data-ocid": "reseller_admin.access_denied",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-20 h-20 rounded-2xl flex items-center justify-center",
            style: {
              background: "rgba(249,115,22,0.08)",
              border: "1.5px solid rgba(249,115,22,0.35)",
              boxShadow: "0 0 32px rgba(249,115,22,0.12)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-9 h-9", style: { color: "#F97316" } })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "text-2xl font-bold font-display",
              style: { color: "#E2E8F0" },
              children: "Access Denied"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm", children: "This area is restricted to Reseller administrators only." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-sm", children: "If you believe this is an error, contact your Primary Admin." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            className: "border-border text-sm",
            onClick: () => navigate({ to: "/dashboard" }),
            "data-ocid": "reseller_admin.access_denied.back_button",
            children: "← Back to Dashboard"
          }
        )
      ]
    }
  );
}
function ProfileTab() {
  const [saving, setSaving] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    orgName: "Acme Solutions Ltd",
    contactEmail: "admin@acmesolutions.com",
    contactPhone: "+44 20 7946 1234",
    region: "UK & Ireland",
    website: "https://acmesolutions.com"
  });
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    ue.success("Organisation profile saved");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "crm-card p-6 flex flex-col gap-6 max-w-xl",
      "data-ocid": "reseller_admin.profile.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wide", children: "Organisation Logo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-16 h-16 rounded-xl border border-border flex items-center justify-center",
                style: { background: "rgba(30,41,59,0.8)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-6 h-6 text-muted-foreground" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                className: "border-border text-xs h-8 gap-1.5",
                "data-ocid": "reseller_admin.profile.logo_upload_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3.5 h-3.5" }),
                  "Upload Logo"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Organisation Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.orgName,
                  onChange: (e) => setForm((f) => ({ ...f, orgName: e.target.value })),
                  className: "crm-input",
                  "data-ocid": "reseller_admin.profile.org_name.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Region" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.region,
                  onChange: (e) => setForm((f) => ({ ...f, region: e.target.value })),
                  className: "crm-input",
                  "data-ocid": "reseller_admin.profile.region.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Contact Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "email",
                  value: form.contactEmail,
                  onChange: (e) => setForm((f) => ({ ...f, contactEmail: e.target.value })),
                  className: "crm-input",
                  "data-ocid": "reseller_admin.profile.contact_email.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Contact Phone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.contactPhone,
                  onChange: (e) => setForm((f) => ({ ...f, contactPhone: e.target.value })),
                  className: "crm-input",
                  "data-ocid": "reseller_admin.profile.contact_phone.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 sm:col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Website" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.website,
                  onChange: (e) => setForm((f) => ({ ...f, website: e.target.value })),
                  className: "crm-input",
                  "data-ocid": "reseller_admin.profile.website.input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              size: "sm",
              disabled: saving,
              style: { background: "#F97316" },
              className: "text-white text-xs",
              "data-ocid": "reseller_admin.profile.save_button",
              children: saving ? "Saving..." : "Save Changes"
            }
          ) })
        ] })
      ]
    }
  );
}
function NotificationRulesTab({ isPrimaryAdmin }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex flex-col gap-4",
      "data-ocid": "reseller_admin.notifications.panel",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        NotificationRulesConfig,
        {
          companyType: "Reseller",
          orgId: "mock-res-001",
          isPrimaryAdmin
        }
      )
    }
  );
}
function ForgeAIAlertsTab({
  isPrimaryAdmin,
  canManageForgeAIAlerts
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex flex-col gap-4",
      "data-ocid": "reseller_admin.forgeai.panel",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ForgeAIAlertConfig,
        {
          companyType: "Reseller",
          orgId: "mock-res-001",
          isPrimaryAdmin,
          canManageForgeAIAlerts
        }
      )
    }
  );
}
function UserManagementTab({ isPrimaryAdmin }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", "data-ocid": "reseller_admin.users.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        SAMPLE_USERS.length,
        " users in organisation"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          size: "sm",
          style: { background: "#F97316" },
          className: "text-white text-xs gap-1.5",
          "data-ocid": "reseller_admin.users.invite_button",
          children: "+ Invite User"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto scrollbar-thin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
        "Name",
        "Email",
        "Role",
        "Department",
        "Status",
        "Last Login",
        "Actions"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: SAMPLE_USERS.map((u, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/40 hover:bg-secondary/10 transition-colors",
          "data-ocid": `reseller_admin.users.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0",
                  style: { background: "#F97316" },
                  children: u.name.split(" ").map((n) => n[0]).join("")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground text-xs", children: u.name })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: u.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                style: {
                  background: u.role === "Primary Admin" ? "rgba(249,115,22,0.15)" : u.role === "Secondary Admin" ? "rgba(100,140,220,0.15)" : "rgba(100,116,139,0.2)",
                  color: u.role === "Primary Admin" ? "#F97316" : u.role === "Secondary Admin" ? "#8AABDC" : "#94a3b8",
                  border: `1px solid ${u.role === "Primary Admin" ? "rgba(249,115,22,0.3)" : u.role === "Secondary Admin" ? "rgba(100,140,220,0.3)" : "rgba(100,116,139,0.3)"}`
                },
                children: u.role
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `status-badge text-[11px] font-semibold ${u.status === "Active" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"}`,
                children: u.status
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: u.lastLogin === "—" ? "—" : formatDate(BigInt(new Date(u.lastLogin).getTime())) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                className: "h-7 text-xs border-border",
                "data-ocid": `reseller_admin.users.edit_button.${i + 1}`,
                children: "Edit"
              }
            ) })
          ]
        },
        u.id
      )) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DepartmentAllocation,
      {
        users: SAMPLE_USERS.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          isPrimary: u.role === "Primary Admin"
        })),
        isPrimaryAdmin,
        orgType: "reseller"
      }
    )
  ] });
}
function SecurityAuthTab() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex flex-col gap-4",
      "data-ocid": "reseller_admin.security.panel",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
        {
          title: "Password Policy",
          value: "Min 8 chars · 1 uppercase · 1 symbol",
          status: "Configured"
        },
        {
          title: "MFA Requirement",
          value: "Optional for all users",
          status: "Configured"
        },
        {
          title: "Account Lockout",
          value: "5 failed attempts · 30 min lockout",
          status: "Active"
        },
        {
          title: "Session Duration",
          value: "8 hours · Auto-expire on inactivity",
          status: "Active"
        }
      ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "crm-card p-4 flex flex-col gap-2",
          "data-ocid": `reseller_admin.security.${item.title.toLowerCase().replace(/\s+/g, "_")}.card`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: item.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `status-badge text-[10px] font-semibold ${item.status === "Active" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/15 text-blue-400 border border-blue-500/20"}`,
                  children: item.status
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: item.value })
          ]
        },
        item.title
      )) })
    }
  );
}
function AuditLogTab() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4", "data-ocid": "reseller_admin.audit.panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto scrollbar-thin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: ["Action", "User", "Timestamp", "Detail"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "th",
      {
        className: "text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap",
        children: h
      },
      h
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: SAMPLE_AUDIT.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "tr",
      {
        className: "border-b border-border/40 hover:bg-secondary/10 transition-colors",
        "data-ocid": `reseller_admin.audit.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TriangleAlert,
              {
                className: "w-3.5 h-3.5 flex-shrink-0",
                style: { color: "#F97316" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: entry.action })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: entry.user }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground whitespace-nowrap", children: formatDate(BigInt(new Date(entry.timestamp).getTime())) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: entry.detail })
        ]
      },
      entry.id
    )) })
  ] }) }) }) });
}
function AppearanceTab() {
  const { effectiveTheme, setTheme } = useTheme();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-6",
      "data-ocid": "reseller_admin.appearance.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground", children: "Theme & Display" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Choose your preferred display theme for authenticated workspace areas. Pre-login screens always use the CHANNELFORGE dark identity." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setTheme("dark"),
              "data-ocid": "reseller_admin.appearance.dark_mode.toggle",
              className: `flex flex-col gap-3 p-5 rounded-xl border-2 text-left transition-all ${effectiveTheme === "dark" ? "border-accent bg-accent/8 shadow-[0_0_20px_rgba(249,115,22,0.1)]" : "border-border bg-card hover:border-border/80 hover:bg-secondary/30"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${effectiveTheme === "dark" ? "bg-accent/15" : "bg-secondary/50"}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Moon,
                        {
                          className: `w-5 h-5 ${effectiveTheme === "dark" ? "text-accent" : "text-muted-foreground"}`
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: `text-sm font-semibold ${effectiveTheme === "dark" ? "text-accent" : "text-foreground"}`,
                        children: "Dark Mode"
                      }
                    ),
                    effectiveTheme === "dark" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-accent/70 font-medium", children: "Currently active" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Navy backgrounds, dark gradients, orange highlights. Operational command-center feel." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setTheme("light"),
              "data-ocid": "reseller_admin.appearance.light_mode.toggle",
              className: `flex flex-col gap-3 p-5 rounded-xl border-2 text-left transition-all ${effectiveTheme === "light" ? "border-accent bg-accent/8 shadow-[0_0_20px_rgba(249,115,22,0.1)]" : "border-border bg-card hover:border-border/80 hover:bg-secondary/30"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${effectiveTheme === "light" ? "bg-accent/15" : "bg-secondary/50"}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Sun,
                        {
                          className: `w-5 h-5 ${effectiveTheme === "light" ? "text-accent" : "text-muted-foreground"}`
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: `text-sm font-semibold ${effectiveTheme === "light" ? "text-accent" : "text-foreground"}`,
                        children: "Light Mode"
                      }
                    ),
                    effectiveTheme === "light" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-accent/70 font-medium", children: "Currently active" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "White/light grey backgrounds, navy typography, orange accents. Clean productivity feel." })
              ]
            }
          )
        ] })
      ]
    }
  );
}
function ResellerAdminSettings() {
  const { userProfile, companyProfile, canManageForgeAIAlerts } = useApp();
  const [activeTab, setActiveTab] = reactExports.useState("profile");
  const isResellerOrg = (companyProfile == null ? void 0 : companyProfile.companyType) === "Reseller";
  const isPrimaryAdmin = (userProfile == null ? void 0 : userProfile.isPrimaryAdmin) === true;
  const isSecondaryAdmin = (userProfile == null ? void 0 : userProfile.isPrimaryAdmin) !== true && ((userProfile == null ? void 0 : userProfile.role) === UserRole.ResellerAdmin || (userProfile == null ? void 0 : userProfile.role) === UserRole.ResellerSalesUser);
  const hasAccess = isResellerOrg && (isPrimaryAdmin || isSecondaryAdmin);
  if (!hasAccess) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AccessDenied, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-6 p-6 fade-in",
      "data-ocid": "reseller_admin.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-display text-foreground", children: "Reseller Admin Settings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage your reseller workspace, users, notifications, and ForgeAI alerts" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[11px] font-semibold px-3 py-1 rounded-full",
              style: {
                background: "rgba(249,115,22,0.1)",
                color: "#F97316",
                border: "1px solid rgba(249,115,22,0.25)"
              },
              children: "Reseller Workspace"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex gap-1 border-b border-border overflow-x-auto scrollbar-thin pb-0",
            "data-ocid": "reseller_admin.tabs",
            children: TABS.map((tab) => {
              const Icon = tab.icon;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveTab(tab.id),
                  "data-ocid": `reseller_admin.${tab.id}.tab`,
                  className: `flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${activeTab === tab.id ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" }),
                    tab.label
                  ]
                },
                tab.id
              );
            })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fade-in", children: [
          activeTab === "profile" && /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileTab, {}),
          activeTab === "notifications" && /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationRulesTab, { isPrimaryAdmin }),
          activeTab === "forgeai" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            ForgeAIAlertsTab,
            {
              isPrimaryAdmin,
              canManageForgeAIAlerts
            }
          ),
          activeTab === "forgeai" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AIProviderSettings, { wsType: "reseller" }) }),
          activeTab === "users" && /* @__PURE__ */ jsxRuntimeExports.jsx(UserManagementTab, { isPrimaryAdmin }),
          activeTab === "security" && /* @__PURE__ */ jsxRuntimeExports.jsx(SecurityAuthTab, {}),
          activeTab === "audit" && /* @__PURE__ */ jsxRuntimeExports.jsx(AuditLogTab, {}),
          activeTab === "customfields" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CustomFieldManager,
            {
              orgType: "reseller",
              canCreate: true,
              canArchive: false,
              canLock: false
            }
          ),
          activeTab === "appearance" && /* @__PURE__ */ jsxRuntimeExports.jsx(AppearanceTab, {})
        ] })
      ]
    }
  );
}
export {
  ResellerAdminSettings
};
