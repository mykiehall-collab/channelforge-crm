import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  Download,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import type { Contact } from "../backend";
import { BulkUpload } from "../components/BulkUpload";
import { useActor } from "../hooks/useActor";
import { formatDate, getInitials } from "../utils/channelforge";

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

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  jobTitle: "",
  accountId: "",
  contactOwner: "",
  contactType: "Decision Maker",
  notes: "",
  lastContactedDate: "",
  nextActionDate: "",
};

function ContactTypeBadge({ type }: { type: string }) {
  const cls = CONTACT_TYPE_COLORS[type] ?? CONTACT_TYPE_COLORS.Other;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}
    >
      {type || "Contact"}
    </span>
  );
}

export function ContactsList() {
  const navigate = useNavigate();
  const { contacts, accounts, loading, refreshContacts, isVendor } = useApp();
  const { actor } = useActor();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterAccount, setFilterAccount] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [accountSearch, setAccountSearch] = useState("");
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const filteredAccounts = accounts.filter(
    (a) =>
      !accountSearch ||
      a.accountName.toLowerCase().includes(accountSearch.toLowerCase()),
  );

  const filtered = contacts.filter((c: Contact) => {
    const name = `${c.firstName} ${c.lastName}`.toLowerCase();
    const matchSearch =
      !search ||
      name.includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (accounts.find((a) => a.id === c.accountId)?.accountName ?? "")
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchType = !filterType || c.contactType === filterType;
    const matchAccount = !filterAccount || c.accountId === filterAccount;
    return matchSearch && matchType && matchAccount;
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const result = await actor.createContact({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        jobTitle: form.jobTitle,
        accountId: form.accountId,
        contactOwner: form.contactOwner,
        contactType: form.contactType,
        notes: form.notes,
        lastContactedDate: form.lastContactedDate
          ? BigInt(new Date(form.lastContactedDate).getTime()) * 1_000_000n
          : undefined,
        nextActionDate: form.nextActionDate
          ? BigInt(new Date(form.nextActionDate).getTime()) * 1_000_000n
          : undefined,
      });
      if (result.__kind__ === "err") {
        toast.error(result.err);
        return;
      }
      await refreshContacts();
      setShowCreate(false);
      setForm(EMPTY_FORM);
      toast.success("Contact created successfully");
    } catch {
      toast.error("Failed to create contact");
    } finally {
      setSaving(false);
    }
  }

  function clearFilters() {
    setFilterType("");
    setFilterAccount("");
    setSearch("");
  }

  const hasFilters = !!(search || filterType || filterAccount);

  if (showBulkUpload) {
    return (
      <BulkUpload
        onComplete={() => {
          setShowBulkUpload(false);
          refreshContacts();
        }}
      />
    );
  }

  return (
    <div className="space-y-5 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground font-display">
            Contacts
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isVendor()
              ? "All contacts across your partner network"
              : "Your assigned contacts"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="contacts.import_button"
            onClick={() => setShowBulkUpload(true)}
            className="text-muted-foreground border-border hover:text-foreground"
          >
            <Download size={14} className="mr-1.5" /> Import
          </Button>
          <Button
            type="button"
            size="sm"
            data-ocid="contacts.add_button"
            onClick={() => {
              setShowCreate((v) => !v);
              setShowFilters(false);
            }}
            style={{ background: "#FF6B2B" }}
            className="text-white"
          >
            <Plus size={14} className="mr-1.5" /> Add Contact
          </Button>
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            data-ocid="contacts.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or company…"
            className="crm-input pl-9 text-sm"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-ocid="contacts.filter_toggle"
          onClick={() => setShowFilters((v) => !v)}
          className="border-border text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          <SlidersHorizontal size={14} className="mr-1.5" />
          Filters
          {hasFilters && (
            <span
              className="ml-1.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{ background: "#FF6B2B", color: "#fff" }}
            >
              !
            </span>
          )}
        </Button>
        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground text-xs"
          >
            <X size={12} className="mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div
          className="crm-card p-4 grid grid-cols-2 gap-4 fade-in"
          data-ocid="contacts.filter_panel"
        >
          <div>
            <label
              htmlFor="filter-type"
              className="block text-xs text-muted-foreground mb-1"
            >
              Contact Type
            </label>
            <select
              id="filter-type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="crm-input w-full px-3 py-2 text-sm"
              data-ocid="contacts.filter.type_select"
            >
              <option value="">All types</option>
              {CONTACT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="filter-account"
              className="block text-xs text-muted-foreground mb-1"
            >
              Account
            </label>
            <select
              id="filter-account"
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
              className="crm-input w-full px-3 py-2 text-sm"
              data-ocid="contacts.filter.account_select"
            >
              <option value="">All accounts</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.accountName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Create Contact panel */}
      {showCreate && (
        <div className="crm-card p-5 fade-in" data-ocid="contacts.create_panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              New Contact
            </h3>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="text-muted-foreground hover:text-foreground"
              data-ocid="contacts.create.close_button"
            >
              <X size={16} />
            </button>
          </div>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label
                htmlFor="create-firstname"
                className="block text-xs text-muted-foreground mb-1"
              >
                First Name *
              </label>
              <Input
                required
                id="create-firstname"
                data-ocid="contacts.firstname.input"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className="crm-input"
                placeholder="Jane"
              />
            </div>
            <div>
              <label
                htmlFor="create-lastname"
                className="block text-xs text-muted-foreground mb-1"
              >
                Last Name *
              </label>
              <Input
                required
                id="create-lastname"
                data-ocid="contacts.lastname.input"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="crm-input"
                placeholder="Smith"
              />
            </div>
            <div>
              <label
                htmlFor="create-email"
                className="block text-xs text-muted-foreground mb-1"
              >
                Email *
              </label>
              <Input
                required
                id="create-email"
                type="email"
                data-ocid="contacts.email.input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="crm-input"
                placeholder="jane@company.com"
              />
            </div>
            <div>
              <label
                htmlFor="create-phone"
                className="block text-xs text-muted-foreground mb-1"
              >
                Phone
              </label>
              <Input
                id="create-phone"
                data-ocid="contacts.phone.input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="crm-input"
                placeholder="+44 20 1234 5678"
              />
            </div>
            <div>
              <label
                htmlFor="create-jobtitle"
                className="block text-xs text-muted-foreground mb-1"
              >
                Job Title
              </label>
              <Input
                id="create-jobtitle"
                data-ocid="contacts.jobtitle.input"
                value={form.jobTitle}
                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                className="crm-input"
                placeholder="VP Sales"
              />
            </div>
            <div>
              <label
                htmlFor="create-contact-type"
                className="block text-xs text-muted-foreground mb-1"
              >
                Contact Type
              </label>
              <select
                id="create-contact-type"
                value={form.contactType}
                onChange={(e) =>
                  setForm({ ...form, contactType: e.target.value })
                }
                className="crm-input w-full px-3 py-2 text-sm"
                data-ocid="contacts.type.select"
              >
                {CONTACT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            {/* Account selector with search */}
            <div className="relative">
              <label
                htmlFor="create-account"
                className="block text-xs text-muted-foreground mb-1"
              >
                Account
              </label>
              <div className="relative">
                <Input
                  data-ocid="contacts.account_search.input"
                  value={
                    form.accountId
                      ? (accounts.find((a) => a.id === form.accountId)
                          ?.accountName ?? accountSearch)
                      : accountSearch
                  }
                  onChange={(e) => {
                    setAccountSearch(e.target.value);
                    setForm({ ...form, accountId: "" });
                    setShowAccountDropdown(true);
                  }}
                  onFocus={() => setShowAccountDropdown(true)}
                  className="crm-input pr-8"
                  placeholder="Search accounts…"
                />
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
              </div>
              {showAccountDropdown && filteredAccounts.length > 0 && (
                <div className="absolute z-20 top-full mt-1 w-full crm-card border-border shadow-lg max-h-44 overflow-y-auto">
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-xs text-muted-foreground hover:bg-secondary/20"
                    onClick={() => {
                      setForm({ ...form, accountId: "" });
                      setAccountSearch("");
                      setShowAccountDropdown(false);
                    }}
                  >
                    None
                  </button>
                  {filteredAccounts.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-secondary/20 transition-colors"
                      onClick={() => {
                        setForm({ ...form, accountId: a.id });
                        setAccountSearch(a.accountName);
                        setShowAccountDropdown(false);
                      }}
                    >
                      {a.accountName}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="create-last-contacted"
                className="block text-xs text-muted-foreground mb-1"
              >
                Last Contacted
              </label>
              <Input
                id="create-last-contacted"
                type="date"
                data-ocid="contacts.last_contacted.input"
                value={form.lastContactedDate}
                onChange={(e) =>
                  setForm({ ...form, lastContactedDate: e.target.value })
                }
                className="crm-input"
              />
            </div>
            <div>
              <label
                htmlFor="create-next-action"
                className="block text-xs text-muted-foreground mb-1"
              >
                Next Action Date
              </label>
              <Input
                id="create-next-action"
                type="date"
                data-ocid="contacts.next_action.input"
                value={form.nextActionDate}
                onChange={(e) =>
                  setForm({ ...form, nextActionDate: e.target.value })
                }
                className="crm-input"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="create-notes"
                className="block text-xs text-muted-foreground mb-1"
              >
                Notes
              </label>
              <textarea
                id="create-notes"
                data-ocid="contacts.notes.textarea"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="crm-input w-full px-3 py-2 text-sm resize-none"
                placeholder="Add any relevant notes…"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                data-ocid="contacts.create.cancel_button"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-ocid="contacts.create.submit_button"
                disabled={saving}
                style={{ background: "#FF6B2B" }}
                className="text-white"
              >
                {saving ? "Creating…" : "Create Contact"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Contacts Table */}
      <div className="crm-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center py-16"
            data-ocid="contacts.empty_state"
          >
            <Users size={40} className="text-muted-foreground mb-4" />
            <p className="text-base font-semibold text-foreground mb-1">
              {hasFilters
                ? "No contacts match your filters"
                : "No contacts yet"}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {hasFilters
                ? "Try adjusting your search or filters."
                : "Add contacts manually or import via Excel/CSV."}
            </p>
            {!hasFilters && (
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="contacts.empty.import_button"
                  onClick={() => setShowBulkUpload(true)}
                >
                  <Download size={14} className="mr-1.5" /> Import CSV
                </Button>
                <Button
                  type="button"
                  data-ocid="contacts.empty.add_button"
                  onClick={() => setShowCreate(true)}
                  style={{ background: "#FF6B2B" }}
                  className="text-white"
                >
                  <Plus size={14} className="mr-1.5" /> Add Contact
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="px-5 py-3 border-b border-border/50 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {filtered.length} contact{filtered.length !== 1 ? "s" : ""}
              </span>
              {hasFilters && (
                <Badge variant="secondary" className="text-xs">
                  Filtered
                </Badge>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/10">
                    {[
                      "Name",
                      "Job Title",
                      "Email",
                      "Phone",
                      "Company / Account",
                      "Type",
                      "Last Contacted",
                      "Next Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => {
                    const account = accounts.find((a) => a.id === c.accountId);
                    return (
                      <tr
                        key={c.id}
                        data-ocid={`contacts.item.${i + 1}`}
                        onClick={() => navigate({ to: `/contacts/${c.id}` })}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          navigate({ to: `/contacts/${c.id}` })
                        }
                        tabIndex={0}
                        className="border-b border-border/40 last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer group"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{
                                background: "rgba(255,107,43,0.15)",
                                color: "#FF6B2B",
                              }}
                            >
                              {getInitials(`${c.firstName} ${c.lastName}`)}
                            </div>
                            <span className="font-medium text-foreground group-hover:text-accent transition-colors">
                              {c.firstName} {c.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground">
                          {c.jobTitle || "—"}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground">
                          {c.email}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                          {c.phone || "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          {account ? (
                            <span className="text-foreground">
                              {account.accountName}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <ContactTypeBadge type={c.contactType} />
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                          {c.lastContactedDate
                            ? formatDate(c.lastContactedDate)
                            : "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          {c.nextActionDate ? (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                background: "rgba(255,107,43,0.12)",
                                color: "#FF6B2B",
                              }}
                            >
                              {formatDate(c.nextActionDate)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
