import client from "@/apollo-client";
import { gql } from "@apollo/client";
import { getNomatimAddresses } from "@/lib/getNomatimAddresses";
import Head from "next/head";
import { Navigation } from "@/components/navigation";
import { Bubbles } from "@/components/bubbles";
import { HomeHeader } from "@/components/homeHeader";
import { HomeImages } from "@/components/homeImages";
import { HomeIntroductie } from "@/components/homeIntroductie";
import { Locaties } from "@/components/locaties";
import { Footer } from "@/components/footer";
import { Organisation } from "@/types/organisation";

export async function getStaticProps({ params }: any) {
  //    Get data from WordPress
  const { data } = await client.query({
    query: gql`
      query {
        organisation(id: "${params.locatie}", idType: SLUG) {
          id
          title
          content
          featuredImage {
            node {
              sourceUrl
            }
          }
          slug
          acfOrganisatieGegevens {
            email
            fieldGroupName
          }
        }
      }
    `,
  });
  //   Get addresses and long lat coordinates from Nominatim
  const addressesJSON = await getNomatimAddresses([data.organisation]);

  return {
    props: {
      locatie: params.locatie,
      organisation: data.organisation,
      addresses: Object.fromEntries(addressesJSON),
    },
  };
}

export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query {
        organisations(where: { orderby: { field: TITLE, order: ASC } }) {
          nodes {
            id
            title
            slug
          }
        }
      }
    `,
  });

  const paths = data.organisations.nodes.map((organisation: any) => ({
    params: { locatie: organisation.slug },
  }));

  return { paths, fallback: false };
}

type AppProps = {
  className: string;
  organisation: Organisation;
  addresses: [];
};

export default function Locatie({ organisation, addresses }: AppProps) {
  console.log(organisation);
  return (
    <>
      <Head>
        <title>{organisation.title} | Ecstatic Dance in Nederland</title>
        <meta
          name="description"
          content="Een vrije dansvorm op blote voeten zonder woorden, alcohol of drugs"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navigation />
      <Bubbles />
      <div className="relative h-[50vh] z-10 px-10">
        {organisation.featuredImage && (
          <img
            className={"object-cover w-full h-full absolute rounded-md"}
            src={organisation.featuredImage.node.sourceUrl}
            alt=""
          />
        )}
        <div
          className={
            "rounded-md bg-blue-900/30 relative z-10 w-full h-full flex flex-col items-center justify-center text-center"
          }
        >
          <h1>{organisation.title}</h1>
        </div>
      </div>
      <section className={"container mx-auto py-24 max-w-prose"}>
        <div dangerouslySetInnerHTML={{ __html: organisation.content }} />
      </section>
      <Footer />
    </>
  );
}
