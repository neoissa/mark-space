const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function migrate() {
    console.log('Starting migration...');

    // 1. Ensure user exists
    const user = await prisma.user.upsert({
        where: { email: 'admin@mark.space' },
        update: {},
        create: {
            email: 'admin@mark.space',
            password: 'password123',
            name: 'Admin'
        }
    });
    const SEED_USER_ID = user.id;

    // 2. Read the old Bookmarks.jsx
    const filePath = path.join(__dirname, '../../client/src/Bookmarks.jsx');
    const content = fs.readFileSync(filePath, 'utf8');

    // Find the SEED array
    const seedMatch = content.match(/const SEED = (\[[\s\S]*?\]);/);
    if (!seedMatch) {
        console.error('Could not find SEED array');
        return;
    }

    // Custom parsing to handle JS objects in string
    let oldBookmarks = [];
    try {
        // String looks like: [{ id: 1, t: '...', u: '...', c: '...' }, ...]
        // We'll use a slightly safer eval or just regex-clean to JSON
        const cleanStr = seedMatch[1]
            .replace(/(\w+):/g, '"$1":')     // wrap keys in quotes
            .replace(/'/g, '"')               // replace single quotes with double quotes
            .replace(/,(\s*\])/g, '$1');      // remove trailing comma before closing bracket

        oldBookmarks = JSON.parse(cleanStr);
    } catch (err) {
        console.log('JSON parse failed, trying direct eval (fallback)...');
        try {
            // Stripping everything but the array for a somewhat safer eval
            const arrayOnly = seedMatch[1];
            oldBookmarks = eval(`(${arrayOnly})`);
        } catch (evalErr) {
            console.error('Migration halted: Could not parse bookmark data.');
            return;
        }
    }

    console.log(`Found ${oldBookmarks.length} bookmarks to migrate.`);

    // 3. Batch insert (to be faster)
    const data = oldBookmarks.map(bm => ({
        title: bm.t || 'Untitled',
        url: bm.u || '',
        tags: bm.c || 'General',
        userId: SEED_USER_ID
    }));

    // Prisma createMany is not supported on all SQLite versions/configs, but let's try or loop
    for (const item of data) {
        await prisma.bookmark.create({ data: item });
    }

    console.log('Migration complete!');
}

migrate()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
