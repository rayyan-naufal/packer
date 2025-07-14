const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi koneksi ke database 'packer' Anda
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Ganti dengan username MySQL Anda jika berbeda
  password: '',   // Ganti dengan password MySQL Anda
  database: 'packer'
}).promise();

// === API ENDPOINTS UNTUK KATEGORI (Tidak berubah) ===
app.get('/api/categories', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM categories ORDER BY name');
    res.json(results);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});
// ... (endpoint POST, PUT, DELETE untuk kategori tetap sama)


// === API ENDPOINTS BARU UNTUK ITEM ===

// GET: Mengambil semua item beserta nama kategorinya
app.get('/api/items', async (req, res) => {
    try {
        const query = `
            SELECT 
                items.id, 
                items.name, 
                items.location, 
                items.note, 
                categories.name AS category 
            FROM items
            JOIN categories ON items.category_id = categories.id
            ORDER BY items.id;
        `;
        const [items] = await db.query(query);
        res.json(items);
    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).json({ message: 'Error fetching items' });
    }
});

// POST: Menambah item baru
app.post('/api/items', async (req, res) => {
    try {
        const { name, category_id, location, note } = req.body;
        
        // Validasi sederhana
        if (!name || !category_id || !location) {
            return res.status(400).json({ message: 'Name, category, and location are required.' });
        }

        const query = 'INSERT INTO items (name, category_id, location, note) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [name, category_id, location, note]);

        // Kirim kembali item yang baru dibuat
        const newItemId = result.insertId;
        const [newItem] = await db.query('SELECT items.id, items.name, items.location, items.note, categories.name AS category FROM items JOIN categories ON items.category_id = categories.id WHERE items.id = ?', [newItemId]);
        
        res.status(201).json(newItem[0]);

    } catch (err) {
        console.error("Error adding item:", err);
        res.status(500).json({ message: 'Error adding item' });
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
