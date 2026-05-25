import { ArrowRight, Loader2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface ForgeAIChatInputProps {
  onSend: (content: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ForgeAIChatInput({
  onSend,
  isLoading,
  placeholder = "Ask ForgeAI anything…",
}: ForgeAIChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isLoading, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      const el = e.target;
      el.style.height = "auto";
      const maxH = 4 * 24 + 24; // ~4 rows
      el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
    },
    [],
  );

  return (
    <div className="flex items-end gap-2 p-3 border-t border-border bg-card/50">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        rows={1}
        className="flex-1 resize-none rounded-xl border border-border bg-background/50 px-3 py-2.5 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 disabled:opacity-50 transition-all duration-150 min-h-[40px] max-h-[120px] scrollbar-thin"
        style={{ lineHeight: "1.5" }}
        data-ocid="forgeai.input"
        aria-label="ForgeAI message input"
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={isLoading || !value.trim()}
        className="flex-shrink-0 w-9 h-9 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-150 active:scale-95"
        data-ocid="forgeai.send_button"
        aria-label="Send message"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
        ) : (
          <ArrowRight className="w-4 h-4 text-primary-foreground" />
        )}
      </button>
    </div>
  );
}
