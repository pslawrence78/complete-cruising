import { liveQuery } from "dexie";
import { useEffect, useState, type DependencyList } from "react";
import { seedSampleData } from "../db/seedDatabase";
import {
  getActivePortGuideBundle,
  getActiveSailingMemoriesBundle,
  getActiveShipGuideBundle,
  getDashboardBundle,
  getTodayGuideBundle,
} from "../db/repositories";

export interface LocalQueryState<T> {
  data?: T;
  error?: Error;
  loading: boolean;
}

export function useLocalQuery<T>(query: () => Promise<T>, dependencies: DependencyList = []): LocalQueryState<T> {
  const [state, setState] = useState<LocalQueryState<T>>({ loading: true });
  useEffect(() => {
    setState({ loading: true });
    const subscription = liveQuery(query).subscribe({
      next: (data) => setState({ data, loading: false }),
      error: (error) => setState({ error: error instanceof Error ? error : new Error("Local data query failed"), loading: false }),
    });
    return () => subscription.unsubscribe();
    // Callers provide the stable dependency boundary for their query.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
  return state;
}

export function useDatabaseBootstrap() {
  const [state, setState] = useState<LocalQueryState<true>>({ loading: true });
  useEffect(() => {
    let active = true;
    seedSampleData()
      .then(() => active && setState({ data: true, loading: false }))
      .catch((error) => active && setState({ error: error instanceof Error ? error : new Error("Local database setup failed"), loading: false }));
    return () => { active = false; };
  }, []);
  return state;
}

export const useSailingDashboard = () => useLocalQuery(getDashboardBundle, []);
export const useTodayGuide = () => useLocalQuery(getTodayGuideBundle, []);
export const useShipGuide = () => useLocalQuery(getActiveShipGuideBundle, []);
export const usePortGuide = () => useLocalQuery(getActivePortGuideBundle, []);
export const useMemories = () => useLocalQuery(getActiveSailingMemoriesBundle, []);
