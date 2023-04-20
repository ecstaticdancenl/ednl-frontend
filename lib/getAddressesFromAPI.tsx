import { Organisation } from "@/types/organisation";
import { Address } from "@/types/address";

/* Geokeo */
// const queryPath = "https://geokeo.com/geocode/v1/search.php?q=";
// &api=${key}

/* Geocode Maps.co */
const queryPath = "https://geocode.maps.co/search?q=";

/* Nomatim */
// const queryPath = "https://nominatim.openstreetmap.org/search?q=";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); // Define a delay function that returns a Promise that resolves after the given delay in milliseconds.

export function getAddressesFromWP(organisations: Organisation[]) {
  const addresses = [];
  let i = 0;
  for (const org of organisations) {
    // Loop through all locations
    const orgAddresses = [];

    // If there are no locations, return an empty array
    if (!org?.acfOrganisatieGegevens?.locaties) continue;

    // Check if there are multiple locations
    const hasMultipleLocations = org.acfOrganisatieGegevens.locaties.length > 1;

    for (const loc of org.acfOrganisatieGegevens.locaties) {
      if (!loc.adres) continue;
      i = i + 1;
      const obj: Address = {
        organisation: org.title,
        naam: loc.naam,
        adres: loc.adres,
        lonlat: loc.lonlat,
        hasMultipleLocations,
      };
      orgAddresses.push(obj);
    }
    addresses.push([org.id, orgAddresses]);
  }
  return Object.fromEntries(addresses);
}
