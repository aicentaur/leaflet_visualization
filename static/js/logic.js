// Creating map object
var map = L.map("map", {
  center: [40, -99],
  zoom: 4.5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

// Function that will determine the color of a earthquake location based on the magnitude it belongs to
function chooseColor(mag) {
  if (mag > 5) {return "red"}
  else if (mag > 4) {return "orange"}
  else if (mag > 3) {return "yellow"}
  else if (mag > 2) {return "green"}
  else if (mag > 1) {return "blue"}
  else {return "purple"}
}

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

  // Grabbing our GeoJSON data..
d3.json(link).then(function(data) {
    // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {
      style: function(feature) {
        return {
          fillColor: chooseColor(feature.properties.mag),
          fillOpacity: 0.5,
          weight: 0.5,
          radius: feature.properties.mag*8
        };
      },
// Create a circle symbol to use with a GeoJSON layer instead of the default blue marker
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },

      onEachFeature: function(feature, layer) {
        // Set mouse events to change map styling
        layer.on({
          // When a user's mouse touches a map feature, the mouseover event calls this function; that feature's opacity changes to 90% so that it stands out
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 1.5
            });
          },
          // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
          mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.5
            });
          },
        });
        // Giving each feature a pop-up with information pertinent to it
        layer.bindPopup(`<h4>MAGNITUDE:</h4> ${feature.properties.mag}<hr>
                        <h4>LOCATION:</h4> ${feature.properties.place}`)
      }
    }).addTo(map);
  });

//Legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        mag = [0,1,2,3,4,5],
        labels = [];

    div.innerHTML += "<h4 style='margin:4px'>MAGNITUDE</h4>"

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < mag.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(mag[i] + 1) + '"></i> ' +
            mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(map);