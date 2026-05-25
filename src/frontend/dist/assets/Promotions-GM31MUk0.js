import { u as useApp, p as useActor, r as reactExports, aG as ExternalBlob, j as jsxRuntimeExports, m as Button, a8 as Plus, aH as Tag, aC as Trash2, o as Badge, af as formatDate, ac as ChevronUp, k as ChevronDown, V as FileText, aF as Label, ad as Input, a7 as Upload, X } from "./index-DvFvlUBj.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-CJsIFtIC.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { S as Switch } from "./switch-7D4xT4MC.js";
import { T as Textarea } from "./textarea-BHUaDciu.js";
import { P as Pen } from "./pen-CQ3Xm2Uu.js";
import { C as Calendar } from "./calendar-BzO3LGDM.js";
import { P as Paperclip } from "./paperclip-BcvCl5-v.js";
import { D as Download } from "./download-DVLbZ_Ir.js";
import "./index-D-5r5K-M.js";
import "./index-CwZfxY3Y.js";
import "./index-B1ifXNtV.js";
const EMPTY_FORM = {
  promoName: "",
  product: "",
  startDate: "",
  endDate: "",
  allPartners: true,
  partnerEligibility: "",
  description: "",
  callToAction: ""
};
function isActivePromo(endDate) {
  const ms = Number(endDate) / 1e6;
  return ms >= Date.now();
}
function dateToNs(dateStr) {
  if (!dateStr) return BigInt(0);
  return BigInt(new Date(dateStr).getTime()) * BigInt(1e6);
}
function Promotions() {
  const { promotions, loading, isVendor, refreshPromotions } = useApp();
  const { actor } = useActor();
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editId, setEditId] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [uploadedFiles, setUploadedFiles] = reactExports.useState([]);
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [expandedIds, setExpandedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [deleteConfirmId, setDeleteConfirmId] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const vendorView = isVendor();
  function openCreate() {
    setForm(EMPTY_FORM);
    setUploadedFiles([]);
    setEditId(null);
    setModalOpen(true);
  }
  function openEdit(promo) {
    setForm({
      promoName: promo.promoName,
      product: promo.product,
      startDate: new Date(Number(promo.startDate) / 1e6).toISOString().slice(0, 10),
      endDate: new Date(Number(promo.endDate) / 1e6).toISOString().slice(0, 10),
      allPartners: promo.resellerEligibility.length === 0,
      partnerEligibility: promo.resellerEligibility.join(", "),
      description: promo.description,
      callToAction: promo.callToAction
    });
    setUploadedFiles(
      promo.fileKeys.map((k) => ({
        name: k.split("/").pop() ?? k,
        key: k,
        progress: 100,
        done: true
      }))
    );
    setEditId(promo.id);
    setModalOpen(true);
  }
  const handleFileUpload = reactExports.useCallback(async (files) => {
    const arr = Array.from(files);
    for (const file of arr) {
      const placeholder = {
        name: file.name,
        key: "",
        progress: 0,
        done: false
      };
      setUploadedFiles((prev) => [...prev, placeholder]);
      const idx = await new Promise((resolve) => {
        setUploadedFiles((prev) => {
          resolve(prev.length - 1);
          return prev;
        });
      });
      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
          setUploadedFiles(
            (prev) => prev.map((f, i) => i === idx ? { ...f, progress: pct } : f)
          );
        });
        const url = blob.getDirectURL();
        setUploadedFiles(
          (prev) => prev.map(
            (f, i) => i === idx ? { ...f, key: url, progress: 100, done: true } : f
          )
        );
      } catch {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
      }
    }
  }, []);
  function removeFile(index) {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }
  async function handleSave() {
    if (!actor || !form.promoName || !form.startDate || !form.endDate) return;
    setSaving(true);
    try {
      const partners = form.allPartners ? [] : form.partnerEligibility.split(",").map((s) => s.trim()).filter(Boolean);
      const input = {
        promoName: form.promoName,
        product: form.product,
        startDate: dateToNs(form.startDate),
        endDate: dateToNs(form.endDate),
        resellerEligibility: partners,
        description: form.description,
        callToAction: form.callToAction,
        fileKeys: uploadedFiles.filter((f) => f.done).map((f) => f.key)
      };
      if (editId) {
        await actor.updatePromotion(editId, input);
      } else {
        await actor.createPromotion(input);
      }
      await refreshPromotions();
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete(id) {
    if (!actor) return;
    await actor.deletePromotion(id);
    await refreshPromotions();
    setDeleteConfirmId(null);
  }
  function toggleExpand(id) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground font-display", children: "Promotions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: vendorView ? "Manage and share promotions with your reseller partners" : "Promotions shared by your vendor partner" })
      ] }),
      vendorView && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "promotions.create_button",
          onClick: openCreate,
          className: "text-white gap-1.5",
          style: { background: "#FF6B2B" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15 }),
            " New Promotion"
          ]
        }
      )
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-lg" }, i)) }) : promotions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "crm-card flex flex-col items-center py-16",
        "data-ocid": "promotions.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 40, className: "text-muted-foreground mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground mb-1", children: "No promotions yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: vendorView ? "Upload promotions to share with your reseller partners." : "No promotions have been shared with you yet." }),
          vendorView && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "promotions.empty.create_button",
              onClick: openCreate,
              className: "text-white gap-1.5",
              style: { background: "#FF6B2B" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15 }),
                " Add Promotion"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", children: promotions.map((promo, i) => {
      const active = isActivePromo(promo.endDate);
      const expanded = expandedIds.has(promo.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `promotions.item.${i + 1}`,
          className: "crm-card p-5 flex flex-col gap-3 hover:border-accent/30 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm leading-snug", children: promo.promoName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "status-badge",
                    style: {
                      background: active ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                      color: active ? "#4ade80" : "#f87171"
                    },
                    children: active ? "Active" : "Expired"
                  }
                ),
                vendorView && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": `promotions.edit_button.${i + 1}`,
                      onClick: () => openEdit(promo),
                      className: "p-1 rounded hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors",
                      "aria-label": "Edit promotion",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 13 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": `promotions.delete_button.${i + 1}`,
                      onClick: () => setDeleteConfirmId(promo.id),
                      className: "p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors",
                      "aria-label": "Delete promotion",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
              promo.product && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-[10px] border-border text-muted-foreground",
                  children: promo.product
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-[10px] border-border",
                  style: {
                    color: "#FF6B2B",
                    borderColor: "rgba(255,107,43,0.3)"
                  },
                  children: promo.resellerEligibility.length === 0 ? "All Resellers" : `${promo.resellerEligibility.length} Reseller(s)`
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 11, className: "shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                formatDate(promo.startDate),
                " — ",
                formatDate(promo.endDate)
              ] })
            ] }),
            promo.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `text-xs text-muted-foreground leading-relaxed ${expanded ? "" : "line-clamp-2"}`,
                  children: promo.description
                }
              ),
              promo.description.length > 100 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => toggleExpand(promo.id),
                  className: "mt-0.5 text-[10px] flex items-center gap-0.5 transition-colors",
                  style: { color: "#FF6B2B" },
                  children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 11 }),
                    " Less"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 11 }),
                    " More"
                  ] })
                }
              )
            ] }),
            promo.fileKeys.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/50 pt-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { size: 10 }),
                promo.fileKeys.length,
                " Attached File",
                promo.fileKeys.length !== 1 ? "s" : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: promo.fileKeys.map((key, fi) => {
                const name = key.split("/").pop() ?? `File ${fi + 1}`;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: ExternalBlob.fromURL(key).getDirectURL(),
                    target: "_blank",
                    rel: "noreferrer",
                    className: "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FileText,
                        {
                          size: 11,
                          className: "shrink-0 group-hover:text-accent"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Download,
                        {
                          size: 10,
                          className: "ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        }
                      )
                    ]
                  },
                  key || `file-${fi}`
                );
              }) })
            ] }),
            promo.callToAction && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                className: "w-full text-white text-xs h-7",
                style: { background: "#FF6B2B" },
                children: promo.callToAction
              }
            ) })
          ]
        },
        promo.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: modalOpen, onOpenChange: setModalOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "max-w-xl max-h-[90vh] overflow-y-auto",
        style: {
          background: "#0e1b2e",
          borderColor: "rgba(255,255,255,0.08)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground font-display", children: editId ? "Edit Promotion" : "New Promotion" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Promo Name *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "promotions.modal.name_input",
                    value: form.promoName,
                    onChange: (e) => setForm((f) => ({ ...f, promoName: e.target.value })),
                    placeholder: "Spring Partner Offer",
                    className: "crm-input h-8 text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Product" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "promotions.modal.product_input",
                    value: form.product,
                    onChange: (e) => setForm((f) => ({ ...f, product: e.target.value })),
                    placeholder: "Security Suite",
                    className: "crm-input h-8 text-sm"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Start Date *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "promotions.modal.start_date_input",
                    type: "date",
                    value: form.startDate,
                    onChange: (e) => setForm((f) => ({ ...f, startDate: e.target.value })),
                    className: "crm-input h-8 text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "End Date *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "promotions.modal.end_date_input",
                    type: "date",
                    value: form.endDate,
                    onChange: (e) => setForm((f) => ({ ...f, endDate: e.target.value })),
                    className: "crm-input h-8 text-sm"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Reseller Eligibility" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "All Resellers" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      "data-ocid": "promotions.modal.all_partners_toggle",
                      checked: form.allPartners,
                      onCheckedChange: (v) => setForm((f) => ({ ...f, allPartners: v }))
                    }
                  )
                ] })
              ] }),
              !form.allPartners && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "promotions.modal.partners_input",
                  value: form.partnerEligibility,
                  onChange: (e) => setForm((f) => ({
                    ...f,
                    partnerEligibility: e.target.value
                  })),
                  placeholder: "ATEA, Softchoice, Insight (comma-separated)",
                  className: "crm-input h-8 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  "data-ocid": "promotions.modal.description_input",
                  value: form.description,
                  onChange: (e) => setForm((f) => ({ ...f, description: e.target.value })),
                  placeholder: "Describe the promotion details, eligibility criteria, and partner incentives...",
                  rows: 3,
                  className: "crm-input text-sm resize-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Call To Action" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "promotions.modal.cta_input",
                  value: form.callToAction,
                  onChange: (e) => setForm((f) => ({ ...f, callToAction: e.target.value })),
                  placeholder: "Register Deal Now",
                  className: "crm-input h-8 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Attachments" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "promotions.modal.dropzone",
                  className: `border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${isDragging ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"}`,
                  onDragOver: (e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  },
                  onDragLeave: () => setIsDragging(false),
                  onDrop: (e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFileUpload(e.dataTransfer.files);
                  },
                  onClick: () => {
                    var _a;
                    return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                  },
                  onKeyDown: (e) => {
                    var _a;
                    if (e.key === "Enter" || e.key === " ")
                      (_a = fileInputRef.current) == null ? void 0 : _a.click();
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Upload,
                      {
                        size: 20,
                        className: "mx-auto mb-2 text-muted-foreground"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "Drop files here or",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#FF6B2B" }, children: "browse" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "PDF, PPT, XLSX, DOCX, images" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        ref: fileInputRef,
                        type: "file",
                        multiple: true,
                        accept: ".pdf,.ppt,.pptx,.xls,.xlsx,.doc,.docx,.png,.jpg,.jpeg",
                        className: "hidden",
                        onChange: (e) => e.target.files && handleFileUpload(e.target.files)
                      }
                    )
                  ]
                }
              ),
              uploadedFiles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: uploadedFiles.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 p-2 rounded-md bg-secondary/20",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      FileText,
                      {
                        size: 13,
                        className: "text-muted-foreground shrink-0"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground truncate flex-1", children: f.name }),
                    !f.done && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-1 bg-border rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full rounded-full transition-all duration-300",
                        style: {
                          width: `${f.progress}%`,
                          background: "#FF6B2B"
                        }
                      }
                    ) }),
                    f.done && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-green-400", children: "✓" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => removeFile(i),
                        className: "shrink-0 text-muted-foreground hover:text-red-400 transition-colors",
                        "aria-label": "Remove file",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 })
                      }
                    )
                  ]
                },
                `${f.name}-${i}`
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  "data-ocid": "promotions.modal.cancel_button",
                  onClick: () => setModalOpen(false),
                  className: "border-border text-foreground hover:bg-secondary/40",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  "data-ocid": "promotions.modal.submit_button",
                  onClick: handleSave,
                  disabled: saving || !form.promoName || !form.startDate || !form.endDate,
                  className: "text-white",
                  style: { background: "#FF6B2B" },
                  children: saving ? "Saving..." : editId ? "Update Promotion" : "Create Promotion"
                }
              )
            ] })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!deleteConfirmId,
        onOpenChange: () => setDeleteConfirmId(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "max-w-sm",
            style: {
              background: "#0e1b2e",
              borderColor: "rgba(255,255,255,0.08)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground", children: "Delete Promotion?" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "This promotion will be permanently removed and partners will no longer see it." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 mt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    "data-ocid": "promotions.delete.cancel_button",
                    onClick: () => setDeleteConfirmId(null),
                    className: "border-border text-foreground hover:bg-secondary/40",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    "data-ocid": "promotions.delete.confirm_button",
                    onClick: () => deleteConfirmId && handleDelete(deleteConfirmId),
                    className: "bg-red-600 hover:bg-red-700 text-white",
                    children: "Delete"
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
  Promotions
};
