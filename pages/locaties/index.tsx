import client from "@/apollo-client";
import { gql } from "@apollo/client";
import { getNomatimAddresses } from "@/lib/getNomatimAddresses";
import { useState } from "react";
import Head from "next/head";
import { Navigation } from "@/components/navigation";
import { Bubbles } from "@/components/bubbles";
import { HomeHeader } from "@/components/homeHeader";
import { HomeImages } from "@/components/homeImages";
import { HomeIntroductie } from "@/components/homeIntroductie";
import { Locaties } from "@/components/locaties";
import { Footer } from "@/components/footer";

export async function getStaticProps() {
  //    Get data from WordPress
  const { data } = await client.query({
    query: gql`
      query {
        organisations(where: { orderby: { field: TITLE, order: ASC } }) {
          nodes {
            id
            title
            slug
            acfOrganisatieGegevens {
              email
              locaties {
                naam
                adres
              }
            }
          }
        }
      }
    `,
  });
  //   Get addresses and long lat coordinates from Nominatim
  const addressesJSON = await getNomatimAddresses(data.organisations.nodes);

  return {
    props: {
      organisations: data.organisations,
      addresses: Object.fromEntries(addressesJSON),
    },
  };
}

type AppProps = {
  className: string;
  organisations: { nodes: [] };
  addresses: [];
};

export default function LocatiesIndex({ organisations, addresses }: AppProps) {
  const [mapFilter, setMapFilter] = useState<string>("");
  return (
    <>
      <Head>
        <title>Ecstatic Dance Nederland</title>
        <meta
          name="description"
          content="Een vrije dansvorm op blote voeten zonder woorden, alcohol of drugs"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navigation />
      <Bubbles />
      <Locaties
        blobs={false}
        addresses={addresses}
        organisations={organisations}
      />
      <Footer />
    </>
  );
}
