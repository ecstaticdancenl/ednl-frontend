import VectorLayer from "ol/layer/Vector";
import { basicStyle, clusterStyle, icon } from "@/components/mapStyles";
import { fromLonLat } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import { Cluster, OSM, Vector as VectorSource } from "ol/source.js";
import { Style } from "ol/style";

export const netherlands = fromLonLat([5.2, 52.23], "EPSG:3857");
export const extentStart = fromLonLat([3, 50.6], "EPSG:3857");
export const extentEnd = fromLonLat([8, 54], "EPSG:3857");
// Add locations to map
let features = [];
export const source = new VectorSource({
  features: features,
});
// How tight locations are clustered together
const clusterSource = new Cluster({
  distance: 80,
  source: source,
});
export const clusters = new VectorLayer({
  source: clusterSource,
  style: clusterStyle,
});
export const raster = new TileLayer({
  source: new OSM(),
});
