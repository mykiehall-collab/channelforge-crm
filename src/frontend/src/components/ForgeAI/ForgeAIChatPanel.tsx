import {
  AlertTriangle,
  BookOpen,
  Brain,
  Lock,
  Maximize2,
  MessageSquare,
  Minimize2,
  RotateCcw,
  Settings,
  Shield,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useApp } from "../../AppContext";
import type { ChatMessage } from "../../backend.d";
import { useForgeAIChat } from "../../hooks/useForgeAIChat";
import { ForgeAIChatInput } from "./ForgeAIChatInput";
import { ForgeAIChatMessage } from "./ForgeAIChatMessage";
import { ForgeAIPlaybookPanel } from "./ForgeAIPlaybookPanel";
import { ForgeAIProviderSelector } from "./ForgeAIProviderSelector";

type ForgeAIAccessLevel = "none" | "basic" | "operational" | "full";

interface LinkedOrg {
  id: string;
  name: string;
  type: "Vendor" | "Distributor" | "Reseller";
  accessLevel: ForgeAIAccessLevel;
}

const LINKED_ORGS: LinkedOrg[] = [
  {
    id: "org-vendor-1",
    name: "Adobe Vendor",
    type: "Vendor",
    accessLevel: "full",
  },
  {
    id: "org-dist-1",
    name: "Ingram Micro Distributor",
    type: "Distributor",
    accessLevel: "operational",
  },
  {
    id: "org-res-1",
    name: "Nordic Cloud Reseller",
    type: "Reseller",
    accessLevel: "basic",
  },
];

const PERMISSION_FILTER_RULES: Record<
  ForgeAIAccessLevel,
  { allowed: string[]; restricted: string[] }
> = {
  none: {
    allowed: [],
    restricted: [
      "renewal",
      "pipeline",
      "forecast",
      "pricing",
      "margin",
      "escalation",
      "cost",
      "strategic",
      "mdf",
      "partner",
      "engagement",
      "health",
      "opportunity",
      "deal",
    ],
  },
  basic: {
    allowed: [
      "renewal risk",
      "customer inactivity",
      "suggested next actions",
      "engagement opportunities",
      "health score",
      "renewal",
    ],
    restricted: [
      "pricing",
      "margin",
      "internal escalation",
      "cost structure",
      "strategic vendor notes",
      "forecasting",
      "pipeline",
      "deal registration",
      "mdf roi",
      "partner performance",
    ],
  },
  operational: {
    allowed: [
      "renewal risk",
      "customer inactivity",
      "suggested next actions",
      "engagement opportunities",
      "pipeline health",
      "mdf roi trends",
      "partner performance",
      "health score",
      "forecast",
    ],
    restricted: [
      "vendor cost structures",
      "margin data",
      "strategic vendor notes",
      "internal escalation",
      "pricing logic",
    ],
  },
  full: {
    allowed: [
      "renewal risk",
      "customer inactivity",
      "suggested next actions",
      "engagement opportunities",
      "pipeline health",
      "mdf roi trends",
      "partner performance",
      "vendor cost structures",
      "margin data",
      "strategic vendor notes",
      "forecasting",
      "pricing logic",
      "internal escalation",
    ],
    restricted: [],
  },
};

const RESTRICTED_KEYWORDS = [
  "pricing",
  "margin",
  "internal escalation",
  "cost structure",
  "strategic notes",
  "vendor cost",
  "margin data",
  "pricing logic",
  "forecasting",
  "pipeline",
];

const QUICK_PROMPTS = [
  "Summarise recent account activity",
  "What are the top renewal risks this quarter?",
  "Show inactive resellers",
  "Analyse current pipeline health",
];

interface ForgeAIChatPanelProps {
  open: boolean;
  onClose: () => void;
  contextType?: string | null;
  contextId?: string | null;
}

function filterForgeAIOutput(
  content: string,
  accessLevel: ForgeAIAccessLevel,
): string {
  if (accessLevel === "none") {
    return "[ACCESS DENIED — ForgeAI insights are not shared with your organisation for this account.]";
  }
  const rules = PERMISSION_FILTER_RULES[accessLevel];
  let filtered = content;
  for (const keyword of RESTRICTED_KEYWORDS) {
    if (
      rules.restricted.some((r) =>
        r.toLowerCase().includes(keyword.toLowerCase()),
      )
    ) {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      filtered = filtered.replace(
        regex,
        "[RESTRICTED — Not shared with your organisation]",
      );
    }
  }
  return filtered;
}

function getPermissionIndicator(accessLevel: ForgeAIAccessLevel) {
  switch (accessLevel) {
    case "full":
      return {
        label: "ForgeAI scope: Full Access",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      };
    case "operational":
      return {
        label: "ForgeAI scope: Operational Access",
        color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
      };
    case "basic":
      return {
        label: "ForgeAI scope: Renewal & Customer Insights Only",
        color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
      };
    case "none":
      return {
        label: "ForgeAI scope: Access Denied",
        color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      };
  }
}

export function ForgeAIChatPanel({
  open,
  onClose,
  contextType: externalContextType,
  contextId: externalContextId,
}: ForgeAIChatPanelProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [accessLevel, setAccessLevel] = useState<ForgeAIAccessLevel>("full");
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [showOrgSelector, setShowOrgSelector] = useState(false);
  const [activeTab, setActiveTab] = useState<"playbook" | "chat">("playbook");
  const { operationalRole, rolePlaybook, companyProfile } = useApp();

  const {
    messages,
    isLoading,
    activeProviderId,
    showExternalProviderBanner,
    setShowExternalProviderBanner,
    contextType,
    contextId,
    sendMessage,
    setContext,
    clearContext,
    clearHistory,
    selectProvider,
  } = useForgeAIChat();

  const scrollRef = useRef<HTMLDivElement>(null);
  const orgSelectorRef = useRef<HTMLDivElement>(null);

  // Close org selector on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        orgSelectorRef.current &&
        !orgSelectorRef.current.contains(e.target as Node)
      ) {
        setShowOrgSelector(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync external context into the hook
  useEffect(() => {
    if (externalContextType && externalContextId) {
      setContext(externalContextType, externalContextId);
    }
  }, [externalContextType, externalContextId, setContext]);

  // Auto-scroll to bottom on new message
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional re-run on message/loading change for scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, isLoading]);

  const _panelClass = isFullScreen
    ? "fixed inset-4 z-40 flex flex-col"
    : "fixed bottom-20 right-6 z-40 flex flex-col w-96 h-[550px]";

  const contextLabel = contextType
    ? `${contextType}${contextId ? `: ${contextId}` : ""}`
    : null;

  const permissionIndicator = getPermissionIndicator(accessLevel);

  // Filter messages based on access level
  const filteredMessages = messages.map((msg) => {
    if (
      (msg.role as unknown as string) === "User" ||
      msg.role === ("User" as unknown as ChatMessage["role"])
    ) {
      return msg;
    }
    return {
      ...msg,
      content: filterForgeAIOutput(msg.content, accessLevel),
    };
  });

  // Build a loading-placeholder message for typing indicator
  const loadingPlaceholder: ChatMessage | null = isLoading
    ? {
        id: "loading",
        content: getPermissionAwarePlaceholder(accessLevel),
        aiSource: "Native ForgeAI",
        role: "Assistant" as unknown as ChatMessage["role"],
        timestamp: BigInt(Date.now()),
        suggestedActions: [],
      }
    : null;

  function getPermissionAwarePlaceholder(level: ForgeAIAccessLevel): string {
    switch (level) {
      case "basic":
        return "Renewal risk for Nordic Energy Group has increased. Recommended action: schedule a health check within 7 days.";
      case "operational":
        return "Reseller performance across your network shows 3 at-risk accounts. MDF ROI trending below target for Q3.";
      case "full":
        return "Strategic pipeline analysis shows £2.3M at risk due to renewal delays. Internal escalation flagged for Apex Financial. Margin optimisation opportunity identified.";
      case "none":
        return "[ACCESS DENIED — ForgeAI insights are not shared with your organisation for this account.]";
    }
  }

  function handleOrgSelect(org: LinkedOrg) {
    setSelectedOrgId(org.id);
    setAccessLevel(org.accessLevel);
    setShowOrgSelector(false);
  }

  return (
    <dialog
      open={open}
      className="`${panelClass} bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl max-w-full overflow-hidden transition-all duration-300 ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`"
      style={{
        boxShadow:
          "0 0 40px oklch(0.65 0.24 32 / 0.12), 0 25px 50px -12px oklch(0.08 0.015 250 / 0.8)",
      }}
      data-ocid="forgeai.dialog"
      aria-label="ForgeAI Chat"
    >
      {/* Header */}
      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center intelligence-pulse">
        <div className="forgeai-pulse w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
          <Brain className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="font-display font-semibold text-sm text-foreground flex-1 min-w-0">
          ForgeAI
        </span>

        <ForgeAIProviderSelector
          activeProviderId={activeProviderId}
          onSelect={selectProvider}
        />

        {/* Org selector toggle */}
        <div className="relative" ref={orgSelectorRef}>
          <button
            type="button"
            onClick={() => setShowOrgSelector((s) => !s)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-secondary/40 border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            data-ocid="forgeai.org_selector.toggle"
            title="Change viewing organisation"
          >
            <Settings className="w-3 h-3" />
            <span className="hidden sm:inline">
              {selectedOrgId
                ? (LINKED_ORGS.find((o) => o.id === selectedOrgId)?.name ??
                  "Viewing as")
                : "Viewing as: Owner"}
            </span>
          </button>
          {showOrgSelector && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="px-3 py-2 border-b border-border bg-muted/30">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Simulate Linked Org View
                </span>
              </div>
              {LINKED_ORGS.map((org) => (
                <button
                  key={org.id}
                  type="button"
                  onClick={() => handleOrgSelect(org)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-secondary/40 transition-colors ${selectedOrgId === org.id ? "bg-secondary/30" : ""}`}
                  data-ocid={`forgeai.org_selector.option.${org.id}`}
                >
                  <Shield className="w-3 h-3 text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">
                      {org.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground capitalize">
                      {org.type} — {org.accessLevel} access
                    </div>
                  </div>
                  {selectedOrgId === org.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  )}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setSelectedOrgId(null);
                  setAccessLevel("full");
                  setShowOrgSelector(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-secondary/40 transition-colors border-t border-border ${selectedOrgId === null ? "bg-secondary/30" : ""}`}
                data-ocid="forgeai.org_selector.option.owner"
              >
                <Shield className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">
                    Workspace Owner
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Full Access
                  </div>
                </div>
                {selectedOrgId === null && (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                )}
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={clearHistory}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors duration-150"
          title="Clear conversation"
          data-ocid="forgeai.clear_button"
          aria-label="Clear conversation history"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setIsFullScreen((f) => !f)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors duration-150"
          title={isFullScreen ? "Minimize" : "Maximize"}
          data-ocid="forgeai.maximize_button"
          aria-label={isFullScreen ? "Minimize chat" : "Maximize chat"}
        >
          {isFullScreen ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors duration-150"
          data-ocid="forgeai.close_button"
          aria-label="Close ForgeAI chat"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Permission indicator banner */}
      <div
        className={`flex items-center gap-2 px-4 py-1.5 border-b flex-shrink-0 ${permissionIndicator.color}`}
      >
        <Lock className="w-3 h-3 flex-shrink-0" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">
          {permissionIndicator.label}
        </span>
      </div>

      {/* Context banner */}
      {contextLabel && (
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border-b border-primary/20 flex-shrink-0">
          <span className="text-xs text-primary font-body font-medium min-w-0 truncate">
            Context: {contextLabel}
          </span>
          <button
            type="button"
            onClick={clearContext}
            className="ml-auto p-0.5 text-primary/70 hover:text-primary flex-shrink-0"
            aria-label="Clear context"
            data-ocid="forgeai.clear_context_button"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* External provider banner */}
      {showExternalProviderBanner && (
        <div className="flex items-start gap-2 px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex-shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-400 font-body">
            External AI activation coming in a future update. Using Native
            ForgeAI for now.
          </p>
          <button
            type="button"
            onClick={() => setShowExternalProviderBanner(false)}
            className="ml-auto flex-shrink-0 text-amber-400/60 hover:text-amber-400"
            aria-label="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Playbook / Chat tab bar */}
      <div
        className="flex items-center gap-1 px-3 py-2 border-b border-border bg-muted/20 flex-shrink-0"
        data-ocid="forgeai.tab_bar"
      >
        <button
          type="button"
          onClick={() => setActiveTab("playbook")}
          className={`flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium transition-colors duration-150 ${
            activeTab === "playbook"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          }`}
          data-ocid="forgeai.tab.playbook"
        >
          <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
          Playbook
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("chat")}
          className={`flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium transition-colors duration-150 ${
            activeTab === "chat"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          }`}
          data-ocid="forgeai.tab.chat"
        >
          <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
          Chat
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "playbook" ? (
        operationalRole ? (
          <div
            className="flex-1 min-h-0 overflow-y-auto scrollbar-thin"
            data-ocid="forgeai.playbook_panel"
          >
            <ForgeAIPlaybookPanel
              role={operationalRole}
              playbookName={rolePlaybook?.[0] ?? "Operational Playbook"}
              orgType={companyProfile?.companyType ?? undefined}
              onAction={(actionText) => {
                setActiveTab("chat");
                sendMessage(actionText);
              }}
            />
          </div>
        ) : (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center"
            data-ocid="forgeai.playbook_empty_state"
          >
            <div className="w-12 h-12 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground font-body leading-relaxed">
              No playbook assigned — contact your admin to set your operational
              role
            </p>
          </div>
        )
      ) : (
        <>
          {/* Messages area */}
          <div
            ref={scrollRef}
            className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center intelligence-pulse"
            data-ocid="forgeai.messages_list"
          >
            {filteredMessages.length === 0 && !isLoading ? (
              /* Empty state */
              <div
                className="flex-1 flex flex-col items-center justify-center gap-4 py-6"
                data-ocid="forgeai.empty_state"
              >
                <div className="forgeai-pulse w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Brain className="w-7 h-7 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground font-display mb-1">
                    Ask ForgeAI anything
                  </p>
                  <p className="text-xs text-muted-foreground font-body">
                    Operational intelligence for your channel ecosystem
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="text-left text-xs px-3 py-2.5 rounded-xl border border-border bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-[var(--hover-bg)] transition-colors duration-150 font-body overflow-hidden"
                      data-ocid="forgeai.quick_prompt"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      (msg.role as unknown as string) === "User" ||
                      msg.role === ("User" as unknown as ChatMessage["role"])
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <ForgeAIChatMessage
                      message={msg}
                      onActionClick={sendMessage}
                    />
                  </div>
                ))}
                {loadingPlaceholder && (
                  <div className="flex justify-start">
                    <ForgeAIChatMessage
                      message={loadingPlaceholder}
                      isLoading
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input */}
          <ForgeAIChatInput onSend={sendMessage} isLoading={isLoading} />
        </>
      )}
    </dialog>
  );
}
