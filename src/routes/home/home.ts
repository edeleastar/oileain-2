import { IViewModel, EventAggregator } from "aurelia";
import { Coast } from "../../services/poi";
import { Oileain } from "../../services/oileain";

export class Home implements IViewModel {
  coasts: Array<Coast>;

  constructor(private oileain: Oileain, private ea: EventAggregator) {}

  public async enter(parameters: { id: string }): Promise<void> {
    this.coasts = await this.oileain.getCoasts();
  }

  async afterAttach() {
    await new Promise((resolve) => setTimeout(resolve));
    if (this.coasts) {
      this.ea.publish("coasts", this.coasts);
    }
  }
}
