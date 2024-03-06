var map = L.map("map").setView([50, 50], 6);

// L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   maxZoom: 16,
// }).addTo(map);

var wmsLayer = L.tileLayer
  .wms("http://ows.mundialis.de/services/service?", {
    layers: "TOPO-WMS,OSM-Overlay-WMS",
  })
  .addTo(map);

var basemaps = {
  Topography: L.tileLayer.wms("http://ows.mundialis.de/services/service?", {
    layers: "TOPO-WMS",
  }),

  Places: L.tileLayer.wms("http://ows.mundialis.de/services/service?", {
    layers: "OSM-Overlay-WMS",
  }),

  "Topography, then places": L.tileLayer.wms(
    "http://ows.mundialis.de/services/service?",
    {
      layers: "TOPO-WMS,OSM-Overlay-WMS",
    }
  ),

  "Places, then topography": L.tileLayer.wms(
    "http://ows.mundialis.de/services/service?",
    {
      layers: "OSM-Overlay-WMS,TOPO-WMS",
    }
  ),
};

L.control.layers(basemaps).addTo(map);

basemaps.Topography.addTo(map);
