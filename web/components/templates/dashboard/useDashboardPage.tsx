import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { OverTimeRequestQueryParams } from "../../../lib/api/metrics/timeDataHandlerWrapper";
import { Result, resultMap } from "../../../lib/result";
import {
  RequestsOverTime,
  TimeIncrement,
} from "../../../lib/timeCalculations/fetchTimeData";
import { CostOverTime } from "../../../pages/api/metrics/costOverTime";
import { ErrorOverTime } from "../../../pages/api/metrics/errorOverTime";

import { getTokensPerRequest } from "../../../lib/api/metrics/averageTokensPerRequest";
import { getErrorCodes } from "../../../lib/api/metrics/errorCodes";
import { UnPromise } from "../../../lib/tsxHelpers";
import {
  BackendMetricsCall,
  useBackendMetricCall,
} from "../../../services/hooks/useBackendFunction";
import {
  FilterLeaf,
  filterListToTree,
  filterUIToFilterLeafs,
} from "../../../services/lib/filters/filterDefs";
import {
  DASHBOARD_PAGE_TABLE_FILTERS,
  SingleFilterDef,
} from "../../../services/lib/filters/frontendFilterDefs";
import { UIFilterRow } from "../../shared/themed/themedAdvancedFilters";
import { LatencyOverTime } from "../../../pages/api/metrics/latencyOverTime";
import { DailyActiveUsers } from "../../../pages/api/request_users/dau";
import { UsersOverTime } from "../../../pages/api/metrics/usersOverTime";

export async function fetchDataOverTime<T>(
  timeFilter: {
    start: Date;
    end: Date;
  },
  userFilters: FilterLeaf[],
  dbIncrement: TimeIncrement,
  path: string
) {
  const body: OverTimeRequestQueryParams = {
    timeFilter: {
      start: timeFilter.start.toISOString(),
      end: timeFilter.end.toISOString(),
    },
    userFilters,
    dbIncrement,
    timeZoneDifference: new Date().getTimezoneOffset(),
  };
  return await fetch(`/api/metrics/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => res.json() as Promise<Result<T[], string>>);
}

export interface DashboardPageData {
  timeFilter: {
    start: Date;
    end: Date;
  };
  uiFilters: UIFilterRow[];
  apiKeyFilter: string | null;
  timeZoneDifference: number;
  dbIncrement: TimeIncrement;
  isLive: boolean;
}

export const useDashboardPage = ({
  timeFilter,
  uiFilters,
  apiKeyFilter,
  timeZoneDifference,
  dbIncrement,
  isLive,
}: DashboardPageData) => {
  const filterMap = DASHBOARD_PAGE_TABLE_FILTERS as SingleFilterDef<any>[];
  const userFilters =
    apiKeyFilter !== null
      ? filterUIToFilterLeafs(filterMap, uiFilters).concat([
          {
            response_copy_v3: {
              auth_hash: {
                equals: apiKeyFilter,
              },
            },
          },
        ])
      : filterUIToFilterLeafs(filterMap, uiFilters);

  const params: BackendMetricsCall<any>["params"] = {
    timeFilter,
    userFilters,
    dbIncrement,
    timeZoneDifference,
  };

  const overTimeData = {
    errors: useBackendMetricCall<Result<ErrorOverTime[], string>>({
      params,
      endpoint: "/api/metrics/errorOverTime",
      key: "errorOverTime",
      postProcess: (data) => {
        return resultMap(data, (d) =>
          d.map((d) => ({ count: +d.count, time: new Date(d.time) }))
        );
      },
      isLive: isLive,
    }),
    requests: useBackendMetricCall<Result<RequestsOverTime[], string>>({
      params,
      endpoint: "/api/metrics/requestOverTime",
      key: "requestOverTime",
      postProcess: (data) => {
        return resultMap(data, (d) =>
          d.map((d) => ({ count: +d.count, time: new Date(d.time) }))
        );
      },
      isLive: isLive,
    }),
    costs: useBackendMetricCall<Result<CostOverTime[], string>>({
      params,
      endpoint: "/api/metrics/costOverTime",
      key: "costOverTime",
      postProcess: (data) => {
        return resultMap(data, (d) =>
          d.map((d) => ({ cost: +d.cost, time: new Date(d.time) }))
        );
      },
      isLive: isLive,
    }),
    latency: useBackendMetricCall<Result<LatencyOverTime[], string>>({
      params,
      endpoint: "/api/metrics/latencyOverTime",
      key: "latencyOverTime",
      postProcess: (data) => {
        return resultMap(data, (d) =>
          d.map((d) => ({ duration: +d.duration, time: new Date(d.time) }))
        );
      },
      isLive: isLive,
    }),
    users: useBackendMetricCall<Result<UsersOverTime[], string>>({
      params,
      endpoint: "/api/metrics/usersOverTime",
      key: "usersOverTime",
      postProcess: (data) => {
        return resultMap(data, (d) =>
          d.map((d) => ({ count: +d.count, time: new Date(d.time) }))
        );
      },
      isLive: isLive,
    }),
  };

  const metrics = {
    totalCost: useBackendMetricCall<Result<number, string>>({
      params,
      endpoint: "/api/metrics/totalCost",
      isLive: isLive,
    }),
    totalRequests: useBackendMetricCall<Result<number, string>>({
      params,
      endpoint: "/api/metrics/totalRequests",
      isLive: isLive,
    }),
    averageLatency: useBackendMetricCall<Result<number, string>>({
      params,
      endpoint: "/api/metrics/averageLatency",
      isLive: isLive,
    }),
    averageTokensPerRequest: useBackendMetricCall<
      UnPromise<ReturnType<typeof getTokensPerRequest>>
    >({
      params,
      endpoint: "/api/metrics/averageTokensPerRequest",
      isLive: isLive,
    }),
    activeUsers: useBackendMetricCall<Result<number, string>>({
      params,
      endpoint: "/api/metrics/activeUsers",
      isLive: isLive,
    }),
  };

  function isLoading(x: UseQueryResult<any>) {
    return x.isLoading || x.isFetching;
  }

  const isAnyLoading =
    Object.values(overTimeData).some(isLoading) ||
    Object.values(metrics).some(isLoading);

  return {
    filterMap,
    metrics,
    overTimeData,
    isAnyLoading,
  };
};
