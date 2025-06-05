const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../../products.db'));

// ดึงสินค้าทั้งหมด หรือกรองตามหมวดหมู่
router.get('/', (req, res) => {
  const category = req.query.category;
  let sql = 'SELECT * FROM products';
  let params = [];

  if (category) {
    sql += ' WHERE category = ?';
    params.push(category);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;
