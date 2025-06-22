// routes/admin.js
const express = require('express');
const router  = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path    = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../../products.db'));

// GET all
router.get('/', (_req, res) => {
  db.all('SELECT * FROM products', [], (e, rows) => {
    if(e) return res.status(500).json({error:e.message});
    res.json(rows);
  });
});

// GET single
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (e, row) => {
    if(e) return res.status(500).json({error:e.message});
    res.json(row);
  });
});

// POST new
router.post('/', (req, res) => {
  const {name, price, category, image} = req.body;
  db.run(
    'INSERT INTO products (name, price, category, image) VALUES (?,?,?,?)',
    [name, price, category, image],
    function(e) {
      if(e) return res.status(500).json({error:e.message});
      res.json({success:true, id:this.lastID});
    }
  );
});

// PUT update
router.put('/:id', (req, res) => {
  const {name, price, category, image} = req.body;
  db.run(
    'UPDATE products SET name=?, price=?, category=?, image=? WHERE id=?',
    [name, price, category, image, req.params.id],
    function(e) {
      if(e) return res.status(500).json({error:e.message});
      res.json({success:true, changed:this.changes});
    }
  );
});

// DELETE
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id=?',[req.params.id], function(e) {
    if(e) return res.status(500).json({error:e.message});
    res.json({success:true, deleted:this.changes});
  });
});

module.exports = router;
