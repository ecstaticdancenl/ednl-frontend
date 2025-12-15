export interface Address {
  organisation: string;
  naam: string;
  adres: string;
  lonlat: string | null;
  hasMultipleLocations: boolean;
  // adresPlain: string;
}
