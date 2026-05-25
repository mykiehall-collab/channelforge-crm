import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { AlertTriangle, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import type { DemoCalendarEvent } from "../data/demoEcosystem";
import { DEMO_CALENDAR_EVENTS } from "../data/demoEcosystem";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCalendarEventsForRole(role: string): DemoCalendarEvent[] {
  const normalised = role.toLowerCase().replace(/\s+/g, "");
  const roleMap: Record<string, string[]> = {
    salesrep: ["salesRep"],
    salesrepresentative: ["salesRep"],
    accountmanager: ["accountManager", "salesRep"],
    channelaccountmanager: ["accountManager"],
    renewalspecialist: ["renewalSpecialist"],
    bdr: ["bdr"],
    businessdevelopmentrepresentative: ["bdr"],
    customersuccess: ["customerSuccess"],
    customersuccessmanager: ["customerSuccess"],
    resellermanager: ["resellerManager"],
    partnermanager: ["resellerManager"],
    distributormanager: ["distributorManager"],
    salesmanager: ["salesManager", "leadership"],
    regionaldirector: ["leadership", "salesManager"],
    salesops: ["salesOps"],
    salesoperations: ["salesOps"],
    dealdesk: ["dealDesk", "renewalSpecialist"],
    marketing: ["marketing"],
    marketingmanager: ["marketing"],
    partnermarketing: ["partnerMarketing", "marketing"],
    finance: ["finance"],
    itoperations: ["itOperations"],
    securityadmin: ["itOperations"],
    leadership: ["leadership", "salesManager", "accountManager"],
  };
  const matchKeys = roleMap[normalised] ?? [
    "salesRep",
    "accountManager",
    "leadership",
  ];
  return DEMO_CALENDAR_EVENTS.filter((e) =>
    e.assignedRoles.some((r) => matchKeys.includes(r)),
  );
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function formatTime(time: string): string {
  if (!time || time === "00:00") return "All day";
  return time;
}

function formatEventDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

const EVENT_TYPE_STYLES: Record<
  string,
  { dot: string; bg: string; label: string }
> = {
  callback: {
    dot: "bg-orange-500",
    bg: "bg-orange-500/10 text-orange-300",
    label: "Callback",
  },
  renewal: {
    dot: "bg-amber-400",
    bg: "bg-amber-500/10 text-amber-300",
    label: "Renewal",
  },
  "case-sla": {
    dot: "bg-red-500",
    bg: "bg-red-500/10 text-red-300",
    label: "Case SLA",
  },
  campaign: {
    dot: "bg-purple-400",
    bg: "bg-purple-500/10 text-purple-300",
    label: "Campaign",
  },
  "mdf-deadline": {
    dot: "bg-cyan-400",
    bg: "bg-cyan-500/10 text-cyan-300",
    label: "MDF",
  },
  "quote-deadline": {
    dot: "bg-blue-400",
    bg: "bg-blue-500/10 text-blue-300",
    label: "Quote",
  },
  meeting: {
    dot: "bg-green-400",
    bg: "bg-green-500/10 text-green-300",
    label: "Meeting",
  },
};

type ViewMode = "today" | "week" | "month";

// ─── Event Row ────────────────────────────────────────────────────────────────

function EventRow({ event }: { event: DemoCalendarEvent }) {
  const style =
    EVENT_TYPE_STYLES[event.eventType] ?? EVENT_TYPE_STYLES.callback;

  return (
    <button
      type="button"
      className="w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group"
      onClick={() =>
        console.log("[Calendar] Event clicked:", event.id, event.title)
      }
      data-ocid={`calendar.event.${event.id}`}
    >
      <div className="flex flex-col items-center gap-1 pt-0.5 flex-shrink-0">
        <span
          className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", style.dot)}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-medium text-slate-200 leading-snug truncate flex-1 group-hover:text-white transition-colors">
            {event.title}
          </p>
          {event.status === "At Risk" && (
            <AlertTriangle
              size={13}
              className="text-red-400 flex-shrink-0 mt-0.5"
            />
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock size={10} />
            {formatTime(event.time)}
          </span>
          <span
            className={cn(
              "text-[10px] font-semibold px-1.5 py-0.5 rounded",
              style.bg,
            )}
          >
            {style.label}
          </span>
          {event.status === "At Risk" && (
            <Badge
              variant="destructive"
              className="text-[10px] px-1.5 py-0 h-4"
            >
              At Risk
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Upcoming Events Panel ────────────────────────────────────────────────────

function UpcomingEventsPanel({ events }: { events: DemoCalendarEvent[] }) {
  const next5 = useMemo(() => {
    const now = new Date();
    return [...events]
      .filter((e) => e.date >= startOfDay(now))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  }, [events]);

  if (next5.length === 0) return null;

  return (
    <div
      className="mt-4 border-t border-white/10 pt-4"
      data-ocid="calendar.upcoming.panel"
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 px-1">
        Upcoming Events
      </p>
      <div className="space-y-0.5">
        {next5.map((event) => {
          const style =
            EVENT_TYPE_STYLES[event.eventType] ?? EVENT_TYPE_STYLES.callback;
          return (
            <button
              type="button"
              key={event.id}
              className="w-full text-left flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors"
              onClick={() =>
                console.log("[Calendar] Upcoming event clicked:", event.id)
              }
              data-ocid={`calendar.upcoming.${event.id}`}
            >
              <span
                className={cn("w-2 h-2 rounded-full flex-shrink-0", style.dot)}
              />
              <span className="flex-1 min-w-0 text-[12px] text-slate-300 truncate">
                {event.title}
              </span>
              <span className="text-[11px] text-slate-500 flex-shrink-0">
                {formatEventDate(event.date)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface DashboardCalendarWidgetProps {
  role: string;
  orgType: string;
}

export function DashboardCalendarWidget({
  role,
}: DashboardCalendarWidgetProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  const allEvents = useMemo(() => getCalendarEventsForRole(role), [role]);

  // Compute dates that have events for dot rendering
  const eventDates = useMemo(() => {
    const set = new Set<string>();
    for (const e of allEvents) {
      set.add(startOfDay(e.date).toISOString());
    }
    return set;
  }, [allEvents]);

  // Filter events by view mode
  const filteredEvents = useMemo(() => {
    const now = startOfDay(new Date());
    let cutoff: Date;
    if (viewMode === "today") cutoff = addDays(now, 1);
    else if (viewMode === "week") cutoff = addDays(now, 7);
    else cutoff = addDays(now, 30);
    return allEvents
      .filter((e) => e.date >= now && e.date < cutoff)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [allEvents, viewMode]);

  // Count per view mode
  function countForView(mode: ViewMode): number {
    const now = startOfDay(new Date());
    let cutoff: Date;
    if (mode === "today") cutoff = addDays(now, 1);
    else if (mode === "week") cutoff = addDays(now, 7);
    else cutoff = addDays(now, 30);
    return allEvents.filter((e) => e.date >= now && e.date < cutoff).length;
  }

  // Events for a specific calendar day
  const eventsForSelected = useMemo(() => {
    if (!selectedDate) return [];
    return allEvents.filter((e) => sameDay(e.date, selectedDate));
  }, [allEvents, selectedDate]);

  const viewEvents =
    selectedDate && viewMode === "today" ? eventsForSelected : filteredEvents;

  return (
    <div
      className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden"
      data-ocid="calendar.widget"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <CalendarIcon size={15} className="text-orange-400" />
          <span className="text-sm font-semibold text-white">Calendar</span>
          {filteredEvents.some((e) => e.status === "At Risk") && (
            <AlertTriangle size={12} className="text-red-400" />
          )}
        </div>
        <div
          className="flex items-center gap-1"
          data-ocid="calendar.view_toggle"
        >
          {(["today", "week", "month"] as ViewMode[]).map((mode) => {
            const count = countForView(mode);
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                data-ocid={`calendar.toggle.${mode}`}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-colors capitalize flex items-center gap-1",
                  viewMode === mode
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : "text-slate-400 hover:text-slate-200 border border-transparent hover:border-white/10",
                )}
              >
                {mode === "today"
                  ? "Today"
                  : mode === "week"
                    ? "Week"
                    : "Month"}
                {count > 0 && (
                  <span
                    className={cn(
                      "text-[10px] px-1 rounded-full font-bold",
                      viewMode === mode
                        ? "bg-orange-500/30 text-orange-300"
                        : "bg-white/10 text-slate-400",
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body — two-column */}
      <div className="flex flex-col lg:flex-row">
        {/* Left — mini calendar */}
        <div
          className="lg:w-64 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 px-2 py-3"
          data-ocid="calendar.mini_cal"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="scale-90 origin-top-left"
            components={{
              DayButton: (props) => {
                const day = props.day?.date;
                const hasEvent = day
                  ? eventDates.has(startOfDay(day).toISOString())
                  : false;
                const isSelected =
                  day && selectedDate ? sameDay(day, selectedDate) : false;
                return (
                  <div className="relative flex flex-col items-center">
                    <button
                      {...props}
                      type="button"
                      className={cn(
                        props.className,
                        isSelected
                          ? "!bg-orange-500 !text-white rounded-md"
                          : "",
                      )}
                    />
                    {hasEvent && (
                      <span
                        className={cn(
                          "absolute bottom-0.5 w-1 h-1 rounded-full",
                          isSelected ? "bg-white" : "bg-orange-400",
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                );
              },
            }}
          />
        </div>

        {/* Right — events list */}
        <div
          className="flex-1 p-3 min-h-[240px]"
          data-ocid="calendar.events.list"
        >
          {viewEvents.length === 0 ? (
            <div
              className="h-full flex flex-col items-center justify-center gap-2 text-slate-500 py-8"
              data-ocid="calendar.empty_state"
            >
              <CalendarIcon size={28} className="opacity-40" />
              <p className="text-[13px]">No events for this period</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {viewEvents.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming events always-visible panel */}
      <div className="px-3 pb-3">
        <UpcomingEventsPanel events={allEvents} />
      </div>
    </div>
  );
}
