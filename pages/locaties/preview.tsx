import { fetchOrganisationBySlug, TransformedOrganisation } from "@/fetch";
import { useEffect, useState } from "react";
import loading from "@/public/dancing.json";
import dynamic from "next/dynamic";

// `[locatie]` (and its map dependencies) rely on browser-only globals in places,
// so we must not import it during SSR / static generation.
const Locatie = dynamic(() => import("./[locatie]"), { ssr: false });

// `react-lottie` touches `document` at import-time; load it client-side only.
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

type AppProps = {
  organisation: TransformedOrganisation;
};

async function getDynamicProps(slug: string): Promise<AppProps | null> {
  //    Get data from WordPress REST API
  const organisation = await fetchOrganisationBySlug(slug);

  if (!organisation) {
    return null;
  }

  return {
    organisation: organisation,
  };
}

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
