const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();

// Get all bookmarks for user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { q, tag, folder, isFavorite } = req.query;
        const where = { userId: req.user.id };

        if (tag) where.tags = { contains: tag };
        if (folder) where.folder = folder;
        if (isFavorite === 'true') where.isFavorite = true;

        // Simple search if q is provided
        if (q) {
            where.OR = [
                { title: { contains: q } },
                { url: { contains: q } },
                { description: { contains: q } }
            ];
        }

        const bookmarks = await prisma.bookmark.findMany({ where, orderBy: { createdAt: 'desc' } });
        res.json(bookmarks);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add bookmark
router.post('/', authMiddleware, async (req, res) => {
    const { title, url, description, tags, folder, isFavorite } = req.body;
    try {
        const bookmark = await prisma.bookmark.create({
            data: { title, url, description, tags, folder, isFavorite: isFavorite || false, userId: req.user.id }
        });
        res.status(201).json(bookmark);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update bookmark
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, url, description, tags, folder, isFavorite } = req.body;
    try {
        let bookmark = await prisma.bookmark.findUnique({ where: { id: parseInt(id) } });
        if (!bookmark || bookmark.userId !== req.user.id) return res.status(404).json({ message: 'Not found' });

        bookmark = await prisma.bookmark.update({
            where: { id: parseInt(id) },
            data: { title, url, description, tags, folder, isFavorite }
        });
        res.json(bookmark);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete bookmark
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const bookmark = await prisma.bookmark.findUnique({ where: { id: parseInt(id) } });
        if (!bookmark || bookmark.userId !== req.user.id) return res.status(404).json({ message: 'Not found' });

        await prisma.bookmark.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Bookmark deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
