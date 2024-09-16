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
        const newMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);

        // Show popup with coordinates
        newMarker.bindPopup(`<b>Marker Location</b><br>Latitude: ${e.latlng.lat.toFixed(4)}, Longitude: ${e.latlng.lng.toFixed(4)}`).openPopup();
    });

    // Chatbot functionality
    const chatbotIcon = document.getElementById('chatbot-icon');
    const chatbotContainer = document.getElementById('sensen-chatbot');
    const closeChatbot = document.getElementById('chatbot-close');
    const sendButton = document.getElementById('chatbot-send');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotBody = document.getElementById('chatbot-body');

    // Show chatbot on icon click
    chatbotIcon.addEventListener('click', function() {
        chatbotContainer.style.display = 'flex';
        chatbotIcon.style.display = 'none';
    });

    // Close chatbot
    closeChatbot.addEventListener('click', function() {
        chatbotContainer.style.display = 'none';
        chatbotIcon.style.display = 'flex';
    });

    // Send message function
    function sendMessage() {
        const userMessage = chatbotInput.value;
        if (userMessage.trim() !== '') {
            const userMsgDiv = document.createElement('div');
            userMsgDiv.classList.add('chatbot-message', 'user-message');
            userMsgDiv.textContent = userMessage;
            chatbotBody.appendChild(userMsgDiv);
            chatbotBody.scrollTop = chatbotBody.scrollHeight;

            chatbotInput.value = '';

            // Simulate bot response
            setTimeout(() => {
                const botMsgDiv = document.createElement('div');
                botMsgDiv.classList.add('chatbot-message', 'bot-message');
                botMsgDiv.textContent = 'Thanks for your message! I’ll get back to you shortly.';
                chatbotBody.appendChild(botMsgDiv);
                chatbotBody.scrollTop = chatbotBody.scrollHeight;
            }, 1000);
        }
    }

    // Send message on button click
    sendButton.addEventListener('click', sendMessage);

    // Send message on Enter key press
    chatbotInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
