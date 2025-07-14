const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'packer'
}).promise();

// === API KATEGORI (CRUD LENGKAP) ===
app.get('/api/categories', async (req, res) => { /* ... (tidak berubah) ... */ });
app.post('/api/categories', async (req, res) => { /* ... (tidak berubah) ... */ });
app.put('/api/categories/:id', async (req, res) => {
    try {
        await db.query('UPDATE categories SET name = ? WHERE id = ?', [req.body.name, req.params.id]);
        res.json({ message: 'Category updated' });
    } catch (err) { res.status(500).json({ message: 'Error updating category' }); }
});
app.delete('/api/categories/:id', async (req, res) => {
    try {
        // Hati-hati: idealnya, periksa dulu apakah ada item yang menggunakan kategori ini
        await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
        res.status(204).send();
    } catch (err) { res.status(500).json({ message: 'Error deleting category' }); }
});


// === API LOKASI (CRUD LENGKAP BARU) ===
app.get('/api/locations', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM locations ORDER BY name');
        res.json(results);
    } catch (err) { res.status(500).json({ message: 'Error fetching locations' }); }
});
app.post('/api/locations', async (req, res) => {
    try {
        const [result] = await db.query('INSERT INTO locations (name) VALUES (?)', [req.body.name]);
        res.status(201).json({ id: result.insertId, name: req.body.name });
    } catch (err) { res.status(500).json({ message: 'Error adding location' }); }
});
app.put('/api/locations/:id', async (req, res) => {
    try {
        await db.query('UPDATE locations SET name = ? WHERE id = ?', [req.body.name, req.params.id]);
        res.json({ message: 'Location updated' });
    } catch (err) { res.status(500).json({ message: 'Error updating location' }); }
});
app.delete('/api/locations/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM locations WHERE id = ?', [req.params.id]);
        res.status(204).send();
    } catch (err) { res.status(500).json({ message: 'Error deleting location' }); }
});


// === API ITEM (DIPERBARUI) ===
app.get('/api/items', async (req, res) => {
    try {
        const query = `
            SELECT 
                items.id, items.name, items.note, 
                c.name AS category, 
                l.name AS location 
            FROM items
            JOIN categories c ON items.category_id = c.id
            JOIN locations l ON items.location_id = l.id
            ORDER BY items.id;
        `;
        const [items] = await db.query(query);
        res.json(items);
    } catch (err) { res.status(500).json({ message: 'Error fetching items' }); }
});
app.post('/api/items', async (req, res) => {
    try {
        const { name, category_id, location_id, note } = req.body;
        const query = 'INSERT INTO items (name, category_id, location_id, note) VALUES (?, ?, ?, ?)';
        await db.query(query, [name, category_id, location_id, note]);
        res.status(201).json({ message: 'Item added' });
    } catch (err) { res.status(500).json({ message: 'Error adding item' }); }
});
app.put('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { location_id, category_id } = req.body;
        if (location_id) {
            await db.query('UPDATE items SET location_id = ? WHERE id = ?', [location_id, id]);
        } else if (category_id) {
            await db.query('UPDATE items SET category_id = ? WHERE id = ?', [category_id, id]);
        }
        res.json({ message: `Item ${id} updated.` });
    } catch (err) { res.status(500).json({ message: 'Error updating item' }); }
});
app.put('/api/items/move-all-from-bag', async (req, res) => {
    try {
        const { destination } = req.body;
        const [location] = await db.query('SELECT id FROM locations WHERE name = ?', ['Bag']);
        const [destinationLocation] = await db.query('SELECT id FROM locations WHERE name = ?', [destination]);
        if (!location.length || !destinationLocation.length) {
            return res.status(400).json({ message: 'Invalid location.' });
        }
        await db.query("UPDATE items SET location_id = ? WHERE location_id = ?", [destinationLocation[0].id, location[0].id]);
        res.json({ message: `Items moved.` });
    } catch (err) { res.status(500).json({ message: 'Error moving items' }); }
});

// Jalankan server
const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Backend server berjalan di http://localhost:${PORT}`));
