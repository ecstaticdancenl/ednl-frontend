export interface Organisation {
  content: string;
  id: string;
  title: string;
  slug: string;
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  };
  acfOrganisatieGegevens: {
    email: string;
    website: string;
    locaties: Array<{
      naam: string;
      adres: string;
      over: string;
      lonlat: string | null;
    }>;
    social_media?: Array<{
      platform: "facebook" | "instagram" | "linkedin" | "hipsy" | "nieuwsbrief";
      link: string;
    }>;
    hipsy?: {
      slug: string;
      apiKey: string;
      actief: boolean;
    };
  };
}
