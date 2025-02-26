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
    if (res.status !== 200) {
      console.log(
        `Status error from Hipsy API with ${org.title}:
        Status: ${res.status}
        StatusText: ${res.statusText}`
      );
      return undefined;
    }
    // Check if the response is a valid json
    try {
      const responseText = await res.text(); // First get the raw response
      try {
        const data = JSON.parse(responseText); // Then try to parse it as JSON
        if (data.message) {
          console.log(
            `\nData message from Hipsy API with ${org.title}:\n${data.message}`
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
        return events.filter(
          (t: any) =>
            t.title.toLowerCase().includes("ecstatic") || t.title.includes("ED")
        );
      } catch (error) {
        console.log(
          `\nJSON parse error from Hipsy API with ${org.title}:\n${error} \n${hipsy.slug}`
        );
        return undefined;
      }
    } catch (error) {
      console.log(
        `\nResponse text error from Hipsy API with ${org.title}:\n${error}`
      );
      return undefined;
    }
  });

  const results = await Promise.all(promises);
  return results.filter((result) => result !== undefined);
}
