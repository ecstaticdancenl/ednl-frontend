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
    locaties: [
      {
        naam: string;
        adres: string;
        adresPlain: string;
        over: string;
      }
    ];
  };
}
