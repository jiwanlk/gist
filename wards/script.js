var map = new maplibregl.Map({
  container: "map",
  style: { version: 8, sources: {}, layers: [] },
  center: [85, 28],
  zoom: 6,
});

let server = "194.195.119.228";
// let server = "localhost";

var baseUrls = {
  wards: "http://" + server + ":3000/wards/{z}/{x}/{y}",
  derived_fconst: "http://" + server + ":3000/derived_fconst/{z}/{x}/{y}",
  derived_pconst: "http://" + server + ":3000/derived_pconst/{z}/{x}/{y}",
  provinces: "http://" + server + ":3000/provinces/{z}/{x}/{y}",
  local: "http://" + server + ":3000/local/{z}/{x}/{y}",
  districts: "http://" + server + ":3000/districts/{z}/{x}/{y}",
  federal_constituencies:
    "http://" + server + ":3000/federal_constituencies/{z}/{x}/{y}",
  provincial_constituencies:
    "http://" + server + ":3000/provincial_constituencies/{z}/{x}/{y}",
};

var layers = [
  "provinces",
  "districts",
  "local",
  "wards",
  "derived_fconst",
  "derived_pconst",
  "federal_constituencies",
  "provincial_constituencies",
];

var selected = [];

map.on("style.load", () => {
  for (let layer of selected) {
    addToMap(layer);
  }
});

function addToMap(layer) {
  map.addLayer({
    id: layer,
    type: "fill",
    source: {
      id: layer,
      type: "vector",
      tiles: [baseUrls[layer]],
    },
    "source-layer": layer,
    paint: {
      "fill-color":
        layer === "wards"
          ? "#ff0000"
          : layer === "federal_constituencies"
          ? "#00ff00"
          : "#0000ff",
      "fill-outline-color":
        layer === "wards"
          ? "#800000"
          : layer === "federal_constituencies"
          ? "#008000"
          : "#000080",
      "fill-opacity": 0.6,
    },
    layout: {},
  });
}

layers.forEach(function (layer) {
  const layerBox = document.getElementById("layer-box");
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("layer-checkbox");
  //   checkbox.checked = true;
  var label = document.createElement("label");
  label.htmlFor = layer + "-checkbox";
  label.innerText = layer;
  const outer = document.createElement("div");
  outer.appendChild(checkbox);
  outer.appendChild(label);
  layerBox.appendChild(outer);
  if (checkbox.checked) {
    selected.push(layer);
  }
  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      addToMap(layer);
    } else {
      map.removeLayer(layer);
      map.removeSource(layer);
    }
  });
});

map.on("click", "wards", async function (e) {
  let list = document.createElement("ul");
  list.classList.add("popup_content");
  let props = e.features[0].properties;

  let res = await fetch(
    `http://${server}:8000/properties?dataset=wards&id=${props.id}`
  );
  let lookupres = await fetch(
    `http://${server}:8000/constituency_lookup?ward_code=${props.WCODE}`
  );
  let properties = { ...(await res.json()), ...(await lookupres.json()) };

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

map.on("click", function (e) {
  var latitude = e.lngLat.lat;
  var longitude = e.lngLat.lng;
  console.log("Latitude: " + latitude + ", Longitude: " + longitude);
});
