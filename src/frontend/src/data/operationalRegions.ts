// Canonical operational regions data for CHANNELFORGE infrastructure selection.
// Used by OperationalRegionSelector, onboarding flows, and The Foundry.

export interface SubRegion {
  name: string;
}

export interface OperationalRegion {
  id: string;
  name: string;
  icon: string;
  subRegions: SubRegion[];
  optimizedFor: [string, string, string];
  environmentLabel: string;
  isAvailable: boolean;
}

export const OPERATIONAL_REGIONS: OperationalRegion[] = [
  {
    id: "europe",
    name: "Europe",
    icon: "🇪🇺",
    subRegions: [
      { name: "Switzerland" },
      { name: "Germany" },
      { name: "Nordics" },
      { name: "UK" },
    ],
    optimizedFor: [
      "European operational governance",
      "Regional operational workloads",
      "Low-latency European servicing",
    ],
    environmentLabel: "Shared Operational Environment",
    isAvailable: true,
  },
  {
    id: "north-america",
    name: "North America",
    icon: "🌎",
    subRegions: [{ name: "US East" }, { name: "US West" }, { name: "Canada" }],
    optimizedFor: [
      "North American compliance frameworks",
      "US & Canadian data residency",
      "Enterprise-scale workload distribution",
    ],
    environmentLabel: "Shared Operational Environment",
    isAvailable: true,
  },
  {
    id: "apac",
    name: "APAC",
    icon: "🌏",
    subRegions: [
      { name: "Singapore" },
      { name: "Japan" },
      { name: "Australia" },
    ],
    optimizedFor: [
      "Asia-Pacific operational governance",
      "APAC data residency requirements",
      "Low-latency regional servicing",
    ],
    environmentLabel: "Shared Operational Environment",
    isAvailable: true,
  },
  {
    id: "middle-east",
    name: "Middle East",
    icon: "🌍",
    subRegions: [{ name: "UAE" }],
    optimizedFor: [
      "Gulf & MENA operational environments",
      "Regional data sovereignty alignment",
      "Enterprise infrastructure governance",
    ],
    environmentLabel: "Shared Operational Environment",
    isAvailable: true,
  },
  {
    id: "latam",
    name: "LATAM",
    icon: "🌎",
    subRegions: [{ name: "Brazil" }],
    optimizedFor: [
      "Latin American operational coverage",
      "Regional compliance and data governance",
      "South American enterprise servicing",
    ],
    environmentLabel: "Shared Operational Environment",
    isAvailable: true,
  },
];
