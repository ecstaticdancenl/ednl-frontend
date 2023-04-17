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

export async function getAddresses(organisations: Organisation[]) {
  // console.log("is development: " + process.env.NODE_ENV);
  const cache = require("memory-cache");
  const addressesCache = cache.get("addresses");
  let addressesObj;
  if (!addressesCache) {
    console.log("no cache, fetchin results");
    const addressesJSON = await getAddressesFromAPI(organisations);
    addressesObj = Object.fromEntries(addressesJSON);
    cache.put("addresses", addressesObj, 1000 * 60 * 30);
  } else {
    console.log("using cached data");
    addressesObj = addressesCache;
  }
  return addressesObj;
}

export async function getCachedAddresses() {
  const cache = require("memory-cache");
  const addressesCache = cache.get("addresses");
  let addressesObj;
  if (!addressesCache) {
    addressesObj = null;
  } else {
    addressesObj = addressesCache;
  }
  return addressesObj;
}

export async function getAddressesFromAPI(organisations: Organisation[]) {
  const addresses = [];
  let i = 0;
  for (const org of organisations) {
    // Loop through all locations
    const orgAddresses = [];

    // If there are no locations, return an empty array
    if (!org.acfOrganisatieGegevens.locaties) continue;

    // Check if there are multiple locations
    const hasMultipleLocations = org.acfOrganisatieGegevens.locaties.length > 1;

    for (const loc of org.acfOrganisatieGegevens.locaties) {
      if (!loc.adres) continue;
      const adres = loc.adres
        .replaceAll(/\r|\n/g, "+")
        .replace(/\b\d{4}\s?[a-zA-Z]{2}\b/, (match) => {
          return match.replace(/\s/g, "");
        });
      console.log("fetching " + i + ": " + org.title);
      console.log(`${queryPath}${adres}`);
      const res = await fetch(`${queryPath}${adres}`);
      const json = await res.json();
      // let json: any;
      i = i + 1;
      const obj: Address = {
        organisation: org.title,
        naam: loc.naam,
        adres: loc.adres,
        json: json?.length > 0 ? json[0] : null,
        hasMultipleLocations,
      };
      orgAddresses.push(obj);
      await delay(500); // Add a delay of 500ms after each request.
    }
    addresses.push([org.id, orgAddresses]);
  }
  return addresses;
}
