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

function zoomToExtent(map) {
  if (map && map.getView && source.getFeatures().length > 0)
    map.getView().fit(source.getExtent(), {
      padding: [100, 100, 100, 100],
      maxZoom: 13,
      duration: 1000,
    });
  return null;
}

export function MapWrapper({
  filter = "",
  organisations,
  customExtent = false,
  className = "md:sticky md:top-16 md:h-[calc(100vh-225px)] h-[50vh]",
}) {
  const [map, setMap] = useState({});
  const mapElement = useRef();
  const debouncedFilter = useDebounce(filter, 500);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    let features = [];
    for (const organisation of organisations) {
      if (organisation.acfOrganisatieGegevens.locaties) {
        for (const address of organisation.acfOrganisatieGegevens.locaties) {
          if (!address?.lonlat) continue;
          const lonlat = JSON.parse(address.lonlat);
          const coordinate = fromLonLat([lonlat[0], lonlat[1]], "EPSG:3857");
          const feature = new Feature(new Point(coordinate));
          feature.set("organisation", address.organisation);
          if (address.hasMultipleLocations) {
            feature.set("naam", address.naam);
          }
          feature.set("hover", 0);
          if (
            organisation.title.toLowerCase().includes(filter.toLowerCase()) ||
            address.naam.toLowerCase().includes(filter.toLowerCase()) ||
            address.adres.toLowerCase().includes(filter.toLowerCase())
          ) {
            features.push(feature);
          }
        }
      }
    }
    source.clear();
    source.addFeatures(features);
    // clusters.changed();
  }, [filter]);

  useEffect(() => {
    if (customExtent) zoomToExtent(map);
  }, [map]);

  useEffect(() => {
    zoomToExtent(map);
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
        initialMap.getTargetElement().style.cursor =
          hoverFeature && feature.get("features").length > 1 ? "pointer" : "";
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
          }
        }
      });
    });

    // save map and vector layer references to state
    setMap(initialMap);
    setMobile(isMobile);
    return () => {
      initialMap.setTarget(undefined);
    };
  }, []);

  return (
    <div className={[className, "w-full mb-6 md:mb-0 relative"].join(" ")}>
      <div
        // style={{ height: "calc(100vh - 90px)", width: "100%" }}
        style={{ maxHeight: "800px" }}
        ref={mapElement}
        className="map-container w-full h-full rounded-md overflow-clip bg-white/80"
      />
      {mobile && (
        <p
          className={
            "text-center text-xs opacity-50 mb-4 absolute top-full w-full"
          }
        >
          Gebruik 2 vingers om kaart te verplaatsen
        </p>
      )}
    </div>
  );
}

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}
