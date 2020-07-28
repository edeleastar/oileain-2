import { Oileain } from "../../services/oileain";
import { Coast } from "../../services/poi";

export class CoastsSidebar {
  coasts: Array<Coast>;

  constructor(private oileain: Oileain) {
    this.loadCoasts();
  }

  async loadCoasts() {
    this.coasts = await this.oileain.getCoasts();
  }
}
