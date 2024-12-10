//IN ORDER FOR THIS CODE TO WORK YOU NEED A
//LOCAL SERVER. RUN static/py/server.py then use:
// http://localhost:8000/


// FUNCTIONS
function formatDate(date) {

    //maps
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const weekday = weekdays[date.getDay()]; // Get the weekday name
    const month = months[date.getMonth()]; // Get the month name
    const day = date.getDate(); // Day of the month
    const year = date.getFullYear(); // Full year
    let hours = date.getHours(); // Hour (0-23)
    const minutes = date.getMinutes(); // Minute (0-59)


    let ampm = 'AM';
    if (hours >= 12) {
        ampm = 'PM';
    }

    if (hours > 12) {
        hours -= 12;  // Convert hours from 24-hour format to 12-hour format
    } else if (hours === 0) {
        hours = 12;  // Midnight (0 hours) should be displayed as 12
    }

    let minutesStr = minutes;
    if (minutes < 10) {
        minutesStr = '0' + minutes; // Add leading zero to minutes
    }

    return `${weekday}, ${month} ${day}, ${year}, ${hours}:${minutesStr} ${ampm}`;
}




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


        const date = new Date(feature.properties.date);





        const marker = L.marker([lat, lng])
            .bindPopup(`
                <strong>${feature.properties.violation_description}</strong><br />
                <strong>${formatDate(date)}</strong>
            `);
        marker_cluster.addLayer(marker);


        heatmap_data.push([lat, lng, 0.007]);

    });


    // Create the heatmap layer using the heatmapData array
    const heatLayer = L.heatLayer(heatmap_data, {
        radius: 25,
        blur: 15,
        maxZoom: 16
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
        layers: [street_tile, heatmap]  // street_tile as base layer
    });




    // Add layer control to the map with both base and overlay layers
    L.control.layers({
        "Street Map": street_tile
    }, overlayMaps, { collapsed: false }).addTo(map);











}).catch(function (error) {
    console.error("Error loading GeoJSON file:", error);
});
