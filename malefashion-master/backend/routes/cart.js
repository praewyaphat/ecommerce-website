const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

const db = new sqlite3.Database(path.join(__dirname, '../../products.db'));

// เพิ่มสินค้า
router.post('/', (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) return res.status(400).json({ error: 'Missing productId' });

  db.get('SELECT id FROM products WHERE id = ?', [productId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Product not found' });

    db.run(
      'INSERT INTO cart (product_id, quantity) VALUES (?, ?)',
      [productId, quantity || 1],
      function(e) {
        if (e) return res.status(500).json({ error: e.message });
        res.json({ success: true, cartId: this.lastID });
      }
    );
  });
});

// ดึงรายการทั้งหมด
router.get('/', (_req, res) => {
  const sql = `
    SELECT c.id, c.quantity,
           p.id AS product_id, p.name, p.price,
           (c.quantity * p.price) AS total_price
    FROM cart c
    JOIN products p ON p.id = c.product_id
    ORDER BY c.added_at DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ลบรายการ
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM cart WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deleted: this.changes });
  });
});

module.exports = router;
