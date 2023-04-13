export function Footer() {
  return (
    <footer
      className={
        "bg-slate-900 py-12 md:grid md:grid-cols-3 flex flex-col px-10 text-white font-light tracking-wider gap-12 text-xs"
      }
    >
      <div>
        <h5>Achtergrond</h5>
        <p className={"mt-2"}>
          Deze is site is ontwikkeld zonder commercieel verdienmodel, uit liefde
          voor Ecstatic Dance.
          <br />♡
        </p>
      </div>
      <div className={"md:text-center"}>
        <h5>Dank</h5>
        <ul className={"mt-2"}>
          <li>
            Hosting en beheer door <a href="#">Ramon</a>
          </li>
          <li>
            Code door <a href="#">Sefrijn</a> van <a href="#">How About Yes</a>
          </li>
          <li>
            Foto’s door <a href="#">Ilse Wolf</a>
          </li>
        </ul>
      </div>

      <div className={"md:text-right"}>
        <h5>Contact</h5>

        <h3>
          <a href="mailto:info@ecstaticdance.nl">info@ecstaticdance.nl</a>
        </h3>
      </div>
    </footer>
  );
}
