import { DateSelector } from "./components/dateRange";

const stats = [
  { name: "Total User", stat: "71" },
  { name: "Cost", stat: "$58.16" },
  { name: "Avg. Cost / User", stat: "$2" },
  { name: "Avg. Cost / Req", stat: "$0.24" },
];

export default function Header() {
  return (
    <div className="flex flex-col items-start">
      <div className="flex items-start">
        <DateSelector />
      </div>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4 w-full">
        {stats.map((item) => (
          <div
            key={item.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">
              {item.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {item.stat}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
