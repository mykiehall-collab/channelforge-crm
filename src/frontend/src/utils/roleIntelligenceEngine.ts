// Role Intelligence Engine — maps job titles and departments to operational roles
// Supports future AI-driven recommendations via admin override learning

export type OperationalRole =
  | "salesRep"
  | "accountManager"
  | "renewalSpecialist"
  | "bdr"
  | "salesManager"
  | "regionalDirector"
  | "salesOps"
  | "dealDesk"
  | "marketing"
  | "partnerMarketing"
  | "customerSuccess"
  | "itOperations"
  | "securityAdmin"
  | "finance"
  | "leadership"
  | "channelAccountManager"
  | "channelSalesManager"
  | "channelDirector";

export interface RoleSuggestion {
  suggestedRole: OperationalRole;
  confidence: "high" | "medium" | "low";
  reasoning: string;
  alternativeRoles: OperationalRole[];
}

export const ROLE_PLAYBOOKS: Record<OperationalRole, string[]> = {
  salesRep: [
    "Pipeline Progression",
    "Renewal Recovery",
    "Account Re-engagement",
    "Stalled Deal Rescue",
  ],
  bdr: [
    "Prospect Qualification Sprint",
    "Outreach Sequence Builder",
    "Meeting Booking Acceleration",
    "Pipeline Generation Blitz",
  ],
  accountManager: [
    "Strategic Account Growth",
    "Relationship Health Check",
    "Upsell & Expansion Playbook",
    "Renewal Risk Mitigation",
  ],
  renewalSpecialist: [
    "Renewal Risk Triage",
    "Expiring Contract Outreach",
    "Churn Prevention",
    "Contract Coverage Audit",
  ],
  salesManager: [
    "Team Forecast Review",
    "Rep Coaching & Performance",
    "Territory Coverage Analysis",
    "Pipeline Stage Progression",
  ],
  regionalDirector: [
    "Regional Pipeline Assessment",
    "Territory Strategy Review",
    "Distributor Engagement Analysis",
    "Executive Forecast Governance",
  ],
  salesOps: [
    "Pipeline Hygiene Audit",
    "Account Allocation Governance",
    "Quote Cycle Optimization",
    "Duplicate Account Remediation",
  ],
  dealDesk: [
    "Approval Queue Clearance",
    "Pricing Exception Review",
    "SLA Breach Response",
    "Deal Registration Risk Check",
  ],
  marketing: [
    "Campaign Performance Audit",
    "MDF ROI Analysis",
    "Reseller Engagement Drive",
    "Asset Library Refresh",
  ],
  partnerMarketing: [
    "Channel Campaign Activation",
    "Co-Marketing ROI Review",
    "MDF Activation Gap Analysis",
    "Partner Enablement Sprint",
  ],
  customerSuccess: [
    "Customer Health Recovery",
    "Onboarding Completion Drive",
    "Adoption Acceleration",
    "At-Risk Account Escalation",
  ],
  itOperations: [
    "Integration Health Check",
    "Case Resolution Acceleration",
    "Access Security Audit",
    "Import Failure Remediation",
  ],
  securityAdmin: [
    "Permission Conflict Resolution",
    "MFA Compliance Enforcement",
    "Audit Log Review",
    "Access Governance Sweep",
  ],
  finance: [
    "Credit Depletion Analysis",
    "Revenue Risk Assessment",
    "Infrastructure Cost Optimization",
    "Commercial Forecast Review",
  ],
  leadership: [
    "Strategic Forecast Review",
    "Territory Performance Analysis",
    "Ecosystem Health Assessment",
    "Executive Risk Board",
  ],
  channelAccountManager: [
    "Partner Engagement Playbook",
    "Ecosystem Growth Playbook",
    "Distributor Performance Review",
    "MDF Activation Drive",
  ],
  channelSalesManager: [
    "CAM Territory Scorecard Review",
    "Regional Forecast Governance",
    "Underperforming Territory Recovery",
    "Team Attainment Acceleration",
  ],
  channelDirector: [
    "Ecosystem Strategy Review",
    "Distributor Concentration Risk",
    "Regional Growth Governance",
    "Executive Forecast Alignment",
  ],
};

export const ROLE_TITLE_MAPPINGS: Array<{
  keywords: string[];
  role: OperationalRole;
  orgTypes?: string[];
}> = [
  // Sales Rep variants
  {
    keywords: [
      "account executive",
      "sales representative",
      "sales rep",
      "inside sales",
      "field sales",
      "territory rep",
      "channel sales rep",
      "reseller sales",
    ],
    role: "salesRep",
  },
  // Account Manager — extended variants per spec
  {
    keywords: [
      "account manager",
      "customer account manager",
      "channel account manager",
      "partner account manager",
      "strategic account",
      "key account",
      "senior account manager",
      "global account manager",
      "named account",
    ],
    role: "accountManager",
  },
  // Reseller / Channel / Distribution Manager
  {
    keywords: [
      "reseller manager",
      "channel manager",
      "distribution manager",
      "partner manager",
      "distributor manager",
      "channel relationship manager",
      "partner success manager",
    ],
    role: "salesManager",
  },
  // KPI / Performance / BI / Analytics / Reporting
  {
    keywords: [
      "kpi manager",
      "performance manager",
      "bi manager",
      "business intelligence",
      "analytics manager",
      "reporting manager",
      "insights manager",
      "data analyst",
      "commercial analyst",
      "revenue analyst",
    ],
    role: "salesOps",
  },
  // Renewal / Customer Success / Retention — extended per spec
  {
    keywords: [
      "renewal",
      "renewals manager",
      "renewal specialist",
      "renewal lead",
      "renewal executive",
      "contract renewal",
      "subscription renewal",
      "retention manager",
      "retention specialist",
    ],
    role: "renewalSpecialist",
  },
  // BDR
  {
    keywords: [
      "bdr",
      "business development",
      "sdr",
      "sales development",
      "lead generation",
      "outbound",
      "prospecting",
      "pipeline development",
    ],
    role: "bdr",
  },
  // Sales Manager
  {
    keywords: [
      "sales manager",
      "team lead sales",
      "head of sales",
      "sales team lead",
      "channel sales manager",
      "district sales manager",
      "area sales manager",
    ],
    role: "salesManager",
  },
  // Regional Director / Leadership
  {
    keywords: [
      "regional director",
      "vp sales",
      "vice president",
      "senior director",
      "svp",
      "chief revenue",
      "cro",
      "executive director",
      "gm",
      "general manager",
      "country manager",
    ],
    role: "regionalDirector",
  },
  // Sales Ops / Revenue Operations / Commercial Operations — extended per spec
  {
    keywords: [
      "sales operations",
      "sales ops",
      "revenue operations",
      "revops",
      "commercial operations",
      "crm admin",
      "operations analyst",
      "sales operations analyst",
      "channel operations",
    ],
    role: "salesOps",
  },
  // Deal Desk
  {
    keywords: [
      "deal desk",
      "pricing manager",
      "quote specialist",
      "commercial manager",
      "deal analyst",
      "proposal manager",
      "pricing analyst",
    ],
    role: "dealDesk",
  },
  // Marketing / Campaign / MDF — extended per spec
  {
    keywords: [
      "marketing manager",
      "demand generation",
      "field marketing",
      "product marketing",
      "content marketing",
      "digital marketing",
      "campaign manager",
      "mdf manager",
      "marketing coordinator",
      "marketing specialist",
    ],
    role: "marketing",
  },
  // Partner Marketing
  {
    keywords: [
      "partner marketing",
      "channel marketing",
      "channel marketing manager",
      "reseller marketing",
      "distributor marketing",
      "partner enablement",
      "channel enablement",
    ],
    role: "partnerMarketing",
  },
  // Customer Success
  {
    keywords: [
      "customer success",
      "csm",
      "customer success manager",
      "onboarding manager",
      "adoption manager",
      "client success",
      "customer experience",
    ],
    role: "customerSuccess",
  },
  // IT / Systems / Technical Operations — extended per spec
  {
    keywords: [
      "it operations",
      "it manager",
      "systems administrator",
      "systems engineer",
      "operations engineer",
      "technical operations",
      "infrastructure manager",
      "it director",
      "devops",
      "cloud engineer",
      "it analyst",
      "it support",
      "technical support",
      "systems support",
    ],
    role: "itOperations",
  },
  // Security Admin
  {
    keywords: [
      "security admin",
      "security engineer",
      "security analyst",
      "security manager",
      "ciso",
      "information security",
      "cybersecurity",
      "access governance",
      "identity management",
      "sso",
      "mfa",
    ],
    role: "securityAdmin",
  },
  // Finance / Billing — extended per spec
  {
    keywords: [
      "finance",
      "financial analyst",
      "finance manager",
      "finance director",
      "cfo",
      "billing manager",
      "billing specialist",
      "billing analyst",
      "finance controller",
      "procurement",
    ],
    role: "finance",
  },
  // Director / VP / Head of / Leadership — extended per spec
  {
    keywords: [
      "ceo",
      "coo",
      "president",
      "managing director",
      "director",
      "vp ",
      "vice president",
      "head of",
      "founder",
      "owner",
      "partner",
      "principal",
      "leadership",
    ],
    role: "leadership",
  },
  // Channel Account Manager
  {
    keywords: ["channel account manager", "cam", "partner account manager"],
    role: "channelAccountManager" as OperationalRole,
  },
  // Channel Sales Manager
  {
    keywords: [
      "channel sales manager",
      "regional channel manager",
      "channel team manager",
    ],
    role: "channelSalesManager" as OperationalRole,
  },
  // Channel Director
  {
    keywords: [
      "channel director",
      "director of channel",
      "vp channel",
      "head of channel",
    ],
    role: "channelDirector" as OperationalRole,
  },
];

export function suggestRoleFromTitle(
  jobTitle: string,
  orgType?: string,
  department?: string,
): RoleSuggestion {
  const title = jobTitle.toLowerCase().trim();
  const dept = (department || "").toLowerCase();

  for (const mapping of ROLE_TITLE_MAPPINGS) {
    for (const keyword of mapping.keywords) {
      if (title.includes(keyword)) {
        // Org type context adjustments
        let suggestedRole = mapping.role;
        if (orgType === "reseller" && suggestedRole === "salesRep")
          suggestedRole = "salesRep";
        if (orgType === "distributor" && title.includes("marketing"))
          suggestedRole = "partnerMarketing";

        const alternatives = ROLE_TITLE_MAPPINGS.filter(
          (m) => m.role !== suggestedRole,
        )
          .filter((m) =>
            m.keywords.some((k) => title.includes(k.split(" ")[0])),
          )
          .map((m) => m.role)
          .slice(0, 2);

        return {
          suggestedRole,
          confidence: title === keyword ? "high" : "medium",
          reasoning: `Job title "${jobTitle}" matches "${keyword}" pattern`,
          alternativeRoles: alternatives,
        };
      }
    }
  }

  // Department fallback
  if (dept.includes("sales")) {
    return {
      suggestedRole: "salesRep",
      confidence: "low",
      reasoning: "Department is Sales",
      alternativeRoles: ["accountManager", "bdr"],
    };
  }
  if (dept.includes("marketing")) {
    return {
      suggestedRole: "marketing",
      confidence: "low",
      reasoning: "Department is Marketing",
      alternativeRoles: ["partnerMarketing"],
    };
  }
  if (dept.includes("finance")) {
    return {
      suggestedRole: "finance",
      confidence: "low",
      reasoning: "Department is Finance",
      alternativeRoles: [],
    };
  }
  if (dept.includes("it") || dept.includes("technology")) {
    return {
      suggestedRole: "itOperations",
      confidence: "low",
      reasoning: "Department is IT",
      alternativeRoles: ["securityAdmin"],
    };
  }

  return {
    suggestedRole: "salesRep",
    confidence: "low",
    reasoning: "Unable to determine role from title — defaulting to Sales Rep",
    alternativeRoles: ["accountManager", "customerSuccess"],
  };
}

export const ROLE_DISPLAY_NAMES: Record<OperationalRole, string> = {
  salesRep: "Sales Representative",
  accountManager: "Account Manager",
  renewalSpecialist: "Renewal Specialist",
  bdr: "Business Development Representative",
  salesManager: "Sales Manager",
  regionalDirector: "Regional Director",
  salesOps: "Sales Operations",
  dealDesk: "Deal Desk",
  marketing: "Marketing Manager",
  partnerMarketing: "Partner Marketing",
  customerSuccess: "Customer Success",
  itOperations: "IT Operations",
  securityAdmin: "Security Admin",
  finance: "Finance",
  leadership: "Leadership",
  channelAccountManager: "Channel Account Manager (CAM)",
  channelSalesManager: "Channel Sales Manager",
  channelDirector: "Channel Director",
};

export const ROLE_NAV_PRIORITY: Record<OperationalRole, string[]> = {
  salesRep: ["accounts", "opportunities", "tasks", "renewals", "messaging"],
  bdr: ["accounts", "tasks", "opportunities", "messaging", "forgeai"],
  accountManager: [
    "accounts",
    "renewals",
    "opportunities",
    "messaging",
    "reports",
  ],
  renewalSpecialist: ["renewals", "accounts", "tasks", "reports", "forgeai"],
  salesManager: ["reports", "opportunities", "accounts", "tasks", "forgeai"],
  regionalDirector: [
    "reports",
    "accounts",
    "opportunities",
    "forgeai",
    "renewals",
  ],
  salesOps: ["reports", "accounts", "foundry", "tasks", "opportunities"],
  dealDesk: [
    "dealRegistrations",
    "tasks",
    "opportunities",
    "accounts",
    "reports",
  ],
  marketing: ["reports", "accounts", "tasks", "forgeai", "messaging"],
  partnerMarketing: ["reports", "accounts", "messaging", "tasks", "forgeai"],
  customerSuccess: ["accounts", "tasks", "renewals", "reports", "messaging"],
  itOperations: ["foundry", "reports", "tasks", "accounts", "messaging"],
  securityAdmin: ["foundry", "reports", "tasks"],
  finance: ["reports", "foundry", "accounts", "forgeai"],
  leadership: ["reports", "accounts", "opportunities", "forgeai", "renewals"],
  channelAccountManager: [
    "home",
    "linked-workspaces",
    "opportunities",
    "renewals",
    "messages",
    "reports",
  ],
  channelSalesManager: [
    "home",
    "linked-workspaces",
    "reports",
    "yoy-growth",
    "opportunities",
    "messages",
  ],
  channelDirector: [
    "home",
    "reports",
    "yoy-growth",
    "linked-workspaces",
    "forge-ai",
  ],
};

/**
 * Primary tabs — shown by default per role (4–7 items).
 * Keys map to allNavItems[].to paths.
 * Rules:
 *   - '/' (Home) MUST always be first.
 *   - Max 7 primary tabs per role.
 *   - No dead routes; unmapped routes redirected to nearest equivalent.
 *   - Terminology: 'Reports' (not Analytics/Insights), 'Messaging' = /messages,
 *     'Targets' = /yoy-growth (until dedicated /targets route exists),
 *     'Infrastructure' context uses /foundry for IT roles.
 */
export const ROLE_PRIMARY_TABS: Record<OperationalRole, string[]> = {
  // ── Sales Rep — pipeline, accounts, renewals, messaging, reports ──────────
  salesRep: [
    "/",
    "/accounts",
    "/opportunities",
    "/renewals",
    "/messages",
    "/reports",
  ],
  // ── Account Manager — accounts first, then partner/opportunity work ────────
  accountManager: [
    "/",
    "/accounts",
    "/linked-workspaces",
    "/opportunities",
    "/renewals",
    "/messages",
    "/reports",
  ],
  // ── Renewal Specialist — renewals first ────────────────────────────────────
  renewalSpecialist: [
    "/",
    "/renewals",
    "/accounts",
    "/opportunities",
    "/messages",
    "/reports",
  ],
  // ── BDR — prospects/outreach focused ──────────────────────────────────────
  bdr: ["/", "/opportunities", "/accounts", "/tasks", "/messages"],
  // ── Sales Manager — reports/forecast/team management ──────────────────────
  salesManager: [
    "/",
    "/reports",
    "/opportunities",
    "/yoy-growth",
    "/accounts",
    "/tasks",
  ],
  // ── Regional Director — strategic, regional focus ─────────────────────────
  regionalDirector: [
    "/",
    "/reports",
    "/linked-workspaces",
    "/opportunities",
    "/renewals",
    "/forge-ai",
  ],
  // ── Sales Ops — operational governance, no tactical clutter ───────────────
  salesOps: ["/", "/reports", "/price-lists", "/accounts", "/foundry"],
  // ── Deal Desk — approvals, quotes, pricing ─────────────────────────────────
  dealDesk: [
    "/",
    "/deal-registrations",
    "/quotes",
    "/price-lists",
    "/reports",
    "/messages",
  ],
  // ── Marketing — campaigns, MDF, assets, reports ────────────────────────────
  marketing: [
    "/",
    "/marketing-activities",
    "/mdf-requests",
    "/reports",
    "/messages",
  ],
  // ── Partner Marketing — channel campaigns, MDF, reports ───────────────────
  partnerMarketing: [
    "/",
    "/marketing-activities",
    "/mdf-requests",
    "/reports",
    "/messages",
  ],
  // ── Customer Success — health, accounts, tasks, messaging ─────────────────
  customerSuccess: ["/", "/accounts", "/renewals", "/tasks", "/messages"],
  // ── IT Operations — system health via foundry, cases as tasks, infra ────────
  // NO sales/pipeline tabs in primary.
  itOperations: ["/", "/foundry", "/tasks", "/foundry-lite"],
  // ── Security Admin — access governance, audit, foundry ────────────────────
  securityAdmin: ["/", "/foundry", "/audit-log", "/reports", "/tasks"],
  // ── Finance — credit/revenue, renewals, reports ───────────────────────────
  finance: ["/", "/reports", "/renewals", "/yoy-growth", "/foundry"],
  // ── Leadership — executive: reports, forecast/YoY, targets, no transactional
  leadership: [
    "/",
    "/reports",
    "/yoy-growth",
    "/linked-workspaces",
    "/forge-ai",
  ],
  // ── Channel Account Manager — ecosystem command center (≤7 primary) ────────
  // Partner-first; no standalone /accounts in primary.
  channelAccountManager: [
    "/",
    "/linked-workspaces",
    "/opportunities",
    "/renewals",
    "/messages",
    "/reports",
  ],
  // ── Channel Sales Manager — regional/team management (≤7 primary) ─────────
  // /team-performance & /ecosystem-performance don't exist → use /reports & /linked-workspaces
  channelSalesManager: [
    "/",
    "/linked-workspaces",
    "/reports",
    "/yoy-growth",
    "/opportunities",
    "/messages",
  ],
  // ── Channel Director — executive/strategic only (≤7 primary) ──────────────
  // /executive-performance, /ecosystem-health, /forecast → /reports, /yoy-growth, /linked-workspaces
  channelDirector: [
    "/",
    "/reports",
    "/yoy-growth",
    "/linked-workspaces",
    "/forge-ai",
  ],
};

/**
 * Secondary tabs — revealed when user clicks "+ View All".
 * Rules:
 *   - No tab that appears in primaryTabs should appear here.
 *   - No dead routes (routes that don't exist in App.tsx).
 *   - Max 6 secondary tabs to keep View All concise.
 */
export const ROLE_SECONDARY_TABS: Record<OperationalRole, string[]> = {
  // salesRep secondary: tasks, plans, promotions, price lists, ForgeAI
  salesRep: [
    "/tasks",
    "/business-plans",
    "/promotions",
    "/price-lists",
    "/forge-ai",
  ],
  // accountManager secondary: tasks, plans, promotions, price lists, ForgeAI
  accountManager: [
    "/tasks",
    "/business-plans",
    "/promotions",
    "/price-lists",
    "/forge-ai",
  ],
  // renewalSpecialist secondary: tasks, plans, price lists, ForgeAI
  renewalSpecialist: ["/tasks", "/business-plans", "/price-lists", "/forge-ai"],
  // bdr secondary: renewals, reports, marketing activities, ForgeAI
  bdr: ["/renewals", "/reports", "/marketing-activities", "/forge-ai"],
  // salesManager secondary: deal registrations, renewals, price lists, ForgeAI
  // /accounts and /opportunities already in primary — excluded
  salesManager: [
    "/deal-registrations",
    "/renewals",
    "/price-lists",
    "/messages",
    "/forge-ai",
  ],
  // regionalDirector secondary: accounts, deal registrations, messages already in primary (messages not) — safe
  regionalDirector: [
    "/accounts",
    "/deal-registrations",
    "/messages",
    "/yoy-growth",
    "/forge-ai",
  ],
  // salesOps secondary: opportunities, renewals, deal registrations, ForgeAI
  // /reports, /price-lists, /accounts, /foundry already in primary
  salesOps: [
    "/opportunities",
    "/renewals",
    "/deal-registrations",
    "/messages",
    "/forge-ai",
  ],
  // dealDesk secondary: accounts, renewals, ForgeAI
  // /deal-registrations, /quotes, /price-lists, /reports, /messages already in primary
  dealDesk: ["/accounts", "/renewals", "/forge-ai"],
  // marketing secondary: deal registrations, tasks, plans, ForgeAI
  // /marketing-activities, /mdf-requests, /reports, /messages already in primary
  marketing: ["/deal-registrations", "/tasks", "/business-plans", "/forge-ai"],
  // partnerMarketing secondary: deal registrations, tasks, plans, ForgeAI
  partnerMarketing: [
    "/deal-registrations",
    "/tasks",
    "/business-plans",
    "/forge-ai",
  ],
  // customerSuccess secondary: opportunities, reports, ForgeAI, plans
  // /accounts, /renewals, /tasks, /messages already in primary
  customerSuccess: [
    "/opportunities",
    "/reports",
    "/forge-ai",
    "/business-plans",
  ],
  // itOperations secondary: reports, messages, ForgeAI, news
  // /foundry, /tasks, /foundry-lite already in primary
  itOperations: ["/reports", "/messages", "/forge-ai", "/news"],
  // securityAdmin secondary: messages, ForgeAI, news
  // /foundry, /audit-log, /reports, /tasks already in primary
  securityAdmin: ["/messages", "/forge-ai", "/news"],
  // finance secondary: tasks, ForgeAI, news
  // /reports, /renewals, /yoy-growth, /foundry already in primary
  finance: ["/tasks", "/messages", "/forge-ai"],
  // leadership secondary: accounts, deal registrations, messages, renewals
  // /reports, /yoy-growth, /linked-workspaces, /forge-ai already in primary
  leadership: ["/accounts", "/deal-registrations", "/messages", "/renewals"],
  // channelAccountManager secondary: accounts (partner-linked), MDF, campaigns, targets (yoy), foundry-lite
  // /linked-workspaces, /opportunities, /renewals, /messages, /reports already in primary
  channelAccountManager: [
    "/accounts",
    "/mdf-requests",
    "/marketing-activities",
    "/yoy-growth",
    "/foundry-lite",
  ],
  // channelSalesManager secondary: deal registrations, accounts, tasks, ForgeAI
  // /linked-workspaces, /reports, /yoy-growth, /opportunities, /messages already in primary
  channelSalesManager: [
    "/deal-registrations",
    "/accounts",
    "/tasks",
    "/forge-ai",
  ],
  // channelDirector secondary: messages, accounts, deal registrations
  // /reports, /yoy-growth, /linked-workspaces, /forge-ai already in primary
  channelDirector: ["/messages", "/accounts", "/deal-registrations"],
};

/**
 * Derives an OperationalRole from a getUserRole() string result.
 * Maps legacy string role values to the OperationalRole keys.
 */
export function deriveOperationalRoleFromString(
  roleString: string,
): OperationalRole {
  const map: Record<string, OperationalRole> = {
    SalesRep: "salesRep",
    AccountManager: "accountManager",
    RenewalSpecialist: "renewalSpecialist",
    Marketing: "marketing",
    SalesOps: "salesOps",
    Leadership: "leadership",
    IT: "itOperations",
    DealDesk: "dealDesk",
    CustomerSuccess: "customerSuccess",
    Finance: "finance",
    // Extended role strings
    BDR: "bdr",
    SalesManager: "salesManager",
    RegionalDirector: "regionalDirector",
    PartnerMarketing: "partnerMarketing",
    SecurityAdmin: "securityAdmin",
    ChannelAccountManager: "channelAccountManager",
    ChannelSalesManager: "channelSalesManager",
    ChannelDirector: "channelDirector",
  };
  return map[roleString] ?? "salesRep";
}
// ─── Role Filter Defaults ────────────────────────────────────────────────────

/**
 * Primary filter dimensions shown first in the role-aware filter bar.
 * Each role shows its top 3–5 most contextually relevant filters.
 * Remaining filters are accessible via "+ More Filters".
 *
 * Valid filter keys: vendor, distributor, resellerGroup, product, productFamily,
 * territory, region, countryTier, customerSegment, industry,
 * opportunityStage, renewalStatus, infrastructure, integrationStatus,
 * campaignType, mdfStatus, caseType, creditUsage.
 */
export const ROLE_FILTER_DEFAULTS: Record<OperationalRole, string[]> = {
  // Sales Rep — pipeline and deal-focused filters
  salesRep: ["opportunityStage", "product", "renewalStatus", "customerSegment"],
  // Account Manager — account/partner relationship filters
  accountManager: ["vendor", "customerSegment", "renewalStatus", "region"],
  // Renewal Specialist — contract/renewal-focused
  renewalSpecialist: ["renewalStatus", "customerSegment", "product", "region"],
  // BDR — outreach and pipeline creation
  bdr: ["opportunityStage", "industry", "region", "customerSegment"],
  // Sales Manager — team/territory performance
  salesManager: ["territory", "vendor", "opportunityStage", "region"],
  // Regional Director — territory and strategic focus
  regionalDirector: ["region", "territory", "vendor", "productFamily"],
  // Sales Ops — product, pricing, pipeline operational
  salesOps: ["product", "territory", "opportunityStage", "productFamily"],
  // Deal Desk — deal velocity, pricing governance
  dealDesk: ["opportunityStage", "vendor", "product", "region"],
  // Marketing — campaign and MDF focus
  marketing: ["vendor", "productFamily", "campaignType", "region"],
  // Partner Marketing — channel campaign focus
  partnerMarketing: [
    "vendor",
    "productFamily",
    "campaignType",
    "resellerGroup",
  ],
  // Customer Success — health and adoption
  customerSuccess: ["customerSegment", "renewalStatus", "product", "region"],
  // IT Operations — infrastructure and system-health focused
  itOperations: ["region", "infrastructure", "integrationStatus", "caseType"],
  // Security Admin — access and governance
  securityAdmin: ["region", "territory", "infrastructure"],
  // Finance — credit/revenue commercial
  finance: ["vendor", "region", "productFamily", "customerSegment"],
  // Leadership — strategic view: region, territory primary
  leadership: ["region", "territory", "vendor", "productFamily"],
  // CAM — Distributor/Reseller/Vendor/Region (in that order per spec)
  channelAccountManager: [
    "distributor",
    "resellerGroup",
    "vendor",
    "region",
    "productFamily",
  ],
  // Channel Sales Manager — team/territory/vendor focus
  channelSalesManager: ["territory", "vendor", "region", "resellerGroup"],
  // Channel Director — strategic regional/ecosystem
  channelDirector: ["region", "territory", "vendor", "productFamily"],
};

// ─── Role KPIs ────────────────────────────────────────────────────────────────

export interface RoleKPI {
  label: string;
  valueKey: string;
  format: "currency" | "percent" | "number" | "date" | "score";
  trend?: "up" | "down" | "neutral";
}

export const ROLE_KPIS: Record<OperationalRole, RoleKPI[]> = {
  salesRep: [
    {
      label: "Pipeline Value",
      valueKey: "pipelineValue",
      format: "currency",
      trend: "up",
    },
    {
      label: "Closed Won This Quarter",
      valueKey: "closedWonQtd",
      format: "currency",
      trend: "up",
    },
    {
      label: "Opportunity Conversion Rate",
      valueKey: "opportunityConversionRate",
      format: "percent",
      trend: "up",
    },
    {
      label: "Renewal Value",
      valueKey: "renewalValue",
      format: "currency",
      trend: "neutral",
    },
    {
      label: "Activity Completion Rate",
      valueKey: "activityCompletionRate",
      format: "percent",
      trend: "up",
    },
    {
      label: "Meetings Booked",
      valueKey: "meetingsBooked",
      format: "number",
      trend: "up",
    },
  ],
  bdr: [
    {
      label: "Leads Qualified",
      valueKey: "leadsQualified",
      format: "number",
      trend: "up",
    },
    {
      label: "Meetings Booked",
      valueKey: "meetingsBooked",
      format: "number",
      trend: "up",
    },
    {
      label: "Outreach Activity",
      valueKey: "outreachActivity",
      format: "number",
      trend: "up",
    },
    {
      label: "Conversion Rate",
      valueKey: "conversionRate",
      format: "percent",
      trend: "up",
    },
    {
      label: "Pipeline Created",
      valueKey: "pipelineCreated",
      format: "currency",
      trend: "up",
    },
  ],
  accountManager: [
    {
      label: "Account Growth",
      valueKey: "accountGrowth",
      format: "percent",
      trend: "up",
    },
    {
      label: "Retention Rate",
      valueKey: "retentionRate",
      format: "percent",
      trend: "up",
    },
    {
      label: "Renewal Performance",
      valueKey: "renewalPerformance",
      format: "percent",
      trend: "up",
    },
    {
      label: "Partner Engagement Score",
      valueKey: "partnerEngagementScore",
      format: "score",
      trend: "up",
    },
    {
      label: "YoY Account Growth",
      valueKey: "yoyAccountGrowth",
      format: "percent",
      trend: "up",
    },
    {
      label: "Opportunity Progression",
      valueKey: "opportunityProgression",
      format: "number",
      trend: "neutral",
    },
  ],
  renewalSpecialist: [
    {
      label: "Renewal Rate",
      valueKey: "renewalRate",
      format: "percent",
      trend: "up",
    },
    {
      label: "Renewal Value",
      valueKey: "renewalValue",
      format: "currency",
      trend: "up",
    },
    {
      label: "Churn Risk",
      valueKey: "churnRisk",
      format: "number",
      trend: "down",
    },
    {
      label: "Contract Coverage",
      valueKey: "contractCoverage",
      format: "percent",
      trend: "up",
    },
    {
      label: "Renewal Forecast Accuracy",
      valueKey: "renewalForecastAccuracy",
      format: "percent",
      trend: "up",
    },
  ],
  customerSuccess: [
    {
      label: "Customer Health Score",
      valueKey: "customerHealthScore",
      format: "score",
      trend: "up",
    },
    {
      label: "Adoption Score",
      valueKey: "adoptionScore",
      format: "score",
      trend: "up",
    },
    {
      label: "Retention Rate",
      valueKey: "retentionRate",
      format: "percent",
      trend: "up",
    },
    {
      label: "Onboarding Completion",
      valueKey: "onboardingCompletion",
      format: "percent",
      trend: "up",
    },
    {
      label: "Customer Engagement",
      valueKey: "customerEngagement",
      format: "score",
      trend: "neutral",
    },
  ],
  salesManager: [
    {
      label: "Team Attainment",
      valueKey: "teamAttainment",
      format: "percent",
      trend: "up",
    },
    {
      label: "Forecast Accuracy",
      valueKey: "forecastAccuracy",
      format: "percent",
      trend: "up",
    },
    {
      label: "Pipeline Coverage",
      valueKey: "pipelineCoverage",
      format: "percent",
      trend: "up",
    },
    {
      label: "Rep Activity",
      valueKey: "repActivity",
      format: "number",
      trend: "up",
    },
    {
      label: "Conversion Rate",
      valueKey: "conversionRate",
      format: "percent",
      trend: "up",
    },
  ],
  regionalDirector: [
    {
      label: "Regional Pipeline",
      valueKey: "regionalPipeline",
      format: "currency",
      trend: "up",
    },
    {
      label: "Territory Attainment",
      valueKey: "territoryAttainment",
      format: "percent",
      trend: "up",
    },
    {
      label: "Distributor Performance",
      valueKey: "distributorPerformance",
      format: "percent",
      trend: "up",
    },
    {
      label: "YoY Regional Growth",
      valueKey: "yoyRegionalGrowth",
      format: "percent",
      trend: "up",
    },
    {
      label: "Ecosystem Health Score",
      valueKey: "ecosystemHealthScore",
      format: "score",
      trend: "up",
    },
  ],
  salesOps: [
    {
      label: "Sales Efficiency Score",
      valueKey: "salesEfficiencyScore",
      format: "score",
      trend: "up",
    },
    {
      label: "Pipeline Hygiene Score",
      valueKey: "pipelineHygieneScore",
      format: "score",
      trend: "up",
    },
    {
      label: "Quote Turnaround Time",
      valueKey: "quoteTurnaroundTime",
      format: "number",
      trend: "down",
    },
    {
      label: "Allocation Coverage",
      valueKey: "allocationCoverage",
      format: "percent",
      trend: "up",
    },
    {
      label: "Duplicate Accounts",
      valueKey: "duplicateAccounts",
      format: "number",
      trend: "down",
    },
  ],
  dealDesk: [
    {
      label: "Pending Approvals",
      valueKey: "pendingApprovalsCount",
      format: "number",
      trend: "down",
    },
    {
      label: "Avg Approval Time (hrs)",
      valueKey: "avgApprovalTimeHours",
      format: "number",
      trend: "down",
    },
    {
      label: "Pricing Exceptions This Week",
      valueKey: "pricingExceptionsWeek",
      format: "number",
      trend: "down",
    },
    {
      label: "SLA Compliance",
      valueKey: "slaCompliancePercent",
      format: "percent",
      trend: "up",
    },
    {
      label: "Quote Conversion Rate",
      valueKey: "quoteConversionRate",
      format: "percent",
      trend: "up",
    },
    {
      label: "Approval Backlog Value",
      valueKey: "approvalBacklogValue",
      format: "currency",
      trend: "down",
    },
  ],
  marketing: [
    {
      label: "Campaign Engagement Rate",
      valueKey: "campaignEngagementRate",
      format: "percent",
      trend: "up",
    },
    {
      label: "MDF Spend vs Budget",
      valueKey: "mdfSpendVsBudget",
      format: "percent",
      trend: "neutral",
    },
    { label: "MDF ROI", valueKey: "mdfRoi", format: "percent", trend: "up" },
    {
      label: "Asset Downloads",
      valueKey: "assetDownloads",
      format: "number",
      trend: "up",
    },
    {
      label: "Reseller Campaign Participation",
      valueKey: "resellerCampaignParticipation",
      format: "percent",
      trend: "up",
    },
    {
      label: "Marketing Qualified Pipeline",
      valueKey: "marketingQualifiedPipeline",
      format: "currency",
      trend: "up",
    },
  ],
  partnerMarketing: [
    {
      label: "Channel Campaign Reach",
      valueKey: "channelCampaignReach",
      format: "number",
      trend: "up",
    },
    {
      label: "MDF Activation Rate",
      valueKey: "mdfActivationRate",
      format: "percent",
      trend: "up",
    },
    {
      label: "Co-Marketing ROI",
      valueKey: "coMarketingRoi",
      format: "percent",
      trend: "up",
    },
    {
      label: "Partner Content Downloads",
      valueKey: "partnerContentDownloads",
      format: "number",
      trend: "up",
    },
    {
      label: "Reseller Engagement Score",
      valueKey: "resellerEngagementScore",
      format: "score",
      trend: "up",
    },
  ],
  finance: [
    {
      label: "Credit Burn Rate",
      valueKey: "creditBurnRate",
      format: "percent",
      trend: "down",
    },
    {
      label: "Projected Depletion Date",
      valueKey: "projectedDepletionDate",
      format: "date",
      trend: "neutral",
    },
    {
      label: "Renewal Value at Risk",
      valueKey: "renewalValueAtRisk",
      format: "currency",
      trend: "down",
    },
    {
      label: "YoY Revenue Growth",
      valueKey: "yoyRevenueGrowth",
      format: "percent",
      trend: "up",
    },
    {
      label: "QoQ Revenue",
      valueKey: "qoqRevenue",
      format: "currency",
      trend: "up",
    },
    {
      label: "Infrastructure Consumption Cost",
      valueKey: "infrastructureConsumptionCost",
      format: "currency",
      trend: "neutral",
    },
  ],
  itOperations: [
    {
      label: "System Uptime",
      valueKey: "systemUptimePercent",
      format: "percent",
      trend: "up",
    },
    {
      label: "Open Cases",
      valueKey: "openCasesCount",
      format: "number",
      trend: "down",
    },
    {
      label: "API Sync Failures",
      valueKey: "apiSyncFailures",
      format: "number",
      trend: "down",
    },
    {
      label: "Case Resolution SLA Compliance",
      valueKey: "caseResolutionSlaCompliance",
      format: "percent",
      trend: "up",
    },
    {
      label: "Failed Imports This Week",
      valueKey: "failedImportsWeek",
      format: "number",
      trend: "down",
    },
    {
      label: "Access Requests Pending",
      valueKey: "accessRequestsPending",
      format: "number",
      trend: "down",
    },
  ],
  securityAdmin: [
    {
      label: "MFA Adoption Rate",
      valueKey: "mfaAdoptionRate",
      format: "percent",
      trend: "up",
    },
    {
      label: "Failed Login Attempts",
      valueKey: "failedLoginAttempts",
      format: "number",
      trend: "down",
    },
    {
      label: "Permission Conflicts",
      valueKey: "permissionConflicts",
      format: "number",
      trend: "down",
    },
    {
      label: "Audit Alerts This Week",
      valueKey: "auditAlertsWeek",
      format: "number",
      trend: "down",
    },
    {
      label: "Access Governance Score",
      valueKey: "accessGovernanceScore",
      format: "score",
      trend: "up",
    },
  ],
  leadership: [
    {
      label: "QTD Performance vs Target",
      valueKey: "qtdPerformanceVsTarget",
      format: "percent",
      trend: "up",
    },
    {
      label: "QoQ Growth",
      valueKey: "qoqGrowthPercent",
      format: "percent",
      trend: "up",
    },
    {
      label: "YoY Revenue Growth",
      valueKey: "yoyRevenueGrowthPercent",
      format: "percent",
      trend: "up",
    },
    {
      label: "Forecast Accuracy",
      valueKey: "forecastAccuracyPercent",
      format: "percent",
      trend: "up",
    },
    {
      label: "Top Risk Count",
      valueKey: "topRiskCount",
      format: "number",
      trend: "down",
    },
    {
      label: "Ecosystem Health Score",
      valueKey: "ecosystemHealthScore",
      format: "score",
      trend: "up",
    },
  ],
  channelAccountManager: [
    {
      label: "Distributor Pipeline Value",
      valueKey: "distributorPipelineValue",
      format: "currency",
      trend: "up",
    },
    {
      label: "Reseller Growth QoQ",
      valueKey: "resellerGrowthQoq",
      format: "percent",
      trend: "up",
    },
    {
      label: "Partner Engagement Score",
      valueKey: "partnerEngagementScore",
      format: "score",
      trend: "up",
    },
    {
      label: "MDF Utilization Rate",
      valueKey: "mdfUtilizationRate",
      format: "percent",
      trend: "up",
    },
    {
      label: "Ecosystem Renewal Value",
      valueKey: "ecosystemRenewalValue",
      format: "currency",
      trend: "up",
    },
    {
      label: "Active Partner Count",
      valueKey: "activePartnerCount",
      format: "number",
      trend: "up",
    },
  ],
  channelSalesManager: [
    {
      label: "Team Attainment %",
      valueKey: "teamAttainmentPercent",
      format: "percent",
      trend: "up",
    },
    {
      label: "CAM Performance vs Target",
      valueKey: "camPerformanceVsTarget",
      format: "percent",
      trend: "up",
    },
    {
      label: "Territory Pipeline Coverage",
      valueKey: "territoryPipelineCoverage",
      format: "percent",
      trend: "up",
    },
    {
      label: "QoQ Ecosystem Growth",
      valueKey: "qoqEcosystemGrowth",
      format: "percent",
      trend: "up",
    },
    {
      label: "Forecast Accuracy",
      valueKey: "forecastAccuracy",
      format: "percent",
      trend: "up",
    },
    {
      label: "Renewal Exposure by Territory",
      valueKey: "renewalExposureByTerritory",
      format: "currency",
      trend: "neutral",
    },
  ],
  channelDirector: [
    {
      label: "YoY Ecosystem Revenue",
      valueKey: "yoyEcosystemRevenue",
      format: "percent",
      trend: "up",
    },
    {
      label: "Distributor Contribution %",
      valueKey: "distributorContributionPercent",
      format: "percent",
      trend: "up",
    },
    {
      label: "Reseller Network Growth",
      valueKey: "resellerNetworkGrowth",
      format: "percent",
      trend: "up",
    },
    {
      label: "QTD vs Target",
      valueKey: "qtdVsTarget",
      format: "percent",
      trend: "up",
    },
    {
      label: "Forecast Risk Score",
      valueKey: "forecastRiskScore",
      format: "score",
      trend: "down",
    },
    {
      label: "Tier 1 vs Tier 2 Performance",
      valueKey: "tier1VsTier2Performance",
      format: "percent",
      trend: "up",
    },
  ],
};

// ─── Homepage Widget Order ─────────────────────────────────────────────────────

export const ROLE_WIDGET_ORDER: Record<OperationalRole, string[]> = {
  salesRep: [
    "pipeline-overview",
    "account-health",
    "renewals-due",
    "task-queue",
    "forgeai-opportunity-intelligence",
  ],
  bdr: [
    "prospect-activity",
    "meetings-booked",
    "pipeline-generated",
    "callback-queue",
    "forgeai-prospecting-intelligence",
  ],
  accountManager: [
    "account-health-overview",
    "opportunity-pipeline",
    "renewal-exposure",
    "partner-health",
    "forgeai-account-intelligence",
  ],
  renewalSpecialist: [
    "renewal-queue",
    "expiring-contracts",
    "churn-risk-tracker",
    "renewal-forecast",
    "forgeai-renewal-intelligence",
  ],
  customerSuccess: [
    "customer-health-dashboard",
    "onboarding-tracker",
    "adoption-activity",
    "risk-queue",
    "forgeai-cs-intelligence",
  ],
  salesManager: [
    "team-pipeline-overview",
    "rep-performance-scorecards",
    "territory-coverage",
    "forecast-review",
    "forgeai-sales-manager-intelligence",
  ],
  regionalDirector: [
    "regional-pipeline",
    "territory-heatmap",
    "distributor-performance",
    "strategic-forecast",
    "forgeai-regional-intelligence",
  ],
  salesOps: [
    "sales-efficiency-matrix",
    "pipeline-hygiene",
    "account-allocation",
    "process-exceptions",
    "forgeai-ops-intelligence",
  ],
  dealDesk: [
    "approval-queue",
    "pricing-exception-queue",
    "quote-review",
    "sla-dashboard",
    "forgeai-deal-intelligence",
  ],
  marketing: [
    "campaign-performance",
    "mdf-tracker",
    "asset-library-activity",
    "partner-enablement",
    "forgeai-marketing-intelligence",
  ],
  partnerMarketing: [
    "partner-campaign-overview",
    "mdf-activation-tracker",
    "co-marketing-activity",
    "reseller-engagement",
    "forgeai-partner-marketing-intelligence",
  ],
  finance: [
    "credit-usage",
    "revenue-forecast",
    "infrastructure-spend",
    "commercial-risk",
    "forgeai-finance-intelligence",
  ],
  itOperations: [
    "system-health",
    "case-queue",
    "integration-monitor",
    "infrastructure-status",
    "forgeai-system-intelligence",
  ],
  securityAdmin: [
    "security-alerts",
    "mfa-compliance",
    "audit-log-summary",
    "access-governance",
    "forgeai-security-intelligence",
  ],
  leadership: [
    "executive-scorecard",
    "territory-heatmap",
    "performance-summary",
    "strategic-risk-board",
    "forgeai-executive-intelligence",
  ],
  channelAccountManager: [
    "distributor-performance",
    "reseller-performance",
    "ecosystem-health",
    "strategic-customer-exposure",
    "forgeai-ecosystem-intelligence",
  ],
  channelSalesManager: [
    "team-performance",
    "ecosystem-forecast",
    "territory-health",
    "forgeai-strategic-insights",
  ],
  channelDirector: [
    "executive-ecosystem-overview",
    "strategic-forecasting",
    "ecosystem-risk-and-opportunity",
    "forgeai-executive-intelligence",
  ],
};

// ─── Quick Actions ────────────────────────────────────────────────────────────

export interface QuickAction {
  label: string;
  icon: string;
  href: string;
  description: string;
}

export const ROLE_QUICK_ACTIONS: Record<OperationalRole, QuickAction[]> = {
  salesRep: [
    {
      label: "Create Opportunity",
      icon: "PlusCircle",
      href: "/opportunities/new",
      description: "Add a new sales opportunity to your pipeline",
    },
    {
      label: "Add Quote",
      icon: "FileText",
      href: "/quotes/new",
      description: "Generate a new quote for a customer",
    },
    {
      label: "Log Meeting",
      icon: "CalendarCheck",
      href: "/tasks/new?type=meeting",
      description: "Record a completed or upcoming meeting",
    },
    {
      label: "Set Callback",
      icon: "Phone",
      href: "/tasks/new?type=callback",
      description: "Schedule a follow-up callback for an account",
    },
    {
      label: "Update Pipeline",
      icon: "TrendingUp",
      href: "/opportunities",
      description: "Review and update your active pipeline stages",
    },
  ],
  accountManager: [
    {
      label: "Create Account Plan",
      icon: "ClipboardList",
      href: "/accounts/new",
      description: "Build a strategic plan for a key account",
    },
    {
      label: "Schedule Account Review",
      icon: "CalendarDays",
      href: "/tasks/new?type=review",
      description: "Schedule a formal account review session",
    },
    {
      label: "Update Renewal Status",
      icon: "RefreshCw",
      href: "/renewals",
      description: "Update the status of upcoming renewals",
    },
    {
      label: "Manage Linked Workspace",
      icon: "Link2",
      href: "/linked-workspaces",
      description: "Review and manage partner workspace relationships",
    },
    {
      label: "Create Opportunity",
      icon: "PlusCircle",
      href: "/opportunities/new",
      description: "Add a new growth opportunity for an account",
    },
  ],
  bdr: [
    {
      label: "Log Prospect Activity",
      icon: "Activity",
      href: "/tasks/new",
      description: "Record outreach activity for a prospect",
    },
    {
      label: "Book Meeting",
      icon: "CalendarCheck",
      href: "/tasks/new?type=meeting",
      description: "Book a discovery or qualification meeting",
    },
    {
      label: "Add New Prospect",
      icon: "UserPlus",
      href: "/accounts/new",
      description: "Add a new prospect to your outreach pipeline",
    },
    {
      label: "Update Lead Status",
      icon: "ArrowUpCircle",
      href: "/opportunities",
      description: "Progress or update the status of a lead",
    },
    {
      label: "Start Outreach Sequence",
      icon: "Send",
      href: "/messages/new",
      description: "Begin a new outreach sequence for a prospect",
    },
  ],
  renewalSpecialist: [
    {
      label: "View Renewal Queue",
      icon: "ListChecks",
      href: "/renewals",
      description: "Review all upcoming and at-risk renewals",
    },
    {
      label: "Create Renewal Quote",
      icon: "FileText",
      href: "/quotes/new",
      description: "Generate a renewal quote for an expiring contract",
    },
    {
      label: "Flag Renewal Risk",
      icon: "AlertTriangle",
      href: "/renewals",
      description: "Mark a renewal as at-risk for escalation",
    },
    {
      label: "Contact Expiring Account",
      icon: "MessageCircle",
      href: "/messages/new",
      description: "Reach out to an account with an expiring contract",
    },
    {
      label: "Update Contract Status",
      icon: "RefreshCw",
      href: "/renewals",
      description: "Update the contract stage in the renewal pipeline",
    },
  ],
  customerSuccess: [
    {
      label: "Update Customer Health",
      icon: "HeartPulse",
      href: "/accounts",
      description: "Record a health score update for a customer",
    },
    {
      label: "Create Onboarding Task",
      icon: "ClipboardList",
      href: "/tasks/new",
      description: "Add a new task to an active onboarding workflow",
    },
    {
      label: "Log Engagement Activity",
      icon: "Activity",
      href: "/tasks/new?type=engagement",
      description: "Record a customer engagement interaction",
    },
    {
      label: "Escalate Issue",
      icon: "AlertTriangle",
      href: "/tasks/new?type=escalation",
      description: "Escalate a customer risk or support issue",
    },
    {
      label: "Review Adoption Score",
      icon: "BarChart2",
      href: "/accounts",
      description: "Check and update a customer's product adoption score",
    },
  ],
  salesManager: [
    {
      label: "Review Team Pipeline",
      icon: "GitBranch",
      href: "/opportunities",
      description: "Inspect team pipeline coverage and stage distribution",
    },
    {
      label: "Run Forecast Review",
      icon: "LineChart",
      href: "/reports",
      description: "Conduct a pipeline and forecast accuracy review",
    },
    {
      label: "Assign Territory",
      icon: "MapPin",
      href: "/accounts",
      description: "Assign or reassign territory coverage to a rep",
    },
    {
      label: "Review Rep Performance",
      icon: "Users",
      href: "/reports",
      description: "Assess individual rep KPIs and activity metrics",
    },
    {
      label: "Set Team Target",
      icon: "Target",
      href: "/targets",
      description: "Define or update targets for the sales team",
    },
  ],
  regionalDirector: [
    {
      label: "Review Regional Pipeline",
      icon: "Map",
      href: "/opportunities",
      description: "Assess pipeline health across the region",
    },
    {
      label: "Review Territory Performance",
      icon: "BarChart3",
      href: "/reports",
      description: "Analyse KPI performance by territory",
    },
    {
      label: "Manage Regional Targets",
      icon: "Target",
      href: "/targets",
      description: "Set and review regional growth targets",
    },
    {
      label: "Escalate Strategic Risk",
      icon: "AlertOctagon",
      href: "/forge-ai",
      description: "Raise a strategic risk for executive review",
    },
    {
      label: "Review Reseller Performance",
      icon: "TrendingUp",
      href: "/linked-workspaces",
      description: "Check reseller attainment within your region",
    },
  ],
  salesOps: [
    {
      label: "Upload Price List",
      icon: "Upload",
      href: "/price-lists",
      description: "Import an updated price list CSV or XLSX",
    },
    {
      label: "Allocate Accounts",
      icon: "Shuffle",
      href: "/accounts",
      description: "Assign or reallocate accounts to territory owners",
    },
    {
      label: "Review Pipeline Hygiene",
      icon: "CheckCircle2",
      href: "/reports",
      description: "Audit pipeline data quality and stage accuracy",
    },
    {
      label: "Resolve Duplicate Account",
      icon: "Merge",
      href: "/accounts",
      description: "Identify and merge duplicate account records",
    },
    {
      label: "Review Sales Efficiency",
      icon: "Gauge",
      href: "/reports",
      description: "Analyse quote turnaround time and cycle lengths",
    },
  ],
  dealDesk: [
    {
      label: "Review Approval Queue",
      icon: "Inbox",
      href: "/deal-registrations",
      description: "Process pending deal and pricing approvals",
    },
    {
      label: "Check Pricing Exception",
      icon: "Percent",
      href: "/quotes",
      description: "Review and action a pricing exception request",
    },
    {
      label: "Validate Quote",
      icon: "BadgeCheck",
      href: "/quotes",
      description: "Check quote accuracy against current price list",
    },
    {
      label: "Assess Deal Registration Risk",
      icon: "ShieldAlert",
      href: "/deal-registrations",
      description: "Evaluate risk indicators on submitted deal registrations",
    },
    {
      label: "Review SLA Breach",
      icon: "Timer",
      href: "/deal-registrations",
      description: "Identify and action deals that have breached approval SLA",
    },
  ],
  marketing: [
    {
      label: "Upload Asset",
      icon: "Upload",
      href: "/marketing-activities",
      description: "Add a new asset to the partner content library",
    },
    {
      label: "Launch Campaign",
      icon: "Megaphone",
      href: "/marketing-activities",
      description: "Activate a new marketing campaign",
    },
    {
      label: "Review MDF Request",
      icon: "Wallet",
      href: "/mdf-requests",
      description: "Review and process a pending MDF request",
    },
    {
      label: "Track Engagement",
      icon: "LineChart",
      href: "/reports",
      description: "Check engagement metrics and ROI for active campaigns",
    },
    {
      label: "Create Activity Report",
      icon: "FileBarChart",
      href: "/reports",
      description: "Generate a marketing activity performance report",
    },
  ],
  partnerMarketing: [
    {
      label: "Activate Partner Campaign",
      icon: "Megaphone",
      href: "/marketing-activities",
      description: "Launch a co-branded or channel partner campaign",
    },
    {
      label: "Review Channel MDF",
      icon: "Wallet",
      href: "/mdf-requests",
      description: "Review MDF utilisation and pending channel requests",
    },
    {
      label: "Upload Partner Asset",
      icon: "Upload",
      href: "/marketing-activities",
      description: "Add co-marketing content for partner use",
    },
    {
      label: "Track Reseller Engagement",
      icon: "Users",
      href: "/reports",
      description: "Monitor reseller participation in channel campaigns",
    },
    {
      label: "Create Co-Marketing Activity",
      icon: "Handshake",
      href: "/marketing-activities",
      description: "Create a new joint marketing activity with a partner",
    },
  ],
  finance: [
    {
      label: "Review Credit Usage",
      icon: "CreditCard",
      href: "/foundry",
      description: "Check compute and AI credit burn rate",
    },
    {
      label: "Analyze Revenue Forecast",
      icon: "TrendingUp",
      href: "/reports",
      description: "Review revenue forecast vs actuals",
    },
    {
      label: "Review Infrastructure Spend",
      icon: "Server",
      href: "/foundry",
      description: "Inspect compute and storage cost breakdown",
    },
    {
      label: "Export Financial Report",
      icon: "Download",
      href: "/reports",
      description: "Generate and export a financial analytics report",
    },
    {
      label: "Flag Commercial Risk",
      icon: "AlertTriangle",
      href: "/forge-ai",
      description:
        "Raise a commercial risk, cost spike, or credit depletion alert",
    },
  ],
  itOperations: [
    {
      label: "Review System Issue",
      icon: "AlertCircle",
      href: "/foundry",
      description: "Investigate an open system health issue",
    },
    {
      label: "Resolve Case",
      icon: "CheckCircle2",
      href: "/tasks",
      description: "Work through the open case resolution queue",
    },
    {
      label: "Check Integration Status",
      icon: "PlugZap",
      href: "/foundry",
      description: "Verify sync health for active integrations",
    },
    {
      label: "Review Import Failures",
      icon: "FileX",
      href: "/foundry",
      description: "Diagnose and remediate data import failures",
    },
    {
      label: "Manage Access Request",
      icon: "KeyRound",
      href: "/foundry",
      description: "Review and action pending access requests",
    },
  ],
  securityAdmin: [
    {
      label: "Review Audit Log",
      icon: "ScrollText",
      href: "/foundry",
      description: "Inspect recent access and activity audit entries",
    },
    {
      label: "Check MFA Compliance",
      icon: "ShieldCheck",
      href: "/foundry",
      description: "Review MFA adoption rate across the organisation",
    },
    {
      label: "Resolve Permission Conflict",
      icon: "ShieldAlert",
      href: "/foundry",
      description: "Identify and resolve conflicting role permissions",
    },
    {
      label: "Review Security Alert",
      icon: "Bell",
      href: "/forge-ai",
      description: "Assess and respond to active security alerts",
    },
    {
      label: "Run Access Governance Check",
      icon: "ScanSearch",
      href: "/foundry",
      description: "Validate access assignments against governance policy",
    },
  ],
  leadership: [
    {
      label: "Review Executive Dashboard",
      icon: "LayoutDashboard",
      href: "/reports",
      description: "View strategic performance and KPI summary",
    },
    {
      label: "Run Forecast",
      icon: "TrendingUp",
      href: "/yoy-growth",
      description: "Run and review the strategic ecosystem forecast",
    },
    {
      label: "Review Strategic Risk Board",
      icon: "ShieldAlert",
      href: "/forge-ai",
      description: "Assess and respond to active strategic risks",
    },
    {
      label: "Approve Territory Plan",
      icon: "Map",
      href: "/targets",
      description: "Review and approve territory-level growth plans",
    },
    {
      label: "Review Ecosystem Performance",
      icon: "Network",
      href: "/linked-workspaces",
      description: "Review full partner ecosystem health and performance",
    },
  ],
  channelAccountManager: [
    {
      label: "Assign MDF Budget",
      icon: "Wallet",
      href: "/mdf-requests",
      description: "Allocate MDF budget to a partner or campaign",
    },
    {
      label: "Review Distributor Pipeline",
      icon: "Building2",
      href: "/linked-workspaces",
      description: "Review pipeline and attainment by Distributor",
    },
    {
      label: "Schedule Partner Review",
      icon: "CalendarDays",
      href: "/tasks/new?type=review",
      description: "Book a formal review session with a partner",
    },
    {
      label: "Log Partner Activity",
      icon: "Activity",
      href: "/tasks/new",
      description: "Record engagement or activity with a partner",
    },
    {
      label: "Create Ecosystem Report",
      icon: "BarChart2",
      href: "/reports",
      description: "Generate a partner ecosystem performance report",
    },
  ],
  channelSalesManager: [
    {
      label: "Review CAM Scorecards",
      icon: "Users",
      href: "/reports",
      description: "Review individual CAM attainment and scorecard metrics",
    },
    {
      label: "Update Territory Forecast",
      icon: "TrendingUp",
      href: "/yoy-growth",
      description: "Update and submit the regional territory forecast",
    },
    {
      label: "Review Underperforming Regions",
      icon: "AlertTriangle",
      href: "/linked-workspaces",
      description: "Identify and address regions falling below target",
    },
    {
      label: "Schedule Team Review",
      icon: "CalendarDays",
      href: "/tasks/new?type=review",
      description: "Schedule a performance review with the CAM team",
    },
    {
      label: "Run Ecosystem Report",
      icon: "BarChart2",
      href: "/reports",
      description: "Generate a full ecosystem performance report",
    },
  ],
  channelDirector: [
    {
      label: "Review Ecosystem Strategy",
      icon: "Network",
      href: "/linked-workspaces",
      description:
        "Review overarching ecosystem strategy and partner governance",
    },
    {
      label: "Executive Dashboard Review",
      icon: "LayoutDashboard",
      href: "/reports",
      description: "View strategic performance KPIs and executive summaries",
    },
    {
      label: "Approve Resource Allocation",
      icon: "CheckSquare",
      href: "/foundry",
      description: "Review and approve resource and budget allocation requests",
    },
    {
      label: "Run Strategic Forecast",
      icon: "TrendingUp",
      href: "/yoy-growth",
      description: "Run and review the strategic ecosystem forecast",
    },
    {
      label: "Review Territory Performance",
      icon: "Map",
      href: "/linked-workspaces",
      description: "Analyse territory-level performance and growth trends",
    },
  ],
};

// ─── Role Workflows ────────────────────────────────────────────────────────────

export interface RoleWorkflow {
  dailyFocus: string;
  responsibilities: string[];
  dailyTasks: string[];
  forgeAIFocus: string[];
  dataVisibility: string;
}

export const ROLE_WORKFLOWS: Record<OperationalRole, RoleWorkflow> = {
  salesRep: {
    dailyFocus:
      "Manage pipeline, engage customers, progress opportunities and track renewals",
    responsibilities: [
      "Manage opportunities and progress pipeline",
      "Engage customers and manage follow-ups",
      "Create quotes and track renewals",
      "Update CRM activity and log meetings",
    ],
    dailyTasks: [
      "Review stalled opportunities",
      "Process callback queue",
      "Update opportunity stages",
      "Generate and send quotes",
      "Check renewal due dates",
    ],
    forgeAIFocus: [
      "Stalled opportunities",
      "Renewal risk",
      "Engagement gaps",
      "Next-best actions",
    ],
    dataVisibility: "Own assigned accounts and opportunities only",
  },
  accountManager: {
    dailyFocus:
      "Manage strategic accounts and reseller/distributor relationships to drive growth",
    responsibilities: [
      "Manage strategic account portfolio",
      "Drive account growth and retention",
      "Coordinate renewals and maintain partner health",
      "Manage linked workspace relationships",
    ],
    dailyTasks: [
      "Review account health scores",
      "Check declining engagement alerts",
      "Update account plans",
      "Review renewal pipeline",
      "Manage partner relationships",
    ],
    forgeAIFocus: [
      "Declining engagement",
      "Upsell opportunities",
      "Renewal exposure",
      "Partner risk",
    ],
    dataVisibility: "Assigned accounts and linked partner organizations",
  },
  bdr: {
    dailyFocus: "Prospect, qualify leads, book meetings and generate pipeline",
    responsibilities: [
      "Outbound prospecting and territory outreach",
      "Lead qualification and pipeline generation",
      "Meeting booking and activity tracking",
      "Callback queue management",
    ],
    dailyTasks: [
      "Work prospect callback queue",
      "Log outreach activities",
      "Qualify new leads",
      "Book and confirm meetings",
      "Update pipeline created metrics",
    ],
    forgeAIFocus: [
      "Inactive prospects",
      "Outreach opportunities",
      "Engagement scoring",
    ],
    dataVisibility: "Assigned prospect accounts and outreach queue",
  },
  renewalSpecialist: {
    dailyFocus:
      "Manage the renewal pipeline, reduce churn, and coordinate retention activities",
    responsibilities: [
      "Manage renewal queues and expiring contracts",
      "Forecast renewal risk and reduce churn",
      "Coordinate retention activity and renewal quoting",
      "Monitor contract coverage",
    ],
    dailyTasks: [
      "Work expiring contract queue",
      "Review renewal risk signals",
      "Create renewal quotes",
      "Contact at-risk accounts",
      "Update renewal forecasts",
    ],
    forgeAIFocus: [
      "Renewal risk",
      "Inactive accounts",
      "Expiring contracts",
      "Engagement decline",
    ],
    dataVisibility: "Assigned renewal accounts and expiring contracts",
  },
  customerSuccess: {
    dailyFocus:
      "Drive customer adoption, monitor health scores, and enable retention",
    responsibilities: [
      "Monitor customer health and adoption scores",
      "Manage onboarding workflows",
      "Track customer engagement",
      "Escalate issues and resolve risks",
    ],
    dailyTasks: [
      "Review health score changes",
      "Check onboarding progress",
      "Log engagement activities",
      "Escalate declining accounts",
      "Update adoption metrics",
    ],
    forgeAIFocus: [
      "Low adoption",
      "Disengagement",
      "Health decline",
      "Support escalation",
    ],
    dataVisibility: "Assigned customer accounts with health and adoption data",
  },
  salesManager: {
    dailyFocus:
      "Manage sales teams, forecast pipeline, and review performance attainment",
    responsibilities: [
      "Manage and coach sales team",
      "Forecast pipeline and review attainment",
      "Monitor territory performance",
      "Conduct pipeline and forecast reviews",
    ],
    dailyTasks: [
      "Review team pipeline coverage",
      "Run forecast accuracy checks",
      "Review rep activity metrics",
      "Assign territories and accounts",
      "Coach underperforming reps",
    ],
    forgeAIFocus: [
      "Underperforming reps",
      "Forecast risk",
      "Territory weakness",
    ],
    dataVisibility: "Full team pipeline and account performance data",
  },
  regionalDirector: {
    dailyFocus:
      "Oversee regional pipeline, territory performance, and strategic growth",
    responsibilities: [
      "Manage regional sales performance",
      "Oversee territory and reseller growth",
      "Monitor strategic pipeline and forecast",
      "Drive regional ecosystem health",
    ],
    dailyTasks: [
      "Review regional pipeline",
      "Analyze territory heatmaps",
      "Check distributor performance",
      "Review strategic accounts",
      "Validate regional forecast",
    ],
    forgeAIFocus: [
      "Regional decline",
      "Territory imbalance",
      "Ecosystem gaps",
      "Strategic risk",
    ],
    dataVisibility: "Full regional pipeline, accounts, and partner performance",
  },
  salesOps: {
    dailyFocus:
      "Operational governance — pricing, allocations, process efficiency, and sales quality",
    responsibilities: [
      "Manage account allocations and territory mapping",
      "Upload and govern price lists",
      "Monitor sales efficiency and pipeline hygiene",
      "Oversee reporting governance and process optimization",
    ],
    dailyTasks: [
      "Review allocation conflicts",
      "Upload price list updates",
      "Check pipeline hygiene score",
      "Resolve duplicate accounts",
      "Review quote turnaround metrics",
    ],
    forgeAIFocus: [
      "Process bottlenecks",
      "Duplicate accounts",
      "Operational inefficiency",
    ],
    dataVisibility: "Full account and pricing data for governance purposes",
  },
  dealDesk: {
    dailyFocus:
      "Pricing approvals, deal registration review, and quote governance",
    responsibilities: [
      "Process pricing approval queues",
      "Review and validate deal registrations",
      "Handle pricing exceptions and quote governance",
      "Track SLA compliance and deal velocity",
    ],
    dailyTasks: [
      "Work approval queue",
      "Review pricing exceptions",
      "Validate deal registrations",
      "Check SLA breaches",
      "Process discount requests",
    ],
    forgeAIFocus: ["Stalled approvals", "Margin risk", "Duplicate deals"],
    dataVisibility:
      "Deal registrations, quotes, and pricing across the organization",
  },
  marketing: {
    dailyFocus: "Manage campaigns, MDF budgets, assets, and partner enablement",
    responsibilities: [
      "Plan and execute campaigns",
      "Manage MDF requests and ROI tracking",
      "Oversee asset library and partner enablement",
      "Track campaign engagement and pipeline influence",
    ],
    dailyTasks: [
      "Review campaign performance",
      "Process MDF requests",
      "Upload and manage assets",
      "Track partner engagement",
      "Monitor campaign ROI",
    ],
    forgeAIFocus: [
      "Low campaign adoption",
      "MDF underuse",
      "Reseller engagement",
    ],
    dataVisibility:
      "Campaign data, MDF budgets, and partner engagement metrics",
  },
  partnerMarketing: {
    dailyFocus:
      "Drive channel marketing, partner campaigns, and MDF activation",
    responsibilities: [
      "Activate partner and channel campaigns",
      "Manage co-marketing activities with resellers",
      "Track MDF utilization and ROI",
      "Enable reseller marketing content",
    ],
    dailyTasks: [
      "Review partner campaign activations",
      "Process channel MDF requests",
      "Upload co-marketing assets",
      "Track reseller engagement metrics",
      "Review channel pipeline influence",
    ],
    forgeAIFocus: [
      "Channel campaign adoption",
      "MDF activation gaps",
      "Partner marketing ROI",
    ],
    dataVisibility: "Channel partner campaigns and MDF data",
  },
  finance: {
    dailyFocus:
      "Monitor credit usage, revenue forecasting, and commercial cost governance",
    responsibilities: [
      "Monitor compute and credit consumption",
      "Track revenue forecasting and YoY performance",
      "Analyze infrastructure spend and costs",
      "Produce commercial analytics and reports",
    ],
    dailyTasks: [
      "Review credit burn rate",
      "Check infrastructure consumption",
      "Update revenue forecast",
      "Flag commercial risks",
      "Export financial reports",
    ],
    forgeAIFocus: ["Credit depletion", "Cost spikes", "Revenue risk"],
    dataVisibility: "Org-wide credit, revenue, and infrastructure cost data",
  },
  itOperations: {
    dailyFocus:
      "Maintain system health, manage integrations, and resolve operational cases",
    responsibilities: [
      "Monitor system uptime and integration health",
      "Manage and resolve support cases",
      "Oversee access management and imports",
      "Govern infrastructure and security",
    ],
    dailyTasks: [
      "Review open system issues",
      "Check integration sync status",
      "Process import failure logs",
      "Manage access requests",
      "Review case resolution SLA",
    ],
    forgeAIFocus: [
      "Integration failure",
      "Infrastructure risk",
      "Access conflicts",
    ],
    dataVisibility:
      "System health, cases, integrations, and infrastructure data",
  },
  securityAdmin: {
    dailyFocus:
      "Govern access, monitor MFA compliance, review audit logs, and resolve security alerts",
    responsibilities: [
      "Manage role permissions and access governance",
      "Monitor MFA compliance and failed access",
      "Review audit logs and security events",
      "Resolve permission conflicts",
    ],
    dailyTasks: [
      "Review security audit log",
      "Check MFA adoption rate",
      "Resolve access conflicts",
      "Review failed login attempts",
      "Validate role permission assignments",
    ],
    forgeAIFocus: [
      "Unusual access patterns",
      "Permission conflicts",
      "Governance gaps",
    ],
    dataVisibility: "Full access governance, audit logs, and security data",
  },
  leadership: {
    dailyFocus:
      "Strategic command — growth governance, forecasting, and ecosystem health",
    responsibilities: [
      "Oversee strategic growth and YoY performance",
      "Govern forecasting and target attainment",
      "Monitor ecosystem health across org types",
      "Drive executive decision-making with intelligence",
    ],
    dailyTasks: [
      "Review executive performance dashboard",
      "Analyze strategic forecast",
      "Review territory heatmap",
      "Check YoY growth variance",
      "Assess ecosystem risks and opportunities",
    ],
    forgeAIFocus: [
      "Strategic risk",
      "Territory weakness",
      "Ecosystem opportunity",
      "Forecast deviation",
    ],
    dataVisibility: "Full org-wide strategic, commercial, and ecosystem data",
  },
  channelAccountManager: {
    dailyFocus:
      "Partner ecosystem health, Distributor and Reseller performance, ecosystem pipeline growth",
    responsibilities: [
      "Manage Distributor relationships",
      "Manage Reseller relationships",
      "Drive partner ecosystem health",
      "Channel growth and partner enablement",
      "Strategic partner execution",
      "Partner pipeline management",
    ],
    dailyTasks: [
      "Review Distributor pipeline by territory",
      "Check Reseller activation status",
      "Review partner-led opportunities",
      "Update ecosystem health metrics",
      "Log partner engagement activity",
      "Review MDF utilization status",
    ],
    forgeAIFocus: [
      "Distributor pipeline trends by territory",
      "Reseller engagement and activation gaps",
      "Partner-led renewal risk",
      "MDF underutilization alerts",
      "Ecosystem coverage gaps",
      "YoY partner growth deviations",
    ],
    dataVisibility:
      "Assigned partners only, linked customer accounts through partner lens, partner KPIs, no unlinked customer accounts",
  },
  channelSalesManager: {
    dailyFocus:
      "CAM team performance, regional ecosystem execution, partner growth strategy governance",
    responsibilities: [
      "Manage teams of CAMs",
      "Regional ecosystem performance oversight",
      "Territory execution governance",
      "Partner growth strategy",
      "Forecast governance",
      "Reseller and Distributor performance rollup",
    ],
    dailyTasks: [
      "Review CAM territory scorecards",
      "Assess regional ecosystem forecast variance",
      "Review Distributor pipeline contributions",
      "Check territory health indicators",
      "Approve CAM-submitted targets",
      "Review Tier 1 vs Tier 2 performance",
    ],
    forgeAIFocus: [
      "CAM territory performance deviations",
      "Underperforming regional ecosystems",
      "Forecast risk concentrations",
      "Renewal risk by region",
      "Territory imbalances between Tier 1 and Tier 2",
      "Team attainment trends",
    ],
    dataVisibility:
      "All CAM territories in region, regional ecosystem summaries, team performance aggregates, no individual customer account detail",
  },
  channelDirector: {
    dailyFocus:
      "Ecosystem strategy, regional growth governance, Distributor and reseller strategic forecasting",
    responsibilities: [
      "Ecosystem strategy oversight",
      "Regional growth governance",
      "Distributor and reseller strategic governance",
      "Strategic forecasting",
      "Channel profitability management",
      "Territory strategy",
      "Leadership execution",
    ],
    dailyTasks: [
      "Review executive ecosystem overview KPIs",
      "Assess strategic forecasting deviations",
      "Review Distributor governance health",
      "Monitor ecosystem risk concentration",
      "Review Channel Sales Manager rollups",
      "Review regional forecast accuracy",
    ],
    forgeAIFocus: [
      "Strategic ecosystem forecast deviations",
      "Partner concentration risk alerts",
      "Regional performance outliers",
      "Renewal exposure in strategic accounts",
      "Ecosystem profitability trends",
      "Territory strategy opportunities",
    ],
    dataVisibility:
      "Aggregated strategic reporting only, territory intelligence rollups, executive forecasting, no tactical operational detail",
  },
};

// ─── Role Data Restrictions ────────────────────────────────────────────────────

/**
 * Lists UI section identifiers that should be completely hidden (not grayed out)
 * for each operational role. Sections: pricing-governance, admin-foundry,
 * credit-usage, mdf-management, security-governance, team-performance,
 * infrastructure-management, system-health, deal-approvals, campaign-management.
 */
export const ROLE_DATA_RESTRICTIONS: Record<OperationalRole, string[]> = {
  salesRep: [
    "pricing-governance",
    "admin-foundry",
    "credit-usage",
    "security-governance",
    "team-performance",
    "infrastructure-management",
    "system-health",
    "deal-approvals",
  ],
  accountManager: [
    "pricing-governance",
    "admin-foundry",
    "credit-usage",
    "security-governance",
    "team-performance",
    "infrastructure-management",
    "system-health",
  ],
  bdr: [
    "pricing-governance",
    "admin-foundry",
    "credit-usage",
    "security-governance",
    "team-performance",
    "infrastructure-management",
    "system-health",
    "deal-approvals",
    "mdf-management",
  ],
  renewalSpecialist: [
    "pricing-governance",
    "admin-foundry",
    "credit-usage",
    "security-governance",
    "team-performance",
    "infrastructure-management",
    "system-health",
    "deal-approvals",
    "campaign-management",
  ],
  customerSuccess: [
    "pricing-governance",
    "admin-foundry",
    "credit-usage",
    "security-governance",
    "team-performance",
    "infrastructure-management",
    "system-health",
    "deal-approvals",
    "campaign-management",
  ],
  salesManager: [
    "pricing-governance",
    "admin-foundry",
    "credit-usage",
    "security-governance",
    "infrastructure-management",
    "system-health",
    "mdf-management",
  ],
  regionalDirector: [
    "pricing-governance",
    "admin-foundry",
    "credit-usage",
    "security-governance",
    "infrastructure-management",
    "system-health",
    "mdf-management",
  ],
  salesOps: [
    "credit-usage",
    "security-governance",
    "infrastructure-management",
    "system-health",
    "mdf-management",
  ],
  dealDesk: [
    "admin-foundry",
    "credit-usage",
    "security-governance",
    "team-performance",
    "infrastructure-management",
    "system-health",
    "campaign-management",
  ],
  marketing: [
    "pricing-governance",
    "admin-foundry",
    "credit-usage",
    "security-governance",
    "team-performance",
    "infrastructure-management",
    "system-health",
    "deal-approvals",
  ],
  partnerMarketing: [
    "pricing-governance",
    "admin-foundry",
    "credit-usage",
    "security-governance",
    "team-performance",
    "infrastructure-management",
    "system-health",
    "deal-approvals",
  ],
  finance: [
    "admin-foundry",
    "security-governance",
    "team-performance",
    "infrastructure-management",
    "system-health",
    "deal-approvals",
    "campaign-management",
  ],
  itOperations: [
    "pricing-governance",
    "credit-usage",
    "mdf-management",
    "campaign-management",
    "team-performance",
  ],
  securityAdmin: [
    "pricing-governance",
    "credit-usage",
    "mdf-management",
    "campaign-management",
    "team-performance",
  ],
  leadership: [],
  channelAccountManager: [
    "direct-customer-accounts",
    "it-infrastructure",
    "security-admin",
    "deal-desk-approvals",
    "price-list-management",
    "foundry-full",
  ],
  channelSalesManager: [
    "direct-customer-accounts",
    "individual-opportunity-detail",
    "it-infrastructure",
    "security-admin",
    "foundry-full",
    "price-list-management",
  ],
  channelDirector: [
    "individual-task-management",
    "direct-customer-accounts",
    "it-infrastructure",
    "security-admin",
    "deal-desk-approvals",
    "price-list-management",
    "foundry-full",
    "individual-opportunity-detail",
  ],
};
