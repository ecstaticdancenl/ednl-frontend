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

export default function Home({ organisations }: AppProps) {
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
      <Locaties blobs organisations={organisations} />
      <Footer />
    </>
  );
}
