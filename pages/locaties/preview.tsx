import client from "@/apollo-client";
import { gql } from "@apollo/client";
import { getAddressesFromWP } from "@/lib/getAddressesFromAPI";
import { Organisation } from "@/types/organisation";
import { Address } from "@/types/address";
import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import loading from "@/public/dancing.json";
import Locatie from "@/pages/locaties/[locatie]";

async function getDynamicProps(slug: string) {
  //    Get data from WordPress
  const { data } = await client.query({
    query: gql`
      query{
        organisation(id: "${slug}", idType: SLUG) {
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

  return {
    organisation: data.organisation,
  };
}

type AppProps = {
  organisation: Organisation;
};

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loading,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function Preview() {
  const [data, setData] = useState<AppProps | null>(null);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const { slug } = Object.fromEntries(urlSearchParams.entries());
    console.log(slug);

    if (slug) {
      getDynamicProps("" + slug).then((data) => {
        setData(data);
      });
    }
  }, []);

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  if (data) {
    return (
      <>
        <Locatie organisation={data.organisation} />
      </>
    );
  }
  return (
    <div
      className={
        "-mt-24 h-screen cursor-default pointer-events-none flex flex-col items-center justify-center"
      }
    >
      <div className={"w-48"}>
        <Lottie isClickToPauseDisabled={true} options={defaultOptions} />
      </div>
      <p>Pagina wordt geladen... Doe een dansje</p>
    </div>
  );
}
