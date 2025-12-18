const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/dreamhome', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Property = mongoose.model('Property', new mongoose.Schema({
    title: String, address: String, city: String, price: Number,
    type: String, image: String, beds: Number, baths: Number,
    sqft: Number, yearBuilt: Number, description: String,
    amenities: [String], agent: Object
}));

// Advanced Filter Route
app.get('/api/properties', async (req, res) => {
    try {
        let query = {};

        // Search Text
        if (req.query.search) {
            query.$or = [
                { city: { $regex: req.query.search, $options: 'i' } },
                { address: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Type Filter
        if (req.query.type && req.query.type !== 'All') {
            query.type = req.query.type;
        }

        // Price Filter
        if (req.query.min || req.query.max) {
            query.price = {};
            if (req.query.min) query.price.$gte = Number(req.query.min);
            if (req.query.max) query.price.$lte = Number(req.query.max);
        }

        const properties = await Property.find(query);
        res.json(properties);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/properties/:id', async (req, res) => {
    try {
        const p = await Property.findById(req.params.id);
        res.json(p);
    } catch { res.status(404).json({error: "Not Found"}); }
});

app.post('/api/login', (req, res) => {
    res.json({ success: true, user: { username: req.body.username } });
});

app.listen(5000, () => console.log("Server running on port 5000"));