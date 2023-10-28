export async function getEventsFromFacebook() {
  const result = await fetch(
    `https://graph.facebook.com/v13.0/EDNederland/events?access_token=${process.env.FACEBOOK}&limit=5&time_filter=upcoming&fields=name,start_time,place,cover.source(width(162),height(126)),ticket_uri`
  );
 console.log(
        "Getting FB events" +  result
  );
  const dataFacebook = await result.json();
  const eventsFacebookRaw = dataFacebook.data.map((event: any) => {
    event.type = "Facebook";
    return event;
  });
  const now = new Date();
  const eventsFacebook = eventsFacebookRaw.filter((event: any) => {
    const date = new Date(event.start_time);
    return date >= now;
  });
  return eventsFacebook;
}
