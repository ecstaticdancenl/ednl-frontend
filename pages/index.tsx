import Head from "next/head";
import { gql } from "@apollo/client";
import client from "../apollo-client";
import { Navigation } from "@/components/navigation";
import { Bubbles } from "@/components/bubbles";
import { HomeImages } from "@/components/homeImages";
import { HomeIntroductie } from "@/components/homeIntroductie";
import { HomeHeader } from "@/components/homeHeader";
import { MapWrapper } from "@/components/mapWrapper";
import { Label } from "@/components/label";
import { Address } from "@/types/address";
import { useState } from "react";
import Link from "next/link";

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
  const addressesJSON = await getAddresses(data.organisations.nodes);

  return {
    props: {
      organisations: data.organisations,
      addresses: Object.fromEntries(addressesJSON),
    },
  };
}

async function getAddresses(organisations: Organisation[]) {
  return Promise.all(
    organisations.map(async (org: Organisation) => {
      // If there are no locations, return an empty array
      if (!org.acfOrganisatieGegevens.locaties) return [org.id, []];

      //   Get addresses and long lat coordinates from Nominatim
      const addresses = await Promise.all(
        org.acfOrganisatieGegevens.locaties.map(async (loc: any) => {
          const adres = loc.adres.replaceAll(/\r|\n/g, "+");
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${adres}&format=json&addressdetails=1`
          );
          const json = await res.json();
          const obj: Address = {
            organisation: org.title,
            naam: loc.naam,
            adres: loc.adres,
            json: json[0],
          };
          return obj;
        })
      );
      return [org.id, addresses];
    })
  );
}

type AppProps = {
  className: string;
  organisations: { nodes: [] };
  addresses: [];
};

type Organisation = {
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

export default function Home({ organisations, addresses }: AppProps) {
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
      <HomeHeader />
      <HomeImages />
      <HomeIntroductie />

      <div className={"relative mt-48"}>
        <Bubbles flipped className={"top-20"} />
        <section
          className={
            "lg:px-12 px-6 flex flex-col items-center gap-4 relative -top-12"
          }
        >
          <Label>Locaties</Label>
          <h2 className={"-mt-3"}>Waar kan je dansen?</h2>
          <input
            className={"bg-white/10 rounded-md p-2 "}
            type="text"
            placeholder={"Zoek locatie"}
            onChange={(e) => setMapFilter(e.target.value)}
            value={mapFilter}
          />
          <div className={"mt-3 w-full grid grid-cols-2 gap-8"}>
            <MapWrapper
              filter={mapFilter}
              addresses={addresses}
              organisations={organisations}
            />
            <div>
              {organisations.nodes.map((org: Organisation, index) => {
                if (mapFilter !== "") {
                  if (
                    !org.title
                      .toLowerCase()
                      .includes(mapFilter.toLowerCase()) &&
                    !org.acfOrganisatieGegevens.locaties?.some((loc: any) =>
                      loc.naam.toLowerCase().includes(mapFilter.toLowerCase())
                    )
                  ) {
                    return;
                  }
                }
                return (
                  <div className={"pb-4"} key={index}>
                    <Link href={"/"} className={"group flex justify-between"}>
                      <h4 className={"group-hover:underline"}>{org.title}</h4>
                      <span
                        className={
                          "opacity-10 group-hover:opacity-50 transition-opacity"
                        }
                      >
                        →
                      </span>
                    </Link>
                    {!org.acfOrganisatieGegevens.locaties && (
                      <p className={"text-sm p-2"}>
                        Op dit moment geen locatie
                      </p>
                    )}
                    {org.acfOrganisatieGegevens.locaties?.map((loc: any) => {
                      return (
                        <div
                          className={"text-sm p-1 flex gap-2 items-start"}
                          key={loc.naam}
                        >
                          <img
                            src="marker_light.svg"
                            className={"opacity-50"}
                            alt=""
                          />
                          <div className={"flex flex-col gap-1"}>
                            <p>{loc.naam}</p>
                            <p
                              className={
                                "text-xs font-light text-white/60 whitespace-pre-wrap"
                              }
                            >
                              {loc.adres}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
      <section className={"py-56"}>Aankomende dansen</section>

      {/*<section>*/}
      {/*  {organisations.nodes.map((org: Organisation, index) => {*/}
      {/*    return <div key={index}>{org.title}</div>;*/}
      {/*  })}*/}
      {/*</section>*/}
    </>
  );
}
