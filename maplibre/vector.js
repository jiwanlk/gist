key = "redacted";
var map = new maplibregl.Map({
  container: "map",
  style: "https://api.maptiler.com/maps/streets/style.json?key=" + key,
  center: [84.5, 28.5],
  antialias: true,
  zoom: 6,
});

map.on("load", () => {
  map.addSource("nepal-states-src", {
    type: "vector",
    url: "http://localhost:8080/data/nepal-states.json",
  });
  map.addLayer({
    id: "nepal-states",
    type: "fill",
    source: "nepal-states-src",
    "source-layer": "nepalstatesnewcs",
  });
  map.addLayer({
    id: "nepal-states-outline",
    type: "line",
    source: "nepal-states-src",
    "source-layer": "nepalstatesnewcs",
    paint: {
      "line-color": "#ff0000",
      "line-width": 2,
    },
  });
});
