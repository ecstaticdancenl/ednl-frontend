import { parseISO } from "date-fns";

export function sortEventsByDate(events: any[]) {
  return events.sort((a, b) => {
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);
    return dateA.getTime() - dateB.getTime();
  });
}
