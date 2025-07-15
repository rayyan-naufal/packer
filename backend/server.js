const express = require('express');
const mysql = require('mysql2');
const cors =require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi koneksi ke database 'packer' Anda
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'packer'
}).promise();

// === API KATEGORI ===
app.get('/api/categories', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM categories ORDER BY name');
    res.json(results);
  } catch (err) { res.status(500).json({ message: 'Error fetching categories' }); }
});
app.post('/api/categories', async (req, res) => {
    try {
        const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [req.body.name]);
        res.status(201).json({ id: result.insertId, name: req.body.name });
    } catch (err) { res.status(500).json({ message: 'Error adding category' }); }
});
app.put('/api/categories/:id', async (req, res) => {
    try {
        await db.query('UPDATE categories SET name = ? WHERE id = ?', [req.body.name, req.params.id]);
        res.json({ message: 'Category updated' });
    } catch (err) { res.status(500).json({ message: 'Error updating category' }); }
});
app.delete('/api/categories/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
        res.status(204).send();
    } catch (err) { res.status(500).json({ message: 'Error deleting category' }); }
});


// === API LOKASI ===
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


// === API ITEM ===

// GET: Mengambil semua item
app.get('/api/items', async (req, res) => {
    try {
        const query = `
            SELECT 
                items.id, items.name, items.note, 
                c.name AS category, 
                l.name AS location 
            FROM items
            LEFT JOIN categories c ON items.category_id = c.id
            LEFT JOIN locations l ON items.location_id = l.id
            ORDER BY items.id;
        `;
        const [items] = await db.query(query);
        res.json(items);
    } catch (err) { res.status(500).json({ message: 'Error fetching items' }); }
});

// POST: Menambah item baru
app.post('/api/items', async (req, res) => {
    try {
        const { name, category_id, location_id, note } = req.body;
        const query = 'INSERT INTO items (name, category_id, location_id, note) VALUES (?, ?, ?, ?)';
        await db.query(query, [name, category_id, location_id, note]);
        res.status(201).json({ message: 'Item added' });
    } catch (err) { res.status(500).json({ message: 'Error adding item' }); }
});

// PUT: Memindahkan semua item dari 'Bag' (LOGIKA DIPERBAIKI DI SINI)
app.put('/api/items/move-all-from-bag', async (req, res) => {
    try {
        const { destination } = req.body;
        
        // 1. Dapatkan ID untuk lokasi 'Bag'
        const [bagLocationRows] = await db.query('SELECT id FROM locations WHERE name = ?', ['Bag']);
        if (bagLocationRows.length === 0) {
            return res.status(404).json({ message: "Lokasi 'Bag' tidak ditemukan." });
        }
        const bagId = bagLocationRows[0].id;

        // 2. Dapatkan ID untuk lokasi tujuan
        const [destinationLocationRows] = await db.query('SELECT id FROM locations WHERE name = ?', [destination]);
        if (destinationLocationRows.length === 0) {
            return res.status(404).json({ message: `Lokasi tujuan '${destination}' tidak ditemukan.` });
        }
        const destinationId = destinationLocationRows[0].id;

        // 3. Jalankan query UPDATE menggunakan ID
        const [result] = await db.query("UPDATE items SET location_id = ? WHERE location_id = ?", [destinationId, bagId]);
        res.json({ message: `${result.affectedRows} barang berhasil dipindahkan ke ${destination}.` });
    } catch (err) {
        console.error(`❌ [PUT /api/items/move-all-from-bag] Error:`, err);
        res.status(500).json({ message: 'Error moving items' });
    }
});

// PUT: Mengedit satu item
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


// Jalankan server
const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Backend server berjalan di http://localhost:${PORT}`));
