//IN ORDER FOR THIS CODE TO WORK YOU NEED A
//LOCAL SERVER. RUN static/py/server.py then use:
// http://localhost:8000/


// FUNCTIONS
function formatDate(date) {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const weekday = weekdays[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM/PM and convert hours to 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM'; // ternary operator (? :) condition ? if true : else

    hours = hours % 12 || 12; // remainder or 12. so 12 & 12 equates to 0 (false) then the or || kicks in and becomes 12
    //If the first number is smaller than the second(like 5 % 12), the result is just the first number.
    //If the first number is larger(like 13 % 12), it gives the leftover part after dividing.

    // Format minutes with leading zero if needed
    const minutesStr = minutes < 10 ? '0' + minutes : minutes; // add 0 to single digit minutes  ternary operator (? :) condition ? if true : else 

    return `${weekday}, ${month} ${day}, ${year}, ${hours}:${minutesStr} ${ampm}`;
}



// Set GeoJSON file path conditionally
let geojson_file;
//if on github set url path || set relative path
if (window.location.hostname.includes('github.io')) {
    // If running on GitHub Pages, use absolute url path
    geojson_file = "https://danomearawd.github.io/project3-team4/output/Cleaned_Parking_Violations_DC_09_2024.geojson";
} else {
    // If running locally, use the relative path from your local folder structure
    geojson_file = "../../output/Cleaned_Parking_Violations_DC_09_2024.geojson";
}


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
                <strong>${feature.properties.violation_description}</strong><hr />
                <strong>${formatDate(date)}</strong> <br />
                <i>${feature.properties.location}</i>
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





    // Remove violation descriptions with counts less than 2600 (top 10)
    for (const description in violationDescriptionCounts) {
        if (violationDescriptionCounts[description] < 2600) {
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
                    'rgba(255, 99, 132, 0.33)',  // Red
                    'rgba(54, 162, 235, 0.33)',  // Blue
                    'rgba(255, 206, 86, 0.33)',  // Yellow
                    'rgba(75, 192, 192, 0.33)',  // Teal
                    'rgba(153, 102, 255, 0.33)', // Purple
                    'rgba(255, 159, 64, 0.33)',  // Orange
                    'rgba(0, 255, 0, 0.33)',     // Green
                    'rgba(255, 99, 255, 0.33)',  // Pink
                    'rgba(255, 165, 0, 0.33)',   // Amber
                    'rgba(100, 100, 255, 0.33)', // Light Blue
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',    // Red
                    'rgba(54, 162, 235, 1)',    // Blue
                    'rgba(255, 206, 86, 1)',    // Yellow
                    'rgba(75, 192, 192, 1)',    // Teal
                    'rgba(153, 102, 255, 1)',   // Purple
                    'rgba(255, 159, 64, 1)',    // Orange
                    'rgba(0, 255, 0, 1)',       // Green
                    'rgba(255, 99, 255, 1)',    // Pink
                    'rgba(255, 165, 0, 1)',     // Amber
                    'rgba(100, 100, 255, 1)',   // Light Blue
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',  // Move legend to the bottom
                    labels: {
                        font: {
                            size: 12,
                            family: 'Roboto'
                        },
                        color: '#202020',
                        boxWidth: 15,
                        padding: 8
                    },
                },
                title: {
                    display: true,
                    text: 'Most Common Violations',
                    font: {
                        size: 20,
                        family: 'Roboto'
                    },
                    color: '#202020',
                    padding: 0
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
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