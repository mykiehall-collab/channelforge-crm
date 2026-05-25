import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ChevronUp,
  Newspaper,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import type { NewsItem, NewsItemInput, NewsVisibility } from "../backend";
import { useActor } from "../hooks/useActor";
import { formatDate, timeAgo } from "../utils/channelforge";

// ─── Visibility helpers ───────────────────────────────────────────────────────

function visibilityLabel(v: NewsVisibility): string {
  if (v.__kind__ === "AllResellers") return "All Resellers";
  if (v.__kind__ === "VendorOnly") return "Vendor Only";
  if (v.__kind__ === "SpecificResellers")
    return `Specific Resellers (${v.SpecificResellers.length})`;
  if (v.__kind__ === "SpecificRegions")
    return `Specific Regions (${v.SpecificRegions.length})`;
  return "All Resellers";
}

function visibilityBadgeClass(v: NewsVisibility): string {
  if (v.__kind__ === "VendorOnly")
    return "bg-accent/20 text-accent border-accent/30";
  if (v.__kind__ === "AllResellers")
    return "bg-green-500/20 text-green-300 border-green-500/30";
  return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function isoToNs(iso: string): bigint {
  return BigInt(new Date(iso).getTime()) * 1_000_000n;
}

type VisibilityKind =
  | "AllResellers"
  | "VendorOnly"
  | "SpecificResellers"
  | "SpecificRegions";

// ─── News Card ────────────────────────────────────────────────────────────────

function NewsCard({
  item,
  index,
  canEdit,
  onEdit,
  onDelete,
}: {
  item: NewsItem;
  index: number;
  canEdit: boolean;
  onEdit: (item: NewsItem) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const preview =
    item.body.length > 180 ? `${item.body.slice(0, 180)}…` : item.body;

  return (
    <article
      className="crm-card p-5 flex flex-col gap-3 hover:border-border/80 transition-colors"
      data-ocid={`news.item.${index}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-foreground font-display truncate">
            {item.title}
          </h2>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-muted-foreground">
              {timeAgo(item.publishDate)}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-xs text-muted-foreground">
              Published {formatDate(item.publishDate)}
            </span>
            {item.publishedBy && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-xs text-muted-foreground">
                  by {item.publishedBy}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`status-badge border text-xs ${visibilityBadgeClass(item.visibility)}`}
            data-ocid={`news.visibility_badge.${index}`}
          >
            {visibilityLabel(item.visibility)}
          </span>
          {canEdit && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(item)}
                data-ocid={`news.edit_button.${index}`}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(item.id)}
                data-ocid={`news.delete_button.${index}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="text-sm text-muted-foreground leading-relaxed">
        {expanded ? item.body : preview}
      </div>

      {item.body.length > 180 && (
        <button
          type="button"
          className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors w-fit"
          onClick={() => setExpanded((v) => !v)}
          data-ocid={`news.expand_button.${index}`}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" /> Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" /> Read more
            </>
          )}
        </button>
      )}
    </article>
  );
}

// ─── News Modal ───────────────────────────────────────────────────────────────

function NewsModal({
  open,
  editing,
  onClose,
  onSaved,
}: {
  open: boolean;
  editing: NewsItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { actor } = useActor();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [publishDate, setPublishDate] = useState(todayISO());
  const [visKind, setVisKind] = useState<VisibilityKind>("AllResellers");
  const [specificPartners, setSpecificPartners] = useState("");
  const [specificRegions, setSpecificRegions] = useState("");
  const [saving, setSaving] = useState(false);

  // Sync form fields when editing changes
  useMemo(() => {
    if (editing) {
      setTitle(editing.title);
      setBody(editing.body);
      setPublishDate(
        new Date(Number(editing.publishDate) / 1_000_000)
          .toISOString()
          .slice(0, 10),
      );
      setVisKind(editing.visibility.__kind__ as VisibilityKind);
      setSpecificPartners(
        editing.visibility.__kind__ === "SpecificResellers"
          ? editing.visibility.SpecificResellers.join(", ")
          : "",
      );
      setSpecificRegions(
        editing.visibility.__kind__ === "SpecificRegions"
          ? editing.visibility.SpecificRegions.join(", ")
          : "",
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

  function buildVisibility(): NewsVisibility {
    if (visKind === "AllResellers")
      return { __kind__: "AllResellers", AllResellers: null };
    if (visKind === "VendorOnly")
      return { __kind__: "VendorOnly", VendorOnly: null };
    if (visKind === "SpecificResellers")
      return {
        __kind__: "SpecificResellers",
        SpecificResellers: specificPartners
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
    return {
      __kind__: "SpecificRegions",
      SpecificRegions: specificRegions
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
  }

  async function handleSave() {
    if (!actor || !title.trim() || !body.trim()) return;
    setSaving(true);
    const input: NewsItemInput = {
      title: title.trim(),
      body: body.trim(),
      publishDate: isoToNs(publishDate),
      visibility: buildVisibility(),
    };
    try {
      if (editing) {
        const res = await actor.updateNewsItem(editing.id, input);
        if (res.__kind__ === "ok") {
          toast.success("News item updated");
          onSaved();
        } else {
          toast.error(res.err);
        }
      } else {
        const res = await actor.createNewsItem(input);
        if (res.__kind__ === "ok") {
          toast.success("News item published");
          onSaved();
        } else {
          toast.error(res.err);
        }
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-lg"
        data-ocid="news.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground font-display">
            {editing ? "Edit News Item" : "Publish News"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="News headline..."
              className="crm-input"
              data-ocid="news.title_input"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">
              Body <span className="text-destructive">*</span>
            </Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write the news content..."
              rows={5}
              className="crm-input resize-none"
              data-ocid="news.body_textarea"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">
              Publish Date
            </Label>
            <input
              type="date"
              className="crm-input h-9 px-3 text-sm"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              data-ocid="news.publish_date_input"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Visibility</Label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  "AllResellers",
                  "VendorOnly",
                  "SpecificResellers",
                  "SpecificRegions",
                ] as VisibilityKind[]
              ).map((k) => (
                <label
                  key={k}
                  className={`flex items-center gap-2 px-3 py-2 rounded border cursor-pointer transition-colors text-sm ${
                    visKind === k
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-border/80"
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={k}
                    checked={visKind === k}
                    onChange={() => setVisKind(k)}
                    className="accent-[#FF6B2B]"
                    data-ocid={`news.visibility_${k.toLowerCase()}_radio`}
                  />
                  {k === "AllResellers"
                    ? "All Resellers"
                    : k === "VendorOnly"
                      ? "Vendor Only"
                      : k === "SpecificResellers"
                        ? "Specific Resellers"
                        : "Specific Regions"}
                </label>
              ))}
            </div>

            {visKind === "SpecificResellers" && (
              <div className="mt-2">
                <Input
                  value={specificPartners}
                  onChange={(e) => setSpecificPartners(e.target.value)}
                  placeholder="partner-id-1, partner-id-2, ..."
                  className="crm-input text-sm"
                  data-ocid="news.specific_partners_input"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Comma-separated partner IDs
                </p>
              </div>
            )}

            {visKind === "SpecificRegions" && (
              <div className="mt-2">
                <Input
                  value={specificRegions}
                  onChange={(e) => setSpecificRegions(e.target.value)}
                  placeholder="EMEA, APAC, North America..."
                  className="crm-input text-sm"
                  data-ocid="news.specific_regions_input"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Comma-separated region names
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
            data-ocid="news.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || !title.trim() || !body.trim()}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            data-ocid="news.submit_button"
          >
            {saving ? "Saving..." : editing ? "Save Changes" : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm Dialog ─────────────────────────────────────────────────────

function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-sm"
        data-ocid="news.delete_dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Delete News Item?
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This action cannot be undone. The news item will be permanently
          removed.
        </p>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            data-ocid="news.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            data-ocid="news.confirm_button"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main LatestNews Page ─────────────────────────────────────────────────────

export function LatestNews() {
  const { newsItems, refreshNewsItems, isVendor, loading } = useApp();
  const { actor } = useActor();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [vendorNews, setVendorNews] = useState<NewsItem[]>([]);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [vendorFetched, setVendorFetched] = useState(false);

  const canManage = isVendor();

  // Fetch all news for vendor admins
  useMemo(() => {
    if (canManage && actor && !vendorFetched) {
      setVendorLoading(true);
      setVendorFetched(true);
      actor
        .getAllNews()
        .then((data) => setVendorNews(data))
        .catch(() => {})
        .finally(() => setVendorLoading(false));
    }
  }, [canManage, actor, vendorFetched]);

  const displayNews = useMemo(() => {
    const list = canManage ? vendorNews : newsItems;
    return [...list].sort((a, b) => Number(b.publishDate - a.publishDate));
  }, [canManage, vendorNews, newsItems]);

  function openCreate() {
    setEditingItem(null);
    setModalOpen(true);
  }

  function openEdit(item: NewsItem) {
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
        toast.success("News item deleted");
        setDeleteId(null);
        setVendorFetched(false);
        await refreshNewsItems();
      } else {
        toast.error(res.err);
      }
    } finally {
      setDeleting(false);
    }
  }

  const isLoading = loading || vendorLoading;

  return (
    <div className="flex flex-col h-full min-h-screen bg-background">
      <div
        className="px-6 py-4 border-b border-border bg-card flex items-center justify-between shrink-0"
        data-ocid="news.page"
      >
        <div className="flex items-center gap-3">
          <Newspaper className="w-5 h-5 text-accent" />
          <div>
            <h1 className="text-lg font-semibold text-foreground font-display">
              Latest News
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {canManage
                ? "All published news items"
                : "News shared with your organization"}
            </p>
          </div>
        </div>
        {canManage && (
          <Button
            type="button"
            onClick={openCreate}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            data-ocid="news.publish_button"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Publish News
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {isLoading && (
          <div className="grid gap-3" data-ocid="news.loading_state">
            {["s1", "s2", "s3", "s4"].map((k) => (
              <Skeleton key={k} className="h-28 w-full rounded-[0.5rem]" />
            ))}
          </div>
        )}

        {!isLoading && displayNews.length === 0 && (
          <div
            className="crm-card flex flex-col items-center justify-center py-20 text-center"
            data-ocid="news.empty_state"
          >
            <Newspaper className="w-10 h-10 text-muted-foreground mb-4 opacity-40" />
            <p className="text-muted-foreground text-sm">
              {canManage
                ? 'No news published yet. Click "Publish News" to add the first item.'
                : "No news available for your organization yet."}
            </p>
          </div>
        )}

        {!isLoading && displayNews.length > 0 && (
          <div className="grid gap-3 max-w-3xl">
            {displayNews.map((item, i) => (
              <NewsCard
                key={item.id}
                item={item}
                index={i + 1}
                canEdit={canManage}
                onEdit={openEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}
      </div>

      <NewsModal
        open={modalOpen}
        editing={editingItem}
        onClose={() => setModalOpen(false)}
        onSaved={handleModalSaved}
      />

      <DeleteConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
