var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

function markerSize(magnitude) {
    return magnitude * 2;
};

var earthquakes = new L.LayerGroup();

d3.json(earthquakeURL, function(geoJSON) {
    L.geoJSON(geoJSON.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },
        
        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.5,
                weight: 0.5,
                color: 'black'

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }


    }).addTo(earthquakes);
    createMap(earthquakes);
});   
    // Set color according to magnitude
    function Color(magnitude) {
        if (magnitude > 5) {
            return 'brick'
        } else if (magnitude > 4) {
            return 'salmon'
        } else if (magnitude > 3) {
            return 'orange'
        } else if (magnitude > 2) {
            return 'tan'
        } else if (magnitude > 1) {
            return 'yellow'
        } else {
            return 'lightgreen'
        }
    };

    // Create map
    function createMap() {

        // Define streetmap
        var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 18,
          id: "mapbox.streets",
          accessToken: API_KEY
        });

        var baseLayers = {
            "Street": streetmap
        };
    
        var overlays = {
            "Earthquakes": earthquakes
        };

        var mymap = L.map("mymap", {
            center: [37.09, -95.71],
            zoom: 6,
            layers: [streetmap, earthquakes]
        });

        L.control.layers(baseLayers, overlays).addTo(mymap);
    };

