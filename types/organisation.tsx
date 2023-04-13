export type Organisation = {
  id: string;
  title: string;
  slug: string;
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  };
  acfOrganisatieGegevens: {
    locaties: [
      {
        naam: string;
        adres: string;
        adresPlain: string;
      }
    ];
  };
};
