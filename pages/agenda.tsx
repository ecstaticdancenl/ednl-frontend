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
import { uniqueEvents } from "@/lib/uniqueEvents";

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
                actief
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
  const events = sortEventsByDate([...eventsHipsy.flat(1), ...eventsFacebook]);

  return {
    props: {
      organisations: data.organisations,
      events: events,
    },
  };
}
