const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const Database = require('better-sqlite3');

// ----------------- CONFIG ----------------- //
const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());

// เสิร์ฟไฟล์ static เช่น index.html, shop.html ฯลฯ
app.use(express.static(path.join(__dirname, '../')));

// เชื่อมต่อฐานข้อมูล SQLite
const db = new Database(path.join(__dirname, '../products.db'));


// ----------------- API ----------------- //

// ดึงสินค้าทั้งหมด หรือกรองตามหมวดหมู่
app.get('/products', (req, res) => {
  const category = req.query.category;
  let sql = 'SELECT * FROM products';
  let params = [];

  if (category) {
    sql += ' WHERE category = ?';
    params.push(category);
  }

  try {
    const stmt = db.prepare(sql);
    const rows = stmt.all(...params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ค้นหาสินค้า
app.get('/search', (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) {
    return res.status(400).json({ error: 'Missing keyword parameter' });
  }

  const like = `%${keyword}%`;
  const sql = 'SELECT * FROM products WHERE name LIKE ? OR category LIKE ?';

  try {
    const stmt = db.prepare(sql);
    const rows = stmt.all(like, like);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- START SERVER ----------------- //
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
