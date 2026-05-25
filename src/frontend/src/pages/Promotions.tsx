import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ExternalBlob } from "@caffeineai/object-storage";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  Edit2,
  FileText,
  Paperclip,
  Plus,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { useApp } from "../AppContext";
import type { PromotionInput } from "../backend";
import { useActor } from "../hooks/useActor";
import { formatDate } from "../utils/channelforge";

interface UploadedFile {
  name: string;
  key: string;
  progress: number;
  done: boolean;
}

interface PromoFormState {
  promoName: string;
  product: string;
  startDate: string;
  endDate: string;
  allPartners: boolean;
  partnerEligibility: string;
  description: string;
  callToAction: string;
}

const EMPTY_FORM: PromoFormState = {
  promoName: "",
  product: "",
  startDate: "",
  endDate: "",
  allPartners: true,
  partnerEligibility: "",
  description: "",
  callToAction: "",
};

function isActivePromo(endDate: bigint): boolean {
  const ms = Number(endDate) / 1_000_000;
  return ms >= Date.now();
}

function dateToNs(dateStr: string): bigint {
  if (!dateStr) return BigInt(0);
  return BigInt(new Date(dateStr).getTime()) * BigInt(1_000_000);
}

export function Promotions() {
  const { promotions, loading, isVendor, refreshPromotions } = useApp();
  const { actor } = useActor();

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<PromoFormState>(EMPTY_FORM);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const vendorView = isVendor();

  function openCreate() {
    setForm(EMPTY_FORM);
    setUploadedFiles([]);
    setEditId(null);
    setModalOpen(true);
  }

  function openEdit(promo: (typeof promotions)[number]) {
    setForm({
      promoName: promo.promoName,
      product: promo.product,
      startDate: new Date(Number(promo.startDate) / 1_000_000)
        .toISOString()
        .slice(0, 10),
      endDate: new Date(Number(promo.endDate) / 1_000_000)
        .toISOString()
        .slice(0, 10),
      allPartners: promo.resellerEligibility.length === 0,
      partnerEligibility: promo.resellerEligibility.join(", "),
      description: promo.description,
      callToAction: promo.callToAction,
    });
    setUploadedFiles(
      promo.fileKeys.map((k) => ({
        name: k.split("/").pop() ?? k,
        key: k,
        progress: 100,
        done: true,
      })),
    );
    setEditId(promo.id);
    setModalOpen(true);
  }

  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files);
    for (const file of arr) {
      const placeholder: UploadedFile = {
        name: file.name,
        key: "",
        progress: 0,
        done: false,
      };
      setUploadedFiles((prev) => [...prev, placeholder]);
      const idx = await new Promise<number>((resolve) => {
        setUploadedFiles((prev) => {
          resolve(prev.length - 1);
          return prev;
        });
      });
      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
          setUploadedFiles((prev) =>
            prev.map((f, i) => (i === idx ? { ...f, progress: pct } : f)),
          );
        });
        const url = blob.getDirectURL();
        setUploadedFiles((prev) =>
          prev.map((f, i) =>
            i === idx ? { ...f, key: url, progress: 100, done: true } : f,
          ),
        );
      } catch {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
      }
    }
  }, []);

  function removeFile(index: number) {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!actor || !form.promoName || !form.startDate || !form.endDate) return;
    setSaving(true);
    try {
      const partners = form.allPartners
        ? []
        : form.partnerEligibility
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
      const input: PromotionInput = {
        promoName: form.promoName,
        product: form.product,
        startDate: dateToNs(form.startDate),
        endDate: dateToNs(form.endDate),
        resellerEligibility: partners,
        description: form.description,
        callToAction: form.callToAction,
        fileKeys: uploadedFiles.filter((f) => f.done).map((f) => f.key),
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

  async function handleDelete(id: string) {
    if (!actor) return;
    await actor.deletePromotion(id);
    await refreshPromotions();
    setDeleteConfirmId(null);
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground font-display">
            Promotions
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {vendorView
              ? "Manage and share promotions with your reseller partners"
              : "Promotions shared by your vendor partner"}
          </p>
        </div>
        {vendorView && (
          <Button
            data-ocid="promotions.create_button"
            onClick={openCreate}
            className="text-white gap-1.5"
            style={{ background: "#FF6B2B" }}
          >
            <Plus size={15} /> New Promotion
          </Button>
        )}
      </div>

      {/* Body */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : promotions.length === 0 ? (
        <div
          className="crm-card flex flex-col items-center py-16"
          data-ocid="promotions.empty_state"
        >
          <Tag size={40} className="text-muted-foreground mb-4" />
          <p className="text-base font-semibold text-foreground mb-1">
            No promotions yet
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            {vendorView
              ? "Upload promotions to share with your reseller partners."
              : "No promotions have been shared with you yet."}
          </p>
          {vendorView && (
            <Button
              data-ocid="promotions.empty.create_button"
              onClick={openCreate}
              className="text-white gap-1.5"
              style={{ background: "#FF6B2B" }}
            >
              <Plus size={15} /> Add Promotion
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {promotions.map((promo, i) => {
            const active = isActivePromo(promo.endDate);
            const expanded = expandedIds.has(promo.id);
            return (
              <div
                key={promo.id}
                data-ocid={`promotions.item.${i + 1}`}
                className="crm-card p-5 flex flex-col gap-3 hover:border-accent/30 transition-colors"
              >
                {/* Title row */}
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-foreground text-sm leading-snug">
                    {promo.promoName}
                  </p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className="status-badge"
                      style={{
                        background: active
                          ? "rgba(34,197,94,0.12)"
                          : "rgba(239,68,68,0.12)",
                        color: active ? "#4ade80" : "#f87171",
                      }}
                    >
                      {active ? "Active" : "Expired"}
                    </span>
                    {vendorView && (
                      <>
                        <button
                          type="button"
                          data-ocid={`promotions.edit_button.${i + 1}`}
                          onClick={() => openEdit(promo)}
                          className="p-1 rounded hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Edit promotion"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          data-ocid={`promotions.delete_button.${i + 1}`}
                          onClick={() => setDeleteConfirmId(promo.id)}
                          className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                          aria-label="Delete promotion"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Product + eligibility */}
                <div className="flex flex-wrap gap-1.5">
                  {promo.product && (
                    <Badge
                      variant="outline"
                      className="text-[10px] border-border text-muted-foreground"
                    >
                      {promo.product}
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className="text-[10px] border-border"
                    style={{
                      color: "#FF6B2B",
                      borderColor: "rgba(255,107,43,0.3)",
                    }}
                  >
                    {promo.resellerEligibility.length === 0
                      ? "All Resellers"
                      : `${promo.resellerEligibility.length} Reseller(s)`}
                  </Badge>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar size={11} className="shrink-0" />
                  <span>
                    {formatDate(promo.startDate)} — {formatDate(promo.endDate)}
                  </span>
                </div>

                {/* Description */}
                {promo.description && (
                  <div>
                    <p
                      className={`text-xs text-muted-foreground leading-relaxed ${expanded ? "" : "line-clamp-2"}`}
                    >
                      {promo.description}
                    </p>
                    {promo.description.length > 100 && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(promo.id)}
                        className="mt-0.5 text-[10px] flex items-center gap-0.5 transition-colors"
                        style={{ color: "#FF6B2B" }}
                      >
                        {expanded ? (
                          <>
                            <ChevronUp size={11} /> Less
                          </>
                        ) : (
                          <>
                            <ChevronDown size={11} /> More
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Files */}
                {promo.fileKeys.length > 0 && (
                  <div className="border-t border-border/50 pt-2.5">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <Paperclip size={10} />
                      {promo.fileKeys.length} Attached File
                      {promo.fileKeys.length !== 1 ? "s" : ""}
                    </p>
                    <div className="space-y-1">
                      {promo.fileKeys.map((key, fi) => {
                        const name = key.split("/").pop() ?? `File ${fi + 1}`;
                        return (
                          <a
                            key={key || `file-${fi}`}
                            href={ExternalBlob.fromURL(key).getDirectURL()}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
                          >
                            <FileText
                              size={11}
                              className="shrink-0 group-hover:text-accent"
                            />
                            <span className="truncate">{name}</span>
                            <Download
                              size={10}
                              className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* CTA */}
                {promo.callToAction && (
                  <div className="mt-auto pt-1">
                    <Button
                      type="button"
                      size="sm"
                      className="w-full text-white text-xs h-7"
                      style={{ background: "#FF6B2B" }}
                    >
                      {promo.callToAction}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className="max-w-xl max-h-[90vh] overflow-y-auto"
          style={{
            background: "#0e1b2e",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-foreground font-display">
              {editId ? "Edit Promotion" : "New Promotion"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Name + Product */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Promo Name *
                </Label>
                <Input
                  data-ocid="promotions.modal.name_input"
                  value={form.promoName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, promoName: e.target.value }))
                  }
                  placeholder="Spring Partner Offer"
                  className="crm-input h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Product</Label>
                <Input
                  data-ocid="promotions.modal.product_input"
                  value={form.product}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, product: e.target.value }))
                  }
                  placeholder="Security Suite"
                  className="crm-input h-8 text-sm"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Start Date *
                </Label>
                <Input
                  data-ocid="promotions.modal.start_date_input"
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                  className="crm-input h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  End Date *
                </Label>
                <Input
                  data-ocid="promotions.modal.end_date_input"
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                  className="crm-input h-8 text-sm"
                />
              </div>
            </div>

            {/* Partner Eligibility */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">
                  Reseller Eligibility
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    All Resellers
                  </span>
                  <Switch
                    data-ocid="promotions.modal.all_partners_toggle"
                    checked={form.allPartners}
                    onCheckedChange={(v) =>
                      setForm((f) => ({ ...f, allPartners: v }))
                    }
                  />
                </div>
              </div>
              {!form.allPartners && (
                <Input
                  data-ocid="promotions.modal.partners_input"
                  value={form.partnerEligibility}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      partnerEligibility: e.target.value,
                    }))
                  }
                  placeholder="ATEA, Softchoice, Insight (comma-separated)"
                  className="crm-input h-8 text-sm"
                />
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Description
              </Label>
              <Textarea
                data-ocid="promotions.modal.description_input"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Describe the promotion details, eligibility criteria, and partner incentives..."
                rows={3}
                className="crm-input text-sm resize-none"
              />
            </div>

            {/* Call to Action */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Call To Action
              </Label>
              <Input
                data-ocid="promotions.modal.cta_input"
                value={form.callToAction}
                onChange={(e) =>
                  setForm((f) => ({ ...f, callToAction: e.target.value }))
                }
                placeholder="Register Deal Now"
                className="crm-input h-8 text-sm"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Attachments
              </Label>
              <div
                data-ocid="promotions.modal.dropzone"
                className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFileUpload(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    fileInputRef.current?.click();
                }}
              >
                <Upload
                  size={20}
                  className="mx-auto mb-2 text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  Drop files here or{" "}
                  <span style={{ color: "#FF6B2B" }}>browse</span>
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  PDF, PPT, XLSX, DOCX, images
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.ppt,.pptx,.xls,.xlsx,.doc,.docx,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && handleFileUpload(e.target.files)
                  }
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-1.5">
                  {uploadedFiles.map((f, i) => (
                    <div
                      key={`${f.name}-${i}`}
                      className="flex items-center gap-2 p-2 rounded-md bg-secondary/20"
                    >
                      <FileText
                        size={13}
                        className="text-muted-foreground shrink-0"
                      />
                      <span className="text-xs text-foreground truncate flex-1">
                        {f.name}
                      </span>
                      {!f.done && (
                        <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${f.progress}%`,
                              background: "#FF6B2B",
                            }}
                          />
                        </div>
                      )}
                      {f.done && (
                        <span className="text-[10px] text-green-400">✓</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="shrink-0 text-muted-foreground hover:text-red-400 transition-colors"
                        aria-label="Remove file"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                data-ocid="promotions.modal.cancel_button"
                onClick={() => setModalOpen(false)}
                className="border-border text-foreground hover:bg-secondary/40"
              >
                Cancel
              </Button>
              <Button
                type="button"
                data-ocid="promotions.modal.submit_button"
                onClick={handleSave}
                disabled={
                  saving || !form.promoName || !form.startDate || !form.endDate
                }
                className="text-white"
                style={{ background: "#FF6B2B" }}
              >
                {saving
                  ? "Saving..."
                  : editId
                    ? "Update Promotion"
                    : "Create Promotion"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent
          className="max-w-sm"
          style={{
            background: "#0e1b2e",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Delete Promotion?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mt-1">
            This promotion will be permanently removed and partners will no
            longer see it.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              data-ocid="promotions.delete.cancel_button"
              onClick={() => setDeleteConfirmId(null)}
              className="border-border text-foreground hover:bg-secondary/40"
            >
              Cancel
            </Button>
            <Button
              type="button"
              data-ocid="promotions.delete.confirm_button"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
