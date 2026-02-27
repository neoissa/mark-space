const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all tabs
router.get('/', auth, async (req, res) => {
    try {
        const tabs = await prisma.tab.findMany({
            where: { userId: req.user.id },
            orderBy: { order: 'asc' },
        });
        res.json(tabs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new tab
router.post('/', auth, async (req, res) => {
    const { name, url, icon, order } = req.body;
    try {
        const tab = await prisma.tab.create({
            data: {
                name,
                url,
                icon,
                order: order || 0,
                userId: req.user.id,
            },
        });
        res.json(tab);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a tab
router.put('/:id', auth, async (req, res) => {
    const { name, url, icon, order } = req.body;
    try {
        const tab = await prisma.tab.update({
            where: { id: parseInt(req.params.id), userId: req.user.id },
            data: { name, url, icon, order },
        });
        res.json(tab);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a tab
router.delete('/:id', auth, async (req, res) => {
    try {
        await prisma.tab.delete({
            where: { id: parseInt(req.params.id), userId: req.user.id },
        });
        res.json({ message: 'Tab deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
