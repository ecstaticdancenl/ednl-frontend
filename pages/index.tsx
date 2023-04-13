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
      const hasMultipleLocations =
        org.acfOrganisatieGegevens.locaties.length > 1;

      //   Get addresses and long lat coordinates from Nominatim
      const addresses = await Promise.all(
        org.acfOrganisatieGegevens.locaties.map(async (loc: any) => {
          if (!loc.adres) return null;
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
            hasMultipleLocations,
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
            "lg:px-10 px-6 flex flex-col items-center gap-4 relative -top-12"
          }
        >
          <Label>Locaties</Label>
          <h2 className={"-mt-3"}>Waar kan je dansen?</h2>
          <div className={"relative shadow"}>
            <input
              className={
                "bg-white/10 rounded-md hover:bg-white/20 py-2 px-4 placeholder-white/50 transition-colors w-72"
              }
              type="text"
              placeholder={"Vind een plek..."}
              onChange={(e) => setMapFilter(e.target.value)}
              value={mapFilter}
            />
            <button
              className={
                "absolute rounded-md right-0 h-full px-4 hover:bg-white/20 text-2xl"
              }
              onClick={() => setMapFilter("")}
            >
              &times;
            </button>
          </div>
          <div
            className={
              "mt-1 w-full grid grid-cols-1 md:grid-cols-2 lg:gap-6 gap-2"
            }
          >
            <MapWrapper
              filter={mapFilter}
              addresses={addresses}
              organisations={organisations}
            />
            <div className={"flex flex-col gap-2"}>
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
                  <Link
                    key={index}
                    href={"/"}
                    className={
                      "group bg-white/5 shadow rounded-md hover:bg-white/10 transition-colors duration-250 block pt-2.5 pb-3 px-3.5 relative"
                    }
                  >
                    <h4 className={"mb-1.5"}>{org.title}</h4>
                    <div
                      className={"my-0.5 grid lg:grid-cols-2 grid-cols-1 gap-2"}
                    >
                      {!org.acfOrganisatieGegevens.locaties && (
                        <p className={"text-sm"}>Op dit moment geen locatie</p>
                      )}
                      {org.acfOrganisatieGegevens.locaties?.map((loc: any) => {
                        return (
                          <div
                            className={"text-sm px-2 flex gap-2 items-start"}
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
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
      <footer
        className={
          "bg-blue-gray py-12 grid grid-cols-3 px-10 text-blue-950 gap-12"
        }
      >
        <div>
          <h4 className={"opacity-50"}>Over deze site</h4>
          <p className={"mt-2 text-sm"}>
            Deze is site is ontwikkeld zonder commercieel verdienmodel, uit
            liefde voor Ecstatic Dance.
            <br />♡
          </p>
        </div>
        <div className={"text-center"}>
          <h4 className={"opacity-50"}>Dank aan</h4>
          <ul className={"mt-2 text-sm"}>
            <li>
              Hosting en beheer door <a href="#">Ramon</a>
            </li>
            <li>
              Code door <a href="#">Sefrijn</a> van{" "}
              <a href="#">How About Yes</a>
            </li>
            <li>
              Foto’s door <a href="#">Ilse Wolf</a>
            </li>
          </ul>
        </div>

        <div className={"text-right"}>
          <h4 className={"opacity-50"}>Contact</h4>

          <h3>
            <a href="mailto:info@ecstaticdance.nl">info@ecstaticdance.nl</a>
          </h3>
        </div>
      </footer>
    </>
  );
}
