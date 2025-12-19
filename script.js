// CONFIGURATION
// IMPORTANT: For mobile testing, change 'localhost' to your computer's IP (e.g., 'http://192.168.1.15:5000/api')
const API_URL = 'http://localhost:5000/api';
document.addEventListener("DOMContentLoaded", () => {
    // Check Login
    const user = JSON.parse(localStorage.getItem('user'));
    if(user && document.getElementById('loginBtn')) {
        const btn = document.getElementById('loginBtn');
        btn.innerText = `Hi, ${user.username}`;
        btn.onclick = () => {
            localStorage.removeItem('user');
            window.location.reload();
        };
    }

    if(document.getElementById('propertyGrid')) loadProperties();
    if(document.getElementById('content')) loadDetails();
});

async function login() {
    const username = document.getElementById('username').value;
    if(!username) return alert("Enter Name");
    localStorage.setItem('user', JSON.stringify({ username }));
    window.location.reload();
}

async function loadProperties() {
    const search = document.getElementById('searchInput').value;
    const type = document.getElementById('searchType').value;
    const min = document.getElementById('minPrice').value;
    const max = document.getElementById('maxPrice').value;

    let query = `?search=${search}`;
    if(type !== 'All') query += `&type=${type}`;
    if(min) query += `&min=${min}`;
    if(max) query += `&max=${max}`;

    const res = await fetch(`${API_URL}/properties${query}`);
    const data = await res.json();
    const grid = document.getElementById('propertyGrid');
    
    grid.innerHTML = '';
    if(data.length === 0) grid.innerHTML = '<p>No results found.</p>';

    data.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${p.image}">
            <div class="badge">FOR SALE</div>
            <div class="card-content">
                <h3>${p.title}</h3>
                <span class="price">$${p.price.toLocaleString()}</span>
                <p class="location"><i class="fa-solid fa-location-dot"></i> ${p.city}</p>
                <button class="btn-card" onclick="window.location.href='details.html?id=${p._id}'">View Details</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

async function loadDetails() {
    const id = new URLSearchParams(window.location.search).get('id');
    try {
        const res = await fetch(`${API_URL}/properties/${id}`);
        const p = await res.json();

        document.getElementById('propImage').src = p.image;
        document.getElementById('propTitle').innerText = p.title;
        document.getElementById('propPrice').innerText = `$${p.price.toLocaleString()}`;
        document.getElementById('propAddress').innerHTML = `<span>${p.address}, ${p.city}</span>`;
        document.getElementById('propDesc').innerText = p.description;
        document.getElementById('propBeds').innerText = p.beds;
        document.getElementById('propBaths').innerText = p.baths;
        document.getElementById('propSqft').innerText = p.sqft.toLocaleString();
        document.getElementById('propYear').innerText = p.yearBuilt;

        // Amenities
        const amenGrid = document.getElementById('amenitiesGrid');
        amenGrid.innerHTML = '';
        if(p.amenities) {
            p.amenities.forEach(am => {
                amenGrid.innerHTML += `<div class="amenity"><i class="fa-solid fa-check"></i> ${am}</div>`;
            });
        }

        // Agent
        if(p.agent) {
            document.getElementById('agentName').innerText = p.agent.name;
            document.getElementById('agentImage').src = p.agent.image;
        }

        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.display = 'grid';
    } catch(e) { console.error(e); }

}


