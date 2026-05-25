import { Lock, Shield, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useAccessGovernance } from "../stores/accessGovernanceStore";

const PRIMARY_ADMIN_FEATURES = new Set([
  "pricing-governance",
  "cross-org-visibility",
  "infrastructure-analytics",
  "security-administration",
  "ai-governance",
  "enterprise-controls",
  "strategic-forecasting",
]);

const REASON_OPTIONS = [
  "Operational Need",
  "Business Requirement",
  "Project Requirement",
  "Role Expansion",
];

interface RequestAccessModalProps {
  featureId: string;
  featureName: string;
  featureType: string;
  onClose: () => void;
}

export default function RequestAccessModal({
  featureId,
  featureName,
  featureType,
  onClose,
}: RequestAccessModalProps) {
  const { submitRequest } = useAccessGovernance();
  const [reason, setReason] = useState(REASON_OPTIONS[0]);
  const [justification, setJustification] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  const isPrimary = PRIMARY_ADMIN_FEATURES.has(featureType);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = () => {
    if (justification.trim().length < 20) {
      setFieldError(
        "Please provide a business justification of at least 20 characters.",
      );
      return;
    }
    submitRequest(
      featureId,
      featureName,
      featureType,
      reason,
      justification.trim(),
    );
    setSubmitted(true);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleOverlayClick}
      data-ocid="request_access.dialog"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="presentation"
    >
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl border border-white/10 bg-[#0f1623] shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden"
        aria-labelledby="request-access-title"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-orange-500/10 border border-orange-500/25">
            <Lock size={16} className="text-orange-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2
              id="request-access-title"
              className="text-base font-bold text-foreground"
            >
              Request Access
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              Submit a request for governance review
            </p>
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            data-ocid="request_access.close_button"
          >
            <X size={15} />
          </button>
        </div>

        {submitted ? (
          <div
            className="flex flex-col items-center gap-4 p-10 text-center"
            data-ocid="request_access.success_state"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-green-500/10 border border-green-500/25">
              <Shield size={22} className="text-green-400" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              Request Submitted
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Your access request has been submitted for review. You will be
              notified once a decision has been made.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-6 py-2 rounded-lg text-sm font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 transition-all"
              data-ocid="request_access.done_button"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Requested feature - read-only */}
            <div>
              <p className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Requested Feature
              </p>
              <div className="px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-foreground">
                {featureName}
              </div>
            </div>

            {/* Routing tier banner */}
            <div
              className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm ${isPrimary ? "border-orange-500/30 bg-orange-500/8 text-orange-300" : "border-blue-500/25 bg-blue-500/8 text-blue-300"}`}
              data-ocid="request_access.routing_info"
            >
              <Shield
                size={14}
                className={`mt-0.5 flex-shrink-0 ${isPrimary ? "text-orange-400" : "text-blue-400"}`}
              />
              <span>
                <span className="font-semibold">
                  {isPrimary
                    ? "Primary Admin Required"
                    : "Secondary Admin Review"}
                </span>{" "}
                &mdash; This request will be reviewed by{" "}
                {isPrimary ? "a Primary Admin" : "a Secondary Admin"}.
              </span>
            </div>

            {/* Reason */}
            <div>
              <label
                htmlFor="access-reason"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"
              >
                Reason
              </label>
              <select
                id="access-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-foreground focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/25"
                data-ocid="request_access.reason_select"
              >
                {REASON_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#1a1f2e]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Justification */}
            <div>
              <label
                htmlFor="access-justification"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"
              >
                Business Justification{" "}
                <span className="text-muted-foreground/60 font-normal normal-case">
                  (required, min 20 chars)
                </span>
              </label>
              <textarea
                id="access-justification"
                value={justification}
                onChange={(e) => {
                  setJustification(e.target.value);
                  if (fieldError) setFieldError("");
                }}
                rows={4}
                placeholder="Describe your operational need and how this access supports your role or a specific project..."
                className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/25 resize-none"
                data-ocid="request_access.justification_textarea"
              />
              {fieldError && (
                <p
                  className="mt-1.5 text-xs text-red-400"
                  data-ocid="request_access.field_error"
                >
                  {fieldError}
                </p>
              )}
            </div>

            {/* Request type - read-only */}
            <div>
              <p className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Request Type
              </p>
              <div className="px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-foreground flex items-center justify-between">
                <span>Permanent</span>
                <span className="text-xs text-muted-foreground/60 italic">
                  Temporary access coming soon
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground border border-white/10 hover:border-white/20 hover:text-foreground transition-all"
                data-ocid="request_access.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-orange-500 text-white hover:bg-orange-400 transition-all shadow-[0_4px_16px_rgba(249,115,22,0.3)] hover:shadow-[0_4px_24px_rgba(249,115,22,0.45)]"
                data-ocid="request_access.submit_button"
              >
                Submit Request
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
