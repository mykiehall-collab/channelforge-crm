interface FormActionsProps {
  onCancel: () => void;
  saving: boolean;
  submitLabel: string;
  savingLabel?: string;
}

export function FormActions({
  onCancel,
  saving,
  submitLabel,
  savingLabel,
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 rounded-lg border border-[#223047] text-[#A9B6C9] hover:bg-[#1E2A3E] text-sm transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 rounded-lg bg-[#2D7BFF] hover:bg-[#1a6aef] text-white text-sm font-medium transition-colors disabled:opacity-50"
      >
        {saving ? (savingLabel ?? "Saving...") : submitLabel}
      </button>
    </div>
  );
}
