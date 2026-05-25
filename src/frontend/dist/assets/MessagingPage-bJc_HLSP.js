import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, S as Search, X, by as ScrollArea, bv as Star, U as Users, o as Badge, i as ChevronRight, g as ChevronLeft, B as Building2, Q as Briefcase, N as MessageSquare, ab as ue, k as ChevronDown, H as Shield, a9 as Globe, L as Lock, a as useNavigate, bx as useParams, u as useApp, a8 as Plus, d as Brain, bt as BellOff } from "./index-DvFvlUBj.js";
import { F as Funnel } from "./funnel-ouUqz1CV.js";
import { M as MapPin } from "./map-pin-BB_ykcTK.js";
import { A as Archive } from "./archive-R3lqk_IO.js";
import { P as Paperclip } from "./paperclip-BcvCl5-v.js";
import { S as Send } from "./send-Bb1KdK72.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8", key: "7n84p3" }]
];
const AtSign = createLucideIcon("at-sign", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 13a3 3 0 1 0-6 0", key: "10j68g" }],
  [
    "path",
    {
      d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
      key: "k3hazp"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "2", key: "1822b1" }]
];
const BookUser = createLucideIcon("book-user", __iconNode);
const MOCK_STAKEHOLDERS = [
  {
    id: "sh-01",
    name: "Sarah Mitchell",
    initials: "SM",
    email: "s.mitchell@ingrammicro.com",
    employeeNumber: "IM-4421",
    organization: "Ingram Micro",
    orgType: "Distributor",
    department: "Account Management",
    role: "Account Manager",
    territory: "EMEA North",
    linkedVendor: "ChannelForge Vendor Co.",
    linkedReseller: "Apex Partners",
    assignedAccounts: ["TechCorp", "Nordic Energy Group", "Bluewave Solutions"],
    visibilityTier: "Hierarchy-Shared",
    tags: ["Strategic Contact", "Renewal Owner"],
    avatarColor: "bg-sky-500/20 border-sky-500/30 text-sky-300",
    recentCollaboration: "2 days ago"
  },
  {
    id: "sh-02",
    name: "James Porter",
    initials: "JP",
    email: "j.porter@channelforge-vendor.com",
    employeeNumber: "VND-1102",
    organization: "ChannelForge Vendor Co.",
    orgType: "Vendor",
    department: "Channel Sales",
    role: "Senior Channel Manager",
    territory: "Global",
    linkedDistributor: "Ingram Micro",
    assignedAccounts: ["Acme Corp", "TechVision Ltd", "Global Pharma Holdings"],
    visibilityTier: "Organization-Shared",
    tags: ["Executive Sponsor", "Strategic Contact"],
    avatarColor: "bg-violet-500/20 border-violet-500/30 text-violet-300",
    recentCollaboration: "Today"
  },
  {
    id: "sh-03",
    name: "Priya Sharma",
    initials: "PS",
    email: "p.sharma@apex-partners.com",
    employeeNumber: "APX-0832",
    organization: "Apex Partners",
    orgType: "Reseller",
    department: "Deal Desk",
    role: "Deal Desk Analyst",
    territory: "UK & Ireland",
    linkedVendor: "ChannelForge Vendor Co.",
    linkedDistributor: "Ingram Micro",
    assignedAccounts: ["TechVision Ltd", "Stratos Digital"],
    visibilityTier: "Hierarchy-Shared",
    tags: ["Deal Desk", "Escalation Contact"],
    avatarColor: "bg-orange-500/20 border-orange-500/30 text-orange-300",
    recentCollaboration: "Today"
  },
  {
    id: "sh-04",
    name: "Michael Torres",
    initials: "MT",
    email: "m.torres@ingrammicro.com",
    employeeNumber: "IM-3851",
    organization: "Ingram Micro",
    orgType: "Distributor",
    department: "Sales Management",
    role: "Sales Manager",
    territory: "EMEA South",
    linkedVendor: "ChannelForge Vendor Co.",
    assignedAccounts: ["Desperado", "Nordic Energy Group"],
    visibilityTier: "Organization-Shared",
    tags: ["Operations Lead", "Strategic Contact"],
    avatarColor: "bg-teal-500/20 border-teal-500/30 text-teal-300",
    recentCollaboration: "Yesterday"
  },
  {
    id: "sh-05",
    name: "Anna Clarke",
    initials: "AC",
    email: "a.clarke@channelforge-vendor.com",
    employeeNumber: "VND-2241",
    organization: "ChannelForge Vendor Co.",
    orgType: "Vendor",
    department: "Product Sales",
    role: "Renewal Specialist",
    territory: "EMEA",
    linkedDistributor: "Ingram Micro",
    assignedAccounts: ["LumiTech", "Corelink Solutions"],
    visibilityTier: "Department-Shared",
    tags: ["Renewal Owner"],
    avatarColor: "bg-pink-500/20 border-pink-500/30 text-pink-300",
    recentCollaboration: "Today"
  },
  {
    id: "sh-06",
    name: "Tom Richards",
    initials: "TR",
    email: "t.richards@apex-partners.com",
    employeeNumber: "APX-0551",
    organization: "Apex Partners",
    orgType: "Reseller",
    department: "Marketing",
    role: "Marketing Lead",
    territory: "UK & Ireland",
    linkedDistributor: "Ingram Micro",
    assignedAccounts: ["Apex Partners"],
    visibilityTier: "Department-Shared",
    tags: ["Marketing Lead"],
    avatarColor: "bg-lime-500/20 border-lime-500/30 text-lime-300",
    recentCollaboration: "3 days ago"
  },
  {
    id: "sh-07",
    name: "Rachel Kim",
    initials: "RK",
    email: "r.kim@channelforge-vendor.com",
    employeeNumber: "VND-1987",
    organization: "ChannelForge Vendor Co.",
    orgType: "Vendor",
    department: "Customer Success",
    role: "Customer Success Manager",
    territory: "APAC",
    linkedDistributor: "Ingram Micro",
    assignedAccounts: ["Corelink Solutions", "Bluewave Solutions"],
    visibilityTier: "Organization-Shared",
    tags: ["Escalation Contact", "Technical Lead"],
    avatarColor: "bg-cyan-500/20 border-cyan-500/30 text-cyan-300",
    recentCollaboration: "Yesterday"
  },
  {
    id: "sh-08",
    name: "David Okafor",
    initials: "DO",
    email: "d.okafor@ingrammicro.com",
    employeeNumber: "IM-5031",
    organization: "Ingram Micro",
    orgType: "Distributor",
    department: "Sales Operations",
    role: "Sales Ops Analyst",
    territory: "EMEA",
    linkedVendor: "ChannelForge Vendor Co.",
    assignedAccounts: ["Nordic Energy Group", "Global Pharma Holdings"],
    visibilityTier: "Organization-Shared",
    tags: ["Operations Lead"],
    avatarColor: "bg-amber-500/20 border-amber-500/30 text-amber-300",
    recentCollaboration: "1 week ago"
  },
  {
    id: "sh-09",
    name: "Lisa Chen",
    initials: "LC",
    email: "l.chen@channelforge-vendor.com",
    employeeNumber: "VND-0741",
    organization: "ChannelForge Vendor Co.",
    orgType: "Vendor",
    department: "Finance",
    role: "Finance Partner",
    territory: "Global",
    assignedAccounts: ["Acme Corp"],
    visibilityTier: "Private",
    tags: [],
    avatarColor: "bg-slate-500/20 border-slate-500/30 text-slate-300",
    recentCollaboration: "Yesterday"
  },
  {
    id: "sh-10",
    name: "Carlos Vega",
    initials: "CV",
    email: "c.vega@nordtech-reseller.com",
    employeeNumber: "NTR-1122",
    organization: "NordTech Resellers",
    orgType: "Reseller",
    department: "Channel Sales",
    role: "Territory Owner",
    territory: "Nordics",
    linkedVendor: "ChannelForge Vendor Co.",
    linkedDistributor: "Ingram Micro",
    assignedAccounts: ["Nordic Energy Group", "Desperado"],
    visibilityTier: "Hierarchy-Shared",
    tags: ["Strategic Contact", "Operations Lead"],
    avatarColor: "bg-blue-500/20 border-blue-500/30 text-blue-300",
    recentCollaboration: "4 days ago"
  },
  {
    id: "sh-11",
    name: "Emma Walsh",
    initials: "EW",
    email: "e.walsh@channelforge-vendor.com",
    employeeNumber: "VND-3302",
    organization: "ChannelForge Vendor Co.",
    orgType: "Vendor",
    department: "Executive Leadership",
    role: "VP Channel Sales",
    territory: "Global",
    linkedDistributor: "Ingram Micro",
    assignedAccounts: ["Global Pharma Holdings", "Desperado"],
    visibilityTier: "Organization-Shared",
    tags: ["Executive Sponsor", "Strategic Contact"],
    avatarColor: "bg-purple-500/20 border-purple-500/30 text-purple-300",
    recentCollaboration: "2 days ago"
  },
  {
    id: "sh-12",
    name: "Kenji Nakamura",
    initials: "KN",
    email: "k.nakamura@apex-partners.com",
    employeeNumber: "APX-1441",
    organization: "Apex Partners",
    orgType: "Reseller",
    department: "Technical Sales",
    role: "Solutions Architect",
    territory: "UK & Ireland",
    linkedVendor: "ChannelForge Vendor Co.",
    linkedDistributor: "Ingram Micro",
    assignedAccounts: ["TechVision Ltd", "LumiTech"],
    visibilityTier: "Hierarchy-Shared",
    tags: ["Technical Lead"],
    avatarColor: "bg-indigo-500/20 border-indigo-500/30 text-indigo-300",
    recentCollaboration: "5 days ago"
  },
  {
    id: "sh-13",
    name: "Fatima Al-Rashid",
    initials: "FA",
    email: "f.alrashid@ingrammicro.com",
    employeeNumber: "IM-6671",
    organization: "Ingram Micro",
    orgType: "Distributor",
    department: "Renewals",
    role: "Renewal Specialist",
    territory: "MENA",
    linkedVendor: "ChannelForge Vendor Co.",
    assignedAccounts: ["Desperado", "Stratos Digital"],
    visibilityTier: "Department-Shared",
    tags: ["Renewal Owner", "Escalation Contact"],
    avatarColor: "bg-rose-500/20 border-rose-500/30 text-rose-300",
    recentCollaboration: "Today"
  },
  {
    id: "sh-14",
    name: "Oliver Grant",
    initials: "OG",
    email: "o.grant@channelforge-vendor.com",
    employeeNumber: "VND-2891",
    organization: "ChannelForge Vendor Co.",
    orgType: "Vendor",
    department: "IT & Security",
    role: "Security Operations Lead",
    territory: "Global",
    assignedAccounts: [],
    visibilityTier: "Private",
    tags: ["Operations Lead"],
    avatarColor: "bg-gray-500/20 border-gray-500/30 text-muted-foreground",
    recentCollaboration: "1 week ago"
  },
  {
    id: "sh-15",
    name: "Yuki Tanaka",
    initials: "YT",
    email: "y.tanaka@global-dist.com",
    employeeNumber: "GD-0091",
    organization: "Global Distributors Ltd",
    orgType: "Global Distributor",
    department: "Strategic Accounts",
    role: "Global Account Director",
    territory: "APAC & EMEA",
    linkedVendor: "ChannelForge Vendor Co.",
    assignedAccounts: ["Global Pharma Holdings", "Nordic Energy Group"],
    visibilityTier: "Hierarchy-Shared",
    tags: ["Executive Sponsor", "Strategic Contact"],
    avatarColor: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300",
    recentCollaboration: "3 days ago"
  }
];
const MY_CONTACTS_IDS = ["sh-01", "sh-02", "sh-03", "sh-04", "sh-05", "sh-07"];
const VISIBILITY_CONFIG = {
  Private: {
    label: "Private",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 9 }),
    classes: "bg-muted/40 text-muted-foreground border-border"
  },
  "Department-Shared": {
    label: "Dept",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 9 }),
    classes: "bg-teal-500/10 text-teal-300 border-teal-500/20"
  },
  "Organization-Shared": {
    label: "Org",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 9 }),
    classes: "bg-sky-500/10 text-sky-300 border-sky-500/20"
  },
  "Hierarchy-Shared": {
    label: "Hierarchy",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 9 }),
    classes: "bg-violet-500/10 text-violet-300 border-violet-500/20"
  }
};
const TAG_COLORS = {
  "Strategic Contact": "bg-accent/10 text-accent border-accent/20",
  "Renewal Owner": "bg-sky-500/10 text-sky-300 border-sky-500/20",
  "Escalation Contact": "bg-orange-500/10 text-orange-300 border-orange-500/20",
  "Technical Lead": "bg-teal-500/10 text-teal-300 border-teal-500/20",
  "Marketing Lead": "bg-pink-500/10 text-pink-300 border-pink-500/20",
  "Executive Sponsor": "bg-violet-500/10 text-violet-300 border-violet-500/20",
  "Deal Desk": "bg-amber-500/10 text-amber-300 border-amber-500/20",
  "Operations Lead": "bg-lime-500/10 text-lime-300 border-lime-500/20"
};
function VisibilityBadge({ tier }) {
  const cfg = VISIBILITY_CONFIG[tier];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold border ${cfg.classes}`,
      children: [
        cfg.icon,
        cfg.label
      ]
    }
  );
}
function TagBadge({ tag }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium border ${TAG_COLORS[tag]}`,
      children: tag
    }
  );
}
function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange
}) {
  const [open, setOpen] = reactExports.useState(false);
  function toggle(opt) {
    onChange(
      selected.includes(opt) ? selected.filter((v) => v !== opt) : [...selected, opt]
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((p) => !p),
        className: `w-full flex items-center justify-between gap-1.5 px-2.5 py-2 rounded-lg text-xs border transition-colors ${selected.length > 0 ? "bg-accent/10 border-accent/30 text-accent" : "bg-input border-border text-muted-foreground hover:border-accent/30"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: selected.length > 0 ? `${label} (${selected.length})` : label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronDown,
            {
              size: 11,
              className: `flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-full left-0 right-0 mt-1 z-20 bg-card border border-border rounded-xl shadow-xl overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-44 overflow-y-auto", children: options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => toggle(opt),
          className: `w-full text-left px-3 py-2 text-xs flex items-center justify-between gap-2 transition-colors hover:bg-muted/20 ${selected.includes(opt) ? "text-accent" : "text-muted-foreground"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: opt }),
            selected.includes(opt) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-accent flex-shrink-0" })
          ]
        },
        opt
      )) }),
      selected.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange([]),
          className: "w-full px-3 py-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors text-left",
          children: "Clear selection"
        }
      ) })
    ] })
  ] });
}
function StakeholderCard({
  stakeholder,
  isAdmin,
  onMessage,
  index
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "cf-card rounded-2xl p-4 flex flex-col gap-3 hover:border-accent/30 transition-all relative group",
      "data-ocid": `user_finder.stakeholder.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 border ${stakeholder.avatarColor}`,
              children: stakeholder.initials
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground truncate", children: stakeholder.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground truncate", children: stakeholder.role })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(VisibilityBadge, { tier: stakeholder.visibilityTier })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 9, className: "flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
              stakeholder.organization,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 opacity-60", children: [
                "· ",
                stakeholder.orgType
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { size: 9, className: "flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: stakeholder.department })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 9, className: "flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: stakeholder.territory })
          ] })
        ] }),
        stakeholder.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: stakeholder.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(TagBadge, { tag }, tag)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5 transition-all duration-150 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": `user_finder.message_button.${index}`,
              onClick: () => onMessage(stakeholder),
              className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 10 }),
                " Message"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `user_finder.view_profile_button.${index}`,
              className: "flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium border border-border text-muted-foreground hover:text-foreground hover:border-accent/30 transition-colors",
              children: "View Profile"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `user_finder.view_accounts_button.${index}`,
              className: "flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium border border-border text-muted-foreground hover:text-foreground hover:border-accent/30 transition-colors",
              children: "Accounts"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `user_finder.view_territory_button.${index}`,
              onClick: () => ue.info(`Territory: ${stakeholder.territory}`, {
                description: `${stakeholder.name} covers the ${stakeholder.territory} territory.`
              }),
              className: "flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium border border-border text-muted-foreground hover:text-foreground hover:border-accent/30 transition-colors",
              children: "View Territory"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `user_finder.view_department_button.${index}`,
              onClick: () => ue.info(`Department: ${stakeholder.department}`, {
                description: `${stakeholder.name} is in the ${stakeholder.department} department at ${stakeholder.organization}.`
              }),
              className: "flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium border border-border text-muted-foreground hover:text-foreground hover:border-accent/30 transition-colors",
              children: "View Department"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `user_finder.view_role_button.${index}`,
              onClick: () => ue.info(`Role: ${stakeholder.role}`, {
                description: `${stakeholder.name} operates as ${stakeholder.role} within ${stakeholder.organization}.`
              }),
              className: "flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium border border-border text-muted-foreground hover:text-foreground hover:border-accent/30 transition-colors",
              children: "View Role"
            }
          ),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              "aria-label": "Change visibility tier",
              defaultValue: stakeholder.visibilityTier,
              className: "text-[9px] bg-transparent border border-border rounded-md px-1.5 py-1 text-muted-foreground hover:border-accent/30 outline-none cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Private", children: "Private" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Department-Shared", children: "Dept" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Organization-Shared", children: "Org" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Hierarchy-Shared", children: "Hierarchy" })
              ]
            }
          ) })
        ] }),
        stakeholder.recentCollaboration && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] text-muted-foreground/60 pt-1 border-t border-border/50", children: [
          "Last collaborated: ",
          stakeholder.recentCollaboration
        ] })
      ]
    }
  );
}
const DEFAULT_FILTERS = {
  orgType: [],
  territory: [],
  department: [],
  role: [],
  linkedVendor: [],
  linkedDistributor: [],
  linkedReseller: [],
  accountOwnership: [],
  visibilityType: [],
  recentCollaboration: []
};
function FilterPanel({
  filters,
  onChange,
  collapsed,
  onToggleCollapse
}) {
  const activeCount = Object.values(filters).flat().length;
  function setFilter(key, val) {
    onChange({ ...filters, [key]: val });
  }
  function clearAll() {
    onChange(DEFAULT_FILTERS);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex-shrink-0 flex flex-col bg-card/30 border-r border-border transition-all duration-300 ${collapsed ? "w-10" : "w-52"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-3 border-b border-border flex-shrink-0", children: [
          !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 11, className: "text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: "Filters" }),
            activeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold bg-accent text-accent-foreground rounded-full px-1.5 py-0.5", children: activeCount })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "user_finder.filter_panel.toggle",
              onClick: onToggleCollapse,
              className: "p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors",
              "aria-label": collapsed ? "Expand filters" : "Collapse filters",
              children: collapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 13 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 13 })
            }
          )
        ] }),
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-3", children: [
          activeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": "user_finder.filter_panel.clear_all",
              onClick: clearAll,
              className: "w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-medium border border-orange-500/30 text-orange-300 hover:bg-orange-500/10 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 9 }),
                " Clear All (",
                activeCount,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MultiSelectDropdown,
            {
              label: "Org Type",
              options: [
                "Vendor",
                "Distributor",
                "Global Distributor",
                "Reseller"
              ],
              selected: filters.orgType,
              onChange: (v) => setFilter("orgType", v)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MultiSelectDropdown,
            {
              label: "Territory",
              options: [
                "EMEA North",
                "EMEA South",
                "EMEA",
                "APAC",
                "APAC & EMEA",
                "UK & Ireland",
                "Nordics",
                "MENA",
                "Global"
              ],
              selected: filters.territory,
              onChange: (v) => setFilter("territory", v)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MultiSelectDropdown,
            {
              label: "Department",
              options: [
                "Account Management",
                "Channel Sales",
                "Deal Desk",
                "Sales Management",
                "Product Sales",
                "Marketing",
                "Customer Success",
                "Sales Operations",
                "Finance",
                "IT & Security",
                "Strategic Accounts",
                "Executive Leadership",
                "Technical Sales",
                "Renewals"
              ],
              selected: filters.department,
              onChange: (v) => setFilter("department", v)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MultiSelectDropdown,
            {
              label: "Operational Role",
              options: [
                "Account Manager",
                "Senior Channel Manager",
                "Deal Desk Analyst",
                "Sales Manager",
                "Renewal Specialist",
                "Marketing Lead",
                "Customer Success Manager",
                "Sales Ops Analyst",
                "Finance Partner",
                "Territory Owner",
                "VP Channel Sales",
                "Solutions Architect",
                "Global Account Director",
                "Security Operations Lead"
              ],
              selected: filters.role,
              onChange: (v) => setFilter("role", v)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MultiSelectDropdown,
            {
              label: "Linked Vendor",
              options: ["ChannelForge Vendor Co."],
              selected: filters.linkedVendor,
              onChange: (v) => setFilter("linkedVendor", v)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MultiSelectDropdown,
            {
              label: "Linked Distributor",
              options: ["Ingram Micro", "Global Distributors Ltd"],
              selected: filters.linkedDistributor,
              onChange: (v) => setFilter("linkedDistributor", v)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MultiSelectDropdown,
            {
              label: "Linked Reseller",
              options: ["Apex Partners", "NordTech Resellers"],
              selected: filters.linkedReseller,
              onChange: (v) => setFilter("linkedReseller", v)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MultiSelectDropdown,
            {
              label: "Account Ownership",
              options: [
                "TechCorp",
                "Nordic Energy Group",
                "Acme Corp",
                "Desperado",
                "Global Pharma Holdings",
                "Bluewave Solutions",
                "TechVision Ltd"
              ],
              selected: filters.accountOwnership,
              onChange: (v) => setFilter("accountOwnership", v)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MultiSelectDropdown,
            {
              label: "Visibility Type",
              options: [
                "Private",
                "Department-Shared",
                "Organization-Shared",
                "Hierarchy-Shared"
              ],
              selected: filters.visibilityType,
              onChange: (v) => setFilter("visibilityType", v)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MultiSelectDropdown,
            {
              label: "Recent Collaboration",
              options: [
                "Today",
                "Yesterday",
                "2 days ago",
                "3 days ago",
                "4 days ago",
                "5 days ago",
                "1 week ago"
              ],
              selected: filters.recentCollaboration,
              onChange: (v) => setFilter("recentCollaboration", v)
            }
          )
        ] }) })
      ]
    }
  );
}
function UserFinderTab({
  onMessageUser,
  isAdmin = false
}) {
  const [search, setSearch] = reactExports.useState("");
  const [filters, setFilters] = reactExports.useState(DEFAULT_FILTERS);
  const [filterCollapsed, setFilterCollapsed] = reactExports.useState(false);
  const myContacts = MOCK_STAKEHOLDERS.filter(
    (s) => MY_CONTACTS_IDS.includes(s.id)
  );
  const filtered = reactExports.useMemo(() => {
    return MOCK_STAKEHOLDERS.filter((s) => {
      var _a, _b, _c;
      if (search) {
        const q = search.toLowerCase();
        const hit = s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.employeeNumber.toLowerCase().includes(q) || s.department.toLowerCase().includes(q) || s.organization.toLowerCase().includes(q) || s.territory.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.assignedAccounts.some((a) => a.toLowerCase().includes(q)) || (((_a = s.linkedVendor) == null ? void 0 : _a.toLowerCase().includes(q)) ?? false) || (((_b = s.linkedDistributor) == null ? void 0 : _b.toLowerCase().includes(q)) ?? false) || (((_c = s.linkedReseller) == null ? void 0 : _c.toLowerCase().includes(q)) ?? false);
        if (!hit) return false;
      }
      if (filters.orgType.length > 0 && !filters.orgType.includes(s.orgType))
        return false;
      if (filters.territory.length > 0 && !filters.territory.includes(s.territory))
        return false;
      if (filters.department.length > 0 && !filters.department.includes(s.department))
        return false;
      if (filters.role.length > 0 && !filters.role.includes(s.role))
        return false;
      if (filters.linkedVendor.length > 0 && !(s.linkedVendor && filters.linkedVendor.includes(s.linkedVendor)))
        return false;
      if (filters.linkedDistributor.length > 0 && !(s.linkedDistributor && filters.linkedDistributor.includes(s.linkedDistributor)))
        return false;
      if (filters.linkedReseller.length > 0 && !(s.linkedReseller && filters.linkedReseller.includes(s.linkedReseller)))
        return false;
      if (filters.accountOwnership.length > 0 && !s.assignedAccounts.some((a) => filters.accountOwnership.includes(a)))
        return false;
      if (filters.visibilityType.length > 0 && !filters.visibilityType.includes(s.visibilityTier))
        return false;
      if (filters.recentCollaboration.length > 0 && !(s.recentCollaboration && filters.recentCollaboration.includes(s.recentCollaboration)))
        return false;
      return true;
    });
  }, [search, filters]);
  function handleMessage(s) {
    onMessageUser(s.name);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full overflow-hidden", "data-ocid": "user_finder.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FilterPanel,
      {
        filters,
        onChange: setFilters,
        collapsed: filterCollapsed,
        onToggleCollapse: () => setFilterCollapsed((p) => !p)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 px-5 py-4 border-b border-border bg-card/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-foreground font-display flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookUser, { size: 14, className: "text-accent" }),
              "User Finder"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "Discover operational stakeholders across your ecosystem" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-accent", children: filtered.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "of ",
              MOCK_STAKEHOLDERS.length,
              " stakeholders"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Search,
            {
              size: 12,
              className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              "data-ocid": "user_finder.search.input",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              placeholder: "Search by name, email, employee #, department, org, territory, role, linked accounts...",
              className: "w-full pl-8 pr-10 py-2.5 rounded-xl text-xs bg-input border border-border text-foreground placeholder-muted-foreground outline-none focus:border-accent transition-colors"
            }
          ),
          search && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setSearch(""),
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
              "aria-label": "Clear search",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 11 })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-6", children: [
        !search && Object.values(filters).flat().length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "user_finder.my_contacts.section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 12, className: "text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-bold text-foreground font-display", children: "My Contacts" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "· Frequently collaborated & account-aligned" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3", children: myContacts.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            StakeholderCard,
            {
              stakeholder: s,
              isAdmin,
              onMessage: handleMessage,
              index: i + 1
            },
            s.id
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "user_finder.all_stakeholders.section", children: [
          (search || Object.values(filters).flat().length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 12, className: "text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-bold text-foreground font-display", children: "Search Results" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[9px] h-4 px-1.5 bg-accent/15 text-accent border-accent/20 border font-semibold", children: filtered.length })
          ] }),
          !search && Object.values(filters).flat().length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 12, className: "text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-bold text-foreground font-display", children: "All Stakeholders" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[9px] h-4 px-1.5 bg-muted/40 text-muted-foreground border-border border font-semibold", children: MOCK_STAKEHOLDERS.length })
          ] }),
          filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-16 text-center",
              "data-ocid": "user_finder.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-muted/20 border border-border flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookUser, { size: 20, className: "text-muted-foreground/50" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-1", children: "No stakeholders found" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Try adjusting your search or filters" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "user_finder.empty_state.clear_button",
                    onClick: () => {
                      setSearch("");
                      setFilters(DEFAULT_FILTERS);
                    },
                    className: "mt-4 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-accent/30 transition-colors",
                    children: "Clear filters"
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3", children: filtered.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            StakeholderCard,
            {
              stakeholder: s,
              isAdmin,
              onMessage: handleMessage,
              index: i + 1
            },
            s.id
          )) })
        ] })
      ] }) })
    ] })
  ] });
}
function participantPhoto(senderName, teamMembers) {
  const member = teamMembers.find(
    (m) => m.fullName.toLowerCase() === senderName.toLowerCase()
  );
  return (member == null ? void 0 : member.profilePhotoUrl) ?? null;
}
function AvatarImg({
  photoUrl,
  name,
  className,
  fallback
}) {
  if (photoUrl) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: photoUrl,
        alt: name,
        className: `object-cover rounded-full ${className}`
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: fallback });
}
const MOCK_CONVERSATIONS = [
  {
    id: "conv-acme",
    name: "Acme Corp",
    subtitle: "Account thread — 3 participants",
    type: "Account",
    lastMessage: "Renewal pack has been uploaded for review.",
    timestamp: "2 min",
    unread: 2,
    contextLabel: "Account: Acme Corp",
    messages: [
      {
        id: "m1",
        content: "Hi team — quarterly review doc is ready. Please review before Thursday.",
        sender: "James Porter",
        senderInitial: "J",
        side: "received",
        time: "09:14",
        date: "Yesterday",
        read: true
      },
      {
        id: "m2",
        content: "Thanks James. I'll go through it this afternoon.",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "09:31",
        date: "Yesterday",
        read: true
      },
      {
        id: "m3",
        content: "Also worth noting — TechVision renewal is due in 18 days. I've flagged it with the account manager.",
        sender: "James Porter",
        senderInitial: "J",
        side: "received",
        time: "10:05",
        date: "Yesterday",
        read: true
      },
      {
        id: "m4",
        content: "Good call. Let's make sure we have the contract ready 2 weeks before.",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "10:17",
        date: "Yesterday",
        read: true
      },
      {
        id: "m5",
        content: "Sarah from the vendor side has signed off on the pricing terms.",
        sender: "Lisa Chen",
        senderInitial: "L",
        side: "received",
        time: "14:22",
        date: "Yesterday",
        read: true
      },
      {
        id: "m6",
        content: "Excellent news. I'll update the renewal record in the CRM.",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "14:35",
        date: "Yesterday",
        read: true
      },
      {
        id: "m7",
        content: "Renewal pack has been uploaded for review. Please check the documents tab.",
        sender: "James Porter",
        senderInitial: "J",
        side: "received",
        time: "08:50",
        date: "Today",
        read: false
      },
      {
        id: "m8",
        content: "Confirming also that the reseller pricing alignment meeting is booked for next Tuesday at 10am.",
        sender: "Lisa Chen",
        senderInitial: "L",
        side: "received",
        time: "09:12",
        date: "Today",
        read: false
      }
    ]
  },
  {
    id: "conv-sarah",
    name: "Sarah Mitchell",
    subtitle: "Account Manager — Ingram Micro",
    type: "Direct",
    lastMessage: "Can we align on TechCorp renewal pricing?",
    timestamp: "1h",
    unread: 3,
    messages: [
      {
        id: "m1",
        content: "Hi! Just wanted to check in on the TechCorp renewal. It's coming up in 18 days.",
        sender: "Sarah Mitchell",
        senderInitial: "S",
        side: "received",
        time: "11:20",
        date: "Yesterday",
        read: true
      },
      {
        id: "m2",
        content: "Yes, I'm aware. I've been in touch with the account team.",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "11:45",
        date: "Yesterday",
        read: true
      },
      {
        id: "m3",
        content: "The renewal for TechCorp is due next week — can we align on pricing before I approach them?",
        sender: "Sarah Mitchell",
        senderInitial: "S",
        side: "received",
        time: "09:05",
        date: "Today",
        read: false
      },
      {
        id: "m4",
        content: "I'll ping the deal desk now and come back to you within 2 hours.",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "09:12",
        date: "Today",
        read: false
      },
      {
        id: "m5",
        content: "Perfect — also, are you aware the discount approval needs to go through the new process?",
        sender: "Sarah Mitchell",
        senderInitial: "S",
        side: "received",
        time: "09:20",
        date: "Today",
        read: false
      }
    ]
  },
  {
    id: "conv-forgeai",
    name: "ForgeAI Alerts",
    subtitle: "Operational intelligence notifications",
    type: "Alert",
    lastMessage: "3 new high-priority alerts detected.",
    timestamp: "5 min",
    unread: 3,
    isForgeAI: true,
    messages: [
      {
        id: "m1",
        content: "🔴 HIGH PRIORITY: TechVision Ltd renewal is in 18 days with 87% churn probability. No renewal discussion on record. Immediate outreach recommended.",
        sender: "ForgeAI",
        senderInitial: "F",
        side: "forgeai",
        time: "08:30",
        date: "Today",
        read: false
      },
      {
        id: "m2",
        content: "🟠 MEDIUM: Stratos Digital opportunity has been stalled at Proposal stage for 28 days. Win rate drops significantly after 30 days without response.",
        sender: "ForgeAI",
        senderInitial: "F",
        side: "forgeai",
        time: "08:32",
        date: "Today",
        read: false
      },
      {
        id: "m3",
        content: "🔴 HIGH PRIORITY: Bluewave Solutions — no activity logged in 47 days. Account health score dropped from 78 to 41. Renewal due in 5 months.",
        sender: "ForgeAI",
        senderInitial: "F",
        side: "forgeai",
        time: "08:35",
        date: "Today",
        read: false
      }
    ]
  },
  {
    id: "conv-techvision",
    name: "TechVision Q3 Deal",
    subtitle: "Opportunity thread — 2 participants",
    type: "Opportunity",
    lastMessage: "Approval needed on the modified deal value.",
    timestamp: "15 min",
    unread: 1,
    contextLabel: "Opp: TechVision Q3 Deal",
    messages: [
      {
        id: "m1",
        content: "The deal value has been modified to £85,000 based on the negotiated terms.",
        sender: "Priya Sharma",
        senderInitial: "P",
        side: "received",
        time: "11:00",
        date: "Dec 5",
        read: true
      },
      {
        id: "m2",
        content: "Understood. I'll get it in front of the deal desk today.",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "11:15",
        date: "Dec 5",
        read: true
      },
      {
        id: "m3",
        content: "Approval needed on the modified deal value. See attached deal summary.",
        sender: "Priya Sharma",
        senderInitial: "P",
        side: "received",
        time: "09:45",
        date: "Today",
        read: false
      }
    ]
  },
  {
    id: "conv-apexpartners",
    name: "Apex Partners",
    subtitle: "Reseller partner thread — 4 participants",
    type: "Account",
    lastMessage: "MDF claim for Q3 campaign has been submitted.",
    timestamp: "2h",
    unread: 0,
    contextLabel: "Account: Apex Partners",
    messages: [
      {
        id: "m1",
        content: "We've submitted the MDF claim for the Q3 digital campaign. Total spend was £12,400.",
        sender: "Tom Richards",
        senderInitial: "T",
        side: "received",
        time: "14:30",
        date: "Yesterday",
        read: true
      },
      {
        id: "m2",
        content: "Received. We'll process this within 5 business days.",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "14:55",
        date: "Yesterday",
        read: true
      },
      {
        id: "m3",
        content: "MDF claim for Q3 campaign has been submitted. Confirmation reference: MDF-2024-0183.",
        sender: "Tom Richards",
        senderInitial: "T",
        side: "received",
        time: "10:20",
        date: "Today",
        read: true
      }
    ]
  },
  {
    id: "conv-lumitechop",
    name: "LumiTech Expansion",
    subtitle: "Opportunity thread — 3 participants",
    type: "Opportunity",
    lastMessage: "Proposal version 2 is ready for review.",
    timestamp: "3h",
    unread: 0,
    contextLabel: "Opp: LumiTech Expansion",
    messages: [
      {
        id: "m1",
        content: "The revised proposal is ready. Key changes: extended payment terms and an additional 8% volume discount.",
        sender: "Anna Clarke",
        senderInitial: "A",
        side: "received",
        time: "09:00",
        date: "Today",
        read: true
      },
      {
        id: "m2",
        content: "Thanks Anna. I'll review and get back to you by EOD.",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "09:22",
        date: "Today",
        read: true
      },
      {
        id: "m3",
        content: "Proposal version 2 is ready for review. Please confirm receipt.",
        sender: "Anna Clarke",
        senderInitial: "A",
        side: "received",
        time: "11:00",
        date: "Today",
        read: true
      }
    ]
  },
  {
    id: "conv-michael",
    name: "Michael Torres",
    subtitle: "Sales Manager — Distribution",
    type: "Direct",
    lastMessage: "Team forecast numbers look good for Q3.",
    timestamp: "Yesterday",
    unread: 0,
    messages: [
      {
        id: "m1",
        content: "Team forecast numbers look good for Q3. We're tracking at 94% of target.",
        sender: "Michael Torres",
        senderInitial: "M",
        side: "received",
        time: "16:45",
        date: "Yesterday",
        read: true
      },
      {
        id: "m2",
        content: "Great to hear. Let's keep the momentum going into the last 2 weeks.",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "17:02",
        date: "Yesterday",
        read: true
      }
    ]
  },
  {
    id: "conv-corelink",
    name: "Corelink Solutions",
    subtitle: "Account thread — 2 participants",
    type: "Account",
    lastMessage: "QBR has been rescheduled to next Thursday.",
    timestamp: "Yesterday",
    unread: 0,
    contextLabel: "Account: Corelink Solutions",
    messages: [
      {
        id: "m1",
        content: "We need to reschedule the QBR. The client has a conflict next Monday.",
        sender: "Rachel Kim",
        senderInitial: "R",
        side: "received",
        time: "11:30",
        date: "Yesterday",
        read: true
      },
      {
        id: "m2",
        content: "No problem. Would Thursday 10am work?",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "11:45",
        date: "Yesterday",
        read: true
      },
      {
        id: "m3",
        content: "QBR has been rescheduled to next Thursday at 10am. Calendar invite sent.",
        sender: "Rachel Kim",
        senderInitial: "R",
        side: "received",
        time: "12:10",
        date: "Yesterday",
        read: true
      }
    ]
  }
];
const TYPE_FILTER_OPTIONS = [
  "All",
  "Direct",
  "Account",
  "Opportunity",
  "Alert"
];
function threadTypeBadge(type) {
  const map = {
    Direct: "text-muted-foreground bg-muted/40 border-border",
    Account: "text-accent bg-accent/10 border-accent/25",
    Opportunity: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    Alert: "text-orange-400 bg-orange-500/10 border-orange-500/20"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `text-[9px] font-semibold rounded-full px-2 py-0.5 border ${map[type]}`,
      children: type
    }
  );
}
function avatarBg(conv) {
  if (conv.isForgeAI) return "bg-accent/20 border border-accent/30";
  if (conv.type === "Account") return "bg-sky-500/20 border border-sky-500/30";
  if (conv.type === "Opportunity")
    return "bg-violet-500/20 border border-violet-500/30";
  return "bg-muted/40 border border-border";
}
function dateSeparator(date) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 my-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground px-2", children: date }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" })
  ] }, `sep-${date}`);
}
function MessagingPage() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const {
    userProfile,
    userProfileDetail,
    teamMembers,
    isOrgAccessible,
    isPrimaryAdmin,
    isSecondaryAdmin
  } = useApp();
  const [mainTab, setMainTab] = reactExports.useState(
    "messages"
  );
  const [search, setSearch] = reactExports.useState("");
  const [typeFilter, setTypeFilter] = reactExports.useState("All");
  const [activeId, setActiveId] = reactExports.useState(
    params.conversationId ?? "conv-acme"
  );
  const [messageInput, setMessageInput] = reactExports.useState("");
  const [isComposing, setIsComposing] = reactExports.useState(false);
  const [composeTo, setComposeTo] = reactExports.useState("");
  const [composeMessage, setComposeMessage] = reactExports.useState("");
  const [localMessages, setLocalMessages] = reactExports.useState(Object.fromEntries(MOCK_CONVERSATIONS.map((c) => [c.id, c.messages])));
  const [mobileView, setMobileView] = reactExports.useState("list");
  const messagesEndRef = reactExports.useRef(null);
  const orgConversations = MOCK_CONVERSATIONS.filter((c) => {
    if (!c.orgDomain) return true;
    return isOrgAccessible(c.orgDomain);
  });
  const filteredConvs = orgConversations.filter((c) => {
    const matchSearch = search.length === 0 || c.name.toLowerCase().includes(search.toLowerCase()) || c.lastMessage.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || c.type === typeFilter;
    return matchSearch && matchType;
  });
  const activeConv = orgConversations.find((c) => c.id === activeId) ?? orgConversations[0] ?? MOCK_CONVERSATIONS[0];
  const activeMessages = localMessages[activeId] ?? activeConv.messages;
  const groupedMessages = [];
  for (const msg of activeMessages) {
    const last = groupedMessages[groupedMessages.length - 1];
    if (!last || last.date !== msg.date) {
      groupedMessages.push({ date: msg.date, messages: [msg] });
    } else {
      last.messages.push(msg);
    }
  }
  function selectConversation(id) {
    setActiveId(id);
    setMobileView("conversation");
    navigate({
      to: "/messages/$conversationId",
      params: { conversationId: id }
    });
  }
  function handleSend() {
    const trimmed = messageInput.trim();
    if (!trimmed) return;
    const now = /* @__PURE__ */ new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
    const newMsg = {
      id: `local-${Date.now()}`,
      content: trimmed,
      sender: (userProfile == null ? void 0 : userProfile.fullName) ?? "You",
      senderInitial: ((userProfile == null ? void 0 : userProfile.fullName) ?? "Y").charAt(0),
      side: "sent",
      time: timeStr,
      date: "Today",
      read: true
    };
    setLocalMessages((prev) => ({
      ...prev,
      [activeId]: [...prev[activeId] ?? [], newMsg]
    }));
    setMessageInput("");
    setTimeout(
      () => {
        var _a;
        return (_a = messagesEndRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
      },
      50
    );
  }
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }
  const charCount = messageInput.length;
  const isAdminUser = isPrimaryAdmin() || isSecondaryAdmin();
  function handleMessageUser(name) {
    setMainTab("messages");
    setIsComposing(true);
    setComposeTo(name);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full overflow-hidden", "data-ocid": "messaging.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `flex-shrink-0 flex flex-col border-r border-border bg-card/30 ${mobileView === "conversation" ? "hidden lg:flex" : "flex"} w-full lg:w-80`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 border-b border-border flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-foreground font-display", children: mainTab === "messages" ? "Messages" : "User Finder" }),
              mainTab === "messages" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "messaging.new_message.button",
                  onClick: () => setIsComposing(true),
                  className: "flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 }),
                    " New"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "messaging.tab.messages",
                  onClick: () => setMainTab("messages"),
                  className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${mainTab === "messages" ? "bg-accent/15 text-accent border-accent/30" : "bg-transparent text-muted-foreground border-border hover:border-accent/20"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 11 }),
                    " Messages"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "messaging.tab.user_finder",
                  onClick: () => setMainTab("user-finder"),
                  className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${mainTab === "user-finder" ? "bg-accent/15 text-accent border-accent/30" : "bg-transparent text-muted-foreground border-border hover:border-accent/20"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(BookUser, { size: 11 }),
                    " User Finder"
                  ]
                }
              )
            ] }),
            mainTab === "messages" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Search,
                  {
                    size: 12,
                    className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    "data-ocid": "messaging.search.input",
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    placeholder: "Search conversations\\u2026",
                    className: "w-full pl-8 pr-3 py-2 rounded-lg text-xs bg-input border border-border text-foreground placeholder-muted-foreground outline-none focus:border-accent transition-colors"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 overflow-x-auto pb-0.5", children: TYPE_FILTER_OPTIONS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `messaging.filter.${f.toLowerCase()}`,
                  onClick: () => setTypeFilter(f),
                  className: `flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors border ${typeFilter === f ? "bg-accent/15 text-accent border-accent/30" : "bg-transparent text-muted-foreground border-border hover:border-accent/20"}`,
                  children: f
                },
                f
              )) })
            ] })
          ] }),
          mainTab === "messages" && /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: filteredConvs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-12 px-4 text-center",
              "data-ocid": "messaging.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MessageSquare,
                  {
                    size: 28,
                    className: "text-muted-foreground/40 mb-2"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No conversations found" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 space-y-0.5", children: filteredConvs.map((c, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `messaging.conversation.item.${idx + 1}`,
              onClick: () => selectConversation(c.id),
              className: `w-full text-left rounded-xl px-3 py-3 transition-all ${activeId === c.id ? "bg-accent/10 border border-accent/20" : "border border-transparent hover:bg-muted/20"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold overflow-hidden ${avatarBg(c)} ${c.unread > 0 ? "ring-2 ring-accent/40" : ""}`,
                    children: c.isForgeAI ? /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { size: 14, className: "text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      AvatarImg,
                      {
                        photoUrl: participantPhoto(c.name, teamMembers),
                        name: c.name,
                        className: "w-9 h-9",
                        fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: c.name.charAt(0) })
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-1 mb-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `text-xs font-semibold truncate ${c.unread > 0 ? "text-foreground" : "text-foreground/80"}`,
                        children: c.name
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground flex-shrink-0", children: c.timestamp })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
                    threadTypeBadge(c.type),
                    c.unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[9px] h-4 px-1.5 font-bold bg-accent text-accent-foreground border-0", children: c.unread })
                  ] }),
                  c.contextLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-accent/70 mb-0.5 truncate", children: c.contextLabel }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground truncate", children: c.lastMessage })
                ] })
              ] })
            },
            c.id
          )) }) })
        ]
      }
    ),
    mainTab === "user-finder" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col min-w-0 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      UserFinderTab,
      {
        onMessageUser: handleMessageUser,
        isAdmin: isAdminUser
      }
    ) }),
    mainTab === "messages" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `flex-1 flex flex-col min-w-0 ${mobileView === "list" ? "hidden lg:flex" : "flex"}`,
        children: activeConv ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "h-14 px-5 flex items-center gap-3 border-b border-border bg-card/30 flex-shrink-0",
              "data-ocid": "messaging.conversation.panel",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "lg:hidden p-1 text-muted-foreground hover:text-foreground text-lg",
                    onClick: () => setMobileView("list"),
                    "aria-label": "Back to conversations",
                    children: "←"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold overflow-hidden ${avatarBg(activeConv)}`,
                    children: activeConv.isForgeAI ? /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { size: 13, className: "text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      AvatarImg,
                      {
                        photoUrl: participantPhoto(activeConv.name, teamMembers),
                        name: activeConv.name,
                        className: "w-8 h-8",
                        fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: activeConv.name.charAt(0) })
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground truncate", children: activeConv.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    threadTypeBadge(activeConv.type),
                    activeConv.contextLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-accent/70 truncate", children: activeConv.contextLabel })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Archive",
                      className: "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { size: 14 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Mute",
                      className: "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { size: 14 })
                    }
                  ),
                  activeConv.contextLabel && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      className: "hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-colors",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 11 }),
                        " View Account"
                      ]
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col max-w-3xl mx-auto", children: [
            groupedMessages.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              dateSeparator(group.date),
              group.messages.map((msg, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                MessageBubble,
                {
                  msg,
                  index: i,
                  currentUserPhotoUrl: (userProfileDetail == null ? void 0 : userProfileDetail.profilePhotoUrl) ?? null,
                  teamMembers
                },
                msg.id
              ))
            ] }, group.date)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 px-5 py-4 border-t border-border bg-card/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-3xl mx-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                "data-ocid": "messaging.compose.input",
                value: messageInput,
                onChange: (e) => setMessageInput(e.target.value),
                onKeyDown: handleKeyDown,
                placeholder: "Type a message\\u2026",
                rows: 2,
                className: "w-full resize-none rounded-xl px-4 py-3 pr-28 text-sm bg-input border border-border text-foreground placeholder-muted-foreground outline-none focus:border-accent transition-colors font-body leading-relaxed"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-2 bottom-2 flex items-center gap-1", children: [
              charCount > 200 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground mr-1", children: [
                charCount,
                "/1000"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Tag user",
                  className: "p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(AtSign, { size: 14 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Attach file",
                  className: "p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { size: 14 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "messaging.send.button",
                  onClick: handleSend,
                  disabled: !messageInput.trim(),
                  className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 12 })
                }
              )
            ] })
          ] }) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-1 flex flex-col items-center justify-center",
            "data-ocid": "messaging.no_selection.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-accent/8 border border-accent/20 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 28, className: "text-accent" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-foreground mb-2 font-display", children: "Select a conversation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center max-w-xs font-body", children: "Choose a conversation from the list to view messages, or start a new direct message." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "messaging.new_message_empty.button",
                  onClick: () => setIsComposing(true),
                  className: "mt-5 flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
                    " New Message"
                  ]
                }
              )
            ]
          }
        )
      }
    ),
    isComposing && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm",
        "data-ocid": "messaging.compose.dialog",
        onClick: (e) => {
          if (e.target === e.currentTarget) setIsComposing(false);
        },
        onKeyDown: (e) => {
          if (e.key === "Escape") setIsComposing(false);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cf-card rounded-2xl p-6 w-full max-w-md shadow-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-foreground font-display", children: "New Message" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "messaging.compose.close_button",
                onClick: () => setIsComposing(false),
                className: "p-1 text-muted-foreground hover:text-foreground transition-colors rounded",
                "aria-label": "Close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "compose-to",
                  className: "block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wide",
                  children: "Recipient"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "compose-to",
                  "data-ocid": "messaging.compose.recipient.input",
                  value: composeTo,
                  onChange: (e) => setComposeTo(e.target.value),
                  placeholder: "Search for a user or team\\u2026",
                  className: "w-full px-3 py-2 rounded-lg text-sm bg-input border border-border text-foreground placeholder-muted-foreground outline-none focus:border-accent transition-colors"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "compose-message",
                  className: "block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wide",
                  children: "Message"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  id: "compose-message",
                  "data-ocid": "messaging.compose.message.textarea",
                  value: composeMessage,
                  onChange: (e) => setComposeMessage(e.target.value),
                  placeholder: "Type your message\\u2026",
                  rows: 4,
                  className: "w-full px-3 py-2 rounded-lg text-sm bg-input border border-border text-foreground placeholder-muted-foreground outline-none focus:border-accent transition-colors resize-none font-body"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 mt-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "messaging.compose.cancel_button",
                onClick: () => {
                  setIsComposing(false);
                  setComposeTo("");
                  setComposeMessage("");
                },
                className: "px-4 py-2 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:text-foreground transition-colors",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "messaging.compose.send_button",
                disabled: !composeTo.trim() || !composeMessage.trim(),
                onClick: () => {
                  setIsComposing(false);
                  setComposeTo("");
                  setComposeMessage("");
                },
                className: "px-4 py-2 rounded-lg text-sm font-semibold bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 transition-colors flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 13 }),
                  " Send Message"
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function MessageBubble({
  msg,
  index,
  currentUserPhotoUrl,
  teamMembers
}) {
  if (msg.side === "forgeai") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex gap-3 items-start mb-3",
        "data-ocid": `messaging.message.item.${index + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { size: 12, className: "text-accent" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[75%]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-accent mb-1 font-semibold", children: [
              "ForgeAI \\u00b7 ",
              msg.time
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl rounded-tl-md px-4 py-3 text-sm font-body leading-relaxed border border-accent/30 bg-accent/5 text-foreground/90", children: msg.content })
          ] })
        ]
      }
    );
  }
  if (msg.side === "sent") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex gap-3 items-end flex-row-reverse mb-3",
        "data-ocid": `messaging.message.item.${index + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground flex-shrink-0 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            AvatarImg,
            {
              photoUrl: currentUserPhotoUrl,
              name: msg.sender,
              className: "w-7 h-7",
              fallback: msg.senderInitial
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[75%]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground mb-1 text-right", children: [
              "You \\u00b7 ",
              msg.time,
              msg.read ? " ✓✓" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl rounded-br-md px-4 py-3 text-sm bg-accent text-accent-foreground font-body leading-relaxed", children: msg.content })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex gap-3 items-end mb-3",
      "data-ocid": `messaging.message.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-muted/50 border border-border flex items-center justify-center text-[10px] font-bold text-foreground flex-shrink-0 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          AvatarImg,
          {
            photoUrl: participantPhoto(msg.sender, teamMembers),
            name: msg.sender,
            className: "w-7 h-7",
            fallback: msg.senderInitial
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[75%]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground mb-1", children: [
            msg.sender,
            " \\u00b7 ",
            msg.time
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl rounded-bl-md px-4 py-3 text-sm bg-card border border-border text-foreground font-body leading-relaxed", children: msg.content })
        ] })
      ]
    }
  );
}
export {
  MessagingPage
};
