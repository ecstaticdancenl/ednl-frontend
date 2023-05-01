import { parseISO } from "date-fns";

export function sortEventsByDate(events: any[]) {
  return events.sort((a, b) => {
    const dateA = parseISO(a.start_time);
    const dateB = parseISO(b.start_time);
    return dateA.getTime() - dateB.getTime();
  });
}
