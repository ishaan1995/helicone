import UserBarChart from "./charts/barChart";
import UserTable from "./components/table";
// import {
//   BackendMetricsCall,
//   useBackendMetricCall,
// } from "../../services/hooks/useBackendFunction";
//import { Result } from "../../lib/result";
//import { useEffect } from "react";

function subtractDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

export default function Main() {
  // const today = new Date();
  // const old = subtractDays(today, 7);
  // const params: BackendMetricsCall<any>["params"] = {
  //   timeFilter: {
  //     start: old,
  //     end: today,
  //   },
  //   userFilters: [],
  //   dbIncrement: undefined,
  //   timeZoneDifference: 0,
  // };

  // const { data, error, isLoading, isFetching } = useBackendMetricCall<
  //   Result<number, string>
  // >({
  //   params,
  //   endpoint: "/api/metrics/totalCost",
  // });

  // useEffect(() => {
  //   console.log("ishaan", "cost", data, error, isLoading, isFetching);
  // }, [data, error, isLoading, isFetching]);

  return (
    <div className="my-4 space-y-4">
      <UserBarChart />
      <UserTable />
    </div>
  );
}
