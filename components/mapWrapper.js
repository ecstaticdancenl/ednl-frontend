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
import useDebounce from "@/components/debounce";
import { DragPan, MouseWheelZoom, defaults } from "ol/interaction.js";
import { platformModifierKeyOnly } from "ol/events/condition.js";
import { isBrowser, isMobile } from "react-device-detect";
import { createEmpty, extend } from "ol/extent";

export function MapWrapper({ filter = "", addresses, organisations }) {
  const [map, setMap] = useState({});
  const mapElement = useRef();
  const debouncedFilter = useDebounce(filter, 500);

  useEffect(() => {
    let features = [];
    for (const organisationID in addresses) {
      for (const address of addresses[organisationID]) {
        if (!address?.json) continue;
        const coordinate = fromLonLat(
          [address.json.lon, address.json.lat],
          "EPSG:3857"
        );
        const feature = new Feature(new Point(coordinate));
        feature.set("organisation", address.organisation);
        if (address.hasMultipleLocations) {
          feature.set("naam", address.naam);
        }
        feature.set("hover", false);
        if (
          address.organisation.toLowerCase().includes(filter.toLowerCase()) ||
          address.naam.toLowerCase().includes(filter.toLowerCase()) ||
          address.adres.toLowerCase().includes(filter.toLowerCase())
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
    if (map && map.getView && source.getFeatures().length > 0)
      map.getView().fit(source.getExtent(), {
        padding: [150, 150, 150, 150],
        maxZoom: 13,
        duration: 1000,
      });
  }, [debouncedFilter]);

  useEffect(() => {
    // create map
    const initialMap = new Map({
      controls: defaultControls(),
      interactions: defaults({ dragPan: false, mouseWheelZoom: false }).extend([
        new DragPan({
          condition: function (event) {
            return this.getPointerCount() === 2 || isBrowser;
          },
        }),
        new MouseWheelZoom({
          condition: () => isBrowser,
        }),
      ]),
      target: mapElement.current,
      layers: [raster, clusters],
      view: new View({
        projection: "EPSG:3857",
        center: netherlands,
        zoom: 7.2,
        minZoom: 7.2,
        maxZoom: 16,
        extent: [...extentStart, ...extentEnd],
      }),
    });

    let hoverFeature;
    initialMap.on("pointermove", function (event) {
      const feature = initialMap.forEachFeatureAtPixel(
        event.pixel,
        function (feature) {
          return feature;
        }
      );

      if (feature?.get("features") !== hoverFeature) {
        hoverFeature = feature;
        // Change the cursor style to indicate that the cluster is clickable.
        console.log("hover feature");
        initialMap.getTargetElement().style.cursor =
          hoverFeature && feature.get("features").length > 1 ? "pointer" : "";
      }

      if (feature?.get("features").length === 1) {
        feature.get("features")[0].set("hover", true);
      } else {
        source.getFeatures().forEach(function (feature) {
          feature.set("hover", false);
        });
      }
    });

    initialMap.on("click", (event) => {
      clusters.getFeatures(event.pixel).then((features) => {
        if (features.length > 0) {
          const clusterMembers = features[0].get("features");
          if (clusterMembers.length > 1) {
            // Calculate the extent of the cluster members.
            const extent = createEmpty();
            clusterMembers.forEach((feature) =>
              extend(extent, feature.getGeometry().getExtent())
            );
            initialMap
              .getView()
              .fit(extent, { duration: 500, padding: [150, 150, 150, 150] });
            //         const view = map.getView();
            //         const resolution = map.getView().getResolution();
            //         if (
            //           view.getZoom() === view.getMaxZoom() ||
            //           (getWidth(extent) < resolution && getHeight(extent) < resolution)
            //         ) {
            //           // Show an expanded view of the cluster members.
            //           // clickFeature = features[0];
            //           // clickResolution = resolution;
            //           // clusterCircles.setStyle(clusterCircleStyle);
            //         } else {
            //           // Zoom to the extent of the cluster members.
            //           view.fit(extent, { duration: 500, padding: [50, 50, 50, 50] });
            //         }
            //       }
            console.log("zoomin to cluster");
          }
        }
      });
    });

    // save map and vector layer references to state
    setMap(initialMap);
    return () => {
      initialMap.setTarget(undefined);
    };
  }, []);

  return (
    <div
      // style={{ height: "calc(100vh - 90px)", width: "100%" }}
      ref={mapElement}
      className="bg-white/80 map-container rounded-md overflow-clip md:sticky md:top-10 md:h-[calc(100vh-90px)] h-[50vh] w-full"
    />
  );
}

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}
