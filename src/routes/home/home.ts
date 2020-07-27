import { LeafletMap } from "../../services/leaflet-map";

import { IViewModel } from "aurelia";
import { CoastalLeafletMap } from "../../services/coastal-leaflet-map";
import { Coast } from "../../services/poi";
import { Oileain } from "../../services/oileain";

export class Home implements IViewModel {
    mapDescriptor = {
      id: "home-map-id",
      height: 1200,
      location: { lat: 53.2734, long: -7.7783203 },
      zoom: 8,
      minZoom: 7,
      activeLayer: "",
    };
  
    map: CoastalLeafletMap;
    coasts: Array<Coast>;
  
    constructor(private oileain: Oileain) {}
  
    public async enter(parameters: { id: string }): Promise<void> {
      this.coasts = await this.oileain.getCoasts();
    }
  
    async afterAttach() {
      await new Promise(resolve => setTimeout(resolve));
      this.map = new CoastalLeafletMap(this.mapDescriptor);
      if (this.coasts) {
        this.map.populateCoasts(this.coasts);
      }
    }
  }
