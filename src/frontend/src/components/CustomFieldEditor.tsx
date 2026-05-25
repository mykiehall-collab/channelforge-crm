import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Tag, X } from "lucide-react";
import { useState } from "react";
import type { CustomFieldDef, CustomFieldType } from "../backend.d";

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
  "China",
];

interface CustomFieldEditorProps {
  fieldDef: CustomFieldDef;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

function TagInput({
  value,
  onChange,
  disabled,
}: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const [input, setInput] = useState("");
  const tags = value
    ? value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed].join(","));
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag).join(","));
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border border-input rounded-md bg-background min-h-[40px] focus-within:ring-2 focus-within:ring-primary">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full"
        >
          <Tag className="w-3 h-3" />
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-destructive"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}
      {!disabled && (
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(input);
            }
          }}
          onBlur={() => addTag(input)}
          placeholder="Add tag…"
          className="flex-1 min-w-[80px] bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
        />
      )}
    </div>
  );
}

function MultiSelectInput({
  options,
  value,
  onChange,
  disabled,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const selected = value
    ? value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  function toggle(opt: string) {
    if (disabled) return;
    const next = selected.includes(opt)
      ? selected.filter((s) => s !== opt)
      : [...selected, opt];
    onChange(next.join(","));
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            disabled={disabled}
            className={cn(
              "text-xs px-3 py-1 rounded-full border transition-colors",
              active
                ? "bg-primary/20 border-primary/50 text-primary"
                : "bg-muted border-border text-muted-foreground hover:border-primary/40",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

type EditorBodyProps = {
  fieldType: CustomFieldType;
  allowedValues: string[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

function EditorBody({
  fieldType,
  allowedValues,
  value,
  onChange,
  disabled,
  placeholder,
}: EditorBodyProps) {
  switch (fieldType) {
    case "text":
    case "url":
    case "email":
    case "phoneNumber":
      return (
        <Input
          type={
            fieldType === "email"
              ? "email"
              : fieldType === "url"
                ? "url"
                : "text"
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder ?? ""}
          className="focus-visible:ring-primary"
        />
      );

    case "longText":
      return (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder ?? ""}
          rows={3}
          className="focus-visible:ring-primary resize-none"
        />
      );

    case "number":
      return (
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="0"
          className="focus-visible:ring-primary"
        />
      );

    case "currency":
      return (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">
            $
          </span>
          <Input
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="0.00"
            className="pl-7 focus-visible:ring-primary"
          />
        </div>
      );

    case "percentage":
      return (
        <div className="relative">
          <Input
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="0"
            className="pr-8 focus-visible:ring-primary"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">
            %
          </span>
        </div>
      );

    case "dropdown":
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full rounded-md border border-input bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        >
          <option value="">— Select —</option>
          {allowedValues.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );

    case "multiSelect":
      return (
        <MultiSelectInput
          options={allowedValues}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case "date":
      return (
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="focus-visible:ring-primary"
        />
      );

    case "datetime":
      return (
        <Input
          type="datetime-local"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="focus-visible:ring-primary"
        />
      );

    case "checkbox":
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={value === "true" || value === "1"}
            onCheckedChange={(checked) => onChange(checked ? "true" : "false")}
            disabled={disabled}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span className="text-sm text-muted-foreground">
            {value === "true" || value === "1" ? "Enabled" : "Disabled"}
          </span>
        </div>
      );

    case "attachment":
      return (
        <div className="border-2 border-dashed border-border rounded-md p-4 text-center text-sm text-muted-foreground">
          <p>Attachment upload</p>
          <p className="text-xs mt-1 text-muted-foreground/60">
            Upload via object storage — file key stored as value
          </p>
          {value && (
            <p className="mt-2 text-xs text-primary font-mono break-all">
              {value}
            </p>
          )}
        </div>
      );

    case "tag":
      return <TagInput value={value} onChange={onChange} disabled={disabled} />;

    case "regionSelector":
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full rounded-md border border-input bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        >
          <option value="">— Select Region —</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      );

    case "userSelector":
      return (
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="User name or ID…"
          className="focus-visible:ring-primary"
        />
      );

    case "organizationSelector":
      return (
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Organisation name or ID…"
          className="focus-visible:ring-primary"
        />
      );

    default:
      return (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="focus-visible:ring-primary"
        />
      );
  }
}

export function CustomFieldEditor({
  fieldDef,
  value,
  onChange,
  error,
  disabled,
}: CustomFieldEditorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium text-foreground flex items-center gap-1">
        {fieldDef.fieldLabel}
        {fieldDef.isRequired && (
          <span className="text-destructive text-xs">*</span>
        )}
      </Label>
      {fieldDef.fieldDescription && (
        <p className="text-xs text-muted-foreground">
          {fieldDef.fieldDescription}
        </p>
      )}
      <div
        className={cn(
          error &&
            "[&_input]:border-destructive [&_select]:border-destructive [&_textarea]:border-destructive",
        )}
      >
        <EditorBody
          fieldType={fieldDef.fieldType}
          allowedValues={fieldDef.allowedValues}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={fieldDef.fieldDescription ?? undefined}
        />
      </div>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
