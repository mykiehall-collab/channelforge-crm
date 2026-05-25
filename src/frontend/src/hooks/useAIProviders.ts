import type { AIProvider, AIProviderConfig } from "@/backend";
import { AIProviderStatus, AIProviderType } from "@/backend";
import { useCallback, useState } from "react";
import { useActor } from "./useActor";

// TODO-SECURITY: All provider config handling uses plaintext credentials.
// Upgrade to encrypted storage and secure vault before go-live.

export interface UseAIProvidersResult {
  providers: AIProvider[];
  loading: boolean;
  error: string | null;
  loadProviders: (workspaceId: string) => Promise<void>;
  addProvider: (
    name: string,
    type: string,
    config: Partial<AIProviderConfig>,
  ) => Promise<boolean>;
  deleteProvider: (providerId: string) => Promise<boolean>;
  enableProvider: (providerId: string) => Promise<boolean>;
  disableProvider: (providerId: string) => Promise<boolean>;
}

export function useAIProviders(): UseAIProvidersResult {
  const { actor } = useActor();
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProviders = useCallback(
    async (workspaceId: string) => {
      if (!actor) return;
      setLoading(true);
      setError(null);
      try {
        const result = await actor.aiListProviders(workspaceId);
        // Always prepend the native ForgeAI provider as pinned default
        const native: AIProvider = {
          id: "native-forgeai",
          name: "Native ForgeAI",
          providerType: AIProviderType.Native,
          workspaceId,
          createdBy: "system",
          createdAt: BigInt(0),
          status: AIProviderStatus.Active,
          isShared: false,
        };
        const nonNative = result.filter(
          (p) => p.providerType !== AIProviderType.Native,
        );
        setProviders([native, ...nonNative]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load AI providers",
        );
      } finally {
        setLoading(false);
      }
    },
    [actor],
  );

  const addProvider = useCallback(
    async (
      name: string,
      type: string,
      config: Partial<AIProviderConfig>,
    ): Promise<boolean> => {
      if (!actor) return false;
      setLoading(true);
      setError(null);
      try {
        // TODO-SECURITY: API key stored as plaintext placeholder — upgrade before go-live
        const providerId = `provider-${Date.now()}`;
        const provider: AIProvider = {
          id: providerId,
          name,
          providerType: type as AIProviderType,
          workspaceId: config.providerId ?? "",
          createdBy: "current-user",
          createdAt: BigInt(Date.now()),
          status: AIProviderStatus.Testing,
          isShared: false,
        };
        const fullConfig: AIProviderConfig = {
          providerId,
          endpointUrl: config.endpointUrl,
          modelName: config.modelName,
          orgId: config.orgId,
          deploymentName: config.deploymentName,
          region: config.region,
          maxTokens: config.maxTokens ?? BigInt(4096),
          temperature: config.temperature ?? 0.7,
          timeoutSecs: config.timeoutSecs ?? BigInt(30),
          maskedApiKey: config.maskedApiKey,
        };
        const ok = await actor.aiAddProvider(provider, fullConfig);
        if (ok) {
          setProviders((prev) => [...prev, provider]);
        }
        return ok;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add provider");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [actor],
  );

  const deleteProvider = useCallback(
    async (providerId: string): Promise<boolean> => {
      if (!actor) return false;
      try {
        const ok = await actor.aiDeleteProvider(providerId);
        if (ok) {
          setProviders((prev) => prev.filter((p) => p.id !== providerId));
        }
        return ok;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete provider",
        );
        return false;
      }
    },
    [actor],
  );

  const enableProvider = useCallback(
    async (providerId: string): Promise<boolean> => {
      if (!actor) return false;
      try {
        const ok = await actor.aiEnableProvider(providerId);
        if (ok) {
          setProviders((prev) =>
            prev.map((p) =>
              p.id === providerId
                ? { ...p, status: AIProviderStatus.Active }
                : p,
            ),
          );
        }
        return ok;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to enable provider",
        );
        return false;
      }
    },
    [actor],
  );

  const disableProvider = useCallback(
    async (providerId: string): Promise<boolean> => {
      if (!actor) return false;
      try {
        const ok = await actor.aiDisableProvider(providerId);
        if (ok) {
          setProviders((prev) =>
            prev.map((p) =>
              p.id === providerId
                ? { ...p, status: AIProviderStatus.Disabled }
                : p,
            ),
          );
        }
        return ok;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to disable provider",
        );
        return false;
      }
    },
    [actor],
  );

  return {
    providers,
    loading,
    error,
    loadProviders,
    addProvider,
    deleteProvider,
    enableProvider,
    disableProvider,
  };
}
