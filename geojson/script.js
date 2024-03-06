var map = L.map("map").setView([51.79863262764456, 4.437842656838879], 19);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

var geojsonFeature = {
  type: "Feature",
  properties: {
    name: "Coors Field",
    amenity: "Baseball Stadium",
    popupContent: "This is where the Rockies play!",
  },
  geometry: {
    type: "Point",
    coordinates: [-104.99404, 39.75621],
  },
};

L.geoJson(geojsonFeature, {
  onEachFeature: function (f, l) {
    if (f.properties && f.properties.popupContent) {
      l.bindPopup(f.properties.popupContent);
    }
  },
}).addTo(map);

var myLines = [
  {
    type: "LineString",
    properties: { highway: "mahendra" },
    coordinates: [
      [-100, 40],
      [-105, 45],
      [-110, 55],
    ],
  },
  {
    type: "LineString",
    properties: { highway: "prithivi" },
    coordinates: [
      [-105, 40],
      [-110, 45],
      [-115, 55],
    ],
  },
];

var myStyle = {
  color: "#ff7800",
  weight: 5,
  opacity: 0.65,
};

L.geoJson(myLines, {
  style: function (feature) {
    var geometry = feature.geometry;
    console.log(geometry);
    switch (geometry.properties.highway) {
      case "mahendra":
        return { color: "#ff0000" };
      case "prithivi":
        return { color: "#0000ff" };
    }
  },
}).addTo(map);

var polyJson = {
  type: "Feature",
  properties: {
    postalCode: "3273",
  },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [4.43, 51.798],
        [4.44, 51.898],
        [4.45, 51.798],
      ],
    ],
  },
};
var geojsonMarkerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};
L.geoJSON(polyJson, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, geojsonMarkerOptions);
  },
}).addTo(map);
