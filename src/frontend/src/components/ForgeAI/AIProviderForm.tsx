import type { AIProvider, AIProviderConfig } from "@/backend";
import { AIProviderType } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const PROVIDER_OPTIONS: { label: string; value: AIProviderType }[] = [
  { label: "Native ForgeAI", value: AIProviderType.Native },
  { label: "OpenAI", value: AIProviderType.OpenAI },
  { label: "Azure OpenAI", value: AIProviderType.AzureOpenAI },
  { label: "Anthropic Claude", value: AIProviderType.AnthropicClaude },
  { label: "Google Gemini", value: AIProviderType.GoogleGemini },
  { label: "Mistral", value: AIProviderType.Mistral },
  { label: "Custom Endpoint", value: AIProviderType.CustomEndpoint },
  { label: "Local / Private LLM", value: AIProviderType.LocalLLM },
];

interface AIProviderFormProps {
  onSave: (
    name: string,
    type: string,
    config: Partial<AIProviderConfig>,
  ) => void;
  onCancel: () => void;
  editProvider?: AIProvider;
  editConfig?: AIProviderConfig;
}

export function AIProviderForm({
  onSave,
  onCancel,
  editProvider,
  editConfig,
}: AIProviderFormProps) {
  const [name, setName] = useState(editProvider?.name ?? "");
  const [providerType, setProviderType] = useState<AIProviderType>(
    editProvider?.providerType ?? AIProviderType.OpenAI,
  );
  const [endpointUrl, setEndpointUrl] = useState(editConfig?.endpointUrl ?? "");
  const [modelName, setModelName] = useState(editConfig?.modelName ?? "");
  const [apiKey, setApiKey] = useState("");
  const [orgId, setOrgId] = useState(editConfig?.orgId ?? "");
  const [deploymentName, setDeploymentName] = useState(
    editConfig?.deploymentName ?? "",
  );
  const [region, setRegion] = useState(editConfig?.region ?? "");
  const [maxTokens, setMaxTokens] = useState(
    Number(editConfig?.maxTokens ?? 4096),
  );
  const [temperature, setTemperature] = useState(
    editConfig?.temperature ?? 0.7,
  );
  const [timeoutSecs, setTimeoutSecs] = useState(
    Number(editConfig?.timeoutSecs ?? 30),
  );
  const [showApiKey, setShowApiKey] = useState(false);

  const isNative = providerType === AIProviderType.Native;
  const isOpenAI = providerType === AIProviderType.OpenAI;
  const isAzure = providerType === AIProviderType.AzureOpenAI;
  const isGemini = providerType === AIProviderType.GoogleGemini;
  const showOrgId = isOpenAI || isAzure;
  const showDeployment = isAzure;
  const showRegion = isAzure || isGemini;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const config: Partial<AIProviderConfig> = {
      endpointUrl: endpointUrl || undefined,
      modelName: modelName || undefined,
      orgId: orgId || undefined,
      deploymentName: deploymentName || undefined,
      region: region || undefined,
      maxTokens: BigInt(maxTokens),
      temperature,
      timeoutSecs: BigInt(timeoutSecs),
      maskedApiKey: apiKey
        ? `sk-...${apiKey.slice(-4)}`
        : editConfig?.maskedApiKey,
    };
    onSave(name, providerType, config);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      data-ocid="ai_provider_form"
    >
      {/* Provider Name */}
      <div className="space-y-1.5">
        <Label
          htmlFor="provider-name"
          className="text-sm font-medium text-foreground"
        >
          Provider Name
        </Label>
        <Input
          id="provider-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Company OpenAI"
          required
          data-ocid="ai_provider_form.name_input"
          className="bg-muted/40 border-border focus:border-primary/60"
        />
      </div>

      {/* Provider Type */}
      <div className="space-y-1.5">
        <Label
          htmlFor="provider-type"
          className="text-sm font-medium text-foreground"
        >
          Provider Type
        </Label>
        <select
          id="provider-type"
          value={providerType}
          onChange={(e) => setProviderType(e.target.value as AIProviderType)}
          data-ocid="ai_provider_form.type_select"
          className="w-full rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60"
        >
          {PROVIDER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {!isNative && (
        <>
          {/* Endpoint URL */}
          <div className="space-y-1.5">
            <Label
              htmlFor="endpoint-url"
              className="text-sm font-medium text-foreground"
            >
              API Endpoint URL
            </Label>
            <Input
              id="endpoint-url"
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
              placeholder="https://api.openai.com/v1"
              data-ocid="ai_provider_form.endpoint_input"
              className="bg-muted/40 border-border focus:border-primary/60"
            />
          </div>

          {/* Model Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="model-name"
              className="text-sm font-medium text-foreground"
            >
              Model Name
            </Label>
            <Input
              id="model-name"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="e.g. gpt-4o, claude-3-5-sonnet"
              data-ocid="ai_provider_form.model_input"
              className="bg-muted/40 border-border focus:border-primary/60"
            />
          </div>

          {/* API Key */}
          <div className="space-y-1.5">
            <Label
              htmlFor="api-key"
              className="text-sm font-medium text-foreground"
            >
              API Key
            </Label>
            {editConfig?.maskedApiKey && !apiKey && (
              <p className="text-xs text-muted-foreground">
                Current: {editConfig.maskedApiKey}
              </p>
            )}
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  editConfig?.maskedApiKey
                    ? "Enter new key to replace"
                    : "sk-..."
                }
                data-ocid="ai_provider_form.api_key_input"
                className="bg-muted/40 border-border focus:border-primary/60 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showApiKey ? "Hide API key" : "Show API key"}
              >
                {showApiKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Key stored as placeholder — encryption coming in a future update.
              {/* TODO-SECURITY */}
            </p>
          </div>

          {/* Org ID */}
          {showOrgId && (
            <div className="space-y-1.5">
              <Label
                htmlFor="org-id"
                className="text-sm font-medium text-foreground"
              >
                Organization ID
              </Label>
              <Input
                id="org-id"
                value={orgId}
                onChange={(e) => setOrgId(e.target.value)}
                placeholder="org-..."
                data-ocid="ai_provider_form.org_id_input"
                className="bg-muted/40 border-border focus:border-primary/60"
              />
            </div>
          )}

          {/* Deployment Name */}
          {showDeployment && (
            <div className="space-y-1.5">
              <Label
                htmlFor="deployment-name"
                className="text-sm font-medium text-foreground"
              >
                Deployment Name
              </Label>
              <Input
                id="deployment-name"
                value={deploymentName}
                onChange={(e) => setDeploymentName(e.target.value)}
                placeholder="my-gpt4-deployment"
                data-ocid="ai_provider_form.deployment_input"
                className="bg-muted/40 border-border focus:border-primary/60"
              />
            </div>
          )}

          {/* Region */}
          {showRegion && (
            <div className="space-y-1.5">
              <Label
                htmlFor="region"
                className="text-sm font-medium text-foreground"
              >
                Region
              </Label>
              <Input
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="eastus / us-central1"
                data-ocid="ai_provider_form.region_input"
                className="bg-muted/40 border-border focus:border-primary/60"
              />
            </div>
          )}
        </>
      )}

      {/* Advanced Settings */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="max-tokens"
            className="text-sm font-medium text-foreground"
          >
            Max Tokens
          </Label>
          <Input
            id="max-tokens"
            type="number"
            min={1}
            max={128000}
            value={maxTokens}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
            data-ocid="ai_provider_form.max_tokens_input"
            className="bg-muted/40 border-border focus:border-primary/60"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="temperature"
            className="text-sm font-medium text-foreground"
          >
            Temperature ({temperature.toFixed(1)})
          </Label>
          <input
            id="temperature"
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            data-ocid="ai_provider_form.temperature_input"
            className="w-full accent-primary"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="timeout"
            className="text-sm font-medium text-foreground"
          >
            Timeout (s)
          </Label>
          <Input
            id="timeout"
            type="number"
            min={5}
            max={300}
            value={timeoutSecs}
            onChange={(e) => setTimeoutSecs(Number(e.target.value))}
            data-ocid="ai_provider_form.timeout_input"
            className="bg-muted/40 border-border focus:border-primary/60"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          data-ocid="ai_provider_form.submit_button"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {editProvider ? "Save Changes" : "Add Provider"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          data-ocid="ai_provider_form.cancel_button"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
