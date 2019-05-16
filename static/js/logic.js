// Creating map object
var map = L.map("map", {
  center: [40, -99],
  zoom: 4.3
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

function chooseColor(mag) {
    switch (mag) {
    case (mag > 5): return "yellow";
    case (mag > 4): return "red";
    case (mag > 3): return "orange";
    case (mag > 2): return "green";
    case (mag > 1): return "purple";
    default: return "red";
    }
  }

  console.log("switch function works")

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

  // Grabbing our GeoJSON data..
d3.json(link).then(function(data) {
    // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {
      style: function(feature) {
        return {
          color: "white",
          fillColor: chooseColor(feature.properties.mag),
          fillOpacity: 0.5,
          weight: 0.5
        };
      }
    }).addTo(map);
  });