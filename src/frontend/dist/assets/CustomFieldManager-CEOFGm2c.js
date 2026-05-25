import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, H as Shield, ac as ChevronUp, k as ChevronDown, T as TriangleAlert, aF as Label, m as Button, a6 as RefreshCw, ab as ue, p as useActor, aY as useQueryClient, aZ as useQuery, S as Search, ad as Input, a8 as Plus, ah as CustomFieldObjectType, aI as RotateCcw, a_ as CustomFieldType, L as Lock, a$ as CustomFieldVisibilityScope, X, b0 as CustomFieldValidationRuleType, aC as Trash2, b1 as CustomFieldPermission } from "./index-DvFvlUBj.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-CJsIFtIC.js";
import { S as Share2 } from "./share-2-BFP_6Fru.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { S as Switch } from "./switch-7D4xT4MC.js";
import { T as Textarea } from "./textarea-BHUaDciu.js";
import { u as useMutation } from "./useMutation-D0Tr8pyU.js";
import { A as Archive } from "./archive-R3lqk_IO.js";
import { P as Pencil } from "./pencil-CSymqQ5s.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
];
const Crown = createLucideIcon("crown", __iconNode$2);
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
      d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",
      key: "e79jfc"
    }
  ],
  ["circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor", key: "1okk4w" }],
  ["circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor", key: "f64h9f" }],
  ["circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor", key: "qy21gx" }],
  ["circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor", key: "fotxhn" }]
];
const Palette = createLucideIcon("palette", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "4", x2: "4", y1: "21", y2: "14", key: "1p332r" }],
  ["line", { x1: "4", x2: "4", y1: "10", y2: "3", key: "gb41h5" }],
  ["line", { x1: "12", x2: "12", y1: "21", y2: "12", key: "hf2csr" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "3", key: "1kfi7u" }],
  ["line", { x1: "20", x2: "20", y1: "21", y2: "16", key: "1lhrwl" }],
  ["line", { x1: "20", x2: "20", y1: "12", y2: "3", key: "16vvfq" }],
  ["line", { x1: "2", x2: "6", y1: "14", y2: "14", key: "1uebub" }],
  ["line", { x1: "10", x2: "14", y1: "8", y2: "8", key: "1yglbp" }],
  ["line", { x1: "18", x2: "22", y1: "16", y2: "16", key: "1jxqpz" }]
];
const SlidersVertical = createLucideIcon("sliders-vertical", __iconNode);
const DEPARTMENTS = [
  "Sales",
  "Marketing",
  "IT",
  "BDR",
  "Sales Management",
  "Sales Operations",
  "Deal Desk",
  "Order Management",
  "Leadership",
  "Finance",
  "Admin"
];
function defaultState(users) {
  return Object.fromEntries(
    users.map((u) => [
      u.id,
      {
        department: "",
        sharing: {
          shareInternal: false,
          shareExternal: false,
          shareWithVendor: false,
          shareWithDistributor: false,
          shareWithReseller: false
        }
      }
    ])
  );
}
function DepartmentAllocation({
  users,
  isPrimaryAdmin,
  orgType,
  onDeptChange
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const [deptMap, setDeptMap] = reactExports.useState(
    () => defaultState(users)
  );
  const [reassignOpen, setReassignOpen] = reactExports.useState(false);
  const [reassignTarget, setReassignTarget] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  function setDept(userId, dept) {
    setDeptMap((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], department: dept }
    }));
    onDeptChange == null ? void 0 : onDeptChange(userId, dept);
  }
  function toggleSharing(userId, key, value) {
    setDeptMap((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        sharing: { ...prev[userId].sharing, [key]: value }
      }
    }));
  }
  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      ue.success("Department allocations saved");
    }, 700);
  }
  function handleReassign() {
    var _a;
    if (!reassignTarget) return;
    ue.success(
      `Primary Admin ownership reassigned to ${((_a = users.find((u) => u.id === reassignTarget)) == null ? void 0 : _a.name) ?? reassignTarget}`
    );
    setReassignOpen(false);
    setReassignTarget("");
  }
  const nonPrimary = users.filter((u) => !u.isPrimary);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "crm-card overflow-hidden",
      "data-ocid": "dept_allocation.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setExpanded((v) => !v),
            className: "w-full flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/20 hover:bg-secondary/30 transition-colors text-left",
            "data-ocid": "dept_allocation.toggle",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-accent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground uppercase tracking-wide", children: "Department & Reporting Permissions" })
              ] }),
              expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground" })
            ]
          }
        ),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5 p-4", children: [
          !isPrimaryAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start gap-2.5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2.5 text-xs text-yellow-300",
              "data-ocid": "dept_allocation.secondary_admin_banner",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5 flex-shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Secondary Admins can only manage departments and sharing rights if granted permission by the Primary Admin (canManageDepartments)." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: users.map((u, idx) => {
            const state = deptMap[u.id] ?? {
              department: "",
              sharing: {
                shareInternal: false,
                shareExternal: false,
                shareWithVendor: false,
                shareWithDistributor: false,
                shareWithReseller: false
              }
            };
            const canEdit = isPrimaryAdmin;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "crm-card p-3 flex flex-col gap-3",
                "data-ocid": `dept_allocation.user.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent flex-shrink-0", children: u.name.split(" ").map((n) => n[0]).join("") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground truncate", children: u.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground truncate", children: u.email })
                    ] }),
                    u.isPrimary && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/15 text-accent border border-accent/25",
                        "data-ocid": `dept_allocation.primary_badge.${idx + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-2.5 h-2.5" }),
                          "Primary Admin"
                        ]
                      }
                    ),
                    !u.isPrimary && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px] text-muted-foreground", children: u.role })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground uppercase tracking-wide w-20 flex-shrink-0", children: "Department" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "select",
                      {
                        value: state.department,
                        onChange: (e) => setDept(u.id, e.target.value),
                        disabled: !canEdit,
                        className: "flex-1 min-w-[160px] text-xs bg-input border border-border rounded-[0.5rem] px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50 disabled:cursor-not-allowed",
                        "data-ocid": `dept_allocation.dept_select.${idx + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select department —" }),
                          DEPARTMENTS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: d, children: d }, d))
                        ]
                      }
                    ),
                    state.department ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "text-[10px] text-emerald-400 flex items-center gap-1",
                        "data-ocid": `dept_allocation.dept_status.${idx + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" }),
                          "Assigned"
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "—" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wide", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-3 h-3" }),
                      "Report Sharing Rights"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "label",
                        {
                          className: "flex items-center gap-2 text-xs cursor-pointer",
                          "data-ocid": `dept_allocation.share_internal.${idx + 1}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "input",
                              {
                                type: "checkbox",
                                checked: state.sharing.shareInternal,
                                onChange: (e) => toggleSharing(
                                  u.id,
                                  "shareInternal",
                                  e.target.checked
                                ),
                                disabled: !canEdit,
                                className: "w-3.5 h-3.5 rounded accent-orange-500 border-border cursor-pointer disabled:cursor-not-allowed"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Share Internally" }),
                            state.sharing.shareInternal ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400 text-[10px]", children: "✓" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-[10px]", children: "—" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "label",
                        {
                          className: "flex items-center gap-2 text-xs cursor-pointer",
                          "data-ocid": `dept_allocation.share_external.${idx + 1}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "input",
                              {
                                type: "checkbox",
                                checked: state.sharing.shareExternal,
                                onChange: (e) => toggleSharing(
                                  u.id,
                                  "shareExternal",
                                  e.target.checked
                                ),
                                disabled: !canEdit,
                                className: "w-3.5 h-3.5 rounded accent-orange-500 border-border cursor-pointer disabled:cursor-not-allowed"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Share Externally" }),
                            state.sharing.shareExternal ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400 text-[10px]", children: "✓" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-[10px]", children: "—" })
                          ]
                        }
                      ),
                      state.sharing.shareExternal && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        orgType !== "vendor" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "label",
                          {
                            className: "flex items-center gap-2 text-xs cursor-pointer",
                            "data-ocid": `dept_allocation.share_vendor.${idx + 1}`,
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "input",
                                {
                                  type: "checkbox",
                                  checked: state.sharing.shareWithVendor ?? false,
                                  onChange: (e) => toggleSharing(
                                    u.id,
                                    "shareWithVendor",
                                    e.target.checked
                                  ),
                                  disabled: !canEdit,
                                  className: "w-3.5 h-3.5 rounded accent-orange-500 border-border cursor-pointer disabled:cursor-not-allowed"
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "with Vendor" })
                            ]
                          }
                        ),
                        orgType !== "distributor" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "label",
                          {
                            className: "flex items-center gap-2 text-xs cursor-pointer",
                            "data-ocid": `dept_allocation.share_distributor.${idx + 1}`,
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "input",
                                {
                                  type: "checkbox",
                                  checked: state.sharing.shareWithDistributor ?? false,
                                  onChange: (e) => toggleSharing(
                                    u.id,
                                    "shareWithDistributor",
                                    e.target.checked
                                  ),
                                  disabled: !canEdit,
                                  className: "w-3.5 h-3.5 rounded accent-orange-500 border-border cursor-pointer disabled:cursor-not-allowed"
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "with Distributor" })
                            ]
                          }
                        ),
                        orgType !== "reseller" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "label",
                          {
                            className: "flex items-center gap-2 text-xs cursor-pointer",
                            "data-ocid": `dept_allocation.share_reseller.${idx + 1}`,
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "input",
                                {
                                  type: "checkbox",
                                  checked: state.sharing.shareWithReseller ?? false,
                                  onChange: (e) => toggleSharing(
                                    u.id,
                                    "shareWithReseller",
                                    e.target.checked
                                  ),
                                  disabled: !canEdit,
                                  className: "w-3.5 h-3.5 rounded accent-orange-500 border-border cursor-pointer disabled:cursor-not-allowed"
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "with Reseller" })
                            ]
                          }
                        )
                      ] })
                    ] })
                  ] })
                ]
              },
              u.id
            );
          }) }),
          isPrimaryAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              className: "text-xs gap-1.5",
              onClick: handleSave,
              disabled: saving,
              "data-ocid": "dept_allocation.save_button",
              children: saving ? "Saving..." : "Save Allocations"
            }
          ) }),
          isPrimaryAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col gap-3 border-t border-border pt-4",
              "data-ocid": "dept_allocation.primary_admin_controls",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-3.5 h-3.5 text-accent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground uppercase tracking-wide", children: "Primary Admin Controls" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/20 font-semibold", children: "Primary Admin Only" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-3 flex flex-col gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Reassign Admin Ownership" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Transfer Primary Admin ownership to another admin. This action is permanent and will demote your current account." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "outline",
                      className: "w-fit text-xs gap-1.5 border-border",
                      onClick: () => setReassignOpen(true),
                      "data-ocid": "dept_allocation.reassign_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
                        "Reassign Primary Admin"
                      ]
                    }
                  )
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: reassignOpen, onOpenChange: setReassignOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "bg-card border-border max-w-sm",
            "data-ocid": "dept_allocation.reassign_dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 text-accent" }),
                "Reassign Primary Admin"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-start gap-2.5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2.5 text-xs text-yellow-300",
                    "data-ocid": "dept_allocation.reassign_warning",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5 flex-shrink-0 mt-0.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Warning: transferring Primary Admin ownership will immediately demote your account to Secondary Admin. This action cannot be undone without the new Primary Admin." })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "reassign-select",
                      className: "text-xs text-muted-foreground",
                      children: "Select new Primary Admin"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      id: "reassign-select",
                      value: reassignTarget,
                      onChange: (e) => setReassignTarget(e.target.value),
                      className: "w-full text-sm bg-input border border-border rounded-[0.5rem] px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40",
                      "data-ocid": "dept_allocation.reassign_select",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Choose admin —" }),
                        nonPrimary.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: u.id, children: [
                          u.name,
                          " (",
                          u.role,
                          ")"
                        ] }, u.id))
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    onClick: () => setReassignOpen(false),
                    "data-ocid": "dept_allocation.reassign_cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "destructive",
                    disabled: !reassignTarget,
                    onClick: handleReassign,
                    "data-ocid": "dept_allocation.reassign_confirm_button",
                    children: "Confirm Reassignment"
                  }
                )
              ] })
            ]
          }
        ) })
      ]
    }
  );
}
const OBJECT_TYPE_LABELS = {
  [CustomFieldObjectType.customerAccount]: "Customer Accounts",
  [CustomFieldObjectType.dealRegistration]: "Deal Registrations",
  [CustomFieldObjectType.opportunity]: "Opportunities",
  [CustomFieldObjectType.businessPlan]: "Business Plans",
  [CustomFieldObjectType.mdfRequest]: "MDF Requests",
  [CustomFieldObjectType.promotion]: "Promotions",
  [CustomFieldObjectType.marketingActivity]: "Marketing Activities",
  [CustomFieldObjectType.userProfile]: "User Profiles",
  [CustomFieldObjectType.resellerProfile]: "Reseller Profiles",
  [CustomFieldObjectType.distributorProfile]: "Distributor Profiles"
};
const FIELD_TYPE_LABELS = {
  [CustomFieldType.text]: "Text",
  [CustomFieldType.longText]: "Long Text",
  [CustomFieldType.number_]: "Number",
  [CustomFieldType.currency]: "Currency",
  [CustomFieldType.percentage]: "Percentage",
  [CustomFieldType.dropdown]: "Dropdown / Select",
  [CustomFieldType.multiSelect]: "Multi-Select",
  [CustomFieldType.date]: "Date",
  [CustomFieldType.datetime]: "Datetime",
  [CustomFieldType.checkbox]: "Checkbox",
  [CustomFieldType.url]: "URL",
  [CustomFieldType.email]: "Email",
  [CustomFieldType.phoneNumber]: "Phone Number",
  [CustomFieldType.attachment]: "Attachment",
  [CustomFieldType.tag]: "Tag Field",
  [CustomFieldType.regionSelector]: "Region Selector",
  [CustomFieldType.userSelector]: "User Selector",
  [CustomFieldType.organizationSelector]: "Organisation Selector"
};
const VISIBILITY_LABELS = {
  [CustomFieldVisibilityScope.allOrgs]: "All Organisations",
  [CustomFieldVisibilityScope.vendorOnly]: "Vendor Only",
  [CustomFieldVisibilityScope.distributorOnly]: "Distributor Only",
  [CustomFieldVisibilityScope.resellerOnly]: "Reseller Only",
  [CustomFieldVisibilityScope.internalOnly]: "Internal Only",
  [CustomFieldVisibilityScope.roleSpecific]: "Role Specific"
};
const RULE_TYPE_LABELS = {
  [CustomFieldValidationRuleType.required]: "Required",
  [CustomFieldValidationRuleType.minLength]: "Min Length",
  [CustomFieldValidationRuleType.maxLength]: "Max Length",
  [CustomFieldValidationRuleType.minValue]: "Min Value",
  [CustomFieldValidationRuleType.maxValue]: "Max Value",
  [CustomFieldValidationRuleType.regex]: "Regex Pattern",
  [CustomFieldValidationRuleType.unique]: "Unique",
  [CustomFieldValidationRuleType.allowedValues]: "Allowed Values",
  [CustomFieldValidationRuleType.conditionalRequired]: "Conditional Required"
};
const ALL_OBJECT_TYPES = Object.values(CustomFieldObjectType);
const ALL_FIELD_TYPES = Object.values(CustomFieldType);
const ALL_VISIBILITY = Object.values(CustomFieldVisibilityScope);
const ALL_RULE_TYPES = Object.values(CustomFieldValidationRuleType);
function slugify(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 50);
}
const FIELD_META = {
  text: { icon: "Aa" },
  longText: { icon: "¶" },
  number_: { icon: "#" },
  currency: { icon: "$" },
  percentage: { icon: "%" },
  dropdown: { icon: "▾", needsOptions: true },
  multiSelect: { icon: "☑", needsOptions: true },
  date: { icon: "📅" },
  datetime: { icon: "🕐" },
  checkbox: { icon: "✓" },
  url: { icon: "🔗" },
  email: { icon: "✉" },
  phoneNumber: { icon: "📞" },
  attachment: { icon: "📎", noDefault: true },
  tag: { icon: "🏷", noDefault: true },
  regionSelector: { icon: "🌍", noDefault: true },
  userSelector: { icon: "👤", noDefault: true },
  organizationSelector: { icon: "🏢", noDefault: true }
};
function blankForm() {
  return {
    fieldLabel: "",
    fieldName: "",
    fieldDescription: "",
    fieldType: CustomFieldType.text,
    objectType: CustomFieldObjectType.customerAccount,
    isRequired: false,
    isSearchable: true,
    isReportable: true,
    isApiVisible: false,
    isExportVisible: true,
    defaultValue: "",
    allowedValues: [],
    visibilityScope: CustomFieldVisibilityScope.allOrgs,
    lockedByVendor: false,
    validationRules: []
  };
}
function formToInput(form) {
  return {
    fieldLabel: form.fieldLabel.trim(),
    fieldName: form.fieldName.trim(),
    fieldDescription: form.fieldDescription.trim(),
    fieldType: form.fieldType,
    objectType: form.objectType,
    isRequired: form.isRequired,
    isSearchable: form.isSearchable,
    isReportable: form.isReportable,
    isApiVisible: form.isApiVisible,
    isExportVisible: form.isExportVisible,
    defaultValue: form.defaultValue.trim() || void 0,
    allowedValues: form.allowedValues,
    visibilityScope: form.visibilityScope,
    validationRules: form.validationRules,
    editPermissions: [CustomFieldPermission.edit],
    viewPermissions: [CustomFieldPermission.view]
  };
}
function LockBadge({
  source,
  size = "sm"
}) {
  const label = source === "vendor" ? "Locked by Vendor" : "Locked by Distributor";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${size === "xs" ? "text-[10px]" : "text-[11px]"} font-semibold`,
      style: {
        background: "rgba(249,115,22,0.1)",
        color: "#F97316",
        border: "1px solid rgba(249,115,22,0.3)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: size === "xs" ? "w-2.5 h-2.5" : "w-3 h-3" }),
        label
      ]
    }
  );
}
function RequestUnlockModal({
  open,
  field,
  orgType,
  onClose
}) {
  const [reason, setReason] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const targetAdmin = orgType === "reseller" ? "Vendor Admin" : "Vendor Admin";
  async function handleSubmit(e) {
    e.preventDefault();
    if (!field || !reason.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    ue.success(
      `Unlock request sent to ${targetAdmin} for field "${field.fieldLabel}". Status: Pending.`
    );
    setReason("");
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: () => onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-md",
      style: { background: "#121b2a", border: "1px solid #223047" },
      "data-ocid": "custom_fields.unlock_request.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4", style: { color: "#F97316" } }),
          "Request Field Unlock"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          field && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg p-3 text-sm",
              style: {
                background: "rgba(249,115,22,0.07)",
                border: "1px solid rgba(249,115,22,0.2)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium", children: field.fieldLabel }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  "Field name: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: field.fieldName })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "This field is locked by Vendor. Your request will be sent to the Vendor Admin." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Reason for unlock request *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                required: true,
                value: reason,
                onChange: (e) => setReason(e.target.value),
                placeholder: "Explain why this field configuration needs to be changed…",
                rows: 4,
                className: "crm-input resize-none",
                "data-ocid": "custom_fields.unlock_request.reason.textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: onClose,
                "data-ocid": "custom_fields.unlock_request.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: submitting || !reason.trim(),
                style: { background: "#F97316" },
                className: "text-white",
                "data-ocid": "custom_fields.unlock_request.submit_button",
                children: submitting ? "Sending..." : "Send Request"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function AllowedValuesInput({
  values,
  onChange
}) {
  const [input, setInput] = reactExports.useState("");
  function addValue(val) {
    const trimmed = val.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
    setInput("");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: values.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        style: {
          background: "rgba(100,140,220,0.12)",
          color: "#8AABDC",
          border: "1px solid rgba(100,140,220,0.25)"
        },
        children: [
          v,
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onChange(values.filter((o) => o !== v)),
              className: "hover:text-red-400 transition-colors ml-0.5",
              "aria-label": `Remove option ${v}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-2.5 h-2.5" })
            }
          )
        ]
      },
      v
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addValue(input);
            }
          },
          placeholder: "Type option and press Enter",
          className: "crm-input text-xs h-8",
          "data-ocid": "custom_fields.allowed_values.input"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          size: "sm",
          variant: "outline",
          className: "h-8 text-xs border-border",
          onClick: () => addValue(input),
          "data-ocid": "custom_fields.allowed_values.add_button",
          children: "Add"
        }
      )
    ] })
  ] });
}
function ValidationRuleBuilder({
  rules,
  onChange
}) {
  function addRule() {
    onChange([
      ...rules,
      { ruleType: CustomFieldValidationRuleType.required, ruleValue: "" }
    ]);
  }
  function updateRule(index, patch) {
    const next = rules.map((r, i) => i === index ? { ...r, ...patch } : r);
    onChange(next);
  }
  function removeRule(index) {
    onChange(rules.filter((_, i) => i !== index));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    rules.map((rule, i) => {
      const ruleKey = `${rule.ruleType}-${i}`;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 p-2 rounded-lg",
          style: {
            background: "rgba(100,116,139,0.1)",
            border: "1px solid rgba(100,116,139,0.15)"
          },
          "data-ocid": `custom_fields.validation_rule.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                value: rule.ruleType,
                onChange: (e) => updateRule(i, {
                  ruleType: e.target.value
                }),
                className: "flex-1 rounded-md border border-input bg-background text-foreground text-xs px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent",
                children: ALL_RULE_TYPES.map((rt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: rt, children: RULE_TYPE_LABELS[rt] }, rt))
              }
            ),
            rule.ruleType !== CustomFieldValidationRuleType.required && rule.ruleType !== CustomFieldValidationRuleType.unique && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: rule.ruleValue,
                onChange: (e) => updateRule(i, { ruleValue: e.target.value }),
                placeholder: "Value",
                className: "crm-input text-xs h-8 w-28"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => removeRule(i),
                className: "text-muted-foreground hover:text-red-400 transition-colors p-1",
                "aria-label": "Remove rule",
                "data-ocid": `custom_fields.validation_rule.remove_button.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
              }
            )
          ]
        },
        ruleKey
      );
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        size: "sm",
        variant: "outline",
        className: "h-7 text-xs border-border gap-1",
        onClick: addRule,
        "data-ocid": "custom_fields.add_validation_rule_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
          " Add Rule"
        ]
      }
    )
  ] });
}
function FieldTypeSelector({
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1.5", children: ALL_FIELD_TYPES.map((ft) => {
    const meta = FIELD_META[ft];
    const active = value === ft;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onChange(ft),
        className: `flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition-all ${active ? "border-accent/60 text-accent" : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"}`,
        style: {
          background: active ? "rgba(249,115,22,0.08)" : "rgba(30,41,59,0.5)"
        },
        "data-ocid": `custom_fields.type_selector.${ft}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none", children: (meta == null ? void 0 : meta.icon) ?? "?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] leading-tight font-medium", children: FIELD_TYPE_LABELS[ft] })
        ]
      },
      ft
    );
  }) });
}
function FieldFormModal({
  open,
  editTarget,
  orgType,
  canLock,
  onClose,
  onSaved
}) {
  var _a;
  const { actor } = useActor();
  const [form, setForm] = reactExports.useState(
    editTarget ? fieldDefToForm(editTarget) : blankForm()
  );
  const [saving, setSaving] = reactExports.useState(false);
  const [section, setSection] = reactExports.useState("basic");
  function fieldDefToForm(def) {
    return {
      fieldLabel: def.fieldLabel,
      fieldName: def.fieldName,
      fieldDescription: def.fieldDescription,
      fieldType: def.fieldType,
      objectType: def.objectType,
      isRequired: def.isRequired,
      isSearchable: def.isSearchable,
      isReportable: def.isReportable,
      isApiVisible: def.isApiVisible,
      isExportVisible: def.isExportVisible,
      defaultValue: def.defaultValue ?? "",
      allowedValues: [...def.allowedValues],
      visibilityScope: def.visibilityScope,
      lockedByVendor: def.lockedByVendor,
      validationRules: [...def.validationRules]
    };
  }
  function handleLabelChange(label) {
    setForm((f) => ({
      ...f,
      fieldLabel: label,
      fieldName: editTarget ? f.fieldName : slugify(label)
    }));
  }
  const needsOptions = form.fieldType === CustomFieldType.dropdown || form.fieldType === CustomFieldType.multiSelect;
  const noDefault = (_a = FIELD_META[form.fieldType]) == null ? void 0 : _a.noDefault;
  async function handleSubmit(e) {
    e.preventDefault();
    if (!actor || !form.fieldLabel.trim() || !form.fieldName.trim()) return;
    setSaving(true);
    try {
      const input = formToInput(form);
      if (editTarget) {
        await actor.updateCustomFieldDef(editTarget.id, input);
        ue.success(`Field "${form.fieldLabel}" updated`);
      } else {
        await actor.createCustomFieldDef(input);
        ue.success(`Custom field "${form.fieldLabel}" created`);
      }
      onSaved();
      onClose();
    } catch {
      ue.error("Failed to save custom field");
    } finally {
      setSaving(false);
    }
  }
  const SECTIONS = [
    { id: "basic", label: "Field Details" },
    { id: "options", label: "Options & Defaults" },
    { id: "rules", label: "Validation Rules" },
    { id: "permissions", label: "Visibility & Permissions" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: () => onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-2xl max-h-[90vh] overflow-y-auto",
      style: { background: "#0f1923", border: "1px solid #1e3048" },
      "data-ocid": "custom_fields.form.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersVertical, { className: "w-4 h-4", style: { color: "#F97316" } }),
          editTarget ? `Edit Field: ${editTarget.fieldLabel}` : "Create Custom Field"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5 border-b border-border/50 -mx-6 px-6 pb-0 mb-4", children: SECTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setSection(s.id),
            className: `px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${section === s.id ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`,
            children: s.label
          },
          s.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
          section === "basic" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Field Label *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    required: true,
                    value: form.fieldLabel,
                    onChange: (e) => handleLabelChange(e.target.value),
                    placeholder: "e.g. Internal Risk Rating",
                    className: "crm-input",
                    "data-ocid": "custom_fields.form.field_label.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Field Name (API slug) *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    required: true,
                    value: form.fieldName,
                    onChange: (e) => setForm((f) => ({
                      ...f,
                      fieldName: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_")
                    })),
                    placeholder: "e.g. internal_risk_rating",
                    className: "crm-input font-mono text-xs",
                    "data-ocid": "custom_fields.form.field_name.input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Used in API and exports" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: form.fieldDescription,
                  onChange: (e) => setForm((f) => ({ ...f, fieldDescription: e.target.value })),
                  placeholder: "Describe what this field captures…",
                  rows: 2,
                  className: "crm-input resize-none text-sm",
                  "data-ocid": "custom_fields.form.description.textarea"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Object Type *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: form.objectType,
                  onChange: (e) => setForm((f) => ({
                    ...f,
                    objectType: e.target.value
                  })),
                  className: "w-full rounded-md border border-input bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent",
                  "data-ocid": "custom_fields.form.object_type.select",
                  children: ALL_OBJECT_TYPES.map((ot) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ot, children: OBJECT_TYPE_LABELS[ot] }, ot))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Field Type *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FieldTypeSelector,
                {
                  value: form.fieldType,
                  onChange: (ft) => setForm((f) => ({ ...f, fieldType: ft }))
                }
              )
            ] })
          ] }),
          section === "options" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            needsOptions && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Dropdown Options *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AllowedValuesInput,
                {
                  values: form.allowedValues,
                  onChange: (v) => setForm((f) => ({ ...f, allowedValues: v }))
                }
              )
            ] }),
            !noDefault && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Default Value" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.defaultValue,
                  onChange: (e) => setForm((f) => ({ ...f, defaultValue: e.target.value })),
                  placeholder: "Leave blank for no default",
                  className: "crm-input",
                  "data-ocid": "custom_fields.form.default_value.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 pt-1", children: [
              ["isRequired", "Required Field", "Field must be filled in"],
              ["isSearchable", "Searchable", "Appears in search filters"],
              [
                "isReportable",
                "Reportable",
                "Available in reports and dashboards"
              ],
              [
                "isApiVisible",
                "API Visible",
                "Exposed via API endpoints"
              ],
              [
                "isExportVisible",
                "Export Visible",
                "Included in CSV/XLSX exports"
              ]
            ].map(([key, label, desc]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: desc })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: !!form[key],
                  onCheckedChange: (v) => setForm((f) => ({ ...f, [key]: v })),
                  "data-ocid": `custom_fields.form.${key}.switch`
                }
              )
            ] }, key)) })
          ] }),
          section === "rules" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Add validation rules to control what data can be entered in this field." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ValidationRuleBuilder,
              {
                rules: form.validationRules,
                onChange: (rules) => setForm((f) => ({ ...f, validationRules: rules }))
              }
            )
          ] }),
          section === "permissions" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Visibility Scope" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: form.visibilityScope,
                  onChange: (e) => setForm((f) => ({
                    ...f,
                    visibilityScope: e.target.value
                  })),
                  className: "w-full rounded-md border border-input bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent",
                  "data-ocid": "custom_fields.form.visibility_scope.select",
                  children: ALL_VISIBILITY.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: v, children: VISIBILITY_LABELS[v] }, v))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Controls which organisational tiers can see this field." })
            ] }),
            canLock && orgType === "vendor" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between p-3 rounded-lg",
                style: {
                  background: "rgba(249,115,22,0.07)",
                  border: "1px solid rgba(249,115,22,0.2)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Lock for Downstream Orgs" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Distributors and Resellers cannot modify this field definition" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      checked: form.lockedByVendor,
                      onCheckedChange: (v) => setForm((f) => ({ ...f, lockedByVendor: v })),
                      "data-ocid": "custom_fields.form.locked_by_vendor.switch"
                    }
                  )
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "mt-6 pt-4 border-t border-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: onClose,
                "data-ocid": "custom_fields.form.cancel_button",
                children: "Cancel"
              }
            ),
            section !== "permissions" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: () => {
                  const next = section === "basic" ? "options" : section === "options" ? "rules" : "permissions";
                  setSection(next);
                },
                style: {
                  background: "rgba(100,140,220,0.2)",
                  border: "1px solid rgba(100,140,220,0.4)",
                  color: "#8AABDC"
                },
                "data-ocid": "custom_fields.form.next_button",
                children: "Next"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: saving || !form.fieldLabel.trim(),
                style: { background: "#F97316" },
                className: "text-white",
                "data-ocid": "custom_fields.form.save_button",
                children: saving ? "Saving..." : editTarget ? "Save Changes" : "Create Field"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function ArchiveConfirmModal({
  open,
  field,
  onClose,
  onConfirm
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: () => onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-sm",
      style: { background: "#121b2a", border: "1px solid #223047" },
      "data-ocid": "custom_fields.archive_confirm.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-4 h-4 text-yellow-400" }),
          "Archive Custom Field?"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Archiving",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: field == null ? void 0 : field.fieldLabel }),
          " ",
          "will hide it from all forms. Existing data will be preserved."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              onClick: onClose,
              "data-ocid": "custom_fields.archive_confirm.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              className: "bg-yellow-600 hover:bg-yellow-700 text-white",
              onClick: onConfirm,
              "data-ocid": "custom_fields.archive_confirm.confirm_button",
              children: "Archive Field"
            }
          )
        ] })
      ]
    }
  ) });
}
function CustomFieldManager({
  orgType,
  canCreate,
  canArchive,
  canLock
}) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [objectFilter, setObjectFilter] = reactExports.useState("all");
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [showArchived, setShowArchived] = reactExports.useState(false);
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [archiveTarget, setArchiveTarget] = reactExports.useState(
    null
  );
  const [unlockTarget, setUnlockTarget] = reactExports.useState(null);
  const allDefs = useQuery({
    queryKey: ["customFieldDefs", "all"],
    queryFn: async () => {
      if (!actor) return SAMPLE_FIELDS;
      const results = await Promise.all(
        ALL_OBJECT_TYPES.map((ot) => actor.listCustomFieldDefs(ot))
      );
      const seen = /* @__PURE__ */ new Set();
      const combined = [];
      for (const arr of results) {
        for (const f of arr) {
          if (!seen.has(f.id)) {
            seen.add(f.id);
            combined.push(f);
          }
        }
      }
      return combined;
    },
    enabled: true,
    staleTime: 3e4
  });
  const archiveMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("No actor");
      return actor.archiveCustomFieldDef(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customFieldDefs"] });
      ue.success("Field archived. Existing data preserved.");
    },
    onError: () => ue.error("Failed to archive field")
  });
  const filteredDefs = reactExports.useMemo(() => {
    let defs = allDefs.data ?? [];
    if (!showArchived) defs = defs.filter((d) => !d.isArchived);
    if (objectFilter !== "all")
      defs = defs.filter((d) => d.objectType === objectFilter);
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      defs = defs.filter(
        (d) => d.fieldLabel.toLowerCase().includes(q) || d.fieldName.toLowerCase().includes(q)
      );
    }
    return defs;
  }, [allDefs.data, objectFilter, searchTerm, showArchived]);
  function handleArchiveConfirm() {
    if (archiveTarget) {
      archiveMutation.mutate(archiveTarget.id);
      setArchiveTarget(null);
    }
  }
  function handleSaved() {
    queryClient.invalidateQueries({ queryKey: ["customFieldDefs"] });
  }
  const loading = allDefs.isLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-4",
      "data-ocid": "custom_fields.manager.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: searchTerm,
                  onChange: (e) => setSearchTerm(e.target.value),
                  placeholder: "Search fields…",
                  className: "crm-input pl-8 h-8 text-xs w-52",
                  "data-ocid": "custom_fields.search.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowArchived((v) => !v),
                className: `flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${showArchived ? "border-accent/60 text-accent" : "border-border text-muted-foreground hover:text-foreground"}`,
                style: {
                  background: showArchived ? "rgba(249,115,22,0.08)" : void 0
                },
                "data-ocid": "custom_fields.show_archived.toggle",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-3 h-3" }),
                  "Archived"
                ]
              }
            )
          ] }),
          canCreate && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              className: "gap-1.5 text-xs h-8",
              style: { background: "#F97316" },
              onClick: () => {
                setEditTarget(null);
                setCreateOpen(true);
              },
              "data-ocid": "custom_fields.create_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                "Create Custom Field"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex gap-0.5 overflow-x-auto scrollbar-thin border-b border-border/40 pb-0",
            "data-ocid": "custom_fields.object_filter.tabs",
            children: ["all", ...ALL_OBJECT_TYPES].map((ot) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setObjectFilter(ot),
                "data-ocid": `custom_fields.object_filter.${ot}.tab`,
                className: `px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${objectFilter === ot ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`,
                children: ot === "all" ? "All Objects" : OBJECT_TYPE_LABELS[ot]
              },
              ot
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card overflow-hidden", "data-ocid": "custom_fields.table", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "p-4 flex flex-col gap-2",
            "data-ocid": "custom_fields.loading_state",
            children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full bg-secondary/30" }, k))
          }
        ) : filteredDefs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-14 gap-3",
            "data-ocid": "custom_fields.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersVertical, { className: "w-10 h-10 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: searchTerm ? "No fields match your search" : showArchived ? "No archived fields" : "No custom fields yet" }),
              canCreate && !searchTerm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  className: "text-xs",
                  onClick: () => {
                    setEditTarget(null);
                    setCreateOpen(true);
                  },
                  "data-ocid": "custom_fields.empty_state.create_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3 mr-1" }),
                    " Create your first field"
                  ]
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto scrollbar-thin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
            "Field Name",
            "Type",
            "Object",
            "Visibility",
            "Flags",
            "Status",
            "Actions"
          ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: "text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap",
              children: h
            },
            h
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredDefs.map((field, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            FieldRow,
            {
              field,
              index: i + 1,
              orgType,
              canArchive,
              onEdit: () => {
                setEditTarget(field);
                setCreateOpen(true);
              },
              onArchive: () => setArchiveTarget(field),
              onUnarchive: () => {
                ue.info(
                  "Contact Vendor Admin to restore archived fields."
                );
              },
              onRequestUnlock: () => setUnlockTarget(field)
            },
            field.id
          )) })
        ] }) }) }),
        !loading && filteredDefs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          filteredDefs.length,
          " field",
          filteredDefs.length !== 1 ? "s" : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FieldFormModal,
          {
            open: createOpen,
            editTarget,
            orgType,
            canLock,
            onClose: () => {
              setCreateOpen(false);
              setEditTarget(null);
            },
            onSaved: handleSaved
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ArchiveConfirmModal,
          {
            open: !!archiveTarget,
            field: archiveTarget,
            onClose: () => setArchiveTarget(null),
            onConfirm: handleArchiveConfirm
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RequestUnlockModal,
          {
            open: !!unlockTarget,
            field: unlockTarget,
            orgType,
            onClose: () => setUnlockTarget(null)
          }
        )
      ]
    }
  );
}
function FieldRow({
  field,
  index,
  orgType,
  canArchive,
  onEdit,
  onArchive,
  onUnarchive,
  onRequestUnlock
}) {
  const isLocked = field.lockedByVendor && orgType !== "vendor";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: "border-b border-border/40 hover:bg-secondary/10 transition-colors",
      "data-ocid": `custom_fields.field.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 min-w-[160px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: field.fieldLabel }),
            field.isRequired && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-red-400 font-bold", children: "REQ" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground/70", children: field.fieldName }),
          isLocked && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LockBadge, { source: "vendor", size: "xs" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-[11px] font-medium px-2 py-0.5 rounded-full",
            style: {
              background: "rgba(100,140,220,0.1)",
              color: "#8AABDC",
              border: "1px solid rgba(100,140,220,0.2)"
            },
            children: FIELD_TYPE_LABELS[field.fieldType]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground whitespace-nowrap", children: OBJECT_TYPE_LABELS[field.objectType] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground whitespace-nowrap", children: VISIBILITY_LABELS[field.visibilityScope] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-wrap", children: [
          field.isSearchable && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", children: "Search" }),
          field.isReportable && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20", children: "Report" }),
          field.isApiVisible && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20", children: "API" }),
          field.isExportVisible && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20", children: "Export" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: field.isArchived ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-badge text-[11px] font-semibold bg-secondary/50 text-muted-foreground", children: "Archived" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-badge text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20", children: "Active" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5", children: isLocked ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            size: "sm",
            variant: "outline",
            className: "h-7 text-xs gap-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10",
            onClick: onRequestUnlock,
            "data-ocid": `custom_fields.request_unlock_button.${index}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3" }),
              "Request Unlock"
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "ghost",
              className: "h-7 text-xs px-2 text-muted-foreground hover:text-foreground",
              onClick: onEdit,
              "aria-label": `Edit ${field.fieldLabel}`,
              "data-ocid": `custom_fields.edit_button.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3 h-3" })
            }
          ),
          canArchive && !field.isArchived && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "ghost",
              className: "h-7 text-xs px-2 text-muted-foreground hover:text-yellow-400",
              onClick: onArchive,
              "aria-label": `Archive ${field.fieldLabel}`,
              "data-ocid": `custom_fields.archive_button.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-3 h-3" })
            }
          ),
          field.isArchived && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "ghost",
              className: "h-7 text-xs px-2 text-muted-foreground hover:text-emerald-400",
              onClick: onUnarchive,
              "aria-label": `Restore ${field.fieldLabel}`,
              "data-ocid": `custom_fields.restore_button.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3 h-3" })
            }
          )
        ] }) }) })
      ]
    }
  );
}
const SAMPLE_FIELDS = [
  {
    id: "cf-001",
    fieldLabel: "Internal Risk Rating",
    fieldName: "internal_risk_rating",
    fieldDescription: "Vendor-assigned risk level for this account",
    fieldType: CustomFieldType.dropdown,
    objectType: CustomFieldObjectType.customerAccount,
    isRequired: false,
    isSearchable: true,
    isReportable: true,
    isApiVisible: false,
    isExportVisible: true,
    isArchived: false,
    lockedByVendor: true,
    allowedValues: ["Low", "Medium", "High", "Critical"],
    validationRules: [],
    visibilityScope: CustomFieldVisibilityScope.allOrgs,
    editPermissions: [CustomFieldPermission.edit],
    viewPermissions: [CustomFieldPermission.view],
    createdAt: BigInt(Date.now()),
    updatedAt: BigInt(Date.now()),
    createdBy: "vendor-admin",
    defaultValue: "Low"
  },
  {
    id: "cf-002",
    fieldLabel: "Government Sector Priority",
    fieldName: "government_sector_priority",
    fieldDescription: "Flag accounts targeting public sector",
    fieldType: CustomFieldType.checkbox,
    objectType: CustomFieldObjectType.customerAccount,
    isRequired: false,
    isSearchable: true,
    isReportable: true,
    isApiVisible: true,
    isExportVisible: true,
    isArchived: false,
    lockedByVendor: false,
    allowedValues: [],
    validationRules: [],
    visibilityScope: CustomFieldVisibilityScope.vendorOnly,
    editPermissions: [CustomFieldPermission.edit],
    viewPermissions: [CustomFieldPermission.view],
    createdAt: BigInt(Date.now()),
    updatedAt: BigInt(Date.now()),
    createdBy: "vendor-admin",
    defaultValue: void 0
  },
  {
    id: "cf-003",
    fieldLabel: "Renewal Probability Score",
    fieldName: "renewal_probability_score",
    fieldDescription: "AI-assisted probability of renewal (0–100)",
    fieldType: CustomFieldType.percentage,
    objectType: CustomFieldObjectType.dealRegistration,
    isRequired: false,
    isSearchable: false,
    isReportable: true,
    isApiVisible: true,
    isExportVisible: true,
    isArchived: false,
    lockedByVendor: false,
    allowedValues: [],
    validationRules: [
      { ruleType: CustomFieldValidationRuleType.minValue, ruleValue: "0" },
      { ruleType: CustomFieldValidationRuleType.maxValue, ruleValue: "100" }
    ],
    visibilityScope: CustomFieldVisibilityScope.allOrgs,
    editPermissions: [CustomFieldPermission.edit],
    viewPermissions: [CustomFieldPermission.view],
    createdAt: BigInt(Date.now()),
    updatedAt: BigInt(Date.now()),
    createdBy: "vendor-admin",
    defaultValue: void 0
  },
  {
    id: "cf-004",
    fieldLabel: "Target Vertical",
    fieldName: "target_vertical",
    fieldDescription: "Industry vertical for this opportunity",
    fieldType: CustomFieldType.multiSelect,
    objectType: CustomFieldObjectType.opportunity,
    isRequired: false,
    isSearchable: true,
    isReportable: true,
    isApiVisible: false,
    isExportVisible: true,
    isArchived: false,
    lockedByVendor: false,
    allowedValues: [
      "Healthcare",
      "Finance",
      "Manufacturing",
      "Retail",
      "Education",
      "Government"
    ],
    validationRules: [],
    visibilityScope: CustomFieldVisibilityScope.allOrgs,
    editPermissions: [CustomFieldPermission.edit],
    viewPermissions: [CustomFieldPermission.view],
    createdAt: BigInt(Date.now()),
    updatedAt: BigInt(Date.now()),
    createdBy: "vendor-admin",
    defaultValue: void 0
  }
];
export {
  CustomFieldManager as C,
  DepartmentAllocation as D,
  Palette as P,
  SlidersVertical as S
};
