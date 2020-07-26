import { LeafletMap } from "../../services/leaflet-map";

import { IViewModel } from "aurelia";

export class Home implements IViewModel {
  title = "Welcome Home";

  mapDescriptor = {
    id: "main-map-id",
    height: 1200,
    location: { lat: 53.2734, long: -7.7783203 },
    zoom: 8,
    minZoom: 7,
    activeLayer: "",
  };

  map: LeafletMap;

  async afterAttach() {
    await new Promise(resolve => setTimeout(resolve));
    this.map = new LeafletMap(this.mapDescriptor);
  }
}
