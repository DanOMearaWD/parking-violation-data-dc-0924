// IN ORDER FOR THIS CODE TO WORK YOU NEED A
// LOCAL SERVER. RUN static/py/server.py then use:
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
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    // Format minutes with leading zero if needed
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    return `${weekday}, ${month} ${day}, ${year}, ${hours}:${minutesStr} ${ampm}`;
}

d3.json("/geojson")
    .then(function (data) {

        // Create a marker cluster group
        const marker_cluster = L.markerClusterGroup();

        // Array to hold heatmap arrays [lat,lng,intensity]
        const heatmap_data = [];

        // Data structure to track stats for violation descriptions
        const violationDescriptionStats = {};

        // Add markers to the cluster group
        data.features.forEach(function (feature) {
            const lat = feature.geometry.coordinates[1];
            const lng = feature.geometry.coordinates[0];
            const date = new Date(feature.properties.date);
            const fine = feature.properties.fine;
            const violationDescription = feature.properties.violation_description;

            const marker = L.marker([lat, lng])
                .bindPopup(`
                <strong>${violationDescription}</strong><hr />
                <strong>${formatDate(date)}</strong> <br />
                <i>${feature.properties.location}</i> <hr />
                <strong>Fine: $${fine}</strong> <br />
                <strong>Penalty: $${feature.properties.penalty}</strong> <br />
                <strong>Paid: $${feature.properties.paid} (as of October 22, 2024)</strong> <br />
            `);
            marker_cluster.addLayer(marker);

            heatmap_data.push([lat, lng, 0.007]);

            // Track violation description stats
            if (violationDescriptionStats[violationDescription]) {
                violationDescriptionStats[violationDescription].count++;
                violationDescriptionStats[violationDescription].totalFine += fine;
            } else {
                violationDescriptionStats[violationDescription] = {
                    count: 1,
                    totalFine: fine
                };
            }
        });

        // Remove violation descriptions with counts less than 2600 and compute averages
        for (const description in violationDescriptionStats) {
            if (violationDescriptionStats[description].count < 2600) {
                delete violationDescriptionStats[description];
            } else {
                violationDescriptionStats[description].averageFine =
                    violationDescriptionStats[description].totalFine /
                    violationDescriptionStats[description].count;
            }
        }

        // Sort violation descriptions by count (descending order)
        const sortedViolationDescriptions = Object.entries(violationDescriptionStats)
            .sort((a, b) => b[1].count - a[1].count);

        // Prepare the labels, counts, and averages for the chart
        const violationDescriptions = sortedViolationDescriptions.map(item => item[0]);
        const violationCounts = sortedViolationDescriptions.map(item => item[1].count);
        const averageFines = sortedViolationDescriptions.map(item => item[1].averageFine);

        // Create the heatmap layer using the heatmapData array
        const heatLayer = L.heatLayer(heatmap_data, {
            radius: 25,
            blur: 15,
            maxZoom: 16
        });

        // Create a heatmap layer group
        const heatmap = L.layerGroup([heatLayer]);

        // Tile layers
        const street_tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            noWrap: true
        });

        const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community',
            noWrap: true
        });

        const minimalist = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors, &copy; CartoDB',
            noWrap: true
        });

        // Define baseMaps
        const baseMaps = {
            "Minimalist": minimalist,
            "Street Map": street_tile,
            "Satellite": satellite
        };

        // Define overlayMaps
        const overlayMaps = {
            "Marker Cluster": marker_cluster,
            "Heatmap": heatmap
        };

        // Create the map object
        const map = L.map("map", {
            center: [38.8954, -77.0369],
            zoom: 11,
            layers: [minimalist, heatmap]
        });

        // Add layer control to the map
        L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);

        // Create the donut chart with Chart.js
        const ctx = document.getElementById('donutChart').getContext('2d');
        const donutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: violationDescriptions,
                datasets: [{
                    label: 'Violation Descriptions',
                    data: violationCounts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.33)',
                        'rgba(54, 162, 235, 0.33)',
                        'rgba(255, 206, 86, 0.33)',
                        'rgba(75, 192, 192, 0.33)',
                        'rgba(153, 102, 255, 0.33)',
                        'rgba(255, 159, 64, 0.33)',
                        'rgba(0, 255, 0, 0.33)',
                        'rgba(255, 99, 255, 0.33)',
                        'rgba(255, 165, 0, 0.33)',
                        'rgba(100, 100, 255, 0.33)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(0, 255, 0, 1)',
                        'rgba(255, 99, 255, 1)',
                        'rgba(255, 165, 0, 1)',
                        'rgba(100, 100, 255, 1)',
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                size: 12,
                                family: 'Roboto'
                            },
                            color: '#202020',
                            boxWidth: 15,
                            padding: 8
                        }
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
                                const averageFine = averageFines[tooltipItem.dataIndex];
                                const count = tooltipItem.raw.toLocaleString();
                                return `${count} violations - Avg Fine: $${Math.round(averageFine / 10) * 10}`; //ROUND TO NEAREST 10
                            }
                        }
                    }
                }
            }
        });

        // Update chart
        donutChart.update();

    }).catch(function (error) {
        console.error("Error loading GeoJSON file:", error);
    });
