import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookUser,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Globe,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Search,
  Shield,
  Star,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrgType = "Vendor" | "Distributor" | "Reseller" | "Global Distributor";
type VisibilityTier =
  | "Private"
  | "Department-Shared"
  | "Organization-Shared"
  | "Hierarchy-Shared";

type StakeholderTag =
  | "Strategic Contact"
  | "Renewal Owner"
  | "Escalation Contact"
  | "Technical Lead"
  | "Marketing Lead"
  | "Executive Sponsor"
  | "Deal Desk"
  | "Operations Lead";

interface Stakeholder {
  id: string;
  name: string;
  initials: string;
  email: string;
  employeeNumber: string;
  organization: string;
  orgType: OrgType;
  department: string;
  role: string;
  territory: string;
  linkedVendor?: string;
  linkedDistributor?: string;
  linkedReseller?: string;
  assignedAccounts: string[];
  visibilityTier: VisibilityTier;
  tags: StakeholderTag[];
  avatarColor: string;
  recentCollaboration?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_STAKEHOLDERS: Stakeholder[] = [
  {
    id: "sh-01",
    name: "Sarah Mitchell",
    initials: "SM",
    email: "s.mitchell@ingrammicro.com",
    employeeNumber: "IM-4421",
    organization: "Ingram Micro",
    orgType: "Distributor",
    department: "Account Management",
    role: "Account Manager",
    territory: "EMEA North",
    linkedVendor: "ChannelForge Vendor Co.",
    linkedReseller: "Apex Partners",
    assignedAccounts: ["TechCorp", "Nordic Energy Group", "Bluewave Solutions"],
    visibilityTier: "Hierarchy-Shared",
    tags: ["Strategic Contact", "Renewal Owner"],
    avatarColor: "bg-sky-500/20 border-sky-500/30 text-sky-300",
    recentCollaboration: "2 days ago",
  },
  {
    id: "sh-02",
    name: "James Porter",
    initials: "JP",
    email: "j.porter@channelforge-vendor.com",
    employeeNumber: "VND-1102",
    organization: "ChannelForge Vendor Co.",
    orgType: "Vendor",
    department: "Channel Sales",
    role: "Senior Channel Manager",
    territory: "Global",
    linkedDistributor: "Ingram Micro",
    assignedAccounts: ["Acme Corp", "TechVision Ltd", "Global Pharma Holdings"],
    visibilityTier: "Organization-Shared",
    tags: ["Executive Sponsor", "Strategic Contact"],
    avatarColor: "bg-violet-500/20 border-violet-500/30 text-violet-300",
    recentCollaboration: "Today",
  },
  {
    id: "sh-03",
    name: "Priya Sharma",
    initials: "PS",
    email: "p.sharma@apex-partners.com",
    employeeNumber: "APX-0832",
    organization: "Apex Partners",
    orgType: "Reseller",
    department: "Deal Desk",
    role: "Deal Desk Analyst",
    territory: "UK & Ireland",
    linkedVendor: "ChannelForge Vendor Co.",
    linkedDistributor: "Ingram Micro",
    assignedAccounts: ["TechVision Ltd", "Stratos Digital"],
    visibilityTier: "Hierarchy-Shared",
    tags: ["Deal Desk", "Escalation Contact"],
    avatarColor: "bg-orange-500/20 border-orange-500/30 text-orange-300",
    recentCollaboration: "Today",
  },
  {
    id: "sh-04",
    name: "Michael Torres",
    initials: "MT",
    email: "m.torres@ingrammicro.com",
    employeeNumber: "IM-3851",
    organization: "Ingram Micro",
    orgType: "Distributor",
    department: "Sales Management",
    role: "Sales Manager",
    territory: "EMEA South",
    linkedVendor: "ChannelForge Vendor Co.",
    assignedAccounts: ["Desperado", "Nordic Energy Group"],
    visibilityTier: "Organization-Shared",
    tags: ["Operations Lead", "Strategic Contact"],
    avatarColor: "bg-teal-500/20 border-teal-500/30 text-teal-300",
    recentCollaboration: "Yesterday",
  },
  {
    id: "sh-05",
    name: "Anna Clarke",
    initials: "AC",
    email: "a.clarke@channelforge-vendor.com",
    employeeNumber: "VND-2241",
    organization: "ChannelForge Vendor Co.",
    orgType: "Vendor",
    department: "Product Sales",
    role: "Renewal Specialist",
    territory: "EMEA",
    linkedDistributor: "Ingram Micro",
    assignedAccounts: ["LumiTech", "Corelink Solutions"],
    visibilityTier: "Department-Shared",
    tags: ["Renewal Owner"],
    avatarColor: "bg-pink-500/20 border-pink-500/30 text-pink-300",
    recentCollaboration: "Today",
  },
  {
    id: "sh-06",
    name: "Tom Richards",
    initials: "TR",
    email: "t.richards@apex-partners.com",
    employeeNumber: "APX-0551",
    organization: "Apex Partners",
    orgType: "Reseller",
    department: "Marketing",
    role: "Marketing Lead",
    territory: "UK & Ireland",
    linkedDistributor: "Ingram Micro",
    assignedAccounts: ["Apex Partners"],
    visibilityTier: "Department-Shared",
    tags: ["Marketing Lead"],
    avatarColor: "bg-lime-500/20 border-lime-500/30 text-lime-300",
    recentCollaboration: "3 days ago",
  },
  {
    id: "sh-07",
    name: "Rachel Kim",
    initials: "RK",
    email: "r.kim@channelforge-vendor.com",
    employeeNumber: "VND-1987",
    organization: "ChannelForge Vendor Co.",
    orgType: "Vendor",
    department: "Customer Success",
    role: "Customer Success Manager",
    territory: "APAC",
    linkedDistributor: "Ingram Micro",
    assignedAccounts: ["Corelink Solutions", "Bluewave Solutions"],
    visibilityTier: "Organization-Shared",
    tags: ["Escalation Contact", "Technical Lead"],
    avatarColor: "bg-cyan-500/20 border-cyan-500/30 text-cyan-300",
    recentCollaboration: "Yesterday",
  },
  {
    id: "sh-08",
    name: "David Okafor",
    initials: "DO",
    email: "d.okafor@ingrammicro.com",
    employeeNumber: "IM-5031",
    organization: "Ingram Micro",
    orgType: "Distributor",
    department: "Sales Operations",
    role: "Sales Ops Analyst",
    territory: "EMEA",
    linkedVendor: "ChannelForge Vendor Co.",
    assignedAccounts: ["Nordic Energy Group", "Global Pharma Holdings"],
    visibilityTier: "Organization-Shared",
    tags: ["Operations Lead"],
    avatarColor: "bg-amber-500/20 border-amber-500/30 text-amber-300",
    recentCollaboration: "1 week ago",
  },
  {
    id: "sh-09",
    name: "Lisa Chen",
    initials: "LC",
    email: "l.chen@channelforge-vendor.com",
    employeeNumber: "VND-0741",
    organization: "ChannelForge Vendor Co.",
    orgType: "Vendor",
    department: "Finance",
    role: "Finance Partner",
    territory: "Global",
    assignedAccounts: ["Acme Corp"],
    visibilityTier: "Private",
    tags: [],
    avatarColor: "bg-slate-500/20 border-slate-500/30 text-slate-300",
    recentCollaboration: "Yesterday",
  },
  {
    id: "sh-10",
    name: "Carlos Vega",
    initials: "CV",
    email: "c.vega@nordtech-reseller.com",
    employeeNumber: "NTR-1122",
    organization: "NordTech Resellers",
    orgType: "Reseller",
    department: "Channel Sales",
    role: "Territory Owner",
    territory: "Nordics",
    linkedVendor: "ChannelForge Vendor Co.",
    linkedDistributor: "Ingram Micro",
    assignedAccounts: ["Nordic Energy Group", "Desperado"],
    visibilityTier: "Hierarchy-Shared",
    tags: ["Strategic Contact", "Operations Lead"],
    avatarColor: "bg-blue-500/20 border-blue-500/30 text-blue-300",
    recentCollaboration: "4 days ago",
  },
  {
    id: "sh-11",
    name: "Emma Walsh",
    initials: "EW",
    email: "e.walsh@channelforge-vendor.com",
    employeeNumber: "VND-3302",
    organization: "ChannelForge Vendor Co.",
    orgType: "Vendor",
    department: "Executive Leadership",
    role: "VP Channel Sales",
    territory: "Global",
    linkedDistributor: "Ingram Micro",
    assignedAccounts: ["Global Pharma Holdings", "Desperado"],
    visibilityTier: "Organization-Shared",
    tags: ["Executive Sponsor", "Strategic Contact"],
    avatarColor: "bg-purple-500/20 border-purple-500/30 text-purple-300",
    recentCollaboration: "2 days ago",
  },
  {
    id: "sh-12",
    name: "Kenji Nakamura",
    initials: "KN",
    email: "k.nakamura@apex-partners.com",
    employeeNumber: "APX-1441",
    organization: "Apex Partners",
    orgType: "Reseller",
    department: "Technical Sales",
    role: "Solutions Architect",
    territory: "UK & Ireland",
    linkedVendor: "ChannelForge Vendor Co.",
    linkedDistributor: "Ingram Micro",
    assignedAccounts: ["TechVision Ltd", "LumiTech"],
    visibilityTier: "Hierarchy-Shared",
    tags: ["Technical Lead"],
    avatarColor: "bg-indigo-500/20 border-indigo-500/30 text-indigo-300",
    recentCollaboration: "5 days ago",
  },
  {
    id: "sh-13",
    name: "Fatima Al-Rashid",
    initials: "FA",
    email: "f.alrashid@ingrammicro.com",
    employeeNumber: "IM-6671",
    organization: "Ingram Micro",
    orgType: "Distributor",
    department: "Renewals",
    role: "Renewal Specialist",
    territory: "MENA",
    linkedVendor: "ChannelForge Vendor Co.",
    assignedAccounts: ["Desperado", "Stratos Digital"],
    visibilityTier: "Department-Shared",
    tags: ["Renewal Owner", "Escalation Contact"],
    avatarColor: "bg-rose-500/20 border-rose-500/30 text-rose-300",
    recentCollaboration: "Today",
  },
  {
    id: "sh-14",
    name: "Oliver Grant",
    initials: "OG",
    email: "o.grant@channelforge-vendor.com",
    employeeNumber: "VND-2891",
    organization: "ChannelForge Vendor Co.",
    orgType: "Vendor",
    department: "IT & Security",
    role: "Security Operations Lead",
    territory: "Global",
    assignedAccounts: [],
    visibilityTier: "Private",
    tags: ["Operations Lead"],
    avatarColor: "bg-gray-500/20 border-gray-500/30 text-muted-foreground",
    recentCollaboration: "1 week ago",
  },
  {
    id: "sh-15",
    name: "Yuki Tanaka",
    initials: "YT",
    email: "y.tanaka@global-dist.com",
    employeeNumber: "GD-0091",
    organization: "Global Distributors Ltd",
    orgType: "Global Distributor",
    department: "Strategic Accounts",
    role: "Global Account Director",
    territory: "APAC & EMEA",
    linkedVendor: "ChannelForge Vendor Co.",
    assignedAccounts: ["Global Pharma Holdings", "Nordic Energy Group"],
    visibilityTier: "Hierarchy-Shared",
    tags: ["Executive Sponsor", "Strategic Contact"],
    avatarColor: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300",
    recentCollaboration: "3 days ago",
  },
];

const MY_CONTACTS_IDS = ["sh-01", "sh-02", "sh-03", "sh-04", "sh-05", "sh-07"];

// ─── Visibility badge ─────────────────────────────────────────────────────────

const VISIBILITY_CONFIG: Record<
  VisibilityTier,
  { label: string; icon: React.ReactNode; classes: string }
> = {
  Private: {
    label: "Private",
    icon: <Lock size={9} />,
    classes: "bg-muted/40 text-muted-foreground border-border",
  },
  "Department-Shared": {
    label: "Dept",
    icon: <Users size={9} />,
    classes: "bg-teal-500/10 text-teal-300 border-teal-500/20",
  },
  "Organization-Shared": {
    label: "Org",
    icon: <Globe size={9} />,
    classes: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  },
  "Hierarchy-Shared": {
    label: "Hierarchy",
    icon: <Shield size={9} />,
    classes: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  },
};

const TAG_COLORS: Record<StakeholderTag, string> = {
  "Strategic Contact": "bg-accent/10 text-accent border-accent/20",
  "Renewal Owner": "bg-sky-500/10 text-sky-300 border-sky-500/20",
  "Escalation Contact": "bg-orange-500/10 text-orange-300 border-orange-500/20",
  "Technical Lead": "bg-teal-500/10 text-teal-300 border-teal-500/20",
  "Marketing Lead": "bg-pink-500/10 text-pink-300 border-pink-500/20",
  "Executive Sponsor": "bg-violet-500/10 text-violet-300 border-violet-500/20",
  "Deal Desk": "bg-amber-500/10 text-amber-300 border-amber-500/20",
  "Operations Lead": "bg-lime-500/10 text-lime-300 border-lime-500/20",
};

function VisibilityBadge({ tier }: { tier: VisibilityTier }) {
  const cfg = VISIBILITY_CONFIG[tier];
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold border ${cfg.classes}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function TagBadge({ tag }: { tag: StakeholderTag }) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium border ${TAG_COLORS[tag]}`}
    >
      {tag}
    </span>
  );
}

// ─── Filter dropdown ──────────────────────────────────────────────────────────

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}

function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);

  function toggle(opt: string) {
    onChange(
      selected.includes(opt)
        ? selected.filter((v) => v !== opt)
        : [...selected, opt],
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center justify-between gap-1.5 px-2.5 py-2 rounded-lg text-xs border transition-colors ${
          selected.length > 0
            ? "bg-accent/10 border-accent/30 text-accent"
            : "bg-input border-border text-muted-foreground hover:border-accent/30"
        }`}
      >
        <span className="truncate">
          {selected.length > 0 ? `${label} (${selected.length})` : label}
        </span>
        <ChevronDown
          size={11}
          className={`flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
          <div className="max-h-44 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between gap-2 transition-colors hover:bg-muted/20 ${
                  selected.includes(opt)
                    ? "text-accent"
                    : "text-muted-foreground"
                }`}
              >
                <span>{opt}</span>
                {selected.includes(opt) && (
                  <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
          {selected.length > 0 && (
            <div className="border-t border-border">
              <button
                type="button"
                onClick={() => onChange([])}
                className="w-full px-3 py-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Stakeholder card ──────────────────────────────────────────────────────────

function StakeholderCard({
  stakeholder,
  isAdmin,
  onMessage,
  index,
}: {
  stakeholder: Stakeholder;
  isAdmin: boolean;
  onMessage: (s: Stakeholder) => void;
  index: number;
}) {
  return (
    <div
      className="cf-card rounded-2xl p-4 flex flex-col gap-3 hover:border-accent/30 transition-all relative group"
      data-ocid={`user_finder.stakeholder.item.${index}`}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 border ${stakeholder.avatarColor}`}
        >
          {stakeholder.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-foreground truncate">
                {stakeholder.name}
              </div>
              <div className="text-[11px] text-muted-foreground truncate">
                {stakeholder.role}
              </div>
            </div>
            <VisibilityBadge tier={stakeholder.visibilityTier} />
          </div>
        </div>
      </div>

      {/* Meta info */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Building2 size={9} className="flex-shrink-0" />
          <span className="truncate">
            {stakeholder.organization}
            <span className="ml-1 opacity-60">· {stakeholder.orgType}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Briefcase size={9} className="flex-shrink-0" />
          <span className="truncate">{stakeholder.department}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <MapPin size={9} className="flex-shrink-0" />
          <span className="truncate">{stakeholder.territory}</span>
        </div>
      </div>

      {/* Tags */}
      {stakeholder.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {stakeholder.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}

      {/* Action row — visible on hover OR keyboard focus-within */}
      <div className="flex flex-wrap items-center gap-1.5 transition-all duration-150 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
        <button
          type="button"
          data-ocid={`user_finder.message_button.${index}`}
          onClick={() => onMessage(stakeholder)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
        >
          <MessageSquare size={10} /> Message
        </button>
        <button
          type="button"
          data-ocid={`user_finder.view_profile_button.${index}`}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium border border-border text-muted-foreground hover:text-foreground hover:border-accent/30 transition-colors"
        >
          View Profile
        </button>
        <button
          type="button"
          data-ocid={`user_finder.view_accounts_button.${index}`}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium border border-border text-muted-foreground hover:text-foreground hover:border-accent/30 transition-colors"
        >
          Accounts
        </button>
        <button
          type="button"
          data-ocid={`user_finder.view_territory_button.${index}`}
          onClick={() =>
            toast.info(`Territory: ${stakeholder.territory}`, {
              description: `${stakeholder.name} covers the ${stakeholder.territory} territory.`,
            })
          }
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium border border-border text-muted-foreground hover:text-foreground hover:border-accent/30 transition-colors"
        >
          View Territory
        </button>
        <button
          type="button"
          data-ocid={`user_finder.view_department_button.${index}`}
          onClick={() =>
            toast.info(`Department: ${stakeholder.department}`, {
              description: `${stakeholder.name} is in the ${stakeholder.department} department at ${stakeholder.organization}.`,
            })
          }
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium border border-border text-muted-foreground hover:text-foreground hover:border-accent/30 transition-colors"
        >
          View Department
        </button>
        <button
          type="button"
          data-ocid={`user_finder.view_role_button.${index}`}
          onClick={() =>
            toast.info(`Role: ${stakeholder.role}`, {
              description: `${stakeholder.name} operates as ${stakeholder.role} within ${stakeholder.organization}.`,
            })
          }
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium border border-border text-muted-foreground hover:text-foreground hover:border-accent/30 transition-colors"
        >
          View Role
        </button>
        {isAdmin && (
          <div className="ml-auto">
            <select
              aria-label="Change visibility tier"
              defaultValue={stakeholder.visibilityTier}
              className="text-[9px] bg-transparent border border-border rounded-md px-1.5 py-1 text-muted-foreground hover:border-accent/30 outline-none cursor-pointer"
            >
              <option value="Private">Private</option>
              <option value="Department-Shared">Dept</option>
              <option value="Organization-Shared">Org</option>
              <option value="Hierarchy-Shared">Hierarchy</option>
            </select>
          </div>
        )}
      </div>

      {/* Bottom meta */}
      {stakeholder.recentCollaboration && (
        <div className="text-[9px] text-muted-foreground/60 pt-1 border-t border-border/50">
          Last collaborated: {stakeholder.recentCollaboration}
        </div>
      )}
    </div>
  );
}

// ─── Filter panel ─────────────────────────────────────────────────────────────

interface Filters {
  orgType: string[];
  territory: string[];
  department: string[];
  role: string[];
  linkedVendor: string[];
  linkedDistributor: string[];
  linkedReseller: string[];
  accountOwnership: string[];
  visibilityType: string[];
  recentCollaboration: string[];
}

const DEFAULT_FILTERS: Filters = {
  orgType: [],
  territory: [],
  department: [],
  role: [],
  linkedVendor: [],
  linkedDistributor: [],
  linkedReseller: [],
  accountOwnership: [],
  visibilityType: [],
  recentCollaboration: [],
};

function FilterPanel({
  filters,
  onChange,
  collapsed,
  onToggleCollapse,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const activeCount = Object.values(filters).flat().length;

  function setFilter<K extends keyof Filters>(key: K, val: string[]) {
    onChange({ ...filters, [key]: val });
  }

  function clearAll() {
    onChange(DEFAULT_FILTERS);
  }

  return (
    <div
      className={`flex-shrink-0 flex flex-col bg-card/30 border-r border-border transition-all duration-300 ${
        collapsed ? "w-10" : "w-52"
      }`}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-1.5">
            <Filter size={11} className="text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">
              Filters
            </span>
            {activeCount > 0 && (
              <span className="text-[9px] font-bold bg-accent text-accent-foreground rounded-full px-1.5 py-0.5">
                {activeCount}
              </span>
            )}
          </div>
        )}
        <button
          type="button"
          data-ocid="user_finder.filter_panel.toggle"
          onClick={onToggleCollapse}
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors"
          aria-label={collapsed ? "Expand filters" : "Collapse filters"}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      {!collapsed && (
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-3">
            {activeCount > 0 && (
              <button
                type="button"
                data-ocid="user_finder.filter_panel.clear_all"
                onClick={clearAll}
                className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-medium border border-orange-500/30 text-orange-300 hover:bg-orange-500/10 transition-colors"
              >
                <X size={9} /> Clear All ({activeCount})
              </button>
            )}

            <MultiSelectDropdown
              label="Org Type"
              options={[
                "Vendor",
                "Distributor",
                "Global Distributor",
                "Reseller",
              ]}
              selected={filters.orgType}
              onChange={(v) => setFilter("orgType", v)}
            />
            <MultiSelectDropdown
              label="Territory"
              options={[
                "EMEA North",
                "EMEA South",
                "EMEA",
                "APAC",
                "APAC & EMEA",
                "UK & Ireland",
                "Nordics",
                "MENA",
                "Global",
              ]}
              selected={filters.territory}
              onChange={(v) => setFilter("territory", v)}
            />
            <MultiSelectDropdown
              label="Department"
              options={[
                "Account Management",
                "Channel Sales",
                "Deal Desk",
                "Sales Management",
                "Product Sales",
                "Marketing",
                "Customer Success",
                "Sales Operations",
                "Finance",
                "IT & Security",
                "Strategic Accounts",
                "Executive Leadership",
                "Technical Sales",
                "Renewals",
              ]}
              selected={filters.department}
              onChange={(v) => setFilter("department", v)}
            />
            <MultiSelectDropdown
              label="Operational Role"
              options={[
                "Account Manager",
                "Senior Channel Manager",
                "Deal Desk Analyst",
                "Sales Manager",
                "Renewal Specialist",
                "Marketing Lead",
                "Customer Success Manager",
                "Sales Ops Analyst",
                "Finance Partner",
                "Territory Owner",
                "VP Channel Sales",
                "Solutions Architect",
                "Global Account Director",
                "Security Operations Lead",
              ]}
              selected={filters.role}
              onChange={(v) => setFilter("role", v)}
            />
            <MultiSelectDropdown
              label="Linked Vendor"
              options={["ChannelForge Vendor Co."]}
              selected={filters.linkedVendor}
              onChange={(v) => setFilter("linkedVendor", v)}
            />
            <MultiSelectDropdown
              label="Linked Distributor"
              options={["Ingram Micro", "Global Distributors Ltd"]}
              selected={filters.linkedDistributor}
              onChange={(v) => setFilter("linkedDistributor", v)}
            />
            <MultiSelectDropdown
              label="Linked Reseller"
              options={["Apex Partners", "NordTech Resellers"]}
              selected={filters.linkedReseller}
              onChange={(v) => setFilter("linkedReseller", v)}
            />
            <MultiSelectDropdown
              label="Account Ownership"
              options={[
                "TechCorp",
                "Nordic Energy Group",
                "Acme Corp",
                "Desperado",
                "Global Pharma Holdings",
                "Bluewave Solutions",
                "TechVision Ltd",
              ]}
              selected={filters.accountOwnership}
              onChange={(v) => setFilter("accountOwnership", v)}
            />
            <MultiSelectDropdown
              label="Visibility Type"
              options={[
                "Private",
                "Department-Shared",
                "Organization-Shared",
                "Hierarchy-Shared",
              ]}
              selected={filters.visibilityType}
              onChange={(v) => setFilter("visibilityType", v)}
            />
            <MultiSelectDropdown
              label="Recent Collaboration"
              options={[
                "Today",
                "Yesterday",
                "2 days ago",
                "3 days ago",
                "4 days ago",
                "5 days ago",
                "1 week ago",
              ]}
              selected={filters.recentCollaboration}
              onChange={(v) => setFilter("recentCollaboration", v)}
            />
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

// ─── Main UserFinderTab component ─────────────────────────────────────────────

interface UserFinderTabProps {
  onMessageUser: (name: string) => void;
  isAdmin?: boolean;
}

export function UserFinderTab({
  onMessageUser,
  isAdmin = false,
}: UserFinderTabProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filterCollapsed, setFilterCollapsed] = useState(false);

  const myContacts = MOCK_STAKEHOLDERS.filter((s) =>
    MY_CONTACTS_IDS.includes(s.id),
  );

  const filtered = useMemo(() => {
    return MOCK_STAKEHOLDERS.filter((s) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const hit =
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.employeeNumber.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q) ||
          s.organization.toLowerCase().includes(q) ||
          s.territory.toLowerCase().includes(q) ||
          s.role.toLowerCase().includes(q) ||
          s.assignedAccounts.some((a) => a.toLowerCase().includes(q)) ||
          (s.linkedVendor?.toLowerCase().includes(q) ?? false) ||
          (s.linkedDistributor?.toLowerCase().includes(q) ?? false) ||
          (s.linkedReseller?.toLowerCase().includes(q) ?? false);
        if (!hit) return false;
      }
      // Filter: orgType
      if (filters.orgType.length > 0 && !filters.orgType.includes(s.orgType))
        return false;
      // Filter: territory
      if (
        filters.territory.length > 0 &&
        !filters.territory.includes(s.territory)
      )
        return false;
      // Filter: department
      if (
        filters.department.length > 0 &&
        !filters.department.includes(s.department)
      )
        return false;
      // Filter: role
      if (filters.role.length > 0 && !filters.role.includes(s.role))
        return false;
      // Filter: linkedVendor
      if (
        filters.linkedVendor.length > 0 &&
        !(s.linkedVendor && filters.linkedVendor.includes(s.linkedVendor))
      )
        return false;
      // Filter: linkedDistributor
      if (
        filters.linkedDistributor.length > 0 &&
        !(
          s.linkedDistributor &&
          filters.linkedDistributor.includes(s.linkedDistributor)
        )
      )
        return false;
      // Filter: linkedReseller
      if (
        filters.linkedReseller.length > 0 &&
        !(s.linkedReseller && filters.linkedReseller.includes(s.linkedReseller))
      )
        return false;
      // Filter: accountOwnership
      if (
        filters.accountOwnership.length > 0 &&
        !s.assignedAccounts.some((a) => filters.accountOwnership.includes(a))
      )
        return false;
      // Filter: visibilityType
      if (
        filters.visibilityType.length > 0 &&
        !filters.visibilityType.includes(s.visibilityTier)
      )
        return false;
      // Filter: recentCollaboration
      if (
        filters.recentCollaboration.length > 0 &&
        !(
          s.recentCollaboration &&
          filters.recentCollaboration.includes(s.recentCollaboration)
        )
      )
        return false;
      return true;
    });
  }, [search, filters]);

  function handleMessage(s: Stakeholder) {
    onMessageUser(s.name);
  }

  return (
    <div className="flex h-full overflow-hidden" data-ocid="user_finder.page">
      {/* Left: filter panel */}
      <FilterPanel
        filters={filters}
        onChange={setFilters}
        collapsed={filterCollapsed}
        onToggleCollapse={() => setFilterCollapsed((p) => !p)}
      />

      {/* Right: main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header + search bar */}
        <div className="flex-shrink-0 px-5 py-4 border-b border-border bg-card/20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-foreground font-display flex items-center gap-2">
                <BookUser size={14} className="text-accent" />
                User Finder
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Discover operational stakeholders across your ecosystem
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="font-semibold text-accent">
                {filtered.length}
              </span>
              <span>of {MOCK_STAKEHOLDERS.length} stakeholders</span>
            </div>
          </div>

          {/* Persistent search */}
          <div className="relative">
            <Search
              size={12}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              data-ocid="user_finder.search.input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, employee #, department, org, territory, role, linked accounts..."
              className="w-full pl-8 pr-10 py-2.5 rounded-xl text-xs bg-input border border-border text-foreground placeholder-muted-foreground outline-none focus:border-accent transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X size={11} />
              </button>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-5 space-y-6">
            {/* My Contacts section */}
            {!search && Object.values(filters).flat().length === 0 && (
              <section data-ocid="user_finder.my_contacts.section">
                <div className="flex items-center gap-2 mb-3">
                  <Star size={12} className="text-accent" />
                  <h4 className="text-xs font-bold text-foreground font-display">
                    My Contacts
                  </h4>
                  <span className="text-[10px] text-muted-foreground">
                    · Frequently collaborated & account-aligned
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {myContacts.map((s, i) => (
                    <StakeholderCard
                      key={s.id}
                      stakeholder={s}
                      isAdmin={isAdmin}
                      onMessage={handleMessage}
                      index={i + 1}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* All stakeholders */}
            <section data-ocid="user_finder.all_stakeholders.section">
              {(search || Object.values(filters).flat().length > 0) && (
                <div className="flex items-center gap-2 mb-3">
                  <Users size={12} className="text-muted-foreground" />
                  <h4 className="text-xs font-bold text-foreground font-display">
                    Search Results
                  </h4>
                  <Badge className="text-[9px] h-4 px-1.5 bg-accent/15 text-accent border-accent/20 border font-semibold">
                    {filtered.length}
                  </Badge>
                </div>
              )}
              {!search && Object.values(filters).flat().length === 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <Users size={12} className="text-muted-foreground" />
                  <h4 className="text-xs font-bold text-foreground font-display">
                    All Stakeholders
                  </h4>
                  <Badge className="text-[9px] h-4 px-1.5 bg-muted/40 text-muted-foreground border-border border font-semibold">
                    {MOCK_STAKEHOLDERS.length}
                  </Badge>
                </div>
              )}

              {filtered.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-16 text-center"
                  data-ocid="user_finder.empty_state"
                >
                  <div className="w-12 h-12 rounded-2xl bg-muted/20 border border-border flex items-center justify-center mb-3">
                    <BookUser size={20} className="text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    No stakeholders found
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                  <button
                    type="button"
                    data-ocid="user_finder.empty_state.clear_button"
                    onClick={() => {
                      setSearch("");
                      setFilters(DEFAULT_FILTERS);
                    }}
                    className="mt-4 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-accent/30 transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filtered.map((s, i) => (
                    <StakeholderCard
                      key={s.id}
                      stakeholder={s}
                      isAdmin={isAdmin}
                      onMessage={handleMessage}
                      index={i + 1}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
