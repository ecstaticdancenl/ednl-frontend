export async function getEventsFromHipsy(organisations: any) {
  const promises = organisations.map(async (org: any) => {
    if (org?.acfOrganisatieGegevens?.hipsy?.apiKey) {
      console.log(
        "Get Hipsy events - " +
          org.title +
          " - " +
          (org?.acfOrganisatieGegevens?.hipsy?.actief ? "Actief" : "Inactief")
      );
    }
    if (
      !org?.acfOrganisatieGegevens?.hipsy?.apiKey ||
      !org?.acfOrganisatieGegevens?.hipsy?.actief ||
      !org?.title
    )
      return;
    const hipsy = org.acfOrganisatieGegevens.hipsy;
    const res = await fetch(
      `https://api.hipsy.nl/v1/organisation/${hipsy.slug}/events?period=upcoming&limit=5`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${hipsy.apiKey}`,
        },
      }
    );
    const data = await res.json();
    if (data.message) {
      console.log(
        `\nGot an error from Hipsy API with ${org.title}:\n${data.message}`
      );
      return undefined;
    }
    if (!data.data) return;
    const events = data.data.map((event: any) => {
      event.start_time = event.date;
      event.type = "Hipsy";
      event.organisation = org.title;
      return event;
    });
    return events.filter((t: any) => t.title.toLowerCase().includes('ecstatic') || t.title.includes('ED'));
  });

  const results = await Promise.all(promises);
  return results.filter((result) => result !== undefined);
}
