import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatRole } from "../backend.d";

// TODO-SECURITY: session and credential mapping will be moved to encrypted backend storage before go-live

export interface ChatContext {
  type: string;
  id: string;
  label: string;
}

const NATIVE_PROVIDER_ID = "native-forgeai";
const NATIVE_PROVIDER_NAME = "Native ForgeAI";

const SIMULATED_RESPONSES: Record<
  string,
  { content: string; actions: string[] }
> = {
  summary: {
    content:
      "This account has been active for 3 years with a renewal value of £48,200. Their last engagement was 12 days ago via the distributor portal. The account health score is 78/100, flagged as medium risk due to a missed business plan review. ForgeAI recommends scheduling a renewal check-in within the next 7 days.",
    actions: [
      "Schedule renewal call",
      "View account timeline",
      "Generate renewal report",
    ],
  },
  renewal: {
    content:
      "ForgeAI has identified 3 high-risk renewals expiring in the next 30 days with a combined value of £124,500. The primary risk signals are: 47 days of distributor inactivity, 2 missed business plan milestones, and a 23% decline in product usage. Immediate outreach is recommended for Apex Systems and CloudCore Ltd.",
    actions: [
      "View renewal pipeline",
      "Contact Apex Systems",
      "Review risk dashboard",
    ],
  },
  reseller: {
    content:
      "Of your 42 active resellers, 8 have not logged any activity in the past 21 days. The top performer this quarter is Nexus Partners with £67,000 pipeline created. Three resellers are below their Q3 targets by more than 30%, qualifying for the engagement gap alert threshold.",
    actions: [
      "View inactive resellers",
      "Check gap alerts",
      "Review reseller rankings",
    ],
  },
  deal: {
    content:
      "There are 7 deal registrations pending review, 2 of which have exceeded the 14-day SLA. The oldest pending registration is from DataEdge Solutions, submitted 19 days ago with an estimated value of £31,500. ForgeAI recommends escalating the stalled approvals to the deal desk team.",
    actions: [
      "Review stalled approvals",
      "Escalate to deal desk",
      "View all deal registrations",
    ],
  },
  pipeline: {
    content:
      "Your current pipeline totals £892,000 across 34 active opportunities. Forecast coverage is at 87% for Q3, which is strong. However, 6 opportunities have shown no movement in 14+ days, collectively worth £218,000. The Proposal stage has the highest drop-off rate at 34% this quarter — consider reviewing your proposal templates.",
    actions: [
      "View stalled opportunities",
      "Check Q3 forecast",
      "Review pipeline health",
    ],
  },
  default: {
    content:
      "I'm ForgeAI, your operational intelligence assistant for CHANNELFORGE. I can help you analyse accounts, track renewal risks, review pipeline health, summarise deal registrations, and surface actionable insights across your channel ecosystem. What would you like to explore today?",
    actions: [
      "Summarise account activity",
      "Check renewal risks",
      "View pipeline health",
    ],
  },
};

function simulateResponse(content: string): {
  content: string;
  actions: string[];
} {
  const lower = content.toLowerCase();
  if (lower.includes("summar")) return SIMULATED_RESPONSES.summary;
  if (lower.includes("renewal") || lower.includes("risk"))
    return SIMULATED_RESPONSES.renewal;
  if (lower.includes("inactiv") || lower.includes("reseller"))
    return SIMULATED_RESPONSES.reseller;
  if (lower.includes("deal") || lower.includes("registration"))
    return SIMULATED_RESPONSES.deal;
  if (lower.includes("pipeline") || lower.includes("opportunit"))
    return SIMULATED_RESPONSES.pipeline;
  return SIMULATED_RESPONSES.default;
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export interface ProviderOption {
  id: string;
  name: string;
  isNative: boolean;
  isAvailable: boolean;
}

export const PROVIDER_OPTIONS: ProviderOption[] = [
  {
    id: "native-forgeai",
    name: "Native ForgeAI",
    isNative: true,
    isAvailable: true,
  },
  { id: "openai", name: "OpenAI", isNative: false, isAvailable: false },
  {
    id: "azure-openai",
    name: "Azure OpenAI",
    isNative: false,
    isAvailable: false,
  },
  {
    id: "anthropic-claude",
    name: "Anthropic Claude",
    isNative: false,
    isAvailable: false,
  },
  {
    id: "google-gemini",
    name: "Google Gemini",
    isNative: false,
    isAvailable: false,
  },
  { id: "mistral", name: "Mistral", isNative: false, isAvailable: false },
  {
    id: "custom-endpoint",
    name: "Custom Endpoint",
    isNative: false,
    isAvailable: false,
  },
  { id: "local-llm", name: "Local LLM", isNative: false, isAvailable: false },
];

export function useForgeAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeProviderId, setActiveProviderId] = useState(NATIVE_PROVIDER_ID);
  const [contextType, setContextTypeState] = useState<string | null>(null);
  const [contextId, setContextIdState] = useState<string | null>(null);
  const [sessionId] = useState<string | null>(makeId()); // TODO-SECURITY: link to backend session
  const [showExternalProviderBanner, setShowExternalProviderBanner] =
    useState(false);
  const abortRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeProviderName =
    PROVIDER_OPTIONS.find((p) => p.id === activeProviderId)?.name ??
    NATIVE_PROVIDER_NAME;

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: makeId(),
        content: content.trim(),
        context: contextType ? `${contextType}:${contextId}` : undefined,
        aiSource: "",
        role: { __kind__: "User" } as unknown as ChatRole,
        timestamp: BigInt(Date.now()),
        suggestedActions: [],
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      const delay = 1200 + Math.random() * 600;
      abortRef.current = setTimeout(() => {
        const { content: responseContent, actions } = simulateResponse(content);
        const aiMsg: ChatMessage = {
          id: makeId(),
          content: responseContent,
          context: contextType ? `${contextType}:${contextId}` : undefined,
          aiSource: activeProviderName,
          role: { __kind__: "Assistant" } as unknown as ChatRole,
          timestamp: BigInt(Date.now()),
          suggestedActions: actions,
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsLoading(false);
      }, delay);
    },
    [isLoading, contextType, contextId, activeProviderName],
  );

  const setContext = useCallback((type: string, id: string) => {
    setContextTypeState(type);
    setContextIdState(id);
  }, []);

  const clearContext = useCallback(() => {
    setContextTypeState(null);
    setContextIdState(null);
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  const selectProvider = useCallback((providerId: string) => {
    const option = PROVIDER_OPTIONS.find((p) => p.id === providerId);
    if (!option) return;
    setActiveProviderId(providerId);
    setShowExternalProviderBanner(!option.isNative);
  }, []);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) clearTimeout(abortRef.current);
    };
  }, []);

  return {
    messages,
    isLoading,
    activeProviderId,
    activeProviderName,
    contextType,
    contextId,
    sessionId,
    showExternalProviderBanner,
    setShowExternalProviderBanner,
    sendMessage,
    setContext,
    clearContext,
    clearHistory,
    selectProvider,
  };
}
