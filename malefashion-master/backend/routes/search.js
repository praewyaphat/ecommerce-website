const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../../products.db'));

router.get('/', (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) {
    return res.status(400).json({ error: 'Missing keyword parameter' });
  }

  const like = `%${keyword}%`;
  const sql = 'SELECT * FROM products WHERE name LIKE ? OR category LIKE ?';

  db.all(sql, [like, like], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;
