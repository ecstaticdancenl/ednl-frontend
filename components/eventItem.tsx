import ExtURL from "@/components/extURL";
import { Label } from "@/components/label";

export function EventItem(props: any) {
  return (
    <a
      href={props.url}
      target={"_blank"}
      rel={"noreferrer"}
      className={
        "w-full group bg-white/5 shadow-sm rounded-md transition-colors hover:bg-white/10 transition-colors flex sm:gap-3 gap-2.5 items-center relative"
      }
    >
      <div
        className={
          "flex items-center gap-1 absolute right-4 bottom-3.5 group-hover:opacity-60 opacity-0 transition-opacity text-sm"
        }
      >
        <span>Open {props.type === "Hipsy" ? "Hipsy" : "ticket"} link</span>
        <ExtURL className={"w-3 h-3"} />
      </div>
      <img
        className={
          "md:w-28 lg:w-36 w-24 md:h-20 lg:h-28 h-24 rounded-sm object-cover"
        }
        src={props.img}
        alt={props.title}
      />
      <div className={"flex flex-col p-1 md:p-1"}>
        <Label className={"line-clamp-1 md:text-xs text-[12px] leading-[1.2]"}>
          {props.label}
        </Label>
        <h4 className={"line-clamp-2 leading-[1.2] my-0.5"}>{props.title}</h4>
        <div className={"text-sm md:text-base text-white/60"}>{props.date}</div>
      </div>
    </a>
  );
}
