import { inject, HttpClient } from "aurelia";
import { Coast, PointOfInterest } from "./poi-types";

@inject(HttpClient)
export class Oileain {
  coasts: any[];
  islandMap = new Map<string, PointOfInterest>();
  coastMap = new Map<string, Coast>();

  constructor(private http: HttpClient) {}

  async getCoasts() {
    if (!this.coasts) {
      const response = await this.http.fetch("https://edeleastar.github.io/oileain-api/all-slim.json");
      this.coasts = await response.json();
      this.createIndexes();
    }
    return this.coasts;
  }

  async getIslandById(id: string) {
    return await this.getIsland(this.islandMap.get(id));
  }

  async getIsland(poi: PointOfInterest) {
    let cachedPoi = await this.islandMap.get(poi.safeName);
    if (cachedPoi.description) {
      return cachedPoi;
    } else {
      const path = `https://edeleastar.github.io/oileain-api/${poi.coast.variable}/${poi.safeName}.json`;
      const response = await this.http.fetch(path);
      const island = await response.json();
      island.safeName = poi.safeName;
      this.islandMap.set(poi.safeName, island);
      return island;
    }
  }

  createIndexes() {
    this.coasts.forEach((coast) => {
      this.coastMap.set(coast.variable, coast);
      coast.pois.forEach((poi) => {
        poi.coast = coast;
        poi.safeName = encodeURI(poi.safeName);
        this.islandMap.set(poi.safeName, poi);
      });
    });
  }
}
