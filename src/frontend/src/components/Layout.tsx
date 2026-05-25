import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Link2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useApp } from "../AppContext";
import { useForgeAIChatContext } from "../contexts/ForgeAIChatContext";
import { ChannelLinkBanner } from "./ChannelLinkBanner";
import { ForgeAIChatButton } from "./ForgeAI/ForgeAIChatButton";
import { ForgeAIChatPanel } from "./ForgeAI/ForgeAIChatPanel";
import GlobalFilterBar from "./GlobalFilterBar";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [simulatedOrg, setSimulatedOrg] = useState<{
    id: string;
    name: string;
    type: "VENDOR" | "DISTRIBUTOR" | "RESELLER";
  } | null>(null);
  const [simDropdownOpen, setSimDropdownOpen] = useState(false);
  const { resellerContext, setResellerContext } = useApp();
  const { isOpen, toggleChat, closeChat, contextType, contextId } =
    useForgeAIChatContext();
  const navigate = useNavigate();

  function exitResellerContext() {
    setResellerContext(null);
    navigate({ to: "/dashboard" });
  }

  const simulationOptions = [
    { id: "sim-vendor", name: "Adobe", type: "VENDOR" as const },
    { id: "sim-dist", name: "Ingram Micro", type: "DISTRIBUTOR" as const },
    { id: "sim-res", name: "Nordic Cloud", type: "RESELLER" as const },
  ];

  return (
    <div className="layout-root cf-bg-main">
      {/* Channel Link simulation banner */}
      {simulatedOrg && (
        <ChannelLinkBanner
          linkedOrgName={simulatedOrg.name}
          linkedOrgType={simulatedOrg.type}
          onDismiss={() => setSimulatedOrg(null)}
        />
      )}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar — fixed on desktop, drawer on mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-30 md:static md:z-auto transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content column */}
      <div className="layout-main">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Simulate External View dropdown */}
        <div className="relative flex justify-end px-4 pt-2">
          <button
            type="button"
            onClick={() => setSimDropdownOpen((v) => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 text-xs font-medium hover:bg-orange-500/20 transition-colors border border-orange-500/20"
            data-ocid="layout.simulate_external_view.button"
          >
            <Link2 className="w-3.5 h-3.5" />
            Ext. View
          </button>
          {simDropdownOpen && (
            <div className="absolute right-4 top-9 z-50 w-56 rounded-lg border border-border bg-card shadow-lg py-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                View as
              </div>
              {simulationOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSimulatedOrg(opt);
                    setSimDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-foreground hover:bg-secondary/40 transition-colors"
                  data-ocid={`layout.simulate_external_view.${opt.type.toLowerCase()}_option`}
                >
                  {opt.name}{" "}
                  <span className="text-muted-foreground">({opt.type})</span>
                </button>
              ))}
              <div className="border-t border-border my-1" />
              <button
                type="button"
                onClick={() => {
                  setSimulatedOrg(null);
                  setSimDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
                data-ocid="layout.simulate_external_view.exit_option"
              >
                Exit Simulation
              </button>
            </div>
          )}
        </div>

        {/* Reseller context breadcrumb banner */}
        {resellerContext && (
          <div
            className="flex items-center gap-3 px-5 py-2 bg-accent/10 border-b border-accent/20 flex-shrink-0"
            data-ocid="layout.reseller_context_banner"
          >
            <button
              type="button"
              onClick={exitResellerContext}
              className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
              data-ocid="layout.reseller_context.back_button"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to vendor view
            </button>
            <span className="text-muted-foreground text-xs">·</span>
            <span className="text-xs text-muted-foreground">
              Viewing{" "}
              <span className="font-semibold text-foreground">
                {resellerContext.resellerName}
              </span>{" "}
              Workspace
            </span>
          </div>
        )}

        <div className="px-4 pt-2">
          <GlobalFilterBar />
        </div>
        <main className="layout-content scrollbar-thin">{children}</main>
      </div>

      {/* ForgeAI floating chat — fixed overlay, never pushes content */}
      <ForgeAIChatButton isOpen={isOpen} onToggle={toggleChat} />
      <ForgeAIChatPanel
        open={isOpen}
        onClose={closeChat}
        contextType={contextType}
        contextId={contextId}
      />
    </div>
  );
}
