import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, bj as AIProviderType, aF as Label, ad as Input, aO as EyeOff, au as Eye, m as Button, bk as AIProviderStatus, o as Badge, bl as FlaskConical, aC as Trash2, as as Check, p as useActor, T as TriangleAlert, aP as Bot } from "./index-DvFvlUBj.js";
import { S as Switch } from "./switch-7D4xT4MC.js";
import { P as Pencil } from "./pencil-CSymqQ5s.js";
import { M as Minus } from "./minus-OwCcNK6_.js";
import { C as ClipboardList } from "./clipboard-list-BvyAGRk8.js";
import { A as Activity } from "./activity-BzA2r-7b.js";
import { C as CirclePlus, S as ShieldCheck } from "./shield-check-Bs1OSg8Z.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 2v10", key: "mnfbl" }],
  ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04", key: "obofu9" }]
];
const Power = createLucideIcon("power", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M20 7h-9", key: "3s1dr2" }],
  ["path", { d: "M14 17H5", key: "gfn3mx" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
  ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
];
const Settings2 = createLucideIcon("settings-2", __iconNode);
const ROLES = [
  "Sales",
  "Marketing",
  "IT",
  "BDR",
  "Sales Manager",
  "Sales Operations",
  "Deal Desk",
  "Order Management",
  "Directors"
];
const DEPARTMENTS = [
  "Sales",
  "Marketing",
  "IT",
  "BDR",
  "Sales Management",
  "Sales Operations",
  "Deal Desk",
  "Order Management",
  "Leadership",
  "Finance",
  "Admin"
];
const VENDOR_DISTRIBUTORS = [
  "Distributor Alpha",
  "Distributor Beta",
  "Distributor Gamma"
];
const DISTRIBUTOR_RESELLERS = [
  "Reseller One",
  "Reseller Two",
  "Reseller Three"
];
function AIGovernancePanel({ wsType }) {
  const [sharingToggles, setSharingToggles] = reactExports.useState(
    {}
  );
  const [roleAccess, setRoleAccess] = reactExports.useState(
    Object.fromEntries(ROLES.map((r) => [r, true]))
  );
  const [deptAccess, setDeptAccess] = reactExports.useState(
    Object.fromEntries(DEPARTMENTS.map((d) => [d, true]))
  );
  const toggleSharing = (name) => setSharingToggles((prev) => ({ ...prev, [name]: !prev[name] }));
  const toggleRole = (role) => setRoleAccess((prev) => ({ ...prev, [role]: !prev[role] }));
  const toggleDept = (dept) => setDeptAccess((prev) => ({ ...prev, [dept]: !prev[dept] }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "ai_governance.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-4", children: wsType === "vendor" ? "Vendor AI Sharing — Connected Distributors" : wsType === "distributor" ? "Distributor AI Sharing — Connected Resellers" : "Available AI Providers" }),
      wsType === "vendor" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: VENDOR_DISTRIBUTORS.map((dist, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between py-2 border-b border-border/50 last:border-0",
          "data-ocid": `ai_governance.sharing_toggle.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium", children: dist }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Share Vendor AI access downstream" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: sharingToggles[dist] ? "Shared" : "Not shared" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: !!sharingToggles[dist],
                  onCheckedChange: () => toggleSharing(dist),
                  "aria-label": `Share Vendor AI with ${dist}`
                }
              )
            ] })
          ]
        },
        dist
      )) }),
      wsType === "distributor" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: DISTRIBUTOR_RESELLERS.map((res, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between py-2 border-b border-border/50 last:border-0",
          "data-ocid": `ai_governance.sharing_toggle.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium", children: res }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Share Distributor AI access downstream" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: sharingToggles[res] ? "Shared" : "Not shared" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: !!sharingToggles[res],
                  onCheckedChange: () => toggleSharing(res),
                  "aria-label": `Share Distributor AI with ${res}`
                }
              )
            ] })
          ]
        },
        res
      )) }),
      wsType === "reseller" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium", children: "Native ForgeAI" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Default — always available" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-emerald-400 font-medium", children: "Active" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium", children: "Vendor AI" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Requires Vendor admin approval" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "text-xs text-primary border border-primary/30 rounded px-2 py-1 hover:bg-primary/10 transition-colors",
              "data-ocid": "ai_governance.request_vendor_ai",
              children: "Request Access"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium", children: "Distributor AI" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Requires Distributor admin approval" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "text-xs text-primary border border-primary/30 rounded px-2 py-1 hover:bg-primary/10 transition-colors",
              "data-ocid": "ai_governance.request_distributor_ai",
              children: "Request Access"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-border/50" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-1", children: "Role-Based AI Access" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Control which user roles can access AI features in this workspace." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: ROLES.map((role, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          className: "flex items-center gap-2.5 cursor-pointer",
          "data-ocid": `ai_governance.role_toggle.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: !!roleAccess[role],
                onChange: () => toggleRole(role),
                className: "accent-primary w-3.5 h-3.5"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: role })
          ]
        },
        role
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-border/50" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-1", children: "Department AI Access" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Control which departments can access AI features in this workspace." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: DEPARTMENTS.map((dept, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          className: "flex items-center gap-2.5 cursor-pointer",
          "data-ocid": `ai_governance.dept_toggle.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: !!deptAccess[dept],
                onChange: () => toggleDept(dept),
                className: "accent-primary w-3.5 h-3.5"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: dept })
          ]
        },
        dept
      )) })
    ] })
  ] });
}
const PROVIDER_OPTIONS = [
  { label: "Native ForgeAI", value: AIProviderType.Native },
  { label: "OpenAI", value: AIProviderType.OpenAI },
  { label: "Azure OpenAI", value: AIProviderType.AzureOpenAI },
  { label: "Anthropic Claude", value: AIProviderType.AnthropicClaude },
  { label: "Google Gemini", value: AIProviderType.GoogleGemini },
  { label: "Mistral", value: AIProviderType.Mistral },
  { label: "Custom Endpoint", value: AIProviderType.CustomEndpoint },
  { label: "Local / Private LLM", value: AIProviderType.LocalLLM }
];
function AIProviderForm({
  onSave,
  onCancel,
  editProvider,
  editConfig
}) {
  const [name, setName] = reactExports.useState((editProvider == null ? void 0 : editProvider.name) ?? "");
  const [providerType, setProviderType] = reactExports.useState(
    (editProvider == null ? void 0 : editProvider.providerType) ?? AIProviderType.OpenAI
  );
  const [endpointUrl, setEndpointUrl] = reactExports.useState((editConfig == null ? void 0 : editConfig.endpointUrl) ?? "");
  const [modelName, setModelName] = reactExports.useState((editConfig == null ? void 0 : editConfig.modelName) ?? "");
  const [apiKey, setApiKey] = reactExports.useState("");
  const [orgId, setOrgId] = reactExports.useState((editConfig == null ? void 0 : editConfig.orgId) ?? "");
  const [deploymentName, setDeploymentName] = reactExports.useState(
    (editConfig == null ? void 0 : editConfig.deploymentName) ?? ""
  );
  const [region, setRegion] = reactExports.useState((editConfig == null ? void 0 : editConfig.region) ?? "");
  const [maxTokens, setMaxTokens] = reactExports.useState(
    Number((editConfig == null ? void 0 : editConfig.maxTokens) ?? 4096)
  );
  const [temperature, setTemperature] = reactExports.useState(
    (editConfig == null ? void 0 : editConfig.temperature) ?? 0.7
  );
  const [timeoutSecs, setTimeoutSecs] = reactExports.useState(
    Number((editConfig == null ? void 0 : editConfig.timeoutSecs) ?? 30)
  );
  const [showApiKey, setShowApiKey] = reactExports.useState(false);
  const isNative = providerType === AIProviderType.Native;
  const isOpenAI = providerType === AIProviderType.OpenAI;
  const isAzure = providerType === AIProviderType.AzureOpenAI;
  const isGemini = providerType === AIProviderType.GoogleGemini;
  const showOrgId = isOpenAI || isAzure;
  const showDeployment = isAzure;
  const showRegion = isAzure || isGemini;
  function handleSubmit(e) {
    e.preventDefault();
    const config = {
      endpointUrl: endpointUrl || void 0,
      modelName: modelName || void 0,
      orgId: orgId || void 0,
      deploymentName: deploymentName || void 0,
      region: region || void 0,
      maxTokens: BigInt(maxTokens),
      temperature,
      timeoutSecs: BigInt(timeoutSecs),
      maskedApiKey: apiKey ? `sk-...${apiKey.slice(-4)}` : editConfig == null ? void 0 : editConfig.maskedApiKey
    };
    onSave(name, providerType, config);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      className: "space-y-5",
      "data-ocid": "ai_provider_form",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "provider-name",
              className: "text-sm font-medium text-foreground",
              children: "Provider Name"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "provider-name",
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "e.g. Company OpenAI",
              required: true,
              "data-ocid": "ai_provider_form.name_input",
              className: "bg-muted/40 border-border focus:border-primary/60"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "provider-type",
              className: "text-sm font-medium text-foreground",
              children: "Provider Type"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              id: "provider-type",
              value: providerType,
              onChange: (e) => setProviderType(e.target.value),
              "data-ocid": "ai_provider_form.type_select",
              className: "w-full rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60",
              children: PROVIDER_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.value, children: opt.label }, opt.value))
            }
          )
        ] }),
        !isNative && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "endpoint-url",
                className: "text-sm font-medium text-foreground",
                children: "API Endpoint URL"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "endpoint-url",
                value: endpointUrl,
                onChange: (e) => setEndpointUrl(e.target.value),
                placeholder: "https://api.openai.com/v1",
                "data-ocid": "ai_provider_form.endpoint_input",
                className: "bg-muted/40 border-border focus:border-primary/60"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "model-name",
                className: "text-sm font-medium text-foreground",
                children: "Model Name"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "model-name",
                value: modelName,
                onChange: (e) => setModelName(e.target.value),
                placeholder: "e.g. gpt-4o, claude-3-5-sonnet",
                "data-ocid": "ai_provider_form.model_input",
                className: "bg-muted/40 border-border focus:border-primary/60"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "api-key",
                className: "text-sm font-medium text-foreground",
                children: "API Key"
              }
            ),
            (editConfig == null ? void 0 : editConfig.maskedApiKey) && !apiKey && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Current: ",
              editConfig.maskedApiKey
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "api-key",
                  type: showApiKey ? "text" : "password",
                  value: apiKey,
                  onChange: (e) => setApiKey(e.target.value),
                  placeholder: (editConfig == null ? void 0 : editConfig.maskedApiKey) ? "Enter new key to replace" : "sk-...",
                  "data-ocid": "ai_provider_form.api_key_input",
                  className: "bg-muted/40 border-border focus:border-primary/60 pr-10"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowApiKey((v) => !v),
                  className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                  "aria-label": showApiKey ? "Hide API key" : "Show API key",
                  children: showApiKey ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Key stored as placeholder — encryption coming in a future update." })
          ] }),
          showOrgId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "org-id",
                className: "text-sm font-medium text-foreground",
                children: "Organization ID"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "org-id",
                value: orgId,
                onChange: (e) => setOrgId(e.target.value),
                placeholder: "org-...",
                "data-ocid": "ai_provider_form.org_id_input",
                className: "bg-muted/40 border-border focus:border-primary/60"
              }
            )
          ] }),
          showDeployment && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "deployment-name",
                className: "text-sm font-medium text-foreground",
                children: "Deployment Name"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "deployment-name",
                value: deploymentName,
                onChange: (e) => setDeploymentName(e.target.value),
                placeholder: "my-gpt4-deployment",
                "data-ocid": "ai_provider_form.deployment_input",
                className: "bg-muted/40 border-border focus:border-primary/60"
              }
            )
          ] }),
          showRegion && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "region",
                className: "text-sm font-medium text-foreground",
                children: "Region"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "region",
                value: region,
                onChange: (e) => setRegion(e.target.value),
                placeholder: "eastus / us-central1",
                "data-ocid": "ai_provider_form.region_input",
                className: "bg-muted/40 border-border focus:border-primary/60"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "max-tokens",
                className: "text-sm font-medium text-foreground",
                children: "Max Tokens"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "max-tokens",
                type: "number",
                min: 1,
                max: 128e3,
                value: maxTokens,
                onChange: (e) => setMaxTokens(Number(e.target.value)),
                "data-ocid": "ai_provider_form.max_tokens_input",
                className: "bg-muted/40 border-border focus:border-primary/60"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "temperature",
                className: "text-sm font-medium text-foreground",
                children: [
                  "Temperature (",
                  temperature.toFixed(1),
                  ")"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "temperature",
                type: "range",
                min: 0,
                max: 2,
                step: 0.1,
                value: temperature,
                onChange: (e) => setTemperature(Number(e.target.value)),
                "data-ocid": "ai_provider_form.temperature_input",
                className: "w-full accent-primary"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "timeout",
                className: "text-sm font-medium text-foreground",
                children: "Timeout (s)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "timeout",
                type: "number",
                min: 5,
                max: 300,
                value: timeoutSecs,
                onChange: (e) => setTimeoutSecs(Number(e.target.value)),
                "data-ocid": "ai_provider_form.timeout_input",
                className: "bg-muted/40 border-border focus:border-primary/60"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              "data-ocid": "ai_provider_form.submit_button",
              className: "bg-primary text-primary-foreground hover:bg-primary/90",
              children: editProvider ? "Save Changes" : "Add Provider"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: onCancel,
              "data-ocid": "ai_provider_form.cancel_button",
              children: "Cancel"
            }
          )
        ] })
      ]
    }
  );
}
const PROVIDER_LABELS = {
  [AIProviderType.Native]: "Native ForgeAI",
  [AIProviderType.OpenAI]: "OpenAI",
  [AIProviderType.AzureOpenAI]: "Azure OpenAI",
  [AIProviderType.AnthropicClaude]: "Anthropic Claude",
  [AIProviderType.GoogleGemini]: "Google Gemini",
  [AIProviderType.Mistral]: "Mistral",
  [AIProviderType.LocalLLM]: "Local / Private LLM",
  [AIProviderType.CustomEndpoint]: "Custom Endpoint"
};
function AIProviderList({
  providers,
  onEdit,
  onDelete,
  onToggle
}) {
  const [testingId, setTestingId] = reactExports.useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = reactExports.useState(null);
  if (providers.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "text-center py-12 text-muted-foreground text-sm",
        "data-ocid": "ai_providers.empty_state",
        children: "No external AI providers configured yet."
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "ai_providers.list", children: providers.map((provider, index) => {
    const isNative = provider.providerType === AIProviderType.Native;
    const isActive = provider.status === AIProviderStatus.Active;
    const isDisabled = provider.status === AIProviderStatus.Disabled;
    const isTesting = provider.status === AIProviderStatus.Testing;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": `ai_providers.item.${index + 1}`,
        className: `rounded-xl border p-4 flex items-start gap-4 transition-all ${isNative ? "border-primary/30 bg-primary/5" : "border-border bg-card hover:border-border/80"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `mt-0.5 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isNative ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold", children: provider.name.charAt(0) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground truncate", children: provider.name }),
              isNative && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-xs border-primary/40 text-primary bg-primary/10",
                  children: "Default"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-xs border-border text-muted-foreground",
                  children: PROVIDER_LABELS[provider.providerType] ?? provider.providerType
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `text-xs ${isActive ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" : isTesting ? "border-amber-500/40 text-amber-400 bg-amber-500/10" : "border-border text-muted-foreground"}`,
                  children: provider.status
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: isNative ? "Default CHANNELFORGE operational intelligence" : `Provider ID: ${provider.id}` }),
            testingId === provider.id && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-400",
                "data-ocid": `ai_providers.test_notice.${index + 1}`,
                children: "External AI activation coming in a future update. Test connection is not available yet."
              }
            ),
            deleteConfirmId === provider.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "mt-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs flex items-center gap-3",
                "data-ocid": `ai_providers.delete_confirm.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground", children: [
                    "Remove ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: provider.name }),
                    "? This cannot be undone."
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "destructive",
                      className: "h-6 text-xs px-2",
                      onClick: () => {
                        onDelete(provider.id);
                        setDeleteConfirmId(null);
                      },
                      "data-ocid": `ai_providers.confirm_button.${index + 1}`,
                      children: "Remove"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "ghost",
                      className: "h-6 text-xs px-2",
                      onClick: () => setDeleteConfirmId(null),
                      "data-ocid": `ai_providers.cancel_button.${index + 1}`,
                      children: "Cancel"
                    }
                  )
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-shrink-0", children: [
            !isNative && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "ghost",
                className: "h-8 w-8 p-0 text-muted-foreground hover:text-foreground",
                title: "Edit provider",
                onClick: () => onEdit(provider),
                "data-ocid": `ai_providers.edit_button.${index + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "ghost",
                className: "h-8 w-8 p-0 text-muted-foreground hover:text-amber-400",
                title: "Test connection",
                onClick: () => setTestingId(
                  (id) => id === provider.id ? null : provider.id
                ),
                "data-ocid": `ai_providers.test_button.${index + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "w-3.5 h-3.5" })
              }
            ),
            !isNative && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "ghost",
                  className: `h-8 w-8 p-0 ${isActive ? "text-emerald-400 hover:text-muted-foreground" : "text-muted-foreground hover:text-emerald-400"}`,
                  title: isDisabled ? "Enable provider" : "Disable provider",
                  onClick: () => onToggle(provider.id, isDisabled),
                  "data-ocid": `ai_providers.toggle_button.${index + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "ghost",
                  className: "h-8 w-8 p-0 text-muted-foreground hover:text-destructive",
                  title: "Remove provider",
                  onClick: () => setDeleteConfirmId(
                    (id) => id === provider.id ? null : provider.id
                  ),
                  "data-ocid": `ai_providers.delete_button.${index + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ] })
          ] })
        ]
      },
      provider.id
    );
  }) });
}
const ENTITY_ROWS = [
  { label: "Vendor Users", isVendor: true },
  { label: "Distributor Users", isVendor: false },
  { label: "Reseller Users", isVendor: false }
];
const ROLE_ROWS = [
  { label: "Sales" },
  { label: "Marketing" },
  { label: "IT" },
  { label: "Directors" }
];
function AIProviderVisibilityMatrix({
  providers
}) {
  const hasAccess = (provider, isEntityRow, isVendor) => {
    if (provider.providerType === AIProviderType.Native) return true;
    if (isEntityRow && isVendor) return provider.status !== "Disabled";
    return provider.isShared;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-border bg-card overflow-hidden",
      "data-ocid": "ai_visibility.matrix",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Provider Visibility Overview" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Shows which providers are accessible across your channel hierarchy." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3 text-xs font-medium text-muted-foreground w-40", children: "Entity / Role" }),
            providers.map((provider) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: "px-4 py-3 text-xs font-medium text-muted-foreground text-center max-w-[120px]",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block truncate", children: provider.name })
              },
              provider.id
            ))
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            ENTITY_ROWS.map((row, rowIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border/50 hover:bg-muted/20 transition-colors",
                "data-ocid": `ai_visibility.row.${rowIdx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs font-medium text-foreground", children: row.label }),
                  providers.map((provider) => {
                    const access = hasAccess(provider, true, row.isVendor);
                    return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: access ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-emerald-400 mx-auto" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-4 h-4 text-muted-foreground/40 mx-auto" }) }, provider.id);
                  })
                ]
              },
              row.label
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                colSpan: providers.length + 1,
                className: "px-5 py-1.5 text-xs text-muted-foreground font-medium",
                children: "Roles"
              }
            ) }),
            ROLE_ROWS.map((row, rowIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors",
                "data-ocid": `ai_visibility.role_row.${rowIdx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs text-foreground", children: row.label }),
                  providers.map((provider) => {
                    const access = hasAccess(provider, false);
                    return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: access ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-emerald-400 mx-auto" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-4 h-4 text-muted-foreground/40 mx-auto" }) }, provider.id);
                  })
                ]
              },
              row.label
            ))
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-t border-border bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "To change access settings, go to the",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-medium", children: "Governance" }),
          " tab."
        ] }) })
      ]
    }
  );
}
function useAIProviders() {
  const { actor } = useActor();
  const [providers, setProviders] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const loadProviders = reactExports.useCallback(
    async (workspaceId) => {
      if (!actor) return;
      setLoading(true);
      setError(null);
      try {
        const result = await actor.aiListProviders(workspaceId);
        const native = {
          id: "native-forgeai",
          name: "Native ForgeAI",
          providerType: AIProviderType.Native,
          workspaceId,
          createdBy: "system",
          createdAt: BigInt(0),
          status: AIProviderStatus.Active,
          isShared: false
        };
        const nonNative = result.filter(
          (p) => p.providerType !== AIProviderType.Native
        );
        setProviders([native, ...nonNative]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load AI providers"
        );
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );
  const addProvider = reactExports.useCallback(
    async (name, type, config) => {
      if (!actor) return false;
      setLoading(true);
      setError(null);
      try {
        const providerId = `provider-${Date.now()}`;
        const provider = {
          id: providerId,
          name,
          providerType: type,
          workspaceId: config.providerId ?? "",
          createdBy: "current-user",
          createdAt: BigInt(Date.now()),
          status: AIProviderStatus.Testing,
          isShared: false
        };
        const fullConfig = {
          providerId,
          endpointUrl: config.endpointUrl,
          modelName: config.modelName,
          orgId: config.orgId,
          deploymentName: config.deploymentName,
          region: config.region,
          maxTokens: config.maxTokens ?? BigInt(4096),
          temperature: config.temperature ?? 0.7,
          timeoutSecs: config.timeoutSecs ?? BigInt(30),
          maskedApiKey: config.maskedApiKey
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
    [actor]
  );
  const deleteProvider = reactExports.useCallback(
    async (providerId) => {
      if (!actor) return false;
      try {
        const ok = await actor.aiDeleteProvider(providerId);
        if (ok) {
          setProviders((prev) => prev.filter((p) => p.id !== providerId));
        }
        return ok;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete provider"
        );
        return false;
      }
    },
    [actor]
  );
  const enableProvider = reactExports.useCallback(
    async (providerId) => {
      if (!actor) return false;
      try {
        const ok = await actor.aiEnableProvider(providerId);
        if (ok) {
          setProviders(
            (prev) => prev.map(
              (p) => p.id === providerId ? { ...p, status: AIProviderStatus.Active } : p
            )
          );
        }
        return ok;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to enable provider"
        );
        return false;
      }
    },
    [actor]
  );
  const disableProvider = reactExports.useCallback(
    async (providerId) => {
      if (!actor) return false;
      try {
        const ok = await actor.aiDisableProvider(providerId);
        if (ok) {
          setProviders(
            (prev) => prev.map(
              (p) => p.id === providerId ? { ...p, status: AIProviderStatus.Disabled } : p
            )
          );
        }
        return ok;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to disable provider"
        );
        return false;
      }
    },
    [actor]
  );
  return {
    providers,
    loading,
    error,
    loadProviders,
    addProvider,
    deleteProvider,
    enableProvider,
    disableProvider
  };
}
const TABS = [
  { id: "overview", label: "Overview", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4" }) },
  { id: "providers", label: "Providers", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-4 h-4" }) },
  {
    id: "add",
    label: "Add Provider",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "w-4 h-4" })
  },
  {
    id: "governance",
    label: "Governance",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4" })
  },
  {
    id: "audit",
    label: "Audit Log",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-4 h-4" })
  }
];
function AIProviderSettings({ wsType }) {
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const {
    providers,
    loading,
    error,
    loadProviders,
    addProvider,
    deleteProvider,
    enableProvider,
    disableProvider
  } = useAIProviders();
  reactExports.useEffect(() => {
    loadProviders(wsType);
  }, [wsType, loadProviders]);
  const activeCount = providers.filter((p) => p.status === "Active").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl border border-border bg-card overflow-hidden",
      "data-ocid": "ai_provider_settings.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 px-5 py-3 border-b border-amber-500/20 bg-amber-500/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-400", children: "External AI activation coming in a future update. Current responses use Native ForgeAI simulation only." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "w-5 h-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-foreground", children: "AI Provider Settings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Bring Your Own AI — Configure, govern, and control AI access across your channel hierarchy." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex border-b border-border bg-muted/20 overflow-x-auto", children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setActiveTab(tab.id),
            "data-ocid": `ai_provider_settings.tab.${tab.id}`,
            className: `flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`,
            children: [
              tab.icon,
              tab.label
            ]
          },
          tab.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
          loading && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-center py-8 text-muted-foreground text-sm",
              "data-ocid": "ai_provider_settings.loading_state",
              children: "Loading AI providers..."
            }
          ),
          error && !loading && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-4",
              "data-ocid": "ai_provider_settings.error_state",
              children: error
            }
          ),
          !loading && activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "ai_provider_settings.overview", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-5 h-5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Active AI Provider" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Native ForgeAI" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Default CHANNELFORGE operational intelligence — always available." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/30 rounded px-2 py-0.5", children: "Active" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/30 p-4 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground", children: providers.length }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Configured Providers" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/30 p-4 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground", children: activeCount }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Active Providers" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-muted/20 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "Bring Your Own AI" }),
              " ",
              "allows organizations to connect their preferred AI provider while keeping control over model choice, access permissions, and operational governance. AI access respects all CHANNELFORGE data visibility and hierarchy rules."
            ] }) }),
            providers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(AIProviderVisibilityMatrix, { providers })
          ] }),
          !loading && activeTab === "providers" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            AIProviderList,
            {
              providers,
              onEdit: () => setActiveTab("add"),
              onDelete: deleteProvider,
              onToggle: (id, enable) => enable ? enableProvider(id) : disableProvider(id)
            }
          ),
          !loading && activeTab === "add" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            AIProviderForm,
            {
              onSave: async (name, type, config) => {
                await addProvider(name, type, config);
                setActiveTab("providers");
              },
              onCancel: () => setActiveTab("providers")
            }
          ),
          !loading && activeTab === "governance" && /* @__PURE__ */ jsxRuntimeExports.jsx(AIGovernancePanel, { wsType }),
          !loading && activeTab === "audit" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-12 gap-3",
              "data-ocid": "ai_provider_settings.audit_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-10 h-10 text-muted-foreground/40" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center max-w-xs", children: "Audit logging structure ready. Events will appear here as providers are configured." })
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  AIProviderSettings as A,
  Settings2 as S
};
