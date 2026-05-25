import type { AIProvider } from "@/backend";
import { AIProviderType } from "@/backend";
import { Check, Minus } from "lucide-react";

const ENTITY_ROWS = [
  { label: "Vendor Users", isVendor: true },
  { label: "Distributor Users", isVendor: false },
  { label: "Reseller Users", isVendor: false },
];

const ROLE_ROWS = [
  { label: "Sales" },
  { label: "Marketing" },
  { label: "IT" },
  { label: "Directors" },
];

interface AIProviderVisibilityMatrixProps {
  providers: AIProvider[];
}

export function AIProviderVisibilityMatrix({
  providers,
}: AIProviderVisibilityMatrixProps) {
  const hasAccess = (
    provider: AIProvider,
    isEntityRow: boolean,
    isVendor?: boolean,
  ): boolean => {
    if (provider.providerType === AIProviderType.Native) return true;
    if (isEntityRow && isVendor) return provider.status !== "Disabled";
    return provider.isShared;
  };

  return (
    <div
      className="rounded-xl border border-border bg-card overflow-hidden"
      data-ocid="ai_visibility.matrix"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">
          Provider Visibility Overview
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Shows which providers are accessible across your channel hierarchy.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground w-40">
                Entity / Role
              </th>
              {providers.map((provider) => (
                <th
                  key={provider.id}
                  className="px-4 py-3 text-xs font-medium text-muted-foreground text-center max-w-[120px]"
                >
                  <span className="block truncate">{provider.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Entity rows */}
            {ENTITY_ROWS.map((row, rowIdx) => (
              <tr
                key={row.label}
                className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                data-ocid={`ai_visibility.row.${rowIdx + 1}`}
              >
                <td className="px-5 py-3 text-xs font-medium text-foreground">
                  {row.label}
                </td>
                {providers.map((provider) => {
                  const access = hasAccess(provider, true, row.isVendor);
                  return (
                    <td key={provider.id} className="px-4 py-3 text-center">
                      {access ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Divider row */}
            <tr className="bg-muted/20">
              <td
                colSpan={providers.length + 1}
                className="px-5 py-1.5 text-xs text-muted-foreground font-medium"
              >
                Roles
              </td>
            </tr>

            {/* Role rows */}
            {ROLE_ROWS.map((row, rowIdx) => (
              <tr
                key={row.label}
                className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                data-ocid={`ai_visibility.role_row.${rowIdx + 1}`}
              >
                <td className="px-5 py-3 text-xs text-foreground">
                  {row.label}
                </td>
                {providers.map((provider) => {
                  const access = hasAccess(provider, false);
                  return (
                    <td key={provider.id} className="px-4 py-3 text-center">
                      {access ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border bg-muted/20">
        <p className="text-xs text-muted-foreground">
          To change access settings, go to the{" "}
          <span className="text-primary font-medium">Governance</span> tab.
        </p>
      </div>
    </div>
  );
}
