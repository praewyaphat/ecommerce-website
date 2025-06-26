const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

const db = new sqlite3.Database(path.join(__dirname, '../../products.db'), (err) => {
  if (err) console.error('Error opening database: ', err.message);
});

// เพิ่มสินค้า
router.post('/', (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) return res.status(400).json({ error: 'Missing productId' });

  // ตรวจสอบค่า quantity ว่ามีค่าเป็นตัวเลขที่ถูกต้องหรือไม่
  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }

  db.get('SELECT id FROM products WHERE id = ?', [productId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Product not found' });

    // เช็คว่ามีสินค้านี้ในตะกร้าหรือไม่
    db.get('SELECT id, quantity FROM cart WHERE product_id = ?', [productId], (err, cartItem) => {
      if (err) return res.status(500).json({ error: err.message });

      if (cartItem) {
        // ถ้ามีสินค้าอยู่แล้ว, update quantity
        const newQuantity = cartItem.quantity + (quantity || 1);
        db.run(
          'UPDATE cart SET quantity = ? WHERE id = ?',
          [newQuantity, cartItem.id],
          function(e) {
            if (e) return res.status(500).json({ error: e.message });
            res.json({ success: true, updated: true });
          }
        );
      } else {
        // ถ้าไม่มี, insert สินค้าใหม่
        db.run(
          'INSERT INTO cart (product_id, quantity) VALUES (?, ?)',
          [productId, quantity || 1],
          function(e) {
            if (e) return res.status(500).json({ error: e.message });
            res.json({ success: true, cartId: this.lastID });
          }
        );
      }
    });
  });
});

// ดึงรายการทั้งหมด
router.get('/', (_req, res) => {
  const sql = `
    SELECT c.product_id, p.name, p.price, SUM(c.quantity) AS quantity, (SUM(c.quantity) * p.price) AS total_price
    FROM cart c
    JOIN products p ON p.id = c.product_id
    GROUP BY c.product_id
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
    
    if (this.changes === 0) { // ถ้าไม่พบข้อมูล
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ success: true, deleted: this.changes });
  });
});

module.exports = router;
