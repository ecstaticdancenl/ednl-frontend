import { niceURL } from "@/components/niceURL";
import { Organisation } from "@/types/organisation";
import WebsiteIcon from "@/components/websiteIcon";
import EmailIcon from "@/components/emailIcon";

export function OrgHeader({ organisation }: { organisation: Organisation }) {
  return (
    <header
      className="w-full locatie relative z-10 lg:px-10 sm:px-6 px-4"
      style={{ height: "50vh", maxHeight: "350px" }}
    >
      {organisation.featuredImage && (
        <div className={"relative w-full h-0"}>
          <img
            className={"object-cover w-full absolute rounded-2xl"}
            style={{ height: "50vh", maxHeight: "350px" }}
            src={organisation.featuredImage.node.sourceUrl}
            alt=""
          />
        </div>
      )}
      <div
        className={
          "rounded-2xl bg-blue-900/30 relative z-10 w-full h-full flex flex-col items-center justify-center text-center gap-3 px-8"
        }
      >
        <h1>{organisation.title}</h1>
        <div
          className={
            "flex gap-1 lg:gap-8 lg:flex-row flex-col text-sm sm:text-base md:text-lg items-center"
          }
        >
          {organisation.acfOrganisatieGegevens.website && (
            <a
              target={"_blank"}
              className={"flex gap-2 items-center"}
              href={organisation.acfOrganisatieGegevens.website}
            >
              <WebsiteIcon className={"w-4 h-4 translate-y-0.5 fill-current"} />
              <span>
                {niceURL(organisation.acfOrganisatieGegevens.website)}
              </span>
            </a>
          )}
          {organisation.acfOrganisatieGegevens.email && (
            <a
              target={"_blank"}
              href={"mailto:" + organisation.acfOrganisatieGegevens.email}
              className={"flex gap-2 items-center"}
            >
              <EmailIcon className={"w-4 h-5 fill-current"} />

              <span>{organisation.acfOrganisatieGegevens.email}</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
