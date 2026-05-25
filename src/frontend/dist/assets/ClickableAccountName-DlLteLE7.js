import { a as useNavigate, u as useApp, r as reactExports, j as jsxRuntimeExports } from "./index-DvFvlUBj.js";
function canAccessAccount(accountId, _context) {
  return accountId.length > 0;
}
function ClickableAccountName({
  accountName,
  accountId,
  opportunityId,
  context,
  className = ""
}) {
  const navigate = useNavigate();
  useApp();
  const [showDenied, setShowDenied] = reactExports.useState(false);
  function handleClick(e) {
    e.stopPropagation();
    if (!canAccessAccount(accountId)) {
      setShowDenied(true);
      return;
    }
    if (context === "pipeline" && opportunityId) {
      navigate({ to: "/opportunities" });
    } else {
      navigate({ to: "/accounts/$id", params: { id: accountId } });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": `account_name.${context}.link`,
        onClick: handleClick,
        onKeyDown: (e) => e.key === "Enter" && handleClick(e),
        className: [
          "inline-block text-left leading-snug",
          "transition-all duration-200 cursor-pointer",
          "text-foreground hover:text-accent",
          "account-name-link",
          className
        ].join(" "),
        style: { WebkitTapHighlightColor: "transparent" },
        "aria-label": `Open ${accountName}`,
        children: accountName
      }
    ),
    showDenied && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4",
        onClick: () => setShowDenied(false),
        onKeyDown: (e) => e.key === "Escape" && setShowDenied(false),
        "data-ocid": "account_name.access_denied.dialog",
        "aria-modal": "true",
        "aria-label": "Access denied",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "crm-card w-full max-w-md p-8 flex flex-col items-center gap-5 fade-in text-center",
            onClick: (e) => e.stopPropagation(),
            onKeyDown: (e) => e.stopPropagation(),
            role: "presentation",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full flex items-center justify-center bg-orange-500/10 border border-orange-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "svg",
                {
                  width: "22",
                  height: "22",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "text-orange-400",
                  "aria-hidden": "true",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-foreground mb-2", children: "Access Restricted" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "You do not currently have access to this account or opportunity. Please request access from your administrator if required." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "account_name.access_denied.close_button",
                    onClick: () => setShowDenied(false),
                    className: "px-4 py-2 text-sm border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors",
                    children: "Dismiss"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "account_name.access_denied.request_button",
                    onClick: () => setShowDenied(false),
                    className: "px-4 py-2 text-sm rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors",
                    children: "Request Access"
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
}
export {
  ClickableAccountName as C
};
