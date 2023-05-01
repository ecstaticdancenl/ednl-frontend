import client from "@/apollo-client";
import { gql } from "@apollo/client";
import limit from "@/lib/limit";
import Head from "next/head";
import { Navigation } from "@/components/navigation";
import { Bubbles } from "@/components/bubbles";
import { Locaties } from "@/components/locaties";
import { Footer } from "@/components/footer";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import Link from "next/link";

export async function getStaticProps() {
  //    Get data from WordPress
  const { data } = await client.query({
    query: gql`
      query {
        festivalsEnRetraites(
          first: ${limit}
        ) {      
            nodes{
              id
              title
              featuredImage{
                node{
                    sourceUrl
                }
              }
              eventInfo{
                soortEvent
                subtitel
                locatieNaam
                adres
                wanneer{
                  start
                  einde
                }
                ticketLink
              }
            }
        }
      }
    `,
  });

  return {
    props: {
      data: data,
    },
  };
}

function niceDate(dateString: string) {
  const year = dateString.substring(0, 4);
  const month = parseInt(dateString.substring(4, 6));
  const day = parseInt(dateString.substring(6, 8));
  const monthNames = [
    "januari",
    "februari",
    "maart",
    "april",
    "mei",
    "juni",
    "juli",
    "augustus",
    "september",
    "oktober",
    "november",
    "december",
  ];
  const monthName = monthNames[month - 1];
  const currentYear = new Date().getFullYear();
  if (dateString.startsWith(currentYear.toString())) {
    return `${day} ${monthName}`;
  } else {
    return `${day} ${monthName} ${year}`;
  }
}

function FestivalItem({ event }: { event: any }) {
  return (
    <a
      href={event.eventInfo.ticketLink}
      key={event.id}
      target={"_blank"}
      rel={"noopener noreferrer"}
      className={
        "w-full lg:w-[calc(50%-1.25rem)] flex flex-col items-center text-center sm:flex-col gap-4 bg-white/5 hover:bg-white/10 transition-colors shadow rounded-2xl group"
      }
    >
      <img
        className={"aspect-[1.8] object-cover rounded-2xl"}
        src={event.featuredImage.node.sourceUrl}
        alt=""
      />
      <div className={"sm:w-3/4"}>
        <Label className={"drop-shadow"}>{event.eventInfo.soortEvent}</Label>
        <h3 className={"text-2xl"}>{event.title}</h3>
        <p className={"text-base text-white/60"}>
          {niceDate(event.eventInfo.wanneer.start)} tot{" "}
          {niceDate(event.eventInfo.wanneer.einde)}
        </p>
        {event.eventInfo.subtitel && (
          <p className={"text-sm"}>{event.eventInfo.subtitel}</p>
        )}
        <hr className={"opacity-10 border-t-2 my-2"} />
        <p className={"text-sm font-medium"}>{event.eventInfo.locatieNaam}</p>
        <p className={"text-xs whitespace-pre-wrap opacity-60"}>
          {event.eventInfo.adres}
        </p>
        <button
          className={
            "bg-rose-600 uppercase inline-block font-bold tracking-very-wide group-hover:bg-rose-500 text-sm px-4 py-1 my-5"
          }
        >
          Info &amp; Tickets
        </button>
      </div>
    </a>
  );
}

export default function Index(props: any) {
  const events = props.data.festivalsEnRetraites.nodes;

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
      <div className={"relative z-10"}>
        <header
          className={
            "lg:px-10 sm:px-6 px-4 text-center sm:pt-8 pt-1 pb-5 mx-5 pointer-events-none grow"
          }
        >
          <Label>Dive Deeper</Label>
          <h2 className="mt-1 pointer-events-auto">Festivals en Retraites</h2>
        </header>
        <p className={"mx-auto max-w-prose text-base text-center"}>
          Meerdaagse bijeenkomsten in Nederland met Ecstatic Dance als centraal
          thema
        </p>
      </div>
      <section
        className={
          "lg:px-10 sm:px-6 px-4 my-16 flex flex-wrap flex-col lg:flex-row w-full gap-10 justify-center grow"
        }
      >
        {events.map((event: any) => (
          <FestivalItem key={event.id} event={event} />
        ))}
      </section>
      <Footer />
    </>
  );
}
