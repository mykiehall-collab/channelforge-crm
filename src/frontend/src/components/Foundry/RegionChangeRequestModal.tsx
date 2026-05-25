import { useState } from "react";
import { useApp } from "../../AppContext";

const CHANGE_REASONS = [
  "Data Residency Requirements",
  "Operational Relocation",
  "Regional Governance Requirements",
  "Infrastructure Restructuring",
  "Other",
];

const STEP_LABELS = [
  "Understand Implications",
  "Business Justification",
  "Review & Submit",
  "Request Submitted",
];

const IMPACT_CARDS = [
  {
    title: "Data Residency Impact",
    desc: "Moving operational data to a new region may affect compliance and data residency requirements.",
  },
  {
    title: "Operational Continuity",
    desc: "Infrastructure changes may require a maintenance window and operational coordination.",
  },
  {
    title: "Infrastructure Realignment",
    desc: "Existing operational workloads will need to be realigned to the new regional infrastructure.",
  },
  {
    title: "Regional Governance Requirements",
    desc: "Different regions may have distinct governance and compliance requirements.",
  },
];

const REF_NUMBER = "RCR-2026-001";

export default function RegionChangeRequestModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const { setOperationalRegionPrefs, operationalRegionPrefs } = useApp();
  const [step, setStep] = useState(1);
  const [impliedConfirmed, setImpliedConfirmed] = useState(false);
  const [reason, setReason] = useState(CHANGE_REASONS[0]);
  const [justification, setJustification] = useState("");
  const [impactAssessment, setImpactAssessment] = useState("");

  function handleSubmit() {
    setOperationalRegionPrefs({
      ...operationalRegionPrefs,
      changeRequest: {
        id: REF_NUMBER,
        status: "pending_review" as const,
        businessJustification: justification,
        submittedAt: new Date().toISOString(),
        impactSummary: impactAssessment,
        referenceNumber: REF_NUMBER,
      },
    });
    setStep(4);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0a1628] border border-white/10 rounded-2xl max-w-lg w-full mx-4 p-6">
        {/* Step progress */}
        <div className="flex items-center mb-6">
          {STEP_LABELS.map((label, i) => {
            const num = i + 1;
            const isActive = num === step;
            const isPast = num < step;
            return (
              <>
                <div
                  key={`step-${num}`}
                  title={label}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0 ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : isPast
                        ? "bg-orange-500/30 text-orange-400"
                        : "bg-white/10 text-white/40"
                  }`}
                >
                  {num}
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div
                    key={`line-${num}`}
                    className="flex-1 h-px bg-white/10"
                  />
                )}
              </>
            );
          })}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            {step === 1 && "Operational Region Change Request"}
            {step === 2 && "Provide Business Justification"}
            {step === 3 && "Review Operational Impact"}
            {step === 4 && "Request Submitted"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-white/60 text-sm">
              Operational region changes require governance review due to
              infrastructure alignment and operational consistency.
            </p>
            <div className="space-y-3">
              {IMPACT_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="border border-orange-500/30 bg-orange-500/5 rounded-lg p-3"
                >
                  <p className="text-white text-sm font-medium mb-1">
                    {card.title}
                  </p>
                  <p className="text-white/70 text-sm">{card.desc}</p>
                </div>
              ))}
            </div>
            <label className="flex items-start gap-3 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={impliedConfirmed}
                onChange={(e) => setImpliedConfirmed(e.target.checked)}
                className="mt-0.5 accent-orange-500"
              />
              <span className="text-white/70 text-sm">
                I understand the implications of changing my operational region.
              </span>
            </label>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={!impliedConfirmed}
                onClick={() => setStep(2)}
                className="px-5 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
                data-ocid="region_change.next_button.1"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="region-change-reason"
                className="text-white/70 text-xs font-medium block mb-1"
              >
                Reason for Change
              </label>
              <select
                id="region-change-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50"
                data-ocid="region_change.reason_select"
              >
                {CHANGE_REASONS.map((r) => (
                  <option key={r} value={r} className="bg-[#0a1628]">
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="region-change-justification"
                className="text-white/70 text-xs font-medium block mb-1"
              >
                Business Justification
              </label>
              <textarea
                id="region-change-justification"
                rows={4}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Describe your business justification for this change (minimum 50 characters)..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/30 resize-none focus:outline-none focus:border-orange-500/50"
                data-ocid="region_change.justification_textarea"
              />
              <p className="text-white/30 text-xs mt-1">
                {justification.length} / 50 min characters
              </p>
            </div>
            <div>
              <label
                htmlFor="region-change-impact"
                className="text-white/70 text-xs font-medium block mb-1"
              >
                Operational Impact Assessment
              </label>
              <textarea
                id="region-change-impact"
                rows={3}
                value={impactAssessment}
                onChange={(e) => setImpactAssessment(e.target.value)}
                placeholder="Describe the operational impact assessment..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/30 resize-none focus:outline-none focus:border-orange-500/50"
                data-ocid="region_change.impact_textarea"
              />
            </div>
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
                data-ocid="region_change.back_button.2"
              >
                Back
              </button>
              <button
                type="button"
                disabled={justification.length < 50 || !impactAssessment.trim()}
                onClick={() => setStep(3)}
                className="px-5 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
                data-ocid="region_change.next_button.2"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3 ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 flex items-start gap-3">
              <span className="text-amber-400 text-lg shrink-0">⚠️</span>
              <div>
                <p className="text-amber-300 text-sm font-medium mb-1">
                  This change will affect your operational infrastructure
                  alignment.
                </p>
                <p className="text-amber-200/70 text-sm">
                  Your request will be reviewed by the CHANNELFORGE
                  infrastructure governance team.
                </p>
              </div>
            </div>
            <p className="text-white/50 text-sm">
              Estimated review timeline:{" "}
              <span className="text-white/80 font-medium">
                5–10 business days
              </span>
            </p>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Reason</span>
                <span className="text-white">{reason}</span>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-1">Justification</p>
                <p className="text-white/80 text-sm line-clamp-3">
                  {justification}
                </p>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-1">Impact Assessment</p>
                <p className="text-white/80 text-sm line-clamp-2">
                  {impactAssessment}
                </p>
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
                data-ocid="region_change.back_button.3"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                data-ocid="region_change.submit_button"
              >
                Submit Governance Request
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4 ── */}
        {step === 4 && (
          <div className="space-y-4 text-center py-2">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 mx-auto">
              <span className="text-4xl text-green-400">✓</span>
            </div>
            <h3 className="text-white font-bold text-lg">
              Request Submitted for Review
            </h3>
            <p className="text-white/70 text-sm font-bold">{REF_NUMBER}</p>
            <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full px-3 py-1 text-xs font-medium">
              Pending Review
            </span>
            <p className="text-white/60 text-sm max-w-sm mx-auto">
              Your operational region change request has been submitted for
              governance review. You will be notified of any status updates.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                data-ocid="region_change.close_button"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
