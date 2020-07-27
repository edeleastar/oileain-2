import { LeafletMap } from "../../services/leaflet-map";
import { IViewModel } from "aurelia";
import { Oileain } from "../../services/oileain";

export class Poi implements IViewModel  {
  title = "Olieain POI View";

  mapDescriptor = {
    id: "poi-map-id",
    height: 300,
    location: { lat: 53.2734, long: -7.7783203 },
    zoom: 8,
    minZoom: 7,
    activeLayer: "Satellite",
  };
  map: LeafletMap;

  constructor(private oileain: Oileain) {}

  public async enter(parameters: { id: string }): Promise<void> {
    console.log('here')
  }

  async afterAttach() {
    await new Promise(resolve => setTimeout(resolve));
    this.map = new LeafletMap(this.mapDescriptor);
  }
}
