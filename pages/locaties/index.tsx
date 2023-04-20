import client from "@/apollo-client";
import { gql } from "@apollo/client";
import { getAddresses } from "@/lib/getAddressesFromAPI";
import Head from "next/head";
import { Navigation } from "@/components/navigation";
import { Bubbles } from "@/components/bubbles";
import { Locaties } from "@/components/locaties";
import { Footer } from "@/components/footer";
import limit from "@/lib/limit";

export async function getStaticProps() {
  //    Get data from WordPress
  const { data } = await client.query({
    query: gql`
      query {
        organisations(
          first: ${limit}
          where: { orderby: { field: TITLE, order: ASC } }
        ) {
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
  const start = Date.now();
  console.log(`locaties/index.tsx`);
  const addresses = await getAddresses(
    data.organisations.nodes,
    false,
    data.organisations.nodes.length * 1000 * 2
  );
  const millis = Date.now() - start;
  console.log(`locaties/index.tsx: ${millis}ms`);

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

export default function LocatiesIndex({ organisations, addresses }: AppProps) {
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
