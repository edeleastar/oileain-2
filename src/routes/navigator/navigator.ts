import { PointOfInterest, Coast, PoiSelect } from "../../services/poi-types";
import { Oileain } from "../../services/oileain";
import { EventAggregator } from "aurelia";

export class Navigator {
  coasts: Array<Coast>;
  poi: PointOfInterest;
  poiSelected = false;

  constructor(private oileain: Oileain, private ea: EventAggregator) {
    this.ea.subscribe("poiselect", async (poiname: string) => {
      this.poi = await this.oileain.getIslandById(poiname);
      this.ea.publish("poi", { mapid: "island", poi: this.poi });
      this.poiSelected = true;
    });
  }

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
      });
    }
  }
}
