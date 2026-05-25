import { c as createLucideIcon, u as useApp, r as reactExports, q as UserRole, j as jsxRuntimeExports, a8 as Plus, a5 as SquareCheckBig, I as CircleAlert, aC as Trash2, X } from "./index-DvFvlUBj.js";
import { C as CalendarDays } from "./calendar-days-BhEBMHaO.js";
import { L as Link } from "./link-DSL4JQc8.js";
import { P as Pencil } from "./pencil-CSymqQ5s.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
];
const Square = createLucideIcon("square", __iconNode);
const PRIORITY_COLORS = {
  High: "text-orange-400 bg-orange-500/10 border-orange-500/25",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/25",
  Low: "text-muted-foreground bg-secondary/40 border-border"
};
const STATUS_COLORS = {
  Open: "text-blue-400 bg-blue-500/10 border-blue-500/25",
  "In Progress": "text-orange-400 bg-orange-500/10 border-orange-500/25",
  Done: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
};
const ROLE_TASK_MAP = {
  default: [
    { title: "Review revenue KPIs", priority: "High" },
    { title: "Monitor forecast health", priority: "High" },
    { title: "Check partner performance", priority: "Medium" },
    { title: "Review escalation risks", priority: "High" },
    { title: "Assess channel health score", priority: "Medium" }
  ],
  sales: [
    { title: "Follow up on renewal risks", priority: "High" },
    { title: "Progress open opportunities", priority: "High" },
    { title: "Review accounts with no recent activity", priority: "Medium" },
    { title: "Check pending deal registrations", priority: "Medium" },
    { title: "Update customer pipeline", priority: "Low" }
  ],
  marketing: [
    { title: "Review campaign tasks", priority: "Medium" },
    { title: "Upload new partner materials", priority: "Low" },
    { title: "Check MDF actions", priority: "High" },
    { title: "Review partner engagement metrics", priority: "Medium" },
    { title: "Update promotional assets", priority: "Low" }
  ],
  it: [
    { title: "Review integration issues", priority: "High" },
    { title: "Check API sync status", priority: "High" },
    { title: "Manage user access requests", priority: "Medium" },
    { title: "Monitor data import errors", priority: "Medium" },
    { title: "Review system health", priority: "Low" }
  ],
  bdr: [
    { title: "Call target accounts", priority: "High" },
    { title: "Qualify new leads", priority: "High" },
    { title: "Update contact records", priority: "Medium" },
    { title: "Book meetings for sales", priority: "Medium" },
    { title: "Log outreach activity", priority: "Low" }
  ],
  manager: [
    { title: "Review team pipeline", priority: "High" },
    { title: "Check forecast gaps", priority: "High" },
    { title: "Approve escalations", priority: "High" },
    { title: "Monitor high-risk renewals", priority: "Medium" },
    { title: "Review rep activity", priority: "Low" }
  ],
  ops: [
    { title: "Review data quality", priority: "High" },
    { title: "Manage account allocation", priority: "Medium" },
    { title: "Validate report accuracy", priority: "Medium" },
    { title: "Check dashboard updates", priority: "Low" },
    { title: "Process import exceptions", priority: "High" }
  ],
  dealdesk: [
    { title: "Review pending deal registrations", priority: "High" },
    { title: "Check pricing exceptions", priority: "High" },
    { title: "Approve or reject deal requests", priority: "High" },
    { title: "Track SLA breaches", priority: "Medium" },
    { title: "Review deal terms", priority: "Medium" }
  ],
  accountmanager: [
    { title: "Account review call: Nordic Energy Group", priority: "High" },
    { title: "Update opportunity stages for Q3 close", priority: "High" },
    {
      title: "Stakeholder map update: Apex Financial Services",
      priority: "Medium"
    },
    {
      title: "Relationship health check-in: City Infrastructure Authority",
      priority: "Medium"
    },
    { title: "ForgeAI review: Upsell signals for Q3", priority: "Low" },
    {
      title: "Prepare QBR slide deck: Horizon Manufacturing",
      priority: "Medium"
    }
  ],
  renewalspecialist: [
    { title: "Renewal intervention call: Desperado", priority: "High" },
    { title: "Pricing escalation: Nordic Energy Group", priority: "High" },
    { title: "Contract review meeting: UK Education Trust", priority: "High" },
    {
      title: "Renewal approval request: Global Pharma Holdings",
      priority: "Medium"
    },
    {
      title: "Update renewal forecast for Q3 board report",
      priority: "Medium"
    },
    { title: "Review ForgeAI churn signal alerts", priority: "Low" }
  ],
  customersuccess: [
    {
      title: "Onboarding intervention: City Infrastructure Authority",
      priority: "High"
    },
    { title: "Adoption review session: EuroRetail Group", priority: "High" },
    {
      title: "Health check call: Northern Telecom Networks",
      priority: "Medium"
    },
    {
      title: "Engagement plan: 3 accounts with declining usage",
      priority: "Medium"
    },
    {
      title: "Escalation handoff from Support: Horizon Manufacturing",
      priority: "Medium"
    },
    {
      title: "ForgeAI expansion review: Apex Financial Services",
      priority: "Low"
    }
  ],
  finance: [
    {
      title: "Credit usage reconciliation: Sales team overspend",
      priority: "High"
    },
    { title: "Q3 renewal revenue forecast review", priority: "High" },
    { title: "Monthly financial report generation", priority: "Medium" },
    {
      title: "Renewal value sign-off: 5 high-value contracts",
      priority: "Medium"
    },
    { title: "Billing anomaly investigation: Marketing dept", priority: "Low" }
  ],
  orders: [
    { title: "Review stuck orders", priority: "High" },
    { title: "Check renewal processing", priority: "High" },
    { title: "Track provisioning issues", priority: "Medium" },
    { title: "Monitor order errors", priority: "Medium" },
    { title: "Review billing exceptions", priority: "Low" }
  ]
};
function getToday() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function getThisWeek() {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() + 4);
  return d.toISOString().split("T")[0];
}
function resolveSampleKey(role) {
  const r = String(role).toLowerCase();
  if (r.includes("primaryadmin") || r.includes("director") || r.includes("leader"))
    return "default";
  if (r.includes("marketing")) return "marketing";
  if (r.includes("deal")) return "dealdesk";
  if (r.includes("order")) return "orders";
  if (r.includes("it") || r.includes("tech")) return "it";
  if (r.includes("bdr") || r.includes("business development")) return "bdr";
  if (r.includes("account manager") || r.includes("accountmanager"))
    return "accountmanager";
  if (r.includes("manager")) return "manager";
  if (r.includes("renewal")) return "renewalspecialist";
  if (r.includes("deal desk") || r.includes("dealdesk")) return "dealdesk";
  if (r.includes("customer success") || r.includes("customersuccess"))
    return "customersuccess";
  if (r.includes("finance")) return "finance";
  if (r.includes("salesop") || r.includes("operations")) return "ops";
  if (r.includes("secondary")) return "ops";
  if (r.includes("sales")) return "sales";
  return "default";
}
function buildSampleTasks(role) {
  const key = resolveSampleKey(role);
  const source = ROLE_TASK_MAP[key] ?? ROLE_TASK_MAP.default;
  const today = getToday();
  const week = getThisWeek();
  return source.map((t, i) => ({
    id: `sample-${i + 1}`,
    title: t.title,
    priority: t.priority,
    status: "Open",
    dueDate: i % 2 === 0 ? today : week
  }));
}
function getRoleLabel(role) {
  const r = String(role).toLowerCase();
  if (r.includes("primaryadmin") || r.includes("director") || r.includes("leader"))
    return "Directors / Leadership";
  if (r.includes("marketing")) return "Marketing";
  if (r.includes("deal")) return "Deal Desk";
  if (r.includes("order")) return "Order Management";
  if (r.includes("it") || r.includes("tech")) return "IT";
  if (r.includes("bdr") || r.includes("business development")) return "BDR";
  if (r.includes("account manager") || r.includes("accountmanager"))
    return "Account Manager";
  if (r.includes("manager")) return "Sales Manager";
  if (r.includes("salesop") || r.includes("operations"))
    return "Sales Operations";
  if (r.includes("secondary")) return "Sales Operations";
  if (r.includes("sales")) return "Sales";
  return "General";
}
function isOverdue(task) {
  if (task.status === "Done") return false;
  return task.dueDate < getToday();
}
function genId() {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
const EMPTY_FORM = {
  title: "",
  dueDate: getToday(),
  priority: "Medium",
  status: "Open",
  linkedAccount: "",
  notes: ""
};
function Tasks() {
  const { userProfile } = useApp();
  const [tasks, setTasks] = reactExports.useState(
    () => userProfile ? buildSampleTasks(userProfile.role) : buildSampleTasks(UserRole.VendorAdmin)
  );
  const [statusFilter, setStatusFilter] = reactExports.useState("All");
  const [priorityFilter, setPriorityFilter] = reactExports.useState("All");
  const [search, setSearch] = reactExports.useState("");
  const [showModal, setShowModal] = reactExports.useState(false);
  const [editId, setEditId] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({ ...EMPTY_FORM });
  const roleLabel = userProfile ? getRoleLabel(userProfile.role) : "General";
  const filtered = tasks.filter((t) => {
    if (statusFilter !== "All" && t.status !== statusFilter) return false;
    if (priorityFilter !== "All" && t.priority !== priorityFilter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });
  function openCreate() {
    setEditId(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  }
  function openEdit(task) {
    setEditId(task.id);
    setForm({
      title: task.title,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      linkedAccount: task.linkedAccount ?? "",
      notes: task.notes ?? ""
    });
    setShowModal(true);
  }
  function handleSave(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editId) {
      setTasks(
        (prev) => prev.map(
          (t) => t.id === editId ? {
            ...t,
            title: form.title,
            dueDate: form.dueDate,
            priority: form.priority,
            status: form.status,
            linkedAccount: form.linkedAccount || void 0,
            notes: form.notes || void 0
          } : t
        )
      );
    } else {
      setTasks((prev) => [
        {
          id: genId(),
          title: form.title,
          priority: form.priority,
          status: form.status,
          dueDate: form.dueDate,
          linkedAccount: form.linkedAccount || void 0,
          notes: form.notes || void 0
        },
        ...prev
      ]);
    }
    setShowModal(false);
  }
  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }
  function toggleStatus(task) {
    const next = task.status === "Done" ? "Open" : "Done";
    setTasks(
      (prev) => prev.map((t) => t.id === task.id ? { ...t, status: next } : t)
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground font-display", children: "Tasks" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          "Your task queue —",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: roleLabel })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: openCreate,
          "data-ocid": "tasks.create.open_modal_button",
          className: "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90",
          style: { background: "#FF6B2B" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15 }),
            " New Task"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: "Search tasks…",
          "data-ocid": "tasks.search.input",
          className: "crm-input px-3 py-2 text-sm rounded-lg w-48"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex items-center gap-1 rounded-lg p-1",
          style: {
            background: "rgba(14,27,46,0.7)",
            border: "1px solid rgba(255,255,255,0.07)"
          },
          children: ["All", "Open", "In Progress", "Done"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setStatusFilter(s),
              "data-ocid": `tasks.filter.status.${s.toLowerCase().replace(/ /g, "_")}`,
              className: `px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${statusFilter === s ? "text-white" : "text-muted-foreground hover:text-foreground"}`,
              style: statusFilter === s ? { background: "#FF6B2B" } : {},
              children: s
            },
            s
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex items-center gap-1 rounded-lg p-1",
          style: {
            background: "rgba(14,27,46,0.7)",
            border: "1px solid rgba(255,255,255,0.07)"
          },
          children: ["All", "High", "Medium", "Low"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setPriorityFilter(p),
              "data-ocid": `tasks.filter.priority.${p.toLowerCase()}`,
              className: `px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${priorityFilter === p ? "text-white" : "text-muted-foreground hover:text-foreground"}`,
              style: priorityFilter === p ? { background: "#FF6B2B" } : {},
              children: p
            },
            p
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-auto", children: [
        filtered.length,
        " task",
        filtered.length !== 1 ? "s" : ""
      ] })
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "crm-card flex flex-col items-center py-16",
        "data-ocid": "tasks.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { size: 36, className: "text-muted-foreground mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "No tasks found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 mb-4", children: tasks.length === 0 ? "Create your first task to get started." : "No tasks match your current filters." }),
          tasks.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: openCreate,
              className: "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white",
              style: { background: "#FF6B2B" },
              "data-ocid": "tasks.empty_state.create_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
                " Create Task"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: filtered.map((task, i) => {
      const overdue = isOverdue(task);
      const isDone = task.status === "Done";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `tasks.item.${i + 1}`,
          className: "flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/20 transition-colors group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => toggleStatus(task),
                "aria-label": isDone ? "Mark as open" : "Mark as done",
                "data-ocid": `tasks.checkbox.${i + 1}`,
                className: "flex-shrink-0",
                children: isDone ? /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { size: 18, style: { color: "#FF6B2B" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Square,
                  {
                    size: 18,
                    className: "text-muted-foreground hover:text-foreground transition-colors"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-sm font-medium ${isDone ? "line-through text-muted-foreground/60" : "text-foreground"}`,
                    children: task.title
                  }
                ),
                overdue && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 bg-red-500/15 text-red-400 border border-red-500/25", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 10 }),
                  " Overdue"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CalendarDays,
                  {
                    size: 11,
                    className: "text-muted-foreground"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: task.dueDate }),
                task.linkedAccount && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      size: 10,
                      className: "text-muted-foreground"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground truncate max-w-[120px]", children: task.linkedAccount })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${PRIORITY_COLORS[task.priority]}`,
                children: task.priority
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_COLORS[task.status]}`,
                children: task.status
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => openEdit(task),
                  "aria-label": "Edit task",
                  "data-ocid": `tasks.edit_button.${i + 1}`,
                  className: "p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 13 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => deleteTask(task.id),
                  "aria-label": "Delete task",
                  "data-ocid": `tasks.delete_button.${i + 1}`,
                  className: "p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                }
              )
            ] })
          ]
        },
        task.id
      );
    }) }) }),
    showModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        style: { background: "rgba(0,0,0,0.65)" },
        "data-ocid": "tasks.create.dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card w-full max-w-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: editId ? "Edit Task" : "New Task" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowModal(false),
                className: "text-muted-foreground hover:text-foreground transition-colors",
                "data-ocid": "tasks.create.close_button",
                "aria-label": "Close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "p-6 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "task-title",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Task Title *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "task-title",
                  required: true,
                  value: form.title,
                  onChange: (e) => setForm({ ...form, title: e.target.value }),
                  placeholder: "Describe the task…",
                  className: "crm-input w-full px-3 py-2 text-sm rounded-lg",
                  "data-ocid": "tasks.create.title.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "task-due",
                    className: "block text-xs text-muted-foreground mb-1",
                    children: "Due Date"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "task-due",
                    type: "date",
                    value: form.dueDate,
                    onChange: (e) => setForm({ ...form, dueDate: e.target.value }),
                    className: "crm-input w-full px-3 py-2 text-sm rounded-lg",
                    "data-ocid": "tasks.create.due_date.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "task-priority",
                    className: "block text-xs text-muted-foreground mb-1",
                    children: "Priority"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    id: "task-priority",
                    value: form.priority,
                    onChange: (e) => setForm({ ...form, priority: e.target.value }),
                    className: "crm-input w-full px-3 py-2 text-sm rounded-lg h-10",
                    "data-ocid": "tasks.create.priority.select",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "High" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Medium" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Low" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "task-status",
                    className: "block text-xs text-muted-foreground mb-1",
                    children: "Status"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    id: "task-status",
                    value: form.status,
                    onChange: (e) => setForm({ ...form, status: e.target.value }),
                    className: "crm-input w-full px-3 py-2 text-sm rounded-lg h-10",
                    "data-ocid": "tasks.create.status.select",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Open" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "In Progress" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Done" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "task-account",
                    className: "block text-xs text-muted-foreground mb-1",
                    children: "Linked Account"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "task-account",
                    value: form.linkedAccount,
                    onChange: (e) => setForm({ ...form, linkedAccount: e.target.value }),
                    placeholder: "Account name (optional)",
                    className: "crm-input w-full px-3 py-2 text-sm rounded-lg",
                    "data-ocid": "tasks.create.linked_account.input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "task-notes",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Notes"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  id: "task-notes",
                  value: form.notes,
                  onChange: (e) => setForm({ ...form, notes: e.target.value }),
                  placeholder: "Optional context…",
                  rows: 3,
                  className: "crm-input w-full px-3 py-2 text-sm rounded-lg resize-none",
                  "data-ocid": "tasks.create.notes.textarea"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowModal(false),
                  className: "px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors",
                  "data-ocid": "tasks.create.cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "submit",
                  className: "px-4 py-2 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity",
                  style: { background: "#FF6B2B" },
                  "data-ocid": "tasks.create.submit_button",
                  children: editId ? "Save Changes" : "Create Task"
                }
              )
            ] })
          ] })
        ] })
      }
    )
  ] });
}
export {
  Tasks as default
};
