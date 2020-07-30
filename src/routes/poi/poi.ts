import { EventAggregator } from "aurelia";
import { Oileain } from "../../services/oileain";
import { PointOfInterest } from "../../services/poi";
import { IRouteableComponent } from '@aurelia/router';
export class Poi implements IRouteableComponent {
  title = "Olieain POI View";
  poi: PointOfInterest;

  constructor(private oileain: Oileain, private ea: EventAggregator) {}

  public async enter(parameters: { id: string }): Promise<void> {
    await this.oileain.getCoasts();
    const poi = await this.oileain.getIslandById(parameters[0]);
    this.renderPoi(poi);
  }
  
  async afterAttach() {
    await new Promise((resolve) => setTimeout(resolve));
    if (this.poi) {
      this.renderPoi(this.poi);
    }
  }

  renderPoi(poi) {
    this.poi = poi;
    this.title = poi.name;
    this.ea.publish("poi", this.poi);
  }
}
