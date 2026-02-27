const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all notes
router.get('/', auth, async (req, res) => {
    try {
        const notes = await prisma.note.findMany({
            where: { userId: req.user.id },
            orderBy: { updatedAt: 'desc' },
        });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new note
router.post('/', auth, async (req, res) => {
    const { title, content, isKeepSync } = req.body;
    try {
        const note = await prisma.note.create({
            data: {
                title,
                content,
                isKeepSync: isKeepSync || false,
                userId: req.user.id,
            },
        });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a note
router.put('/:id', auth, async (req, res) => {
    const { title, content, isKeepSync } = req.body;
    try {
        const note = await prisma.note.update({
            where: { id: parseInt(req.params.id), userId: req.user.id },
            data: { title, content, isKeepSync },
        });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
    try {
        await prisma.note.delete({
            where: { id: parseInt(req.params.id), userId: req.user.id },
        });
        res.json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
