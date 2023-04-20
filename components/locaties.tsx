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

  useEffect(() => {
    if (mapFilter !== "") {
      scrollIntoViewWithOffset("locaties", 20);
    }
  }, [mapFilter]);

  return (
    <div className={props.blobs ? "relative my-24" : "relative mt-8 mb-24"}>
      {props.blobs && <Bubbles flipped className={"top-12"} />}

      <section
        className={"lg:px-10 px-6 flex flex-col items-center gap-4 relative"}
      >
        <span
          id={"locaties"}
          className={"h-1 w-1 absolute top-0 left-0"}
        ></span>
        <Label>Locaties</Label>
        <h2 className={"-mt-3"}>Waar kan je dansen?</h2>
        <div className={"relative shadow"}>
          <input
            className={
              "bg-white/10 rounded-md hover:bg-white/20 py-2 px-4 placeholder-white/50 transition-colors w-72"
            }
            type="text"
            placeholder={"Vind een plek..."}
            onChange={(e) => setMapFilter(e.target.value)}
            value={mapFilter}
          />
          {mapFilter !== "" && (
            <button
              className={
                "absolute rounded-md right-0 h-full px-4 hover:bg-white/20 text-2xl"
              }
              onClick={() => {
                setMapFilter("");
                scrollIntoViewWithOffset("locaties", 20);
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
            filter={mapFilter}
            organisations={props.organisations.nodes}
          />
          <OrgList organisations={props.organisations} mapFilter={mapFilter} />
        </div>
      </section>
    </div>
  );
}
