const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all news sources
router.get('/', auth, async (req, res) => {
    try {
        const sources = await prisma.newsSource.findMany({
            where: { userId: req.user.id },
            orderBy: { order: 'asc' },
        });
        res.json(sources);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a news source
router.post('/', auth, async (req, res) => {
    const { name, url, type, isEnabled, order } = req.body;
    try {
        const source = await prisma.newsSource.create({
            data: {
                name,
                url,
                type: type || 'rss',
                isEnabled: isEnabled !== undefined ? isEnabled : true,
                order: order || 0,
                userId: req.user.id,
            },
        });
        res.json(source);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a news source
router.delete('/:id', auth, async (req, res) => {
    try {
        await prisma.newsSource.delete({
            where: { id: parseInt(req.params.id), userId: req.user.id },
        });
        res.json({ message: 'News source removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
