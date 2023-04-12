import { useEffect, useRef, useState } from "react";
import { Feature, Map, View } from "ol";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import { defaults as defaultControls } from "ol/control.js";
import { Point } from "ol/geom";
import {
  clusters,
  extentEnd,
  extentStart,
  netherlands,
  raster,
  source,
} from "@/components/mapSettings";

let highlight;

export function MapWrapper({ filter = "", addresses, organisations }) {
  const [map, setMap] = useState({});
  const mapElement = useRef();

  useEffect(() => {
    let features = [];
    for (const organisationID in addresses) {
      for (const address of addresses[organisationID]) {
        const coordinate = fromLonLat(
          [address.json.lon, address.json.lat],
          "EPSG:3857"
        );
        const feature = new Feature(new Point(coordinate));
        feature.set("organisation", address.organisation);
        feature.set("naam", address.naam);
        if (
          address.organisation.toLowerCase().includes(filter.toLowerCase()) ||
          address.naam.toLowerCase().includes(filter.toLowerCase())
        ) {
          features.push(feature);
        }
      }
    }
    source.clear();
    source.addFeatures(features);
    // clusters.changed();
  }, [filter]);

  useEffect(() => {
    // create map
    const initialMap = new Map({
      controls: defaultControls(),
      target: mapElement.current,
      layers: [raster, clusters],
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
      style={{ height: "500px", width: "100%" }}
      ref={mapElement}
      className="map-container rounded-md overflow-clip sticky top-12"
    />
  );
}
