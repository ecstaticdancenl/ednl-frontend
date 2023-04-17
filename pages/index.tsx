import Head from "next/head";
import { gql } from "@apollo/client";
import client from "../apollo-client";
import { Navigation } from "@/components/navigation";
import { Bubbles } from "@/components/bubbles";
import { HomeImages } from "@/components/homeImages";
import { HomeIntroductie } from "@/components/homeIntroductie";
import { HomeHeader } from "@/components/homeHeader";
import { Footer } from "@/components/footer";
import { Locaties } from "@/components/locaties";
import { getAddresses } from "@/lib/getAddressesFromAPI";

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
  //   Get addresses and long lat coordinates from external GEO API
  const addresses = await getAddresses(data.organisations.nodes);

  return {
    props: {
      organisations: data.organisations,
      addresses: addresses,
    },
  };
}

type AppProps = {
  className: string;
  organisations: { nodes: [] };
  addresses: [];
};

export default function Home({ organisations, addresses }: AppProps) {
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
      <HomeHeader />
      <HomeImages />
      <HomeIntroductie />
      <Locaties blobs addresses={addresses} organisations={organisations} />
      <Footer />
    </>
  );
}
