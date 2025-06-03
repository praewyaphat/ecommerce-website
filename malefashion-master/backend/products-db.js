// products-db.js
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../products.db'));

db.exec('DROP TABLE IF EXISTS products;');
db.exec(`
  CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT,
    image TEXT
  );
`);

const insert = db.prepare('INSERT INTO products (name, price, category, image) VALUES (?, ?, ?, ?)');
const sampleData = [
  ['Blown Jacket', 67.24, 'clothing', 'img/product/product-2.jpg'],
  ['Sneaker Blue', 43.48, 'shoes', 'img/product/product-3.jpg'],
  ['Shirt hood', 60.90, 'clothing', 'img/product/product-4.jpg'],
  ['Jeans', 98.49, 'fashio', 'img/product/product-6.jpg'],
  ['Backpack Pocket', 49.66, 'bags', 'img/product/product-7.jpg'],
  ['Shirt Blue', 26.28, 'clothing', 'img/product/product-8.jpg'],
  ['Black Shirt', 67.24, 'clothing', 'img/product/product-9.jpg'],
  ['Perfume', 43.48, 'accessories', 'img/product/product-10.jpg'],
  ['Backpack', 60.90, 'bags', 'img/product/product-11.jpg'],
  ['Hoody', 98.49, 'clothing', 'img/product/product-12.jpg'],
  ['Work Briefcase', 49.66, 'bags', 'img/product/product-13.jpg'],
  ['Glasses', 26.28, 'clothing', 'img/product/product-12.jpg']
];
sampleData.forEach(row => insert.run(...row));

console.log('✅ ล้างและเพิ่มข้อมูลใหม่สำเร็จ');
