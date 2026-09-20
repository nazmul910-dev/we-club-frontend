"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value: string; // same "YYYY-MM-DDTHH:mm" shape datetime-local produced
  onChange: (value: string) => void;
  placeholder?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date",
}: DateTimePickerProps) {
  const date = value ? new Date(value) : undefined;
  const timeValue = value ? (value.split("T")[1] ?? "00:00") : "00:00";

  const toDatetimeLocal = (d: Date, time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const next = new Date(d);
    next.setHours(hours || 0, minutes || 0, 0, 0);

    const pad = (n: number) => String(n).padStart(2, "0");
    return `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}T${pad(next.getHours())}:${pad(next.getMinutes())}`;
  };

  const handleDateSelect = (selected: Date | undefined) => {
    if (!selected) return;
    onChange(toDatetimeLocal(selected, timeValue));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!date) return;
    onChange(toDatetimeLocal(date, e.target.value));
  };

  return (
    <Popover>
      <PopoverTrigger className="block w-full">
        <Button
          variant="outline"
          className={cn(
            "h-10 w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP p") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
        <div className="border-t border-border p-3">
          <Input
            type="time"
            value={timeValue}
            onChange={handleTimeChange}
            className="h-9"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
