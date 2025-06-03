const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const path = require('path');
app.use(express.static(path.join(__dirname, '../')));


app.listen(PORT, () => {
    console.log("Server is running at http://localhost:" + PORT);
});

//-------------------colin-------------------//

const sqlite3 = require('sqlite3').verbose();

// เชื่อมต่อฐานข้อมูล products.db
const db = new sqlite3.Database(path.join(__dirname, '../products.db'));

// API: ดึงสินค้าตามหมวดหมู่
app.get('/products', (req, res) => {
  const category = req.query.category;
  let sql = 'SELECT * FROM products';
  let params = [];

  if (category) {
    sql += ' WHERE category = ?';
    params.push(category);
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: ค้นหาสินค้า
app.get('/search', (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) return res.status(400).json({ error: 'Missing keyword parameter' });

  const sql = 'SELECT * FROM products WHERE name LIKE ? OR category LIKE ?';
  const like = `%${keyword}%`;
  db.all(sql, [like, like], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
