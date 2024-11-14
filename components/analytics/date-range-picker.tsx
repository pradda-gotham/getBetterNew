"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DateRangePickerProps {
  value: [Date, Date];
  onChange: (value: [Date, Date]) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<[Date, Date]>(value);

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;

    const [start, end] = selectedRange;
    if (!start || (start && end)) {
      setSelectedRange([date, date]);
    } else {
      const newRange: [Date, Date] = date < start ? [date, start] : [start, date];
      setSelectedRange(newRange);
      onChange(newRange);
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarIcon className="h-4 w-4 mr-2" />
          {format(value[0], "MMM d, yyyy")} - {format(value[1], "MMM d, yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="range"
          selected={{
            from: selectedRange[0],
            to: selectedRange[1],
          }}
          onSelect={(range) => {
            if (range?.from && range?.to) {
              handleSelect(range.to);
            }
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}