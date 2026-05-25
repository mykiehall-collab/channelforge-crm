// TODO-SECURITY: Remove before production. All data below is synthetic demo/test data only.

// ─── TYPE DEFINITIONS ────────────────────────────────────────────────────────

export interface DemoOrg {
  id: string;
  name: string;
  orgType: "Vendor" | "Distributor" | "Reseller" | "Customer";
  territory: string;
  owner: string;
  ownerId: string;
  logoPlaceholder: string;
  linkedVendors: string[];
  linkedDistributors: string[];
  linkedResellers: string[];
  linkedCustomers: string[];
  performanceMetrics: {
    qtd: number;
    qtdTarget: number;
    qoq: number;
    yoy: number;
    renewalValue: number;
    pipeline: number;
  };
  healthScore?: number;
  activeWorkflows: string[];
  contractValue?: number;
  renewalDate?: string;
  activeProducts?: string[];
}

export interface DemoOpportunity {
  id: string;
  title: string;
  accountId: string;
  accountName: string;
  ownerId: string;
  ownerName: string;
  stage:
    | "Prospecting"
    | "Qualification"
    | "Proposal"
    | "Negotiation"
    | "Closed Won"
    | "Closed Lost";
  value: number;
  forecastDate: string;
  linkedProducts: string[];
  quoteStatus: "None" | "Draft" | "Sent" | "Approved";
  dealRegistrationStatus:
    | "None"
    | "Pending"
    | "Approved"
    | "Rejected"
    | "Under Review";
  forgeAiInsight: string;
  assignedRoles: string[];
  isRenewal?: boolean;
}

export interface DemoCaseActivity {
  date: string;
  user: string;
  action: string;
}

export interface DemoCase {
  id: string;
  title: string;
  caseType:
    | "system-issue"
    | "pricing-issue"
    | "renewal-issue"
    | "access-issue"
    | "import-failure"
    | "customer-escalation"
    | "quote-issue"
    | "integration-issue";
  status: "Open" | "In Progress" | "Resolved" | "Escalated";
  priority: "Critical" | "High" | "Medium" | "Low";
  ownerId: string;
  ownerName: string;
  linkedOrgId: string;
  linkedOrgName: string;
  linkedAccountId: string;
  linkedAccountName: string;
  assignedTeam: string;
  sla: number;
  resolutionStatus: string;
  activityHistory: DemoCaseActivity[];
  assignedRoles: string[];
}

export interface DemoMdfRequest {
  id: string;
  campaignName: string;
  requestingOrgId: string;
  requestingOrgName: string;
  vendorId: string;
  distributorId: string;
  resellerId: string;
  requestedAmount: number;
  approvedAmount: number;
  status: "Pending" | "Approved" | "Rejected" | "In Progress" | "Complete";
  quarter: string;
  stakeholders: string[];
  agreedActions: string[];
  campaignResultsPlaceholder: string;
  assignedRoles: string[];
}

export interface DemoTask {
  id: string;
  title: string;
  taskType:
    | "callback"
    | "renewal-followup"
    | "quote-review"
    | "mdf-approval"
    | "pricing-check"
    | "account-update"
    | "case-resolution"
    | "campaign-review";
  dueDate: string;
  status: "Pending" | "In Progress" | "Completed" | "Overdue";
  priority: "Critical" | "High" | "Medium" | "Low";
  ownerId: string;
  ownerName: string;
  linkedEntityId: string;
  linkedEntityType: string;
  assignedRoles: string[];
}

export interface DemoDealRegistration {
  id: string;
  opportunityId: string;
  accountName: string;
  resellerName: string;
  vendorName: string;
  value: number;
  status: "Pending" | "Approved" | "Rejected" | "Under Review";
  submittedDate: string;
  slaDeadline: string;
  assignedApprover: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  assignedRoles: string[];
}

export interface DemoCalendarEvent {
  id: string;
  title: string;
  eventType:
    | "callback"
    | "renewal"
    | "case-sla"
    | "campaign"
    | "mdf-deadline"
    | "quote-deadline"
    | "meeting";
  date: Date;
  time: string;
  durationMins: number;
  status: "Upcoming" | "At Risk" | "Completed";
  linkedEntityId: string;
  linkedEntityType: string;
  assignedRoles: string[];
  color: string;
  description: string;
}

// ─── HELPER: date offset ──────────────────────────────────────────────────────
const d = (offsetDays: number): Date =>
  new Date(Date.now() + offsetDays * 86400000);
const ds = (offsetDays: number): string =>
  d(offsetDays).toISOString().split("T")[0];

// ─── VENDORS ─────────────────────────────────────────────────────────────────
// TODO-SECURITY: Remove before production.

export const DEMO_VENDORS: DemoOrg[] = [
  {
    id: "vendor-adobe",
    name: "Adobe Inc",
    orgType: "Vendor",
    territory: "Global",
    owner: "Sarah Chen",
    ownerId: "user-sarah",
    logoPlaceholder: "AD",
    linkedVendors: [],
    linkedDistributors: ["dist-atea", "dist-tdsynnex"],
    linkedResellers: ["res-nordic", "res-bluepeak"],
    linkedCustomers: ["cust-pharma", "cust-education"],
    performanceMetrics: {
      qtd: 1240000,
      qtdTarget: 1500000,
      qoq: 8.4,
      yoy: 14.2,
      renewalValue: 820000,
      pipeline: 3200000,
    },
    activeWorkflows: [
      "Q3 Partner Enablement Programme",
      "Adobe Sign EMEA Expansion",
      "Creative Cloud Education Push",
    ],
  },
  {
    id: "vendor-microsoft",
    name: "Microsoft Corporation",
    orgType: "Vendor",
    territory: "Global",
    owner: "James Miller",
    ownerId: "user-james",
    logoPlaceholder: "MS",
    linkedVendors: [],
    linkedDistributors: ["dist-ingram", "dist-crayon"],
    linkedResellers: ["res-sovereign", "res-futurestack"],
    linkedCustomers: ["cust-energy", "cust-education", "cust-city"],
    performanceMetrics: {
      qtd: 2850000,
      qtdTarget: 3000000,
      qoq: 11.2,
      yoy: 19.8,
      renewalValue: 1640000,
      pipeline: 7400000,
    },
    activeWorkflows: [
      "Azure Nordics Migration",
      "Microsoft 365 Renewal Drive Q3",
    ],
  },
  {
    id: "vendor-nvidia",
    name: "NVIDIA",
    orgType: "Vendor",
    territory: "Global",
    owner: "Emma Wilson",
    ownerId: "user-emma",
    logoPlaceholder: "NV",
    linkedVendors: [],
    linkedDistributors: ["dist-tdsynnex"],
    linkedResellers: ["res-resellergroup", "res-futurestack"],
    linkedCustomers: ["cust-desperado", "cust-city"],
    performanceMetrics: {
      qtd: 980000,
      qtdTarget: 1100000,
      qoq: 22.6,
      yoy: 38.4,
      renewalValue: 490000,
      pipeline: 2800000,
    },
    activeWorkflows: [
      "NVIDIA AI Suite EMEA Launch",
      "City Infrastructure AI Pilot",
    ],
  },
];

// ─── DISTRIBUTORS ─────────────────────────────────────────────────────────────
// TODO-SECURITY: Remove before production.

export const DEMO_DISTRIBUTORS: DemoOrg[] = [
  {
    id: "dist-atea",
    name: "ATEA Group",
    orgType: "Distributor",
    territory: "UK & Nordics",
    owner: "Tom Bradley",
    ownerId: "user-tom",
    logoPlaceholder: "AT",
    linkedVendors: ["vendor-adobe"],
    linkedDistributors: [],
    linkedResellers: ["res-nordic", "res-sovereign"],
    linkedCustomers: ["cust-education"],
    performanceMetrics: {
      qtd: 640000,
      qtdTarget: 750000,
      qoq: 5.2,
      yoy: 9.8,
      renewalValue: 380000,
      pipeline: 1450000,
    },
    healthScore: 82,
    activeWorkflows: [
      "ATEA Adobe Partner Enablement",
      "Nordic Reseller Activation Q3",
      "UK Education Account Review",
    ],
  },
  {
    id: "dist-crayon",
    name: "Crayon",
    orgType: "Distributor",
    territory: "Nordics",
    owner: "Alex Rodriguez",
    ownerId: "user-alex",
    logoPlaceholder: "CR",
    linkedVendors: ["vendor-microsoft"],
    linkedDistributors: [],
    linkedResellers: ["res-nordic", "res-resellergroup"],
    linkedCustomers: ["cust-energy"],
    performanceMetrics: {
      qtd: 510000,
      qtdTarget: 650000,
      qoq: -2.1,
      yoy: 6.3,
      renewalValue: 290000,
      pipeline: 1100000,
    },
    healthScore: 78,
    activeWorkflows: [
      "Crayon Microsoft 365 Nordic Drive",
      "Nordics Renewal Coverage Review",
    ],
  },
  {
    id: "dist-tdsynnex",
    name: "TD SYNNEX",
    orgType: "Distributor",
    territory: "EMEA & Americas",
    owner: "Rachel Kim",
    ownerId: "user-rachel",
    logoPlaceholder: "TD",
    linkedVendors: ["vendor-adobe", "vendor-nvidia"],
    linkedDistributors: [],
    linkedResellers: ["res-bluepeak", "res-futurestack"],
    linkedCustomers: ["cust-pharma", "cust-desperado"],
    performanceMetrics: {
      qtd: 1820000,
      qtdTarget: 2000000,
      qoq: 9.7,
      yoy: 21.5,
      renewalValue: 980000,
      pipeline: 4200000,
    },
    healthScore: 91,
    activeWorkflows: [
      "TD SYNNEX EMEA Growth Programme",
      "Adobe EMEA Distribution Expansion",
      "NVIDIA AI Distribution Launch",
    ],
  },
  {
    id: "dist-ingram",
    name: "Ingram Micro",
    orgType: "Distributor",
    territory: "EMEA",
    owner: "David Hughes",
    ownerId: "user-david",
    logoPlaceholder: "IM",
    linkedVendors: ["vendor-microsoft"],
    linkedDistributors: [],
    linkedResellers: ["res-sovereign", "res-bluepeak"],
    linkedCustomers: ["cust-city"],
    performanceMetrics: {
      qtd: 890000,
      qtdTarget: 1000000,
      qoq: 3.8,
      yoy: 12.1,
      renewalValue: 520000,
      pipeline: 2100000,
    },
    healthScore: 85,
    activeWorkflows: [
      "Ingram Microsoft EMEA Renewal Drive",
      "City Infrastructure Microsoft Account",
    ],
  },
];

// ─── RESELLERS ────────────────────────────────────────────────────────────────
// TODO-SECURITY: Remove before production.

export const DEMO_RESELLERS: DemoOrg[] = [
  {
    id: "res-nordic",
    name: "Nordic Cloud Solutions",
    orgType: "Reseller",
    territory: "Nordics",
    owner: "Sarah Chen",
    ownerId: "user-sarah",
    logoPlaceholder: "NC",
    linkedVendors: ["vendor-adobe", "vendor-microsoft"],
    linkedDistributors: ["dist-atea", "dist-crayon"],
    linkedResellers: [],
    linkedCustomers: ["cust-energy", "cust-education"],
    performanceMetrics: {
      qtd: 340000,
      qtdTarget: 450000,
      qoq: -4.3,
      yoy: 3.2,
      renewalValue: 220000,
      pipeline: 890000,
    },
    healthScore: 76,
    activeWorkflows: [
      "Q3 Renewal Drive Nordics",
      "Adobe Creative Cloud Education Upsell",
    ],
  },
  {
    id: "res-sovereign",
    name: "Sovereign Systems UK",
    orgType: "Reseller",
    territory: "UK",
    owner: "Tom Bradley",
    ownerId: "user-tom",
    logoPlaceholder: "SS",
    linkedVendors: ["vendor-microsoft"],
    linkedDistributors: ["dist-atea", "dist-ingram"],
    linkedResellers: [],
    linkedCustomers: ["cust-education", "cust-city"],
    performanceMetrics: {
      qtd: 520000,
      qtdTarget: 600000,
      qoq: 7.1,
      yoy: 16.4,
      renewalValue: 310000,
      pipeline: 1200000,
    },
    healthScore: 88,
    activeWorkflows: [
      "City Infrastructure Microsoft Azure",
      "UK Education Microsoft 365 Renewal",
    ],
  },
  {
    id: "res-bluepeak",
    name: "BluePeak Consulting",
    orgType: "Reseller",
    territory: "UK & EMEA",
    owner: "Emma Wilson",
    ownerId: "user-emma",
    logoPlaceholder: "BP",
    linkedVendors: ["vendor-adobe"],
    linkedDistributors: ["dist-tdsynnex", "dist-ingram"],
    linkedResellers: [],
    linkedCustomers: ["cust-pharma"],
    performanceMetrics: {
      qtd: 280000,
      qtdTarget: 400000,
      qoq: -8.2,
      yoy: 1.9,
      renewalValue: 180000,
      pipeline: 650000,
    },
    healthScore: 71,
    activeWorkflows: ["Global Pharma Adobe Analytics Renewal"],
  },
  {
    id: "res-futurestack",
    name: "FutureStack Technologies",
    orgType: "Reseller",
    territory: "EMEA",
    owner: "James Miller",
    ownerId: "user-james",
    logoPlaceholder: "FT",
    linkedVendors: ["vendor-nvidia", "vendor-microsoft"],
    linkedDistributors: ["dist-tdsynnex"],
    linkedResellers: [],
    linkedCustomers: ["cust-city", "cust-desperado"],
    performanceMetrics: {
      qtd: 620000,
      qtdTarget: 700000,
      qoq: 13.4,
      yoy: 29.1,
      renewalValue: 380000,
      pipeline: 1500000,
    },
    healthScore: 83,
    activeWorkflows: [
      "NVIDIA AI City Infrastructure Pilot",
      "Desperado NVIDIA Renewal",
      "FutureStack EMEA Expansion",
    ],
  },
  {
    id: "res-resellergroup",
    name: "Reseller Group North",
    orgType: "Reseller",
    territory: "Nordics & UK",
    owner: "Rachel Kim",
    ownerId: "user-rachel",
    logoPlaceholder: "RG",
    linkedVendors: ["vendor-nvidia"],
    linkedDistributors: ["dist-crayon"],
    linkedResellers: [],
    linkedCustomers: ["cust-energy"],
    performanceMetrics: {
      qtd: 120000,
      qtdTarget: 180000,
      qoq: -11.3,
      yoy: -2.4,
      renewalValue: 85000,
      pipeline: 340000,
    },
    healthScore: 67,
    activeWorkflows: ["Reseller Group North Activation Plan"],
  },
];

// ─── CUSTOMERS ────────────────────────────────────────────────────────────────
// TODO-SECURITY: Remove before production.

export const DEMO_CUSTOMERS: DemoOrg[] = [
  {
    id: "cust-desperado",
    name: "Desperado Ltd",
    orgType: "Customer",
    territory: "UK",
    owner: "Tom Bradley",
    ownerId: "user-tom",
    logoPlaceholder: "DL",
    linkedVendors: ["vendor-nvidia"],
    linkedDistributors: ["dist-tdsynnex"],
    linkedResellers: ["res-futurestack"],
    linkedCustomers: [],
    performanceMetrics: {
      qtd: 280000,
      qtdTarget: 280000,
      qoq: 0,
      yoy: 12.0,
      renewalValue: 280000,
      pipeline: 0,
    },
    contractValue: 280000,
    renewalDate: "Q2 2025",
    activeProducts: ["NVIDIA AI Suite"],
    activeWorkflows: ["NVIDIA AI Suite Renewal"],
  },
  {
    id: "cust-energy",
    name: "Nordic Energy Group",
    orgType: "Customer",
    territory: "Nordics",
    owner: "Sarah Chen",
    ownerId: "user-sarah",
    logoPlaceholder: "NE",
    linkedVendors: ["vendor-microsoft"],
    linkedDistributors: ["dist-crayon"],
    linkedResellers: ["res-nordic"],
    linkedCustomers: [],
    performanceMetrics: {
      qtd: 540000,
      qtdTarget: 540000,
      qoq: 4.2,
      yoy: 18.6,
      renewalValue: 540000,
      pipeline: 0,
    },
    contractValue: 540000,
    renewalDate: "Q3 2025",
    activeProducts: ["Microsoft 365", "Azure"],
    activeWorkflows: ["Microsoft 365 Q3 Renewal", "Azure Expansion Review"],
  },
  {
    id: "cust-education",
    name: "UK Education Trust",
    orgType: "Customer",
    territory: "UK",
    owner: "Emma Wilson",
    ownerId: "user-emma",
    logoPlaceholder: "UE",
    linkedVendors: ["vendor-adobe", "vendor-microsoft"],
    linkedDistributors: ["dist-atea"],
    linkedResellers: ["res-sovereign", "res-nordic"],
    linkedCustomers: [],
    performanceMetrics: {
      qtd: 320000,
      qtdTarget: 320000,
      qoq: 2.8,
      yoy: 7.4,
      renewalValue: 320000,
      pipeline: 0,
    },
    contractValue: 320000,
    activeProducts: ["Adobe Creative Cloud", "Microsoft 365"],
    activeWorkflows: [
      "Education Licence Renewal",
      "Adobe Volume Licence Review",
    ],
  },
  {
    id: "cust-pharma",
    name: "Global Pharma Holdings",
    orgType: "Customer",
    territory: "EMEA",
    owner: "Rachel Kim",
    ownerId: "user-rachel",
    logoPlaceholder: "GP",
    linkedVendors: ["vendor-adobe"],
    linkedDistributors: ["dist-tdsynnex"],
    linkedResellers: ["res-bluepeak"],
    linkedCustomers: [],
    performanceMetrics: {
      qtd: 780000,
      qtdTarget: 780000,
      qoq: 5.9,
      yoy: 11.3,
      renewalValue: 780000,
      pipeline: 0,
    },
    contractValue: 780000,
    activeProducts: ["Adobe Sign", "Adobe Analytics"],
    activeWorkflows: [
      "Global Pharma Analytics Renewal",
      "Adobe Sign Expansion",
    ],
  },
  {
    id: "cust-city",
    name: "City Infrastructure Authority",
    orgType: "Customer",
    territory: "UK",
    owner: "James Miller",
    ownerId: "user-james",
    logoPlaceholder: "CI",
    linkedVendors: ["vendor-microsoft", "vendor-nvidia"],
    linkedDistributors: ["dist-ingram"],
    linkedResellers: ["res-sovereign", "res-futurestack"],
    linkedCustomers: [],
    performanceMetrics: {
      qtd: 1100000,
      qtdTarget: 1100000,
      qoq: 8.3,
      yoy: 24.7,
      renewalValue: 1100000,
      pipeline: 0,
    },
    contractValue: 1100000,
    activeProducts: ["Microsoft Azure", "NVIDIA AI"],
    activeWorkflows: [
      "Azure Infrastructure Review",
      "NVIDIA AI City Expansion",
      "Q3 Renewal Governance",
    ],
  },
];

// ─── OPPORTUNITIES ────────────────────────────────────────────────────────────
// TODO-SECURITY: Remove before production.

export const DEMO_OPPORTUNITIES: DemoOpportunity[] = [
  // Sales Rep / Account Manager opportunities (6)
  {
    id: "opp-001",
    title: "Desperado NVIDIA AI Suite Expansion",
    accountId: "cust-desperado",
    accountName: "Desperado Ltd",
    ownerId: "user-sarah",
    ownerName: "Sarah Chen",
    stage: "Proposal",
    value: 85000,
    forecastDate: ds(45),
    linkedProducts: ["NVIDIA AI Suite Pro"],
    quoteStatus: "Sent",
    dealRegistrationStatus: "Approved",
    forgeAiInsight:
      "Decision maker engagement increased. Proposal viewed 3 times this week.",
    assignedRoles: ["salesRep", "accountManager"],
  },
  {
    id: "opp-002",
    title: "Nordic Energy Microsoft 365 Upsell",
    accountId: "cust-energy",
    accountName: "Nordic Energy Group",
    ownerId: "user-sarah",
    ownerName: "Sarah Chen",
    stage: "Negotiation",
    value: 120000,
    forecastDate: ds(18),
    linkedProducts: ["Microsoft 365 E5"],
    quoteStatus: "Approved",
    dealRegistrationStatus: "Approved",
    forgeAiInsight:
      "Customer has requested final pricing. Close within 2 weeks recommended.",
    assignedRoles: ["salesRep", "accountManager"],
    isRenewal: false,
  },
  {
    id: "opp-003",
    title: "UK Education Adobe CC Campus Licence",
    accountId: "cust-education",
    accountName: "UK Education Trust",
    ownerId: "user-emma",
    ownerName: "Emma Wilson",
    stage: "Qualification",
    value: 65000,
    forecastDate: ds(60),
    linkedProducts: ["Adobe Creative Cloud All Apps"],
    quoteStatus: "Draft",
    dealRegistrationStatus: "Pending",
    forgeAiInsight:
      "Budget confirmation pending. Follow up with finance contact before month end.",
    assignedRoles: ["salesRep", "accountManager"],
  },
  {
    id: "opp-004",
    title: "City Infrastructure Azure Migration",
    accountId: "cust-city",
    accountName: "City Infrastructure Authority",
    ownerId: "user-james",
    ownerName: "James Miller",
    stage: "Prospecting",
    value: 240000,
    forecastDate: ds(90),
    linkedProducts: ["Microsoft Azure", "Azure Security"],
    quoteStatus: "None",
    dealRegistrationStatus: "None",
    forgeAiInsight:
      "Similar orgs in this territory have expanded Azure by 35% this year.",
    assignedRoles: ["salesRep", "accountManager"],
  },
  {
    id: "opp-005",
    title: "Global Pharma Adobe Analytics Upgrade",
    accountId: "cust-pharma",
    accountName: "Global Pharma Holdings",
    ownerId: "user-rachel",
    ownerName: "Rachel Kim",
    stage: "Proposal",
    value: 180000,
    forecastDate: ds(30),
    linkedProducts: ["Adobe Analytics Ultimate", "Adobe Audience Manager"],
    quoteStatus: "Sent",
    dealRegistrationStatus: "Approved",
    forgeAiInsight:
      "Proposal has been open for 9 days. Recommend a follow-up call this week.",
    assignedRoles: ["salesRep", "accountManager"],
  },
  {
    id: "opp-006",
    title: "Sovereign Systems Microsoft Teams Rooms",
    accountId: "res-sovereign",
    accountName: "Sovereign Systems UK",
    ownerId: "user-tom",
    ownerName: "Tom Bradley",
    stage: "Qualification",
    value: 95000,
    forecastDate: ds(55),
    linkedProducts: ["Microsoft Teams Rooms", "Surface Hub"],
    quoteStatus: "Draft",
    dealRegistrationStatus: "None",
    forgeAiInsight:
      "Reseller shows strong intent signals. Recommend co-sell motion with Microsoft.",
    assignedRoles: ["salesRep", "accountManager"],
  },
  // Renewal Specialist opportunities (4)
  {
    id: "opp-007",
    title: "Nordic Energy Group Microsoft 365 Renewal",
    accountId: "cust-energy",
    accountName: "Nordic Energy Group",
    ownerId: "user-sarah",
    ownerName: "Sarah Chen",
    stage: "Negotiation",
    value: 310000,
    forecastDate: ds(25),
    linkedProducts: ["Microsoft 365 E3", "Microsoft 365 E5"],
    quoteStatus: "Sent",
    dealRegistrationStatus: "Approved",
    forgeAiInsight:
      "Renewal at risk — no engagement in 12 days. Immediate outreach required.",
    assignedRoles: ["renewalSpecialist", "accountManager"],
    isRenewal: true,
  },
  {
    id: "opp-008",
    title: "Desperado NVIDIA AI Suite Renewal",
    accountId: "cust-desperado",
    accountName: "Desperado Ltd",
    ownerId: "user-tom",
    ownerName: "Tom Bradley",
    stage: "Negotiation",
    value: 280000,
    forecastDate: ds(14),
    linkedProducts: ["NVIDIA AI Suite"],
    quoteStatus: "Approved",
    dealRegistrationStatus: "Approved",
    forgeAiInsight:
      "Contract expires in 14 days. Quote approved — awaiting customer signature.",
    assignedRoles: ["renewalSpecialist", "accountManager"],
    isRenewal: true,
  },
  {
    id: "opp-009",
    title: "UK Education Trust Adobe Creative Cloud Renewal",
    accountId: "cust-education",
    accountName: "UK Education Trust",
    ownerId: "user-emma",
    ownerName: "Emma Wilson",
    stage: "Negotiation",
    value: 195000,
    forecastDate: ds(35),
    linkedProducts: ["Adobe Creative Cloud All Apps"],
    quoteStatus: "Sent",
    dealRegistrationStatus: "Approved",
    forgeAiInsight:
      "Education sector renewals are closing 18% faster this quarter. Push for early close.",
    assignedRoles: ["renewalSpecialist", "accountManager"],
    isRenewal: true,
  },
  {
    id: "opp-010",
    title: "Global Pharma Adobe Sign Renewal",
    accountId: "cust-pharma",
    accountName: "Global Pharma Holdings",
    ownerId: "user-rachel",
    ownerName: "Rachel Kim",
    stage: "Negotiation",
    value: 420000,
    forecastDate: ds(40),
    linkedProducts: ["Adobe Sign Enterprise"],
    quoteStatus: "Draft",
    dealRegistrationStatus: "Pending",
    forgeAiInsight:
      "Legal review still pending. Chase legal team — quote must be sent by end of week.",
    assignedRoles: ["renewalSpecialist", "dealDesk"],
    isRenewal: true,
  },
  // Account Manager strategic accounts (3)
  {
    id: "opp-011",
    title: "City Infrastructure Strategic Expansion",
    accountId: "cust-city",
    accountName: "City Infrastructure Authority",
    ownerId: "user-james",
    ownerName: "James Miller",
    stage: "Proposal",
    value: 680000,
    forecastDate: ds(75),
    linkedProducts: ["Microsoft Azure Enterprise", "NVIDIA AI Platform"],
    quoteStatus: "Draft",
    dealRegistrationStatus: "Pending",
    forgeAiInsight:
      "Strategic account. Key stakeholder alignment required before proposal submission.",
    assignedRoles: ["accountManager", "leadership"],
  },
  {
    id: "opp-012",
    title: "Global Pharma Multi-Product Expansion",
    accountId: "cust-pharma",
    accountName: "Global Pharma Holdings",
    ownerId: "user-rachel",
    ownerName: "Rachel Kim",
    stage: "Qualification",
    value: 520000,
    forecastDate: ds(80),
    linkedProducts: ["Adobe Experience Cloud", "Adobe Analytics", "Adobe Sign"],
    quoteStatus: "None",
    dealRegistrationStatus: "None",
    forgeAiInsight:
      "Multi-year deal potential identified. Schedule executive-level discovery session.",
    assignedRoles: ["accountManager", "leadership"],
  },
  {
    id: "opp-013",
    title: "Nordic Energy Azure Full Migration",
    accountId: "cust-energy",
    accountName: "Nordic Energy Group",
    ownerId: "user-sarah",
    ownerName: "Sarah Chen",
    stage: "Prospecting",
    value: 390000,
    forecastDate: ds(120),
    linkedProducts: [
      "Microsoft Azure",
      "Azure DevOps",
      "Azure Security Centre",
    ],
    quoteStatus: "None",
    dealRegistrationStatus: "None",
    forgeAiInsight:
      "Azure adoption is accelerating in energy sector. Early engagement recommended.",
    assignedRoles: ["accountManager"],
  },
  // Deal Desk (3)
  {
    id: "opp-014",
    title: "BluePeak Adobe Enterprise Agreement",
    accountId: "res-bluepeak",
    accountName: "BluePeak Consulting",
    ownerId: "user-emma",
    ownerName: "Emma Wilson",
    stage: "Proposal",
    value: 155000,
    forecastDate: ds(22),
    linkedProducts: ["Adobe Experience Cloud", "Adobe Analytics"],
    quoteStatus: "Sent",
    dealRegistrationStatus: "Pending",
    forgeAiInsight:
      "Deal registration pending approval for 6 days. SLA at risk.",
    assignedRoles: ["dealDesk", "accountManager"],
  },
  {
    id: "opp-015",
    title: "FutureStack NVIDIA Bulk Order",
    accountId: "res-futurestack",
    accountName: "FutureStack Technologies",
    ownerId: "user-james",
    ownerName: "James Miller",
    stage: "Negotiation",
    value: 310000,
    forecastDate: ds(10),
    linkedProducts: ["NVIDIA A100", "NVIDIA RTX Pro"],
    quoteStatus: "Approved",
    dealRegistrationStatus: "Under Review",
    forgeAiInsight:
      "Margin at 18% — below threshold. Approval escalation needed.",
    assignedRoles: ["dealDesk", "salesRep"],
  },
  {
    id: "opp-016",
    title: "Ingram Micro Microsoft CSP Bundle",
    accountId: "dist-ingram",
    accountName: "Ingram Micro",
    ownerId: "user-david",
    ownerName: "David Hughes",
    stage: "Proposal",
    value: 220000,
    forecastDate: ds(28),
    linkedProducts: ["Microsoft CSP", "Microsoft Azure Plan"],
    quoteStatus: "Sent",
    dealRegistrationStatus: "Pending",
    forgeAiInsight:
      "Duplicate deal registration risk detected — check similar submissions from Crayon.",
    assignedRoles: ["dealDesk"],
  },
  // Leadership high-value (3)
  {
    id: "opp-017",
    title: "City Infrastructure Full Stack Renewal",
    accountId: "cust-city",
    accountName: "City Infrastructure Authority",
    ownerId: "user-james",
    ownerName: "James Miller",
    stage: "Negotiation",
    value: 1100000,
    forecastDate: ds(50),
    linkedProducts: [
      "Microsoft Azure Enterprise",
      "NVIDIA AI Platform",
      "Azure Security",
    ],
    quoteStatus: "Sent",
    dealRegistrationStatus: "Approved",
    forgeAiInsight:
      "Largest renewal this quarter. Executive sponsorship confirmed. High close probability.",
    assignedRoles: ["leadership", "accountManager", "renewalSpecialist"],
    isRenewal: true,
  },
  {
    id: "opp-018",
    title: "Global Pharma Adobe Enterprise Renewal",
    accountId: "cust-pharma",
    accountName: "Global Pharma Holdings",
    ownerId: "user-rachel",
    ownerName: "Rachel Kim",
    stage: "Proposal",
    value: 780000,
    forecastDate: ds(42),
    linkedProducts: ["Adobe Experience Cloud", "Adobe Sign", "Adobe Analytics"],
    quoteStatus: "Draft",
    dealRegistrationStatus: "Pending",
    forgeAiInsight:
      "Multi-product renewal at risk. Legal review delayed by 3 weeks.",
    assignedRoles: ["leadership", "dealDesk"],
    isRenewal: true,
  },
  {
    id: "opp-019",
    title: "Nordic Energy Microsoft Full Suite",
    accountId: "cust-energy",
    accountName: "Nordic Energy Group",
    ownerId: "user-sarah",
    ownerName: "Sarah Chen",
    stage: "Qualification",
    value: 540000,
    forecastDate: ds(65),
    linkedProducts: ["Microsoft 365 E5", "Azure", "Microsoft Defender"],
    quoteStatus: "None",
    dealRegistrationStatus: "None",
    forgeAiInsight:
      "Security posture expansion identified as primary driver. Align Defender proposal.",
    assignedRoles: ["leadership", "salesRep"],
  },
  // Distributed remaining
  {
    id: "opp-020",
    title: "Reseller Group North NVIDIA AI Pilot",
    accountId: "res-resellergroup",
    accountName: "Reseller Group North",
    ownerId: "user-rachel",
    ownerName: "Rachel Kim",
    stage: "Prospecting",
    value: 72000,
    forecastDate: ds(90),
    linkedProducts: ["NVIDIA AI Starter Pack"],
    quoteStatus: "None",
    dealRegistrationStatus: "None",
    forgeAiInsight:
      "Reseller has no activity in 28 days. Re-engagement call recommended.",
    assignedRoles: ["resellerManager", "salesRep"],
  },
  {
    id: "opp-021",
    title: "ATEA Adobe Partner Expansion",
    accountId: "dist-atea",
    accountName: "ATEA Group",
    ownerId: "user-tom",
    ownerName: "Tom Bradley",
    stage: "Qualification",
    value: 195000,
    forecastDate: ds(50),
    linkedProducts: ["Adobe Creative Cloud Volume"],
    quoteStatus: "Draft",
    dealRegistrationStatus: "None",
    forgeAiInsight:
      "ATEA pipeline is tracking 12% ahead of YoY target in UK territory.",
    assignedRoles: ["distributorManager", "accountManager"],
  },
  {
    id: "opp-022",
    title: "Crayon Microsoft Volume Licence Renewal",
    accountId: "dist-crayon",
    accountName: "Crayon",
    ownerId: "user-alex",
    ownerName: "Alex Rodriguez",
    stage: "Negotiation",
    value: 480000,
    forecastDate: ds(20),
    linkedProducts: ["Microsoft Volume Licensing", "Microsoft CSP"],
    quoteStatus: "Sent",
    dealRegistrationStatus: "Approved",
    forgeAiInsight:
      "Crayon QoQ performance is down 2%. Renewal close will reverse trend.",
    assignedRoles: ["distributorManager", "renewalSpecialist"],
    isRenewal: true,
  },
  {
    id: "opp-023",
    title: "BluePeak Q4 Adobe Partnership Growth",
    accountId: "res-bluepeak",
    accountName: "BluePeak Consulting",
    ownerId: "user-emma",
    ownerName: "Emma Wilson",
    stage: "Prospecting",
    value: 110000,
    forecastDate: ds(100),
    linkedProducts: ["Adobe Document Cloud", "Adobe Acrobat"],
    quoteStatus: "None",
    dealRegistrationStatus: "None",
    forgeAiInsight:
      "BluePeak health score at 71%. Growth programme may improve performance metrics.",
    assignedRoles: ["resellerManager", "salesOps"],
  },
  {
    id: "opp-024",
    title: "TD SYNNEX NVIDIA EMEA Distribution",
    accountId: "dist-tdsynnex",
    accountName: "TD SYNNEX",
    ownerId: "user-rachel",
    ownerName: "Rachel Kim",
    stage: "Proposal",
    value: 650000,
    forecastDate: ds(35),
    linkedProducts: ["NVIDIA A100", "NVIDIA RTX Pro", "NVIDIA AI Enterprise"],
    quoteStatus: "Sent",
    dealRegistrationStatus: "Approved",
    forgeAiInsight:
      "TD SYNNEX pipeline is strongest performer in EMEA this quarter.",
    assignedRoles: ["distributorManager", "leadership", "dealDesk"],
  },
  {
    id: "opp-025",
    title: "FutureStack City Infrastructure NVIDIA Expansion",
    accountId: "cust-city",
    accountName: "City Infrastructure Authority",
    ownerId: "user-james",
    ownerName: "James Miller",
    stage: "Qualification",
    value: 290000,
    forecastDate: ds(70),
    linkedProducts: ["NVIDIA AI Platform", "NVIDIA Networking"],
    quoteStatus: "None",
    dealRegistrationStatus: "None",
    forgeAiInsight:
      "City Infrastructure AI spend forecast up 24% YoY. Expansion timing is optimal.",
    assignedRoles: ["salesRep", "accountManager", "resellerManager"],
  },
];

// ─── CASES ────────────────────────────────────────────────────────────────────
// TODO-SECURITY: Remove before production.

export const DEMO_CASES: DemoCase[] = [
  // IT cases (5)
  {
    id: "CASE-0101",
    title: "CRM Data Import Failure — Nordic Cloud Solutions CSV",
    caseType: "import-failure",
    status: "Open",
    priority: "High",
    ownerId: "user-it01",
    ownerName: "Mark Evans",
    linkedOrgId: "res-nordic",
    linkedOrgName: "Nordic Cloud Solutions",
    linkedAccountId: "cust-energy",
    linkedAccountName: "Nordic Energy Group",
    assignedTeam: "IT Operations",
    sla: 8,
    resolutionStatus: "Pending",
    activityHistory: [
      {
        date: ds(-2),
        user: "Mark Evans",
        action:
          "Case opened. Import failure detected on customer account sync.",
      },
      {
        date: ds(-1),
        user: "System",
        action: "Auto-retry failed. Manual review required.",
      },
    ],
    assignedRoles: ["itOperations", "salesOps"],
  },
  {
    id: "CASE-0102",
    title: "API Sync Failure — Microsoft 365 Integration",
    caseType: "integration-issue",
    status: "In Progress",
    priority: "Critical",
    ownerId: "user-it01",
    ownerName: "Mark Evans",
    linkedOrgId: "vendor-microsoft",
    linkedOrgName: "Microsoft Corporation",
    linkedAccountId: "cust-city",
    linkedAccountName: "City Infrastructure Authority",
    assignedTeam: "IT Operations",
    sla: 4,
    resolutionStatus: "In Progress",
    activityHistory: [
      {
        date: ds(-3),
        user: "Mark Evans",
        action: "Integration sync error detected. Microsoft API returning 503.",
      },
      {
        date: ds(-3),
        user: "Mark Evans",
        action: "Escalated to integration team. Vendor notified.",
      },
      {
        date: ds(-1),
        user: "Alice Park",
        action: "Root cause identified — OAuth token expiry. Fix in progress.",
      },
    ],
    assignedRoles: ["itOperations"],
  },
  {
    id: "CASE-0103",
    title: "System Outage — Dashboard Reporting Service Unavailable",
    caseType: "system-issue",
    status: "Escalated",
    priority: "Critical",
    ownerId: "user-it01",
    ownerName: "Mark Evans",
    linkedOrgId: "vendor-adobe",
    linkedOrgName: "Adobe Inc",
    linkedAccountId: "cust-pharma",
    linkedAccountName: "Global Pharma Holdings",
    assignedTeam: "IT Operations",
    sla: 2,
    resolutionStatus: "Escalated to Vendor",
    activityHistory: [
      {
        date: ds(-1),
        user: "Mark Evans",
        action:
          "Reporting service down for Adobe Analytics. Impacting 3 accounts.",
      },
      {
        date: ds(-1),
        user: "Sarah Chen",
        action: "Escalated to Adobe support. SLA breach imminent.",
      },
    ],
    assignedRoles: ["itOperations", "leadership"],
  },
  {
    id: "CASE-0104",
    title: "Access Request — New User Provisioning Delay",
    caseType: "access-issue",
    status: "In Progress",
    priority: "Medium",
    ownerId: "user-it01",
    ownerName: "Mark Evans",
    linkedOrgId: "res-sovereign",
    linkedOrgName: "Sovereign Systems UK",
    linkedAccountId: "cust-city",
    linkedAccountName: "City Infrastructure Authority",
    assignedTeam: "IT Operations",
    sla: 24,
    resolutionStatus: "Pending Admin Approval",
    activityHistory: [
      {
        date: ds(-2),
        user: "Mark Evans",
        action: "3 new users provisioning request received.",
      },
      {
        date: ds(-1),
        user: "Mark Evans",
        action: "Awaiting Primary Admin approval.",
      },
    ],
    assignedRoles: ["itOperations"],
  },
  {
    id: "CASE-0105",
    title: "Failed Import — Opportunity Data Mismatch",
    caseType: "import-failure",
    status: "Open",
    priority: "High",
    ownerId: "user-it01",
    ownerName: "Mark Evans",
    linkedOrgId: "dist-ingram",
    linkedOrgName: "Ingram Micro",
    linkedAccountId: "cust-city",
    linkedAccountName: "City Infrastructure Authority",
    assignedTeam: "IT Operations",
    sla: 8,
    resolutionStatus: "Pending",
    activityHistory: [
      {
        date: ds(-1),
        user: "Mark Evans",
        action: "Opportunity import failed — SKU mismatch on 14 records.",
      },
    ],
    assignedRoles: ["itOperations", "salesOps"],
  },
  // Leadership escalations (3)
  {
    id: "CASE-0106",
    title: "Customer Escalation — Global Pharma Contract Dispute",
    caseType: "customer-escalation",
    status: "Escalated",
    priority: "Critical",
    ownerId: "user-rachel",
    ownerName: "Rachel Kim",
    linkedOrgId: "res-bluepeak",
    linkedOrgName: "BluePeak Consulting",
    linkedAccountId: "cust-pharma",
    linkedAccountName: "Global Pharma Holdings",
    assignedTeam: "Leadership",
    sla: 4,
    resolutionStatus: "Under Executive Review",
    activityHistory: [
      {
        date: ds(-4),
        user: "Rachel Kim",
        action:
          "Customer raised formal contract dispute on Adobe Sign pricing.",
      },
      {
        date: ds(-3),
        user: "James Miller",
        action: "Executive review initiated. Legal team engaged.",
      },
      {
        date: ds(-1),
        user: "Rachel Kim",
        action: "Resolution proposal drafted. Awaiting customer response.",
      },
    ],
    assignedRoles: ["leadership", "dealDesk"],
  },
  {
    id: "CASE-0107",
    title: "Customer Escalation — City Infrastructure SLA Breach",
    caseType: "customer-escalation",
    status: "In Progress",
    priority: "Critical",
    ownerId: "user-james",
    ownerName: "James Miller",
    linkedOrgId: "dist-ingram",
    linkedOrgName: "Ingram Micro",
    linkedAccountId: "cust-city",
    linkedAccountName: "City Infrastructure Authority",
    assignedTeam: "Account Management",
    sla: 2,
    resolutionStatus: "In Progress",
    activityHistory: [
      {
        date: ds(-2),
        user: "James Miller",
        action: "City Infrastructure raised SLA breach on Azure support.",
      },
      {
        date: ds(-1),
        user: "Tom Bradley",
        action: "Emergency call scheduled. Microsoft engaged.",
      },
    ],
    assignedRoles: ["leadership", "accountManager"],
  },
  {
    id: "CASE-0108",
    title: "Strategic Account Review — Nordic Energy Renewal Risk",
    caseType: "renewal-issue",
    status: "Open",
    priority: "High",
    ownerId: "user-sarah",
    ownerName: "Sarah Chen",
    linkedOrgId: "dist-crayon",
    linkedOrgName: "Crayon",
    linkedAccountId: "cust-energy",
    linkedAccountName: "Nordic Energy Group",
    assignedTeam: "Leadership",
    sla: 24,
    resolutionStatus: "Pending",
    activityHistory: [
      {
        date: ds(-3),
        user: "Sarah Chen",
        action: "Nordic Energy renewal at risk — contact not responding.",
      },
    ],
    assignedRoles: ["leadership", "renewalSpecialist"],
  },
  // Sales Rep cases (2)
  {
    id: "CASE-0109",
    title: "Renewal Issue — Desperado Ltd Contract Gap",
    caseType: "renewal-issue",
    status: "In Progress",
    priority: "High",
    ownerId: "user-tom",
    ownerName: "Tom Bradley",
    linkedOrgId: "res-futurestack",
    linkedOrgName: "FutureStack Technologies",
    linkedAccountId: "cust-desperado",
    linkedAccountName: "Desperado Ltd",
    assignedTeam: "Sales",
    sla: 48,
    resolutionStatus: "In Progress",
    activityHistory: [
      {
        date: ds(-5),
        user: "Tom Bradley",
        action:
          "Renewal quote not accepted. Customer requesting revised pricing.",
      },
      {
        date: ds(-2),
        user: "Tom Bradley",
        action: "New quote prepared and submitted.",
      },
    ],
    assignedRoles: ["salesRep", "renewalSpecialist"],
  },
  {
    id: "CASE-0110",
    title: "Quote Issue — UK Education Trust Pricing Error",
    caseType: "quote-issue",
    status: "Open",
    priority: "Medium",
    ownerId: "user-emma",
    ownerName: "Emma Wilson",
    linkedOrgId: "dist-atea",
    linkedOrgName: "ATEA Group",
    linkedAccountId: "cust-education",
    linkedAccountName: "UK Education Trust",
    assignedTeam: "Sales",
    sla: 24,
    resolutionStatus: "Pending Correction",
    activityHistory: [
      {
        date: ds(-1),
        user: "Emma Wilson",
        action:
          "Quote sent with incorrect education pricing. Correction required.",
      },
    ],
    assignedRoles: ["salesRep", "dealDesk"],
  },
  // Deal Desk cases (2)
  {
    id: "CASE-0111",
    title: "Pricing Issue — FutureStack NVIDIA Margin Exception",
    caseType: "pricing-issue",
    status: "In Progress",
    priority: "High",
    ownerId: "user-james",
    ownerName: "James Miller",
    linkedOrgId: "res-futurestack",
    linkedOrgName: "FutureStack Technologies",
    linkedAccountId: "res-futurestack",
    linkedAccountName: "FutureStack Technologies",
    assignedTeam: "Deal Desk",
    sla: 8,
    resolutionStatus: "Awaiting VP Approval",
    activityHistory: [
      {
        date: ds(-2),
        user: "James Miller",
        action:
          "Margin exception request submitted — 18% below standard threshold.",
      },
      {
        date: ds(-1),
        user: "Rachel Kim",
        action: "Escalated to VP approval queue.",
      },
    ],
    assignedRoles: ["dealDesk", "leadership"],
  },
  {
    id: "CASE-0112",
    title: "Quote Issue — Crayon Volume Licence Discount Dispute",
    caseType: "quote-issue",
    status: "Open",
    priority: "Medium",
    ownerId: "user-alex",
    ownerName: "Alex Rodriguez",
    linkedOrgId: "dist-crayon",
    linkedOrgName: "Crayon",
    linkedAccountId: "cust-energy",
    linkedAccountName: "Nordic Energy Group",
    assignedTeam: "Deal Desk",
    sla: 16,
    resolutionStatus: "Pending Review",
    activityHistory: [
      {
        date: ds(-1),
        user: "Alex Rodriguez",
        action: "Distributor disputing volume discount tier applied to quote.",
      },
    ],
    assignedRoles: ["dealDesk", "salesRep"],
  },
  // Additional distributed cases
  {
    id: "CASE-0113",
    title: "Access Issue — BluePeak Channel Link Permissions",
    caseType: "access-issue",
    status: "Resolved",
    priority: "Low",
    ownerId: "user-emma",
    ownerName: "Emma Wilson",
    linkedOrgId: "res-bluepeak",
    linkedOrgName: "BluePeak Consulting",
    linkedAccountId: "cust-pharma",
    linkedAccountName: "Global Pharma Holdings",
    assignedTeam: "IT Operations",
    sla: 24,
    resolutionStatus: "Resolved",
    activityHistory: [
      {
        date: ds(-7),
        user: "Emma Wilson",
        action: "Access permission conflict resolved. Channel link updated.",
      },
    ],
    assignedRoles: ["itOperations", "accountManager"],
  },
  {
    id: "CASE-0114",
    title: "Integration Issue — Ingram Micro ERP Sync Delay",
    caseType: "integration-issue",
    status: "In Progress",
    priority: "High",
    ownerId: "user-david",
    ownerName: "David Hughes",
    linkedOrgId: "dist-ingram",
    linkedOrgName: "Ingram Micro",
    linkedAccountId: "cust-city",
    linkedAccountName: "City Infrastructure Authority",
    assignedTeam: "IT Operations",
    sla: 8,
    resolutionStatus: "In Progress",
    activityHistory: [
      {
        date: ds(-2),
        user: "David Hughes",
        action:
          "ERP sync delay affecting order processing for City Infrastructure.",
      },
      {
        date: ds(-1),
        user: "Mark Evans",
        action: "API throttling identified. Adjusting sync frequency.",
      },
    ],
    assignedRoles: ["itOperations", "distributorManager"],
  },
  {
    id: "CASE-0115",
    title: "System Issue — Dashboard KPI Data Refresh Failure",
    caseType: "system-issue",
    status: "Open",
    priority: "Medium",
    ownerId: "user-it01",
    ownerName: "Mark Evans",
    linkedOrgId: "vendor-adobe",
    linkedOrgName: "Adobe Inc",
    linkedAccountId: "cust-pharma",
    linkedAccountName: "Global Pharma Holdings",
    assignedTeam: "IT Operations",
    sla: 16,
    resolutionStatus: "Pending",
    activityHistory: [
      {
        date: ds(-1),
        user: "Mark Evans",
        action:
          "KPI tiles showing stale data. Cache invalidation investigation started.",
      },
    ],
    assignedRoles: ["itOperations"],
  },
];

// ─── MDF REQUESTS ─────────────────────────────────────────────────────────────
// TODO-SECURITY: Remove before production.

export const DEMO_MDF_REQUESTS: DemoMdfRequest[] = [
  // Marketing (4)
  {
    id: "MDF-0201",
    campaignName: "Adobe Creative Cloud Nordic Demand Generation",
    requestingOrgId: "res-nordic",
    requestingOrgName: "Nordic Cloud Solutions",
    vendorId: "vendor-adobe",
    distributorId: "dist-atea",
    resellerId: "res-nordic",
    requestedAmount: 45000,
    approvedAmount: 38000,
    status: "Approved",
    quarter: "Q3 2025",
    stakeholders: ["Sarah Chen", "Tom Bradley", "Nordic Marketing Lead"],
    agreedActions: [
      "Digital campaign launch",
      "Reseller webinar series",
      "Customer case study creation",
    ],
    campaignResultsPlaceholder: "Results to be reported at end of Q3 2025.",
    assignedRoles: ["marketing", "partnerMarketing", "leadership"],
  },
  {
    id: "MDF-0202",
    campaignName: "Sovereign Systems UK Microsoft Partner Event",
    requestingOrgId: "res-sovereign",
    requestingOrgName: "Sovereign Systems UK",
    vendorId: "vendor-microsoft",
    distributorId: "dist-atea",
    resellerId: "res-sovereign",
    requestedAmount: 28000,
    approvedAmount: 0,
    status: "Pending",
    quarter: "Q3 2025",
    stakeholders: ["Tom Bradley", "Emma Wilson", "Microsoft Channel Team"],
    agreedActions: [
      "Partner summit sponsorship",
      "Customer invitation campaign",
      "Demo environment setup",
    ],
    campaignResultsPlaceholder: "Pending approval.",
    assignedRoles: ["marketing", "dealDesk", "partnerMarketing"],
  },
  {
    id: "MDF-0203",
    campaignName: "BluePeak Adobe Experience Cloud EMEA Campaign",
    requestingOrgId: "res-bluepeak",
    requestingOrgName: "BluePeak Consulting",
    vendorId: "vendor-adobe",
    distributorId: "dist-tdsynnex",
    resellerId: "res-bluepeak",
    requestedAmount: 62000,
    approvedAmount: 50000,
    status: "In Progress",
    quarter: "Q2 2025",
    stakeholders: ["Emma Wilson", "Rachel Kim", "BluePeak Marketing"],
    agreedActions: [
      "EMEA digital advertising",
      "Content asset creation",
      "Pharma sector outreach",
    ],
    campaignResultsPlaceholder:
      "Campaign running. Interim results due end of month.",
    assignedRoles: ["marketing", "finance", "partnerMarketing"],
  },
  {
    id: "MDF-0204",
    campaignName: "FutureStack NVIDIA AI Awareness Campaign",
    requestingOrgId: "res-futurestack",
    requestingOrgName: "FutureStack Technologies",
    vendorId: "vendor-nvidia",
    distributorId: "dist-tdsynnex",
    resellerId: "res-futurestack",
    requestedAmount: 80000,
    approvedAmount: 0,
    status: "Pending",
    quarter: "Q3 2025",
    stakeholders: ["James Miller", "Rachel Kim", "NVIDIA Marketing"],
    agreedActions: [
      "AI thought leadership content",
      "City sector roundtable",
      "Awareness media buy",
    ],
    campaignResultsPlaceholder: "Awaiting approval.",
    assignedRoles: ["marketing", "dealDesk"],
  },
  // Leadership (2)
  {
    id: "MDF-0205",
    campaignName: "EMEA Partner Summit — Strategic MDF Allocation",
    requestingOrgId: "dist-tdsynnex",
    requestingOrgName: "TD SYNNEX",
    vendorId: "vendor-adobe",
    distributorId: "dist-tdsynnex",
    resellerId: "",
    requestedAmount: 150000,
    approvedAmount: 130000,
    status: "Approved",
    quarter: "Q3 2025",
    stakeholders: ["Rachel Kim", "James Miller", "Adobe VP EMEA"],
    agreedActions: [
      "Annual partner summit",
      "Executive keynote content",
      "Partner awards ceremony",
    ],
    campaignResultsPlaceholder:
      "Event scheduled for Q3. Full ROI report post-event.",
    assignedRoles: ["leadership", "marketing", "finance"],
  },
  {
    id: "MDF-0206",
    campaignName: "Microsoft Nordic Growth Fund Q3",
    requestingOrgId: "dist-crayon",
    requestingOrgName: "Crayon",
    vendorId: "vendor-microsoft",
    distributorId: "dist-crayon",
    resellerId: "",
    requestedAmount: 95000,
    approvedAmount: 80000,
    status: "Approved",
    quarter: "Q3 2025",
    stakeholders: ["Alex Rodriguez", "Sarah Chen", "Microsoft Nordics Lead"],
    agreedActions: [
      "Nordic digital demand gen",
      "Reseller enablement events",
      "Azure migration webinars",
    ],
    campaignResultsPlaceholder: "Q3 results pending.",
    assignedRoles: ["leadership", "distributorManager"],
  },
  // Finance (2)
  {
    id: "MDF-0207",
    campaignName: "Ingram Micro Microsoft EMEA Co-Marketing",
    requestingOrgId: "dist-ingram",
    requestingOrgName: "Ingram Micro",
    vendorId: "vendor-microsoft",
    distributorId: "dist-ingram",
    resellerId: "",
    requestedAmount: 72000,
    approvedAmount: 65000,
    status: "Complete",
    quarter: "Q1 2025",
    stakeholders: [
      "David Hughes",
      "Emma Wilson",
      "Microsoft Co-Marketing Team",
    ],
    agreedActions: [
      "UK reseller activation events",
      "Microsoft partner portal content",
      "Renewal marketing kit",
    ],
    campaignResultsPlaceholder:
      "Final ROI: 3.2x. 18 resellers activated. Campaign complete.",
    assignedRoles: ["finance", "distributorManager", "marketing"],
  },
  {
    id: "MDF-0208",
    campaignName: "ATEA Adobe Nordics Demand Fund",
    requestingOrgId: "dist-atea",
    requestingOrgName: "ATEA Group",
    vendorId: "vendor-adobe",
    distributorId: "dist-atea",
    resellerId: "",
    requestedAmount: 55000,
    approvedAmount: 42000,
    status: "In Progress",
    quarter: "Q2 2025",
    stakeholders: ["Tom Bradley", "Sarah Chen", "Adobe Partner Marketing"],
    agreedActions: [
      "Nordics digital campaign",
      "Education sector outreach",
      "Creative Cloud trial programme",
    ],
    campaignResultsPlaceholder:
      "Campaign active. Mid-campaign review scheduled.",
    assignedRoles: ["finance", "marketing"],
  },
  // Deal Desk approval queue (2)
  {
    id: "MDF-0209",
    campaignName: "Reseller Group North NVIDIA Activation",
    requestingOrgId: "res-resellergroup",
    requestingOrgName: "Reseller Group North",
    vendorId: "vendor-nvidia",
    distributorId: "dist-crayon",
    resellerId: "res-resellergroup",
    requestedAmount: 22000,
    approvedAmount: 0,
    status: "Pending",
    quarter: "Q3 2025",
    stakeholders: ["Rachel Kim", "Alex Rodriguez", "NVIDIA Partner Team"],
    agreedActions: [
      "Reseller sales training",
      "NVIDIA demo environment",
      "Co-branded content",
    ],
    campaignResultsPlaceholder: "Awaiting Deal Desk approval.",
    assignedRoles: ["dealDesk", "marketing"],
  },
  {
    id: "MDF-0210",
    campaignName: "Sovereign Systems Azure Migration Campaign",
    requestingOrgId: "res-sovereign",
    requestingOrgName: "Sovereign Systems UK",
    vendorId: "vendor-microsoft",
    distributorId: "dist-ingram",
    resellerId: "res-sovereign",
    requestedAmount: 35000,
    approvedAmount: 0,
    status: "Pending",
    quarter: "Q3 2025",
    stakeholders: ["Tom Bradley", "David Hughes", "Microsoft UK Channel"],
    agreedActions: [
      "Azure migration playbook",
      "UK customer workshops",
      "Co-sell activity tracking",
    ],
    campaignResultsPlaceholder: "Awaiting Deal Desk approval.",
    assignedRoles: ["dealDesk", "partnerMarketing"],
  },
];

// ─── TASKS ────────────────────────────────────────────────────────────────────
// TODO-SECURITY: Remove before production.

export const DEMO_TASKS: DemoTask[] = [
  // Sales Rep (6)
  {
    id: "task-001",
    title: "Call back Desperado Ltd — NVIDIA renewal decision",
    taskType: "callback",
    dueDate: ds(1),
    status: "Pending",
    priority: "High",
    ownerId: "user-tom",
    ownerName: "Tom Bradley",
    linkedEntityId: "cust-desperado",
    linkedEntityType: "customer",
    assignedRoles: ["salesRep"],
  },
  {
    id: "task-002",
    title: "Follow up Nordic Energy on Microsoft 365 upsell quote",
    taskType: "renewal-followup",
    dueDate: ds(2),
    status: "Pending",
    priority: "High",
    ownerId: "user-sarah",
    ownerName: "Sarah Chen",
    linkedEntityId: "cust-energy",
    linkedEntityType: "customer",
    assignedRoles: ["salesRep", "renewalSpecialist"],
  },
  {
    id: "task-003",
    title: "Review and update UK Education opportunity stage",
    taskType: "account-update",
    dueDate: ds(2),
    status: "Overdue",
    priority: "Medium",
    ownerId: "user-emma",
    ownerName: "Emma Wilson",
    linkedEntityId: "cust-education",
    linkedEntityType: "customer",
    assignedRoles: ["salesRep"],
  },
  {
    id: "task-004",
    title: "Send revised quote — Global Pharma Adobe Analytics",
    taskType: "quote-review",
    dueDate: ds(3),
    status: "In Progress",
    priority: "High",
    ownerId: "user-rachel",
    ownerName: "Rachel Kim",
    linkedEntityId: "opp-005",
    linkedEntityType: "opportunity",
    assignedRoles: ["salesRep", "dealDesk"],
  },
  {
    id: "task-005",
    title: "Callback — City Infrastructure Azure proposal follow-up",
    taskType: "callback",
    dueDate: ds(1),
    status: "Pending",
    priority: "Critical",
    ownerId: "user-james",
    ownerName: "James Miller",
    linkedEntityId: "cust-city",
    linkedEntityType: "customer",
    assignedRoles: ["salesRep", "accountManager"],
  },
  {
    id: "task-006",
    title: "Update FutureStack pipeline — EMEA status check",
    taskType: "account-update",
    dueDate: ds(4),
    status: "Pending",
    priority: "Medium",
    ownerId: "user-james",
    ownerName: "James Miller",
    linkedEntityId: "res-futurestack",
    linkedEntityType: "reseller",
    assignedRoles: ["salesRep"],
  },
  // Renewal Specialist (5)
  {
    id: "task-007",
    title: "Send renewal quote — Desperado NVIDIA AI Suite",
    taskType: "renewal-followup",
    dueDate: ds(0),
    status: "Overdue",
    priority: "Critical",
    ownerId: "user-tom",
    ownerName: "Tom Bradley",
    linkedEntityId: "cust-desperado",
    linkedEntityType: "customer",
    assignedRoles: ["renewalSpecialist"],
  },
  {
    id: "task-008",
    title: "Chase Nordic Energy — Microsoft 365 renewal signature",
    taskType: "renewal-followup",
    dueDate: ds(2),
    status: "In Progress",
    priority: "High",
    ownerId: "user-sarah",
    ownerName: "Sarah Chen",
    linkedEntityId: "opp-007",
    linkedEntityType: "opportunity",
    assignedRoles: ["renewalSpecialist"],
  },
  {
    id: "task-009",
    title: "Review expiring contracts — UK Education Trust",
    taskType: "renewal-followup",
    dueDate: ds(5),
    status: "Pending",
    priority: "High",
    ownerId: "user-emma",
    ownerName: "Emma Wilson",
    linkedEntityId: "cust-education",
    linkedEntityType: "customer",
    assignedRoles: ["renewalSpecialist"],
  },
  {
    id: "task-010",
    title: "Escalate Global Pharma Adobe Sign renewal — legal delay",
    taskType: "case-resolution",
    dueDate: ds(1),
    status: "Overdue",
    priority: "Critical",
    ownerId: "user-rachel",
    ownerName: "Rachel Kim",
    linkedEntityId: "opp-010",
    linkedEntityType: "opportunity",
    assignedRoles: ["renewalSpecialist", "dealDesk"],
  },
  {
    id: "task-011",
    title: "Renewal risk review — Reseller Group North coverage gap",
    taskType: "renewal-followup",
    dueDate: ds(7),
    status: "Pending",
    priority: "Medium",
    ownerId: "user-rachel",
    ownerName: "Rachel Kim",
    linkedEntityId: "res-resellergroup",
    linkedEntityType: "reseller",
    assignedRoles: ["renewalSpecialist", "resellerManager"],
  },
  // Marketing (4)
  {
    id: "task-012",
    title: "Review MDF campaign results — BluePeak Adobe EMEA",
    taskType: "campaign-review",
    dueDate: ds(3),
    status: "In Progress",
    priority: "Medium",
    ownerId: "user-emma",
    ownerName: "Emma Wilson",
    linkedEntityId: "MDF-0203",
    linkedEntityType: "mdf",
    assignedRoles: ["marketing", "partnerMarketing"],
  },
  {
    id: "task-013",
    title: "Upload campaign assets — FutureStack NVIDIA AI campaign",
    taskType: "campaign-review",
    dueDate: ds(4),
    status: "Pending",
    priority: "High",
    ownerId: "user-james",
    ownerName: "James Miller",
    linkedEntityId: "MDF-0204",
    linkedEntityType: "mdf",
    assignedRoles: ["marketing"],
  },
  {
    id: "task-014",
    title: "Approve MDF request — Sovereign Systems Azure Campaign",
    taskType: "mdf-approval",
    dueDate: ds(2),
    status: "Pending",
    priority: "High",
    ownerId: "user-tom",
    ownerName: "Tom Bradley",
    linkedEntityId: "MDF-0210",
    linkedEntityType: "mdf",
    assignedRoles: ["marketing", "dealDesk"],
  },
  {
    id: "task-015",
    title: "Reseller campaign engagement review — Nordics Q3",
    taskType: "campaign-review",
    dueDate: ds(7),
    status: "Pending",
    priority: "Low",
    ownerId: "user-sarah",
    ownerName: "Sarah Chen",
    linkedEntityId: "dist-atea",
    linkedEntityType: "distributor",
    assignedRoles: ["marketing", "partnerMarketing"],
  },
  // IT Operations (3)
  {
    id: "task-016",
    title: "Resolve API sync failure — Microsoft 365 integration",
    taskType: "case-resolution",
    dueDate: ds(0),
    status: "In Progress",
    priority: "Critical",
    ownerId: "user-it01",
    ownerName: "Mark Evans",
    linkedEntityId: "CASE-0102",
    linkedEntityType: "case",
    assignedRoles: ["itOperations"],
  },
  {
    id: "task-017",
    title: "Investigate failed import — Nordic Cloud Solutions CSV",
    taskType: "case-resolution",
    dueDate: ds(1),
    status: "Pending",
    priority: "High",
    ownerId: "user-it01",
    ownerName: "Mark Evans",
    linkedEntityId: "CASE-0101",
    linkedEntityType: "case",
    assignedRoles: ["itOperations"],
  },
  {
    id: "task-018",
    title: "Access provisioning — Sovereign Systems 3 new users",
    taskType: "account-update",
    dueDate: ds(2),
    status: "In Progress",
    priority: "Medium",
    ownerId: "user-it01",
    ownerName: "Mark Evans",
    linkedEntityId: "CASE-0104",
    linkedEntityType: "case",
    assignedRoles: ["itOperations"],
  },
  // Deal Desk (3)
  {
    id: "task-019",
    title: "Review FutureStack NVIDIA deal registration — margin exception",
    taskType: "quote-review",
    dueDate: ds(1),
    status: "Overdue",
    priority: "Critical",
    ownerId: "user-james",
    ownerName: "James Miller",
    linkedEntityId: "DR-0302",
    linkedEntityType: "dealRegistration",
    assignedRoles: ["dealDesk"],
  },
  {
    id: "task-020",
    title: "Approve Global Pharma Adobe Sign deal registration",
    taskType: "mdf-approval",
    dueDate: ds(2),
    status: "Pending",
    priority: "High",
    ownerId: "user-rachel",
    ownerName: "Rachel Kim",
    linkedEntityId: "DR-0305",
    linkedEntityType: "dealRegistration",
    assignedRoles: ["dealDesk"],
  },
  {
    id: "task-021",
    title: "Pricing check — Crayon volume licence discount review",
    taskType: "pricing-check",
    dueDate: ds(3),
    status: "Pending",
    priority: "Medium",
    ownerId: "user-alex",
    ownerName: "Alex Rodriguez",
    linkedEntityId: "CASE-0112",
    linkedEntityType: "case",
    assignedRoles: ["dealDesk", "salesOps"],
  },
  // Finance (2)
  {
    id: "task-022",
    title: "Review credit usage report — EMEA Q3 infrastructure spend",
    taskType: "account-update",
    dueDate: ds(5),
    status: "Pending",
    priority: "Medium",
    ownerId: "user-rachel",
    ownerName: "Rachel Kim",
    linkedEntityId: "dist-tdsynnex",
    linkedEntityType: "distributor",
    assignedRoles: ["finance"],
  },
  {
    id: "task-023",
    title: "Renewal revenue forecast — Q3 close analysis",
    taskType: "renewal-followup",
    dueDate: ds(7),
    status: "Pending",
    priority: "High",
    ownerId: "user-james",
    ownerName: "James Miller",
    linkedEntityId: "cust-city",
    linkedEntityType: "customer",
    assignedRoles: ["finance", "leadership"],
  },
  // Leadership (2)
  {
    id: "task-024",
    title: "Executive review — City Infrastructure SLA escalation",
    taskType: "case-resolution",
    dueDate: ds(1),
    status: "In Progress",
    priority: "Critical",
    ownerId: "user-james",
    ownerName: "James Miller",
    linkedEntityId: "CASE-0107",
    linkedEntityType: "case",
    assignedRoles: ["leadership"],
  },
  {
    id: "task-025",
    title: "Quarterly ecosystem performance review — board summary",
    taskType: "account-update",
    dueDate: ds(10),
    status: "Pending",
    priority: "High",
    ownerId: "user-james",
    ownerName: "James Miller",
    linkedEntityId: "vendor-microsoft",
    linkedEntityType: "vendor",
    assignedRoles: ["leadership"],
  },
];

// ─── DEAL REGISTRATIONS ───────────────────────────────────────────────────────
// TODO-SECURITY: Remove before production.

export const DEMO_DEAL_REGISTRATIONS: DemoDealRegistration[] = [
  {
    id: "DR-0301",
    opportunityId: "opp-001",
    accountName: "Desperado Ltd",
    resellerName: "FutureStack Technologies",
    vendorName: "NVIDIA",
    value: 85000,
    status: "Approved",
    submittedDate: ds(-10),
    slaDeadline: ds(-3),
    assignedApprover: "James Miller",
    priority: "Medium",
    assignedRoles: ["dealDesk", "salesRep", "resellerManager"],
  },
  {
    id: "DR-0302",
    opportunityId: "opp-015",
    accountName: "FutureStack Technologies",
    resellerName: "FutureStack Technologies",
    vendorName: "NVIDIA",
    value: 310000,
    status: "Under Review",
    submittedDate: ds(-5),
    slaDeadline: ds(2),
    assignedApprover: "Rachel Kim",
    priority: "Critical",
    assignedRoles: ["dealDesk", "leadership"],
  },
  {
    id: "DR-0303",
    opportunityId: "opp-002",
    accountName: "Nordic Energy Group",
    resellerName: "Nordic Cloud Solutions",
    vendorName: "Microsoft",
    value: 120000,
    status: "Approved",
    submittedDate: ds(-14),
    slaDeadline: ds(-7),
    assignedApprover: "Tom Bradley",
    priority: "High",
    assignedRoles: ["dealDesk", "salesRep"],
  },
  {
    id: "DR-0304",
    opportunityId: "opp-016",
    accountName: "Ingram Micro",
    resellerName: "Ingram Micro",
    vendorName: "Microsoft",
    value: 220000,
    status: "Pending",
    submittedDate: ds(-3),
    slaDeadline: ds(5),
    assignedApprover: "Emma Wilson",
    priority: "High",
    assignedRoles: ["dealDesk"],
  },
  {
    id: "DR-0305",
    opportunityId: "opp-010",
    accountName: "Global Pharma Holdings",
    resellerName: "BluePeak Consulting",
    vendorName: "Adobe",
    value: 420000,
    status: "Pending",
    submittedDate: ds(-2),
    slaDeadline: ds(6),
    assignedApprover: "Rachel Kim",
    priority: "Critical",
    assignedRoles: ["dealDesk", "renewalSpecialist", "leadership"],
  },
  {
    id: "DR-0306",
    opportunityId: "opp-005",
    accountName: "Global Pharma Holdings",
    resellerName: "BluePeak Consulting",
    vendorName: "Adobe",
    value: 180000,
    status: "Approved",
    submittedDate: ds(-20),
    slaDeadline: ds(-13),
    assignedApprover: "Emma Wilson",
    priority: "High",
    assignedRoles: ["dealDesk", "salesRep"],
  },
  {
    id: "DR-0307",
    opportunityId: "opp-022",
    accountName: "Crayon",
    resellerName: "Nordic Cloud Solutions",
    vendorName: "Microsoft",
    value: 480000,
    status: "Approved",
    submittedDate: ds(-8),
    slaDeadline: ds(-1),
    assignedApprover: "Alex Rodriguez",
    priority: "High",
    assignedRoles: ["dealDesk", "distributorManager"],
  },
  {
    id: "DR-0308",
    opportunityId: "opp-024",
    accountName: "TD SYNNEX",
    resellerName: "TD SYNNEX",
    vendorName: "NVIDIA",
    value: 650000,
    status: "Approved",
    submittedDate: ds(-12),
    slaDeadline: ds(-5),
    assignedApprover: "Rachel Kim",
    priority: "High",
    assignedRoles: ["dealDesk", "leadership", "distributorManager"],
  },
  {
    id: "DR-0309",
    opportunityId: "opp-014",
    accountName: "BluePeak Consulting",
    resellerName: "BluePeak Consulting",
    vendorName: "Adobe",
    value: 155000,
    status: "Pending",
    submittedDate: ds(-6),
    slaDeadline: ds(1),
    assignedApprover: "Emma Wilson",
    priority: "High",
    assignedRoles: ["dealDesk", "resellerManager"],
  },
  {
    id: "DR-0310",
    opportunityId: "opp-018",
    accountName: "Global Pharma Holdings",
    resellerName: "BluePeak Consulting",
    vendorName: "Adobe",
    value: 780000,
    status: "Under Review",
    submittedDate: ds(-4),
    slaDeadline: ds(4),
    assignedApprover: "James Miller",
    priority: "Critical",
    assignedRoles: ["dealDesk", "leadership"],
  },
];

// ─── CALENDAR EVENTS ──────────────────────────────────────────────────────────
// TODO-SECURITY: Remove before production.

export const DEMO_CALENDAR_EVENTS: DemoCalendarEvent[] = [
  // Callbacks (8) — salesRep, accountManager
  {
    id: "cal-001",
    title: "Callback — Desperado Ltd NVIDIA Renewal Decision",
    eventType: "callback",
    date: d(1),
    time: "10:00",
    durationMins: 30,
    status: "Upcoming",
    linkedEntityId: "cust-desperado",
    linkedEntityType: "customer",
    assignedRoles: ["salesRep", "accountManager"],
    color: "var(--color-primary)",
    description:
      "Final callback to confirm renewal decision with Desperado Ltd procurement lead.",
  },
  {
    id: "cal-002",
    title: "Follow-up Call — Nordic Energy Microsoft 365",
    eventType: "callback",
    date: d(2),
    time: "14:00",
    durationMins: 45,
    status: "Upcoming",
    linkedEntityId: "cust-energy",
    linkedEntityType: "customer",
    assignedRoles: ["salesRep", "accountManager"],
    color: "var(--color-primary)",
    description:
      "Follow up on Microsoft 365 upsell proposal. Customer requested pricing clarification.",
  },
  {
    id: "cal-003",
    title: "Callback — UK Education Trust Adobe Quote",
    eventType: "callback",
    date: d(3),
    time: "11:00",
    durationMins: 30,
    status: "Upcoming",
    linkedEntityId: "cust-education",
    linkedEntityType: "customer",
    assignedRoles: ["salesRep"],
    color: "var(--color-primary)",
    description: "Review revised Adobe Creative Cloud campus licence quote.",
  },
  {
    id: "cal-004",
    title: "Callback — Global Pharma Analytics Proposal",
    eventType: "callback",
    date: d(4),
    time: "15:30",
    durationMins: 60,
    status: "Upcoming",
    linkedEntityId: "cust-pharma",
    linkedEntityType: "customer",
    assignedRoles: ["salesRep", "accountManager"],
    color: "var(--color-primary)",
    description:
      "Adobe Analytics upgrade proposal discussion with Global Pharma IT Director.",
  },
  {
    id: "cal-005",
    title: "Callback — City Infrastructure Azure Migration",
    eventType: "callback",
    date: d(5),
    time: "09:00",
    durationMins: 60,
    status: "Upcoming",
    linkedEntityId: "cust-city",
    linkedEntityType: "customer",
    assignedRoles: ["salesRep", "accountManager"],
    color: "var(--color-primary)",
    description:
      "Initial discovery call for City Infrastructure Azure migration programme.",
  },
  {
    id: "cal-006",
    title: "Callback — FutureStack EMEA Pipeline Review",
    eventType: "callback",
    date: d(7),
    time: "13:00",
    durationMins: 45,
    status: "Upcoming",
    linkedEntityId: "res-futurestack",
    linkedEntityType: "reseller",
    assignedRoles: ["salesRep", "resellerManager"],
    color: "var(--color-primary)",
    description:
      "Quarterly pipeline review with FutureStack Technologies EMEA Sales Director.",
  },
  {
    id: "cal-007",
    title: "Callback — BluePeak Adobe Enterprise Agreement",
    eventType: "callback",
    date: d(9),
    time: "11:30",
    durationMins: 30,
    status: "Upcoming",
    linkedEntityId: "res-bluepeak",
    linkedEntityType: "reseller",
    assignedRoles: ["accountManager"],
    color: "var(--color-primary)",
    description:
      "Check in on BluePeak deal registration status and enterprise agreement progress.",
  },
  {
    id: "cal-008",
    title: "Callback — Sovereign Systems Teams Rooms Demo",
    eventType: "callback",
    date: d(11),
    time: "10:00",
    durationMins: 60,
    status: "Upcoming",
    linkedEntityId: "res-sovereign",
    linkedEntityType: "reseller",
    assignedRoles: ["salesRep"],
    color: "var(--color-primary)",
    description:
      "Microsoft Teams Rooms product demonstration with Sovereign Systems technical team.",
  },
  // Renewals (8) — renewalSpecialist, accountManager
  {
    id: "cal-009",
    title: "Renewal Deadline — Desperado NVIDIA AI Suite",
    eventType: "renewal",
    date: d(14),
    time: "09:00",
    durationMins: 0,
    status: "At Risk",
    linkedEntityId: "cust-desperado",
    linkedEntityType: "customer",
    assignedRoles: ["renewalSpecialist", "accountManager"],
    color: "var(--color-destructive)",
    description:
      "NVIDIA AI Suite contract renewal due. Quote approved — awaiting customer signature.",
  },
  {
    id: "cal-010",
    title: "Renewal Review — Nordic Energy Microsoft 365",
    eventType: "renewal",
    date: d(25),
    time: "10:00",
    durationMins: 60,
    status: "At Risk",
    linkedEntityId: "cust-energy",
    linkedEntityType: "customer",
    assignedRoles: ["renewalSpecialist"],
    color: "var(--color-destructive)",
    description:
      "Microsoft 365 renewal review. No engagement in 12 days — escalation may be needed.",
  },
  {
    id: "cal-011",
    title: "Renewal Follow-up — UK Education Adobe Creative Cloud",
    eventType: "renewal",
    date: d(35),
    time: "14:00",
    durationMins: 45,
    status: "Upcoming",
    linkedEntityId: "cust-education",
    linkedEntityType: "customer",
    assignedRoles: ["renewalSpecialist", "accountManager"],
    color: "var(--color-warning)",
    description:
      "Adobe Creative Cloud campus licence renewal. Quote sent — follow up for signature.",
  },
  {
    id: "cal-012",
    title: "Renewal Deadline — Global Pharma Adobe Sign",
    eventType: "renewal",
    date: d(40),
    time: "09:00",
    durationMins: 0,
    status: "At Risk",
    linkedEntityId: "cust-pharma",
    linkedEntityType: "customer",
    assignedRoles: ["renewalSpecialist", "dealDesk"],
    color: "var(--color-destructive)",
    description:
      "Adobe Sign Enterprise renewal. Legal review still pending — chase required.",
  },
  {
    id: "cal-013",
    title: "Renewal Deadline — City Infrastructure Full Stack",
    eventType: "renewal",
    date: d(50),
    time: "09:00",
    durationMins: 0,
    status: "Upcoming",
    linkedEntityId: "cust-city",
    linkedEntityType: "customer",
    assignedRoles: ["renewalSpecialist", "leadership"],
    color: "var(--color-success)",
    description:
      "Largest renewal this quarter. Azure + NVIDIA full stack. Executive sponsorship confirmed.",
  },
  {
    id: "cal-014",
    title: "Contract Expiry — Crayon Volume Licence",
    eventType: "renewal",
    date: d(20),
    time: "09:00",
    durationMins: 0,
    status: "Upcoming",
    linkedEntityId: "dist-crayon",
    linkedEntityType: "distributor",
    assignedRoles: ["renewalSpecialist"],
    color: "var(--color-warning)",
    description:
      "Crayon Microsoft volume licence renewal. Quote sent and approved.",
  },
  {
    id: "cal-015",
    title: "Renewal Risk Review — BluePeak Analytics",
    eventType: "renewal",
    date: d(30),
    time: "11:00",
    durationMins: 45,
    status: "At Risk",
    linkedEntityId: "res-bluepeak",
    linkedEntityType: "reseller",
    assignedRoles: ["renewalSpecialist", "accountManager"],
    color: "var(--color-destructive)",
    description:
      "BluePeak health score at 71%. Renewal risk elevated. Customer engagement review.",
  },
  {
    id: "cal-016",
    title: "Renewal Reminder — Nordic Energy Azure",
    eventType: "renewal",
    date: d(60),
    time: "09:00",
    durationMins: 0,
    status: "Upcoming",
    linkedEntityId: "cust-energy",
    linkedEntityType: "customer",
    assignedRoles: ["renewalSpecialist"],
    color: "var(--color-success)",
    description:
      "Early renewal reminder for Azure subscription. Q3 renewal target date.",
  },
  // Case SLA deadlines (5) — itOperations
  {
    id: "cal-017",
    title: "SLA Deadline — CASE-0102 API Integration",
    eventType: "case-sla",
    date: d(0),
    time: "17:00",
    durationMins: 0,
    status: "At Risk",
    linkedEntityId: "CASE-0102",
    linkedEntityType: "case",
    assignedRoles: ["itOperations"],
    color: "var(--color-destructive)",
    description:
      "Critical SLA: Microsoft 365 API sync failure. 4-hour SLA at risk.",
  },
  {
    id: "cal-018",
    title: "SLA Deadline — CASE-0101 Import Failure",
    eventType: "case-sla",
    date: d(1),
    time: "12:00",
    durationMins: 0,
    status: "Upcoming",
    linkedEntityId: "CASE-0101",
    linkedEntityType: "case",
    assignedRoles: ["itOperations"],
    color: "var(--color-warning)",
    description: "CSV import failure resolution deadline. 8-hour SLA window.",
  },
  {
    id: "cal-019",
    title: "SLA Deadline — CASE-0107 City Infrastructure Escalation",
    eventType: "case-sla",
    date: d(1),
    time: "14:00",
    durationMins: 0,
    status: "Upcoming",
    linkedEntityId: "CASE-0107",
    linkedEntityType: "case",
    assignedRoles: ["itOperations", "leadership"],
    color: "var(--color-destructive)",
    description:
      "Critical SLA: City Infrastructure SLA breach resolution required.",
  },
  {
    id: "cal-020",
    title: "SLA Review — CASE-0111 Pricing Exception",
    eventType: "case-sla",
    date: d(2),
    time: "10:00",
    durationMins: 30,
    status: "Upcoming",
    linkedEntityId: "CASE-0111",
    linkedEntityType: "case",
    assignedRoles: ["itOperations", "dealDesk"],
    color: "var(--color-warning)",
    description:
      "8-hour SLA review for FutureStack NVIDIA pricing exception case.",
  },
  {
    id: "cal-021",
    title: "SLA Deadline — CASE-0114 ERP Sync Delay",
    eventType: "case-sla",
    date: d(2),
    time: "16:00",
    durationMins: 0,
    status: "Upcoming",
    linkedEntityId: "CASE-0114",
    linkedEntityType: "case",
    assignedRoles: ["itOperations"],
    color: "var(--color-warning)",
    description: "Ingram Micro ERP sync resolution deadline.",
  },
  // Campaign milestones (6) — marketing, partnerMarketing
  {
    id: "cal-022",
    title: "Campaign Launch — Adobe Nordic Demand Generation",
    eventType: "campaign",
    date: d(3),
    time: "09:00",
    durationMins: 0,
    status: "Upcoming",
    linkedEntityId: "MDF-0201",
    linkedEntityType: "mdf",
    assignedRoles: ["marketing", "partnerMarketing"],
    color: "var(--color-accent)",
    description:
      "Adobe Creative Cloud Nordic demand generation campaign go-live.",
  },
  {
    id: "cal-023",
    title: "Campaign Mid-Review — BluePeak Adobe EMEA",
    eventType: "campaign",
    date: d(7),
    time: "14:00",
    durationMins: 60,
    status: "Upcoming",
    linkedEntityId: "MDF-0203",
    linkedEntityType: "mdf",
    assignedRoles: ["marketing"],
    color: "var(--color-accent)",
    description:
      "Mid-campaign review for BluePeak Adobe Experience Cloud EMEA campaign.",
  },
  {
    id: "cal-024",
    title: "Asset Upload Deadline — FutureStack NVIDIA AI",
    eventType: "campaign",
    date: d(4),
    time: "17:00",
    durationMins: 0,
    status: "Upcoming",
    linkedEntityId: "MDF-0204",
    linkedEntityType: "mdf",
    assignedRoles: ["marketing"],
    color: "var(--color-accent)",
    description:
      "Campaign asset upload deadline for NVIDIA AI awareness campaign.",
  },
  {
    id: "cal-025",
    title: "Campaign Review — Nordics Reseller Engagement Q3",
    eventType: "campaign",
    date: d(10),
    time: "11:00",
    durationMins: 60,
    status: "Upcoming",
    linkedEntityId: "MDF-0201",
    linkedEntityType: "mdf",
    assignedRoles: ["marketing", "partnerMarketing"],
    color: "var(--color-accent)",
    description:
      "Quarterly reseller campaign engagement review — Nordics territory.",
  },
  {
    id: "cal-026",
    title: "EMEA Partner Summit Preparation Meeting",
    eventType: "campaign",
    date: d(14),
    time: "10:00",
    durationMins: 90,
    status: "Upcoming",
    linkedEntityId: "MDF-0205",
    linkedEntityType: "mdf",
    assignedRoles: ["marketing", "leadership", "partnerMarketing"],
    color: "var(--color-accent)",
    description: "EMEA Partner Summit logistics and content preparation.",
  },
  {
    id: "cal-027",
    title: "Microsoft Nordic Growth Fund Campaign Kickoff",
    eventType: "campaign",
    date: d(5),
    time: "09:00",
    durationMins: 60,
    status: "Upcoming",
    linkedEntityId: "MDF-0206",
    linkedEntityType: "mdf",
    assignedRoles: ["marketing", "distributorManager"],
    color: "var(--color-accent)",
    description:
      "Kickoff for Microsoft Nordic Growth Fund Q3 digital campaign.",
  },
  // MDF deadlines (5) — marketing
  {
    id: "cal-028",
    title: "MDF Approval Deadline — Sovereign Systems Azure",
    eventType: "mdf-deadline",
    date: d(2),
    time: "17:00",
    durationMins: 0,
    status: "Upcoming",
    linkedEntityId: "MDF-0210",
    linkedEntityType: "mdf",
    assignedRoles: ["marketing", "dealDesk"],
    color: "var(--color-warning)",
    description:
      "MDF approval deadline for Sovereign Systems Azure Migration Campaign.",
  },
  {
    id: "cal-029",
    title: "MDF Submission Deadline — FutureStack NVIDIA",
    eventType: "mdf-deadline",
    date: d(5),
    time: "17:00",
    durationMins: 0,
    status: "Upcoming",
    linkedEntityId: "MDF-0204",
    linkedEntityType: "mdf",
    assignedRoles: ["marketing"],
    color: "var(--color-warning)",
    description:
      "Final MDF request submission deadline for NVIDIA AI Awareness Campaign.",
  },
  {
    id: "cal-030",
    title: "MDF Results Submission — Ingram Micro Microsoft",
    eventType: "mdf-deadline",
    date: d(7),
    time: "12:00",
    durationMins: 0,
    status: "Upcoming",
    linkedEntityId: "MDF-0207",
    linkedEntityType: "mdf",
    assignedRoles: ["marketing", "finance"],
    color: "var(--color-success)",
    description:
      "Final campaign ROI and results submission for completed Ingram Micro campaign.",
  },
  {
    id: "cal-031",
    title: "MDF Mid-Campaign Review — ATEA Adobe Nordics",
    eventType: "mdf-deadline",
    date: d(10),
    time: "14:00",
    durationMins: 60,
    status: "Upcoming",
    linkedEntityId: "MDF-0208",
    linkedEntityType: "mdf",
    assignedRoles: ["marketing"],
    color: "var(--color-warning)",
    description:
      "Mid-campaign review and spend reconciliation for ATEA Adobe Nordics fund.",
  },
  {
    id: "cal-032",
    title: "MDF Q3 Partner Summit Milestone — Spend Report",
    eventType: "mdf-deadline",
    date: d(21),
    time: "17:00",
    durationMins: 0,
    status: "Upcoming",
    linkedEntityId: "MDF-0205",
    linkedEntityType: "mdf",
    assignedRoles: ["marketing", "finance", "leadership"],
    color: "var(--color-warning)",
    description: "Q3 EMEA Partner Summit spend milestone report due.",
  },
  // Quote deadlines (5) — dealDesk, salesRep
  {
    id: "cal-033",
    title: "Quote Deadline — Global Pharma Adobe Sign",
    eventType: "quote-deadline",
    date: d(3),
    time: "17:00",
    durationMins: 0,
    status: "At Risk",
    linkedEntityId: "opp-010",
    linkedEntityType: "opportunity",
    assignedRoles: ["dealDesk", "renewalSpecialist"],
    color: "var(--color-destructive)",
    description: "Quote must be finalised before legal sign-off window closes.",
  },
  {
    id: "cal-034",
    title: "Quote Expiry — FutureStack NVIDIA Bulk Order",
    eventType: "quote-deadline",
    date: d(10),
    time: "17:00",
    durationMins: 0,
    status: "Upcoming",
    linkedEntityId: "opp-015",
    linkedEntityType: "opportunity",
    assignedRoles: ["dealDesk", "salesRep"],
    color: "var(--color-warning)",
    description:
      "Quote approved at 18% margin. Expiry date approaching — confirm or revise.",
  },
  {
    id: "cal-035",
    title: "Quote Review — Ingram Micro Microsoft CSP Bundle",
    eventType: "quote-deadline",
    date: d(5),
    time: "15:00",
    durationMins: 60,
    status: "Upcoming",
    linkedEntityId: "opp-016",
    linkedEntityType: "opportunity",
    assignedRoles: ["dealDesk"],
    color: "var(--color-warning)",
    description:
      "Internal review meeting for Ingram Micro CSP bundle quote before customer submission.",
  },
  {
    id: "cal-036",
    title: "Quote Deadline — City Infrastructure Strategic Expansion",
    eventType: "quote-deadline",
    date: d(21),
    time: "17:00",
    durationMins: 0,
    status: "Upcoming",
    linkedEntityId: "opp-011",
    linkedEntityType: "opportunity",
    assignedRoles: ["dealDesk", "leadership"],
    color: "var(--color-warning)",
    description:
      "Draft quote must be submitted for stakeholder review before proposal deadline.",
  },
  {
    id: "cal-037",
    title: "Quote Submission — Desperado NVIDIA Expansion",
    eventType: "quote-deadline",
    date: d(7),
    time: "12:00",
    durationMins: 0,
    status: "Upcoming",
    linkedEntityId: "opp-001",
    linkedEntityType: "opportunity",
    assignedRoles: ["salesRep", "dealDesk"],
    color: "var(--color-success)",
    description:
      "Approved quote to be formally submitted to Desperado procurement.",
  },
  // Meetings (3) — leadership, salesManager
  {
    id: "cal-038",
    title: "Executive QBR — EMEA Ecosystem Performance",
    eventType: "meeting",
    date: d(14),
    time: "09:00",
    durationMins: 120,
    status: "Upcoming",
    linkedEntityId: "vendor-microsoft",
    linkedEntityType: "vendor",
    assignedRoles: ["leadership", "salesManager"],
    color: "var(--color-secondary)",
    description:
      "Quarterly Business Review — EMEA ecosystem performance, YoY targets, and Q4 planning.",
  },
  {
    id: "cal-039",
    title: "Sales Team Pipeline Review — Q3 Attainment",
    eventType: "meeting",
    date: d(7),
    time: "14:00",
    durationMins: 90,
    status: "Upcoming",
    linkedEntityId: "opp-017",
    linkedEntityType: "opportunity",
    assignedRoles: ["leadership", "salesManager"],
    color: "var(--color-secondary)",
    description: "Q3 pipeline attainment review with Sales leadership team.",
  },
  {
    id: "cal-040",
    title: "Strategic Account Review — City Infrastructure",
    eventType: "meeting",
    date: d(10),
    time: "10:00",
    durationMins: 90,
    status: "Upcoming",
    linkedEntityId: "cust-city",
    linkedEntityType: "customer",
    assignedRoles: ["leadership", "accountManager"],
    color: "var(--color-secondary)",
    description:
      "Executive strategic account review for City Infrastructure Authority.",
  },
];

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────
// TODO-SECURITY: Remove before production.

export function getOpportunitiesForRole(
  role: string,
  _orgType: string,
): DemoOpportunity[] {
  return DEMO_OPPORTUNITIES.filter((o) => o.assignedRoles.includes(role));
}

export function getCasesForRole(role: string): DemoCase[] {
  return DEMO_CASES.filter((c) => c.assignedRoles.includes(role));
}

export function getMdfRequestsForRole(role: string): DemoMdfRequest[] {
  return DEMO_MDF_REQUESTS.filter((m) => m.assignedRoles.includes(role));
}

export function getTasksForRole(role: string): DemoTask[] {
  return DEMO_TASKS.filter((t) => t.assignedRoles.includes(role));
}

export function getCalendarEventsForRole(role: string): DemoCalendarEvent[] {
  return DEMO_CALENDAR_EVENTS.filter((e) => e.assignedRoles.includes(role));
}

export function getDealRegistrationsForRole(
  role: string,
): DemoDealRegistration[] {
  return DEMO_DEAL_REGISTRATIONS.filter((dr) =>
    dr.assignedRoles.includes(role),
  );
}

export function getEcosystemForOrgType(orgType: string): {
  vendors: DemoOrg[];
  distributors: DemoOrg[];
  resellers: DemoOrg[];
  customers: DemoOrg[];
} {
  switch (orgType) {
    case "vendor":
    case "Vendor":
      return {
        vendors: DEMO_VENDORS,
        distributors: DEMO_DISTRIBUTORS,
        resellers: DEMO_RESELLERS,
        customers: DEMO_CUSTOMERS,
      };
    case "distributor":
    case "Distributor":
    case "globalDistributor":
    case "Global Distributor":
      return {
        vendors: DEMO_VENDORS,
        distributors: DEMO_DISTRIBUTORS,
        resellers: DEMO_RESELLERS,
        customers: DEMO_CUSTOMERS,
      };
    case "reseller":
    case "Reseller":
    case "multiGroupReseller":
    case "Multi-Group Reseller":
      return {
        vendors: DEMO_VENDORS,
        distributors: DEMO_DISTRIBUTORS,
        resellers: DEMO_RESELLERS,
        customers: DEMO_CUSTOMERS,
      };
    default:
      return {
        vendors: DEMO_VENDORS,
        distributors: DEMO_DISTRIBUTORS,
        resellers: DEMO_RESELLERS,
        customers: DEMO_CUSTOMERS,
      };
  }
}
