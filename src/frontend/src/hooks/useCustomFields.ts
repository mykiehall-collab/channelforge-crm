import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import type {
  CustomFieldDef,
  CustomFieldObjectType,
  CustomFieldValidationResult,
  CustomFieldValue,
} from "../backend.d";
import { useActor } from "./useActor";

export interface CustomFieldState {
  fieldDefs: CustomFieldDef[];
  fieldValues: Record<string, CustomFieldValue>; // keyed by fieldDefId
  pendingChanges: Record<string, string>; // keyed by fieldDefId -> new string value
  isLoading: boolean;
  isSaving: boolean;
  errors: Record<string, string>; // keyed by fieldDefId
  validationResults: CustomFieldValidationResult[];
  setFieldValue: (fieldDefId: string, value: string) => void;
  saveFieldValues: () => Promise<void>;
  validateAll: () => Record<string, string>;
  hasPendingChanges: boolean;
}

export function useCustomFields(
  objectType: CustomFieldObjectType,
  objectId: string,
): CustomFieldState {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>(
    {},
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationResults, setValidationResults] = useState<
    CustomFieldValidationResult[]
  >([]);

  // ─── Field Definitions ───────────────────────────────────────────────────────
  const defsQuery = useQuery<CustomFieldDef[]>({
    queryKey: ["customFieldDefs", objectType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCustomFieldDefs(objectType);
    },
    enabled: !!actor && !!objectType,
    staleTime: 5 * 60 * 1000,
  });

  // ─── Field Values ────────────────────────────────────────────────────────────
  const valuesQuery = useQuery<CustomFieldValue[]>({
    queryKey: ["customFieldValues", objectType, objectId],
    queryFn: async () => {
      if (!actor || !objectId) return [];
      return actor.getCustomFieldValues(objectId, objectType);
    },
    enabled: !!actor && !!objectId,
    staleTime: 30_000,
  });

  // ─── Derived: values map ─────────────────────────────────────────────────────
  const fieldValues = useMemo<Record<string, CustomFieldValue>>(() => {
    const map: Record<string, CustomFieldValue> = {};
    for (const v of valuesQuery.data ?? []) {
      map[v.fieldDefId] = v;
    }
    return map;
  }, [valuesQuery.data]);

  // ─── Save mutation ───────────────────────────────────────────────────────────
  const saveMutation = useMutation<
    CustomFieldValidationResult[],
    Error,
    Record<string, string>
  >({
    mutationFn: async (changes: Record<string, string>) => {
      if (!actor) throw new Error("No actor");
      const results: CustomFieldValidationResult[] = [];
      for (const [fieldDefId, value] of Object.entries(changes)) {
        const result = await actor.setCustomFieldValue({
          fieldDefId,
          objectId,
          objectType,
          value,
          uploadedFileKeys: [],
        });
        results.push(result);
      }
      return results;
    },
    onSuccess: (results) => {
      setValidationResults(results);
      const newErrors: Record<string, string> = {};
      for (const r of results) {
        if (!r.isValid && r.errorMessage) {
          newErrors[r.fieldDefId] = r.errorMessage;
        }
      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        setPendingChanges({});
        queryClient.invalidateQueries({
          queryKey: ["customFieldValues", objectType, objectId],
        });
      }
    },
    onError: (err) => {
      setErrors({ _global: err.message });
    },
  });

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const setFieldValue = useCallback((fieldDefId: string, value: string) => {
    setPendingChanges((prev) => ({ ...prev, [fieldDefId]: value }));
    // Clear error on change
    setErrors((prev) => {
      if (!prev[fieldDefId]) return prev;
      const next = { ...prev };
      delete next[fieldDefId];
      return next;
    });
  }, []);

  const saveFieldValues = useCallback(async () => {
    if (Object.keys(pendingChanges).length === 0) return;
    await saveMutation.mutateAsync(pendingChanges);
  }, [pendingChanges, saveMutation]);

  const validateAll = useCallback((): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    const defs = defsQuery.data ?? [];
    for (const def of defs) {
      if (def.isArchived) continue;
      const pendingVal = pendingChanges[def.id];
      const existingVal = fieldValues[def.id]?.value;
      const currentVal =
        pendingVal !== undefined ? pendingVal : (existingVal ?? "");
      if (def.isRequired && !currentVal) {
        newErrors[def.id] = `${def.fieldLabel} is required.`;
      }
      for (const rule of def.validationRules) {
        if (
          rule.ruleType === "minLength" &&
          currentVal.length < Number(rule.ruleValue)
        ) {
          newErrors[def.id] = `Minimum ${rule.ruleValue} characters required.`;
        }
        if (
          rule.ruleType === "maxLength" &&
          currentVal.length > Number(rule.ruleValue)
        ) {
          newErrors[def.id] = `Maximum ${rule.ruleValue} characters allowed.`;
        }
        if (rule.ruleType === "regex") {
          try {
            if (!new RegExp(rule.ruleValue).test(currentVal)) {
              newErrors[def.id] = "Value does not match required format.";
            }
          } catch {
            // invalid regex — skip
          }
        }
        if (
          rule.ruleType === "minValue" &&
          Number(currentVal) < Number(rule.ruleValue)
        ) {
          newErrors[def.id] = `Minimum value is ${rule.ruleValue}.`;
        }
        if (
          rule.ruleType === "maxValue" &&
          Number(currentVal) > Number(rule.ruleValue)
        ) {
          newErrors[def.id] = `Maximum value is ${rule.ruleValue}.`;
        }
      }
    }
    setErrors(newErrors);
    return newErrors;
  }, [defsQuery.data, pendingChanges, fieldValues]);

  return {
    fieldDefs: defsQuery.data ?? [],
    fieldValues,
    pendingChanges,
    isLoading: defsQuery.isLoading || valuesQuery.isLoading,
    isSaving: saveMutation.isPending,
    errors,
    validationResults,
    setFieldValue,
    saveFieldValues,
    validateAll,
    hasPendingChanges: Object.keys(pendingChanges).length > 0,
  };
}
