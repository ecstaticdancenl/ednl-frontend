// Map marker
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import CircleStyle from "ol/style/Circle";
import basepath from "@/lib/basepath";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });

export const icon = new Icon({
  src: basepath + "/marker.svg",
});
export const iconHover = new Icon({
  src: basepath + "/marker.svg",
  scale: 1.2,
});

export const clusterStyle = (feature) => {
  const fontFamily = outfit.style.fontFamily.split(",")[0];
  const size = feature.get("features").length;
  const organisation = feature.get("features")[0].get("organisation");
  const naam = feature.get("features")[0].get("naam");

  if (size === 1) {
    return [
      new Style({
        image: icon,
        text: new Text({
          text: organisation,
          fill: new Fill({
            color: "#fff",
          }),
          stroke: new Stroke({
            color: "#00000099",
            width: 5,
          }),
          offsetY: 15,
          font: `11px ${fontFamily}`,
        }),
      }),
      new Style({
        text: new Text({
          text: naam,
          fill: new Fill({
            color: "#fff",
          }),
          stroke: new Stroke({
            color: "#00000099",
            width: 5,
          }),
          offsetY: 28,
          font: `normal 10px ${fontFamily}`,
        }),
      }),
    ];
  }
  // Group of organisations, show size
  return new Style({
    image: new CircleStyle({
      radius: 13,
      stroke: new Stroke({
        color: "#1e40af55",
      }),
      fill: new Fill({
        color: "#1e40af",
      }),
    }),
    text: new Text({
      text: size.toString(),
      font: `12px ${fontFamily}`,
      fill: new Fill({
        color: "#fff",
      }),
    }),
  });
};

export const clusterStyleHover = (feature) => {
  const fontFamily = outfit.style.fontFamily.split(",")[0];
  const size = feature.get("features").length;
  const organisation = feature.get("features")[0].get("organisation");
  const naam = feature.get("features")[0].get("naam");

  if (size === 1) {
    return [
      new Style({
        image: iconHover,
        text: new Text({
          text: organisation,
          fill: new Fill({
            color: "#fecdd3",
          }),
          stroke: new Stroke({
            color: "#00000099",
            width: 5,
          }),
          offsetY: 15,
          font: `11px ${fontFamily}`,
        }),
      }),
      new Style({
        text: new Text({
          text: naam,
          fill: new Fill({
            color: "#fecdd3",
          }),
          stroke: new Stroke({
            color: "#00000099",
            width: 5,
          }),
          offsetY: 28,
          font: `normal 10px ${fontFamily}`,
        }),
      }),
    ];
  }
  // Group of organisations, show size
  return new Style({
    image: new CircleStyle({
      radius: 16,
      stroke: new Stroke({
        color: "#1e40af55",
      }),
      fill: new Fill({
        color: "#1e40af",
      }),
    }),
    text: new Text({
      text: size.toString(),
      font: `12px ${fontFamily}`,
      fill: new Fill({
        color: "#fff",
      }),
    }),
  });
};
