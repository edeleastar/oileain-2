import { Poi } from "./../../routes/poi/poi";
import { ICustomElementViewModel } from "@aurelia/runtime";
import { bindable, EventAggregator } from "aurelia";
import * as L from "leaflet";
import Leaflet = L.Map;
import LayersObject = L.Control.LayersObject;
import LayerControl = L.Control.Layers;
import Layer = L.Layer;
import LayerGroup = L.LayerGroup;
import Marker = L.Marker;
import { PointOfInterest, Coast, CoastsEvent, PoiEvent, Geodetic } from "../../services/poi-types";

export class LeafletMap implements ICustomElementViewModel {
  @bindable mapid = "map-id";
  @bindable height = 1200;
  @bindable lat = 53.2734;
  @bindable lng = -7.7783203;
  @bindable zoom = 8;
  @bindable minZoom = 7;
  @bindable activeLayer = "Terrain";

  imap: Leaflet;
  control: LayerControl;
  overlays: LayersObject = {};
  markerMap = new Map<Marker, PointOfInterest>();

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
      },
    ),
  };

  constructor(private ea: EventAggregator) {
    this.ea.subscribe("coasts", (event: CoastsEvent) => {
      if (this.mapid == event.mapid) {
        this.populateCoasts(event.coasts, event.link);
      }
    });
    this.ea.subscribe("poi", (event: PoiEvent) => {
      if (this.mapid == event.mapid) {
        this.populatePoi(event.poi);
      }
    });
  }

  async afterAttach() {
    await new Promise((resolve) => setTimeout(resolve));
    let defaultLayer = this.baseLayers[this.activeLayer];
    this.imap = L.map(this.mapid, {
      center: [this.lat, this.lng],
      zoom: this.zoom,
      minZoom: this.minZoom,
      layers: [defaultLayer],
    });
    this.addControl();
  }

  addControl() {
    this.control = L.control.layers(this.baseLayers, this.overlays).addTo(this.imap);
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

  populateCoast(coast: Coast, link: boolean = true) {
    let group = L.layerGroup([]);
    coast.pois.forEach((poi) => {
      let marker = L.marker([poi.coordinates.geo.lat, poi.coordinates.geo.long]);
      var newpopup = L.popup({ autoClose: false, closeOnClick: false });
      const popupTitle = link
        ? `<a href='/poi(${poi.safeName})'>${poi.name} <small>(click for details}</small></a>`
        : poi.name;
      newpopup.setContent(popupTitle);
      marker.bindPopup(newpopup);
      marker.bindTooltip(poi.name);
      marker.addTo(group);
      this.markerMap.set(marker, poi);
      marker.addTo(group).on("popupopen", (event) => {
        const marker = event.popup._source;
        const shortPoi = this.markerMap.get(marker);
        this.ea.publish("poiselect", shortPoi.safeName);
      });
    });
    this.addLayer(coast.title, group);
    this.control.addOverlay(group, coast.title);
  }

  populateCoasts(coasts: Array<Coast>, link: boolean = true) {
    if (this.imap) {
      coasts.forEach((coast) => {
        this.populateCoast(coast, link);
      });
      this.imap.invalidateSize();
    }
  }

  populatePoi(poi: PointOfInterest) {
    if (this.imap) {
      this.addPopup("Islands", poi.nameHtml, poi.coordinates.geo);
      this.moveTo(15, poi.coordinates.geo);
      this.invalidateSize();
    }
  }
}
