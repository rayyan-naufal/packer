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
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// === API ITEM ===

// GET: Mengambil semua item
app.get('/api/items', async (req, res) => {
    try {
        const query = `
            SELECT 
                items.id, items.name, items.location, items.note, 
                categories.name AS category 
            FROM items
            JOIN categories ON items.category_id = categories.id
            ORDER BY items.id;
        `;
        const [items] = await db.query(query);
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching items' });
    }
});

// POST: Menambah item baru
app.post('/api/items', async (req, res) => {
    try {
        const { name, category_id, location, note } = req.body;
        if (!name || !category_id || !location) {
            return res.status(400).json({ message: 'Name, category, and location are required.' });
        }
        const query = 'INSERT INTO items (name, category_id, location, note) VALUES (?, ?, ?, ?)';
        await db.query(query, [name, category_id, location, note]);
        res.status(201).json({ message: 'Item added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error adding item' });
    }
});


// === URUTAN DIPERBAIKI DI SINI ===
// Rute yang lebih spesifik ('/move-all-from-bag') harus didefinisikan SEBELUM rute yang lebih umum ('/:id').

// PUT: Memindahkan semua item dari 'Bag'
app.put('/api/items/move-all-from-bag', async (req, res) => {
    try {
        const { destination } = req.body;
        if (!destination || !['Bag', 'House', 'Dorm'].includes(destination)) {
            return res.status(400).json({ message: 'Destination is required and must be valid.' });
        }
        const [result] = await db.query("UPDATE items SET location = ? WHERE location = 'Bag'", [destination]);
        res.json({ message: `${result.affectedRows} items moved to ${destination}.` });
    } catch (err) {
        console.error(`❌ [PUT /api/items/move-all-from-bag] Error:`, err);
        res.status(500).json({ message: 'Error moving items' });
    }
});

// PUT: Mengedit satu item
app.put('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { location, category_id } = req.body;

        if (location) {
            await db.query('UPDATE items SET location = ? WHERE id = ?', [location, id]);
        } else if (category_id) {
            await db.query('UPDATE items SET category_id = ? WHERE id = ?', [category_id, id]);
        } else {
            return res.status(400).json({ message: 'No valid field to update provided.' });
        }
        res.json({ message: `Item ${id} updated successfully.` });
    } catch (err) {
        res.status(500).json({ message: 'Error updating item' });
    }
});


// Jalankan server
const PORT = 3001;
app.listen(PORT, async () => {
  try {
    await db.ping();
    console.log('✅ Berhasil terhubung ke database.');
    console.log(`🚀 Backend server berjalan di http://localhost:${PORT}`);
  } catch (err) {
    console.error('❌ Gagal terhubung ke database:', err.message);
  }
});
