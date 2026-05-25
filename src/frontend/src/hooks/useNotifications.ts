import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useEffect, useRef, useState } from "react";
import type { InAppNotification } from "../backend.d";
import type { GapNotificationConfig } from "../types";

const POLL_INTERVAL_MS = 30_000;

export interface UseNotificationsReturn {
  notifications: InAppNotification[];
  unreadCount: number;
  markRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  loading: boolean;
  refetch: () => void;
}

export function useNotifications(): UseNotificationsReturn {
  const { actor, isFetching } = useActor(createActor);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAll = useCallback(async () => {
    if (!actor) return;
    try {
      const [notifs, count] = await Promise.all([
        actor.getMyNotifications(),
        actor.getUnreadNotificationCount(),
      ]);
      setNotifications(notifs);
      setUnreadCount(Number(count));
    } catch {
      // Silent fail — polling will retry
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (!actor || isFetching) return;
    fetchAll();
    intervalRef.current = setInterval(fetchAll, POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [actor, isFetching, fetchAll]);

  const markRead = useCallback(
    async (id: string) => {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      if (!actor) return;
      try {
        await actor.markNotificationRead(id);
      } catch {
        // Revert if failed
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)),
        );
        setUnreadCount((c) => c + 1);
      }
    },
    [actor],
  );

  const deleteNotification = useCallback(
    async (id: string) => {
      const original = notifications.find((n) => n.id === id);
      // Optimistic remove
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (original && !original.isRead)
        setUnreadCount((c) => Math.max(0, c - 1));
      if (!actor) return;
      try {
        await actor.deleteNotification(id);
      } catch {
        if (original) setNotifications((prev) => [...prev, original]);
        if (original && !original.isRead) setUnreadCount((c) => c + 1);
      }
    },
    [actor, notifications],
  );

  const markAllRead = useCallback(async () => {
    if (!actor) return;
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length === 0) return;
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await Promise.all(unreadIds.map((id) => actor.markNotificationRead(id)));
    } catch {
      await fetchAll();
    }
  }, [actor, notifications, fetchAll]);

  return {
    notifications,
    unreadCount,
    markRead,
    deleteNotification,
    markAllRead,
    loading,
    refetch: fetchAll,
  };
}

// ─── Gap Notification Config hook (mocked — backend wired when bindgen includes it) ──

const DEFAULT_GAP_CONFIG: GapNotificationConfig = {
  critical: {
    accountOwner: true,
    primaryAdmin: true,
    assignedDistributor: false,
    assignedReseller: false,
  },
  high: {
    accountOwner: true,
    primaryAdmin: false,
    assignedDistributor: false,
    assignedReseller: false,
  },
};

export interface UseGapNotificationConfigReturn {
  config: GapNotificationConfig;
  updateConfig: (cfg: GapNotificationConfig) => Promise<void>;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export function useGapNotificationConfig(): UseGapNotificationConfigReturn {
  const [config, setConfig] =
    useState<GapNotificationConfig>(DEFAULT_GAP_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate async fetch from backend (replace with actor.getGapNotificationConfig() once bindgen includes it)
  useEffect(() => {
    const t = setTimeout(() => {
      setConfig(DEFAULT_GAP_CONFIG);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const updateConfig = useCallback(async (cfg: GapNotificationConfig) => {
    setSaving(true);
    setError(null);
    try {
      // Replace with: await actor.updateGapNotificationConfig(cfg);
      await new Promise<void>((res) => setTimeout(res, 600));
      setConfig(cfg);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
      throw e;
    } finally {
      setSaving(false);
    }
  }, []);

  return { config, updateConfig, loading, saving, error };
}
