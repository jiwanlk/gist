var map = new maplibregl.Map({
  container: "map",
  style: "https://demotiles.maplibre.org/style.json",
  center: [85, 27],
  antialias: true,
  zoom: 6,
});

let server = "localhost";

let tileUrl = `http://${server}:3000/filter_schools/{z}/{x}/{y}?lat=27&lng=85&radius=300000&operator_type=government`;

map.on("style.load", async () => {
  //   let res = await map.loadImage(
  //     "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Pictograms-nps-airport.svg/1200px-Pictograms-nps-airport.svg.png"
  //   );

  //   map.addImage("Airport_icon", res.data);

  map.addSource("schools_src", {
    type: "vector",
    tiles: [tileUrl],
  });

  map.addLayer({
    id: "schools",
    type: "circle",
    source: "schools_src",
    "source-layer": "filter_schools",
    // filter: [">", "point_count", 1],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#51bbd6",
        100,
        "#f1f075",
        750,
        "#f28cb1",
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "schools_src",
    "source-layer": "filter_schools",
    filter: [">", "point_count", 1],
    layout: {
      "text-field": "{point_count}",
      "text-size": 12,
    },
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    "source-layer": "filter_schools",
    source: "schools_src",
    filter: ["==", "point_count", 1],
    paint: {
      "circle-color": "#11b4da",
      "circle-radius": 4,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });
});

map.on("click", "schools", async function (e) {
  let list = document.createElement("ul");
  list.classList.add("popup_content");
  console.log(e.features[0].properties);
  id = e.features[0].properties.id;

  let res = await fetch(
    `http://${server}:8000/properties?dataset=schools&id=${id}`
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

// document
//   .getElementById("operatorTypeSelect")
//   .addEventListener("change", function (e) {
//     let selectedOperatorType = e.target.value;
//     let mapLayers = map.getStyle().layers;

//     // Remove existing school layer
//     mapLayers.forEach(function (layer) {
//       if (layer.id === "schools") {
//         map.removeLayer("schools");
//         map.removeSource("schools");
//       }
//     });

//     // Add new school layer with updated tile URL
//     map.addLayer({
//       id: "schools",
//       type: "circle",
//       source: {
//         id: "schools_source",
//         type: "vector",
//         tiles: [tileUrl + "&lat=27&" + "&lng=85" + "&radius=5000000"],
//       },
//       "source-layer": "filter_schools",
//     });
//   });
