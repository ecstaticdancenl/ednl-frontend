import Head from "next/head";
import { Navigation } from "@/components/navigation";
import { Bubbles } from "@/components/bubbles";
import { Footer } from "@/components/footer";
import { fetchPageBySlug } from "@/fetch";
import { Label } from "@/components/label";

export async function getStaticProps() {
  //    Get data from WordPress REST API
  const page = await fetchPageBySlug("over");

  if (!page) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page: page,
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
          "lg:px-10 sm:px-6 px-4 text-center sm:pt-8 pt-1 pb-5 mx-5 pointer-events-none grow"
        }
      >
        <Label>Introductie</Label>
        <h2 className="mt-1">{page.title}</h2>
      </header>
      <div>
        <main
          className={
            "px-6 md:px-0 max-w-(--breakpoint-sm) mx-auto md:mb-32 mb-16"
          }
        >
          {page.content && (
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
