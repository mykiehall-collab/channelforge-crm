import { Brain } from "lucide-react";
import { useEffect } from "react";

interface ForgeAIChatButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
}

export function ForgeAIChatButton({
  isOpen,
  onToggle,
  unreadCount = 0,
}: ForgeAIChatButtonProps) {
  // Global keyboard shortcut: Cmd/Ctrl+K
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onToggle();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onToggle]);

  return (
    <div
      className="fixed bottom-6 right-6 z-50"
      data-ocid="forgeai.open_modal_button"
    >
      {/* Tooltip */}
      <div
        className={`absolute bottom-full right-0 mb-2 px-2.5 py-1 rounded-lg bg-card border border-border shadow-lg text-xs text-foreground font-body whitespace-nowrap pointer-events-none transition-opacity duration-150 ${
          isOpen ? "opacity-0" : "opacity-0 group-hover:opacity-100"
        }`}
        role="tooltip"
      >
        ForgeAI
        <span className="ml-2 text-muted-foreground">⌘K</span>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={`group relative h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          isOpen
            ? "bg-primary hover:bg-primary/90"
            : "bg-primary hover:bg-primary/90 forgeai-pulse"
        }`}
        aria-label="Toggle ForgeAI chat (⌘K)"
        aria-pressed={isOpen}
        aria-expanded={isOpen}
      >
        <Brain
          className={`w-6 h-6 text-primary-foreground transition-transform duration-200 ${
            isOpen ? "rotate-0 scale-90" : "rotate-0"
          }`}
        />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center font-mono px-1"
            aria-label={`${unreadCount} unread messages`}
            data-ocid="forgeai.unread_badge"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}

        {/* Tooltip on hover */}
        <span
          className="absolute bottom-full right-0 mb-2 px-2.5 py-1 rounded-lg bg-card border border-border shadow-lg text-xs text-foreground font-body whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          role="tooltip"
          aria-hidden="true"
        >
          ForgeAI
          <span className="ml-2 text-muted-foreground text-[10px]">⌘K</span>
        </span>
      </button>
    </div>
  );
}
