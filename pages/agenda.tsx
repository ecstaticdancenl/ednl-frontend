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
import { formatHipsyAddress } from "@/lib/formatHipsyAddress";
import { EventItem } from "@/components/eventItem";
import { getEventsFromFacebook } from "@/lib/getEventsFromFacebook";

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

  const eventsFacebook = await getEventsFromFacebook();
  const eventsHipsy = await getEventsFromHipsy(data.organisations.nodes);
  const events = sortEventsByDate([...eventsFacebook, ...eventsHipsy.flat(1)]);

  return {
    props: {
      organisations: data.organisations,
      events: events,
    },
  };
}

type AppProps = {
  className: string;
  organisations: { nodes: [] };
  events: any;
  dataFacebook: any;
};

export default function Agenda({ organisations, events }: AppProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
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
        {events.slice(0, page * itemsPerPage).map((event: any) => {
          if (event.type === "Facebook") {
            return (
              <EventItem
                key={event.id}
                url={
                  event.ticket_uri
                    ? event.ticket_uri
                    : `https://www.facebook.com/events/${event.id}`
                }
                img={event.cover.source}
                label={
                  event?.place?.name
                    ? event?.place?.name +
                      (event?.place?.location?.city
                        ? ", " + event?.place?.location?.city
                        : "")
                    : "facebook event"
                }
                title={event.name}
                date={formatDateDutch(event.start_time, false)}
              />
            );
          }
          if (event.type === "Hipsy") {
            return (
              <EventItem
                key={event.id}
                type={"Hipsy"}
                url={event.url_hipsy}
                img={event.picture_small}
                label={formatHipsyAddress(event.location)}
                title={event.title}
                date={formatDateDutch(event.date, false)}
              />
            );
          }
        })}
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
            Hipsy API
          </a>{" "}
          en{" "}
          <a
            className={"underline hover:text-rose-200"}
            href={"https://www.facebook.com/EDNederland"}
            target={"_blank"}
            rel={"noreferrer"}
          >
            Facebook pagina van ED NL
          </a>
          . Jouw event op deze agenda?{" "}
          <a
            href={"mailto:info@ecstaticdance.nl"}
            target={"_blank"}
            rel={"noreferrer"}
            className={"underline hover:text-rose-200"}
          >
            Neem contact op
          </a>
          . Andere integraties (zoals Chipta) zijn nog niet mogelijk, omdat deze
          geen API hebben.
        </p>
      </section>
      <Footer />
    </>
  );
}
