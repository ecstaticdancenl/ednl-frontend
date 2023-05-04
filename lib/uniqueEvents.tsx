import { utcToZonedTime } from "date-fns-tz";
import { parseISO } from "date-fns";

export function uniqueEvents(events: any) {
  const uniqueTitles: { [key: string]: boolean } = {};
  const uniqueURL: { [key: string]: boolean } = {};
  const filteredEvents = events.filter((event: any) => {
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
      const eventURL =
        eventTime.toDateString() +
        (event.url_hipsy ? event.url_hipsy : event.ticket_uri);
      const eventTitle =
        eventTime.toDateString() + (event.name ? event.name : event.title);
      if (uniqueTitles[eventTitle] || uniqueURL[eventURL]) {
        return false;
      }
      uniqueTitles[eventTitle] = true;
      uniqueURL[eventURL] = true;
      return true;
    } else {
      return false;
    }
  });
  return filteredEvents;
}
