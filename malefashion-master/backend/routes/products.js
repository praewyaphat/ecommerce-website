const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../../products.db'));

// ดึงสินค้าทั้งหมด หรือกรองตามหมวดหมู่ และคำค้น
router.get('/', (req, res) => {
  const { category, keyword } = req.query;
  let sql = 'SELECT * FROM products';
  const params = [];

  // กรองตาม category และ keyword (ถ้ามี)
  if (category && keyword) {
    sql += ' WHERE category = ? AND (name LIKE ? OR description LIKE ?)';
    params.push(category, `%${keyword}%`, `%${keyword}%`);
  } else if (category) {
    sql += ' WHERE category = ?';
    params.push(category);
  } else if (keyword) {
    sql += ' WHERE name LIKE ? OR description LIKE ?';
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
