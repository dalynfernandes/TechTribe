document.addEventListener('DOMContentLoaded', function() {
    const API_KEY = 'af3fb9ad8492b04468c268f2958680ce'; // Your API key

    // Initialize Leaflet map centered on New York City near Fulton Street
    const map = L.map('map').setView([40.709, -74.010], 13);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add default marker near Fulton Street, New York City
    const defaultMarker = L.marker([40.709, -74.010]).addTo(map);

    // Popup for Fulton Street with static content
    defaultMarker.bindPopup(`<b>Fulton Street, NYC</b><br>Default Marker`).openPopup();

    // Function to fetch weather data based on latitude and longitude
    function fetchWeather(lat, lng) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`;

        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }
                return response.json();
            })
            .then(data => {
                return {
                    temp: data.main.temp,
                    weather: data.weather[0].description,
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed
                };
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                return null;
            });
    }

    // Function to display weather info in a floating box
    function showWeatherPopup(lat, lng, marker) {
        fetchWeather(lat, lng).then(weather => {
            if (weather) {
                const weatherContent = `
                    <b>Weather Info</b><br>
                    Temperature: ${weather.temp}°C<br>
                    Condition: ${weather.weather}<br>
                    Humidity: ${weather.humidity}%<br>
                    Wind Speed: ${weather.windSpeed} m/s
                `;
                marker.bindPopup(weatherContent).openPopup();
            } else {
                marker.bindPopup('<b>Weather Info</b><br>Could not fetch weather data.').openPopup();
            }
        });
    }

    // Event handler for adding a new marker on map click
    map.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        // Add a new marker at the clicked location
        const newMarker = L.marker([lat, lng]).addTo(map);

        // Show weather popup when marker is placed
        showWeatherPopup(lat, lng, newMarker);
    });
});
