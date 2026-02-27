const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const authRoutes = require('./routes/auth');
const bookmarkRoutes = require('./routes/bookmarks');
const panelRoutes = require('./routes/panels');
const tabRoutes = require('./routes/tabs');
const noteRoutes = require('./routes/notes');
const cityRoutes = require('./routes/cities');
const newsSourcesRoutes = require('./routes/newsSources');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/panels', panelRoutes);
app.use('/api/tabs', tabRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/news-sources', newsSourcesRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, prisma };
