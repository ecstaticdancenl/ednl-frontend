import Head from "next/head";
import { Navigation } from "@/components/navigation";
import { Bubbles } from "@/components/bubbles";
import { Footer } from "@/components/footer";
import client from "@/apollo-client";
import { gql } from "@apollo/client";
import { getCachedAddresses } from "@/lib/getAddressesFromAPI";
import { Label } from "@/components/label";

export async function getStaticProps({ params }: any) {
  //    Get data from WordPress
  const { data } = await client.query({
    query: gql`
      query {
        pages(where: { name: "Over" }) {
          nodes {
            id
            title
            content
            featuredImage {
              node {
                sourceUrl
              }
            }
            slug
          }
        }
      }
    `,
  });

  return {
    props: {
      page: data.pages.nodes[0],
    },
  };
}

export default function Over({ page }: { page: any }) {
  return (
    <>
      <Head>
        <title>Wat is Ecstatic Dance?</title>
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
        className={
          "text-center sm:pt-8 pt-1 pb-5 mx-5 pointer-events-none grow"
        }
      >
        <Label>Introductie</Label>
        <h2 className="mt-1">{page.title}</h2>
      </header>
      <main className={"max-w-screen-sm mx-auto md:mb-32 mb-16"}>
        {page.content && (
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        )}
      </main>
      <Footer />
    </>
  );
}
