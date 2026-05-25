import { Bot, Zap } from "lucide-react";
import type { ChatMessage } from "../../backend.d";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

function isAssistantRole(role: ChatMessage["role"]): boolean {
  if (!role) return false;
  const r = role as { __kind__?: string } | string;
  if (typeof r === "string") return r === "Assistant";
  return (r as { __kind__?: string }).__kind__ === "Assistant";
}

function formatTime(ts: bigint): string {
  const d = new Date(Number(ts));
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

interface TypingDotsProps {
  aiSource: string;
}

function TypingDots({ aiSource }: TypingDotsProps) {
  return (
    <div className="flex flex-col gap-1.5 max-w-[80%]">
      <div className="flex items-center gap-1.5 mb-1">
        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Bot className="w-3 h-3 text-primary" />
        </div>
        <span className="text-xs text-muted-foreground font-body">ForgeAI</span>
      </div>
      <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-muted/50 border border-border">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
              style={{
                animationDelay: `${i * 150}ms`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground font-mono ml-1">
        {aiSource} · Thinking…
      </p>
    </div>
  );
}

interface ForgeAIChatMessageProps {
  message: ChatMessage;
  isLoading?: boolean;
  onActionClick?: (action: string) => void;
}

export function ForgeAIChatMessage({
  message,
  isLoading = false,
  onActionClick,
}: ForgeAIChatMessageProps) {
  const isAssistant = isAssistantRole(message.role);

  if (isLoading && isAssistant) {
    return (
      <div
        className="flex justify-start px-1"
        data-ocid="forgeai.message.loading_state"
      >
        <TypingDots aiSource={message.aiSource || "Native ForgeAI"} />
      </div>
    );
  }

  if (isAssistant) {
    return (
      <div
        className="flex flex-col gap-1.5 max-w-[85%]"
        data-ocid="forgeai.message.assistant"
      >
        <div className="flex items-center gap-1.5 mb-0.5">
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Bot className="w-3 h-3 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground font-body">
            ForgeAI
          </span>
        </div>

        <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-muted/50 border border-border">
          <p className="text-sm text-foreground font-body leading-relaxed">
            {message.content}
          </p>
        </div>

        {/* AI source badge */}
        <div className="flex items-center gap-2 ml-1 flex-wrap">
          <Badge
            variant="outline"
            className="text-[10px] px-2 py-0 h-4 border-primary/30 text-primary bg-primary/5 font-body"
            data-ocid="forgeai.message.ai_source"
          >
            <Zap className="w-2.5 h-2.5 mr-1" />
            Answered using {message.aiSource || "Native ForgeAI"}
          </Badge>
          {message.context && (
            <Badge
              variant="outline"
              className="text-[10px] px-2 py-0 h-4 border-border text-muted-foreground font-body"
            >
              Context used
            </Badge>
          )}
          <span className="text-[10px] text-muted-foreground font-mono">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Suggested actions */}
        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 ml-1 mt-0.5">
            {message.suggestedActions.map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => onActionClick?.(action)}
                className="text-[11px] px-2.5 py-1 rounded-full border border-primary/30 text-primary bg-primary/5 hover:bg-primary/15 transition-colors duration-150 font-body"
                data-ocid="forgeai.message.suggested_action"
              >
                {action}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // User message
  return (
    <div
      className="flex flex-col gap-1 items-end max-w-[80%] self-end"
      data-ocid="forgeai.message.user"
    >
      <div className="rounded-2xl rounded-tr-sm px-4 py-3 bg-primary/20 border border-primary/30">
        <p className="text-sm text-foreground font-body text-right leading-relaxed">
          {message.content}
        </p>
      </div>
      <span className="text-[10px] text-muted-foreground font-mono mr-1">
        {formatTime(message.timestamp)}
      </span>
    </div>
  );
}
