import { AIGovernancePanel } from "@/components/ForgeAI/AIGovernancePanel";
import { AIProviderForm } from "@/components/ForgeAI/AIProviderForm";
import { AIProviderList } from "@/components/ForgeAI/AIProviderList";
import { AIProviderVisibilityMatrix } from "@/components/ForgeAI/AIProviderVisibilityMatrix";
import { useAIProviders } from "@/hooks/useAIProviders";
import {
  Activity,
  AlertTriangle,
  Bot,
  ClipboardList,
  PlusCircle,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

type TabId = "overview" | "providers" | "add" | "governance" | "audit";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <Activity className="w-4 h-4" /> },
  { id: "providers", label: "Providers", icon: <Bot className="w-4 h-4" /> },
  {
    id: "add",
    label: "Add Provider",
    icon: <PlusCircle className="w-4 h-4" />,
  },
  {
    id: "governance",
    label: "Governance",
    icon: <ShieldCheck className="w-4 h-4" />,
  },
  {
    id: "audit",
    label: "Audit Log",
    icon: <ClipboardList className="w-4 h-4" />,
  },
];

interface AIProviderSettingsProps {
  wsType: string;
}

export function AIProviderSettings({ wsType }: AIProviderSettingsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const {
    providers,
    loading,
    error,
    loadProviders,
    addProvider,
    deleteProvider,
    enableProvider,
    disableProvider,
  } = useAIProviders();

  useEffect(() => {
    loadProviders(wsType);
  }, [wsType, loadProviders]);

  const activeCount = providers.filter((p) => p.status === "Active").length;

  return (
    <div
      className="rounded-2xl border border-border bg-card overflow-hidden"
      data-ocid="ai_provider_settings.panel"
    >
      {/* Amber banner — external AI deferred */}
      <div className="flex items-start gap-3 px-5 py-3 border-b border-amber-500/20 bg-amber-500/10">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-400">
          External AI activation coming in a future update. Current responses
          use Native ForgeAI simulation only.
        </p>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Settings2 className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-foreground">
            AI Provider Settings
          </h2>
          <p className="text-xs text-muted-foreground">
            Bring Your Own AI — Configure, govern, and control AI access across
            your channel hierarchy.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-muted/20 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            data-ocid={`ai_provider_settings.tab.${tab.id}`}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {loading && (
          <div
            className="text-center py-8 text-muted-foreground text-sm"
            data-ocid="ai_provider_settings.loading_state"
          >
            Loading AI providers...
          </div>
        )}

        {error && !loading && (
          <div
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-4"
            data-ocid="ai_provider_settings.error_state"
          >
            {error}
          </div>
        )}

        {!loading && activeTab === "overview" && (
          <div className="space-y-5" data-ocid="ai_provider_settings.overview">
            {/* Active provider card */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">
                  Active AI Provider
                </p>
                <p className="text-sm font-semibold text-foreground">
                  Native ForgeAI
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Default CHANNELFORGE operational intelligence — always
                  available.
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/30 rounded px-2 py-0.5">
                Active
              </span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {providers.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Configured Providers
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {activeCount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Active Providers
                </p>
              </div>
            </div>

            {/* Data sovereignty note */}
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="text-foreground font-medium">
                  Bring Your Own AI
                </span>{" "}
                allows organizations to connect their preferred AI provider
                while keeping control over model choice, access permissions, and
                operational governance. AI access respects all CHANNELFORGE data
                visibility and hierarchy rules.
              </p>
            </div>

            {/* Visibility matrix */}
            {providers.length > 0 && (
              <AIProviderVisibilityMatrix providers={providers} />
            )}
          </div>
        )}

        {!loading && activeTab === "providers" && (
          <AIProviderList
            providers={providers}
            onEdit={() => setActiveTab("add")}
            onDelete={deleteProvider}
            onToggle={(id, enable) =>
              enable ? enableProvider(id) : disableProvider(id)
            }
          />
        )}

        {!loading && activeTab === "add" && (
          <AIProviderForm
            onSave={async (name, type, config) => {
              await addProvider(name, type, config);
              setActiveTab("providers");
            }}
            onCancel={() => setActiveTab("providers")}
          />
        )}

        {!loading && activeTab === "governance" && (
          <AIGovernancePanel wsType={wsType} />
        )}

        {!loading && activeTab === "audit" && (
          <div
            className="flex flex-col items-center justify-center py-12 gap-3"
            data-ocid="ai_provider_settings.audit_empty_state"
          >
            <ClipboardList className="w-10 h-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Audit logging structure ready. Events will appear here as
              providers are configured.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
