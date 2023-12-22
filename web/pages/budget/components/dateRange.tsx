import {
  DateRangePicker,
  DateRangePickerItem,
  DateRangePickerValue,
} from "@tremor/react";
import { useRef, useState } from "react";

function subtractDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

export function DateSelector() {
  const currentDateRef = useRef<Date>(new Date());
  const [value, setValue] = useState<DateRangePickerValue>({
    from: subtractDays(currentDateRef.current, 7),
    to: currentDateRef.current,
  });

  // todo: show default 7 days on UI
  return (
    <DateRangePicker
      className="max-w-md mx-auto"
      value={value}
      onValueChange={setValue}
      selectPlaceholder="Select range"
    >
      <DateRangePickerItem
        key="today"
        value="today"
        from={currentDateRef.current}
        to={currentDateRef.current}
      >
        Today
      </DateRangePickerItem>
      <DateRangePickerItem
        key="last7days"
        value="last7days"
        from={subtractDays(currentDateRef.current, 7)}
      >
        Last 7 days
      </DateRangePickerItem>
      <DateRangePickerItem
        key="last30days"
        value="last30days"
        from={subtractDays(currentDateRef.current, 30)}
      >
        Last 30 days
      </DateRangePickerItem>
      <DateRangePickerItem
        key="mtd"
        value="mtd"
        from={
          new Date(
            currentDateRef.current.getFullYear(),
            currentDateRef.current.getMonth(),
            1
          )
        }
        to={currentDateRef.current}
      >
        Month to Date
      </DateRangePickerItem>
      <DateRangePickerItem
        key="ytd"
        value="ytd"
        from={new Date(currentDateRef.current.getFullYear(), 0, 1)}
        to={currentDateRef.current}
      >
        Year to Date
      </DateRangePickerItem>
    </DateRangePicker>
  );
}
