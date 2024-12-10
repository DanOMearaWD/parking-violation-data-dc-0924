//IN ORDER FOR THIS CODE TO WORK YOU NEED A
//LOCAL SERVER. RUN static/py/server.py then use:
// http://localhost:8000/






//initialize geojson file location
const geojson_file = "../../output/Cleaned_Parking_Violations_DC_09_2024.geojson";

//load Geojson
d3.json(geojson_file).then(function (data) {
    console.log(data);

    // Tile layers
    const street_tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        noWrap: true // Disable tile wrapping
    });




    // Create a marker cluster group
    const marker_cluster = L.markerClusterGroup();



    //array to hold heatmap arrays [lat,lng,intensity]
    const heatmap_data = []


    // Add markers to the cluster group
    data.features.forEach(function (feature) {
        const lat = feature.geometry.coordinates[1];
        const lng = feature.geometry.coordinates[0];

        const marker = L.marker([lat, lng])
            .bindPopup(`<b>${feature.properties.violation_description}</b><br>${feature.properties.location}`);
        marker_cluster.addLayer(marker);


        heatmap_data.push([lat, lng, 0.01]);

    });


    // Create the heatmap layer using the heatmapData array
    const heatLayer = L.heatLayer(heatmap_data, {
        radius: 25,
        blur: 15,
        maxZoom: 17
    });

    //Create a heatmap layer group
    const heatmap = L.layerGroup([heatLayer]);




    const overlayMaps = {
        "Marker Cluster": marker_cluster,
        "Heatmap": heatmap
    };





    // Create the map object with intial options
    const map = L.map("map", {
        center: [38.8954, -77.0369], // Washington, D.C.
        zoom: 11, // zoom level (11 is a good default for city-level zoom)
        layers: [street_tile]  // street_tile as base layer
    });




    // Add layer control to the map with both base and overlay layers
    L.control.layers({
        "Street Map": street_tile
    }, overlayMaps, { collapsed: false }).addTo(map);






    TESTER = document.getElementById('tester');
    Plotly.newPlot(TESTER, [{
        x: [1, 2, 3, 4, 5],
        y: [1, 2, 4, 8, 16]
    }], {
        margin: { t: 0 }
    });






}).catch(function (error) {
    console.error("Error loading GeoJSON file:", error);
});
