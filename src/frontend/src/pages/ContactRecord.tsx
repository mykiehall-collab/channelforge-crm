import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Edit2,
  Mail,
  Phone,
  Save,
  StickyNote,
  User,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import type { Contact, Note } from "../backend";
import { useActor } from "../hooks/useActor";
import { formatDate, getInitials, timeAgo } from "../utils/channelforge";

const CONTACT_TYPES = [
  "Decision Maker",
  "Influencer",
  "End User",
  "Technical",
  "Finance",
  "Other",
];

const CONTACT_TYPE_COLORS: Record<string, string> = {
  "Decision Maker": "bg-orange-500/20 text-orange-300",
  Influencer: "bg-blue-500/20 text-blue-300",
  "End User": "bg-green-500/20 text-green-300",
  Technical: "bg-purple-500/20 text-purple-300",
  Finance: "bg-yellow-500/20 text-yellow-300",
  Other: "bg-muted/40 text-muted-foreground",
};

function DetailField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm text-foreground">{value || "—"}</p>
    </div>
  );
}

export function ContactRecord() {
  const routerState = useRouterState();
  const id = routerState.location.pathname.split("/contacts/")[1];
  const navigate = useNavigate();
  const { actor } = useActor();
  const { accounts, userProfile } = useApp();

  const [contact, setContact] = useState<Contact | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Contact>>({});
  const [saving, setSaving] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteContent, setEditNoteContent] = useState("");

  useEffect(() => {
    if (!id || !actor) return;
    setLoading(true);
    Promise.all([actor.getContact(id).catch(() => null)])
      .then(([c]) => {
        setContact(c);
        setEditForm(c ?? {});
        if (c?.accountId) {
          actor
            .getNotesByAccount(c.accountId)
            .then((n) =>
              setNotes(
                [...n].sort((a, b) => Number(b.createdAt - a.createdAt)),
              ),
            )
            .catch(() => {});
        }
      })
      .finally(() => setLoading(false));
  }, [id, actor]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !id || !contact) return;
    setSaving(true);
    try {
      const result = await actor.updateContact(id, {
        firstName: editForm.firstName ?? contact.firstName,
        lastName: editForm.lastName ?? contact.lastName,
        email: editForm.email ?? contact.email,
        phone: editForm.phone ?? contact.phone ?? "",
        jobTitle: editForm.jobTitle ?? contact.jobTitle ?? "",
        accountId: editForm.accountId ?? contact.accountId,
        contactOwner: editForm.contactOwner ?? contact.contactOwner ?? "",
        contactType: editForm.contactType ?? contact.contactType,
        notes: editForm.notes ?? contact.notes ?? "",
        lastContactedDate:
          editForm.lastContactedDate ?? contact.lastContactedDate,
        nextActionDate: editForm.nextActionDate ?? contact.nextActionDate,
      });
      if (result.__kind__ === "err") {
        toast.error(result.err);
        return;
      }
      setContact(result.ok);
      setEditForm(result.ok);
      setEditing(false);
      toast.success("Contact updated");
    } catch {
      toast.error("Failed to update contact");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogNote(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !contact?.accountId || !noteContent.trim()) return;
    setSavingNote(true);
    try {
      await actor.createNote({
        accountId: contact.accountId,
        content: noteContent,
        authorName: userProfile?.fullName ?? "User",
        authorRole: userProfile?.role ?? "User",
      });
      const updated = await actor.getNotesByAccount(contact.accountId);
      setNotes([...updated].sort((a, b) => Number(b.createdAt - a.createdAt)));
      setNoteContent("");
      toast.success("Note logged");
    } catch {
      toast.error("Failed to log note");
    } finally {
      setSavingNote(false);
    }
  }

  async function handleEditNote(noteId: string) {
    if (!actor || !editNoteContent.trim()) return;
    try {
      const result = await actor.updateNote(noteId, editNoteContent);
      if (result.__kind__ === "err") {
        toast.error(result.err);
        return;
      }
      if (contact?.accountId) {
        const updated = await actor.getNotesByAccount(contact.accountId);
        setNotes(
          [...updated].sort((a, b) => Number(b.createdAt - a.createdAt)),
        );
      }
      setEditingNoteId(null);
      setEditNoteContent("");
      toast.success("Note updated");
    } catch {
      toast.error("Failed to update note");
    }
  }

  const relatedAccount = contact?.accountId
    ? accounts.find((a) => a.id === contact.accountId)
    : null;

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex flex-col items-center py-20">
        <User size={40} className="text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-4">Contact not found</p>
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate({ to: "/contacts" })}
        >
          Back to Contacts
        </Button>
      </div>
    );
  }

  const typeCls =
    CONTACT_TYPE_COLORS[contact.contactType] ?? CONTACT_TYPE_COLORS.Other;

  return (
    <div className="space-y-5 fade-in">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/contacts" })}
          className="text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="contact_record.back_button"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-foreground font-display truncate">
            {contact.firstName} {contact.lastName}
          </h1>
          <p className="text-sm text-muted-foreground truncate">
            {contact.jobTitle || "No title"}
            {relatedAccount ? ` · ${relatedAccount.accountName}` : ""}
          </p>
        </div>
        {!editing && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="contact_record.edit_button"
            onClick={() => setEditing(true)}
            className="border-border text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            <Edit2 size={14} className="mr-1.5" /> Edit
          </Button>
        )}
      </div>

      {/* Detail Card */}
      <div className="crm-card p-5">
        <div className="flex items-start gap-5 mb-6">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
            style={{ background: "rgba(255,107,43,0.15)", color: "#FF6B2B" }}
          >
            {getInitials(`${contact.firstName} ${contact.lastName}`)}
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {contact.firstName} {contact.lastName}
            </h2>
            {contact.jobTitle && (
              <p className="text-sm text-muted-foreground">
                {contact.jobTitle}
              </p>
            )}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1.5 ${typeCls}`}
            >
              {contact.contactType}
            </span>
          </div>
        </div>

        {editing ? (
          <form
            onSubmit={handleSave}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            data-ocid="contact_record.edit_form"
          >
            <div>
              <label
                htmlFor="contact-firstname"
                className="block text-xs text-muted-foreground mb-1"
              >
                First Name *
              </label>
              <Input
                id="contact-firstname"
                required
                value={editForm.firstName ?? ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, firstName: e.target.value })
                }
                className="crm-input"
              />
            </div>
            <div>
              <label
                htmlFor="contact-lastname"
                className="block text-xs text-muted-foreground mb-1"
              >
                Last Name *
              </label>
              <Input
                id="contact-lastname"
                required
                value={editForm.lastName ?? ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, lastName: e.target.value })
                }
                className="crm-input"
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="block text-xs text-muted-foreground mb-1"
              >
                Email *
              </label>
              <Input
                id="contact-email"
                required
                type="email"
                value={editForm.email ?? ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                className="crm-input"
              />
            </div>
            <div>
              <label
                htmlFor="contact-phone"
                className="block text-xs text-muted-foreground mb-1"
              >
                Phone
              </label>
              <Input
                id="contact-phone"
                value={editForm.phone ?? ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                className="crm-input"
              />
            </div>
            <div>
              <label
                htmlFor="contact-jobtitle"
                className="block text-xs text-muted-foreground mb-1"
              >
                Job Title
              </label>
              <Input
                id="contact-jobtitle"
                value={editForm.jobTitle ?? ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, jobTitle: e.target.value })
                }
                className="crm-input"
              />
            </div>
            <div>
              <label
                htmlFor="contact-type"
                className="block text-xs text-muted-foreground mb-1"
              >
                Contact Type
              </label>
              <select
                id="contact-type"
                value={editForm.contactType ?? ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, contactType: e.target.value })
                }
                className="crm-input w-full px-3 py-2 text-sm"
              >
                {CONTACT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="contact-last-contacted"
                className="block text-xs text-muted-foreground mb-1"
              >
                Last Contacted
              </label>
              <Input
                id="contact-last-contacted"
                type="date"
                value={
                  editForm.lastContactedDate
                    ? new Date(Number(editForm.lastContactedDate) / 1_000_000)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    lastContactedDate: e.target.value
                      ? BigInt(new Date(e.target.value).getTime()) * 1_000_000n
                      : undefined,
                  })
                }
                className="crm-input"
              />
            </div>
            <div>
              <label
                htmlFor="contact-next-action"
                className="block text-xs text-muted-foreground mb-1"
              >
                Next Action Date
              </label>
              <Input
                id="contact-next-action"
                type="date"
                value={
                  editForm.nextActionDate
                    ? new Date(Number(editForm.nextActionDate) / 1_000_000)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    nextActionDate: e.target.value
                      ? BigInt(new Date(e.target.value).getTime()) * 1_000_000n
                      : undefined,
                  })
                }
                className="crm-input"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="contact-notes"
                className="block text-xs text-muted-foreground mb-1"
              >
                Notes
              </label>
              <textarea
                id="contact-notes"
                value={editForm.notes ?? ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, notes: e.target.value })
                }
                rows={3}
                className="crm-input w-full px-3 py-2 text-sm resize-none"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                data-ocid="contact_record.edit.cancel_button"
                onClick={() => {
                  setEditing(false);
                  setEditForm(contact);
                }}
              >
                <X size={14} className="mr-1" /> Cancel
              </Button>
              <Button
                type="submit"
                data-ocid="contact_record.edit.save_button"
                disabled={saving}
                style={{ background: "#FF6B2B" }}
                className="text-white"
              >
                <Save size={14} className="mr-1.5" />
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <DetailField
              label="Email"
              value={
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-1.5 text-accent hover:underline"
                >
                  <Mail size={13} /> {contact.email}
                </a>
              }
            />
            <DetailField
              label="Phone"
              value={
                contact.phone ? (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-1.5 hover:text-accent transition-colors"
                  >
                    <Phone size={13} /> {contact.phone}
                  </a>
                ) : null
              }
            />
            <DetailField label="Job Title" value={contact.jobTitle} />
            <DetailField
              label="Related Account"
              value={
                relatedAccount ? (
                  <button
                    type="button"
                    onClick={() =>
                      navigate({ to: `/accounts/${relatedAccount.id}` })
                    }
                    className="flex items-center gap-1.5 text-accent hover:underline"
                  >
                    <Building2 size={13} /> {relatedAccount.accountName}
                  </button>
                ) : null
              }
            />
            <DetailField
              label="Last Contacted"
              value={
                contact.lastContactedDate ? (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-muted-foreground" />
                    {formatDate(contact.lastContactedDate)}
                  </span>
                ) : null
              }
            />
            <DetailField
              label="Next Action"
              value={
                contact.nextActionDate ? (
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs"
                    style={{
                      background: "rgba(255,107,43,0.12)",
                      color: "#FF6B2B",
                    }}
                  >
                    <Calendar size={12} />
                    {formatDate(contact.nextActionDate)}
                  </span>
                ) : null
              }
            />
            {contact.notes && (
              <div className="sm:col-span-2 lg:col-span-3">
                <p className="text-xs text-muted-foreground mb-0.5">Notes</p>
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {contact.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="crm-card" data-ocid="contact_record.notes_section">
        <div className="px-5 py-4 border-b border-border/60 flex items-center gap-2">
          <StickyNote size={16} className="text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Activity Notes
          </h3>
          {contact.accountId && (
            <span className="text-xs text-muted-foreground ml-1">
              (Account: {relatedAccount?.accountName ?? contact.accountId})
            </span>
          )}
        </div>

        {/* Log Note Form */}
        {contact.accountId && (
          <form
            onSubmit={handleLogNote}
            className="px-5 py-4 border-b border-border/40"
          >
            <textarea
              data-ocid="contact_record.note.textarea"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={2}
              placeholder="Log an activity note on this account…"
              className="crm-input w-full px-3 py-2 text-sm resize-none mb-3"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                data-ocid="contact_record.note.submit_button"
                disabled={savingNote || !noteContent.trim()}
                style={{ background: "#FF6B2B" }}
                className="text-white"
              >
                {savingNote ? "Logging…" : "Log Note"}
              </Button>
            </div>
          </form>
        )}

        {/* Notes list */}
        <div className="divide-y divide-border/40">
          {notes.length === 0 ? (
            <div
              className="flex flex-col items-center py-10"
              data-ocid="contact_record.notes.empty_state"
            >
              <StickyNote size={28} className="text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No notes yet</p>
            </div>
          ) : (
            notes.map((note, i) => (
              <div
                key={note.id}
                data-ocid={`contact_record.note.item.${i + 1}`}
                className="px-5 py-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{
                      background: "rgba(255,107,43,0.12)",
                      color: "#FF6B2B",
                    }}
                  >
                    {getInitials(note.authorName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-semibold text-foreground">
                        {note.authorName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {note.authorRole}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        · {timeAgo(note.createdAt)}
                      </span>
                      {note.updatedAt && (
                        <span className="text-xs text-muted-foreground italic">
                          (edited {timeAgo(note.updatedAt)})
                        </span>
                      )}
                    </div>
                    {editingNoteId === note.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editNoteContent}
                          onChange={(e) => setEditNoteContent(e.target.value)}
                          rows={3}
                          className="crm-input w-full px-3 py-2 text-sm resize-none"
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleEditNote(note.id)}
                            style={{ background: "#FF6B2B" }}
                            className="text-white text-xs"
                          >
                            Save
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingNoteId(null)}
                            className="text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {note.content}
                      </p>
                    )}
                  </div>
                  {editingNoteId !== note.id &&
                    note.authorId === userProfile?.id && (
                      <button
                        type="button"
                        data-ocid={`contact_record.note.edit_button.${i + 1}`}
                        onClick={() => {
                          setEditingNoteId(note.id);
                          setEditNoteContent(note.content);
                        }}
                        className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                      >
                        <Edit2 size={13} />
                      </button>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
