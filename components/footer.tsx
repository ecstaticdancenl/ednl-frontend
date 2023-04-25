import basepath from "@/lib/basepath";

export function Footer() {
  // TODO: Max width full screen
  return (
    <footer
      className={
        "z-10 bg-slate-900 py-12 text-white font-light tracking-wider text-xs"
      }
    >
      <div className={"max-w-screen-2xl mx-auto "}>
        <div
          className={
            "lg:px-10 px-6 md:grid md:grid-cols-3 flex flex-col-reverse gap-12 gap-6"
          }
        >
          <div>
            <h5>Achtergrond</h5>
            <div className={"mt-2"}>
              Deze is site is ontwikkeld zonder commercieel verdienmodel, uit
              liefde voor Ecstatic Dance.
              <br />♡
            </div>
          </div>
          <div className={"md:text-center"}>
            <h5>Dank</h5>
            <ul className={"mt-2"}>
              <li>
                Hosting en beheer door{" "}
                <a
                  href="https://igniteme.nl/"
                  target={"_blank"}
                  rel={"noreferrer"}
                >
                  Ramon
                </a>
              </li>
              <li>
                Code door{" "}
                <a
                  href="https://sefrijn.nl"
                  target={"_blank"}
                  rel={"noreferrer"}
                >
                  Sefrijn
                </a>{" "}
                van{" "}
                <a
                  href="https://howaboutyes.com"
                  target={"_blank"}
                  rel={"noreferrer"}
                >
                  Studio How About Yes
                </a>
              </li>
              <li>
                Foto’s door{" "}
                <a
                  href="https://www.ilsewolf.nl/"
                  target={"_blank"}
                  rel={"noreferrer"}
                >
                  Ilse Wolf
                </a>
              </li>
            </ul>
          </div>

          <div className={"md:text-right"}>
            <h5>Contact</h5>

            <h3>
              <a href="mailto:info@ecstaticdance.nl">info@ecstaticdance.nl</a>
            </h3>
          </div>
        </div>
        <div className={"flex gap-5 items-end justify-center md:mt-5 mt-8"}>
          <img className={"h-20"} src={basepath + "/dancer1.svg"} alt="" />{" "}
          <img className={"h-16"} src={basepath + "/dancer2.svg"} alt="" />{" "}
        </div>
      </div>
    </footer>
  );
}
