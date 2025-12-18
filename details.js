const API_URL = 'http://localhost:5000/api';
const urlParams = new URLSearchParams(window.location.search);
const propertyId = urlParams.get('id');

async function loadDetails() {
    if (!propertyId) return document.getElementById('loading').innerText = "No property selected.";

    try {
        const response = await fetch(`${API_URL}/properties/${propertyId}`);
        const property = await response.json();

        // 1. Basic Info
        let img = property.image || 'https://via.placeholder.com/800';
        if (img.startsWith('/uploads')) img = `http://localhost:5000${img}`;

        document.getElementById('propImage').src = img;
        document.getElementById('propTitle').innerText = property.title;
        document.getElementById('propAddress').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${property.address}, ${property.city}`;
        document.getElementById('propPrice').innerText = "$" + property.price.toLocaleString();
        document.getElementById('propDesc').innerText = property.description || "No description available.";

        // 2. Stats
        document.getElementById('propBeds').innerText = property.beds || 3;
        document.getElementById('propBaths').innerText = property.baths || 2;
        document.getElementById('propSqft').innerText = property.sqft ? property.sqft.toLocaleString() : "2,000";
        document.getElementById('propYear').innerText = property.yearBuilt || "2020";

        // 3. Amenities
        const amenGrid = document.getElementById('amenitiesGrid');
        amenGrid.innerHTML = '';
        if(property.amenities && property.amenities.length > 0) {
            property.amenities.forEach(item => {
                amenGrid.innerHTML += `<div class="amenity-item"><i class="fa-solid fa-check"></i> ${item}</div>`;
            });
        } else {
            amenGrid.innerHTML = '<p>No specific amenities listed.</p>';
        }

        // 4. Agent Info
        if(property.agent) {
            document.getElementById('agentName').innerText = property.agent.name;
            document.getElementById('agentPhone').innerText = property.agent.phone;
            document.getElementById('agentEmail').innerText = property.agent.email;
            document.getElementById('agentImage').src = property.agent.image;
        }

        // Show content
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.display = 'grid';

        // Pre-fill message
        document.getElementById('msgArea').value = `Hi, I'm interested in the property: ${property.title}`;

    } catch (e) {
        console.error(e);
        document.getElementById('loading').innerText = "Error loading details.";
    }
}

// Handle Message
document.getElementById('contactForm').onsubmit = (e) => {
    e.preventDefault();
    alert("Message Sent! The agent will contact you shortly.");
};

loadDetails();