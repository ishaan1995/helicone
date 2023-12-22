import { BarChart, Card, Title, Subtitle } from "@tremor/react";
//Select
import { Select, SelectItem } from "@tremor/react";

// add real numbers from helicone
const chartdata = [
  {
    date: "2023-12-15",
    count: 2488,
  },
  {
    date: "2023-12-16",
    count: 1445,
  },
  {
    date: "2023-12-17",
    count: 743,
  },
  {
    date: "2023-12-18",
    count: 281,
  },
  {
    date: "2023-12-19",
    count: 251,
  },
  {
    date: "2023-12-20",
    count: 232,
  },
  {
    date: "2023-12-21",
    count: 98,
  },
];

const valueFormatter = (number: number) =>
  `$ ${new Intl.NumberFormat("us").format(number).toString()}`;

const UserBarChart = () => (
  <Card>
    <div className="flex w-full mx-auto items-center justify-between">
      <Title>Cost</Title>
      <Select className="max-w-sm">
        <SelectItem value="1">Total cost</SelectItem>
        <SelectItem value="2">Avg. cost / user</SelectItem>
        <SelectItem value="3">Avg. cost / request</SelectItem>
      </Select>
    </div>
    <BarChart
      className="mt-6"
      data={chartdata}
      colors={["blue"]}
      index="date"
      categories={["count"]}
      showLegend={false}
      valueFormatter={valueFormatter}
      yAxisWidth={48}
    />
  </Card>
);

export default UserBarChart;
