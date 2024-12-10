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






    // Create a marker cluster group
    const marker_cluster = L.markerClusterGroup();



    //array to hold heatmap arrays [lat,lng,intensity]
    const heatmap_data = []


    //count of each violation description
    const violationDescriptionCounts = {};

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


        const violationDescription = feature.properties.violation_description;

        // Check if this violation description is already in the counts object
        if (violationDescriptionCounts[violationDescription]) {
            violationDescriptionCounts[violationDescription]++;  // Increment the count
        } else {
            violationDescriptionCounts[violationDescription] = 1;  // Initialize the count to 1
        }


    });





    // Create the heatmap layer using the heatmapData array
    const heatLayer = L.heatLayer(heatmap_data, {
        radius: 25,
        blur: 15,
        maxZoom: 16
    });

    //Create a heatmap layer group
    const heatmap = L.layerGroup([heatLayer]);




    // Tile layers
    const street_tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        noWrap: true // Disable tile wrapping
    });

    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community',
        noWrap: true
    });

    const minimalist = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors, &copy; CartoDB',
        noWrap: true
    });






    // Define baseMaps (use base maps as first parameter)
    const baseMaps = {
        "Minimalist": minimalist,
        "Street Map": street_tile,
        "Satellite": satellite
    };

    // Define overlayMaps (use overlay maps as second parameter)
    const overlayMaps = {
        "Marker Cluster": marker_cluster,
        "Heatmap": heatmap
    };





    // Create the map object with intial options
    const map = L.map("map", {
        center: [38.8954, -77.0369], // Washington, D.C.
        zoom: 11, // zoom level (11 is a good default for city-level zoom)
        layers: [minimalist, heatmap]  // street_tile as base layer
    });




    // Add layer control to the map with both base and overlay layers
    L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);





    // Remove violation descriptions with counts less than 3000
    for (const description in violationDescriptionCounts) {
        if (violationDescriptionCounts[description] < 3000) {
            delete violationDescriptionCounts[description];  // Remove the entry
        }
    }

    // Sort violation descriptions by count (in descending order)
    const sortedViolationDescriptions = Object.entries(violationDescriptionCounts)
        .sort((a, b) => b[1] - a[1]);  // Sort by count (value) in descending order

    // Prepare the labels and data for the chart
    const violationDescriptions = sortedViolationDescriptions.map(item => item[0]);  // Sorted labels
    const violationCounts = sortedViolationDescriptions.map(item => item[1]);  // Sorted counts










    // Create the donut chart with Chart.js
    const ctx = document.getElementById('donutChart').getContext('2d');
    const donutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: violationDescriptions,  // Violation descriptions as labels
            datasets: [{
                label: 'Violation Descriptions',
                data: violationCounts,  // Counts of each violation description
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',   // Red
                    'rgba(54, 162, 235, 0.2)',   // Blue
                    'rgba(255, 206, 86, 0.2)',   // Yellow
                    'rgba(75, 192, 192, 0.2)',   // Teal
                    'rgba(153, 102, 255, 0.2)',  // Purple
                    'rgba(255, 159, 64, 0.2)',   // Orange
                    'rgba(0, 255, 0, 0.2)',      // Green
                    'rgba(255, 99, 255, 0.2)',   // Pink
                    'rgba(255, 165, 0, 0.2)',    // Amber
                    'rgba(100, 100, 255, 0.2)',  // Light Blue
                ],

                borderColor: [
                    'rgba(255, 99, 132, 1)',     // Red
                    'rgba(54, 162, 235, 1)',     // Blue
                    'rgba(255, 206, 86, 1)',     // Yellow
                    'rgba(75, 192, 192, 1)',     // Teal
                    'rgba(153, 102, 255, 1)',    // Purple
                    'rgba(255, 159, 64, 1)',     // Orange
                    'rgba(0, 255, 0, 1)',        // Green
                    'rgba(255, 99, 255, 1)',     // Pink
                    'rgba(255, 165, 0, 1)',      // Amber
                    'rgba(100, 100, 255, 1)',    // Light Blue
                ],

                borderWidth: 1.5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            // Format the number with commas
                            return `${tooltipItem.raw.toLocaleString()} violations`;
                        }
                    }
                }
            }
        }
    });














}).catch(function (error) {
    console.error("Error loading GeoJSON file:", error);
});
