import { useQuery } from "@tanstack/react-query";
import { TimeFilter } from "../../lib/api/handlerWrappers";
import { TimeIncrement } from "../../lib/timeCalculations/fetchTimeData";
import {
  FilterLeaf,
  FilterNode,
  filterListToTree,
} from "../lib/filters/filterDefs";

export interface BackendMetricsCall<T> {
  params: {
    timeFilter: TimeFilter;
    userFilters: FilterLeaf[];
    dbIncrement?: TimeIncrement;
    timeZoneDifference: number;
  };
  endpoint: string;
  key?: string;
  postProcess?: (data: T) => T;
  isLive?: boolean;
}

export type MetricsBackendBody = {
  timeFilter: {
    start: string;
    end: string;
  };
  filter: FilterNode;
  dbIncrement?: TimeIncrement;
  timeZoneDifference: number;
};

export function useBackendMetricCall<T>({
  params,
  endpoint,
  key,
  postProcess,
  isLive,
}: BackendMetricsCall<T>) {
  return useQuery<T>({
    queryKey: ["" + key, endpoint, params],
    queryFn: async (query) => {
      const { timeFilter, userFilters, dbIncrement, timeZoneDifference } = query
        .queryKey[2] as BackendMetricsCall<T>["params"];
      const res = fetch(query.queryKey[1] as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: filterListToTree(userFilters, "and"),
          // You cannot properly serialize Date on the wire. so we need to do this gross stuff
          timeFilter: {
            start: timeFilter.start.toISOString(),
            end: timeFilter.end.toISOString(),
          },
          dbIncrement,
          timeZoneDifference,
        } as MetricsBackendBody),
      }).then((res) => res.json() as Promise<T>);
      if (postProcess === undefined) {
        return await res;
      }
      return postProcess(await res);
    },
    refetchOnWindowFocus: false,
    refetchInterval: isLive ? 2_000 : false,
  });
}
