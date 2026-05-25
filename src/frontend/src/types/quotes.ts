// Shared Quote types used by QuotesPage and QuoteBuilder

export interface QuoteLineItem {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discountPct: number;
  billingTerm: "Monthly" | "Annual" | "Multi-Year" | "One-Time" | "Renewal";
}

export type QuoteStatus = "Draft" | "Pending Approval" | "Approved" | "Expired";

export interface QuoteRecord {
  id: string;
  quoteNumber: string;
  version: number;
  accountName: string;
  opportunityName: string | null;
  dealRegNumber: string | null;
  status: QuoteStatus;
  owner: string;
  createdDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  totalValue: number;
  currency: string;
  notes: string;
  lineItems: QuoteLineItem[];
}
