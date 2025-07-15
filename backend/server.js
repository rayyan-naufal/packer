const express = require('express');
const { Pool } = require('pg'); // Menggunakan pg, bukan mysql2
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi ke database Neon menggunakan URL koneksi
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const query = (text, params) => pool.query(text, params);

// === API KATEGORI ===
app.get('/api/categories', async (req, res) => { try { const { rows } = await query('SELECT * FROM categories ORDER BY name'); res.json(rows); } catch (err) { res.status(500).json({ message: err.message }); } });
app.post('/api/categories', async (req, res) => { try { const { name } = req.body; const { rows } = await query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]); res.status(201).json(rows[0]); } catch (err) { res.status(500).json({ message: err.message }); } });
app.put('/api/categories/:id', async (req, res) => { try { await query('UPDATE categories SET name = $1 WHERE id = $2', [req.body.name, req.params.id]); res.json({ message: 'Category updated' }); } catch (err) { res.status(500).json({ message: err.message }); } });
app.delete('/api/categories/:id', async (req, res) => { try { await query('DELETE FROM categories WHERE id = $1', [req.params.id]); res.status(204).send(); } catch (err) { res.status(500).json({ message: err.message }); } });

// === API LOKASI ===
app.get('/api/locations', async (req, res) => { try { const { rows } = await query('SELECT * FROM locations ORDER BY name'); res.json(rows); } catch (err) { res.status(500).json({ message: err.message }); } });
app.post('/api/locations', async (req, res) => { try { const { name } = req.body; const { rows } = await query('INSERT INTO locations (name) VALUES ($1) RETURNING *', [name]); res.status(201).json(rows[0]); } catch (err) { res.status(500).json({ message: err.message }); } });
app.put('/api/locations/:id', async (req, res) => { try { await query('UPDATE locations SET name = $1 WHERE id = $2', [req.body.name, req.params.id]); res.json({ message: 'Location updated' }); } catch (err) { res.status(500).json({ message: err.message }); } });
app.delete('/api/locations/:id', async (req, res) => { try { await query('DELETE FROM locations WHERE id = $1', [req.params.id]); res.status(204).send(); } catch (err) { res.status(500).json({ message: err.message }); } });

// === API ITEM ===
app.get('/api/items', async (req, res) => { try { const sql = `SELECT items.id, items.name, items.note, c.name AS category, l.name AS location FROM items LEFT JOIN categories c ON items.category_id = c.id LEFT JOIN locations l ON items.location_id = l.id ORDER BY items.id;`; const { rows } = await query(sql); res.json(rows); } catch (err) { res.status(500).json({ message: err.message }); } });
app.post('/api/items', async (req, res) => { try { const { name, category_id, location_id, note } = req.body; await query('INSERT INTO items (name, category_id, location_id, note) VALUES ($1, $2, $3, $4)', [name, category_id, location_id, note]); res.status(201).json({ message: 'Item added' }); } catch (err) { res.status(500).json({ message: err.message }); } });
app.put('/api/items/move-all-from-bag', async (req, res) => { try { const { destination } = req.body; const { rows: bagRows } = await query('SELECT id FROM locations WHERE name = $1', ['Bag']); const { rows: destRows } = await query('SELECT id FROM locations WHERE name = $1', [destination]); if (bagRows.length === 0 || destRows.length === 0) return res.status(400).json({ message: 'Invalid location.' }); const { rowCount } = await query("UPDATE items SET location_id = $1 WHERE location_id = $2", [destRows[0].id, bagRows[0].id]); res.json({ message: `${rowCount} items moved.` }); } catch (err) { res.status(500).json({ message: err.message }); } });
app.put('/api/items/:id', async (req, res) => { try { const { id } = req.params; const { location_id, category_id, name, note } = req.body; if (location_id !== undefined) await query('UPDATE items SET location_id = $1 WHERE id = $2', [location_id, id]); else if (category_id !== undefined) await query('UPDATE items SET category_id = $1 WHERE id = $2', [category_id, id]); else if (name !== undefined && note !== undefined) await query('UPDATE items SET name = $1, note = $2 WHERE id = $3', [name, note, id]); else return res.status(400).json({ message: 'No valid field to update provided.' }); res.json({ message: `Item ${id} updated.` }); } catch (err) { res.status(500).json({ message: err.message }); } });
app.delete('/api/items/:id', async (req, res) => { try { await query('DELETE FROM items WHERE id = $1', [req.params.id]); res.status(204).send(); } catch (err) { res.status(500).json({ message: err.message }); } });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Backend server berjalan di port ${PORT}`));
