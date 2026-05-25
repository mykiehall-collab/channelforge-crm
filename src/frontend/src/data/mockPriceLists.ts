// Mock price list data for the Operational Price Calculator
// 15+ products across 3 product families

export type ProductFamily =
  | "Security Suite"
  | "Cloud Infrastructure"
  | "Analytics Platform";
export type Region = "EMEA" | "APAC" | "Americas";
export type Currency = "GBP" | "USD" | "EUR";
export type BillingFrequency = "monthly" | "annual";
export type ContractTerm = 1 | 2 | 3;
export type PricingType =
  | "list"
  | "promo"
  | "renewal"
  | "distributor"
  | "reseller";

export interface MockProduct {
  sku: string;
  name: string;
  productFamily: ProductFamily;
  vendor: string;
  region: Region;
  currency: Currency;
  basePrice: number;
  promoPrice: number;
  renewalPrice: number;
  incentivePct: number;
  distributorCost: number;
  resellerCost: number;
  contractTerm: ContractTerm;
  billingFrequency: BillingFrequency;
  description: string;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  // ─── Security Suite ──────────────────────────────────────────────
  {
    sku: "SS-EP-001",
    name: "Endpoint Protection Advanced",
    productFamily: "Security Suite",
    vendor: "CyberShield Technologies",
    region: "EMEA",
    currency: "GBP",
    basePrice: 4800,
    promoPrice: 3840,
    renewalPrice: 4320,
    incentivePct: 12,
    distributorCost: 3120,
    resellerCost: 3600,
    contractTerm: 1,
    billingFrequency: "annual",
    description: "Enterprise endpoint detection and response platform",
  },
  {
    sku: "SS-SIEM-002",
    name: "SIEM Enterprise Edition",
    productFamily: "Security Suite",
    vendor: "CyberShield Technologies",
    region: "EMEA",
    currency: "GBP",
    basePrice: 18500,
    promoPrice: 15725,
    renewalPrice: 16650,
    incentivePct: 15,
    distributorCost: 11100,
    resellerCost: 13875,
    contractTerm: 3,
    billingFrequency: "annual",
    description: "Security information and event management — full deployment",
  },
  {
    sku: "SS-ZT-003",
    name: "Zero Trust Network Access",
    productFamily: "Security Suite",
    vendor: "CyberShield Technologies",
    region: "Americas",
    currency: "USD",
    basePrice: 12000,
    promoPrice: 9600,
    renewalPrice: 10800,
    incentivePct: 10,
    distributorCost: 7200,
    resellerCost: 9000,
    contractTerm: 1,
    billingFrequency: "annual",
    description: "Cloud-native zero trust access for distributed workforces",
  },
  {
    sku: "SS-IAM-004",
    name: "Identity & Access Management Pro",
    productFamily: "Security Suite",
    vendor: "CyberShield Technologies",
    region: "APAC",
    currency: "USD",
    basePrice: 7200,
    promoPrice: 6120,
    renewalPrice: 6840,
    incentivePct: 8,
    distributorCost: 4680,
    resellerCost: 5400,
    contractTerm: 2,
    billingFrequency: "annual",
    description: "Enterprise IAM with MFA, SSO, and privileged access",
  },
  {
    sku: "SS-SOC-005",
    name: "Managed SOC Services",
    productFamily: "Security Suite",
    vendor: "CyberShield Technologies",
    region: "EMEA",
    currency: "GBP",
    basePrice: 3200,
    promoPrice: 2880,
    renewalPrice: 3040,
    incentivePct: 5,
    distributorCost: 2080,
    resellerCost: 2560,
    contractTerm: 1,
    billingFrequency: "monthly",
    description: "24/7 security operations centre — per-month managed service",
  },
  // ─── Cloud Infrastructure ─────────────────────────────────────────
  {
    sku: "CI-COMP-006",
    name: "Compute Cluster Standard",
    productFamily: "Cloud Infrastructure",
    vendor: "NovaCom Cloud",
    region: "EMEA",
    currency: "GBP",
    basePrice: 9600,
    promoPrice: 8160,
    renewalPrice: 8880,
    incentivePct: 10,
    distributorCost: 6240,
    resellerCost: 7200,
    contractTerm: 1,
    billingFrequency: "annual",
    description: "Managed compute cluster — 16 vCPU, 64 GB RAM",
  },
  {
    sku: "CI-OBJ-007",
    name: "Object Storage Enterprise",
    productFamily: "Cloud Infrastructure",
    vendor: "NovaCom Cloud",
    region: "Americas",
    currency: "USD",
    basePrice: 4200,
    promoPrice: 3570,
    renewalPrice: 3990,
    incentivePct: 8,
    distributorCost: 2730,
    resellerCost: 3150,
    contractTerm: 1,
    billingFrequency: "annual",
    description: "S3-compatible object storage — 100 TB allocated",
  },
  {
    sku: "CI-CDN-008",
    name: "Global CDN & Edge Delivery",
    productFamily: "Cloud Infrastructure",
    vendor: "NovaCom Cloud",
    region: "APAC",
    currency: "USD",
    basePrice: 6500,
    promoPrice: 5525,
    renewalPrice: 6175,
    incentivePct: 12,
    distributorCost: 3900,
    resellerCost: 4875,
    contractTerm: 2,
    billingFrequency: "annual",
    description: "Content delivery network with 200+ global PoPs",
  },
  {
    sku: "CI-DB-009",
    name: "Managed Database Cluster",
    productFamily: "Cloud Infrastructure",
    vendor: "NovaCom Cloud",
    region: "EMEA",
    currency: "EUR",
    basePrice: 11200,
    promoPrice: 9520,
    renewalPrice: 10640,
    incentivePct: 10,
    distributorCost: 7280,
    resellerCost: 8400,
    contractTerm: 3,
    billingFrequency: "annual",
    description: "Multi-AZ managed PostgreSQL / MySQL cluster",
  },
  {
    sku: "CI-KUBE-010",
    name: "Kubernetes Platform Enterprise",
    productFamily: "Cloud Infrastructure",
    vendor: "NovaCom Cloud",
    region: "Americas",
    currency: "USD",
    basePrice: 22000,
    promoPrice: 18700,
    renewalPrice: 20900,
    incentivePct: 15,
    distributorCost: 14300,
    resellerCost: 16500,
    contractTerm: 1,
    billingFrequency: "annual",
    description:
      "Managed Kubernetes with auto-scaling, GitOps, and observability",
  },
  // ─── Analytics Platform ────────────────────────────────────────────
  {
    sku: "AP-BI-011",
    name: "Business Intelligence Suite",
    productFamily: "Analytics Platform",
    vendor: "DataPulse Analytics",
    region: "EMEA",
    currency: "GBP",
    basePrice: 8400,
    promoPrice: 7140,
    renewalPrice: 7980,
    incentivePct: 10,
    distributorCost: 5460,
    resellerCost: 6300,
    contractTerm: 1,
    billingFrequency: "annual",
    description: "Self-service BI, dashboards, and data visualisation",
  },
  {
    sku: "AP-DL-012",
    name: "Data Lake Pro",
    productFamily: "Analytics Platform",
    vendor: "DataPulse Analytics",
    region: "Americas",
    currency: "USD",
    basePrice: 16800,
    promoPrice: 14280,
    renewalPrice: 15960,
    incentivePct: 12,
    distributorCost: 10920,
    resellerCost: 12600,
    contractTerm: 2,
    billingFrequency: "annual",
    description: "Petabyte-scale data lake with Spark and query engine",
  },
  {
    sku: "AP-RT-013",
    name: "Real-Time Streaming Analytics",
    productFamily: "Analytics Platform",
    vendor: "DataPulse Analytics",
    region: "APAC",
    currency: "USD",
    basePrice: 9600,
    promoPrice: 8160,
    renewalPrice: 9120,
    incentivePct: 8,
    distributorCost: 6240,
    resellerCost: 7200,
    contractTerm: 1,
    billingFrequency: "monthly",
    description: "Kafka-compatible real-time event streaming and analytics",
  },
  {
    sku: "AP-ML-014",
    name: "ML & AI Model Platform",
    productFamily: "Analytics Platform",
    vendor: "DataPulse Analytics",
    region: "EMEA",
    currency: "GBP",
    basePrice: 24000,
    promoPrice: 20400,
    renewalPrice: 22800,
    incentivePct: 15,
    distributorCost: 15600,
    resellerCost: 18000,
    contractTerm: 3,
    billingFrequency: "annual",
    description: "Enterprise MLOps platform with model registry and serving",
  },
  {
    sku: "AP-GOV-015",
    name: "Data Governance & Cataloguing",
    productFamily: "Analytics Platform",
    vendor: "DataPulse Analytics",
    region: "EMEA",
    currency: "GBP",
    basePrice: 6000,
    promoPrice: 5100,
    renewalPrice: 5700,
    incentivePct: 8,
    distributorCost: 3900,
    resellerCost: 4500,
    contractTerm: 1,
    billingFrequency: "annual",
    description:
      "Data catalogue, lineage, and governance for enterprise data estates",
  },
  {
    sku: "AP-ADV-016",
    name: "Advanced Reporting Add-On",
    productFamily: "Analytics Platform",
    vendor: "DataPulse Analytics",
    region: "Americas",
    currency: "USD",
    basePrice: 2400,
    promoPrice: 2040,
    renewalPrice: 2280,
    incentivePct: 5,
    distributorCost: 1560,
    resellerCost: 1800,
    contractTerm: 1,
    billingFrequency: "annual",
    description: "Pre-built executive report templates and scheduled delivery",
  },
];

export const PRODUCT_FAMILIES: ProductFamily[] = [
  "Security Suite",
  "Cloud Infrastructure",
  "Analytics Platform",
];

export const FAMILY_COLORS: Record<ProductFamily, string> = {
  "Security Suite": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Cloud Infrastructure": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Analytics Platform": "bg-purple-500/20 text-purple-300 border-purple-500/30",
};
