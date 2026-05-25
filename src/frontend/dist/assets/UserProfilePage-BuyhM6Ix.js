import { c as createLucideIcon, u as useApp, j as jsxRuntimeExports, U as Users, H as Shield, aj as getInitials, o as Badge, bz as Separator, m as Button, N as MessageSquare, L as Lock, r as reactExports, X, a as useNavigate, bx as useParams, p as useActor, by as ScrollArea, ai as ArrowLeft, bl as FlaskConical, B as Building2, a9 as Globe, K as Server, ab as ue, aF as Label, ad as Input, as as Check, bA as ProfileVisibilityScope } from "./index-DvFvlUBj.js";
import { T as Textarea } from "./textarea-BHUaDciu.js";
import { M as Mail } from "./mail-BpQyu_iW.js";
import { M as MapPin } from "./map-pin-BB_ykcTK.js";
import { P as PenLine } from "./pen-line-CeRHR2h1.js";
import { P as Phone } from "./phone-DSozTLzi.js";
import { C as Calendar } from "./calendar-BzO3LGDM.js";
import { L as Link } from "./link-DSL4JQc8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
];
const Camera = createLucideIcon("camera", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
      key: "c2jq9f"
    }
  ],
  ["rect", { width: "4", height: "12", x: "2", y: "9", key: "mk3on5" }],
  ["circle", { cx: "4", cy: "4", r: "2", key: "bt5ra8" }]
];
const Linkedin = createLucideIcon("linkedin", __iconNode);
const ORANGE$2 = "#FF6B2B";
const BG$2 = "#0b1724";
const BORDER$2 = "#1e3050";
const TEXT_MUTED$2 = "#7D8AA0";
function userTypeBadgeStyle$1(type) {
  if (type === "PrimaryAdmin")
    return {
      background: "rgba(255,107,43,0.18)",
      color: ORANGE$2,
      border: "1px solid rgba(255,107,43,0.35)"
    };
  if (type === "SecondaryAdmin")
    return {
      background: "rgba(99,179,237,0.15)",
      color: "#63B3ED",
      border: "1px solid rgba(99,179,237,0.3)"
    };
  return {
    background: "rgba(148,163,184,0.12)",
    color: "#94A3B8",
    border: "1px solid rgba(148,163,184,0.25)"
  };
}
function avatarColor$1(type) {
  if (type === "PrimaryAdmin") return ORANGE$2;
  if (type === "SecondaryAdmin") return "#2C5282";
  return "#2D3748";
}
function userTypeDisplayLabel$1(type) {
  if (type === "PrimaryAdmin") return "Primary Admin";
  if (type === "SecondaryAdmin") return "Secondary Admin";
  return "End User";
}
function getManagerName(member, members) {
  if (!member.reportingToId) return "";
  const manager = members.find((m) => m.id === member.reportingToId);
  return manager ? manager.fullName : "";
}
function TeamMemberCard({
  member,
  allMembers
}) {
  const managerName = getManagerName(member, allMembers);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl p-4 flex flex-col gap-3 transition-all hover:border-white/20 hover:shadow-lg team-member-card",
      style: { background: BG$2, border: `1px solid ${BORDER$2}` },
      "data-ocid": "profile.team.card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ring-2 ring-offset-2 ${member.userType === "PrimaryAdmin" ? "ring-accent" : "ring-transparent"}`,
              style: { background: avatarColor$1(member.userType) },
              children: member.profilePhotoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: member.profilePhotoUrl,
                  alt: member.fullName,
                  className: "w-full h-full rounded-full object-cover"
                }
              ) : getInitials(member.fullName)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground truncate", children: member.fullName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  style: userTypeBadgeStyle$1(member.userType),
                  className: "text-[10px] px-1.5 py-0",
                  children: userTypeDisplayLabel$1(member.userType)
                }
              )
            ] }),
            member.jobTitle && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-xs mt-0.5 truncate",
                style: { color: TEXT_MUTED$2 },
                children: member.jobTitle
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { style: { background: BORDER$2 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs", children: [
          { label: "Department", value: member.department },
          { label: "Territory", value: member.territory },
          { label: "Role", value: member.role },
          {
            label: "Reports To",
            value: managerName || (member.userType === "PrimaryAdmin" ? "Top Level" : "—")
          }
        ].map(
          ({ label, value }) => value ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block", style: { color: TEXT_MUTED$2 }, children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: value })
          ] }, label) : null
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            size: "sm",
            className: "w-full gap-1.5 text-xs mt-1",
            style: {
              background: "rgba(255,107,43,0.12)",
              color: ORANGE$2,
              border: "1px solid rgba(255,107,43,0.25)"
            },
            "data-ocid": "profile.team.message_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 12 }),
              " Message"
            ]
          }
        )
      ]
    }
  );
}
function MyTeamTab() {
  const { teamMembers } = useApp();
  if (!teamMembers || teamMembers.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl p-10 text-center",
        style: { background: BG$2, border: `1px solid ${BORDER$2}` },
        "data-ocid": "profile.team.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Users,
            {
              size: 32,
              className: "mx-auto mb-3",
              style: { color: TEXT_MUTED$2 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No team members found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", style: { color: TEXT_MUTED$2 }, children: "Your team members will appear here once your workspace is set up." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "profile.team_tab", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl px-4 py-3 flex items-center gap-2.5",
        style: {
          background: "rgba(99,179,237,0.08)",
          border: "1px solid rgba(99,179,237,0.2)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 14, style: { color: "#63B3ED", flexShrink: 0 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "#90CDF4" }, children: "Showing teammates in your organisation. Visible to same-workspace members only." })
        ]
      }
    ),
    teamMembers.filter((m) => m.userType === "PrimaryAdmin").length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-[10px] font-semibold uppercase tracking-wider mb-2.5 px-0.5",
          style: { color: TEXT_MUTED$2 },
          children: "Primary Admin"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: teamMembers.filter((m) => m.userType === "PrimaryAdmin").map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TeamMemberCard,
        {
          member: m,
          allMembers: teamMembers
        },
        m.id
      )) })
    ] }),
    teamMembers.filter((m) => m.userType === "SecondaryAdmin").length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-[10px] font-semibold uppercase tracking-wider mb-2.5 px-0.5",
          style: { color: TEXT_MUTED$2 },
          children: "Secondary Admins"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: teamMembers.filter((m) => m.userType === "SecondaryAdmin").map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TeamMemberCard,
        {
          member: m,
          allMembers: teamMembers
        },
        m.id
      )) })
    ] }),
    teamMembers.filter((m) => m.userType === "EndUser").length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-[10px] font-semibold uppercase tracking-wider mb-2.5 px-0.5",
          style: { color: TEXT_MUTED$2 },
          children: "Team Members"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: teamMembers.filter((m) => m.userType === "EndUser").map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TeamMemberCard,
        {
          member: m,
          allMembers: teamMembers
        },
        m.id
      )) })
    ] })
  ] });
}
const ORANGE$1 = "#FF6B2B";
const BG$1 = "#0b1724";
const BORDER$1 = "#1e3050";
const TEXT_MUTED$1 = "#7D8AA0";
function buildOrgTree(members) {
  const nodeMap = /* @__PURE__ */ new Map();
  for (const m of members) nodeMap.set(m.id, { ...m, directReports: [] });
  const roots = [];
  for (const [, node] of nodeMap) {
    if (!node.reportingToId || !nodeMap.has(node.reportingToId)) {
      roots.push(node);
    } else {
      nodeMap.get(node.reportingToId).directReports.push(node);
    }
  }
  return roots;
}
function avatarColor(type) {
  if (type === "PrimaryAdmin") return ORANGE$1;
  if (type === "SecondaryAdmin") return "#2C5282";
  return "#2D3748";
}
function userTypeBadgeStyle(type) {
  if (type === "PrimaryAdmin")
    return {
      background: "rgba(255,107,43,0.18)",
      color: ORANGE$1,
      border: "1px solid rgba(255,107,43,0.35)"
    };
  if (type === "SecondaryAdmin")
    return {
      background: "rgba(99,179,237,0.15)",
      color: "#63B3ED",
      border: "1px solid rgba(99,179,237,0.3)"
    };
  return {
    background: "rgba(148,163,184,0.12)",
    color: "#94A3B8",
    border: "1px solid rgba(148,163,184,0.25)"
  };
}
function userTypeDisplayLabel(type) {
  if (type === "PrimaryAdmin") return "Primary Admin";
  if (type === "SecondaryAdmin") return "Secondary Admin";
  return "End User";
}
function ProfilePopover({
  member,
  onClose,
  allMembers
}) {
  const manager = allMembers.find((m) => m.id === member.reportingToId);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      onClick: (e) => {
        if (e.target === e.currentTarget) onClose();
      },
      onKeyDown: (e) => {
        if (e.key === "Escape") onClose();
      },
      role: "presentation",
      style: { background: "rgba(0,0,0,0.7)" },
      "data-ocid": "profile.org_node.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-2xl p-5 w-full max-w-sm shadow-2xl",
          style: { background: "#0e1e35", border: `1px solid ${BORDER$1}` },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ring-2 ring-offset-2",
                    style: { background: avatarColor(member.userType) },
                    children: member.profilePhotoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: member.profilePhotoUrl,
                        alt: member.fullName,
                        className: "w-full h-full rounded-xl object-cover"
                      }
                    ) : getInitials(member.fullName)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-foreground", children: member.fullName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      style: userTypeBadgeStyle(member.userType),
                      className: "text-[10px] mt-1",
                      children: userTypeDisplayLabel(member.userType)
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "rounded-lg p-1 hover:bg-white/10 transition-colors",
                  "aria-label": "Close",
                  "data-ocid": "profile.org_node.close_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16, style: { color: TEXT_MUTED$1 } })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: [
              { Icon: Mail, label: "Email", value: member.email },
              { Icon: MapPin, label: "Territory", value: member.territory },
              { Icon: null, label: "Job Title", value: member.jobTitle },
              { Icon: null, label: "Department", value: member.department },
              {
                Icon: null,
                label: "Reports To",
                value: (manager == null ? void 0 : manager.fullName) ?? (member.userType === "PrimaryAdmin" ? "Top Level" : "—")
              }
            ].map(
              ({ Icon, label, value }) => value ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
                Icon && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Icon,
                  {
                    size: 13,
                    style: { color: TEXT_MUTED$1, flexShrink: 0, marginTop: 2 }
                  }
                ),
                !Icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-[13px] flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "text-[10px] uppercase tracking-wider",
                      style: { color: TEXT_MUTED$1 },
                      children: label
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-foreground", children: value })
                ] })
              ] }, label) : null
            ) })
          ]
        }
      )
    }
  );
}
function OrgTreeNode({
  node,
  allMembers,
  isRoot = false
}) {
  const [expanded, setExpanded] = reactExports.useState(true);
  const [showProfile, setShowProfile] = reactExports.useState(false);
  const hasChildren = node.directReports.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
    !isRoot && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-px h-5 flex-shrink-0",
        style: { background: BORDER$1 }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: "rounded-xl px-3 py-2.5 cursor-pointer transition-all hover:border-white/20 hover:shadow-md select-none org-chart-node text-left w-full",
        style: {
          background: isRoot ? "rgba(255,107,43,0.08)" : "rgba(255,255,255,0.03)",
          border: isRoot ? "1px solid rgba(255,107,43,0.3)" : `1px solid ${BORDER$1}`,
          minWidth: "160px",
          maxWidth: "200px"
        },
        onClick: () => setShowProfile(true),
        "data-ocid": "profile.org.card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0",
                style: { background: avatarColor(node.userType) },
                children: node.profilePhotoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: node.profilePhotoUrl,
                    alt: node.fullName,
                    className: "w-full h-full rounded-full object-cover"
                  }
                ) : getInitials(node.fullName)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-foreground truncate", children: node.fullName }),
              node.jobTitle && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "text-[10px] truncate",
                  style: { color: TEXT_MUTED$1 },
                  children: node.jobTitle
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  style: userTypeBadgeStyle(node.userType),
                  className: "text-[9px] px-1 py-0 mt-0.5",
                  children: userTypeDisplayLabel(node.userType)
                }
              )
            ] })
          ] }),
          (node.department || node.territory) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap gap-1", children: [
            node.department && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[9px] px-1.5 py-0.5 rounded",
                style: {
                  background: "rgba(255,255,255,0.06)",
                  color: TEXT_MUTED$1
                },
                children: node.department
              }
            ),
            node.territory && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[9px] px-1.5 py-0.5 rounded",
                style: {
                  background: "rgba(255,255,255,0.06)",
                  color: TEXT_MUTED$1
                },
                children: node.territory
              }
            )
          ] })
        ]
      }
    ),
    hasChildren && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-3", style: { background: BORDER$1 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setExpanded((v) => !v),
          className: "w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center transition-colors hover:bg-white/20",
          style: {
            background: "rgba(255,255,255,0.08)",
            color: TEXT_MUTED$1,
            border: `1px solid ${BORDER$1}`
          },
          "aria-label": expanded ? "Collapse" : "Expand",
          "data-ocid": "profile.org.toggle",
          children: expanded ? "−" : "+"
        }
      )
    ] }),
    hasChildren && expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-3", style: { background: BORDER$1 } }),
      node.directReports.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-px",
          style: {
            background: BORDER$1,
            width: `calc(${node.directReports.length} * 200px + ${node.directReports.length - 1} * 16px)`,
            maxWidth: "90vw"
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start gap-4 mt-0", children: node.directReports.map((child) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        OrgTreeNode,
        {
          node: child,
          allMembers
        },
        child.id
      )) })
    ] }),
    showProfile && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProfilePopover,
      {
        member: node,
        onClose: () => setShowProfile(false),
        allMembers
      }
    )
  ] });
}
function OrgChartTab() {
  const { teamMembers } = useApp();
  const roots = buildOrgTree(teamMembers ?? []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "profile.orgchart_tab", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl px-4 py-3 flex items-center gap-2.5",
        style: {
          background: "rgba(255,107,43,0.06)",
          border: "1px solid rgba(255,107,43,0.2)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 14, style: { color: ORANGE$1, flexShrink: 0 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "#FFA970" }, children: "This org chart is private to your organisation. External partners cannot view this." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-xl p-6 overflow-x-auto org-chart-container",
        style: { background: BG$1, border: `1px solid ${BORDER$1}` },
        "data-ocid": "profile.org.chart",
        children: roots.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", "data-ocid": "profile.org.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: TEXT_MUTED$1 }, children: "No org chart data available." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-0 min-w-max pb-4", children: roots.map((root) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          OrgTreeNode,
          {
            node: root,
            allMembers: teamMembers ?? [],
            isRoot: true
          },
          root.id
        )) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-[10px]", style: { color: TEXT_MUTED$1 }, children: "Click any card to view full profile. Click +/− to expand or collapse a branch." })
  ] });
}
const ORANGE = "#FF6B2B";
const BG = "#0b1724";
const BORDER = "#1e3050";
const TEXT_MUTED = "#7D8AA0";
const TIMEZONE_OPTIONS = [
  "UTC",
  "Europe/London",
  "Europe/Paris",
  "Europe/Stockholm",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney"
];
function validateLinkedIn(url) {
  if (!url) return true;
  return url.includes("linkedin.com");
}
function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams({ from: "/profile/$userId" });
  const { userProfile, companyProfile, userProfileDetail } = useApp();
  const { actor } = useActor();
  const [activeTab, setActiveTab] = reactExports.useState("profile");
  const [editing, setEditing] = reactExports.useState(false);
  const [selectedProvider, setSelectedProvider] = reactExports.useState(null);
  const [showIntegrationModal, setShowIntegrationModal] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [photoUrl, setPhotoUrl] = reactExports.useState(
    (userProfileDetail == null ? void 0 : userProfileDetail.profilePhotoUrl) ?? null
  );
  const [uploadingPhoto, setUploadingPhoto] = reactExports.useState(false);
  const photoInputRef = reactExports.useRef(null);
  const [linkedInError, setLinkedInError] = reactExports.useState("");
  const detailAny = userProfileDetail;
  const companyAny = companyProfile;
  const [form, setForm] = reactExports.useState({
    jobTitle: (userProfileDetail == null ? void 0 : userProfileDetail.jobTitle) ?? "",
    roleDescription: (userProfileDetail == null ? void 0 : userProfileDetail.roleDescription) ?? "",
    region: (userProfileDetail == null ? void 0 : userProfileDetail.region) ?? "",
    timeZone: (userProfileDetail == null ? void 0 : userProfileDetail.timeZone) ?? "UTC",
    linkedInUrl: (userProfileDetail == null ? void 0 : userProfileDetail.linkedInUrl) ?? "",
    bio: (detailAny == null ? void 0 : detailAny.bio) ?? "",
    employeeNumber: (detailAny == null ? void 0 : detailAny.employeeNumber) ?? "",
    department: (detailAny == null ? void 0 : detailAny.department) ?? "",
    phone: (detailAny == null ? void 0 : detailAny.phone) ?? ""
  });
  function fillTestData() {
    setEditing(true);
    setForm({
      jobTitle: "Channel Account Manager",
      region: "EMEA",
      timeZone: "Europe/London",
      linkedInUrl: "https://www.linkedin.com/in/test-channelforge-user",
      roleDescription: "Responsible for managing key channel accounts across the EMEA region, driving partner engagement, renewals, and pipeline growth through strategic account management and operational intelligence.",
      bio: "Channel sales professional with 10+ years in enterprise software ecosystems. Specialist in Vendor-Distributor relationships, EMEA partner strategy, and digital transformation enablement.",
      employeeNumber: "EMP-04821",
      department: "Channel Sales",
      phone: "+44 7700 900123"
    });
    ue.success("Test data filled — review and save to apply.");
  }
  const isOwnProfile = !userId || userId === "me" || userId === (userProfile == null ? void 0 : userProfile.id);
  const displayName = (userProfile == null ? void 0 : userProfile.fullName) ?? "User Profile";
  const displayRole = (userProfile == null ? void 0 : userProfile.role) ?? "";
  const displayCompany = (companyProfile == null ? void 0 : companyProfile.companyName) ?? "";
  const displayDomain = (companyAny == null ? void 0 : companyAny.claimedDomain) ?? (companyAny == null ? void 0 : companyAny.domain) ?? "";
  function orgTypeLabel() {
    const role = (userProfile == null ? void 0 : userProfile.role) ?? "";
    if (role.toLowerCase().includes("vendor")) return "Vendor";
    if (role.toLowerCase().includes("distributor")) return "Distributor";
    return "Reseller";
  }
  function userTypeLabel() {
    if (userProfile == null ? void 0 : userProfile.isPrimaryAdmin) return "Primary Admin";
    const role = (userProfile == null ? void 0 : userProfile.role) ?? "";
    if (role.toLowerCase().includes("secondary") || role.toLowerCase().includes("admin"))
      return "Secondary Admin";
    return "End User";
  }
  function userTypeBadgeStyle2(type) {
    if (type === "Primary Admin")
      return {
        background: "rgba(255,107,43,0.18)",
        color: ORANGE,
        border: "1px solid rgba(255,107,43,0.35)"
      };
    if (type === "Secondary Admin")
      return {
        background: "rgba(99,179,237,0.15)",
        color: "#63B3ED",
        border: "1px solid rgba(99,179,237,0.3)"
      };
    return {
      background: "rgba(148,163,184,0.12)",
      color: "#94A3B8",
      border: "1px solid rgba(148,163,184,0.25)"
    };
  }
  async function handlePhotoUpload(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return;
    setUploadingPhoto(true);
    try {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
      if (actor) {
        await actor.updateMyProfile({
          displayName: (userProfile == null ? void 0 : userProfile.fullName) ?? "",
          jobTitle: form.jobTitle,
          roleDescription: form.roleDescription,
          region: form.region,
          timezone: form.timeZone,
          linkedInUrl: form.linkedInUrl,
          photoUrl: url,
          visibilityScope: ProfileVisibilityScope.WorkspaceOnly
        });
      }
      ue.success("Profile photo updated");
    } catch {
      ue.error("Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  }
  function handleLinkedInChange(val) {
    setForm((f) => ({ ...f, linkedInUrl: val }));
    if (val && !validateLinkedIn(val)) {
      setLinkedInError("URL must contain linkedin.com");
    } else {
      setLinkedInError("");
    }
  }
  async function handleSave() {
    if (linkedInError) {
      ue.error("Fix LinkedIn URL before saving.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    try {
      const stored = localStorage.getItem("cf_user_profile_detail");
      const existing = stored ? JSON.parse(stored) : {};
      localStorage.setItem(
        "cf_user_profile_detail",
        JSON.stringify({ ...existing, ...form })
      );
    } catch {
    }
    setSaving(false);
    setEditing(false);
    ue.success("Profile updated successfully.");
  }
  const uType = userTypeLabel();
  const oType = orgTypeLabel();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ScrollArea, { className: "h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-4xl mx-auto space-y-6", "data-ocid": "profile.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "profile.back.button",
          onClick: () => navigate({ to: "/dashboard" }),
          className: "flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-2 transition-colors hover:bg-secondary/40 -ml-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 15 }),
            " Back to Dashboard"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-2xl overflow-hidden",
          style: { background: BG, border: `1px solid ${BORDER}` },
          "data-ocid": "profile.card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "h-28 relative",
                style: {
                  background: "linear-gradient(135deg, #0d1a2e 0%, #0f2847 50%, rgba(255,107,43,0.12) 100%)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-6 translate-y-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      className: "relative w-24 h-24 rounded-2xl border-4 flex items-center justify-center text-2xl font-black text-white overflow-hidden group cursor-pointer",
                      style: { background: ORANGE, borderColor: BG },
                      onClick: () => {
                        var _a;
                        return (_a = photoInputRef.current) == null ? void 0 : _a.click();
                      },
                      "aria-label": "Change profile photo",
                      "data-ocid": "profile.photo.upload_button",
                      children: [
                        photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "img",
                          {
                            src: photoUrl,
                            alt: "Profile",
                            className: "w-full h-full object-cover"
                          }
                        ) : getInitials(displayName),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl", children: uploadingPhoto ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 20, className: "text-white" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            ref: photoInputRef,
                            type: "file",
                            accept: "image/*",
                            className: "hidden",
                            tabIndex: -1,
                            onChange: (e) => handlePhotoUpload(e.target.files),
                            "data-ocid": "profile.photo.input"
                          }
                        )
                      ]
                    }
                  ) }),
                  isOwnProfile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 right-4 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "profile.fill_test_data.button",
                        onClick: fillTestData,
                        title: "Test environment only",
                        className: "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                        style: {
                          background: "rgba(255,107,43,0.15)",
                          color: ORANGE,
                          border: "1px solid rgba(255,107,43,0.4)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { size: 12 }),
                          " Fill with Test Data"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "profile.edit.button",
                        onClick: () => setEditing((v) => !v),
                        className: "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                        style: {
                          background: "rgba(0,0,0,0.4)",
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.15)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 12 }),
                          " ",
                          editing ? "Cancel" : "Edit Profile"
                        ]
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-16 pb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground", children: displayName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { style: userTypeBadgeStyle2(uType), children: uType }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    style: {
                      background: "rgba(255,107,43,0.12)",
                      color: "#FFA970",
                      border: "1px solid rgba(255,107,43,0.25)"
                    },
                    children: oType
                  }
                ),
                form.jobTitle && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: form.jobTitle }),
                form.department && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs px-2 py-0.5 rounded-md",
                    style: {
                      background: "rgba(255,255,255,0.06)",
                      color: TEXT_MUTED
                    },
                    children: form.department
                  }
                )
              ] }),
              (form.bio || form.roleDescription) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-relaxed max-w-2xl", children: form.bio || form.roleDescription })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex items-center rounded-xl overflow-hidden",
          style: { background: BG, border: `1px solid ${BORDER}` },
          "data-ocid": "profile.tab",
          children: ["profile", "team", "orgchart"].map((tab) => {
            const labels = {
              profile: "Profile",
              team: "My Team",
              orgchart: "Org Chart"
            };
            const ocids = {
              profile: "profile.tab.profile",
              team: "profile.tab.team",
              orgchart: "profile.tab.orgchart"
            };
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": ocids[tab],
                onClick: () => setActiveTab(tab),
                className: "flex-1 py-3 text-sm font-semibold transition-colors",
                style: {
                  color: activeTab === tab ? ORANGE : TEXT_MUTED,
                  background: activeTab === tab ? "rgba(255,107,43,0.06)" : "transparent",
                  borderBottom: activeTab === tab ? `2px solid ${ORANGE}` : "2px solid transparent"
                },
                children: labels[tab]
              },
              tab
            );
          })
        }
      ),
      activeTab === "profile" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "profile.profile_tab", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl p-5 space-y-4",
              style: { background: BG, border: `1px solid ${BORDER}` },
              "data-ocid": "profile.details.panel",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wider", children: "Contact Information" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { style: { background: BORDER } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [
                  {
                    Icon: Mail,
                    label: "Email",
                    value: (userProfile == null ? void 0 : userProfile.email) ?? "—"
                  },
                  {
                    Icon: Building2,
                    label: "Company",
                    value: displayCompany || "—"
                  },
                  { Icon: Shield, label: "Role", value: displayRole || "—" },
                  {
                    Icon: MapPin,
                    label: "Region / Territory",
                    value: form.region || "—"
                  },
                  {
                    Icon: Globe,
                    label: "Time Zone",
                    value: form.timeZone || "—"
                  },
                  { Icon: Phone, label: "Phone", value: form.phone || "—" }
                ].map(({ Icon, label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Icon,
                    {
                      size: 14,
                      style: {
                        color: TEXT_MUTED,
                        flexShrink: 0,
                        marginTop: 2
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-wider mb-0.5", children: label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-foreground", children: value })
                  ] })
                ] }, label)) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl p-5 space-y-4",
                style: { background: BG, border: `1px solid ${BORDER}` },
                "data-ocid": "profile.links.panel",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wider", children: "Professional Links" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { style: { background: BORDER } }),
                  form.linkedInUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "a",
                    {
                      href: form.linkedInUrl,
                      target: "_blank",
                      rel: "noreferrer",
                      "data-ocid": "profile.linkedin.link",
                      className: "flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-2 transition-colors hover:opacity-80",
                      style: {
                        background: "rgba(10,102,194,0.15)",
                        color: "#5AABFA",
                        border: "1px solid rgba(10,102,194,0.3)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { size: 14 }),
                        " View LinkedIn Profile"
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No LinkedIn URL provided." })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl p-5 space-y-3",
                style: { background: BG, border: `1px solid ${BORDER}` },
                "data-ocid": "profile.org_info.panel",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wider", children: "Organisation" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { style: { background: BORDER } }),
                  [
                    {
                      label: "User Type",
                      value: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { style: userTypeBadgeStyle2(uType), children: uType })
                    },
                    {
                      label: "Org Type",
                      value: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          style: {
                            background: "rgba(255,107,43,0.12)",
                            color: "#FFA970",
                            border: "1px solid rgba(255,107,43,0.25)"
                          },
                          children: oType
                        }
                      )
                    },
                    { label: "Company", value: displayCompany || "—" },
                    { label: "Domain", value: displayDomain || "—" },
                    { label: "Department", value: form.department || "—" },
                    {
                      label: "Employee No.",
                      value: form.employeeNumber || "—"
                    }
                  ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center justify-between gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: label }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-right text-foreground", children: value })
                      ]
                    },
                    label
                  ))
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl p-5 space-y-4",
            style: { background: BG, border: `1px solid ${BORDER}` },
            "data-ocid": "profile.access.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wider", children: "Access & Assignments (Admin Controlled)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { style: { background: BORDER } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
                {
                  label: "Assigned Permissions",
                  items: [
                    "View Accounts",
                    "Manage Opportunities",
                    "Run Reports",
                    "MDF Workflows"
                  ]
                },
                {
                  label: "Assigned Accounts",
                  items: [
                    "Desperado",
                    "Nordic Energy Group",
                    "Apex Financial Services"
                  ]
                },
                {
                  label: "Assigned Territories",
                  items: ["EMEA", "UK & Ireland"]
                }
              ].map(({ label, items }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-wider mb-2", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs px-2 py-0.5 rounded-md",
                    style: {
                      background: "rgba(255,255,255,0.06)",
                      color: "#94A3B8",
                      border: "1px solid rgba(255,255,255,0.08)"
                    },
                    children: item
                  },
                  item
                )) })
              ] }, label)) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl p-5 space-y-4",
            style: { background: BG, border: `1px solid ${BORDER}` },
            "data-ocid": "profile.integrations.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wider", children: "Connected Integrations" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "Connect your internal calendar and email to sync meetings, callbacks, renewal reminders, and operational tasks." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { style: { background: BORDER } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
                {
                  id: "outlook",
                  name: "Microsoft Outlook / 365 Calendar",
                  Icon: Mail,
                  color: "#0078D4"
                },
                {
                  id: "gcal",
                  name: "Google Calendar",
                  Icon: Calendar,
                  color: "#4285F4"
                },
                { id: "gmail", name: "Gmail", Icon: Mail, color: "#EA4335" },
                {
                  id: "exchange",
                  name: "Exchange Server",
                  Icon: Server,
                  color: "#0078D4"
                },
                {
                  id: "enterprise-cal",
                  name: "Enterprise Calendar API",
                  Icon: Link,
                  color: ORANGE
                }
              ].map(({ id, name, Icon, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-lg p-4 flex items-center justify-between gap-3",
                  style: {
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${BORDER}`
                  },
                  "data-ocid": `profile.integration.${id}.card`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          style: { background: `${color}22` },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 14, style: { color } })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground truncate", children: name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-[10px] px-1.5 py-0.5 rounded",
                            style: {
                              background: "rgba(148,163,184,0.12)",
                              color: TEXT_MUTED
                            },
                            children: "Not Connected"
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        size: "sm",
                        "data-ocid": `profile.integration.${id}.connect_button`,
                        className: "text-xs flex-shrink-0",
                        style: { borderColor: BORDER, color: TEXT_MUTED },
                        onClick: () => {
                          setSelectedProvider(name);
                          setShowIntegrationModal(true);
                        },
                        children: "Connect"
                      }
                    )
                  ]
                },
                id
              )) })
            ]
          }
        ),
        showIntegrationModal && selectedProvider && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "bg-black/75 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center p-4",
            "data-ocid": "profile.integration.dialog",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "w-full max-w-md rounded-2xl p-6 space-y-5 relative",
                style: {
                  background: "#0d1a2e",
                  border: `1px solid ${BORDER}`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Close",
                      "data-ocid": "profile.integration.close_button",
                      onClick: () => {
                        setShowIntegrationModal(false);
                        setSelectedProvider(null);
                      },
                      className: "absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-white/10",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-bold text-foreground", children: [
                      "Connect ",
                      selectedProvider
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-2 leading-relaxed", children: "Connect your internal calendar to sync meetings, callbacks, renewal reminders, and operational tasks." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-2 leading-relaxed", children: "Connect your work email to improve activity tracking and account collaboration." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "button",
                        "data-ocid": "profile.integration.connect_button",
                        className: "w-full font-semibold",
                        style: { background: ORANGE },
                        onClick: () => {
                          ue.info(
                            "Integration coming soon. This will be available in a future release."
                          );
                          setShowIntegrationModal(false);
                          setSelectedProvider(null);
                        },
                        children: [
                          "Connect ",
                          selectedProvider
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        "data-ocid": "profile.integration.cancel_button",
                        className: "w-full",
                        style: { borderColor: BORDER, color: TEXT_MUTED },
                        onClick: () => {
                          setShowIntegrationModal(false);
                          setSelectedProvider(null);
                        },
                        children: "Cancel"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-center", children: "Your credentials are encrypted and never stored in plain text. Integration can be disconnected at any time from your profile settings." })
                ]
              }
            )
          }
        ),
        editing && isOwnProfile && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-2xl p-6 space-y-5",
            style: {
              background: BG,
              border: "1px solid rgba(255,107,43,0.25)"
            },
            "data-ocid": "profile.edit.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-foreground", children: "Edit Profile" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70 text-xs mb-1.5 block", children: "Job Title" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "profile.job_title.input",
                      value: form.jobTitle,
                      onChange: (e) => setForm((f) => ({ ...f, jobTitle: e.target.value })),
                      placeholder: "e.g. Channel Account Manager",
                      className: "crm-input w-full"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70 text-xs mb-1.5 block", children: "Department" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "profile.department.input",
                      value: form.department,
                      onChange: (e) => setForm((f) => ({ ...f, department: e.target.value })),
                      placeholder: "e.g. Channel Sales",
                      className: "crm-input w-full"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70 text-xs mb-1.5 block", children: "Region / Territory" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "profile.region.input",
                      value: form.region,
                      onChange: (e) => setForm((f) => ({ ...f, region: e.target.value })),
                      placeholder: "e.g. EMEA, APAC, Americas",
                      className: "crm-input w-full"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70 text-xs mb-1.5 block", children: "Employee Number" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "profile.employee_number.input",
                      value: form.employeeNumber,
                      onChange: (e) => setForm((f) => ({
                        ...f,
                        employeeNumber: e.target.value
                      })),
                      placeholder: "e.g. EMP-04821",
                      className: "crm-input w-full"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70 text-xs mb-1.5 block", children: "Time Zone" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      "data-ocid": "profile.timezone.select",
                      value: form.timeZone,
                      onChange: (e) => setForm((f) => ({ ...f, timeZone: e.target.value })),
                      className: "crm-input w-full rounded-md px-3 py-2 text-sm",
                      style: {
                        background: "#0b1724",
                        border: `1px solid ${BORDER}`,
                        color: "white"
                      },
                      children: TIMEZONE_OPTIONS.map((tz) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: tz, children: tz }, tz))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70 text-xs mb-1.5 block", children: "Phone (optional)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "profile.phone.input",
                      value: form.phone,
                      onChange: (e) => setForm((f) => ({ ...f, phone: e.target.value })),
                      placeholder: "e.g. +44 7700 900000",
                      className: "crm-input w-full"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70 text-xs mb-1.5 block", children: "LinkedIn URL" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "profile.linkedin_url.input",
                      value: form.linkedInUrl,
                      onChange: (e) => handleLinkedInChange(e.target.value),
                      placeholder: "https://linkedin.com/in/yourname",
                      className: "crm-input w-full"
                    }
                  ),
                  linkedInError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs mt-1 text-destructive",
                      "data-ocid": "profile.linkedin_url.field_error",
                      children: linkedInError
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-white/70 text-xs mb-1.5 block", children: [
                  "Bio / Short Description ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "(max 280 chars)" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    "data-ocid": "profile.bio.textarea",
                    value: form.bio,
                    onChange: (e) => setForm((f) => ({
                      ...f,
                      bio: e.target.value.slice(0, 280)
                    })),
                    placeholder: "Describe your role, responsibilities, territory, or specialist focus…",
                    rows: 3,
                    className: "crm-input w-full resize-none"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-right text-[10px] mt-1", children: [
                  form.bio.length,
                  "/280"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70 text-xs mb-1.5 block", children: "Role Description" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    "data-ocid": "profile.role_description.textarea",
                    value: form.roleDescription,
                    onChange: (e) => setForm((f) => ({
                      ...f,
                      roleDescription: e.target.value
                    })),
                    placeholder: "A short description of your role and responsibilities…",
                    rows: 2,
                    className: "crm-input w-full resize-none"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    "data-ocid": "profile.edit.cancel_button",
                    onClick: () => setEditing(false),
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    "data-ocid": "profile.edit.save_button",
                    onClick: handleSave,
                    disabled: saving,
                    className: "gap-1.5",
                    style: { background: ORANGE },
                    children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" }),
                      " ",
                      "Saving…"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 13 }),
                      " Save Changes"
                    ] })
                  }
                )
              ] })
            ]
          }
        )
      ] }),
      activeTab === "team" && /* @__PURE__ */ jsxRuntimeExports.jsx(MyTeamTab, {}),
      activeTab === "orgchart" && /* @__PURE__ */ jsxRuntimeExports.jsx(OrgChartTab, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        .crm-input { background: #0b1724 !important; border: 1px solid #1e3050 !important; color: white !important; font-size: 14px; }
        .crm-input::placeholder { color: #3a4a60; }
        .crm-input:focus { outline: none !important; border-color: ${ORANGE} !important; box-shadow: 0 0 0 3px rgba(255,107,43,0.12) !important; }
      ` })
  ] });
}
export {
  UserProfilePage
};
