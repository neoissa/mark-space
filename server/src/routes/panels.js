const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();

// Get all panels for user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const panels = await prisma.panel.findMany({ where: { userId: req.user.id }, orderBy: { order: 'asc' } });
        res.json(panels);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add panel
router.post('/', authMiddleware, async (req, res) => {
    const { type, title, settings, order } = req.body;
    try {
        const panel = await prisma.panel.create({
            data: { type, title, settings, order: order || 0, userId: req.user.id }
        });
        res.status(201).json(panel);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update panel
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, settings, order } = req.body;
    try {
        let panel = await prisma.panel.findUnique({ where: { id: parseInt(id) } });
        if (!panel || panel.userId !== req.user.id) return res.status(404).json({ message: 'Not found' });

        panel = await prisma.panel.update({
            where: { id: parseInt(id) },
            data: { title, settings, order }
        });
        res.json(panel);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete panel
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const panel = await prisma.panel.findUnique({ where: { id: parseInt(id) } });
        if (!panel || panel.userId !== req.user.id) return res.status(404).json({ message: 'Not found' });

        await prisma.panel.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Panel deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
