import { Lock, ShieldOff } from "lucide-react";
import type React from "react";
import { useState } from "react";
import RequestAccessModal from "./RequestAccessModal";

interface AccessDeniedProps {
  featureName: string;
  onRequestAccess?: () => void;
  showRequestButton?: boolean;
}

export function AccessDenied({
  featureName,
  onRequestAccess,
  showRequestButton = true,
}: AccessDeniedProps): React.ReactElement {
  const [modalOpen, setModalOpen] = useState(false);

  function handleRequest() {
    if (onRequestAccess) {
      onRequestAccess();
    } else {
      setModalOpen(true);
    }
  }

  return (
    <>
      <div
        className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white/5 backdrop-blur border border-white/10 rounded-xl"
        data-ocid="access_denied.panel"
      >
        {/* Icon cluster */}
        <div className="relative mb-6" aria-hidden="true">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(255,107,43,0.08)",
              border: "1px solid rgba(255,107,43,0.25)",
              boxShadow: "0 0 24px rgba(255,107,43,0.08)",
            }}
          >
            <Lock size={28} className="text-orange-400" />
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(30,48,80,0.9)",
              border: "1px solid rgba(255,107,43,0.3)",
            }}
          >
            <ShieldOff size={12} style={{ color: "rgba(255,107,43,0.6)" }} />
          </div>
        </div>

        {/* Feature badge */}
        <div
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
          style={{
            background: "rgba(255,107,43,0.07)",
            border: "1px solid rgba(255,107,43,0.2)",
            color: "rgba(255,107,43,0.7)",
          }}
        >
          <Lock size={10} />
          {featureName}
        </div>

        {/* Primary message */}
        <h3 className="text-white font-semibold text-lg mb-2">
          You do not currently have access to this operational area.
        </h3>
        <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-8">
          Access to this area is controlled by your organisation's admin. Submit
          a request if you require access.
        </p>

        {/* CTA */}
        {showRequestButton && (
          <button
            type="button"
            onClick={handleRequest}
            data-ocid="access_denied.request_access.button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "rgba(255,107,43,0.12)",
              border: "1px solid rgba(255,107,43,0.35)",
              color: "#FF6B2B",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,107,43,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,107,43,0.12)";
            }}
          >
            <Lock size={14} />
            Request Access
          </button>
        )}
      </div>

      {modalOpen && (
        <RequestAccessModal
          featureId={
            featureName?.toLowerCase().replace(/\s+/g, "-") || "feature"
          }
          featureType="module"
          featureName={featureName}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
