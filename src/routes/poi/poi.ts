import { LeafletMap } from "../../services/leaflet-map";
import { IViewModel } from "aurelia";
import { Oileain } from "../../services/oileain";
import { PointOfInterest } from "../../services/poi";

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
  poi: PointOfInterest;

  constructor(private oileain: Oileain) {}

  public async enter(parameters: { id: string }): Promise<void> {
    await this.oileain.getCoasts();
    const poi = await this.oileain.getIslandById(parameters[0]);
    this.renderPoi(poi);
  }

  async afterAttach() {
    await new Promise(resolve => setTimeout(resolve));
    this.map = new LeafletMap(this.mapDescriptor);
    if (this.poi) {
      this.renderPoi(this.poi);
    }
  }
  
  renderPoi(poi) {
    this.poi = poi;
    this.title = poi.name;
    if (this.map) {
      this.map.addPopup("Islands", poi.nameHtml, poi.coordinates.geo);
      this.map.moveTo(15, poi.coordinates.geo);
      this.map.invalidateSize();
    }
  }
}
