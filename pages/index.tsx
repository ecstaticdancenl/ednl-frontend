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

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query {
        organisations {
          nodes {
            id
            title
            slug
            acfOrganisatieGegevens {
              email
              fieldGroupName
              naam
              adres
              telefoon
            }
          }
        }
      }
    `,
  });
  const organisationsWithAddress = data.organisations.nodes.filter(
    (org: Organisation) => org.acfOrganisatieGegevens.adres
  );
  const addresses = organisationsWithAddress.map((org: Organisation) => [
    org.id,
    org.acfOrganisatieGegevens.adres
      .replaceAll(/\n|\r|/g, "")
      .replaceAll(/<br \/>/g, "+")
      .replaceAll(/ /g, "+"),
  ]);

  const addressesJSON = await Promise.all(
    addresses.map(async (address: any) => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${address[1]}&format=json&addressdetails=1`
      );
      const json = await res.json();
      return [address[0], json[0]];
    })
  );

  return {
    props: {
      organisations: data.organisations,
      addresses: Object.fromEntries(addressesJSON),
      // addresses: addresses,
    },
  };
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
    adres: string;
  };
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

      <div className={"relative mt-48"}>
        <Bubbles flipped className={"top-20"} />
        <section
          className={
            "lg:px-12 px-6 flex flex-col items-center gap-4 relative -top-12"
          }
        >
          <Label>Locaties</Label>
          <h2 className={"-mt-3"}>Waar kan je dansen?</h2>
          <div className={"mt-3 w-full grid grid-cols-2 gap-8"}>
            <MapWrapper addresses={addresses} organisations={organisations} />
            <div>
              {organisations.nodes.map((org: Organisation, index) => {
                return <div key={index}>{org.title}</div>;
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
