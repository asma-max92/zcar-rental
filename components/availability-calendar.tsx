"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isWithinInterval,
} from "date-fns";
import { ChevronLeft, ChevronRight, CalendarX, CalendarCheck } from "lucide-react";

interface BlockedDate {
  id: string;
  startDate: string;
  endDate: string;
  source: string;
  summary: string;
}

interface AvailabilityCalendarProps {
  vehicleId: string;
}

export function AvailabilityCalendar({ vehicleId }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlockedDates() {
      try {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;
        const res = await fetch(
          `/api/vehicles/${vehicleId}/blocked-dates?year=${year}&month=${month}`
        );
        if (res.ok) {
          const data = await res.json();
          setBlockedDates(data.blockedDates || []);
        }
      } catch (error) {
        console.error("Failed to fetch blocked dates:", error);
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    fetchBlockedDates();
  }, [vehicleId, currentMonth]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  function parseLocalDate(dateStr: string): Date {
    return new Date(dateStr + "T00:00:00");
  }

  function isDateBlocked(date: Date): boolean {
    return blockedDates.some((bd) => {
      const start = parseLocalDate(bd.startDate);
      const end = parseLocalDate(bd.endDate);
      return isWithinInterval(date, { start, end });
    });
  }

  function getBlockedInfo(date: Date): BlockedDate | undefined {
    return blockedDates.find((bd) => {
      const start = parseLocalDate(bd.startDate);
      const end = parseLocalDate(bd.endDate);
      return isWithinInterval(date, { start, end });
    });
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-ink-card border border-ink-border rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[14px] font-semibold text-apple-black uppercase tracking-wider">
            Availability
          </h3>
          <p className="text-[12px] text-apple-gray mt-1">
            {format(currentMonth, "MMMM yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-lg border border-ink-border hover:bg-ink-light transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-apple-gray" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-lg border border-ink-border hover:bg-ink-light transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-apple-gray" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-[11px] text-apple-gray">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500" />
          <span>Blocked</span>
        </div>
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-apple-gray text-[12px]">Loading calendar...</div>
        </div>
      ) : (
        <div>
          {/* Week day headers */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((wd) => (
              <div
                key={wd}
                className="text-center text-[10px] font-semibold text-apple-gray uppercase tracking-wider py-2"
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, i) => {
              const isCurrentMonth = isSameMonth(date, monthStart);
              const isBlocked = isDateBlocked(date);
              const blockedInfo = isBlocked ? getBlockedInfo(date) : undefined;
              const isToday = isSameDay(date, new Date());

              return (
                <div
                  key={i}
                  className={`
                    relative aspect-square flex flex-col items-center justify-center rounded-lg text-[12px] transition-colors
                    ${isCurrentMonth ? "text-apple-black" : "text-apple-gray/40"}
                    ${isBlocked && isCurrentMonth ? "bg-red-500/10 border border-red-500/30" : ""}
                    ${!isBlocked && isCurrentMonth ? "bg-emerald-500/5 border border-emerald-500/20" : ""}
                    ${!isCurrentMonth ? "bg-transparent" : ""}
                    ${isToday ? "ring-1 ring-gold" : ""}
                  `}
                  title={
                    blockedInfo
                      ? `${blockedInfo.summary || "Blocked"} (${blockedInfo.source})`
                      : isCurrentMonth
                      ? "Available"
                      : ""
                  }
                >
                  <span className="font-medium">{format(date, "d")}</span>
                  {isBlocked && isCurrentMonth && (
                    <CalendarX className="w-3 h-3 text-red-500 mt-0.5" />
                  )}
                  {!isBlocked && isCurrentMonth && (
                    <CalendarCheck className="w-3 h-3 text-emerald-500 mt-0.5" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Blocked count */}
      {blockedDates.length > 0 && (
        <p className="text-[11px] text-apple-gray mt-4 text-center">
          {blockedDates.length} blocked period{blockedDates.length > 1 ? "s" : ""} this month
        </p>
      )}
    </div>
  );
}
