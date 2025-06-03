const Database = require('better-sqlite3');
const path = require('path');

//  สร้างไฟล์ products.db
const db = new Database(path.join(__dirname, '../products.db'));

//  สร้างตาราง products
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT,
    image TEXT
  );
`);

//  เพิ่มตัวอย่างข้อมูล
const insert = db.prepare('INSERT INTO products (name, price, category, image) VALUES (?, ?, ?, ?)');
const sampleData = [
  ['Jacket', 500, 'clothing', 'img/product/product-1.jpg'],
  ['T-Shirt', 300, 'clothing', 'img/product/product-2.jpg'],
  ['Sneakers', 1200, 'shoes', 'img/product/product-3.jpg']
];

sampleData.forEach(row => insert.run(...row));

console.log('✅ สร้างฐานข้อมูลและเพิ่มข้อมูลสำเร็จ');
