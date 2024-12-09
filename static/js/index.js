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

    // Create the map object with intial options
    const map = L.map("map", {
        center: [38.8954, -77.0369], // Washington, D.C.
        zoom: 11, // zoom level (11 is a good default for city-level zoom)
        layers: [street_tile]  // street_tile as base layer
    });


    // Create a marker cluster group
    const markers = L.markerClusterGroup();


    // Add markers to the cluster group
    data.features.forEach(function (feature) {
        const lat = feature.geometry.coordinates[1];
        const lng = feature.geometry.coordinates[0];

        if (lat && lng) {
            const marker = L.marker([lat, lng])
                .bindPopup(`<b>${feature.properties.violation_description}</b><br>${feature.properties.location}`);

            markers.addLayer(marker);
        }
    });

    // Add marker cluster group to the map
    map.addLayer(markers);










}).catch(function (error) {
    console.error("Error loading GeoJSON file:", error);
});
