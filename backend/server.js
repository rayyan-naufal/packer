// backend/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Agar bisa menerima body JSON dari request

// Konfigurasi koneksi database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Ganti dengan username MySQL Anda
  password: '', // Ganti dengan password MySQL Anda
  database: 'packer_db' // Kita akan buat database ini nanti
}).promise();

// Jalankan server
const PORT = 3001; // Port untuk backend
app.listen(PORT, async () => {
  try {
    await db.connect();
    console.log('Successfully connected to the database.');
    console.log(`Backend server is running on http://localhost:${PORT}`);
  } catch (err) {
    console.error('Error connecting to database:', err);
  }
});

// Tambahkan ini di backend/server.js

// GET: Mengambil semua kategori
app.get('/api/categories', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM categories ORDER BY name');
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err });
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
    res.status(500).json({ message: 'Error adding category', error: err });
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
        res.status(500).json({ message: 'Error updating category', error: err });
    }
});

// DELETE: Menghapus kategori
app.delete('/api/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Opsional: periksa dulu apakah ada item yang menggunakan kategori ini
        await db.query('DELETE FROM categories WHERE id = ?', [id]);
        res.status(204).send(); // 204 No Content
    } catch (err) {
        res.status(500).json({ message: 'Error deleting category', error: err });
    }
});