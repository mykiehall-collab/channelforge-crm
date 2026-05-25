import { j as jsxRuntimeExports, h as cn, aH as Tag, E as ExternalLink, as as Check, X, o as Badge } from "./index-DvFvlUBj.js";
import { D as Download } from "./download-DVLbZ_Ir.js";
import { P as Phone } from "./phone-DSozTLzi.js";
import { M as Mail } from "./mail-BpQyu_iW.js";
function formatCurrency(raw) {
  const num = Number.parseFloat(raw);
  if (Number.isNaN(num)) return raw;
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}
function formatDate(raw) {
  if (!raw) return "—";
  try {
    return new Date(raw).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return raw;
  }
}
function formatDatetime(raw) {
  if (!raw) return "—";
  try {
    return new Date(raw).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return raw;
  }
}
function RiskBadge({ label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/20 text-primary border border-primary/40 text-xs", children: label });
}
function FieldValueRenderer({
  fieldType,
  value,
  allowedValues: _av,
  fileKeys
}) {
  if (!value && fieldType !== "checkbox") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground italic text-sm", children: "—" });
  }
  switch (fieldType) {
    case "text":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: value });
    case "longText":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground whitespace-pre-wrap break-words leading-relaxed", children: value });
    case "number":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono text-foreground", children: Number(value).toLocaleString() });
    case "currency":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono text-foreground", children: formatCurrency(value) });
    case "percentage":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-mono text-foreground", children: [
        value,
        "%"
      ] });
    case "dropdown":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(RiskBadge, { label: value });
    case "multiSelect": {
      const items = value.split(",").map((s) => s.trim()).filter(Boolean);
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(RiskBadge, { label: item }, item)) });
    }
    case "date":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: formatDate(value) });
    case "datetime":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: formatDatetime(value) });
    case "checkbox":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1.5 text-sm", children: value === "true" || value === "1" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Yes" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "No" })
      ] }) });
    case "url":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: value.startsWith("http") ? value : `https://${value}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "inline-flex items-center gap-1 text-sm text-primary hover:underline",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
            value
          ]
        }
      );
    case "email":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: `mailto:${value}`,
          className: "inline-flex items-center gap-1 text-sm text-primary hover:underline",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5" }),
            value
          ]
        }
      );
    case "phoneNumber":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: `tel:${value}`,
          className: "inline-flex items-center gap-1 text-sm text-primary hover:underline",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3.5 h-3.5" }),
            value
          ]
        }
      );
    case "attachment": {
      const keys = fileKeys.length > 0 ? fileKeys : value ? [value] : [];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        keys.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: key,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center gap-1.5 text-sm text-primary hover:underline",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
              key.split("/").pop() ?? key
            ]
          },
          key
        )),
        keys.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground italic text-sm", children: "No attachment" })
      ] });
    }
    case "tag": {
      const tags = value.split(",").map((s) => s.trim()).filter(Boolean);
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "inline-flex items-center gap-1 bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full border border-border",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-3 h-3" }),
            tag
          ]
        },
        tag
      )) });
    }
    case "regionSelector":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-sm text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "Region:" }),
        value
      ] });
    case "userSelector":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-sm text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "User:" }),
        value
      ] });
    case "organizationSelector":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-sm text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "Org:" }),
        value
      ] });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: value });
  }
}
function CustomFieldRenderer({
  fieldDef,
  value,
  className
}) {
  const rawValue = (value == null ? void 0 : value.value) ?? "";
  const fileKeys = (value == null ? void 0 : value.uploadedFileKeys) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex flex-col gap-0.5", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: fieldDef.fieldLabel }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FieldValueRenderer,
      {
        fieldType: fieldDef.fieldType,
        value: rawValue,
        allowedValues: fieldDef.allowedValues,
        fileKeys
      }
    )
  ] });
}
export {
  CustomFieldRenderer as C
};
