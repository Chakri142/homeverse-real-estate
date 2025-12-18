const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/dreamhome', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Database Connected"));

const Property = mongoose.model('Property', new mongoose.Schema({
    title: String, address: String, city: String, price: Number,
    type: String, image: String, beds: Number, baths: Number,
    sqft: Number, yearBuilt: Number, description: String,
    amenities: [String], agent: Object
}));

// Verified High-Res Luxury Images
const images = [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    "https://images.unsplash.com/photo-1600596542815-2a4d9f101312?w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80"
];

const cities = ["Beverly Hills, CA", "Manhattan, NY", "Miami, FL", "Chicago, IL", "Austin, TX", "Seattle, WA"];
const types = ["Villa", "Penthouse", "Mansion", "Estate", "Modern Home"];
const amenitiesList = ["Private Pool", "Home Theater", "Wine Cellar", "Helipad", "Smart Home System", "Spa & Sauna", "Rooftop Terrace", "Gated Security"];

async function seedDB() {
    await Property.deleteMany({});
    const properties = [];
    
    for (let i = 0; i < 100; i++) {
        const img = images[i % images.length];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const price = Math.floor(Math.random() * (15000000 - 1000000) + 1000000);

        properties.push({
            title: `Royal ${type} in ${city.split(',')[0]}`,
            address: `${100 + i} ${['King', 'Queen', 'Prince', 'Royal'][Math.floor(Math.random()*4)]} Avenue`,
            city: city,
            price: price,
            type: type,
            image: img,
            beds: Math.floor(Math.random() * 5) + 3,
            baths: Math.floor(Math.random() * 5) + 3,
            sqft: Math.floor(Math.random() * 8000) + 2500,
            yearBuilt: Math.floor(Math.random() * (2024 - 2010) + 2010),
            description: `Experience the pinnacle of luxury living in this stunning ${type}. Featuring floor-to-ceiling windows, custom Italian marble finishes, and a breathtaking view of ${city}.`,
            amenities: amenitiesList.sort(() => 0.5 - Math.random()).slice(0, 5),
            agent: {
                name: "Sarah Johnson",
                phone: "(555) 999-8888",
                email: "sarah.j@dreamhome.com",
                image: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=c0a062&color=fff&size=128"
            }
        });
    }

    await Property.insertMany(properties);
    console.log("✅ 100 Luxury Properties Seeded.");
    process.exit();
}
seedDB();