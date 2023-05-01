export async function getEventsFromHipsy(organisations: any) {
  const promises = organisations.map(async (org: any) => {
    if (!org?.acfOrganisatieGegevens?.hipsy?.apiKey) return;
    const hipsy = org.acfOrganisatieGegevens.hipsy;
    const res = await fetch(
      `https://api.hipsy.nl/v1/organisation/${hipsy.slug}/events?period=upcoming&limit=10`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${hipsy.apiKey}`,
        },
      }
    );
    const data = await res.json();
    const events = data.data.map((event: any) => {
      event.start_time = event.date.slice(0, -1) + "+02:00";
      event.type = "Hipsy";
      event.organisation = org.title;
      return event;
    });
    return events;
  });

  const results = await Promise.all(promises);
  return results.filter((result) => result !== undefined);
}