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

//  เพิ่มข้อมูล
const insert = db.prepare('INSERT INTO products (name, price, category, image) VALUES (?, ?, ?, ?)');
const sampleData = [
  ['Blown Jacket', 67.24, 'clothing', 'img/product/product-1.jpg'],
  ['Sneaker Blue', 43.48, 'shoes', 'img/product/product-2.jpg'],
  ['Shirt hood', 60.90, 'clothing', 'img/product/product-3.jpg'],
  ['Jeans', 98.49, 'clothing', 'img/product/product-4.jpg'],
  ['Backpack Pocket', 49.66, 'bags', 'img/product/product-5.jpg'],
  ['Shirt Blue', 26.28, 'clothing', 'img/product/product-6.jpg'],
  ['Black Shirt', 67.24, 'clothing', 'img/product/product-7.jpg'],
  ['Perfume', 43.48, 'accessories', 'img/product/product-8.jpg'],
  ['Backpack', 60.90, 'bags', 'img/product/product-9.jpg'],
  ['Hoody', 98.49, 'clothing', 'img/product/product-10.jpg'],
  ['Work Briefcase', 49.66, 'bags', 'img/product/product-11.jpg'],
  ['Glasses', 26.28, 'accessories', 'img/product/product-12.jpg']
];


sampleData.forEach(row => insert.run(...row));

console.log('สร้างฐานข้อมูลและเพิ่มข้อมูลสำเร็จ');
