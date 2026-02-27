const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all cities
router.get('/', auth, async (req, res) => {
    try {
        const cities = await prisma.city.findMany({
            where: { userId: req.user.id },
            orderBy: { order: 'asc' },
        });
        res.json(cities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a city
router.post('/', auth, async (req, res) => {
    const { name, order } = req.body;
    try {
        const city = await prisma.city.create({
            data: {
                name,
                order: order || 0,
                userId: req.user.id,
            },
        });
        res.json(city);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a city
router.delete('/:id', auth, async (req, res) => {
    try {
        await prisma.city.delete({
            where: { id: parseInt(req.params.id), userId: req.user.id },
        });
        res.json({ message: 'City removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
