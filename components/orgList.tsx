import Link from "next/link";
import { Organisation } from "@/types/organisation";
import { getHighlightedText } from "@/components/highlightText";
import basepath from "@/lib/basepath";
import MarkerIcon from "@/components/markerIcon";

type OrgListProps = {
  organisations: { nodes: [] };
  mapFilter: string;
};

export function OrgList({ organisations, mapFilter }: OrgListProps) {
  return (
    <div className={"flex flex-col gap-2"}>
      {organisations.nodes.map((org: Organisation, index: number) => {
        if (mapFilter !== "") {
          if (
            !org.title.toLowerCase().includes(mapFilter.toLowerCase()) &&
            !org.acfOrganisatieGegevens.locaties?.some(
              (loc: any) =>
                loc.naam.toLowerCase().includes(mapFilter.toLowerCase()) ||
                loc.adres.toLowerCase().includes(mapFilter.toLowerCase())
            )
          ) {
            return;
          }
        }
        return (
          <Link
            key={index}
            href={"/locaties/" + org.slug}
            className={
              "group bg-white/5 shadow rounded-md hover:bg-white/10 transition-colors block pt-2.5 pb-3 px-3.5 relative"
            }
          >
            <h4 className={"mb-1.5"}>{org.title}</h4>
            <div
              className={[
                org.acfOrganisatieGegevens.locaties?.length === 1
                  ? "grid-cols-1"
                  : "sm:grid-cols-2 grid-cols-1",
                "my-0.5 grid gap-2",
              ].join(" ")}
            >
              {!org.acfOrganisatieGegevens.locaties && (
                <p className={"text-sm"}>Op dit moment geen locatie</p>
              )}
              {org.acfOrganisatieGegevens.locaties?.map((loc: any) => {
                return (
                  <div
                    className={"text-sm px-2 flex gap-2 items-start"}
                    key={loc.naam}
                  >
                    <MarkerIcon className={"opacity-25 text-white"} />
                    <div className={"flex flex-col gap-1"}>
                      <p>{getHighlightedText(loc.naam, mapFilter)}</p>
                      <p
                        className={
                          "text-xs font-light text-white/60 whitespace-pre-wrap"
                        }
                      >
                        {getHighlightedText(loc.adres, mapFilter)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
