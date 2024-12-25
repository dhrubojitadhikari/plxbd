const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const Visitor = require('../models/Visitor');

// Middleware to track visitors
router.use(async (req, res, next) => {
    try {
        const visitor = new Visitor({
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            path: req.path
        });
        await visitor.save();
        next();
    } catch (error) {
        next(error);
    }
});

// Homepage
router.get('/', async (req, res) => {
    try {
        const [featuredContent, trendingContent, latestMovies, tvSeries, animeList] = await Promise.all([
            Content.find().sort('-views').limit(5),
            Content.find().sort('-views').limit(10),
            Content.find({ type: 'movie' }).sort('-createdAt').limit(12),
            Content.find({ type: 'tv' }).sort('-createdAt').limit(12),
            Content.find({ type: 'anime' }).sort('-createdAt').limit(12)
        ]);

        res.render('index', {
            featuredContent,
            trendingContent,
            latestMovies,
            tvSeries,
            animeList
        });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Watch page
router.get('/watch/:id', async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);
        if (!content) {
            return res.status(404).render('error', { message: 'Content not found' });
        }

        // Increment views
        content.views += 1;
        await content.save();

        res.render('watch', { content });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Category pages
router.get('/:category', async (req, res) => {
    const validCategories = ['movies', 'tv-series', 'anime'];
    const category = req.params.category;
    
    if (!validCategories.includes(category)) {
        return res.status(404).render('error', { message: 'Category not found' });
    }

    try {
        const type = category === 'tv-series' ? 'tv' : category === 'movies' ? 'movie' : 'anime';
        const content = await Content.find({ type }).sort('-createdAt');
        res.render('category', { category, content });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

module.exports = router;
