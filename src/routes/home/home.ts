import { EventAggregator, IRouter } from "aurelia";
import { Coast } from "../../services/poi-types";
import { Oileain } from "../../services/oileain";
import { IRouteableComponent } from '@aurelia/router';

export class Home implements IRouteableComponent  {
  coasts: Array<Coast>;

  constructor(@IRouter private router: IRouter, private oileain: Oileain, private ea: EventAggregator) {
    // this.ea.subscribe("poiselect", (poiname: string) => {
    //   this.router.goto(`/poi(${poiname})`);
    // });
  }

  public async enter(parameters: { id: string }): Promise<void> {
    this.coasts = await this.oileain.getCoasts();
  }

  dispose() {

  }

  async afterAttach() {
    await new Promise((resolve) => setTimeout(resolve));
    if (this.coasts) {
      this.ea.publish("coasts", { mapid: "home", coasts: this.coasts, link:true });
    }
  }
}
