import { PointOfInterest, Coast, PoiSelect } from "../../services/poi-types";
import { Oileain } from "../../services/oileain";
import { EventAggregator } from "aurelia";

export class Navigator implements PoiSelect {
  coasts: Array<Coast>;
  poi: PointOfInterest;
  poiSelected = false;

  constructor(private oileain: Oileain, private ea: EventAggregator) {}

  public async enter(parameters: { id: string }): Promise<void> {
    this.coasts = await this.oileain.getCoasts();
  }

  async afterAttach() {
    await new Promise((resolve) => setTimeout(resolve));
    if (this.coasts) {
      this.ea.publish("coasts", {
        mapid: "ireland",
        coasts: this.coasts,
        link: false,
        poiSelect: this,
      });
    }
  }

  async onSelect(id: string) {
    this.poi = await this.oileain.getIslandById(id);
    this.ea.publish("poi", { mapid: "island", poi: this.poi });
    this.poiSelected = true;
  }
}
