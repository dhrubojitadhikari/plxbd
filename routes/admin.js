const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Content = require('../models/Content');
const Visitor = require('../models/Visitor');
const jwt = require('jsonwebtoken');

// Middleware to verify admin token
const verifyToken = (req, res, next) => {
    const token = req.session.token;
    if (!token) {
        return res.redirect('/admin/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.admin = decoded;
        next();
    } catch (error) {
        res.redirect('/admin/login');
    }
};

// Admin login page
router.get('/login', (req, res) => {
    res.render('admin/login');
});

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin || !(await admin.comparePassword(password))) {
            return res.render('admin/login', { error: 'Invalid credentials' });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Create token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'your-secret-key', {
            expiresIn: '24h'
        });

        req.session.token = token;
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.render('admin/login', { error: 'Login failed' });
    }
});

// Admin dashboard
router.get('/dashboard', verifyToken, async (req, res) => {
    try {
        const [
            visitorCount,
            totalMovies,
            totalTVSeries,
            totalAnime,
            recentVisitors
        ] = await Promise.all([
            Visitor.countDocuments({ visitTime: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
            Content.countDocuments({ type: 'movie' }),
            Content.countDocuments({ type: 'tv' }),
            Content.countDocuments({ type: 'anime' }),
            Visitor.find().sort('-visitTime').limit(10)
        ]);

        res.render('admin/dashboard', {
            stats: {
                visitorCount,
                totalMovies,
                totalTVSeries,
                totalAnime
            },
            recentVisitors
        });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Add content form
router.get('/content/add', verifyToken, (req, res) => {
    res.render('admin/add-content');
});

// Add content
router.post('/content/add', verifyToken, async (req, res) => {
    try {
        const content = new Content(req.body);
        await content.save();
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.render('admin/add-content', { error: 'Failed to add content' });
    }
});

// Edit content
router.get('/content/edit/:id', verifyToken, async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);
        if (!content) {
            return res.status(404).render('error', { message: 'Content not found' });
        }
        res.render('admin/edit-content', { content });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Update content
router.post('/content/edit/:id', verifyToken, async (req, res) => {
    try {
        await Content.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Delete content
router.post('/content/delete/:id', verifyToken, async (req, res) => {
    try {
        await Content.findByIdAndDelete(req.params.id);
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Settings page
router.get('/settings', verifyToken, (req, res) => {
    res.render('admin/settings');
});

// Update settings
router.post('/settings', verifyToken, async (req, res) => {
    try {
        // Handle settings update
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

module.exports = router;
