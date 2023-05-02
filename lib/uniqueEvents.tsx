import { utcToZonedTime } from "date-fns-tz";
import { parseISO } from "date-fns";

export function uniqueEvents(events: any) {
  const uniqueTitles: { [key: string]: boolean } = {};
  const uniqueDates: { [key: string]: boolean } = {};
  const uniqueURL: { [key: string]: boolean } = {};
  return events.filter((event: any) => {
    const eventURL = event.url_hipsy ? event.url_hipsy : event.ticket_uri;
    const eventTitle = event.name ? event.name : event.title;
    let eventTime: Date | null = null;
    if (event.type == "Hipsy") {
      eventTime = utcToZonedTime(
        parseISO(event.start_time),
        "Europe/Amsterdam"
      );
    }
    if (event.type == "Facebook") {
      eventTime = parseISO(event.start_time);
    }

    if (eventTime) {
      if (
        (uniqueTitles[eventTitle] && uniqueDates[eventTime.toDateString()]) ||
        (uniqueDates[eventTime.toDateString()] && uniqueURL[eventURL])
      ) {
        return false;
      }
      uniqueTitles[eventTitle] = true;
      uniqueDates[eventTime.toDateString()] = true;
      uniqueURL[eventURL] = true;
      return true;
    } else {
      return false;
    }
  });
}
