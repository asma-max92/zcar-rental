export interface ParsedEvent {
  startDate: Date;
  endDate: Date;
  summary: string;
  uid: string;
}

/**
 * Parse an iCal (.ics) string into a list of events.
 * Handles basic VEVENT blocks with DTSTART, DTEND, and SUMMARY.
 */
export function parseICal(icalData: string): ParsedEvent[] {
  const events: ParsedEvent[] = [];
  const lines = icalData.split(/\r?\n/);

  let inEvent = false;
  let currentEvent: Partial<ParsedEvent> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle line folding (lines starting with space are continuations)
    if (line.startsWith(" ") && i > 0) {
      continue; // Skip folded lines for simplicity; we don't need long fields
    }

    if (line === "BEGIN:VEVENT") {
      inEvent = true;
      currentEvent = {};
      continue;
    }

    if (line === "END:VEVENT") {
      inEvent = false;
      if (currentEvent.startDate && currentEvent.endDate) {
        events.push({
          startDate: currentEvent.startDate,
          endDate: currentEvent.endDate,
          summary: currentEvent.summary || "Blocked",
          uid: currentEvent.uid || "",
        });
      }
      currentEvent = {};
      continue;
    }

    if (!inEvent) continue;

    const [key, ...valueParts] = line.split(":");
    const value = valueParts.join(":"); // Rejoin in case value contains colons

    if (!key || value === undefined) continue;

    const baseKey = key.split(";")[0]; // Remove parameters like VALUE=DATE

    switch (baseKey) {
      case "DTSTART":
        currentEvent.startDate = parseICalDate(value);
        break;
      case "DTEND":
        currentEvent.endDate = parseICalDate(value);
        break;
      case "SUMMARY":
        currentEvent.summary = value.trim();
        break;
      case "UID":
        currentEvent.uid = value.trim();
        break;
    }
  }

  return events;
}

/**
 * Parse iCal date/time formats:
 * - 20250915T000000Z (UTC)
 * - 20250915T000000 (local)
 * - 20250915 (all-day)
 */
function parseICalDate(value: string): Date {
  const clean = value.trim();

  // All-day format: 20250915
  if (clean.length === 8 && !clean.includes("T")) {
    const year = parseInt(clean.slice(0, 4), 10);
    const month = parseInt(clean.slice(4, 6), 10) - 1;
    const day = parseInt(clean.slice(6, 8), 10);
    return new Date(Date.UTC(year, month, day));
  }

  // Date-time format: 20250915T000000Z or 20250915T000000
  const isUtc = clean.endsWith("Z");
  const dateStr = clean.replace(/(\d{4})(\d{2})(\d{2})T?(\d{2})?(\d{2})?(\d{2})?Z?/, (
    _, y, m, d, h = "00", min = "00", s = "00"
  ) => {
    return `${y}-${m}-${d}T${h}:${min}:${s}${isUtc ? "Z" : ""}`;
  });

  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid iCal date: ${value}`);
  }
  return parsed;
}

/**
 * Fetch and parse a Turo iCal feed.
 */
export async function fetchTuroCalendar(icalUrl: string): Promise<ParsedEvent[]> {
  if (!icalUrl) {
    return [];
  }

  const response = await fetch(icalUrl, {
    headers: {
      Accept: "text/calendar",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Turo calendar: ${response.status} ${response.statusText}`);
  }

  const icalData = await response.text();
  return parseICal(icalData);
}
