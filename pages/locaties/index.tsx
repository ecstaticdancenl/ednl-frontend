import client from "@/apollo-client";
import { gql } from "@apollo/client";
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
                lonlat                
              }
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      organisations: data.organisations,
    },
  };
}

type AppProps = {
  className: string;
  organisations: { nodes: [] };
};

export default function LocatiesIndex({ organisations }: AppProps) {
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
      <Locaties blobs={false} organisations={organisations} />
      <Footer />
    </>
  );
}
