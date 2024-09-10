document.addEventListener('DOMContentLoaded', function() {
    // Initialize Leaflet map centered on New York City near Fulton Street
    const map = L.map('map').setView([40.709, -74.010], 13);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add default marker near Fulton Street, New York City
    const defaultMarker = L.marker([40.709, -74.010]).addTo(map);

    // Add status indicator to the popup
    const popupContent = `
        <b>Fulton Street, NYC</b><br>Default Marker<br>
        <div class="status-indicator-container">
            <div class="status-indicator" id="status-indicator"></div>
            <span id="status-text">Status: Operational</span>
        </div>
    `;

    defaultMarker.bindPopup(popupContent).openPopup();

    // Event handler to add a new marker on map click
    map.on('click', function(e) {
        // Add new marker
        const newMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);

        // Show popup with coordinates
        newMarker.bindPopup(`<b>Marker Location</b><br>Latitude: ${e.latlng.lat.toFixed(4)}, Longitude: ${e.latlng.lng.toFixed(4)}`).openPopup();

        // Check if the marker is in Zone 1 (Manhattan)
        if (isInManhattan(e.latlng)) {
            // Animate transition from placeholder to charts
            document.getElementById('placeholder-container').classList.add('hidden');
            document.getElementById('charts-container').classList.add('visible');

            // Display dummy charts in Section 3
            fetch('/api/chart-data')
                .then(response => response.json())
                .then(data => {
                    const blockageCtx = document.getElementById('blockageChart').getContext('2d');
                    const blockageOverTimeCtx = document.getElementById('blockageOverTimeChart').getContext('2d');

                    // Ensure chart containers exist
                    if (blockageCtx && blockageOverTimeCtx) {
                        // Create or update the charts
                        new Chart(blockageCtx, {
                            type: 'line',
                            data: data.blockage,
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Percentage'
                                        }
                                    }
                                },
                                responsive: true,
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function(tooltipItem) {
                                                return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                                            }
                                        }
                                    }
                                }
                            }
                        });

                        new Chart(blockageOverTimeCtx, {
                            type: 'bar',
                            data: data.blockageOverTime,
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Previous 3 Months'
                                        }
                                    }
                                },
                                responsive: true,
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function(tooltipItem) {
                                                return `${tooltipItem.label}: ${tooltipItem.raw}`;
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    } else {
                        console.error('Chart containers not found.');
                    }
                })
                .catch(error => console.error('Error fetching chart data:', error));
        }
    });

    // Function to check if a latitude/longitude is in Manhattan
    function isInManhattan(latlng) {
        // Example logic; adjust based on your definition of Manhattan
        const manhattanBounds = {
            northEast: L.latLng(40.883, -73.910),
            southWest: L.latLng(40.684, -74.040)
        };
        return latlng.lat >= manhattanBounds.southWest.lat &&
               latlng.lat <= manhattanBounds.northEast.lat &&
               latlng.lng >= manhattanBounds.southWest.lng &&
               latlng.lng <= manhattanBounds.northEast.lng;
    }
});
