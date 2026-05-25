import { u as useApp, s as useFilterContext, r as reactExports, j as jsxRuntimeExports, W as formatCurrency, T as TriangleAlert, af as formatDate, ap as renewalRiskColor, a8 as Plus, S as Search, ad as Input, G as RefreshCcw, p as useActor, m as Button, P as DealStatus, ab as ue } from "./index-DvFvlUBj.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { C as ClickableAccountName } from "./ClickableAccountName-DlLteLE7.js";
function daysUntil(ns) {
  const ms = Number(ns) / 1e6;
  return Math.round((ms - Date.now()) / 864e5);
}
function RenewalBadge({ days }) {
  if (days < 0)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-badge status-rejected", children: "Overdue" });
  if (days <= 30)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-badge status-rejected", children: [
      days,
      "d"
    ] });
  if (days <= 90)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-badge status-review", children: [
      days,
      "d"
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-badge status-approved", children: [
    days,
    "d"
  ] });
}
function QuickDealModal({ account, onClose, onCreated }) {
  const { actor } = useActor();
  const [form, setForm] = reactExports.useState({
    opportunityName: `${account.accountName} Renewal`,
    product: account.productList[0] ?? "",
    estimatedValue: String(account.estimatedRenewalValue || ""),
    closeDate: account.renewalDate ? new Date(Number(account.renewalDate) / 1e6).toISOString().split("T")[0] : "",
    resellerId: account.resellerOwnerId,
    vendorOwnerId: account.vendorOwnerId,
    notes: ""
  });
  const [saving, setSaving] = reactExports.useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const input = {
        accountId: account.id,
        customerDomain: account.customerDomain,
        opportunityName: form.opportunityName,
        product: form.product,
        estimatedValue: Number.parseFloat(form.estimatedValue) || 0,
        quantity: BigInt(account.licenceQuantity || 1),
        closeDate: form.closeDate ? BigInt(new Date(form.closeDate).getTime() * 1e6) : BigInt(0),
        dealStage: "Renewal",
        competitor: "",
        notes: form.notes,
        resellerId: form.resellerId,
        vendorOwnerId: form.vendorOwnerId,
        status: DealStatus.Draft,
        submittedBy: "",
        submittedDate: void 0
      };
      const result = await actor.createDealRegistration(input);
      if (result.__kind__ === "err") {
        ue.error(result.err);
        return;
      }
      ue.success("Renewal deal created");
      onCreated();
      onClose();
    } catch {
      ue.error("Failed to create deal");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4",
      "data-ocid": "renewals.create_deal.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card w-full max-w-lg p-6 fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-bold text-foreground", children: [
            "Create Deal for ",
            account.accountName
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "renewals.create_deal.close_button",
              onClick: onClose,
              className: "p-1.5 rounded-md hover:bg-secondary/40 text-muted-foreground",
              "aria-label": "Close",
              children: "✕"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "renewal-opp-name",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Opportunity Name *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "renewal-opp-name",
                  required: true,
                  "data-ocid": "renewals.deal_name.input",
                  value: form.opportunityName,
                  onChange: (e) => setForm((f) => ({ ...f, opportunityName: e.target.value })),
                  className: "crm-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "renewal-product",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Product"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "renewal-product",
                  "data-ocid": "renewals.deal_product.input",
                  value: form.product,
                  onChange: (e) => setForm((f) => ({ ...f, product: e.target.value })),
                  className: "crm-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "renewal-value",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Est. Value (USD)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "renewal-value",
                  type: "number",
                  "data-ocid": "renewals.deal_value.input",
                  value: form.estimatedValue,
                  onChange: (e) => setForm((f) => ({ ...f, estimatedValue: e.target.value })),
                  className: "crm-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "renewal-close-date",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Close Date"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "renewal-close-date",
                  type: "date",
                  "data-ocid": "renewals.deal_close_date.input",
                  value: form.closeDate,
                  onChange: (e) => setForm((f) => ({ ...f, closeDate: e.target.value })),
                  className: "crm-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "renewal-reseller",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Reseller"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "renewal-reseller",
                  "data-ocid": "renewals.deal_reseller.input",
                  value: form.resellerId,
                  onChange: (e) => setForm((f) => ({ ...f, resellerId: e.target.value })),
                  className: "crm-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "renewal-notes",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Notes"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  id: "renewal-notes",
                  "data-ocid": "renewals.deal_notes.textarea",
                  rows: 2,
                  value: form.notes,
                  onChange: (e) => setForm((f) => ({ ...f, notes: e.target.value })),
                  className: "crm-input w-full px-3 py-2 text-sm resize-none"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                "data-ocid": "renewals.create_deal.cancel_button",
                onClick: onClose,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                "data-ocid": "renewals.create_deal.submit_button",
                disabled: saving,
                style: { background: "rgba(249,115,22,1)" },
                className: "text-white",
                children: saving ? "Creating…" : "Create Deal"
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
function Renewals() {
  const {
    accounts,
    loading,
    dealRegistrations,
    refreshDealRegistrations,
    isOrgAccessible
  } = useApp();
  useFilterContext();
  const [search, setSearch] = reactExports.useState("");
  const [partnerFilter, setPartnerFilter] = reactExports.useState("");
  const [daysBucket, setDaysBucket] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("");
  const [quickDealAccount, setQuickDealAccount] = reactExports.useState(
    null
  );
  const allRenewals = reactExports.useMemo(
    () => [...accounts].filter((a) => a.renewalDate && Number(a.renewalDate) > 0).filter((a) => {
      const dom = a.vendorDomain || a.distributorDomain || "";
      return !dom || isOrgAccessible(dom);
    }).sort((a, b) => Number(a.renewalDate - b.renewalDate)),
    [accounts, isOrgAccessible]
  );
  const highRisk = reactExports.useMemo(() => {
    const dealledAccountIds = new Set(
      dealRegistrations.map((d) => d.accountId)
    );
    return allRenewals.filter((a) => {
      const days = daysUntil(a.renewalDate);
      return days <= 90 && !dealledAccountIds.has(a.id);
    });
  }, [allRenewals, dealRegistrations]);
  const partners = reactExports.useMemo(() => {
    const ids = new Set(accounts.map((a) => a.resellerOwnerId).filter(Boolean));
    return Array.from(ids);
  }, [accounts]);
  const filtered = reactExports.useMemo(() => {
    return allRenewals.filter((a) => {
      if (search) {
        const q = search.toLowerCase();
        if (!a.accountName.toLowerCase().includes(q) && !a.customerDomain.toLowerCase().includes(q))
          return false;
      }
      if (partnerFilter && a.resellerOwnerId !== partnerFilter) return false;
      if (daysBucket) {
        const days = daysUntil(a.renewalDate);
        const bucket = Number(daysBucket);
        if (days > bucket) return false;
      }
      if (statusFilter && a.status !== statusFilter) return false;
      return true;
    });
  }, [allRenewals, search, partnerFilter, daysBucket, statusFilter]);
  const in30 = allRenewals.filter((a) => {
    const d = daysUntil(a.renewalDate);
    return d >= 0 && d <= 30;
  }).length;
  const in60 = allRenewals.filter((a) => {
    const d = daysUntil(a.renewalDate);
    return d >= 0 && d <= 60;
  }).length;
  const in90 = allRenewals.filter((a) => {
    const d = daysUntil(a.renewalDate);
    return d >= 0 && d <= 90;
  }).length;
  const totalValue = allRenewals.filter((a) => daysUntil(a.renewalDate) <= 90).reduce((sum, a) => sum + a.estimatedRenewalValue, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground font-display", children: "Renewals" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Track upcoming contract renewals and renewal risk" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
      { label: "Due in 30 days", value: in30, color: "text-orange-400" },
      { label: "Due in 60 days", value: in60, color: "text-orange-400" },
      { label: "Due in 90 days", value: in90, color: "text-yellow-400" },
      {
        label: "Value at risk (90d)",
        value: formatCurrency(totalValue),
        color: "text-foreground"
      }
    ].map((tile) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "crm-card p-4 flex flex-col gap-1",
        "data-ocid": `renewals.summary_${tile.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}.card`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-2xl font-bold font-display ${tile.color}`, children: tile.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: tile.label })
        ]
      },
      tile.label
    )) }),
    !loading && highRisk.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "crm-card border border-orange-500/25 overflow-hidden",
        "data-ocid": "renewals.high_risk.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-5 py-3 flex items-center gap-2",
              style: { background: "rgba(255,107,43,0.08)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TriangleAlert,
                  {
                    size: 15,
                    className: "text-orange-400 flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-orange-400 uppercase tracking-wide", children: [
                  "High Risk — No Active Deal Registration (",
                  highRisk.length,
                  ")"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
              "Account",
              "Domain",
              "Reseller",
              "Renewal Date",
              "Days Left",
              "Value",
              "Action"
            ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: "px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap",
                children: h
              },
              h
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: highRisk.map((a, i) => {
              const days = daysUntil(a.renewalDate);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  "data-ocid": `renewals.high_risk.item.${i + 1}`,
                  className: "border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ClickableAccountName,
                      {
                        accountName: a.accountName,
                        accountId: a.id,
                        context: "renewal",
                        className: "text-foreground font-medium"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: a.customerDomain }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: a.resellerOwnerId || "—" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: formatDate(a.renewalDate) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        className: `px-4 py-3 font-semibold ${renewalRiskColor(days)}`,
                        children: days < 0 ? "Overdue" : `${days}d`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground font-mono text-xs", children: formatCurrency(a.estimatedRenewalValue) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        "data-ocid": `renewals.high_risk.create_deal_button.${i + 1}`,
                        onClick: () => setQuickDealAccount(a),
                        className: "flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-border hover:border-accent text-muted-foreground hover:text-accent transition-colors",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 11 }),
                          " Create Deal"
                        ]
                      }
                    ) })
                  ]
                },
                a.id
              );
            }) })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-4 flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Search,
          {
            size: 13,
            className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "renewals.search_input",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search accounts…",
            className: "crm-input pl-8 text-sm"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          "data-ocid": "renewals.partner.select",
          value: partnerFilter,
          onChange: (e) => setPartnerFilter(e.target.value),
          className: "crm-input px-3 py-2 text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Resellers" }),
            partners.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p, children: p }, p))
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          "data-ocid": "renewals.days.select",
          value: daysBucket,
          onChange: (e) => setDaysBucket(e.target.value),
          className: "crm-input px-3 py-2 text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All upcoming" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "30", children: "Next 30 days" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "60", children: "Next 60 days" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "90", children: "Next 90 days" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          "data-ocid": "renewals.status.select",
          value: statusFilter,
          onChange: (e) => setStatusFilter(e.target.value),
          className: "crm-input px-3 py-2 text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All statuses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "AtRisk", children: "At Risk" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Churned", children: "Churned" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Prospect", children: "Prospect" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card overflow-hidden", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-16",
        "data-ocid": "renewals.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { size: 40, className: "text-muted-foreground mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground mb-1", children: "No renewals found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: allRenewals.length === 0 ? "Add accounts with renewal dates to start tracking." : "Adjust filters to see more results." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
        "Account",
        "Domain",
        "Reseller",
        "Renewal Date",
        "Days Left",
        "Value",
        "Status",
        "Action"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((a, i) => {
        var _a;
        const days = daysUntil(a.renewalDate);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `renewals.item.${i + 1}`,
            className: "border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold",
                    style: {
                      background: "rgba(255,107,43,0.15)",
                      color: "#FF6B2B"
                    },
                    children: (_a = a.accountName[0]) == null ? void 0 : _a.toUpperCase()
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ClickableAccountName,
                  {
                    accountName: a.accountName,
                    accountId: a.id,
                    context: "renewal",
                    className: "font-medium truncate max-w-[120px]",
                    "data-ocid": `renewals.account_link.${i + 1}`
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 text-muted-foreground", children: a.customerDomain }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 text-muted-foreground", children: a.resellerOwnerId || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 text-muted-foreground whitespace-nowrap", children: formatDate(a.renewalDate) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RenewalBadge, { days }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 text-foreground font-mono text-xs", children: formatCurrency(a.estimatedRenewalValue) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 text-muted-foreground", children: a.status }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": `renewals.create_deal_button.${i + 1}`,
                  onClick: () => setQuickDealAccount(a),
                  className: "flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-border hover:border-accent text-muted-foreground hover:text-accent transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 11 }),
                    " Deal"
                  ]
                }
              ) })
            ]
          },
          a.id
        );
      }) })
    ] }) }) }),
    quickDealAccount && /* @__PURE__ */ jsxRuntimeExports.jsx(
      QuickDealModal,
      {
        account: quickDealAccount,
        onClose: () => setQuickDealAccount(null),
        onCreated: refreshDealRegistrations
      }
    )
  ] });
}
export {
  Renewals
};
