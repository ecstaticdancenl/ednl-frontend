import Head from "next/head";
import { Navigation } from "@/components/navigation";
import { Bubbles } from "@/components/bubbles";
import { Footer } from "@/components/footer";
import { Label } from "@/components/label";

export default function Agenda() {
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
        className={
          "text-center sm:pt-8 pt-1 pb-5 mx-5 pointer-events-none grow"
        }
      >
        <Label>Agenda</Label>
        <h2 className="mt-1 pointer-events-auto">
          Aankomende dansen via{" "}
          <a href="https://hipsy.nl/" target={"_blank"} className={"underline"}>
            Hipsy.nl
          </a>
        </h2>
      </header>
      <header
        className={
          "text-center sm:pt-12 pt-1 pb-80 mx-5 pointer-events-none grow"
        }
      >
        <h3 className={"text-white/50"}>Coming soon...</h3>
      </header>
      <Footer />
    </>
  );
}
