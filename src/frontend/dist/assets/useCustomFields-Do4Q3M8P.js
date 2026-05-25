import { j as jsxRuntimeExports, aF as Label, h as cn, ad as Input, r as reactExports, aH as Tag, X, p as useActor, aY as useQueryClient, aZ as useQuery } from "./index-DvFvlUBj.js";
import { C as Checkbox } from "./checkbox-Cr6u9Lap.js";
import { T as Textarea } from "./textarea-BHUaDciu.js";
import { u as useMutation } from "./useMutation-D0Tr8pyU.js";
const REGIONS = [
  "EMEA",
  "APAC",
  "Americas",
  "UK",
  "DACH",
  "France",
  "Nordics",
  "Benelux",
  "South Europe",
  "Eastern Europe",
  "Middle East",
  "Africa",
  "North America",
  "LATAM",
  "ANZ",
  "Japan",
  "China"
];
function TagInput({
  value,
  onChange,
  disabled
}) {
  const [input, setInput] = reactExports.useState("");
  const tags = value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];
  function addTag(tag) {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed].join(","));
    setInput("");
  }
  function removeTag(tag) {
    onChange(tags.filter((t) => t !== tag).join(","));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 p-2 border border-input rounded-md bg-background min-h-[40px] focus-within:ring-2 focus-within:ring-primary", children: [
    tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "inline-flex items-center gap-1 bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-3 h-3" }),
          tag,
          !disabled && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => removeTag(tag),
              className: "hover:text-destructive",
              "aria-label": `Remove tag ${tag}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
            }
          )
        ]
      },
      tag
    )),
    !disabled && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        value: input,
        onChange: (e) => setInput(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(input);
          }
        },
        onBlur: () => addTag(input),
        placeholder: "Add tag…",
        className: "flex-1 min-w-[80px] bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
      }
    )
  ] });
}
function MultiSelectInput({
  options,
  value,
  onChange,
  disabled
}) {
  const selected = value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];
  function toggle(opt) {
    if (disabled) return;
    const next = selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt];
    onChange(next.join(","));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: options.map((opt) => {
    const active = selected.includes(opt);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => toggle(opt),
        disabled,
        className: cn(
          "text-xs px-3 py-1 rounded-full border transition-colors",
          active ? "bg-primary/20 border-primary/50 text-primary" : "bg-muted border-border text-muted-foreground hover:border-primary/40",
          disabled && "opacity-50 cursor-not-allowed"
        ),
        children: opt
      },
      opt
    );
  }) });
}
function EditorBody({
  fieldType,
  allowedValues,
  value,
  onChange,
  disabled,
  placeholder
}) {
  switch (fieldType) {
    case "text":
    case "url":
    case "email":
    case "phoneNumber":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: fieldType === "email" ? "email" : fieldType === "url" ? "url" : "text",
          value,
          onChange: (e) => onChange(e.target.value),
          disabled,
          placeholder: placeholder ?? "",
          className: "focus-visible:ring-primary"
        }
      );
    case "longText":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          value,
          onChange: (e) => onChange(e.target.value),
          disabled,
          placeholder: placeholder ?? "",
          rows: 3,
          className: "focus-visible:ring-primary resize-none"
        }
      );
    case "number":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "number",
          value,
          onChange: (e) => onChange(e.target.value),
          disabled,
          placeholder: "0",
          className: "focus-visible:ring-primary"
        }
      );
    case "currency":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none", children: "$" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            step: "0.01",
            value,
            onChange: (e) => onChange(e.target.value),
            disabled,
            placeholder: "0.00",
            className: "pl-7 focus-visible:ring-primary"
          }
        )
      ] });
    case "percentage":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            step: "0.1",
            min: "0",
            max: "100",
            value,
            onChange: (e) => onChange(e.target.value),
            disabled,
            placeholder: "0",
            className: "pr-8 focus-visible:ring-primary"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none", children: "%" })
      ] });
    case "dropdown":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value,
          onChange: (e) => onChange(e.target.value),
          disabled,
          className: "w-full rounded-md border border-input bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select —" }),
            allowedValues.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt, children: opt }, opt))
          ]
        }
      );
    case "multiSelect":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        MultiSelectInput,
        {
          options: allowedValues,
          value,
          onChange,
          disabled
        }
      );
    case "date":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "date",
          value,
          onChange: (e) => onChange(e.target.value),
          disabled,
          className: "focus-visible:ring-primary"
        }
      );
    case "datetime":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "datetime-local",
          value,
          onChange: (e) => onChange(e.target.value),
          disabled,
          className: "focus-visible:ring-primary"
        }
      );
    case "checkbox":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Checkbox,
          {
            checked: value === "true" || value === "1",
            onCheckedChange: (checked) => onChange(checked ? "true" : "false"),
            disabled,
            className: "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: value === "true" || value === "1" ? "Enabled" : "Disabled" })
      ] });
    case "attachment":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-dashed border-border rounded-md p-4 text-center text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Attachment upload" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1 text-muted-foreground/60", children: "Upload via object storage — file key stored as value" }),
        value && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-primary font-mono break-all", children: value })
      ] });
    case "tag":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(TagInput, { value, onChange, disabled });
    case "regionSelector":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value,
          onChange: (e) => onChange(e.target.value),
          disabled,
          className: "w-full rounded-md border border-input bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select Region —" }),
            REGIONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r, children: r }, r))
          ]
        }
      );
    case "userSelector":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "text",
          value,
          onChange: (e) => onChange(e.target.value),
          disabled,
          placeholder: "User name or ID…",
          className: "focus-visible:ring-primary"
        }
      );
    case "organizationSelector":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "text",
          value,
          onChange: (e) => onChange(e.target.value),
          disabled,
          placeholder: "Organisation name or ID…",
          className: "focus-visible:ring-primary"
        }
      );
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value,
          onChange: (e) => onChange(e.target.value),
          disabled,
          className: "focus-visible:ring-primary"
        }
      );
  }
}
function CustomFieldEditor({
  fieldDef,
  value,
  onChange,
  error,
  disabled
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-foreground flex items-center gap-1", children: [
      fieldDef.fieldLabel,
      fieldDef.isRequired && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive text-xs", children: "*" })
    ] }),
    fieldDef.fieldDescription && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: fieldDef.fieldDescription }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          error && "[&_input]:border-destructive [&_select]:border-destructive [&_textarea]:border-destructive"
        ),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          EditorBody,
          {
            fieldType: fieldDef.fieldType,
            allowedValues: fieldDef.allowedValues,
            value,
            onChange,
            disabled,
            placeholder: fieldDef.fieldDescription ?? void 0
          }
        )
      }
    ),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", role: "alert", children: error })
  ] });
}
function useCustomFields(objectType, objectId) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [pendingChanges, setPendingChanges] = reactExports.useState(
    {}
  );
  const [errors, setErrors] = reactExports.useState({});
  const [validationResults, setValidationResults] = reactExports.useState([]);
  const defsQuery = useQuery({
    queryKey: ["customFieldDefs", objectType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCustomFieldDefs(objectType);
    },
    enabled: !!actor && !!objectType,
    staleTime: 5 * 60 * 1e3
  });
  const valuesQuery = useQuery({
    queryKey: ["customFieldValues", objectType, objectId],
    queryFn: async () => {
      if (!actor || !objectId) return [];
      return actor.getCustomFieldValues(objectId, objectType);
    },
    enabled: !!actor && !!objectId,
    staleTime: 3e4
  });
  const fieldValues = reactExports.useMemo(() => {
    const map = {};
    for (const v of valuesQuery.data ?? []) {
      map[v.fieldDefId] = v;
    }
    return map;
  }, [valuesQuery.data]);
  const saveMutation = useMutation({
    mutationFn: async (changes) => {
      if (!actor) throw new Error("No actor");
      const results = [];
      for (const [fieldDefId, value] of Object.entries(changes)) {
        const result = await actor.setCustomFieldValue({
          fieldDefId,
          objectId,
          objectType,
          value,
          uploadedFileKeys: []
        });
        results.push(result);
      }
      return results;
    },
    onSuccess: (results) => {
      setValidationResults(results);
      const newErrors = {};
      for (const r of results) {
        if (!r.isValid && r.errorMessage) {
          newErrors[r.fieldDefId] = r.errorMessage;
        }
      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        setPendingChanges({});
        queryClient.invalidateQueries({
          queryKey: ["customFieldValues", objectType, objectId]
        });
      }
    },
    onError: (err) => {
      setErrors({ _global: err.message });
    }
  });
  const setFieldValue = reactExports.useCallback((fieldDefId, value) => {
    setPendingChanges((prev) => ({ ...prev, [fieldDefId]: value }));
    setErrors((prev) => {
      if (!prev[fieldDefId]) return prev;
      const next = { ...prev };
      delete next[fieldDefId];
      return next;
    });
  }, []);
  const saveFieldValues = reactExports.useCallback(async () => {
    if (Object.keys(pendingChanges).length === 0) return;
    await saveMutation.mutateAsync(pendingChanges);
  }, [pendingChanges, saveMutation]);
  const validateAll = reactExports.useCallback(() => {
    var _a;
    const newErrors = {};
    const defs = defsQuery.data ?? [];
    for (const def of defs) {
      if (def.isArchived) continue;
      const pendingVal = pendingChanges[def.id];
      const existingVal = (_a = fieldValues[def.id]) == null ? void 0 : _a.value;
      const currentVal = pendingVal !== void 0 ? pendingVal : existingVal ?? "";
      if (def.isRequired && !currentVal) {
        newErrors[def.id] = `${def.fieldLabel} is required.`;
      }
      for (const rule of def.validationRules) {
        if (rule.ruleType === "minLength" && currentVal.length < Number(rule.ruleValue)) {
          newErrors[def.id] = `Minimum ${rule.ruleValue} characters required.`;
        }
        if (rule.ruleType === "maxLength" && currentVal.length > Number(rule.ruleValue)) {
          newErrors[def.id] = `Maximum ${rule.ruleValue} characters allowed.`;
        }
        if (rule.ruleType === "regex") {
          try {
            if (!new RegExp(rule.ruleValue).test(currentVal)) {
              newErrors[def.id] = "Value does not match required format.";
            }
          } catch {
          }
        }
        if (rule.ruleType === "minValue" && Number(currentVal) < Number(rule.ruleValue)) {
          newErrors[def.id] = `Minimum value is ${rule.ruleValue}.`;
        }
        if (rule.ruleType === "maxValue" && Number(currentVal) > Number(rule.ruleValue)) {
          newErrors[def.id] = `Maximum value is ${rule.ruleValue}.`;
        }
      }
    }
    setErrors(newErrors);
    return newErrors;
  }, [defsQuery.data, pendingChanges, fieldValues]);
  return {
    fieldDefs: defsQuery.data ?? [],
    fieldValues,
    pendingChanges,
    isLoading: defsQuery.isLoading || valuesQuery.isLoading,
    isSaving: saveMutation.isPending,
    errors,
    validationResults,
    setFieldValue,
    saveFieldValues,
    validateAll,
    hasPendingChanges: Object.keys(pendingChanges).length > 0
  };
}
export {
  CustomFieldEditor as C,
  useCustomFields as u
};
