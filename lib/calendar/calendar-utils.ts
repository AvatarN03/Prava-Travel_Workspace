/**
 * Calendar utility engine for Prava AI
 * Provides Google Calendar URL formatting and RFC 5545 iCalendar (.ics) generation.
 * Zero external dependencies, client-safe, zero permission requirements.
 */

export interface CalendarEventPayload {
  title: string;
  description?: string | null;
  location?: string | null;
  startDate: Date | string;
  endDate?: Date | string | null;
  isAllDay?: boolean;
}

export interface MinimalTrip {
  id?: string;
  title: string;
  description?: string | null;
  destination?: string | null;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
}

export interface MinimalItineraryItem {
  id?: string;
  title: string;
  description?: string | null;
  location?: string | null;
  dayNumber?: number | null;
  startTime?: string | null;
  endTime?: string | null;
}

export interface MinimalAccommodation {
  id?: string;
  name: string;
  address?: string | null;
  checkIn?: Date | string | null;
  checkOut?: Date | string | null;
  confirmationCode?: string | null;
}

/**
 * Format a Date object or ISO string to Google Calendar's required date string.
 * All-day: YYYYMMDD
 * Timed: YYYYMMDDTHHmmssZ
 */
function formatGoogleDate(dateInput: Date | string, isAllDay = false): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    const fallback = new Date();
    return formatGoogleDate(fallback, isAllDay);
  }

  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());

  if (isAllDay) {
    return `${year}${month}${day}`;
  }

  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Builds a direct Google Calendar template URL that opens calendar.google.com
 * with all fields pre-filled for instant saving.
 */
export function buildGoogleCalendarUrl(payload: CalendarEventPayload): string {
  const baseUrl = "https://calendar.google.com/calendar/render";
  const params = new URLSearchParams();

  params.set("action", "TEMPLATE");
  params.set("text", payload.title);

  // Dates formatting
  const start = typeof payload.startDate === "string" ? new Date(payload.startDate) : payload.startDate;
  let end: Date;

  if (payload.endDate) {
    end = typeof payload.endDate === "string" ? new Date(payload.endDate) : payload.endDate;
  } else {
    // Default 1-hour duration for timed, or same-day for all-day
    end = new Date(start.getTime() + (payload.isAllDay ? 86400000 : 3600000));
  }

  if (payload.isAllDay) {
    // In Google Calendar, all-day end dates are EXCLUSIVE. Add +1 day to end date.
    const inclusiveEnd = new Date(end.getTime() + 86400000);
    const startStr = formatGoogleDate(start, true);
    const endStr = formatGoogleDate(inclusiveEnd, true);
    params.set("dates", `${startStr}/${endStr}`);
  } else {
    const startStr = formatGoogleDate(start, false);
    const endStr = formatGoogleDate(end, false);
    params.set("dates", `${startStr}/${endStr}`);
  }

  // Location
  if (payload.location) {
    params.set("location", payload.location);
  }

  // Details
  const detailsParts: string[] = [];
  if (payload.description) {
    detailsParts.push(payload.description);
  }
  detailsParts.push("\n---\nOrganized with Prava Travel Workspace (https://prava-workspace.vercel.app)");
  params.set("details", detailsParts.join("\n"));

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Builds a direct Google Calendar URL for an entire Trip window.
 */
export function buildTripGoogleCalendarUrl(trip: MinimalTrip): string {
  const start = trip.startDate ? new Date(trip.startDate) : new Date();
  const end = trip.endDate ? new Date(trip.endDate) : start;

  return buildGoogleCalendarUrl({
    title: `Trip: ${trip.title}`,
    description: trip.description || `Travel journey to ${trip.destination || "destination"}.`,
    location: trip.destination || "",
    startDate: start,
    endDate: end,
    isAllDay: true,
  });
}

/**
 * Builds a direct Google Calendar URL for a specific itinerary item.
 */
export function buildItineraryItemGoogleCalendarUrl(
  trip: MinimalTrip,
  item: MinimalItineraryItem
): string {
  // Determine base date
  let eventDate = new Date();
  if (trip.startDate) {
    const tripStart = new Date(trip.startDate);
    const dayOffset = Math.max(0, (item.dayNumber || 1) - 1);
    eventDate = new Date(tripStart.getTime() + dayOffset * 86400000);
  }

  // Check if we have timed slots
  let startDate = new Date(eventDate);
  let endDate = new Date(eventDate);
  let isAllDay = true;

  if (item.startTime) {
    const [hours, minutes] = item.startTime.split(":").map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      startDate.setHours(hours, minutes, 0, 0);
      isAllDay = false;

      if (item.endTime) {
        const [endH, endM] = item.endTime.split(":").map(Number);
        if (!isNaN(endH) && !isNaN(endM)) {
          endDate.setHours(endH, endM, 0, 0);
        } else {
          endDate = new Date(startDate.getTime() + 3600000); // 1 hour default
        }
      } else {
        endDate = new Date(startDate.getTime() + 3600000); // 1 hour default
      }
    }
  }

  return buildGoogleCalendarUrl({
    title: `${item.title} (${trip.title})`,
    description: item.description || `Day ${item.dayNumber || 1} activity for ${trip.title}`,
    location: item.location || trip.destination || "",
    startDate,
    endDate: isAllDay ? startDate : endDate,
    isAllDay,
  });
}

/**
 * Format date for RFC 5545 iCalendar standard.
 */
function formatIcsDate(date: Date, isAllDay = false): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());

  if (isAllDay) {
    return `${year}${month}${day}`;
  }

  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Escapes characters according to RFC 5545 section 3.3.11.
 */
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Generates a full RFC 5545 .ics calendar string containing the trip window,
 * confirmed stays, and all planned itinerary stops.
 */
export function generateTripIcs(
  trip: MinimalTrip,
  items: MinimalItineraryItem[] = [],
  stays: MinimalAccommodation[] = []
): string {
  const now = new Date();
  const timestamp = formatIcsDate(now);
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Prava//Prava Travel Workspace//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcsText(trip.title)}`,
    "X-WR-TIMEZONE:UTC",
  ];

  // 1. Overall Trip Event
  if (trip.startDate) {
    const tripStart = new Date(trip.startDate);
    const tripEnd = trip.endDate ? new Date(trip.endDate) : tripStart;
    // RFC 5545 all-day DTEND is exclusive
    const nextDayEnd = new Date(tripEnd.getTime() + 86400000);

    lines.push(
      "BEGIN:VEVENT",
      `UID:prava-trip-${trip.id || "trip"}-${timestamp}@prava-workspace.vercel.app`,
      `DTSTAMP:${timestamp}`,
      `DTSTART;VALUE=DATE:${formatIcsDate(tripStart, true)}`,
      `DTEND;VALUE=DATE:${formatIcsDate(nextDayEnd, true)}`,
      `SUMMARY:${escapeIcsText(`Trip: ${trip.title}`)}`,
      `DESCRIPTION:${escapeIcsText(trip.description || `Journey to ${trip.destination || "destination"}. Planned with Prava.`)}`,
      trip.destination ? `LOCATION:${escapeIcsText(trip.destination)}` : "",
      "STATUS:CONFIRMED",
      "TRANSP:TRANSPARENT",
      "END:VEVENT"
    );
  }

  // 2. Confirmed Accommodations / Stays
  stays.forEach((stay, idx) => {
    if (stay.checkIn) {
      const checkInDate = new Date(stay.checkIn);
      const checkOutDate = stay.checkOut
        ? new Date(stay.checkOut)
        : new Date(checkInDate.getTime() + 86400000);
      const nextDayOut = new Date(checkOutDate.getTime() + 86400000);

      const desc = [
        stay.confirmationCode ? `Confirmation: ${stay.confirmationCode}` : "",
        stay.address ? `Address: ${stay.address}` : "",
        "Planned with Prava Travel Workspace",
      ]
        .filter(Boolean)
        .join("\\n");

      lines.push(
        "BEGIN:VEVENT",
        `UID:prava-stay-${stay.id || idx}-${timestamp}@prava-workspace.vercel.app`,
        `DTSTAMP:${timestamp}`,
        `DTSTART;VALUE=DATE:${formatIcsDate(checkInDate, true)}`,
        `DTEND;VALUE=DATE:${formatIcsDate(nextDayOut, true)}`,
        `SUMMARY:${escapeIcsText(`Stay: ${stay.name}`)}`,
        `DESCRIPTION:${escapeIcsText(desc)}`,
        stay.address ? `LOCATION:${escapeIcsText(stay.address)}` : "",
        "STATUS:CONFIRMED",
        "END:VEVENT"
      );
    }
  });

  // 3. Daily Itinerary Items
  items.forEach((item, idx) => {
    let itemDate = new Date();
    if (trip.startDate) {
      const tripStart = new Date(trip.startDate);
      const dayOffset = Math.max(0, (item.dayNumber || 1) - 1);
      itemDate = new Date(tripStart.getTime() + dayOffset * 86400000);
    }

    let isAllDay = true;
    let startDate = new Date(itemDate);
    let endDate = new Date(itemDate);

    if (item.startTime) {
      const [sh, sm] = item.startTime.split(":").map(Number);
      if (!isNaN(sh) && !isNaN(sm)) {
        startDate.setHours(sh, sm, 0, 0);
        isAllDay = false;

        if (item.endTime) {
          const [eh, em] = item.endTime.split(":").map(Number);
          if (!isNaN(eh) && !isNaN(em)) {
            endDate.setHours(eh, em, 0, 0);
          } else {
            endDate = new Date(startDate.getTime() + 3600000);
          }
        } else {
          endDate = new Date(startDate.getTime() + 3600000);
        }
      }
    }

    lines.push(
      "BEGIN:VEVENT",
      `UID:prava-item-${item.id || idx}-${timestamp}@prava-workspace.vercel.app`,
      `DTSTAMP:${timestamp}`,
      isAllDay
        ? `DTSTART;VALUE=DATE:${formatIcsDate(startDate, true)}`
        : `DTSTART:${formatIcsDate(startDate, false)}`,
      isAllDay
        ? `DTEND;VALUE=DATE:${formatIcsDate(new Date(startDate.getTime() + 86400000), true)}`
        : `DTEND:${formatIcsDate(endDate, false)}`,
      `SUMMARY:${escapeIcsText(item.title)}`,
      `DESCRIPTION:${escapeIcsText(item.description || `Activity on Day ${item.dayNumber || 1}. Planned with Prava.`)}`,
      item.location ? `LOCATION:${escapeIcsText(item.location)}` : "",
      "STATUS:CONFIRMED",
      "END:VEVENT"
    );
  });

  lines.push("END:VCALENDAR");

  // Filter out any empty lines
  return lines.filter(Boolean).join("\r\n");
}

/**
 * Client-side helper to trigger instant file download for generated .ics content.
 */
export function downloadIcsFile(filename: string, icsContent: string): void {
  if (typeof window === "undefined") return;

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
