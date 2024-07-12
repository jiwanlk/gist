var map = new maplibregl.Map({
  container: "map",
  style: "https://demotiles.maplibre.org/style.json",
  center: [85, 27],
  antialias: true,
  zoom: 6,
});

let tileUrl = "http://localhost:3000/fconst/{z}/{x}/{y}";
let ptileUrl = "http://localhost:3000/pconst/{z}/{x}/{y}";

map.on("style.load", () => {
  map.addLayer({
    id: "pconst",
    type: "fill",
    source: {
      id: "pconst_src",
      type: "vector",
      tiles: [ptileUrl],
    },
    "source-layer": "pconst",
    paint: {
      "fill-color": "#ffffff", // Same fill color for all wards
      "fill-opacity": 0.3,
      "fill-outline-color": "rgba(0, 0, 0, 0.8)", // Darker outline color
    },
  });
  map.addLayer({
    id: "wards",
    type: "fill",
    source: {
      id: "wards_src",
      type: "vector",
      tiles: [tileUrl],
    },
    "source-layer": "fconst",
    paint: {
      "fill-color": "#100100", // Same fill color for all wards
      "fill-opacity": 0.3,
      "fill-outline-color": "rgba(255, 0, 0, 0.8)", // Darker outline color
    },
  });
});

map.on("click", "pconst", async function (e) {
  let list = document.createElement("ul");
  list.classList.add("popup_content");
  console.log(e.features[0].properties);
  id = e.features[0].properties.id;

  let res = await fetch(
    `http://localhost:8000/properties?dataset=pconst&id=${id}`
  );
  let properties = await res.json();

  for (let property of Object.keys(properties).sort()) {
    if (
      properties[property] == null ||
      property == "id" ||
      property == "geom"
    ) {
      continue;
    }
    let listItem = document.createElement("li");
    listItem.innerHTML = `<b>${property}</b>: ${properties[property]}`;
    list.appendChild(listItem);
  }
  new maplibregl.Popup().setLngLat(e.lngLat).setHTML(list.outerHTML).addTo(map);
});

document
  .getElementById("operatorTypeSelect")
  .addEventListener("change", function (e) {
    let selectedOperatorType = e.target.value;
    let mapLayers = map.getStyle().layers;

    // Remove existing school layer
    mapLayers.forEach(function (layer) {
      if (layer.id === "schools") {
        map.removeLayer("schools");
        map.removeSource("schools");
      }
    });

    // Add new school layer with updated tile URL
    map.addLayer({
      id: "schools",
      type: "circle",
      source: {
        id: "schools_source",
        type: "vector",
        tiles: [tileUrl + "&lat=27&" + "&lng=85" + "&radius=5000000"],
      },
      "source-layer": "filter_schools",
    });
  });
