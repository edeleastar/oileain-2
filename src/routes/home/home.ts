import { EventAggregator } from "aurelia";
import { Coast } from "../../services/poi-types";
import { Oileain } from "../../services/oileain";
import { IRouteableComponent } from '@aurelia/router';

export class Home implements IRouteableComponent  {
  coasts: Array<Coast>;

  constructor(private oileain: Oileain, private ea: EventAggregator) {}

  public async enter(parameters: { id: string }): Promise<void> {
    this.coasts = await this.oileain.getCoasts();
  }

  async afterAttach() {
    await new Promise((resolve) => setTimeout(resolve));
    if (this.coasts) {
      this.ea.publish("coasts", { mapid: "home", coasts: this.coasts });
    }
  }
}
