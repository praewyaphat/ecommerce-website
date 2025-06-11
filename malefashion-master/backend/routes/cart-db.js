const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '../../products.db'), err => {
  if (err) return console.error(err);
  console.log('🔗 DB เปิดสำเร็จ');
});

// สร้างตาราง cart
db.run(`
  CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id)
  )
`, err => {
  if (err) console.error(err);
  else      console.log('✅ สร้าง/ตรวจสอบตาราง cart เรียบร้อย');
  db.close();
});
