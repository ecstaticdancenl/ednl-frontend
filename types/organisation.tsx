export type Organisation = {
  id: string;
  title: string;
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
