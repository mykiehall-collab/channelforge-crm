import { Lock } from "lucide-react";
import type React from "react";
import { useState } from "react";
import RequestAccessModal from "./RequestAccessModal";

interface LockIndicatorProps {
  isLocked: boolean;
  lockedItemId: string;
  lockedItemName: string;
  lockedItemType: string;
  children: React.ReactNode;
  className?: string;
}

export default function LockIndicator({
  isLocked,
  lockedItemId,
  lockedItemName,
  lockedItemType,
  children,
  className = "",
}: LockIndicatorProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        className={`relative rounded-xl overflow-hidden ${className}`}
        data-ocid={`lock_indicator.${lockedItemId}.container`}
      >
        {/* Blurred/faded content layer */}
        <div className="opacity-20 pointer-events-none select-none">
          {children}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0f1623e0] backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-2 px-6 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-orange-500/10 border border-orange-500/25 shadow-[0_0_20px_rgba(249,115,22,0.2)] governance-lock-indicator">
              <Lock
                size={22}
                className="text-orange-400 animate-pulse"
                aria-hidden="true"
              />
            </div>
            <p className="text-orange-400 font-semibold tracking-wide">
              Access Restricted
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">
              {lockedItemName}
            </p>
            <button
              type="button"
              className="mt-1 px-5 py-2 rounded-lg text-xs font-semibold tracking-wide border border-orange-500/40 text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 hover:border-orange-500/60 transition-all duration-200"
              onClick={() => setModalOpen(true)}
              data-ocid={`lock_indicator.${lockedItemId}.request_access_button`}
            >
              Request Access
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <RequestAccessModal
          featureId={lockedItemId}
          featureName={lockedItemName}
          featureType={lockedItemType}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
