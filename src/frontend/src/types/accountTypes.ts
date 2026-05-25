/**
 * CHANNELFORGE CRM — Extended Customer Account Model
 *
 * Customer accounts are operational CRM records managed jointly by Vendors,
 * Distributors, and Resellers. They are NOT authenticated platform users.
 * Domain claiming and SSO setup NEVER apply to customer organisations.
 *
 * This file defines frontend-only augmentation types that extend the base
 * Account record (from ../backend.d) with the full channel governance model.
 */

// ─── Owner type discriminator ─────────────────────────────────────────────────

export type AccountOwnerOrgType = "vendor" | "distributor" | "reseller";

// ─── Account Ownership Roles ──────────────────────────────────────────────────
// Five named ownership roles per account. Each owner may belong to any tier
// in the Vendor → Distributor → Reseller hierarchy.

export interface AccountOwnerRef {
  /** ID of the user who holds this ownership role */
  ownerId: string;
  /** Display name of the owner */
  ownerName: string;
  /** Which tier in the channel hierarchy this owner belongs to */
  ownerType: AccountOwnerOrgType;
  /** The organisation (company) name the owner belongs to */
  ownerOrgName: string;
  /** The organisation ID the owner belongs to */
  ownerOrgId: string;
}

export interface AccountOwnershipRoles {
  /** Vendor-level owner responsible for the strategic relationship */
  strategicOwner?: AccountOwnerRef;
  /** Owner responsible for driving and tracking renewal activity */
  renewalOwner?: AccountOwnerRef;
  /** Day-to-day operational owner — often a Distributor or Reseller */
  operationalOwner?: AccountOwnerRef;
  /** Owner responsible for service delivery and support */
  servicingOwner?: AccountOwnerRef;
  /** Owner who handles escalations and high-priority incidents */
  escalationOwner?: AccountOwnerRef;
}

// ─── Incumbent Distributors ───────────────────────────────────────────────────
// Accounts can have multiple Distributors covering different regions/products.

export interface IncumbentDistributor {
  distributorId: string;
  distributorName: string;
  /** Whether this is the primary (first-choice) Distributor for the account */
  isPrimary: boolean;
  /** Territories / regions this Distributor covers for the account */
  territories: string[];
  /** Operational responsibilities (e.g. "Billing", "Technical Support", "Renewals") */
  servicingResponsibilities: string[];
  /** Product lines this Distributor supplies to the account */
  productLines: string[];
}

// ─── Incumbent Resellers ──────────────────────────────────────────────────────
// Accounts can have multiple Resellers covering different servicing types.

export type ResellerServicingType = "renewals" | "support" | "general";

export interface IncumbentReseller {
  resellerId: string;
  resellerName: string;
  /** Whether this is the primary (first-choice) Reseller for the account */
  isPrimary: boolean;
  /** Territories / regions this Reseller covers for the account */
  territories: string[];
  /** The primary nature of this Reseller's engagement */
  servicingType: ResellerServicingType;
  /** Product lines this Reseller is responsible for */
  productLines: string[];
}

// ─── Channel Products & Services ─────────────────────────────────────────────
// Extended product record linking each product to its supply-chain partners.

export type ChannelProductServiceStatus =
  | "active"
  | "at-risk"
  | "expired"
  | "pending"
  | "suspended";

export interface ChannelProduct {
  /** Unique ID for this product-account association */
  productLineId: string;
  /** Product or service name, e.g. "Adobe Creative Cloud" */
  productName: string;
  /** High-level category, e.g. "Creative Suite", "Security", "Managed Services" */
  productCategory: string;
  /** Licence or subscription information (e.g. "50 seats", "Unlimited") */
  licenceInfo?: string;

  // ── Partner alignment ────────────────────────────────────────────────────
  /** The Vendor who owns/publishes this product */
  vendorId: string;
  vendorName: string;
  /** The Distributor who supplies this product to the customer */
  distributorId?: string;
  distributorName?: string;
  /** The Reseller who delivers and services this product */
  resellerId?: string;
  resellerName?: string;

  // ── Commercial ───────────────────────────────────────────────────────────
  /** Annual contract value in the account's base currency */
  contractValue: number;
  /** ISO currency code, e.g. "GBP" */
  currency: string;
  /** Renewal / expiry date as an ISO date string (YYYY-MM-DD) */
  renewalDate: string;
  /** Current service / subscription status */
  serviceStatus: ChannelProductServiceStatus;

  // ── Operational ──────────────────────────────────────────────────────────
  operationalNotes?: string;
}

// ─── Channel Relationship View ────────────────────────────────────────────────
// A flattened relationship summary shown in the "Channel Relationships" tab.

export interface ChannelRelationshipSummary {
  vendorId: string;
  vendorName: string;
  /** All incumbent Distributors for this account */
  incumbentDistributors: IncumbentDistributor[];
  /** All incumbent Resellers for this account */
  incumbentResellers: IncumbentReseller[];
  /** Five named ownership roles */
  ownershipRoles: AccountOwnershipRoles;
}

// ─── Extended CRM Account record ─────────────────────────────────────────────
// Frontend-only augmentation of the base backend Account type.
// Consumers should intersect this with the backend Account type:
//
//   type RichAccount = Account & CRMAccountExtension;
//
// IMPORTANT: This type NEVER includes authentication fields, SSO config,
// workspace credentials, or domain-claiming requirements. Customer accounts
// are operational CRM records, not platform users.

export interface CRMAccountExtension {
  // ── Channel governance ─────────────────────────────────────────────────
  /** Five named ownership roles. Owners may be from any partner tier. */
  ownershipRoles?: AccountOwnershipRoles;
  /** All Distributors currently servicing this account */
  incumbentDistributors?: IncumbentDistributor[];
  /** All Resellers currently servicing this account */
  incumbentResellers?: IncumbentReseller[];
  /** Products and services active on this account with full partner alignment */
  channelProducts?: ChannelProduct[];

  // ── Account metadata ──────────────────────────────────────────────────
  industry?: string;
  marketSegment?: string;
  region?: string;
  accountHealth?: "Excellent" | "Good" | "Fair" | "At Risk" | "Critical";
  /** Strategic importance rating for Vendor-level prioritisation */
  strategicImportance?: "Tier 1" | "Tier 2" | "Tier 3" | "Standard";

  // ── Hierarchy shortcut fields (flat governance lookup) ─────────────────
  /** Primary Vendor name (e.g. "Cisco", "Microsoft") */
  vendorName?: string;
  /** Primary Vendor domain (e.g. "cisco.com") */
  vendorDomain?: string;
  /** Primary Distributor name */
  distributorName?: string;
  /** Primary Distributor domain */
  distributorDomain?: string;
  /** Primary Reseller name */
  resellerName?: string;
  /** Account territory (e.g. "UK & Ireland", "Nordics", "EMEA") */
  territory?: string;
  /** Account health in governance-friendly format */
  accountHealthStatus?: "healthy" | "at-risk" | "critical";
  /** Renewal risk level for governance dashboards */
  renewalRisk?: "low" | "medium" | "high";
  /** Edit rights governance — which roles and org types may edit this account */
  editRights?: {
    fieldPermissions?: Record<
      string,
      { editableByRoles: string[]; lockedByDefault: boolean }
    >;
    accountLevelRoles?: string[];
    allowedRoles?: string[];
    allowedOrgTypes?: string[];
  };

  // ── ForgeAI context ───────────────────────────────────────────────────
  forgeAIInsights?: string[];
}

// ─── Convenience intersected type ────────────────────────────────────────────
// Import Account from "../backend.d" and use this to get the full rich type.

import type { Account } from "../backend.d";
export type RichAccount = Account & CRMAccountExtension;
