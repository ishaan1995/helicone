import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { CategoryBar, ProgressCircle } from "@tremor/react";
import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Title,
} from "@tremor/react";
import { getUserData } from "../data/userData";
import { useEffect } from "react";

const data = [
  {
    name: "Viola Amherd",
    Role: "Federal Councillor",
    departement:
      "The Federal Department of Defence, Civil Protection and Sport (DDPS)",
    status: "active",
  },
  {
    name: "Simonetta Sommaruga",
    Role: "Federal Councillor",
    departement:
      "The Federal Department of the Environment, Transport, Energy and Communications (DETEC)",
    status: "active",
  },
  {
    name: "Alain Berset",
    Role: "Federal Councillor",
    departement: "The Federal Department of Home Affairs (FDHA)",
    status: "active",
  },
  {
    name: "Ignazio Cassis",
    Role: "Federal Councillor",
    departement: "The Federal Department of Foreign Affairs (FDFA)",
    status: "active",
  },
  {
    name: "Karin Keller-Sutter",
    Role: "Federal Councillor",
    departement: "The Federal Department of Finance (FDF)",
    status: "active",
  },
  {
    name: "Guy Parmelin",
    Role: "Federal Councillor",
    departement:
      "The Federal Department of Economic Affairs, Education and Research (EAER)",
    status: "active",
  },
  {
    name: "Elisabeth Baume-Schneider",
    Role: "Federal Councillor",
    departement: "The Federal Department of Justice and Police (FDJP)",
    status: "active",
  },
];

const UserTable = () => {
  const userData = getUserData();
  useEffect(() => {
    console.log("---user-data---");
    console.log(userData);
  }, [userData]);
  return (
    <Card>
      <Title>List of Swiss Federal Councillours</Title>
      <Table className="mt-5">
        <TableHead>
          <TableRow>
            <TableHeaderCell>User Id</TableHeaderCell>
            <TableHeaderCell>Cost</TableHeaderCell>
            <TableHeaderCell>Request</TableHeaderCell>
            <TableHeaderCell>Cost / day</TableHeaderCell>
            <TableHeaderCell>Requests / day</TableHeaderCell>
            <TableHeaderCell>Budget Usage</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userData.map((item) => (
            <TableRow key={item.userId}>
              <TableCell>{item.userId}</TableCell>
              <TableCell>
                <Text>${parseFloat(item.cost.toFixed(4))}</Text>
              </TableCell>
              <TableCell>
                <Text>{item.request}</Text>
              </TableCell>
              <TableCell>
                <Text>${parseFloat(item.costPerDay.toFixed(4))}</Text>
              </TableCell>
              <TableCell>
                <Text>{item.requestPerDay}</Text>
              </TableCell>
              <TableCell>
                <ProgressCircle value={item.budgetUsage} size="md">
                  <span className="text-xs text-gray-700 font-medium">
                    {item.budgetUsage}%
                  </span>
                </ProgressCircle>
              </TableCell>
              {/* <TableCell>
                <CategoryBar
                  values={[50, 25, 15, 10]}
                  colors={["emerald", "yellow", "orange", "rose"]}
                  markerValue={item.budgetUsage}
                  className="mt-3 w-64"
                />
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default UserTable;
