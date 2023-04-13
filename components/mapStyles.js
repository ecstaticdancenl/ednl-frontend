// Map marker
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import CircleStyle from "ol/style/Circle";
import basepath from "@/lib/basepath";

export const icon = new Icon({
  src: basepath + "/marker.svg",
});
export const clusterStyle = (feature) => {
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
          font: "11px __Outfit_adb80a",
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
          font: "normal 10px __Outfit_adb80a",
        }),
      }),
    ];
  }
  // Group of organisations, show size
  return new Style({
    image: new CircleStyle({
      radius: 14,
      stroke: new Stroke({
        color: "#1e40af55",
      }),
      fill: new Fill({
        color: "#1e40af",
      }),
    }),
    text: new Text({
      text: size.toString(),
      font: "12px __Outfit_adb80a",
      fill: new Fill({
        color: "#fff",
      }),
    }),
  });
};

export const basicStyle = (feature) => {
  const size = feature.get("features").length;
  // Single organisation
  if (size == 1) {
    return new Style({
      image: icon,
    });
  }
  // Group of organisations, show size
  return new Style({
    image: new CircleStyle({
      radius: 10,
      stroke: new Stroke({
        color: "#1e40af55",
      }),
      fill: new Fill({
        color: "#1e40af",
      }),
    }),
    text: new Text({
      text: size.toString(),
      font: "12px __Outfit_adb80a",
      fill: new Fill({
        color: "#fff",
      }),
    }),
  });
};
