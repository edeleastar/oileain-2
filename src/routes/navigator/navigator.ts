import { CoastalLeafletMap, PoiSelect } from "../../services/coastal-leaflet-map";
import { LeafletMap } from "../../services/leaflet-map";
import { PointOfInterest, Coast } from "../../services/poi";
import { Oileain } from "../../services/oileain";

export class Navigator implements PoiSelect {

  mainMapDescriptor = {
    id: "home-map-id",
    height: 650,
    location: { lat: 53.2734, long: -7.7783203 },
    zoom: 7,
    minZoom: 7,
    activeLayer: "",
  };

  islandMapDescriptor = {
    id: "island-map-id",
    height: 250,
    location: { lat: 53.2734, long: -7.7783203 },
    zoom: 8,
    minZoom: 7,
    activeLayer: "Satellite",
  };

  mainMap: CoastalLeafletMap;
  islandMap: LeafletMap;
  coasts: Array<Coast>;
  poi: PointOfInterest;
  poiSelected = false;

  constructor(private oileain: Oileain) {}

  public async enter(parameters: { id: string }): Promise<void> {
    this.coasts = await this.oileain.getCoasts();
  }

  async afterAttach() {
    await new Promise((resolve) => setTimeout(resolve));
    this.mainMap = new CoastalLeafletMap(this.mainMapDescriptor);
    this.islandMap = new LeafletMap(this.islandMapDescriptor);
    this.mainMap.populateCoasts(this.coasts, false, this);
  }

  async onSelect(id: string) {
    this.poi = await this.oileain.getIslandById(id);
    if (this.islandMap) {
      this.islandMap.addPopup("Islands", this.poi.name, this.poi.coordinates.geo);
      this.islandMap.moveTo(15, this.poi.coordinates.geo);
      this.islandMap.invalidateSize();
      this.poiSelected = true;
    }
  }
}
