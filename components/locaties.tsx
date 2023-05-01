import { Bubbles } from "@/components/bubbles";
import { Label } from "@/components/label";
import { MapWrapper } from "@/components/mapWrapper";
import { OrgList } from "@/components/orgList";
import { useEffect, useState } from "react";

const scrollIntoViewWithOffset = (selector: string, offset: number) => {
  const el = document.getElementById(selector);
  if (el) {
    window.scrollTo({
      behavior: "smooth",
      top:
        el.getBoundingClientRect()?.top -
        document.body.getBoundingClientRect().top -
        offset,
    });
  }
};

export function Locaties(props: {
  blobs: boolean;
  organisations: { nodes: [] };
}) {
  const [mapFilter, setMapFilter] = useState<string>("");
  const [filteredOrgs, setFilteredOrgs] = useState<any>([]);
  const [countOrgs, setCountOrgs] = useState<number>(0);

  useEffect(() => {
    if (mapFilter !== "") {
      scrollIntoViewWithOffset("locaties", 60);
    }
  }, [mapFilter]);

  useEffect(() => {
    setCountOrgs(
      filteredOrgs.reduce((total: any, org: any) => {
        return total + org.acfOrganisatieGegevens.locaties.length;
      }, 0)
    );
  }, [filteredOrgs]);

  useEffect(() => {
    setFilteredOrgs(
      props.organisations.nodes.filter((org: any) => {
        if (mapFilter !== "") {
          if (
            !org.title.toLowerCase().includes(mapFilter.toLowerCase()) &&
            !org.acfOrganisatieGegevens.locaties?.some(
              (loc: any) =>
                loc.naam?.toLowerCase().includes(mapFilter.toLowerCase()) ||
                loc.adres?.toLowerCase().includes(mapFilter.toLowerCase())
            )
          ) {
            return false;
          }
        }
        return true;
      })
    );
  }, [props.organisations, mapFilter]);

  return (
    <div
      className={["relative w-full", props.blobs ? "my-24" : "mt-8 mb-24"].join(
        " "
      )}
    >
      {props.blobs && <Bubbles flipped className={"top-12"} />}

      <section
        className={"lg:px-10 px-6 flex flex-col items-center gap-2 relative"}
      >
        <span
          id={"locaties"}
          className={"h-1 w-1 absolute top-0 left-0"}
        ></span>
        <h2 className={["-mb-1 mt-0 transition-all"].join(" ")}>
          Waar kan je dansen?
        </h2>
        <Label>
          {" "}
          {countOrgs} locatie{countOrgs > 1 && "s"}
          {mapFilter === "" && " in Nederland"}
        </Label>
        <div className={"relative"}>
          <input
            className={
              " shadow bg-white/10 rounded-md hover:bg-white/20 py-1.5 px-4 placeholder-white/50 transition-colors w-72"
            }
            type="text"
            placeholder={"Vind een plek..."}
            onChange={(e) => setMapFilter(e.target.value)}
            value={mapFilter}
          />
          {mapFilter !== "" && (
            <button
              className={
                "absolute rounded-md right-0 h-full px-3.5 hover:bg-white/20 text-2xl"
              }
              onClick={() => {
                setMapFilter("");
                scrollIntoViewWithOffset("locaties", 60);
              }}
            >
              &times;
            </button>
          )}
        </div>
        <div
          className={
            "mt-1 w-full grid grid-cols-1 md:grid-cols-2 lg:gap-6 gap-2"
          }
        >
          <MapWrapper
            setFilter={setMapFilter}
            filter={mapFilter}
            organisations={filteredOrgs}
          />
          <OrgList organisations={filteredOrgs} mapFilter={mapFilter} />
        </div>
      </section>
    </div>
  );
}
