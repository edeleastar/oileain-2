
import { bindable, inject, HttpClient } from 'aurelia';

@inject(HttpClient)
export class Oileain {
  coasts: any[];

  constructor(private http: HttpClient) {}

  async getCoasts() {
    if (!this.coasts) {
      const response = await this.http.fetch("https://edeleastar.github.io/oileain-api/all-slim.json");
      this.coasts = await response.json();
    }
    console.log(this.coasts);
    return this.coasts;
  }
}
