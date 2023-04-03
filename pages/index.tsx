import Head from "next/head";
import { gql } from "@apollo/client";
import client from "../apollo-client";

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query {
        organisations {
          nodes {
            id
            title
            acfOrganisatieGegevens {
              email
              fieldGroupName
              naam
              telefoon
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      organisations: data.organisations,
    },
  };
}
type AppProps = {
  className: string;
  organisations: { nodes: [] };
};

type Organisation = {
  id: string;
  title: string;
};

export default function Home({ organisations }: AppProps) {
  console.log(organisations.nodes);
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
      <main>Ecstatic Dance New website.</main>
      <div>
        {organisations.nodes.map((org: Organisation, index) => {
          return <div key={index}>{org.title}</div>;
        })}
      </div>
    </>
  );
}
