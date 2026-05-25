import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Check,
  Download,
  ExternalLink,
  Mail,
  Phone,
  Tag,
  X,
} from "lucide-react";
import type {
  CustomFieldDef,
  CustomFieldType,
  CustomFieldValue,
} from "../backend.d";

interface CustomFieldRendererProps {
  fieldDef: CustomFieldDef;
  value: CustomFieldValue | undefined;
  className?: string;
}

function formatCurrency(raw: string): string {
  const num = Number.parseFloat(raw);
  if (Number.isNaN(num)) return raw;
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

function formatDate(raw: string): string {
  if (!raw) return "—";
  try {
    return new Date(raw).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return raw;
  }
}

function formatDatetime(raw: string): string {
  if (!raw) return "—";
  try {
    return new Date(raw).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return raw;
  }
}

function RiskBadge({ label }: { label: string }) {
  return (
    <Badge className="bg-primary/20 text-primary border border-primary/40 text-xs">
      {label}
    </Badge>
  );
}

type RendererProps = {
  fieldType: CustomFieldType;
  value: string;
  allowedValues: string[];
  fileKeys: string[];
};

function FieldValueRenderer({
  fieldType,
  value,
  allowedValues: _av,
  fileKeys,
}: RendererProps) {
  if (!value && fieldType !== "checkbox") {
    return <span className="text-muted-foreground italic text-sm">—</span>;
  }

  switch (fieldType) {
    case "text":
      return <span className="text-sm text-foreground">{value}</span>;

    case "longText":
      return (
        <p className="text-sm text-foreground whitespace-pre-wrap break-words leading-relaxed">
          {value}
        </p>
      );

    case "number":
      return (
        <span className="text-sm font-mono text-foreground">
          {Number(value).toLocaleString()}
        </span>
      );

    case "currency":
      return (
        <span className="text-sm font-mono text-foreground">
          {formatCurrency(value)}
        </span>
      );

    case "percentage":
      return (
        <span className="text-sm font-mono text-foreground">{value}%</span>
      );

    case "dropdown":
      return <RiskBadge label={value} />;

    case "multiSelect": {
      const items = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      return (
        <div className="flex flex-wrap gap-1">
          {items.map((item) => (
            <RiskBadge key={item} label={item} />
          ))}
        </div>
      );
    }

    case "date":
      return (
        <span className="text-sm text-foreground">{formatDate(value)}</span>
      );

    case "datetime":
      return (
        <span className="text-sm text-foreground">{formatDatetime(value)}</span>
      );

    case "checkbox":
      return (
        <span className="inline-flex items-center gap-1.5 text-sm">
          {value === "true" || value === "1" ? (
            <>
              <Check className="w-4 h-4 text-primary" />
              <span className="text-foreground">Yes</span>
            </>
          ) : (
            <>
              <X className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">No</span>
            </>
          )}
        </span>
      );

    case "url":
      return (
        <a
          href={value.startsWith("http") ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {value}
        </a>
      );

    case "email":
      return (
        <a
          href={`mailto:${value}`}
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <Mail className="w-3.5 h-3.5" />
          {value}
        </a>
      );

    case "phoneNumber":
      return (
        <a
          href={`tel:${value}`}
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <Phone className="w-3.5 h-3.5" />
          {value}
        </a>
      );

    case "attachment": {
      const keys = fileKeys.length > 0 ? fileKeys : value ? [value] : [];
      return (
        <div className="flex flex-col gap-1">
          {keys.map((key) => (
            <a
              key={key}
              href={key}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              {key.split("/").pop() ?? key}
            </a>
          ))}
          {keys.length === 0 && (
            <span className="text-muted-foreground italic text-sm">
              No attachment
            </span>
          )}
        </div>
      );
    }

    case "tag": {
      const tags = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full border border-border"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      );
    }

    case "regionSelector":
      return (
        <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
          <span className="text-muted-foreground text-xs">Region:</span>
          {value}
        </span>
      );

    case "userSelector":
      return (
        <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
          <span className="text-muted-foreground text-xs">User:</span>
          {value}
        </span>
      );

    case "organizationSelector":
      return (
        <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
          <span className="text-muted-foreground text-xs">Org:</span>
          {value}
        </span>
      );

    default:
      return <span className="text-sm text-foreground">{value}</span>;
  }
}

export function CustomFieldRenderer({
  fieldDef,
  value,
  className,
}: CustomFieldRendererProps) {
  const rawValue = value?.value ?? "";
  const fileKeys = value?.uploadedFileKeys ?? [];

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {fieldDef.fieldLabel}
      </span>
      <FieldValueRenderer
        fieldType={fieldDef.fieldType}
        value={rawValue}
        allowedValues={fieldDef.allowedValues}
        fileKeys={fileKeys}
      />
    </div>
  );
}
