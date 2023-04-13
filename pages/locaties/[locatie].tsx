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
import basepath from "@/lib/basepath";
import { getHighlightedText } from "@/components/highlightText";
import { Label } from "@/components/label";

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
            website
            locaties {
              naam
              adres
              over
            }
          }
        }
      }
    `,
  });
  //   Get addresses and long lat coordinates from Nominatim
  // const addressesJSON = await getNomatimAddresses([data.organisation]);
  let addressesJSON;

  return {
    props: {
      locatie: params.locatie,
      organisation: data.organisation,
      addresses: addressesJSON ? Object.fromEntries(addressesJSON) : null,
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

function niceURL(url: string) {
  let cleanURL = url
    .replace("http://", "")
    .replace("https://", "")
    .replace("www.", "");
  if (cleanURL.endsWith("/")) {
    cleanURL = cleanURL.slice(0, -1);
  }
  return cleanURL;
}

export default function Locatie({ organisation, addresses }: AppProps) {
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
      <header className="locatie relative h-[50vh] z-10 mx-10">
        {organisation.featuredImage && (
          <img
            className={"object-cover w-full h-full absolute rounded-2xl"}
            src={organisation.featuredImage.node.sourceUrl}
            alt=""
          />
        )}
        <div
          className={
            "rounded-2xl bg-blue-900/30 relative z-10 w-full h-full flex flex-col items-center justify-center text-center"
          }
        >
          <h1>{organisation.title}</h1>
          {organisation.acfOrganisatieGegevens.website && (
            <a
              target={"_blank"}
              href={organisation.acfOrganisatieGegevens.website}
            >
              {niceURL(organisation.acfOrganisatieGegevens.website)}
            </a>
          )}
        </div>
      </header>
      <div className={"my-8 flex flex-col items-center mx-auto relative z-10"}>
        <Label>
          Locatie
          {organisation.acfOrganisatieGegevens.locaties.length > 1 && "s"}
        </Label>
        <div
          className={
            "grid grid-cols-4 mt-2 text-left max-w-screen-sm w-full gap-2"
          }
        >
          {!organisation.acfOrganisatieGegevens.locaties && (
            <p className={"text-sm"}>Op dit moment geen locatie</p>
          )}
          {organisation.acfOrganisatieGegevens.locaties?.map((loc: any) => {
            return (
              <div
                className={[
                  organisation.acfOrganisatieGegevens.locaties.length === 1
                    ? "col-start-2"
                    : "",
                  "text-base p-3 rounded-md flex gap-2 items-start bg-white/5 col-span-2",
                ].join(" ")}
                key={loc.naam}
              >
                <img src={basepath + "/marker_light.svg"} alt="" />
                <div className={"flex flex-col gap-1"}>
                  <p>{loc.naam}</p>
                  <p
                    className={
                      "text-sm font-light text-white/60 whitespace-pre-wrap"
                    }
                  >
                    {loc.adres}
                  </p>
                  {loc.over && (
                    <p
                      className={
                        "border-t-2 border-t-white/5 mt-1 pt-1 text-sm font-light text-white/60 whitespace-pre-wrap self-start"
                      }
                    >
                      {loc.over}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <main className={"container mx-auto my-12 max-w-screen-sm"}>
        {organisation.content && (
          <div dangerouslySetInnerHTML={{ __html: organisation.content }} />
        )}
      </main>
      <Footer />
    </>
  );
}
