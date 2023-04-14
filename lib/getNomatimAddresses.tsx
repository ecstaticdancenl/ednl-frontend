import { Organisation } from "@/types/organisation";
import { Address } from "@/types/address";

/* Geokeo */
// const queryPath = "https://geokeo.com/geocode/v1/search.php?q=";
// &api=${key}

/* Geocode Maps.co */
const queryPath = "https://geocode.maps.co/search?q=";

/* Nomatim */
// const queryPath = "https://nominatim.openstreetmap.org/search?q=";

// TODO: delay function is not working
// const delay = (t: number) => new Promise((resolve) => setTimeout(resolve, t));
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); // Define a delay function that returns a Promise that resolves after the given delay in milliseconds.

export async function getNomatimAddresses(organisations: Organisation[]) {
  return Promise.all(
    organisations.map(async (org: Organisation) => {
      // If there are no locations, return an empty array
      if (!org.acfOrganisatieGegevens.locaties) return [org.id, [{}]];
      const hasMultipleLocations =
        org.acfOrganisatieGegevens.locaties.length > 1;

      const addresses = [];
      let index = 0;
      for (const loc of org.acfOrganisatieGegevens.locaties) {
        console.log("query " + index);
        index++;
        if (!loc.adres) continue;
        const adres = loc.adres.replaceAll(/\r|\n/g, "+");
        const res = await fetch(`${queryPath}${adres}`);
        const json = await res.json();
        const obj: Address = {
          organisation: org.title,
          naam: loc.naam,
          adres: loc.adres,
          json: json?.length > 0 ? json[0] : null,
          hasMultipleLocations,
        };
        addresses.push(obj);
        await delay(2500); // Add a delay of 500ms after each request.
      }

      // const addresses = await Promise.all(
      //   org.acfOrganisatieGegevens.locaties.map(async (loc: any, index) => {
      //     if (!loc.adres) return null;
      //     const adres = loc.adres.replaceAll(/\r|\n/g, "+");
      //     const res = await fetch(`${queryPath}${adres}`);
      //     const json = await res.json();
      //     console.log(json);
      //     const obj: Address = {
      //       organisation: org.title,
      //       naam: loc.naam,
      //       adres: loc.adres,
      //       json: json?.length > 0 ? json[0] : null,
      //       hasMultipleLocations,
      //     };
      //     await delay(500); // Add a delay of 500ms before returning the result.
      //     return obj;
      //   })
      // );

      // TODO: Alternative function with for loop
      // Get addresses and long lat coordinates from Nominatim
      // const acfLocs = org.acfOrganisatieGegevens.locaties;
      // const addresses = [];
      //
      // for (const loc in acfLocs) {
      //   if (!acfLocs[loc].adres) return null;
      //   const adres = acfLocs[loc].adres
      //     .replaceAll(/\r|\n/g, "+")
      //     .replace(/\b\d{4}\s?[a-zA-Z]{2}\b/, (match) => {
      //       return match.replace(/\s/g, "");
      //     });
      //   // TODO: Delay requests to avoid 429
      //   // await delay(500 * parseInt(loc));
      //   // console.log(Date.now());
      //   // // await delay(505);
      //   const res = await fetch(`${queryPath}${adres}`);
      //   console.log(`${queryPath}${adres}`);
      //   const json = await res.json();
      //   console.log(json.length);
      //   const obj: Address = {
      //     organisation: org.title,
      //     naam: acfLocs[loc].naam,
      //     adres: acfLocs[loc].adres,
      //     json: json.length > 0 ? json[0] : null,
      //     hasMultipleLocations,
      //   };
      //   addresses.push(obj);
      // }
      return [org.id, addresses];
    })
  );
}
