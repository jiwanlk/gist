let key = "redacted";
var map = new maplibregl.Map({
  container: "map",
  style: "https://api.maptiler.com/maps/basic-v2/style.json?key=" + key,
  center: [85.5, 27.5],
  pitch: 61,
  antialias: true,
  zoom: 10,
});

var nepal = new maplibregl.Marker().setLngLat([85.5, 27.5]).addTo(map);

map.on("load", async function () {
  add_buildings();
  add_airports();
  add_animated_line();
  add_population_density();
});

map.on("click", "Airports", function (e) {
  let location = e.features[0].properties.location;
  new maplibregl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(location + " Airport, Nepal")
    .addTo(map);
});

function add_population_density() {
  map.addSource("provinces", {
    type: "geojson",
    data: "/maplibre/nepal-states.geojson",
  });

  map.addLayer({
    id: "province-bound",
    type: "line",
    source: "provinces",
    paint: {
      "line-width": 5,
    },
  });

  map.addLayer({
    id: "nprovinces",
    type: "fill",
    source: "provinces",
    layout: {},
    paint: {
      "fill-color": [
        "let",
        "density",
        ["get", "population"],
        [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          [
            "interpolate",
            ["linear"],
            ["var", "density"],
            100000,
            ["to-color", "#edf8e9"],
            5000000,
            ["to-color", "#08519c"],
          ],
          10,
          [
            "interpolate",
            ["linear"],

            ["var", "density"],
            100000,
            ["to-color", "#eff3ff"],
            5000000,
            ["to-color", "#08519c"],
          ],
        ],
      ],
      "fill-opacity": 0.7,
    },
  });
}

function add_animated_line() {
  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [[0, 0]],
        },
      },
    ],
  };

  const speedFactor = 30;
  let animation;
  let startTime = 0;
  let progress = 0;
  let resetTime = false;
  const pauseButton = document.getElementById("pause");

  map.addSource("line", {
    type: "geojson",
    data: geojson,
  });

  map.addLayer({
    id: "line-animation",
    type: "line",
    source: "line",
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#ed6498",
      "line-width": 5,
      "line-opacity": 0.8,
    },
  });

  startTime = performance.now();

  animateLine();

  pauseButton.addEventListener("click", () => {
    pauseButton.classList.toggle("pause");
    if (pauseButton.classList.contains("pause")) {
      cancelAnimationFrame(animation);
    } else {
      resetTime = true;
      animateLine();
    }
  });

  document.addEventListener("visibilitychange", () => {
    resetTime = true;
  });

  function animateLine(timestamp) {
    if (resetTime) {
      startTime = performance.now() - progress;
      resetTime = false;
    } else {
      progress = timestamp - startTime;
    }

    if (progress > speedFactor * 360) {
      startTime = timestamp;
      geojson.features[0].geometry.coordinates = [];
    } else {
      const x = progress / speedFactor;
      const y = Math.sin((x * Math.PI) / 90) * 40;
      geojson.features[0].geometry.coordinates.push([x, y]);
      map.getSource("line").setData(geojson);
    }
    animation = requestAnimationFrame(animateLine);
  }
}

function add_buildings() {
  const layers = map.getStyle().layers;

  let labelLayerId;
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].type === "symbol" && layers[i].layout["text-field"]) {
      labelLayerId = layers[i].id;
      break;
    }
  }

  map.addSource("openmaptiles", {
    url: "https://api.maptiler.com/tiles/v3/tiles.json?key=" + key,
    type: "vector",
  });

  map.addLayer(
    {
      id: "3d-buildings",
      source: "openmaptiles",
      "source-layer": "building",
      type: "fill-extrusion",
      minzoom: 15,
      paint: {
        "fill-extrusion-color": [
          "interpolate",
          ["linear"],
          ["get", "render_height"],
          0,
          "lightgray",
          200,
          "royalblue",
          400,
          "lightblue",
        ],
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          16,
          ["get", "render_height"],
        ],
        "fill-extrusion-base": [
          "case",
          [">=", ["get", "zoom"], 16],
          ["get", "render_min_height"],
          0,
        ],
      },
    },
    labelLayerId
  );
}

async function add_airports() {
  map.addSource("Airport_points", {
    type: "geojson",
    data: "/maplibre/airports.json",
  });

  let res = await map.loadImage(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Pictograms-nps-airport.svg/1200px-Pictograms-nps-airport.svg.png"
  );

  map.addImage("Airport_icon", res.data);

  map.addLayer({
    id: "Airports",
    type: "symbol",
    source: "Airport_points",
    layout: {
      "icon-image": "Airport_icon",
      "icon-size": 0.02,
    },
  });
}
