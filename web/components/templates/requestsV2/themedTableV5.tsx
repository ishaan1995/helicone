import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { clsx } from "../../shared/clsx";
import ThemedTimeFilter from "../../shared/themed/themedTimeFilter";
import ThemedTableHeader from "./themedTableHeader";

interface ThemedTableV5Props<T> {
  defaultData: T[];
  defaultColumns: ColumnDef<T>[];
  // TODO: change this to a more generic type???
  header?: {
    onFilter?: () => void;
  };
  sortable?: {};
  onRowSelect?: (row: T) => void;
  onColumnSort?: (column: ColumnDef<T>) => void;
}

export default function ThemedTableV5<T>(props: ThemedTableV5Props<T>) {
  const { defaultData, defaultColumns, header, sortable, onRowSelect } = props;

  const table = useReactTable({
    data: defaultData,
    columns: defaultColumns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col space-y-4">
      {header && (
        <ThemedTableHeader
          columns={table.getAllColumns()}
          onSelectAll={table.toggleAllColumnsVisible}
          visibleColumns={table.getVisibleLeafColumns().length}
        />
      )}

      <div className="bg-white rounded-md border border-gray-300 py-2 px-4">
        <div className="overflow-x-auto text-sm">
          <table
            {...{
              style: {
                width: table.getCenterTotalSize(),
              },
            }}
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-gray-300 overflow-hidden"
                >
                  {headerGroup.headers.map((header, i) => (
                    <th
                      key={i}
                      {...{
                        colSpan: header.colSpan,
                        style: {
                          width: header.getSize(),
                        },
                      }}
                      className="text-left py-2 font-semibold text-gray-900"
                    >
                      <div className="flex flex-row items-center gap-1.5">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {sortable && (
                          <span
                            onClick={() => {
                              // sortable.onSort(
                              //   header.column.columnDef.header as string
                              // );
                            }}
                            className="flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200 hover:cursor-pointer"
                          >
                            <ChevronDownIcon
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => header.column.getToggleSortingHandler()}
                        className={clsx(
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          "resizer pl-4 pr-2 mr-4 w-4"
                        )}
                        {...{
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                        }}
                      >
                        <div
                          className={clsx(
                            header.column.getIsResizing()
                              ? "bg-blue-700"
                              : "bg-gray-500",
                            "h-full w-1"
                          )}
                        />
                      </button>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-100 hover:cursor-pointer"
                  onClick={onRowSelect && (() => onRowSelect(row.original))}
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <td
                      key={i}
                      className="py-4 border-t border-gray-300 pr-4 text-gray-700"
                      {...{
                        style: {
                          maxWidth: cell.column.getSize(),
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        },
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
