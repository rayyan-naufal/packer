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

// === API ENDPOINTS UNTUK KATEGORI ===

// GET: Mengambil semua kategori
app.get('/api/categories', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM categories ORDER BY name');
    res.json(results);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// POST: Menambah kategori baru
app.post('/api/categories', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    console.error("Error adding category:", err);
    res.status(500).json({ message: 'Error adding category' });
  }
});

// PUT: Mengedit kategori
app.put('/api/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }
        await db.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
        res.json({ id: Number(id), name });
    } catch (err) {
        console.error("Error updating category:", err);
        res.status(500).json({ message: 'Error updating category' });
    }
});

// DELETE: Menghapus kategori
app.delete('/api/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM categories WHERE id = ?', [id]);
        res.status(204).send(); // 204 No Content
    } catch (err) {
        console.error("Error deleting category:", err);
        res.status(500).json({ message: 'Error deleting category' });
    }
});


// Jalankan server
const PORT = 3001;
app.listen(PORT, async () => {
  try {
    // INI BAGIAN YANG DIPERBAIKI: Gunakan db.ping() untuk tes koneksi
    await db.ping();
    console.log('✅ Berhasil terhubung ke database.');
    console.log(`🚀 Backend server berjalan di http://localhost:${PORT}`);
  } catch (err) {
    console.error('❌ Gagal terhubung ke database:', err.message);
  }
});