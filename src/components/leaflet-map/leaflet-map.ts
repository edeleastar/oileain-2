import { ICustomElementViewModel } from "@aurelia/runtime";
import { bindable } from "aurelia";
import * as L from "leaflet";
import Map = L.Map;
import LayersObject = L.Control.LayersObject;
import LayerControl = L.Control.Layers;
import Layer = L.Layer;
import LayerGroup = L.LayerGroup;

export interface Geodetic {
  lat: number;
  long: number;
}

export class LeafletMap implements ICustomElementViewModel {
  @bindable mapid = "map-id";
  @bindable height = 1200;
  @bindable lat = 53.2734;
  @bindable lng = -7.7783203;
  @bindable zoom = 8;
  @bindable minZoom = 7;

  imap: Map;
  control: LayerControl;
  overlays: LayersObject = {};

  baseLayers = {
    Terrain: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 17,
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }),
    Satellite: L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      }
    ),
  };

  async afterAttach() {
    await new Promise((resolve) => setTimeout(resolve));
    let defaultLayer = this.baseLayers.Terrain;
    this.imap = L.map(this.mapid, {
      center: [this.lat, this.lng],
      zoom: this.zoom,
      minZoom: this.minZoom,
      layers: [defaultLayer],
    });
    this.addControl();
  }

  addControl() {
    this.control = L.control
      .layers(this.baseLayers, this.overlays)
      .addTo(this.imap);
  }

  addLayer(title: string, layer: Layer) {
    this.overlays[title] = layer;
    this.imap.addLayer(layer);
  }

  moveTo(zoom: number, location: Geodetic) {
    this.imap.setZoom(zoom);
    this.imap.panTo(new L.LatLng(location.lat, location.long));
  }

  zoomTo(location: Geodetic) {
    this.imap.setView(new L.LatLng(location.lat, location.long), 8);
  }

  addPopup(layerTitle: string, content: string, location: Geodetic) {
    let popupGroup: LayerGroup;
    if (!this.overlays[layerTitle]) {
      popupGroup = L.layerGroup([]);
      this.overlays[layerTitle] = popupGroup;
      this.imap.addLayer(popupGroup);
    } else {
      popupGroup = this.overlays[layerTitle] as LayerGroup;
    }
    const popup = L.popup({
      closeOnClick: false,
      closeButton: false,
    })
      .setLatLng({ lat: location.lat, lng: location.long })
      .setContent(content);
    popup.addTo(popupGroup);
  }

  invalidateSize() {
    this.imap.invalidateSize();
    let hiddenMethodMap = this.imap as any;
    hiddenMethodMap._onResize();
  }
}
