import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Archive,
  AtSign,
  BellOff,
  BookUser,
  Brain,
  Building2,
  MessageSquare,
  Paperclip,
  Plus,
  Search,
  Send,
  X,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { useApp } from "../AppContext";
import type { TeamMember } from "../AppContext";
import { UserFinderTab } from "./UserFinderTab";

// ─── Types ────────────────────────────────────────────────────────────────────

type ThreadType = "Direct" | "Account" | "Opportunity" | "Alert";
type MessageSide = "sent" | "received" | "forgeai";

interface MockMessage {
  id: string;
  content: string;
  sender: string;
  senderInitial: string;
  side: MessageSide;
  time: string;
  date: "Today" | "Yesterday" | "Dec 5";
  read?: boolean;
}

// ─── Avatar helper ────────────────────────────────────────────────────────────

function participantPhoto(
  senderName: string,
  teamMembers: TeamMember[],
): string | null {
  const member = teamMembers.find(
    (m) => m.fullName.toLowerCase() === senderName.toLowerCase(),
  );
  return member?.profilePhotoUrl ?? null;
}

function AvatarImg({
  photoUrl,
  name,
  className,
  fallback,
}: {
  photoUrl: string | null;
  name: string;
  className: string;
  fallback: React.ReactNode;
}) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`object-cover rounded-full ${className}`}
      />
    );
  }
  return <>{fallback}</>;
}

interface MockConversation {
  id: string;
  name: string;
  subtitle: string;
  type: ThreadType;
  lastMessage: string;
  timestamp: string;
  unread: number;
  contextLabel?: string;
  isForgeAI?: boolean;
  messages: MockMessage[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    id: "conv-acme",
    name: "Acme Corp",
    subtitle: "Account thread \u2014 3 participants",
    type: "Account",
    lastMessage: "Renewal pack has been uploaded for review.",
    timestamp: "2 min",
    unread: 2,
    contextLabel: "Account: Acme Corp",
    messages: [
      {
        id: "m1",
        content:
          "Hi team \u2014 quarterly review doc is ready. Please review before Thursday.",
        sender: "James Porter",
        senderInitial: "J",
        side: "received",
        time: "09:14",
        date: "Yesterday",
        read: true,
      },
      {
        id: "m2",
        content: "Thanks James. I'll go through it this afternoon.",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "09:31",
        date: "Yesterday",
        read: true,
      },
      {
        id: "m3",
        content:
          "Also worth noting \u2014 TechVision renewal is due in 18 days. I've flagged it with the account manager.",
        sender: "James Porter",
        senderInitial: "J",
        side: "received",
        time: "10:05",
        date: "Yesterday",
        read: true,
      },
      {
        id: "m4",
        content:
          "Good call. Let's make sure we have the contract ready 2 weeks before.",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "10:17",
        date: "Yesterday",
        read: true,
      },
      {
        id: "m5",
        content:
          "Sarah from the vendor side has signed off on the pricing terms.",
        sender: "Lisa Chen",
        senderInitial: "L",
        side: "received",
        time: "14:22",
        date: "Yesterday",
        read: true,
      },
      {
        id: "m6",
        content: "Excellent news. I'll update the renewal record in the CRM.",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "14:35",
        date: "Yesterday",
        read: true,
      },
      {
        id: "m7",
        content:
          "Renewal pack has been uploaded for review. Please check the documents tab.",
        sender: "James Porter",
        senderInitial: "J",
        side: "received",
        time: "08:50",
        date: "Today",
        read: false,
      },
      {
        id: "m8",
        content:
          "Confirming also that the reseller pricing alignment meeting is booked for next Tuesday at 10am.",
        sender: "Lisa Chen",
        senderInitial: "L",
        side: "received",
        time: "09:12",
        date: "Today",
        read: false,
      },
    ],
  },
  {
    id: "conv-sarah",
    name: "Sarah Mitchell",
    subtitle: "Account Manager \u2014 Ingram Micro",
    type: "Direct",
    lastMessage: "Can we align on TechCorp renewal pricing?",
    timestamp: "1h",
    unread: 3,
    messages: [
      {
        id: "m1",
        content:
          "Hi! Just wanted to check in on the TechCorp renewal. It's coming up in 18 days.",
        sender: "Sarah Mitchell",
        senderInitial: "S",
        side: "received",
        time: "11:20",
        date: "Yesterday",
        read: true,
      },
      {
        id: "m2",
        content: "Yes, I'm aware. I've been in touch with the account team.",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "11:45",
        date: "Yesterday",
        read: true,
      },
      {
        id: "m3",
        content:
          "The renewal for TechCorp is due next week \u2014 can we align on pricing before I approach them?",
        sender: "Sarah Mitchell",
        senderInitial: "S",
        side: "received",
        time: "09:05",
        date: "Today",
        read: false,
      },
      {
        id: "m4",
        content:
          "I'll ping the deal desk now and come back to you within 2 hours.",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "09:12",
        date: "Today",
        read: false,
      },
      {
        id: "m5",
        content:
          "Perfect \u2014 also, are you aware the discount approval needs to go through the new process?",
        sender: "Sarah Mitchell",
        senderInitial: "S",
        side: "received",
        time: "09:20",
        date: "Today",
        read: false,
      },
    ],
  },
  {
    id: "conv-forgeai",
    name: "ForgeAI Alerts",
    subtitle: "Operational intelligence notifications",
    type: "Alert",
    lastMessage: "3 new high-priority alerts detected.",
    timestamp: "5 min",
    unread: 3,
    isForgeAI: true,
    messages: [
      {
        id: "m1",
        content:
          "\ud83d\udd34 HIGH PRIORITY: TechVision Ltd renewal is in 18 days with 87% churn probability. No renewal discussion on record. Immediate outreach recommended.",
        sender: "ForgeAI",
        senderInitial: "F",
        side: "forgeai",
        time: "08:30",
        date: "Today",
        read: false,
      },
      {
        id: "m2",
        content:
          "\ud83d\udfe0 MEDIUM: Stratos Digital opportunity has been stalled at Proposal stage for 28 days. Win rate drops significantly after 30 days without response.",
        sender: "ForgeAI",
        senderInitial: "F",
        side: "forgeai",
        time: "08:32",
        date: "Today",
        read: false,
      },
      {
        id: "m3",
        content:
          "\ud83d\udd34 HIGH PRIORITY: Bluewave Solutions \u2014 no activity logged in 47 days. Account health score dropped from 78 to 41. Renewal due in 5 months.",
        sender: "ForgeAI",
        senderInitial: "F",
        side: "forgeai",
        time: "08:35",
        date: "Today",
        read: false,
      },
    ],
  },
  {
    id: "conv-techvision",
    name: "TechVision Q3 Deal",
    subtitle: "Opportunity thread \u2014 2 participants",
    type: "Opportunity",
    lastMessage: "Approval needed on the modified deal value.",
    timestamp: "15 min",
    unread: 1,
    contextLabel: "Opp: TechVision Q3 Deal",
    messages: [
      {
        id: "m1",
        content:
          "The deal value has been modified to \u00a385,000 based on the negotiated terms.",
        sender: "Priya Sharma",
        senderInitial: "P",
        side: "received",
        time: "11:00",
        date: "Dec 5",
        read: true,
      },
      {
        id: "m2",
        content: "Understood. I'll get it in front of the deal desk today.",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "11:15",
        date: "Dec 5",
        read: true,
      },
      {
        id: "m3",
        content:
          "Approval needed on the modified deal value. See attached deal summary.",
        sender: "Priya Sharma",
        senderInitial: "P",
        side: "received",
        time: "09:45",
        date: "Today",
        read: false,
      },
    ],
  },
  {
    id: "conv-apexpartners",
    name: "Apex Partners",
    subtitle: "Reseller partner thread \u2014 4 participants",
    type: "Account",
    lastMessage: "MDF claim for Q3 campaign has been submitted.",
    timestamp: "2h",
    unread: 0,
    contextLabel: "Account: Apex Partners",
    messages: [
      {
        id: "m1",
        content:
          "We've submitted the MDF claim for the Q3 digital campaign. Total spend was \u00a312,400.",
        sender: "Tom Richards",
        senderInitial: "T",
        side: "received",
        time: "14:30",
        date: "Yesterday",
        read: true,
      },
      {
        id: "m2",
        content: "Received. We'll process this within 5 business days.",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "14:55",
        date: "Yesterday",
        read: true,
      },
      {
        id: "m3",
        content:
          "MDF claim for Q3 campaign has been submitted. Confirmation reference: MDF-2024-0183.",
        sender: "Tom Richards",
        senderInitial: "T",
        side: "received",
        time: "10:20",
        date: "Today",
        read: true,
      },
    ],
  },
  {
    id: "conv-lumitechop",
    name: "LumiTech Expansion",
    subtitle: "Opportunity thread \u2014 3 participants",
    type: "Opportunity",
    lastMessage: "Proposal version 2 is ready for review.",
    timestamp: "3h",
    unread: 0,
    contextLabel: "Opp: LumiTech Expansion",
    messages: [
      {
        id: "m1",
        content:
          "The revised proposal is ready. Key changes: extended payment terms and an additional 8% volume discount.",
        sender: "Anna Clarke",
        senderInitial: "A",
        side: "received",
        time: "09:00",
        date: "Today",
        read: true,
      },
      {
        id: "m2",
        content: "Thanks Anna. I'll review and get back to you by EOD.",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "09:22",
        date: "Today",
        read: true,
      },
      {
        id: "m3",
        content:
          "Proposal version 2 is ready for review. Please confirm receipt.",
        sender: "Anna Clarke",
        senderInitial: "A",
        side: "received",
        time: "11:00",
        date: "Today",
        read: true,
      },
    ],
  },
  {
    id: "conv-michael",
    name: "Michael Torres",
    subtitle: "Sales Manager \u2014 Distribution",
    type: "Direct",
    lastMessage: "Team forecast numbers look good for Q3.",
    timestamp: "Yesterday",
    unread: 0,
    messages: [
      {
        id: "m1",
        content:
          "Team forecast numbers look good for Q3. We're tracking at 94% of target.",
        sender: "Michael Torres",
        senderInitial: "M",
        side: "received",
        time: "16:45",
        date: "Yesterday",
        read: true,
      },
      {
        id: "m2",
        content:
          "Great to hear. Let's keep the momentum going into the last 2 weeks.",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "17:02",
        date: "Yesterday",
        read: true,
      },
    ],
  },
  {
    id: "conv-corelink",
    name: "Corelink Solutions",
    subtitle: "Account thread \u2014 2 participants",
    type: "Account",
    lastMessage: "QBR has been rescheduled to next Thursday.",
    timestamp: "Yesterday",
    unread: 0,
    contextLabel: "Account: Corelink Solutions",
    messages: [
      {
        id: "m1",
        content:
          "We need to reschedule the QBR. The client has a conflict next Monday.",
        sender: "Rachel Kim",
        senderInitial: "R",
        side: "received",
        time: "11:30",
        date: "Yesterday",
        read: true,
      },
      {
        id: "m2",
        content: "No problem. Would Thursday 10am work?",
        sender: "You",
        senderInitial: "Y",
        side: "sent",
        time: "11:45",
        date: "Yesterday",
        read: true,
      },
      {
        id: "m3",
        content:
          "QBR has been rescheduled to next Thursday at 10am. Calendar invite sent.",
        sender: "Rachel Kim",
        senderInitial: "R",
        side: "received",
        time: "12:10",
        date: "Yesterday",
        read: true,
      },
    ],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

const TYPE_FILTER_OPTIONS = [
  "All",
  "Direct",
  "Account",
  "Opportunity",
  "Alert",
] as const;
type FilterOption = (typeof TYPE_FILTER_OPTIONS)[number];

function threadTypeBadge(type: ThreadType) {
  const map: Record<ThreadType, string> = {
    Direct: "text-muted-foreground bg-muted/40 border-border",
    Account: "text-accent bg-accent/10 border-accent/25",
    Opportunity: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    Alert: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  };
  return (
    <span
      className={`text-[9px] font-semibold rounded-full px-2 py-0.5 border ${map[type]}`}
    >
      {type}
    </span>
  );
}

function avatarBg(conv: MockConversation): string {
  if (conv.isForgeAI) return "bg-accent/20 border border-accent/30";
  if (conv.type === "Account") return "bg-sky-500/20 border border-sky-500/30";
  if (conv.type === "Opportunity")
    return "bg-violet-500/20 border border-violet-500/30";
  return "bg-muted/40 border border-border";
}

function dateSeparator(date: MockMessage["date"]) {
  return (
    <div className="flex items-center gap-3 my-4" key={`sep-${date}`}>
      <div className="flex-1 h-px bg-border" />
      <span className="text-[10px] font-semibold text-muted-foreground px-2">
        {date}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MessagingPage() {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { conversationId?: string };
  const {
    userProfile,
    userProfileDetail,
    teamMembers,
    isOrgAccessible,
    isPrimaryAdmin,
    isSecondaryAdmin,
  } = useApp();

  const [mainTab, setMainTab] = useState<"messages" | "user-finder">(
    "messages",
  );
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterOption>("All");
  const [activeId, setActiveId] = useState<string>(
    params.conversationId ?? "conv-acme",
  );
  const [messageInput, setMessageInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeMessage, setComposeMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<
    Record<string, MockMessage[]>
  >(Object.fromEntries(MOCK_CONVERSATIONS.map((c) => [c.id, c.messages])));
  const [mobileView, setMobileView] = useState<"list" | "conversation">("list");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ORG-ISOLATION: show only same-org or channel-linked conversations
  const orgConversations = MOCK_CONVERSATIONS.filter((c: any) => {
    if (!c.orgDomain) return true;
    return isOrgAccessible(c.orgDomain);
  });

  const filteredConvs = orgConversations.filter((c) => {
    const matchSearch =
      search.length === 0 ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || c.type === typeFilter;
    return matchSearch && matchType;
  });

  const activeConv =
    orgConversations.find((c) => c.id === activeId) ??
    orgConversations[0] ??
    MOCK_CONVERSATIONS[0];
  const activeMessages = localMessages[activeId] ?? activeConv.messages;

  const groupedMessages: {
    date: MockMessage["date"];
    messages: MockMessage[];
  }[] = [];
  for (const msg of activeMessages) {
    const last = groupedMessages[groupedMessages.length - 1];
    if (!last || last.date !== msg.date) {
      groupedMessages.push({ date: msg.date, messages: [msg] });
    } else {
      last.messages.push(msg);
    }
  }

  function selectConversation(id: string) {
    setActiveId(id);
    setMobileView("conversation");
    navigate({
      to: "/messages/$conversationId",
      params: { conversationId: id },
    });
  }

  function handleSend() {
    const trimmed = messageInput.trim();
    if (!trimmed) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newMsg: MockMessage = {
      id: `local-${Date.now()}`,
      content: trimmed,
      sender: userProfile?.fullName ?? "You",
      senderInitial: (userProfile?.fullName ?? "Y").charAt(0),
      side: "sent",
      time: timeStr,
      date: "Today",
      read: true,
    };
    setLocalMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), newMsg],
    }));
    setMessageInput("");
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const charCount = messageInput.length;

  // Determine if user is admin
  const isAdminUser = isPrimaryAdmin() || isSecondaryAdmin();

  function handleMessageUser(name: string) {
    setMainTab("messages");
    setIsComposing(true);
    setComposeTo(name);
  }

  return (
    <div className="flex h-full overflow-hidden" data-ocid="messaging.page">
      {/* Left panel: conversation list */}
      <div
        className={`flex-shrink-0 flex flex-col border-r border-border bg-card/30 ${
          mobileView === "conversation" ? "hidden lg:flex" : "flex"
        } w-full lg:w-80`}
      >
        <div className="px-4 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground font-display">
              {mainTab === "messages" ? "Messages" : "User Finder"}
            </h2>
            {mainTab === "messages" && (
              <button
                type="button"
                data-ocid="messaging.new_message.button"
                onClick={() => setIsComposing(true)}
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                <Plus size={12} /> New
              </button>
            )}
          </div>

          {/* Main tab switcher */}
          <div className="flex gap-1 mb-3">
            <button
              type="button"
              data-ocid="messaging.tab.messages"
              onClick={() => setMainTab("messages")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                mainTab === "messages"
                  ? "bg-accent/15 text-accent border-accent/30"
                  : "bg-transparent text-muted-foreground border-border hover:border-accent/20"
              }`}
            >
              <MessageSquare size={11} /> Messages
            </button>
            <button
              type="button"
              data-ocid="messaging.tab.user_finder"
              onClick={() => setMainTab("user-finder")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                mainTab === "user-finder"
                  ? "bg-accent/15 text-accent border-accent/30"
                  : "bg-transparent text-muted-foreground border-border hover:border-accent/20"
              }`}
            >
              <BookUser size={11} /> User Finder
            </button>
          </div>
          {mainTab === "messages" && (
            <>
              <div className="relative mb-3">
                <Search
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  data-ocid="messaging.search.input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations\u2026"
                  className="w-full pl-8 pr-3 py-2 rounded-lg text-xs bg-input border border-border text-foreground placeholder-muted-foreground outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="flex gap-1 overflow-x-auto pb-0.5">
                {TYPE_FILTER_OPTIONS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    data-ocid={`messaging.filter.${f.toLowerCase()}`}
                    onClick={() => setTypeFilter(f)}
                    className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors border ${
                      typeFilter === f
                        ? "bg-accent/15 text-accent border-accent/30"
                        : "bg-transparent text-muted-foreground border-border hover:border-accent/20"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {mainTab === "messages" && (
          <ScrollArea className="flex-1">
            {filteredConvs.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-12 px-4 text-center"
                data-ocid="messaging.empty_state"
              >
                <MessageSquare
                  size={28}
                  className="text-muted-foreground/40 mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  No conversations found
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-0.5">
                {filteredConvs.map((c, idx) => (
                  <button
                    key={c.id}
                    type="button"
                    data-ocid={`messaging.conversation.item.${idx + 1}`}
                    onClick={() => selectConversation(c.id)}
                    className={`w-full text-left rounded-xl px-3 py-3 transition-all ${
                      activeId === c.id
                        ? "bg-accent/10 border border-accent/20"
                        : "border border-transparent hover:bg-muted/20"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold overflow-hidden ${avatarBg(c)} ${
                          c.unread > 0 ? "ring-2 ring-accent/40" : ""
                        }`}
                      >
                        {c.isForgeAI ? (
                          <Brain size={14} className="text-accent" />
                        ) : (
                          <AvatarImg
                            photoUrl={participantPhoto(c.name, teamMembers)}
                            name={c.name}
                            className="w-9 h-9"
                            fallback={
                              <span className="text-foreground">
                                {c.name.charAt(0)}
                              </span>
                            }
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span
                            className={`text-xs font-semibold truncate ${c.unread > 0 ? "text-foreground" : "text-foreground/80"}`}
                          >
                            {c.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex-shrink-0">
                            {c.timestamp}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mb-1">
                          {threadTypeBadge(c.type)}
                          {c.unread > 0 && (
                            <Badge className="text-[9px] h-4 px-1.5 font-bold bg-accent text-accent-foreground border-0">
                              {c.unread}
                            </Badge>
                          )}
                        </div>
                        {c.contextLabel && (
                          <div className="text-[10px] text-accent/70 mb-0.5 truncate">
                            {c.contextLabel}
                          </div>
                        )}
                        <p className="text-[11px] text-muted-foreground truncate">
                          {c.lastMessage}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        )}
      </div>

      {/* User Finder panel */}
      {mainTab === "user-finder" && (
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <UserFinderTab
            onMessageUser={handleMessageUser}
            isAdmin={isAdminUser}
          />
        </div>
      )}

      {/* Right panel: active conversation */}
      {mainTab === "messages" && (
        <div
          className={`flex-1 flex flex-col min-w-0 ${
            mobileView === "list" ? "hidden lg:flex" : "flex"
          }`}
        >
          {activeConv ? (
            <>
              <div
                className="h-14 px-5 flex items-center gap-3 border-b border-border bg-card/30 flex-shrink-0"
                data-ocid="messaging.conversation.panel"
              >
                <button
                  type="button"
                  className="lg:hidden p-1 text-muted-foreground hover:text-foreground text-lg"
                  onClick={() => setMobileView("list")}
                  aria-label="Back to conversations"
                >
                  &#8592;
                </button>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold overflow-hidden ${avatarBg(activeConv)}`}
                >
                  {activeConv.isForgeAI ? (
                    <Brain size={13} className="text-accent" />
                  ) : (
                    <AvatarImg
                      photoUrl={participantPhoto(activeConv.name, teamMembers)}
                      name={activeConv.name}
                      className="w-8 h-8"
                      fallback={
                        <span className="text-foreground">
                          {activeConv.name.charAt(0)}
                        </span>
                      }
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">
                    {activeConv.name}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {threadTypeBadge(activeConv.type)}
                    {activeConv.contextLabel && (
                      <span className="text-[10px] text-accent/70 truncate">
                        {activeConv.contextLabel}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    aria-label="Archive"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                  >
                    <Archive size={14} />
                  </button>
                  <button
                    type="button"
                    aria-label="Mute"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                  >
                    <BellOff size={14} />
                  </button>
                  {activeConv.contextLabel && (
                    <button
                      type="button"
                      className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-colors"
                    >
                      <Building2 size={11} /> View Account
                    </button>
                  )}
                </div>
              </div>

              <ScrollArea className="flex-1 px-5 py-4">
                <div className="flex flex-col max-w-3xl mx-auto">
                  {groupedMessages.map((group) => (
                    <div key={group.date}>
                      {dateSeparator(group.date)}
                      {group.messages.map((msg, i) => (
                        <MessageBubble
                          key={msg.id}
                          msg={msg}
                          index={i}
                          currentUserPhotoUrl={
                            userProfileDetail?.profilePhotoUrl ?? null
                          }
                          teamMembers={teamMembers}
                        />
                      ))}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="flex-shrink-0 px-5 py-4 border-t border-border bg-card/30">
                <div className="relative max-w-3xl mx-auto">
                  <textarea
                    data-ocid="messaging.compose.input"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message\u2026"
                    rows={2}
                    className="w-full resize-none rounded-xl px-4 py-3 pr-28 text-sm bg-input border border-border text-foreground placeholder-muted-foreground outline-none focus:border-accent transition-colors font-body leading-relaxed"
                  />
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    {charCount > 200 && (
                      <span className="text-[10px] text-muted-foreground mr-1">
                        {charCount}/1000
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label="Tag user"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                    >
                      <AtSign size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Attach file"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                    >
                      <Paperclip size={14} />
                    </button>
                    <button
                      type="button"
                      data-ocid="messaging.send.button"
                      onClick={handleSend}
                      disabled={!messageInput.trim()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div
              className="flex-1 flex flex-col items-center justify-center"
              data-ocid="messaging.no_selection.panel"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/8 border border-accent/20 flex items-center justify-center mb-5">
                <MessageSquare size={28} className="text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 font-display">
                Select a conversation
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-xs font-body">
                Choose a conversation from the list to view messages, or start a
                new direct message.
              </p>
              <button
                type="button"
                data-ocid="messaging.new_message_empty.button"
                onClick={() => setIsComposing(true)}
                className="mt-5 flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
              >
                <Plus size={14} /> New Message
              </button>
            </div>
          )}
        </div>
      )}

      {/* New message modal */}
      {isComposing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm"
          data-ocid="messaging.compose.dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsComposing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsComposing(false);
          }}
        >
          <div className="cf-card rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-foreground font-display">
                New Message
              </h3>
              <button
                type="button"
                data-ocid="messaging.compose.close_button"
                onClick={() => setIsComposing(false)}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="compose-to"
                  className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wide"
                >
                  Recipient
                </label>
                <input
                  id="compose-to"
                  data-ocid="messaging.compose.recipient.input"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="Search for a user or team\u2026"
                  className="w-full px-3 py-2 rounded-lg text-sm bg-input border border-border text-foreground placeholder-muted-foreground outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="compose-message"
                  className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wide"
                >
                  Message
                </label>
                <textarea
                  id="compose-message"
                  data-ocid="messaging.compose.message.textarea"
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  placeholder="Type your message\u2026"
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-input border border-border text-foreground placeholder-muted-foreground outline-none focus:border-accent transition-colors resize-none font-body"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                type="button"
                data-ocid="messaging.compose.cancel_button"
                onClick={() => {
                  setIsComposing(false);
                  setComposeTo("");
                  setComposeMessage("");
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="messaging.compose.send_button"
                disabled={!composeTo.trim() || !composeMessage.trim()}
                onClick={() => {
                  setIsComposing(false);
                  setComposeTo("");
                  setComposeMessage("");
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <Send size={13} /> Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  index,
  currentUserPhotoUrl,
  teamMembers,
}: {
  msg: MockMessage;
  index: number;
  currentUserPhotoUrl: string | null;
  teamMembers: TeamMember[];
}) {
  if (msg.side === "forgeai") {
    return (
      <div
        className="flex gap-3 items-start mb-3"
        data-ocid={`messaging.message.item.${index + 1}`}
      >
        <div className="w-7 h-7 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center flex-shrink-0">
          <Brain size={12} className="text-accent" />
        </div>
        <div className="max-w-[75%]">
          <div className="text-[10px] text-accent mb-1 font-semibold">
            ForgeAI \u00b7 {msg.time}
          </div>
          <div className="rounded-2xl rounded-tl-md px-4 py-3 text-sm font-body leading-relaxed border border-accent/30 bg-accent/5 text-foreground/90">
            {msg.content}
          </div>
        </div>
      </div>
    );
  }

  if (msg.side === "sent") {
    return (
      <div
        className="flex gap-3 items-end flex-row-reverse mb-3"
        data-ocid={`messaging.message.item.${index + 1}`}
      >
        <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground flex-shrink-0 overflow-hidden">
          <AvatarImg
            photoUrl={currentUserPhotoUrl}
            name={msg.sender}
            className="w-7 h-7"
            fallback={msg.senderInitial}
          />
        </div>
        <div className="max-w-[75%]">
          <div className="text-[10px] text-muted-foreground mb-1 text-right">
            You \u00b7 {msg.time}
            {msg.read ? " \u2713\u2713" : ""}
          </div>
          <div className="rounded-2xl rounded-br-md px-4 py-3 text-sm bg-accent text-accent-foreground font-body leading-relaxed">
            {msg.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex gap-3 items-end mb-3"
      data-ocid={`messaging.message.item.${index + 1}`}
    >
      <div className="w-7 h-7 rounded-full bg-muted/50 border border-border flex items-center justify-center text-[10px] font-bold text-foreground flex-shrink-0 overflow-hidden">
        <AvatarImg
          photoUrl={participantPhoto(msg.sender, teamMembers)}
          name={msg.sender}
          className="w-7 h-7"
          fallback={msg.senderInitial}
        />
      </div>
      <div className="max-w-[75%]">
        <div className="text-[10px] text-muted-foreground mb-1">
          {msg.sender} \u00b7 {msg.time}
        </div>
        <div className="rounded-2xl rounded-bl-md px-4 py-3 text-sm bg-card border border-border text-foreground font-body leading-relaxed">
          {msg.content}
        </div>
      </div>
    </div>
  );
}
