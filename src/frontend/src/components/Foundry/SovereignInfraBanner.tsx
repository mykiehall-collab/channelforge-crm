import { Globe, ShieldCheck, TrendingUp } from "lucide-react";

function GlassCard({
  children,
  className = "",
  "data-ocid": dataOcid,
}: {
  children: React.ReactNode;
  className?: string;
  "data-ocid"?: string;
}) {
  return (
    <div
      data-ocid={dataOcid}
      className={`rounded-xl border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] bg-white/[0.04] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function SovereignInfraBanner() {
  return (
    <GlassCard className="p-5" data-ocid="infrastructure.sovereign_banner">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-orange-500/10 flex-shrink-0">
          <Globe size={14} className="text-orange-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground mb-1">
            Operational Infrastructure Aligned to Your Ecosystem
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Compute and storage can scale across your Vendor, Distributor, and
            Reseller network. Control infrastructure allocation across your
            operational hierarchy.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                label: "Sovereign Deployment Ready",
                icon: ShieldCheck,
              },
              {
                label: "Regional Infrastructure Selection",
                icon: Globe,
              },
              {
                label: "AI Node Readiness",
                icon: TrendingUp,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"
              >
                <item.icon
                  size={11}
                  className="text-orange-400 flex-shrink-0"
                />
                <span className="text-[11px] text-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground/70 mt-3">
            Large-scale organizations can later deploy dedicated operational
            infrastructure environments.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
