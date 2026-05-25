# CHANNELFORGE Home Page Calendar & Role-Aware Event System Design Tokens

## Purpose & Context
Extends CHANNELFORGE's navy/orange design system with calendar event color tokens for a home page calendar widget supporting role-aware color-coded events across 7 event types (callbacks, renewals, cases/SLA, campaigns, MDF, quotes, meetings). Integrates operational event scheduling, deadline tracking, and role-specific event visibility into the command-center dashboard experience.

## Tone & Aesthetic
Operational calendar intelligence, enterprise event governance, role-aware scheduling. Navy backgrounds (0.08 0.015 250) with ultra-dark cards (0.12 0.02 250). 7 distinct event colors (blue for callbacks, green for renewals, red for case SLA, orange for campaigns, purple for MDF, amber for quotes, gray for meetings). No generic calendar aesthetics, no scheduling overhead. Premium, focused, operationally intelligent.

## Color Palette (OKLCH)
| Token | OKLCH | Event Type | Usage |
|-------|-------|-----------|-------|
| Event Callback | 0.7 0.15 130 | Callback/Activity | Blue-green accent stripe |
| Event Renewal | 0.7 0.15 130 | Renewal/Expiry | Green success indicator |
| Event Case SLA | 0.62 0.23 22 | Case/SLA Deadline | Red alert, high priority |
| Event Campaign | 0.65 0.24 32 | Campaign Milestone | Orange brand accent |
| Event MDF | 0.6 0.2 260 | MDF Deadline | Purple distinct marker |
| Event Quote | 0.75 0.18 85 | Quote/Pricing Deadline | Amber warning indicator |
| Event Meeting | 0.4 0.02 250 | Meeting/Event | Muted gray/slate |

## Typography
| Role | Font | Usage |
|------|------|-------|
| Display | Bricolage Grotesque | Calendar month header, event title |
| Body | DM Sans | Event badge labels, date text |
| Mono | JetBrains Mono | Time display, timestamp |

## Structural Zones
| Zone | Background | Treatment | Notes |
|------|------------|-----------|-------|
| Calendar Grid | 0.12 0.02 250 | Card container, bordered cells | 7-day week / month view |
| Calendar Cell | Transparent | Bordered, hover lift | Min height 96px, padding 2 |
| Today Highlight | Accent ring | 2px ring, 50% opacity | Ring-2 ring-accent |
| Event Badge | Semantic color | Inline pill, 15% opacity bg | Distinct per event type |
| Event Dot | Semantic color | 8px rounded indicator | Visual scan marker |
| Time Label | Muted gray | Monospace, small text | 12h or 24h format |

## Component Patterns
- **Calendar Cell**: Min-h-24, p-2, border, rounded-sm. Flex column layout with date/events stacked. Hover bg-secondary/40.
- **Event Badge**: Inline-flex, px-2 py-1, rounded-sm, text-xs, font-medium. Semantic color bg/text/border with 15% opacity tint.
- **Event Dot**: 8x8px, rounded-full, positioned absolute in cell. Semantic color per event type.
- **Today Cell**: Ring-2 ring-accent ring-opacity-50. Subtle emphasis, not overpower.
- **Calendar Header**: Text-lg font-semibold font-display, uppercase tracking. Month name + year.

## Motion & Animation
- Calendar cell hover: bg 150ms ease-out
- Event badge entrance: fade-in 200ms
- Today ring pulse: subtle glow 2s infinite (optional)
- Month transition: fade 300ms on navigation

## Interactive States
- **Calendar Cell Hover**: Background secondary/40
- **Event Badge Hover**: Opacity +15%, slight shadow
- **Today Cell**: Ring-2 accent, no background change
- **Event Badge Click**: Navigate to event/task detail
- **Calendar View Toggle**: Today / Week / Month buttons, accent active

## Constraints
- 7 event type colors only — no rainbow palettes or custom colors
- Event badges always include both dot indicator and text label
- Today cell uses ring-accent, never fills with color
- Calendar cells support multi-line event stacking (max 3 visible events)
- Event colors must pass AA contrast on dark card background (0.12 0.02 250)
- Mobile: single column grid, scroll horizontally for weeks/months
- Role-aware filtering: only show events relevant to user's operational role
- No event tooltips on mobile — tap to expand detail
- Timestamps display 12h or 24h based on user profile preference
- All event colors consistent across all CHANNELFORGE event type usages (dashboards, reports, notifications)

## Deferred Features
Live calendar sync with external providers (Outlook, Google Calendar, Exchange), event reminders/notifications, conflict detection, meeting room booking, recurring event expansion, ical import/export.
