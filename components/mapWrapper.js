import { useEffect, useRef, useState } from "react";
import { Feature, Map, View } from "ol";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import { defaults as defaultControls } from "ol/control";
import { Point } from "ol/geom";
import {
  clusters,
  extentEnd,
  extentStart,
  hover,
  netherlands,
  raster,
  source,
} from "@/components/mapSettings";
import useDebounce from "@/components/debounce";
import { defaults, DragPan, MouseWheelZoom } from "ol/interaction";
import { isBrowser, isMobile } from "react-device-detect";
import { createEmpty, extend } from "ol/extent";
import { clusterStyleHover } from "@/components/mapStyles";

function zoomToExtent(map, customExtent, debouncedFilter) {
  if (
    customExtent ||
    (!customExtent && debouncedFilter !== "" && source.getFeatures().length > 0)
  ) {
    map.getView().fit(source.getExtent(), {
      padding: [100, 100, 100, 100],
      maxZoom: 13,
      duration: 600,
    });
  } else {
    map.getView().fit(new Point(netherlands), {
      maxZoom: 7,
      duration: 600,
    });
  }
  return null;
}

export function MapWrapper({
  filter = "",
  organisations,
  customExtent = false,
  className = "md:sticky md:top-16 md:h-[calc(100vh-225px)] h-[50vh]",
  setFilter,
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
          if (!address?.naam || !address?.lonlat) continue;
          const lonlat = JSON.parse(address.lonlat);
          const coordinate = fromLonLat([lonlat[0], lonlat[1]], "EPSG:3857");
          const feature = new Feature(new Point(coordinate));
          feature.set(
            "organisation",
            organisation.title.replace(/Ecstatic Dance/g, "ED")
          );
          if (organisation.acfOrganisatieGegevens.locaties.length > 1) {
            feature.set("naam", address.naam);
          }
          feature.set("hover", 0);
          features.push(feature);
        }
      }
    }
    source.clear();
    source.addFeatures(features);
  }, [organisations]);

  useEffect(() => {
    if (map && map.getView) zoomToExtent(map, customExtent, debouncedFilter);
  }, [debouncedFilter, map, customExtent]);

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
        zoom: 7,
        minZoom: 7,
        maxZoom: 16,
        extent: [...extentStart, ...extentEnd],
      }),
    });

    if (setFilter) {
      initialMap.addInteraction(hover);

      hover.on("select", function (event) {
        let selectedFeatures = event.target.getFeatures();
        selectedFeatures.forEach(function (feature) {
          feature.setStyle(clusterStyleHover);
        });
        if (initialMap.getTargetElement()) {
          initialMap.getTargetElement().style.cursor =
            selectedFeatures.getLength() > 0 ? "pointer" : "";
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
            } else {
              clusterMembers.forEach(function (feature) {
                setFilter(
                  feature.get("organisation").replace(/ED/g, "Ecstatic Dance")
                );
                zoomToExtent(map);
              });
            }
          }
        });
      });
    }

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
