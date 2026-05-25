import type { AIProvider } from "@/backend";
import { AIProviderStatus, AIProviderType } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlaskConical, Pencil, Power, Trash2 } from "lucide-react";
import { useState } from "react";

const PROVIDER_LABELS: Record<AIProviderType, string> = {
  [AIProviderType.Native]: "Native ForgeAI",
  [AIProviderType.OpenAI]: "OpenAI",
  [AIProviderType.AzureOpenAI]: "Azure OpenAI",
  [AIProviderType.AnthropicClaude]: "Anthropic Claude",
  [AIProviderType.GoogleGemini]: "Google Gemini",
  [AIProviderType.Mistral]: "Mistral",
  [AIProviderType.LocalLLM]: "Local / Private LLM",
  [AIProviderType.CustomEndpoint]: "Custom Endpoint",
};

interface AIProviderListProps {
  providers: AIProvider[];
  onEdit: (provider: AIProvider) => void;
  onDelete: (providerId: string) => void;
  onToggle: (providerId: string, enable: boolean) => void;
}

export function AIProviderList({
  providers,
  onEdit,
  onDelete,
  onToggle,
}: AIProviderListProps) {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (providers.length === 0) {
    return (
      <div
        className="text-center py-12 text-muted-foreground text-sm"
        data-ocid="ai_providers.empty_state"
      >
        No external AI providers configured yet.
      </div>
    );
  }

  return (
    <div className="space-y-3" data-ocid="ai_providers.list">
      {providers.map((provider, index) => {
        const isNative = provider.providerType === AIProviderType.Native;
        const isActive = provider.status === AIProviderStatus.Active;
        const isDisabled = provider.status === AIProviderStatus.Disabled;
        const isTesting = provider.status === AIProviderStatus.Testing;

        return (
          <div
            key={provider.id}
            data-ocid={`ai_providers.item.${index + 1}`}
            className={`rounded-xl border p-4 flex items-start gap-4 transition-all ${
              isNative
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-card hover:border-border/80"
            }`}
          >
            {/* Icon */}
            <div
              className={`mt-0.5 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isNative
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span className="text-base font-bold">
                {provider.name.charAt(0)}
              </span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-foreground truncate">
                  {provider.name}
                </span>
                {isNative && (
                  <Badge
                    variant="outline"
                    className="text-xs border-primary/40 text-primary bg-primary/10"
                  >
                    Default
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="text-xs border-border text-muted-foreground"
                >
                  {PROVIDER_LABELS[provider.providerType] ??
                    provider.providerType}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    isActive
                      ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                      : isTesting
                        ? "border-amber-500/40 text-amber-400 bg-amber-500/10"
                        : "border-border text-muted-foreground"
                  }`}
                >
                  {provider.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isNative
                  ? "Default CHANNELFORGE operational intelligence"
                  : `Provider ID: ${provider.id}`}
              </p>

              {/* Test connection notice */}
              {testingId === provider.id && (
                <div
                  className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-400"
                  data-ocid={`ai_providers.test_notice.${index + 1}`}
                >
                  External AI activation coming in a future update. Test
                  connection is not available yet.
                </div>
              )}

              {/* Delete confirmation */}
              {deleteConfirmId === provider.id && (
                <div
                  className="mt-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs flex items-center gap-3"
                  data-ocid={`ai_providers.delete_confirm.${index + 1}`}
                >
                  <span className="text-foreground">
                    Remove <strong>{provider.name}</strong>? This cannot be
                    undone.
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="h-6 text-xs px-2"
                    onClick={() => {
                      onDelete(provider.id);
                      setDeleteConfirmId(null);
                    }}
                    data-ocid={`ai_providers.confirm_button.${index + 1}`}
                  >
                    Remove
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs px-2"
                    onClick={() => setDeleteConfirmId(null)}
                    data-ocid={`ai_providers.cancel_button.${index + 1}`}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {!isNative && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  title="Edit provider"
                  onClick={() => onEdit(provider)}
                  data-ocid={`ai_providers.edit_button.${index + 1}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-amber-400"
                title="Test connection"
                onClick={() =>
                  setTestingId((id) =>
                    id === provider.id ? null : provider.id,
                  )
                }
                data-ocid={`ai_providers.test_button.${index + 1}`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
              </Button>
              {!isNative && (
                <>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className={`h-8 w-8 p-0 ${
                      isActive
                        ? "text-emerald-400 hover:text-muted-foreground"
                        : "text-muted-foreground hover:text-emerald-400"
                    }`}
                    title={isDisabled ? "Enable provider" : "Disable provider"}
                    onClick={() => onToggle(provider.id, isDisabled)}
                    data-ocid={`ai_providers.toggle_button.${index + 1}`}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    title="Remove provider"
                    onClick={() =>
                      setDeleteConfirmId((id) =>
                        id === provider.id ? null : provider.id,
                      )
                    }
                    data-ocid={`ai_providers.delete_button.${index + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
