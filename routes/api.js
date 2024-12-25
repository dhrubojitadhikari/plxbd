const express = require('express');
const router = express.Router();
const axios = require('axios');
const Content = require('../models/Content');

// Search endpoint
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const results = await Content.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { overview: { $regex: query, $options: 'i' } }
            ]
        }).limit(10);

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
});

// TMDb search endpoint
router.get('/tmdb/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const response = await axios.get(`https://api.themoviedb.org/3/search/multi`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                query: query,
                language: 'en-US',
                page: 1
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'TMDb search failed' });
    }
});

// Get TMDb details
router.get('/tmdb/details/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = await axios.get(`https://api.themoviedb.org/3/${type}/${id}`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: 'en-US',
                append_to_response: 'videos,images'
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch TMDb details' });
    }
});

// Get IMDb details
router.get('/imdb/:id', async (req, res) => {
    try {
        const response = await axios.get(`http://www.omdbapi.com/`, {
            params: {
                apikey: process.env.OMDB_API_KEY,
                i: req.params.id
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch IMDb details' });
    }
});

module.exports = router;
