import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Plus, RefreshCcw, Search } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import type { Account, DealRegistrationInput } from "../backend";
import { DealStatus } from "../backend";
import { ClickableAccountName } from "../components/ClickableAccountName";
import { useFilterContext } from "../contexts/FilterContext";
import { useActor } from "../hooks/useActor";
import {
  formatCurrency,
  formatDate,
  renewalRiskColor,
} from "../utils/channelforge";

// ── Helpers ───────────────────────────────────────────────────────────────────
function daysUntil(ns: bigint): number {
  const ms = Number(ns) / 1_000_000;
  return Math.round((ms - Date.now()) / 86_400_000);
}

function RenewalBadge({ days }: { days: number }) {
  if (days < 0)
    return <span className="status-badge status-rejected">Overdue</span>;
  if (days <= 30)
    return <span className="status-badge status-rejected">{days}d</span>;
  if (days <= 90)
    return <span className="status-badge status-review">{days}d</span>;
  return <span className="status-badge status-approved">{days}d</span>;
}

// ── Quick Create Deal Modal ────────────────────────────────────────────────────
interface QuickDealModalProps {
  account: Account;
  onClose: () => void;
  onCreated: () => void;
}

function QuickDealModal({ account, onClose, onCreated }: QuickDealModalProps) {
  const { actor } = useActor();
  const [form, setForm] = useState({
    opportunityName: `${account.accountName} Renewal`,
    product: account.productList[0] ?? "",
    estimatedValue: String(account.estimatedRenewalValue || ""),
    closeDate: account.renewalDate
      ? new Date(Number(account.renewalDate) / 1_000_000)
          .toISOString()
          .split("T")[0]
      : "",
    resellerId: account.resellerOwnerId,
    vendorOwnerId: account.vendorOwnerId,
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const input: DealRegistrationInput = {
        accountId: account.id,
        customerDomain: account.customerDomain,
        opportunityName: form.opportunityName,
        product: form.product,
        estimatedValue: Number.parseFloat(form.estimatedValue) || 0,
        quantity: BigInt(account.licenceQuantity || 1),
        closeDate: form.closeDate
          ? BigInt(new Date(form.closeDate).getTime() * 1_000_000)
          : BigInt(0),
        dealStage: "Renewal",
        competitor: "",
        notes: form.notes,
        resellerId: form.resellerId,
        vendorOwnerId: form.vendorOwnerId,
        status: DealStatus.Draft,
        submittedBy: "",
        submittedDate: undefined,
      };
      const result = await actor.createDealRegistration(input);
      if (result.__kind__ === "err") {
        toast.error(result.err);
        return;
      }
      toast.success("Renewal deal created");
      onCreated();
      onClose();
    } catch {
      toast.error("Failed to create deal");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      data-ocid="renewals.create_deal.dialog"
    >
      <div className="crm-card w-full max-w-lg p-6 fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">
            Create Deal for {account.accountName}
          </h2>
          <button
            type="button"
            data-ocid="renewals.create_deal.close_button"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-secondary/40 text-muted-foreground"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label
                htmlFor="renewal-opp-name"
                className="block text-xs text-muted-foreground mb-1"
              >
                Opportunity Name *
              </label>
              <Input
                id="renewal-opp-name"
                required
                data-ocid="renewals.deal_name.input"
                value={form.opportunityName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, opportunityName: e.target.value }))
                }
                className="crm-input"
              />
            </div>
            <div>
              <label
                htmlFor="renewal-product"
                className="block text-xs text-muted-foreground mb-1"
              >
                Product
              </label>
              <Input
                id="renewal-product"
                data-ocid="renewals.deal_product.input"
                value={form.product}
                onChange={(e) =>
                  setForm((f) => ({ ...f, product: e.target.value }))
                }
                className="crm-input"
              />
            </div>
            <div>
              <label
                htmlFor="renewal-value"
                className="block text-xs text-muted-foreground mb-1"
              >
                Est. Value (USD)
              </label>
              <Input
                id="renewal-value"
                type="number"
                data-ocid="renewals.deal_value.input"
                value={form.estimatedValue}
                onChange={(e) =>
                  setForm((f) => ({ ...f, estimatedValue: e.target.value }))
                }
                className="crm-input"
              />
            </div>
            <div>
              <label
                htmlFor="renewal-close-date"
                className="block text-xs text-muted-foreground mb-1"
              >
                Close Date
              </label>
              <Input
                id="renewal-close-date"
                type="date"
                data-ocid="renewals.deal_close_date.input"
                value={form.closeDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, closeDate: e.target.value }))
                }
                className="crm-input"
              />
            </div>
            <div>
              <label
                htmlFor="renewal-reseller"
                className="block text-xs text-muted-foreground mb-1"
              >
                Reseller
              </label>
              <Input
                id="renewal-reseller"
                data-ocid="renewals.deal_reseller.input"
                value={form.resellerId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, resellerId: e.target.value }))
                }
                className="crm-input"
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor="renewal-notes"
                className="block text-xs text-muted-foreground mb-1"
              >
                Notes
              </label>
              <textarea
                id="renewal-notes"
                data-ocid="renewals.deal_notes.textarea"
                rows={2}
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                className="crm-input w-full px-3 py-2 text-sm resize-none"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              data-ocid="renewals.create_deal.cancel_button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="renewals.create_deal.submit_button"
              disabled={saving}
              style={{ background: "rgba(249,115,22,1)" }}
              className="text-white"
            >
              {saving ? "Creating…" : "Create Deal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function Renewals() {
  const {
    accounts,
    loading,
    dealRegistrations,
    refreshDealRegistrations,
    isOrgAccessible,
  } = useApp();
  useFilterContext();
  const [search, setSearch] = useState("");
  const [partnerFilter, setPartnerFilter] = useState("");
  const [daysBucket, setDaysBucket] = useState<"" | "30" | "60" | "90">("");
  const [statusFilter, setStatusFilter] = useState("");
  const [quickDealAccount, setQuickDealAccount] = useState<Account | null>(
    null,
  );

  // Sort upcoming renewals ascending
  // ORG-ISOLATION: filter renewals by accessible orgs
  const allRenewals = useMemo(
    () =>
      [...accounts]
        .filter((a) => a.renewalDate && Number(a.renewalDate) > 0)
        .filter((a) => {
          const dom =
            (a as any).vendorDomain || (a as any).distributorDomain || "";
          return !dom || isOrgAccessible(dom);
        })
        .sort((a, b) => Number(a.renewalDate - b.renewalDate)),
    [accounts, isOrgAccessible],
  );

  const highRisk = useMemo(() => {
    const dealledAccountIds = new Set(
      dealRegistrations.map((d) => d.accountId),
    );
    return allRenewals.filter((a) => {
      const days = daysUntil(a.renewalDate);
      return days <= 90 && !dealledAccountIds.has(a.id);
    });
  }, [allRenewals, dealRegistrations]);

  const partners = useMemo(() => {
    const ids = new Set(accounts.map((a) => a.resellerOwnerId).filter(Boolean));
    return Array.from(ids);
  }, [accounts]);

  const filtered = useMemo(() => {
    return allRenewals.filter((a) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !a.accountName.toLowerCase().includes(q) &&
          !a.customerDomain.toLowerCase().includes(q)
        )
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

  // Summary stats
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
  const totalValue = allRenewals
    .filter((a) => daysUntil(a.renewalDate) <= 90)
    .reduce((sum, a) => sum + a.estimatedRenewalValue, 0);

  return (
    <div className="space-y-5 fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground font-display">
            Renewals
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track upcoming contract renewals and renewal risk
          </p>
        </div>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Due in 30 days", value: in30, color: "text-orange-400" },
          { label: "Due in 60 days", value: in60, color: "text-orange-400" },
          { label: "Due in 90 days", value: in90, color: "text-yellow-400" },
          {
            label: "Value at risk (90d)",
            value: formatCurrency(totalValue),
            color: "text-foreground",
          },
        ].map((tile) => (
          <div
            key={tile.label}
            className="crm-card p-4 flex flex-col gap-1"
            data-ocid={`renewals.summary_${tile.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}.card`}
          >
            <span className={`text-2xl font-bold font-display ${tile.color}`}>
              {tile.value}
            </span>
            <span className="text-xs text-muted-foreground">{tile.label}</span>
          </div>
        ))}
      </div>

      {/* High-Risk Section */}
      {!loading && highRisk.length > 0 && (
        <div
          className="crm-card border border-orange-500/25 overflow-hidden"
          data-ocid="renewals.high_risk.section"
        >
          <div
            className="px-5 py-3 flex items-center gap-2"
            style={{ background: "rgba(255,107,43,0.08)" }}
          >
            <AlertTriangle
              size={15}
              className="text-orange-400 flex-shrink-0"
            />
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">
              High Risk — No Active Deal Registration ({highRisk.length})
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Account",
                    "Domain",
                    "Reseller",
                    "Renewal Date",
                    "Days Left",
                    "Value",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {highRisk.map((a, i) => {
                  const days = daysUntil(a.renewalDate);
                  return (
                    <tr
                      key={a.id}
                      data-ocid={`renewals.high_risk.item.${i + 1}`}
                      className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">
                        <ClickableAccountName
                          accountName={a.accountName}
                          accountId={a.id}
                          context="renewal"
                          className="text-foreground font-medium"
                        />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {a.customerDomain}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {a.resellerOwnerId || "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {formatDate(a.renewalDate)}
                      </td>
                      <td
                        className={`px-4 py-3 font-semibold ${renewalRiskColor(days)}`}
                      >
                        {days < 0 ? "Overdue" : `${days}d`}
                      </td>
                      <td className="px-4 py-3 text-foreground font-mono text-xs">
                        {formatCurrency(a.estimatedRenewalValue)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          data-ocid={`renewals.high_risk.create_deal_button.${i + 1}`}
                          onClick={() => setQuickDealAccount(a)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-border hover:border-accent text-muted-foreground hover:text-accent transition-colors"
                        >
                          <Plus size={11} /> Create Deal
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="crm-card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            data-ocid="renewals.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search accounts…"
            className="crm-input pl-8 text-sm"
          />
        </div>
        <select
          data-ocid="renewals.partner.select"
          value={partnerFilter}
          onChange={(e) => setPartnerFilter(e.target.value)}
          className="crm-input px-3 py-2 text-sm"
        >
          <option value="">All Resellers</option>
          {partners.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          data-ocid="renewals.days.select"
          value={daysBucket}
          onChange={(e) =>
            setDaysBucket(e.target.value as "" | "30" | "60" | "90")
          }
          className="crm-input px-3 py-2 text-sm"
        >
          <option value="">All upcoming</option>
          <option value="30">Next 30 days</option>
          <option value="60">Next 60 days</option>
          <option value="90">Next 90 days</option>
        </select>
        <select
          data-ocid="renewals.status.select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="crm-input px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="AtRisk">At Risk</option>
          <option value="Churned">Churned</option>
          <option value="Prospect">Prospect</option>
        </select>
      </div>

      {/* Renewals table */}
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
            data-ocid="renewals.empty_state"
          >
            <RefreshCcw size={40} className="text-muted-foreground mb-4" />
            <p className="text-base font-semibold text-foreground mb-1">
              No renewals found
            </p>
            <p className="text-sm text-muted-foreground">
              {allRenewals.length === 0
                ? "Add accounts with renewal dates to start tracking."
                : "Adjust filters to see more results."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Account",
                    "Domain",
                    "Reseller",
                    "Renewal Date",
                    "Days Left",
                    "Value",
                    "Status",
                    "Action",
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
                {filtered.map((a, i) => {
                  const days = daysUntil(a.renewalDate);
                  return (
                    <tr
                      key={a.id}
                      data-ocid={`renewals.item.${i + 1}`}
                      className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                            style={{
                              background: "rgba(255,107,43,0.15)",
                              color: "#FF6B2B",
                            }}
                          >
                            {a.accountName[0]?.toUpperCase()}
                          </div>
                          <ClickableAccountName
                            accountName={a.accountName}
                            accountId={a.id}
                            context="renewal"
                            className="font-medium truncate max-w-[120px]"
                            data-ocid={`renewals.account_link.${i + 1}`}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {a.customerDomain}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {a.resellerOwnerId || "—"}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                        {formatDate(a.renewalDate)}
                      </td>
                      <td className="px-4 py-3.5">
                        <RenewalBadge days={days} />
                      </td>
                      <td className="px-4 py-3.5 text-foreground font-mono text-xs">
                        {formatCurrency(a.estimatedRenewalValue)}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {a.status}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          data-ocid={`renewals.create_deal_button.${i + 1}`}
                          onClick={() => setQuickDealAccount(a)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-border hover:border-accent text-muted-foreground hover:text-accent transition-colors"
                        >
                          <Plus size={11} /> Deal
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick create deal modal */}
      {quickDealAccount && (
        <QuickDealModal
          account={quickDealAccount}
          onClose={() => setQuickDealAccount(null)}
          onCreated={refreshDealRegistrations}
        />
      )}
    </div>
  );
}
