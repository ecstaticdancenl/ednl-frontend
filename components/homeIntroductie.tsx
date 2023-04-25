import { Label } from "@/components/label";
import { Button } from "@/components/button";

export function HomeIntroductie() {
  return (
    <section
      className={
        "lg:px-10 px-6 gap-8 md:grid md:grid-cols-4 flex flex-col items-center mt-12 md:mb-12 mb-0"
      }
    >
      <img
        className={"justify-self-start md:w-auto w-32"}
        src="dancer2.svg"
        alt=""
      />
      <div
        className={"col-span-2 flex flex-col items-center gap-4 text-center"}
      >
        <Label>Introductie</Label>
        <h2 className={"-mt-3"}>Wat is Ecstatic Dance?</h2>
        <p>
          Om Ecstatic Dance te ontdekken moet je het ervaren. Het is een veilige
          omgeving waar je jezelf kan laten gaan, er is respect en geen oordeel.
          Voor iedereen zal Ecstatic Dance anders zijn, een bepaalde ervaring
          opzoeken is niet het doel. Laat de ervaring tot je doordringen, de
          muziek, de energie. Even niet in je hoofd, vrij van gedachte.
        </p>
        <Button className={"mt-2"} href={"/over"}>
          Lees meer
        </Button>
      </div>
      <img
        className={"justify-self-end md:w-auto w-32"}
        src="dancer1.svg"
        alt=""
      />
    </section>
  );
}
