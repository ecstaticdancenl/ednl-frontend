/**
 * WordPress REST API Type Definitions
 * Based on WordPress REST API structure and ACF field definitions
 */

// Base WordPress REST API types
export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      id: number;
      date: string;
      slug: string;
      type: string;
      link: string;
      title: {
        rendered: string;
      };
      source_url: string;
      media_details: {
        width: number;
        height: number;
        file: string;
      };
    }>;
  };
}

// ACF Field Types based on ACF JSON definitions

// Raw ACF fields as returned by WordPress REST API (snake_case)
export interface ACFHipsyRaw {
  slug: string;
  api_key: string;
  actief: boolean;
}

export interface ACFLocatie {
  naam: string;
  adres: string;
  over: string;
  lonlat: string | null;
}

export interface ACFSocialMedia {
  platform: "facebook" | "instagram" | "linkedin" | "hipsy" | "nieuwsbrief";
  link: string;
}

// Raw ACF fields as returned by WordPress REST API (snake_case)
export interface ACFOrganisatieGegevensRaw {
  website: string;
  email: string;
  locaties: ACFLocatie[];
  social_media?: ACFSocialMedia[];
  hipsy?: ACFHipsyRaw;
}

// Transformed ACF fields for component usage (camelCase)
export interface ACFHipsy {
  slug: string;
  apiKey: string;
  actief: boolean;
}

export interface ACFOrganisatieGegevens {
  website: string;
  email: string;
  locaties: ACFLocatie[];
  social_media?: ACFSocialMedia[];
  hipsy?: ACFHipsy;
}

export interface ACFWanneer {
  start: string; // Format: Ymd (e.g., "20240115")
  einde: string; // Format: Ymd
}

// Raw ACF fields as returned by WordPress REST API (snake_case)
export interface ACFEventInfoRaw {
  soort_event: "festival" | "retraite" | "training";
  subtitel?: string;
  wanneer: ACFWanneer;
  locatie_naam: string;
  adres?: string;
  ticket_link: string;
}

// Transformed ACF fields for component usage (camelCase)
export interface ACFEventInfo {
  soortEvent: "festival" | "retraite" | "training";
  subtitel?: string;
  wanneer: ACFWanneer;
  locatieNaam: string;
  adres?: string;
  ticketLink: string;
}

// WordPress REST API Response with ACF
export interface WordPressPostWithACF<
  T = Record<string, unknown>,
> extends WordPressPost {
  acf: T;
}

// Transformed types to match current GraphQL structure (for backward compatibility)
export interface TransformedOrganisation {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  };
  acfOrganisatieGegevens: {
    website: string;
    email: string;
    locaties: ACFLocatie[];
    social_media?: ACFSocialMedia[];
    hipsy?: ACFHipsy;
  };
}

export interface TransformedFestivalRetraite {
  id: string;
  title: string;
  slug: string;
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  };
  eventInfo: ACFEventInfo;
}

export interface TransformedPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  } | null;
}

// Response wrapper types
export interface OrganisationsResponse {
  nodes: TransformedOrganisation[];
}

export interface FestivalsRetraitesResponse {
  nodes: TransformedFestivalRetraite[];
}
