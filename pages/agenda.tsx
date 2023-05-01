import Head from "next/head";
import { Navigation } from "@/components/navigation";
import { Bubbles } from "@/components/bubbles";
import { Footer } from "@/components/footer";
import { Label } from "@/components/label";
import client from "@/apollo-client";
import { gql } from "@apollo/client";
import limit from "@/lib/limit";
import { useState } from "react";
import { formatDateDutch } from "@/lib/formatDateDutch";
import { sortEventsByDate } from "@/lib/sortEventsByDate";
import { getEventsFromHipsy } from "@/lib/getEventsFromHipsy";

export async function getStaticProps({ params }: any) {
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
              hipsy {
                slug
                apiKey
              }
            }
          }
        }
      }
    `,
  });

  const events = await getEventsFromHipsy(data.organisations.nodes);

  return {
    props: {
      organisations: data.organisations,
      events: sortEventsByDate(events.flat(1)),
    },
  };
}

type AppProps = {
  className: string;
  organisations: { nodes: [] };
  events: any;
};

export default function Agenda({ organisations, events }: AppProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  return (
    <>
      <Head>
        <title>Agenda | Ecstatic Dance Nederland</title>
        <meta
          name="description"
          content="Een vrije dansvorm op blote voeten zonder woorden, alcohol of drugs"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navigation />
      <Bubbles />
      <header
        className={"text-center sm:pt-8 pt-1 pb-5 mx-5 pointer-events-none"}
      >
        <Label className={"pointer-events-auto"}>Agenda</Label>
        <h2 className="mt-1 pointer-events-auto">
          Aankomende dansen in Nederland
        </h2>
      </header>
      <section
        className={
          "lg:px-10 px-6 mt-4 mb-16 mx-auto flex flex-col lg:w-3/4 xl:w-2/3 gap-2 md:gap-4 justify-start items-center grow"
        }
      >
        {events.slice(0, page * itemsPerPage).map((event: any) => (
          <a
            href={event.url_hipsy}
            target={"_blank"}
            rel={"noreferrer"}
            key={event.id}
            className={
              "w-full group bg-white/5 shadow rounded-md transition-colors hover:bg-white/10 transition-colors flex gap-3 items-center relative"
            }
          >
            <img
              className={"md:w-28 w-24 md:h-20 h-24 rounded object-cover"}
              src={event.picture_small}
              alt={event.title}
            />
            <div className={"flex flex-col p-1 md:p-1"}>
              <Label className={"md:text-xs text-[11px] leading-[1.2]"}>
                {event.organisation}
              </Label>
              <h4>{event.title}</h4>
              <div className={"text-sm md:text-base text-white/60"}>
                {formatDateDutch(event.date)}
              </div>
            </div>
          </a>
        ))}
        {events.length > page * itemsPerPage && (
          <button
            onClick={() => setPage(page + 1)}
            className={[
              "text-base my-5 px-8 py-2 bg-rose-600 uppercase inline-block font-bold tracking-very-wide hover:bg-rose-700",
            ].join(" ")}
          >
            Meer laden
          </button>
        )}
        {events.length === 0 && (
          <p className={"text-center text-white/60"}>
            Er zijn geen aankomende dansen gevonden
          </p>
        )}
        <p
          className={
            "mx-auto mt-10 text-white/40 max-w-prose text-base text-center"
          }
        >
          Events op basis van{" "}
          <a
            className={"underline hover:text-rose-200"}
            href={"https://hipsy.nl"}
            target={"_blank"}
            rel={"noreferrer"}
          >
            Hipsy
          </a>{" "}
          API. Jouw event op deze agenda?{" "}
          <a
            href={"mailto:info@ecstaticdance.nl"}
            target={"_blank"}
            rel={"noreferrer"}
            className={"underline hover:text-rose-200"}
          >
            Neem contact op
          </a>
          . Andere integraties (zoals Chipta of Facebook) zijn niet nog
          mogelijk, omdat deze geen API hebben.
        </p>
      </section>
      <Footer />
    </>
  );
}
