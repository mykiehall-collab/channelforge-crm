import { useEffect, useRef, useState } from "react";

export interface ProgressiveRefreshState {
  kpiLoading: boolean;
  tableLoading: boolean;
  insightsLoading: boolean;
}

export default function useProgressiveRefresh(
  dependency: unknown,
): ProgressiveRefreshState {
  const [kpiLoading, setKpiLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const prevRef = useRef<string>("");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const serialized = JSON.stringify(dependency);
    if (prevRef.current === "") {
      prevRef.current = serialized;
      return;
    }
    if (prevRef.current === serialized) return;
    prevRef.current = serialized;

    // Clear any existing timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setKpiLoading(true);
    setTableLoading(false);
    setInsightsLoading(false);

    const t1 = setTimeout(() => {
      setKpiLoading(false);
      setTableLoading(true);
    }, 300);

    const t2 = setTimeout(() => {
      setTableLoading(false);
      setInsightsLoading(true);
    }, 600);

    const t3 = setTimeout(() => {
      setInsightsLoading(false);
    }, 900);

    timersRef.current = [t1, t2, t3];

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [dependency]);

  return { kpiLoading, tableLoading, insightsLoading };
}
