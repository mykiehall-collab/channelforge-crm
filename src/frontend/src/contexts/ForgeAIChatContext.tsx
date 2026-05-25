import { createContext, useCallback, useContext, useState } from "react";
import type React from "react";

interface ForgeAIChatContextValue {
  isOpen: boolean;
  contextType: string | null;
  contextId: string | null;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  setContext: (type: string, id: string) => void;
  clearContext: () => void;
}

const ForgeAIChatContext = createContext<ForgeAIChatContextValue | null>(null);

export function ForgeAIChatProvider({
  children,
}: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contextType, setContextType] = useState<string | null>(null);
  const [contextId, setContextId] = useState<string | null>(null);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((o) => !o), []);

  const setContext = useCallback((type: string, id: string) => {
    setContextType(type);
    setContextId(id);
  }, []);

  const clearContext = useCallback(() => {
    setContextType(null);
    setContextId(null);
  }, []);

  return (
    <ForgeAIChatContext.Provider
      value={{
        isOpen,
        contextType,
        contextId,
        openChat,
        closeChat,
        toggleChat,
        setContext,
        clearContext,
      }}
    >
      {children}
    </ForgeAIChatContext.Provider>
  );
}

export function useForgeAIChatContext(): ForgeAIChatContextValue {
  const ctx = useContext(ForgeAIChatContext);
  if (!ctx)
    throw new Error(
      "useForgeAIChatContext must be used within ForgeAIChatProvider",
    );
  return ctx;
}
