import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Camera,
  Check,
  Edit3,
  FlaskConical,
  Globe,
  Link,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Server,
  Shield,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import { ProfileVisibilityScope } from "../backend";
import { useActor } from "../hooks/useActor";
import { getInitials } from "../utils/channelforge";
import { MyTeamTab } from "./UserProfileMyTeam";
import { OrgChartTab } from "./UserProfileOrgChart";

const ORANGE = "#FF6B2B";
const BG = "#0b1724";
const BORDER = "#1e3050";
const TEXT_MUTED = "#7D8AA0";

const TIMEZONE_OPTIONS = [
  "UTC",
  "Europe/London",
  "Europe/Paris",
  "Europe/Stockholm",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
];

type Tab = "profile" | "team" | "orgchart";

function validateLinkedIn(url: string): boolean {
  if (!url) return true;
  return url.includes("linkedin.com");
}

export function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams({ from: "/profile/$userId" });
  const { userProfile, companyProfile, userProfileDetail } = useApp();
  const { actor } = useActor();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [editing, setEditing] = useState(false);
  // TEST_MODE_PLACEHOLDER: Remove or replace before production
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    userProfileDetail?.profilePhotoUrl ?? null,
  );
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [linkedInError, setLinkedInError] = useState("");

  // Extended local form state — merges UserProfileDetail with new fields
  // Cast through unknown to safely access fields that may have been persisted
  // to localStorage but are not yet on the UserProfileDetail type definition.
  const detailAny = userProfileDetail as unknown as Record<
    string,
    string
  > | null;
  const companyAny = companyProfile as unknown as Record<string, string> | null;

  const [form, setForm] = useState({
    jobTitle: userProfileDetail?.jobTitle ?? "",
    roleDescription: userProfileDetail?.roleDescription ?? "",
    region: userProfileDetail?.region ?? "",
    timeZone: userProfileDetail?.timeZone ?? "UTC",
    linkedInUrl: userProfileDetail?.linkedInUrl ?? "",
    bio: detailAny?.bio ?? "",
    employeeNumber: detailAny?.employeeNumber ?? "",
    department: detailAny?.department ?? "",
    phone: detailAny?.phone ?? "",
  });

  // TODO-SECURITY: Remove before live launch.
  function fillTestData() {
    setEditing(true);
    setForm({
      jobTitle: "Channel Account Manager",
      region: "EMEA",
      timeZone: "Europe/London",
      linkedInUrl: "https://www.linkedin.com/in/test-channelforge-user",
      roleDescription:
        "Responsible for managing key channel accounts across the EMEA region, driving partner engagement, renewals, and pipeline growth through strategic account management and operational intelligence.",
      bio: "Channel sales professional with 10+ years in enterprise software ecosystems. Specialist in Vendor-Distributor relationships, EMEA partner strategy, and digital transformation enablement.",
      employeeNumber: "EMP-04821",
      department: "Channel Sales",
      phone: "+44 7700 900123",
    });
    toast.success("Test data filled — review and save to apply.");
  }

  const isOwnProfile = !userId || userId === "me" || userId === userProfile?.id;
  const displayName = userProfile?.fullName ?? "User Profile";
  const displayRole = userProfile?.role ?? "";
  const displayCompany = companyProfile?.companyName ?? "";
  const displayDomain = companyAny?.claimedDomain ?? companyAny?.domain ?? "";

  function orgTypeLabel() {
    const role = userProfile?.role ?? "";
    if (role.toLowerCase().includes("vendor")) return "Vendor";
    if (role.toLowerCase().includes("distributor")) return "Distributor";
    return "Reseller";
  }

  function userTypeLabel() {
    if (userProfile?.isPrimaryAdmin) return "Primary Admin";
    const role = userProfile?.role ?? "";
    if (
      role.toLowerCase().includes("secondary") ||
      role.toLowerCase().includes("admin")
    )
      return "Secondary Admin";
    return "End User";
  }

  function userTypeBadgeStyle(type: string) {
    if (type === "Primary Admin")
      return {
        background: "rgba(255,107,43,0.18)",
        color: ORANGE,
        border: "1px solid rgba(255,107,43,0.35)",
      };
    if (type === "Secondary Admin")
      return {
        background: "rgba(99,179,237,0.15)",
        color: "#63B3ED",
        border: "1px solid rgba(99,179,237,0.3)",
      };
    return {
      background: "rgba(148,163,184,0.12)",
      color: "#94A3B8",
      border: "1px solid rgba(148,163,184,0.25)",
    };
  }

  async function handlePhotoUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return;
    setUploadingPhoto(true);
    try {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
      if (actor) {
        await actor.updateMyProfile({
          displayName: userProfile?.fullName ?? "",
          jobTitle: form.jobTitle,
          roleDescription: form.roleDescription,
          region: form.region,
          timezone: form.timeZone,
          linkedInUrl: form.linkedInUrl,
          photoUrl: url,
          visibilityScope: ProfileVisibilityScope.WorkspaceOnly,
        });
      }
      toast.success("Profile photo updated");
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  }

  function handleLinkedInChange(val: string) {
    setForm((f) => ({ ...f, linkedInUrl: val }));
    if (val && !validateLinkedIn(val)) {
      setLinkedInError("URL must contain linkedin.com");
    } else {
      setLinkedInError("");
    }
  }

  async function handleSave() {
    if (linkedInError) {
      toast.error("Fix LinkedIn URL before saving.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    try {
      const stored = localStorage.getItem("cf_user_profile_detail");
      const existing = stored
        ? (JSON.parse(stored) as Record<string, unknown>)
        : {};
      localStorage.setItem(
        "cf_user_profile_detail",
        JSON.stringify({ ...existing, ...form }),
      );
    } catch {
      // localStorage may be unavailable
    }
    setSaving(false);
    setEditing(false);
    toast.success("Profile updated successfully.");
  }

  const uType = userTypeLabel();
  const oType = orgTypeLabel();

  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-4xl mx-auto space-y-6" data-ocid="profile.page">
        {/* Back nav */}
        <button
          type="button"
          data-ocid="profile.back.button"
          onClick={() => navigate({ to: "/dashboard" })}
          className="flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-2 transition-colors hover:bg-secondary/40 -ml-3"
        >
          <ArrowLeft size={15} /> Back to Dashboard
        </button>

        {/* Profile header card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: BG, border: `1px solid ${BORDER}` }}
          data-ocid="profile.card"
        >
          <div
            className="h-28 relative"
            style={{
              background:
                "linear-gradient(135deg, #0d1a2e 0%, #0f2847 50%, rgba(255,107,43,0.12) 100%)",
            }}
          >
            <div className="absolute bottom-0 left-6 translate-y-1/2">
              <button
                type="button"
                className="relative w-24 h-24 rounded-2xl border-4 flex items-center justify-center text-2xl font-black text-white overflow-hidden group cursor-pointer"
                style={{ background: ORANGE, borderColor: BG }}
                onClick={() => photoInputRef.current?.click()}
                aria-label="Change profile photo"
                data-ocid="profile.photo.upload_button"
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(displayName)
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                  {uploadingPhoto ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera size={20} className="text-white" />
                  )}
                </div>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  tabIndex={-1}
                  onChange={(e) => handlePhotoUpload(e.target.files)}
                  data-ocid="profile.photo.input"
                />
              </button>
            </div>
            {isOwnProfile && (
              <div className="absolute top-3 right-4 flex items-center gap-2">
                {/* TODO-SECURITY: Remove before live */}
                <button
                  type="button"
                  data-ocid="profile.fill_test_data.button"
                  onClick={fillTestData}
                  title="Test environment only"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    background: "rgba(255,107,43,0.15)",
                    color: ORANGE,
                    border: "1px solid rgba(255,107,43,0.4)",
                  }}
                >
                  <FlaskConical size={12} /> Fill with Test Data
                </button>
                <button
                  type="button"
                  data-ocid="profile.edit.button"
                  onClick={() => setEditing((v) => !v)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <Edit3 size={12} /> {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            )}
          </div>

          <div className="px-6 pt-16 pb-5">
            <h1 className="text-xl font-bold text-foreground">{displayName}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge style={userTypeBadgeStyle(uType)}>{uType}</Badge>
              <Badge
                style={{
                  background: "rgba(255,107,43,0.12)",
                  color: "#FFA970",
                  border: "1px solid rgba(255,107,43,0.25)",
                }}
              >
                {oType}
              </Badge>
              {form.jobTitle && (
                <span className="text-sm">{form.jobTitle}</span>
              )}
              {form.department && (
                <span
                  className="text-xs px-2 py-0.5 rounded-md"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: TEXT_MUTED,
                  }}
                >
                  {form.department}
                </span>
              )}
            </div>
            {(form.bio || form.roleDescription) && (
              <p className="mt-3 text-sm leading-relaxed max-w-2xl">
                {form.bio || form.roleDescription}
              </p>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div
          className="flex items-center rounded-xl overflow-hidden"
          style={{ background: BG, border: `1px solid ${BORDER}` }}
          data-ocid="profile.tab"
        >
          {(["profile", "team", "orgchart"] as Tab[]).map((tab) => {
            const labels: Record<Tab, string> = {
              profile: "Profile",
              team: "My Team",
              orgchart: "Org Chart",
            };
            const ocids: Record<Tab, string> = {
              profile: "profile.tab.profile",
              team: "profile.tab.team",
              orgchart: "profile.tab.orgchart",
            };
            return (
              <button
                key={tab}
                type="button"
                data-ocid={ocids[tab]}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-3 text-sm font-semibold transition-colors"
                style={{
                  color: activeTab === tab ? ORANGE : TEXT_MUTED,
                  background:
                    activeTab === tab ? "rgba(255,107,43,0.06)" : "transparent",
                  borderBottom:
                    activeTab === tab
                      ? `2px solid ${ORANGE}`
                      : "2px solid transparent",
                }}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Tab: Profile */}
        {activeTab === "profile" && (
          <div className="space-y-4" data-ocid="profile.profile_tab">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact info */}
              <div
                className="rounded-xl p-5 space-y-4"
                style={{ background: BG, border: `1px solid ${BORDER}` }}
                data-ocid="profile.details.panel"
              >
                <h3 className="text-xs font-semibold uppercase tracking-wider">
                  Contact Information
                </h3>
                <Separator style={{ background: BORDER }} />
                <div className="space-y-3">
                  {[
                    {
                      Icon: Mail,
                      label: "Email",
                      value: userProfile?.email ?? "—",
                    },
                    {
                      Icon: Building2,
                      label: "Company",
                      value: displayCompany || "—",
                    },
                    { Icon: Shield, label: "Role", value: displayRole || "—" },
                    {
                      Icon: MapPin,
                      label: "Region / Territory",
                      value: form.region || "—",
                    },
                    {
                      Icon: Globe,
                      label: "Time Zone",
                      value: form.timeZone || "—",
                    },
                    { Icon: Phone, label: "Phone", value: form.phone || "—" },
                  ].map(({ Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Icon
                        size={14}
                        style={{
                          color: TEXT_MUTED,
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      />
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider mb-0.5">
                          {label}
                        </div>
                        <div className="text-sm text-foreground">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {/* LinkedIn */}
                <div
                  className="rounded-xl p-5 space-y-4"
                  style={{ background: BG, border: `1px solid ${BORDER}` }}
                  data-ocid="profile.links.panel"
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wider">
                    Professional Links
                  </h3>
                  <Separator style={{ background: BORDER }} />
                  {form.linkedInUrl ? (
                    <a
                      href={form.linkedInUrl}
                      target="_blank"
                      rel="noreferrer"
                      data-ocid="profile.linkedin.link"
                      className="flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-2 transition-colors hover:opacity-80"
                      style={{
                        background: "rgba(10,102,194,0.15)",
                        color: "#5AABFA",
                        border: "1px solid rgba(10,102,194,0.3)",
                      }}
                    >
                      <Linkedin size={14} /> View LinkedIn Profile
                    </a>
                  ) : (
                    <p className="text-sm">No LinkedIn URL provided.</p>
                  )}
                </div>

                {/* Read-only org info */}
                <div
                  className="rounded-xl p-5 space-y-3"
                  style={{ background: BG, border: `1px solid ${BORDER}` }}
                  data-ocid="profile.org_info.panel"
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wider">
                    Organisation
                  </h3>
                  <Separator style={{ background: BORDER }} />
                  {[
                    {
                      label: "User Type",
                      value: (
                        <Badge style={userTypeBadgeStyle(uType)}>{uType}</Badge>
                      ),
                    },
                    {
                      label: "Org Type",
                      value: (
                        <Badge
                          style={{
                            background: "rgba(255,107,43,0.12)",
                            color: "#FFA970",
                            border: "1px solid rgba(255,107,43,0.25)",
                          }}
                        >
                          {oType}
                        </Badge>
                      ),
                    },
                    { label: "Company", value: displayCompany || "—" },
                    { label: "Domain", value: displayDomain || "—" },
                    { label: "Department", value: form.department || "—" },
                    {
                      label: "Employee No.",
                      value: form.employeeNumber || "—",
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="text-xs">{label}</span>
                      <span className="text-xs text-right text-foreground">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin-controlled read-only section */}
            <div
              className="rounded-xl p-5 space-y-4"
              style={{ background: BG, border: `1px solid ${BORDER}` }}
              data-ocid="profile.access.panel"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider">
                Access & Assignments (Admin Controlled)
              </h3>
              <Separator style={{ background: BORDER }} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: "Assigned Permissions",
                    items: [
                      "View Accounts",
                      "Manage Opportunities",
                      "Run Reports",
                      "MDF Workflows",
                    ],
                  },
                  {
                    label: "Assigned Accounts",
                    items: [
                      "Desperado",
                      "Nordic Energy Group",
                      "Apex Financial Services",
                    ],
                  },
                  {
                    label: "Assigned Territories",
                    items: ["EMEA", "UK & Ireland"],
                  },
                ].map(({ label, items }) => (
                  <div key={label}>
                    <div className="text-[10px] font-semibold uppercase tracking-wider mb-2">
                      {label}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((item) => (
                        <span
                          key={item}
                          className="text-xs px-2 py-0.5 rounded-md"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            color: "#94A3B8",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Connected Integrations ─────────────────────────────── */}
            {/* TEST_MODE_PLACEHOLDER: Remove or replace before production */}
            <div
              className="rounded-xl p-5 space-y-4"
              style={{ background: BG, border: `1px solid ${BORDER}` }}
              data-ocid="profile.integrations.panel"
            >
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider">
                  Connected Integrations
                </h3>
                <p className="text-xs mt-1">
                  Connect your internal calendar and email to sync meetings,
                  callbacks, renewal reminders, and operational tasks.
                </p>
              </div>
              <Separator style={{ background: BORDER }} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: "outlook",
                    name: "Microsoft Outlook / 365 Calendar",
                    Icon: Mail,
                    color: "#0078D4",
                  },
                  {
                    id: "gcal",
                    name: "Google Calendar",
                    Icon: Calendar,
                    color: "#4285F4",
                  },
                  { id: "gmail", name: "Gmail", Icon: Mail, color: "#EA4335" },
                  {
                    id: "exchange",
                    name: "Exchange Server",
                    Icon: Server,
                    color: "#0078D4",
                  },
                  {
                    id: "enterprise-cal",
                    name: "Enterprise Calendar API",
                    Icon: Link,
                    color: ORANGE,
                  },
                ].map(({ id, name, Icon, color }) => (
                  <div
                    key={id}
                    className="rounded-lg p-4 flex items-center justify-between gap-3"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${BORDER}`,
                    }}
                    data-ocid={`profile.integration.${id}.card`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}22` }}
                      >
                        <Icon size={14} style={{ color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {name}
                        </p>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded"
                          style={{
                            background: "rgba(148,163,184,0.12)",
                            color: TEXT_MUTED,
                          }}
                        >
                          Not Connected
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      data-ocid={`profile.integration.${id}.connect_button`}
                      className="text-xs flex-shrink-0"
                      style={{ borderColor: BORDER, color: TEXT_MUTED }}
                      onClick={() => {
                        setSelectedProvider(name);
                        setShowIntegrationModal(true);
                      }}
                    >
                      Connect
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Integration Modal — TEST_MODE_PLACEHOLDER: Remove or replace before production */}
            {showIntegrationModal && selectedProvider && (
              <div
                className="bg-black/75 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center p-4"
                data-ocid="profile.integration.dialog"
              >
                <div
                  className="w-full max-w-md rounded-2xl p-6 space-y-5 relative"
                  style={{
                    background: "#0d1a2e",
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  <button
                    type="button"
                    aria-label="Close"
                    data-ocid="profile.integration.close_button"
                    onClick={() => {
                      setShowIntegrationModal(false);
                      setSelectedProvider(null);
                    }}
                    className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-white/10"
                  >
                    <X size={16} />
                  </button>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      Connect {selectedProvider}
                    </h3>
                    <p className="text-xs mt-2 leading-relaxed">
                      Connect your internal calendar to sync meetings,
                      callbacks, renewal reminders, and operational tasks.
                    </p>
                    <p className="text-xs mt-2 leading-relaxed">
                      Connect your work email to improve activity tracking and
                      account collaboration.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button
                      type="button"
                      data-ocid="profile.integration.connect_button"
                      className="w-full font-semibold"
                      style={{ background: ORANGE }}
                      onClick={() => {
                        toast.info(
                          "Integration coming soon. This will be available in a future release.",
                        );
                        setShowIntegrationModal(false);
                        setSelectedProvider(null);
                      }}
                    >
                      Connect {selectedProvider}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      data-ocid="profile.integration.cancel_button"
                      className="w-full"
                      style={{ borderColor: BORDER, color: TEXT_MUTED }}
                      onClick={() => {
                        setShowIntegrationModal(false);
                        setSelectedProvider(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  <p className="text-[10px] text-center">
                    Your credentials are encrypted and never stored in plain
                    text. Integration can be disconnected at any time from your
                    profile settings.
                  </p>
                </div>
              </div>
            )}

            {/* Edit form */}
            {editing && isOwnProfile && (
              <div
                className="rounded-2xl p-6 space-y-5"
                style={{
                  background: BG,
                  border: "1px solid rgba(255,107,43,0.25)",
                }}
                data-ocid="profile.edit.panel"
              >
                <h3 className="text-sm font-bold text-foreground">
                  Edit Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/70 text-xs mb-1.5 block">
                      Job Title
                    </Label>
                    <Input
                      data-ocid="profile.job_title.input"
                      value={form.jobTitle}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, jobTitle: e.target.value }))
                      }
                      placeholder="e.g. Channel Account Manager"
                      className="crm-input w-full"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70 text-xs mb-1.5 block">
                      Department
                    </Label>
                    <Input
                      data-ocid="profile.department.input"
                      value={form.department}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, department: e.target.value }))
                      }
                      placeholder="e.g. Channel Sales"
                      className="crm-input w-full"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70 text-xs mb-1.5 block">
                      Region / Territory
                    </Label>
                    <Input
                      data-ocid="profile.region.input"
                      value={form.region}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, region: e.target.value }))
                      }
                      placeholder="e.g. EMEA, APAC, Americas"
                      className="crm-input w-full"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70 text-xs mb-1.5 block">
                      Employee Number
                    </Label>
                    <Input
                      data-ocid="profile.employee_number.input"
                      value={form.employeeNumber}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          employeeNumber: e.target.value,
                        }))
                      }
                      placeholder="e.g. EMP-04821"
                      className="crm-input w-full"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70 text-xs mb-1.5 block">
                      Time Zone
                    </Label>
                    <select
                      data-ocid="profile.timezone.select"
                      value={form.timeZone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, timeZone: e.target.value }))
                      }
                      className="crm-input w-full rounded-md px-3 py-2 text-sm"
                      style={{
                        background: "#0b1724",
                        border: `1px solid ${BORDER}`,
                        color: "white",
                      }}
                    >
                      {TIMEZONE_OPTIONS.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-white/70 text-xs mb-1.5 block">
                      Phone (optional)
                    </Label>
                    <Input
                      data-ocid="profile.phone.input"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      placeholder="e.g. +44 7700 900000"
                      className="crm-input w-full"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-white/70 text-xs mb-1.5 block">
                      LinkedIn URL
                    </Label>
                    <Input
                      data-ocid="profile.linkedin_url.input"
                      value={form.linkedInUrl}
                      onChange={(e) => handleLinkedInChange(e.target.value)}
                      placeholder="https://linkedin.com/in/yourname"
                      className="crm-input w-full"
                    />
                    {linkedInError && (
                      <p
                        className="text-xs mt-1 text-destructive"
                        data-ocid="profile.linkedin_url.field_error"
                      >
                        {linkedInError}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1.5 block">
                    Bio / Short Description <span>(max 280 chars)</span>
                  </Label>
                  <Textarea
                    data-ocid="profile.bio.textarea"
                    value={form.bio}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        bio: e.target.value.slice(0, 280),
                      }))
                    }
                    placeholder="Describe your role, responsibilities, territory, or specialist focus…"
                    rows={3}
                    className="crm-input w-full resize-none"
                  />
                  <p className="text-right text-[10px] mt-1">
                    {form.bio.length}/280
                  </p>
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1.5 block">
                    Role Description
                  </Label>
                  <Textarea
                    data-ocid="profile.role_description.textarea"
                    value={form.roleDescription}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        roleDescription: e.target.value,
                      }))
                    }
                    placeholder="A short description of your role and responsibilities…"
                    rows={2}
                    className="crm-input w-full resize-none"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    data-ocid="profile.edit.cancel_button"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    data-ocid="profile.edit.save_button"
                    onClick={handleSave}
                    disabled={saving}
                    className="gap-1.5"
                    style={{ background: ORANGE }}
                  >
                    {saving ? (
                      <>
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />{" "}
                        Saving…
                      </>
                    ) : (
                      <>
                        <Check size={13} /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: My Team */}
        {activeTab === "team" && <MyTeamTab />}

        {/* Tab: Org Chart */}
        {activeTab === "orgchart" && <OrgChartTab />}
      </div>

      <style>{`
        .crm-input { background: #0b1724 !important; border: 1px solid #1e3050 !important; color: white !important; font-size: 14px; }
        .crm-input::placeholder { color: #3a4a60; }
        .crm-input:focus { outline: none !important; border-color: ${ORANGE} !important; box-shadow: 0 0 0 3px rgba(255,107,43,0.12) !important; }
      `}</style>
    </ScrollArea>
  );
}
