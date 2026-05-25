import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "../AppContext";

// Simulate account access check — in production this would check against
// the user's visible account scope from the backend/AppContext
function canAccessAccount(
  accountId: string,
  _context: AccountNameContext,
): boolean {
  // All accounts that are "visible" in the user's org scope are accessible.
  // We treat any non-empty accountId as accessible by default;
  // real permission checking happens server-side.
  return accountId.length > 0;
}

export type AccountNameContext =
  | "pipeline"
  | "account-table"
  | "deal-registration"
  | "renewal"
  | "report"
  | "search";

interface ClickableAccountNameProps {
  accountName: string;
  accountId: string;
  opportunityId?: string;
  context: AccountNameContext;
  /** Extra classes applied to the root element */
  className?: string;
}

/**
 * Renders a company/account name as a premium clickable link.
 * Routing is context-aware:
 *  - pipeline → /opportunities/:opportunityId
 *  - everything else → /accounts/:accountId
 *
 * Shows a professional access-denied modal if the user lacks permission.
 */
export function ClickableAccountName({
  accountName,
  accountId,
  opportunityId,
  context,
  className = "",
}: ClickableAccountNameProps) {
  const navigate = useNavigate();
  useApp();
  const [showDenied, setShowDenied] = useState(false);

  function handleClick(e: React.MouseEvent | React.KeyboardEvent) {
    e.stopPropagation();

    if (!canAccessAccount(accountId, context)) {
      setShowDenied(true);
      return;
    }

    if (context === "pipeline" && opportunityId) {
      navigate({ to: "/opportunities" });
    } else {
      navigate({ to: "/accounts/$id", params: { id: accountId } });
    }
  }

  return (
    <>
      <button
        type="button"
        data-ocid={`account_name.${context}.link`}
        onClick={handleClick}
        onKeyDown={(e) => e.key === "Enter" && handleClick(e)}
        className={[
          "inline-block text-left leading-snug",
          "transition-all duration-200 cursor-pointer",
          "text-foreground hover:text-accent",
          "account-name-link",
          className,
        ].join(" ")}
        style={{ WebkitTapHighlightColor: "transparent" }}
        aria-label={`Open ${accountName}`}
      >
        {accountName}
      </button>

      {/* Access-denied modal */}
      {showDenied && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowDenied(false)}
          onKeyDown={(e) => e.key === "Escape" && setShowDenied(false)}
          data-ocid="account_name.access_denied.dialog"
          aria-modal="true"
          aria-label="Access denied"
        >
          <div
            className="crm-card w-full max-w-md p-8 flex flex-col items-center gap-5 fade-in text-center"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="presentation"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-500/10 border border-orange-500/30">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-orange-400"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground mb-2">
                Access Restricted
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You do not currently have access to this account or opportunity.
                Please request access from your administrator if required.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                data-ocid="account_name.access_denied.close_button"
                onClick={() => setShowDenied(false)}
                className="px-4 py-2 text-sm border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors"
              >
                Dismiss
              </button>
              <button
                type="button"
                data-ocid="account_name.access_denied.request_button"
                onClick={() => setShowDenied(false)}
                className="px-4 py-2 text-sm rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors"
              >
                Request Access
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
