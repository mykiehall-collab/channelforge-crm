import { u as useApp, p as useActor, r as reactExports, j as jsxRuntimeExports, aJ as Newspaper, m as Button, a8 as Plus, an as timeAgo, af as formatDate, aC as Trash2, ac as ChevronUp, k as ChevronDown, aF as Label, ad as Input, ab as ue } from "./index-DvFvlUBj.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-CJsIFtIC.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { T as Textarea } from "./textarea-BHUaDciu.js";
import { P as Pencil } from "./pencil-CSymqQ5s.js";
import "./index-D-5r5K-M.js";
import "./index-CwZfxY3Y.js";
function visibilityLabel(v) {
  if (v.__kind__ === "AllResellers") return "All Resellers";
  if (v.__kind__ === "VendorOnly") return "Vendor Only";
  if (v.__kind__ === "SpecificResellers")
    return `Specific Resellers (${v.SpecificResellers.length})`;
  if (v.__kind__ === "SpecificRegions")
    return `Specific Regions (${v.SpecificRegions.length})`;
  return "All Resellers";
}
function visibilityBadgeClass(v) {
  if (v.__kind__ === "VendorOnly")
    return "bg-accent/20 text-accent border-accent/30";
  if (v.__kind__ === "AllResellers")
    return "bg-green-500/20 text-green-300 border-green-500/30";
  return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
}
function todayISO() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function isoToNs(iso) {
  return BigInt(new Date(iso).getTime()) * 1000000n;
}
function NewsCard({
  item,
  index,
  canEdit,
  onEdit,
  onDelete
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const preview = item.body.length > 180 ? `${item.body.slice(0, 180)}…` : item.body;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "article",
    {
      className: "crm-card p-5 flex flex-col gap-3 hover:border-border/80 transition-colors",
      "data-ocid": `news.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground font-display truncate", children: item.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: timeAgo(item.publishDate) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                "Published ",
                formatDate(item.publishDate)
              ] }),
              item.publishedBy && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "·" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  "by ",
                  item.publishedBy
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `status-badge border text-xs ${visibilityBadgeClass(item.visibility)}`,
                "data-ocid": `news.visibility_badge.${index}`,
                children: visibilityLabel(item.visibility)
              }
            ),
            canEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7 text-muted-foreground hover:text-foreground",
                  onClick: () => onEdit(item),
                  "data-ocid": `news.edit_button.${index}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7 text-muted-foreground hover:text-destructive",
                  onClick: () => onDelete(item.id),
                  "data-ocid": `news.delete_button.${index}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground leading-relaxed", children: expanded ? item.body : preview }),
        item.body.length > 180 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors w-fit",
            onClick: () => setExpanded((v) => !v),
            "data-ocid": `news.expand_button.${index}`,
            children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3.5 h-3.5" }),
              " Show less"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5" }),
              " Read more"
            ] })
          }
        )
      ]
    }
  );
}
function NewsModal({
  open,
  editing,
  onClose,
  onSaved
}) {
  const { actor } = useActor();
  const [title, setTitle] = reactExports.useState("");
  const [body, setBody] = reactExports.useState("");
  const [publishDate, setPublishDate] = reactExports.useState(todayISO());
  const [visKind, setVisKind] = reactExports.useState("AllResellers");
  const [specificPartners, setSpecificPartners] = reactExports.useState("");
  const [specificRegions, setSpecificRegions] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useMemo(() => {
    if (editing) {
      setTitle(editing.title);
      setBody(editing.body);
      setPublishDate(
        new Date(Number(editing.publishDate) / 1e6).toISOString().slice(0, 10)
      );
      setVisKind(editing.visibility.__kind__);
      setSpecificPartners(
        editing.visibility.__kind__ === "SpecificResellers" ? editing.visibility.SpecificResellers.join(", ") : ""
      );
      setSpecificRegions(
        editing.visibility.__kind__ === "SpecificRegions" ? editing.visibility.SpecificRegions.join(", ") : ""
      );
    } else {
      setTitle("");
      setBody("");
      setPublishDate(todayISO());
      setVisKind("AllResellers");
      setSpecificPartners("");
      setSpecificRegions("");
    }
  }, [editing]);
  function buildVisibility() {
    if (visKind === "AllResellers")
      return { __kind__: "AllResellers", AllResellers: null };
    if (visKind === "VendorOnly")
      return { __kind__: "VendorOnly", VendorOnly: null };
    if (visKind === "SpecificResellers")
      return {
        __kind__: "SpecificResellers",
        SpecificResellers: specificPartners.split(",").map((s) => s.trim()).filter(Boolean)
      };
    return {
      __kind__: "SpecificRegions",
      SpecificRegions: specificRegions.split(",").map((s) => s.trim()).filter(Boolean)
    };
  }
  async function handleSave() {
    if (!actor || !title.trim() || !body.trim()) return;
    setSaving(true);
    const input = {
      title: title.trim(),
      body: body.trim(),
      publishDate: isoToNs(publishDate),
      visibility: buildVisibility()
    };
    try {
      if (editing) {
        const res = await actor.updateNewsItem(editing.id, input);
        if (res.__kind__ === "ok") {
          ue.success("News item updated");
          onSaved();
        } else {
          ue.error(res.err);
        }
      } else {
        const res = await actor.createNewsItem(input);
        if (res.__kind__ === "ok") {
          ue.success("News item published");
          onSaved();
        } else {
          ue.error(res.err);
        }
      }
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-lg",
      "data-ocid": "news.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground font-display", children: editing ? "Edit News Item" : "Publish News" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
              "Title ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: title,
                onChange: (e) => setTitle(e.target.value),
                placeholder: "News headline...",
                className: "crm-input",
                "data-ocid": "news.title_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
              "Body ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: body,
                onChange: (e) => setBody(e.target.value),
                placeholder: "Write the news content...",
                rows: 5,
                className: "crm-input resize-none",
                "data-ocid": "news.body_textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Publish Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "date",
                className: "crm-input h-9 px-3 text-sm",
                value: publishDate,
                onChange: (e) => setPublishDate(e.target.value),
                "data-ocid": "news.publish_date_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Visibility" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: [
              "AllResellers",
              "VendorOnly",
              "SpecificResellers",
              "SpecificRegions"
            ].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                className: `flex items-center gap-2 px-3 py-2 rounded border cursor-pointer transition-colors text-sm ${visKind === k ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground hover:border-border/80"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "radio",
                      name: "visibility",
                      value: k,
                      checked: visKind === k,
                      onChange: () => setVisKind(k),
                      className: "accent-[#FF6B2B]",
                      "data-ocid": `news.visibility_${k.toLowerCase()}_radio`
                    }
                  ),
                  k === "AllResellers" ? "All Resellers" : k === "VendorOnly" ? "Vendor Only" : k === "SpecificResellers" ? "Specific Resellers" : "Specific Regions"
                ]
              },
              k
            )) }),
            visKind === "SpecificResellers" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: specificPartners,
                  onChange: (e) => setSpecificPartners(e.target.value),
                  placeholder: "partner-id-1, partner-id-2, ...",
                  className: "crm-input text-sm",
                  "data-ocid": "news.specific_partners_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Comma-separated partner IDs" })
            ] }),
            visKind === "SpecificRegions" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: specificRegions,
                  onChange: (e) => setSpecificRegions(e.target.value),
                  placeholder: "EMEA, APAC, North America...",
                  className: "crm-input text-sm",
                  "data-ocid": "news.specific_regions_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Comma-separated region names" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: onClose,
              disabled: saving,
              "data-ocid": "news.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: handleSave,
              disabled: saving || !title.trim() || !body.trim(),
              className: "bg-accent hover:bg-accent/90 text-accent-foreground font-semibold",
              "data-ocid": "news.submit_button",
              children: saving ? "Saving..." : editing ? "Save Changes" : "Publish"
            }
          )
        ] })
      ]
    }
  ) });
}
function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-sm",
      "data-ocid": "news.delete_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground", children: "Delete News Item?" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This action cannot be undone. The news item will be permanently removed." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: onClose,
              disabled: loading,
              "data-ocid": "news.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "destructive",
              onClick: onConfirm,
              disabled: loading,
              "data-ocid": "news.confirm_button",
              children: loading ? "Deleting..." : "Delete"
            }
          )
        ] })
      ]
    }
  ) });
}
function LatestNews() {
  const { newsItems, refreshNewsItems, isVendor, loading } = useApp();
  const { actor } = useActor();
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editingItem, setEditingItem] = reactExports.useState(null);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [deleting, setDeleting] = reactExports.useState(false);
  const [vendorNews, setVendorNews] = reactExports.useState([]);
  const [vendorLoading, setVendorLoading] = reactExports.useState(false);
  const [vendorFetched, setVendorFetched] = reactExports.useState(false);
  const canManage = isVendor();
  reactExports.useMemo(() => {
    if (canManage && actor && !vendorFetched) {
      setVendorLoading(true);
      setVendorFetched(true);
      actor.getAllNews().then((data) => setVendorNews(data)).catch(() => {
      }).finally(() => setVendorLoading(false));
    }
  }, [canManage, actor, vendorFetched]);
  const displayNews = reactExports.useMemo(() => {
    const list = canManage ? vendorNews : newsItems;
    return [...list].sort((a, b) => Number(b.publishDate - a.publishDate));
  }, [canManage, vendorNews, newsItems]);
  function openCreate() {
    setEditingItem(null);
    setModalOpen(true);
  }
  function openEdit(item) {
    setEditingItem(item);
    setModalOpen(true);
  }
  async function handleModalSaved() {
    setModalOpen(false);
    setVendorFetched(false);
    await refreshNewsItems();
  }
  async function handleDelete() {
    if (!actor || !deleteId) return;
    setDeleting(true);
    try {
      const res = await actor.deleteNewsItem(deleteId);
      if (res.__kind__ === "ok") {
        ue.success("News item deleted");
        setDeleteId(null);
        setVendorFetched(false);
        await refreshNewsItems();
      } else {
        ue.error(res.err);
      }
    } finally {
      setDeleting(false);
    }
  }
  const isLoading = loading || vendorLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "px-6 py-4 border-b border-border bg-card flex items-center justify-between shrink-0",
        "data-ocid": "news.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Newspaper, { className: "w-5 h-5 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold text-foreground font-display", children: "Latest News" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: canManage ? "All published news items" : "News shared with your organization" })
            ] })
          ] }),
          canManage && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              onClick: openCreate,
              className: "bg-accent hover:bg-accent/90 text-accent-foreground font-semibold",
              "data-ocid": "news.publish_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1.5" }),
                " Publish News"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto p-6", children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", "data-ocid": "news.loading_state", children: ["s1", "s2", "s3", "s4"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-[0.5rem]" }, k)) }),
      !isLoading && displayNews.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "crm-card flex flex-col items-center justify-center py-20 text-center",
          "data-ocid": "news.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Newspaper, { className: "w-10 h-10 text-muted-foreground mb-4 opacity-40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: canManage ? 'No news published yet. Click "Publish News" to add the first item.' : "No news available for your organization yet." })
          ]
        }
      ),
      !isLoading && displayNews.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 max-w-3xl", children: displayNews.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        NewsCard,
        {
          item,
          index: i + 1,
          canEdit: canManage,
          onEdit: openEdit,
          onDelete: (id) => setDeleteId(id)
        },
        item.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NewsModal,
      {
        open: modalOpen,
        editing: editingItem,
        onClose: () => setModalOpen(false),
        onSaved: handleModalSaved
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmDialog,
      {
        open: deleteId !== null,
        onClose: () => setDeleteId(null),
        onConfirm: handleDelete,
        loading: deleting
      }
    )
  ] });
}
export {
  LatestNews
};
