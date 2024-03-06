var map = L.map("map").setView([40.799311, -74.118464], 10);
map.createPane("labels");

map.getPane("labels").style.zIndex = 650;

map.getPane("labels").style.pointerEvents = "none";

var positron = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
  {
    attribution: "©OpenStreetMap, ©CartoDB",
  }
).addTo(map);

var positronLabels = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
  {
    attribution: "©OpenStreetMap, ©CartoDB",
    pane: "labels",
  }
).addTo(map);

var imageUrl = "https://maps.lib.utexas.edu/maps/historical/newark_nj_1922.jpg";
var errorOverlayUrl = "https://cdn-icons-png.flaticon.com/512/110/110686.png";
var altText =
  "Image of Newark, N.J. in 1922. Source: The University of Texas at Austin, UT Libraries Map Collection.";
var latLngBounds = L.latLngBounds([
  [40.799311, -74.118464],
  [40.68202047785919, -74.33],
]);

var imageOverlay = L.imageOverlay(imageUrl, latLngBounds, {
  opacity: 0.8,
  errorOverlayUrl: errorOverlayUrl,
  alt: altText,
  interactive: true,
}).addTo(map);

L.rectangle(latLngBounds).addTo(map);
map.fitBounds(latLngBounds);

var videoUrls = [
  "https://www.mapbox.com/bites/00188/patricia_nasa.webm",
  "https://www.mapbox.com/bites/00188/patricia_nasa.mp4",
];

var videoBounds = L.latLngBounds([
  [32, -130],
  [13, -100],
]);

var videoOverlay = L.videoOverlay(videoUrls, videoBounds, {
  opacity: 0.8,
  errorOverlayUrl,
  interactive: true,
  muted: true,
  playsInline: true,
}).addTo(map);

L.rectange(videoBounds).addTo(map);
