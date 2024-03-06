var map = L.map("map").setView([37.00118, -95.359296], 3);

function getColor(d) {
  return d > 1000
    ? "#800026"
    : d > 500
    ? "#BD0026"
    : d > 200
    ? "#E31A1C"
    : d > 100
    ? "#FC4E2A"
    : d > 50
    ? "#FD8D3C"
    : d > 20
    ? "#FEB24C"
    : d > 10
    ? "#FED976"
    : "#FFEDA0";
}

var info = L.control({ position: "bottomright" });

info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info");
  var div = L.DomUtil.create("div", "legend"),
    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    labels = [];

  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' +
      getColor(grades[i] + 1) +
      '"></i> ' +
      grades[i] +
      (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }
  this._div.appendChild(div);
  this._div.appendChild(L.DomUtil.create("div"));
  this.update();
  return this._div;
};

info.update = function (props) {
  this._div.children[1].innerHTML =
    "<div><h4>US Population Density</h4>" +
    (props
      ? "<b>" +
        props.name +
        "</b><br />" +
        props.density +
        " people / mi<sup>2</sup>"
      : "Hover over a state") +
    "</div>";
};

info.addTo(map);

async function getStates() {
  let res = await fetch("us-states.json");
  let data = await res.json();

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    });
    layer.bringToFront();

    info.update(layer.feature.properties);
  }

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature,
    });
  }

  var geojson = L.geoJson(data, {
    style: function (feature) {
      return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    },
    onEachFeature: onEachFeature,
  }).addTo(map);
}

getStates();

var littleton = L.marker([39.61, -105.02]).bindPopup("This is Littleton, CO."),
  denver = L.marker([39.74, -104.99]).bindPopup("This is Denver, CO."),
  aurora = L.marker([39.73, -104.8]).bindPopup("This is Aurora, CO."),
  golden = L.marker([39.77, -105.23]).bindPopup("This is Golden, CO.");

var cities = L.layerGroup([littleton, denver, aurora, golden]);

cities.addTo(map);
