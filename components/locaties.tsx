import { Bubbles } from "@/components/bubbles";
import { Label } from "@/components/label";
import { MapWrapper } from "@/components/mapWrapper";
import { OrgList } from "@/components/orgList";

export function Locaties(props: {
  blobs: boolean;
  setMapfilter: Function;
  mapFilter: string;
  addresses: [];
  organisations: { nodes: [] };
}) {
  return (
    <div className={props.blobs ? "relative my-24" : "relative mt-8 mb-24"}>
      {props.blobs && <Bubbles flipped className={"top-12"} />}

      <section className={"lg:px-10 px-6 flex flex-col items-center gap-4"}>
        <Label>Locaties</Label>
        <h2 className={"-mt-3"}>Waar kan je dansen?</h2>
        <div className={"relative shadow"}>
          <input
            className={
              "bg-white/10 rounded-md hover:bg-white/20 py-2 px-4 placeholder-white/50 transition-colors w-72"
            }
            type="text"
            placeholder={"Vind een plek..."}
            onChange={(e) => props.setMapfilter(e.target.value)}
            value={props.mapFilter}
          />
          <button
            className={
              "absolute rounded-md right-0 h-full px-4 hover:bg-white/20 text-2xl"
            }
            onClick={() => props.setMapfilter("")}
          >
            &times;
          </button>
        </div>
        <div
          className={
            "mt-1 w-full grid grid-cols-1 md:grid-cols-2 lg:gap-6 gap-2"
          }
        >
          <MapWrapper
            filter={props.mapFilter}
            addresses={props.addresses}
            organisations={props.organisations}
          />
          <OrgList
            organisations={props.organisations}
            mapFilter={props.mapFilter}
          />
        </div>
      </section>
    </div>
  );
}
