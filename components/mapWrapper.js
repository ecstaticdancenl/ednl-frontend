import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Feature, Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import { XYZ } from "ol/source";
import { fromLonLat } from "ol/proj";
import { defaults as defaultControls } from "ol/control.js";
import { Cluster, OSM, Vector as VectorSource } from "ol/source.js";
import { Point } from "ol/geom";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style.js";
import { Icon } from "ol/style";

export function MapWrapper({ addresses, organisations }) {
  const [map, setMap] = useState();
  const mapElement = useRef();
  const netherlands = fromLonLat([5.2, 52.23], "EPSG:3857");
  const extentStart = fromLonLat([3, 50.6], "EPSG:3857");
  const extentEnd = fromLonLat([8, 54], "EPSG:3857");
  const size = Object.keys(addresses).length;
  const features = new Array(size);
  // console.log(organisations.nodes);

  Object.entries(addresses).forEach(([key, value], index) => {
    const coordinate = fromLonLat([value.lon, value.lat], "EPSG:3857");
    let feature = new Feature(new Point(coordinate));
    let org = organisations.nodes.find((node) => node.id == key);
    console.log("Title: " + org.title);
    feature.set("dynamicText", org.title);
    features[index] = feature;
  });

  const icon = new Icon({
    src: "marker.svg",
  });

  const source = new VectorSource({
    features: features,
  });

  // const source = new VectorSource({
  //   features: features,
  // });

  const clusterSource = new Cluster({
    distance: 80,
    source: source,
  });

  const clusterStyle = function (feature) {
    const size = feature.get("features").length;
    const name = feature.get("features")[0].get("dynamicText");
    console.log(name);
    if (size == 1) {
      return new Style({
        image: icon,
        text: new Text({
          text: name,
          fill: new Fill({
            color: "#fff",
          }),
          stroke: new Stroke({
            color: "#00000099",
            width: 4,
          }),
          offsetY: 15,
          font: "13px __Outfit_adb80a",
        }),
      });
    }
    let style = styleCache[size];
    if (!style) {
      style = new Style({
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
      styleCache[size] = style;
    }
    return style;
  };

  const styleCache = {};
  const clusters = new VectorLayer({
    source: clusterSource,
    // style: clusterStyle,
    style: clusterStyle,
  });

  useEffect(() => {
    // create and add vector source layer
    // const initalFeaturesLayer = new VectorLayer({
    //   source: new VectorSource(),
    // });
    const raster = new TileLayer({
      source: new OSM(),
    });
    // create map
    const initialMap = new Map({
      controls: defaultControls(),
      target: mapElement.current,
      layers: [
        raster,
        clusters,

        // initalFeaturesLayer,
      ],
      view: new View({
        projection: "EPSG:3857",
        center: netherlands,
        zoom: 7.2,
        minZoom: 7.2,
        extent: [...extentStart, ...extentEnd],
      }),
    });

    // save map and vector layer references to state
    setMap(initialMap);
    return () => {
      initialMap.setTarget(undefined);
    };
  }, []);

  return (
    <div
      style={{ height: "60vh", width: "100%" }}
      ref={mapElement}
      className="map-container rounded-md overflow-clip"
    />
  );
}
