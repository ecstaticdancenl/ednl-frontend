import client from "@/apollo-client";
import { gql } from "@apollo/client";
import { getAddressesFromWP } from "@/lib/getAddressesFromAPI";
import Head from "next/head";
import { Navigation } from "@/components/navigation";
import { Bubbles } from "@/components/bubbles";
import { Footer } from "@/components/footer";
import { Organisation } from "@/types/organisation";
import basepath from "@/lib/basepath";
import { Label } from "@/components/label";
import { OrgHeader } from "@/components/orgHeader";
import { MapWrapper } from "@/components/mapWrapper";
import { Address } from "@/types/address";
import ExtURL from "@/components/extURL";
import limit from "@/lib/limit";

export async function getStaticProps({ params }: any) {
  //    Get data from WordPress
  const { data } = await client.query({
    query: gql`
      query{
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
              lonlat              
            }
          }
        }
      }
    `,
  });

  const addresses = getAddressesFromWP([data.organisation]);

  return {
    props: {
      locatie: params.locatie,
      organisation: data.organisation,
      addresses: addresses,
    },
  };
}

export async function getStaticPaths() {
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
  className?: string;
  organisation: Organisation;
};

export default function Locatie({ organisation }: AppProps) {
  const pageTitle = `${organisation.title} | Ecstatic Dance in Nederland`;
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="Een vrije dansvorm op blote voeten zonder woorden, alcohol of drugs"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navigation />
      <Bubbles />
      <OrgHeader organisation={organisation} />
      <div
        className={
          "w-full grid grid-cols-1 lg:grid-cols-3 lg:gap-8 my-10 gap-y-8 lg:px-10 sm:px-6 px-4"
        }
      >
        <div className={"lg:sticky top-12 self-start lg:mb-6"}>
          <Label className={"mb-4"}>
            Locatie
            {organisation.acfOrganisatieGegevens.locaties?.length > 1 && "s"}
          </Label>
          <div
            className={
              "gap-2 mb-2 flex lg:flex-col sm:flex-row flex-col justify-center lg:items-center items-stretch md:items-start mx-auto relative z-10"
            }
          >
            {!organisation.acfOrganisatieGegevens.locaties?.[0]?.naam && (
              <p className={"text-sm w-full text-left"}>
                Op dit moment geen locatie
              </p>
            )}
            {organisation.acfOrganisatieGegevens.locaties?.[0]?.naam &&
              organisation.acfOrganisatieGegevens.locaties?.map((loc: any) => {
                if (!loc.adres) return null;
                return (
                  <a
                    href={`https://www.google.com/maps/search/${loc.adres.replaceAll(
                      /\r|\n/g,
                      "%20"
                    )}`}
                    target={"_blank"}
                    rel={"noreferrer"}
                    className={[
                      "w-full text-base p-3 rounded-md flex gap-2 items-start bg-white/5 hover:bg-white/20 transition-colors col-span-2 relative group",
                    ].join(" ")}
                    key={loc.naam}
                  >
                    <div
                      className={
                        "flex items-center gap-1 absolute right-4 top-3.5 group-hover:opacity-60 opacity-0 transition-opacity text-sm"
                      }
                    >
                      <span>Navigeer</span>
                      <ExtURL className={"w-3 h-3"} />
                    </div>
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
                            "text-xs font-light text-white/40 whitespace-pre-wrap self-start"
                          }
                        >
                          {loc.over}
                        </p>
                      )}
                    </div>
                  </a>
                );
              })}
          </div>
          {organisation.acfOrganisatieGegevens.locaties?.[0]?.naam && (
            <MapWrapper
              setFilter={null}
              organisations={[organisation]}
              customExtent
              className={"lg:h-96 h-72 col-span-2"}
            />
          )}
        </div>
        <main className={"col-span-2"}>
          <Label>Over {organisation.title}</Label>
          {organisation.content && (
            <div dangerouslySetInnerHTML={{ __html: organisation.content }} />
          )}
          {!organisation.content && (
            <p className={"text-sm"}>Op dit moment geen informatie</p>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}
