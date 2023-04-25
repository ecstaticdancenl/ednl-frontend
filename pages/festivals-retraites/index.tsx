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

export async function getStaticProps() {
  //    Get data from WordPress
  const { data } = await client.query({
    query: gql`
      query {
        festivalsEnRetraites(
          first: ${limit}
          where: { orderby: { field: TITLE, order: ASC } }
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

export default function Index(props: any) {
  console.log(props.data);
  const events = props.data.festivalsEnRetraites.nodes;
  const currentYear = new Date().getFullYear();
  const showDate = (date: string) => {
    if (date.endsWith(currentYear.toString())) {
      return date.slice(0, -5);
    } else {
      return date;
    }
  };
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
            "text-center sm:pt-8 pt-1 pb-5 mx-5 pointer-events-none grow"
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
          "lg:px-10 px-6 my-16 flex flex-wrap flex-col lg:flex-row w-full gap-10 justify-center grow"
        }
      >
        {events.map((event: any) => (
          <div
            key={event.id}
            className={
              "w-full lg:w-[calc(50%-1.25rem)] flex flex-col items-start sm:flex-row gap-4"
            }
          >
            <img
              className={
                "sm:w-2/5 aspect-[1.4] object-cover rounded-2xl border-8 border-white/20 shadow"
              }
              src={event.featuredImage.node.sourceUrl}
              alt=""
            />
            <div className={"sm:w-3/5"}>
              <Label className={"drop-shadow"}>
                {event.eventInfo.soortEvent}
              </Label>
              <h3>{event.title}</h3>
              <p className={"text-base text-white/60"}>
                {showDate(event.eventInfo.wanneer.start)} tot{" "}
                {showDate(event.eventInfo.wanneer.einde)}
              </p>
              {event.eventInfo.subtitel && (
                <p className={"text-sm"}>{event.eventInfo.subtitel}</p>
              )}
              <hr className={"opacity-10 border-t-2 my-2"} />
              <p className={"text-sm font-medium"}>
                {event.eventInfo.locatieNaam}
              </p>
              <p className={"text-xs whitespace-pre-wrap opacity-60"}>
                {event.eventInfo.adres}
              </p>
              <Button
                size={"sm"}
                className={"mt-3"}
                href={event.eventInfo.ticketLink}
              >
                Info
              </Button>
            </div>
          </div>
        ))}
      </section>
      {/*<img src={page.featuredImage.node.sourceUrl} alt="" />*/}
      {/*<main className={"px-6 md:px-0 max-w-screen-sm mx-auto md:mb-32 mb-16"}>*/}
      {/*  {page.content && (*/}
      {/*    <div dangerouslySetInnerHTML={{ __html: page.content }} />*/}
      {/*  )}*/}
      {/*</main>*/}
      <Footer />
    </>
  );
}
