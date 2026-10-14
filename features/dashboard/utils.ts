import type { UpcomingTripDetails } from "./queries";

/**
 * Derives the user's first name for greeting displays.
 * Falls back to email prefix or "Traveler" if no name is available.
 */
export function getUserFirstName(
  user?: { fullName?: string | null; email?: string | null } | null
): string {
  const displayName =
    user?.fullName?.trim() || (user?.email ? user.email.split("@")[0] : "Traveler");
  return displayName.split(" ")[0] || "Traveler";
}

/**
 * Returns a time-of-day greeting (e.g., "Good morning", "Good afternoon", "Good evening").
 */
export function getTimeBasedGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/**
 * Computes the contextual dashboard subtitle based on current travel schedule.
 * Prioritizes active journeys, recent completions, upcoming departures, and saved trip totals.
 */
export function getDashboardSubGreeting(
  upcomingTrip: UpcomingTripDetails | null,
  totalTrips: number
): string {
  if (!upcomingTrip) {
    if (totalTrips > 0) {
      return `Ready for your next journey? You have ${totalTrips} ${
        totalTrips === 1 ? "trip" : "trips"
      } saved in your workspace.`;
    }
    return "Ready for your next journey? Start planning your first travel experience.";
  }

  const destination = upcomingTrip.destination || upcomingTrip.title;

  if (upcomingTrip.isOngoing) {
    return `Your journey to ${destination} is currently underway. Have a wonderful trip!`;
  }

  if (upcomingTrip.isPastTrip) {
    const days = upcomingTrip.daysSinceEnd;
    const daysText =
      days !== null && days !== undefined
        ? days === 0
          ? "today"
          : `${days} ${days === 1 ? "day" : "days"} ago`
        : "recently";
    return `Your previous journey to ${destination} concluded ${daysText}. Ready for what's next? Plan a new trip!`;
  }

  if (upcomingTrip.countdownDays !== null) {
    if (upcomingTrip.countdownDays > 0) {
      return `Ready for your next journey? 1 trip starting in ${upcomingTrip.countdownDays} ${
        upcomingTrip.countdownDays === 1 ? "day" : "days"
      }.`;
    }
    if (upcomingTrip.countdownDays === 0) {
      return "Ready for your next journey? 1 trip starting today.";
    }
    return "Ready for your next journey? Start planning your next travel experience.";
  }

  return `Ready for your next journey? You have ${totalTrips} ${
    totalTrips === 1 ? "trip" : "trips"
  } saved in your workspace.`;
}
