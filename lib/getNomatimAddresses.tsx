import { Organisation } from "@/types/organisation";
import { Address } from "@/types/address";

export async function getNomatimAddresses(organisations: Organisation[]) {
  return Promise.all(
    organisations.map(async (org: Organisation) => {
      // If there are no locations, return an empty array
      if (!org.acfOrganisatieGegevens.locaties) return [org.id, []];
      const hasMultipleLocations =
        org.acfOrganisatieGegevens.locaties.length > 1;

      //   Get addresses and long lat coordinates from Nominatim
      const addresses = await Promise.all(
        org.acfOrganisatieGegevens.locaties.map(async (loc: any) => {
          if (!loc.adres) return null;
          const adres = loc.adres.replaceAll(/\r|\n/g, "+");
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${adres}&format=json&addressdetails=1`
          );
          const json = await res.json();
          const obj: Address = {
            organisation: org.title,
            naam: loc.naam,
            adres: loc.adres,
            json: json[0],
            hasMultipleLocations,
          };
          return obj;
        })
      );
      return [org.id, addresses];
    })
  );
}
