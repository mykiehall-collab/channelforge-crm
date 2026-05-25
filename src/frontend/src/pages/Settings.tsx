// Settings page for CHANNELFORGE CRM
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Link, Mail, Server, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const BG = "#0b1724";
const BORDER = "#1e3050";
const TEXT_MUTED = "#7D8AA0";
const ORANGE = "#FF6B2B";

// TEST_MODE_PLACEHOLDER: Remove or replace before production
const INTEGRATIONS = [
  {
    id: "outlook",
    name: "Microsoft Outlook / 365 Calendar",
    Icon: Mail,
    color: "#0078D4",
  },
  { id: "gcal", name: "Google Calendar", Icon: Calendar, color: "#4285F4" },
  { id: "gmail", name: "Gmail", Icon: Mail, color: "#EA4335" },
  { id: "exchange", name: "Exchange Server", Icon: Server, color: "#0078D4" },
  {
    id: "enterprise-cal",
    name: "Enterprise Calendar API",
    Icon: Link,
    color: ORANGE,
  },
] as const;

export function Settings() {
  // TEST_MODE_PLACEHOLDER: Remove or replace before production
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    calendar: true,
    tasks: false,
  });

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8" data-ocid="settings.page">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm mt-1" style={{ color: TEXT_MUTED }}>
          Manage your integrations, notifications, and account preferences.
        </p>
      </div>

      {/* ─── Integrations ──────────────────────────────────────────────────── */}
      {/* TEST_MODE_PLACEHOLDER: Remove or replace before production */}
      <section
        className="rounded-xl p-6 space-y-4"
        style={{ background: BG, border: `1px solid ${BORDER}` }}
        data-ocid="settings.integrations.panel"
      >
        <div>
          <h2 className="text-sm font-bold text-foreground">Integrations</h2>
          <p
            className="text-xs mt-1 leading-relaxed"
            style={{ color: TEXT_MUTED }}
          >
            Connect your internal calendar to sync meetings, callbacks, renewal
            reminders, and operational tasks. Connect your work email to improve
            activity tracking and account collaboration.
          </p>
        </div>
        <Separator style={{ background: BORDER }} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INTEGRATIONS.map(({ id, name, Icon, color }) => (
            <div
              key={id}
              className="rounded-lg p-4 flex items-center justify-between gap-3"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${BORDER}`,
              }}
              data-ocid={`settings.integration.${id}.card`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}22` }}
                >
                  <Icon size={14} style={{ color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {name}
                  </p>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      background: "rgba(148,163,184,0.12)",
                      color: TEXT_MUTED,
                    }}
                  >
                    Not Connected
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-ocid={`settings.integration.${id}.connect_button`}
                className="text-xs flex-shrink-0"
                style={{ borderColor: BORDER, color: TEXT_MUTED }}
                onClick={() => {
                  setSelectedProvider(name);
                  setShowModal(true);
                }}
              >
                Connect
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Notifications ─────────────────────────────────────────────────── */}
      <section
        className="rounded-xl p-6 space-y-4"
        style={{ background: BG, border: `1px solid ${BORDER}` }}
        data-ocid="settings.notifications.panel"
      >
        <div>
          <h2 className="text-sm font-bold text-foreground">Notifications</h2>
          <p className="text-xs mt-1" style={{ color: TEXT_MUTED }}>
            Choose which notifications you receive.
          </p>
        </div>
        <Separator style={{ background: BORDER }} />

        {[
          {
            key: "email" as const,
            label: "Email notifications",
            description: "Receive important updates by email",
          },
          {
            key: "calendar" as const,
            label: "Calendar reminders",
            description: "Get reminders for upcoming events and deadlines",
          },
          {
            key: "tasks" as const,
            label: "Task alerts",
            description: "Notify me when tasks are assigned or overdue",
          },
        ].map(({ key, label, description }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 py-3"
            style={{ borderBottom: `1px solid ${BORDER}` }}
            data-ocid={`settings.notification.${key}.row`}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs" style={{ color: TEXT_MUTED }}>
                {description}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notifications[key]}
              data-ocid={`settings.notification.${key}.toggle`}
              onClick={() =>
                setNotifications((n) => ({ ...n, [key]: !n[key] }))
              }
              className="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors"
              style={{
                background: notifications[key]
                  ? ORANGE
                  : "rgba(255,255,255,0.12)",
              }}
            >
              <span
                className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform"
                style={{
                  transform: notifications[key]
                    ? "translateX(18px)"
                    : "translateX(2px)",
                }}
              />
            </button>
          </div>
        ))}
      </section>

      {/* Integration Modal — TEST_MODE_PLACEHOLDER: Remove or replace before production */}
      {showModal && selectedProvider && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)" }}
          data-ocid="settings.integration.dialog"
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 space-y-5 relative"
            style={{ background: "#0d1a2e", border: `1px solid ${BORDER}` }}
          >
            <button
              type="button"
              aria-label="Close"
              data-ocid="settings.integration.close_button"
              onClick={() => {
                setShowModal(false);
                setSelectedProvider(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: TEXT_MUTED }}
            >
              <X size={16} />
            </button>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Connect {selectedProvider}
              </h3>
              <p
                className="text-xs mt-2 leading-relaxed"
                style={{ color: TEXT_MUTED }}
              >
                Connect your internal calendar to sync meetings, callbacks,
                renewal reminders, and operational tasks.
              </p>
              <p
                className="text-xs mt-2 leading-relaxed"
                style={{ color: TEXT_MUTED }}
              >
                Connect your work email to improve activity tracking and account
                collaboration.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                data-ocid="settings.integration.connect_button"
                className="w-full font-semibold"
                style={{ background: ORANGE }}
                onClick={() => {
                  toast.info(
                    "Integration coming soon. This will be available in a future release.",
                  );
                  setShowModal(false);
                  setSelectedProvider(null);
                }}
              >
                Connect {selectedProvider}
              </Button>
              <Button
                type="button"
                variant="outline"
                data-ocid="settings.integration.cancel_button"
                className="w-full"
                style={{ borderColor: BORDER, color: TEXT_MUTED }}
                onClick={() => {
                  setShowModal(false);
                  setSelectedProvider(null);
                }}
              >
                Cancel
              </Button>
            </div>
            <p
              className="text-[10px] text-center"
              style={{ color: TEXT_MUTED }}
            >
              Your credentials are encrypted and never stored in plain text.
              Integration can be disconnected at any time from your settings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
