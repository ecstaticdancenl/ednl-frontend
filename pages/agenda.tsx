import Head from "next/head";
import { Navigation } from "@/components/navigation";
import { Bubbles } from "@/components/bubbles";
import { Footer } from "@/components/footer";
import { Label } from "@/components/label";
import client from "@/apollo-client";
import { gql } from "@apollo/client";
import limit from "@/lib/limit";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { useState } from "react";

function formatDateDutch(dateString: string) {
  const date = new Date(dateString.slice(0, -1) + "+02:00");
  return format(date, "d MMMM yyyy 'om' HH:mm", { locale: nl });
}

function sortEventsByDate(events: any[]) {
  return events.sort((a, b) => {
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);
    return dateA.getTime() - dateB.getTime();
  });
}

async function getEventsFromHipsy(organisations: any) {
  const promises = organisations.map(async (org: any) => {
    if (!org?.acfOrganisatieGegevens?.hipsy?.apiKey) return;
    const hipsy = org.acfOrganisatieGegevens.hipsy;
    const res = await fetch(
      `https://api.hipsy.nl/v1/organisation/${hipsy.slug}/events?period=upcoming&limit=10`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${hipsy.apiKey}`,
        },
      }
    );
    const data = await res.json();
    const events = data.data.map((event: any) => {
      event.organisation = org.title;
      return event;
    });
    return events;
  });

  const results = await Promise.all(promises);
  return results.filter((result) => result !== undefined);
}

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
  const itemsPerPage = 6;
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
          "lg:px-10 px-6 mt-4 mb-16 mx-auto flex flex-col w-2/3 gap-2 justify-start items-center grow"
        }
      >
        {events.slice(0, page * itemsPerPage).map((event: any) => (
          <a
            href={event.url_hipsy}
            target={"_blank"}
            rel={"noreferrer"}
            key={event.id}
            className={
              "w-full group bg-white/5 shadow rounded-md transition-colors hover:bg-white/10 transition-colors flex gap-3 items-center p-1.5 relative"
            }
          >
            <img
              className={"w-24 h-16 rounded object-cover"}
              src={event.picture_small}
              alt={event.title}
            />
            <div className={"flex flex-col"}>
              <Label className={"text-xs"}>{event.organisation}</Label>
              <h4>{event.title}</h4>
              <div className={"text-base text-white/60"}>
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
