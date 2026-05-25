import type React from "react";

interface EmptyStateProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  message: string;
  action?: { label: string; onClick: () => void };
  requestAccess?: boolean;
  onRequestAccess?: () => void;
}

export function EmptyState({
  icon: Icon,
  message,
  action,
  requestAccess,
  onRequestAccess,
}: EmptyStateProps) {
  return (
    <div className="py-10 px-4 flex flex-col items-center gap-3 text-center">
      <div className="w-10 h-10 rounded-full bg-[#1E2A3E] flex items-center justify-center">
        <Icon size={18} className="text-[#7D8AA0]" />
      </div>
      <p className="text-[#7D8AA0] text-sm">{message}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="px-3 py-1.5 rounded-lg border border-[#223047] text-[#A9B6C9] hover:bg-[#1E2A3E] text-xs transition-colors"
        >
          {action.label}
        </button>
      )}
      {requestAccess && onRequestAccess && (
        <button
          type="button"
          onClick={onRequestAccess}
          className="mt-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
        >
          Request Access
        </button>
      )}
    </div>
  );
}
