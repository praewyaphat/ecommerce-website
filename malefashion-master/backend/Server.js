const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Static Files
app.use(express.static(path.join(__dirname, '../')));

// เพิ่ม API สำหรับบันทึกข้อมูล Billing
app.post('/api/save-billing', (req, res) => {
  const billingData = req.body; // รับข้อมูลจาก request body

  // กำหนดเส้นทางของไฟล์ JSON
  const filePath = path.join(__dirname, 'billing_details.json');

  // เขียนข้อมูลลงไฟล์ JSON
  fs.writeFile(filePath, JSON.stringify(billingData, null, 2), (err) => {
    if (err) {
      console.error('Error saving billing details:', err);
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }
    res.json({ success: true, message: 'ข้อมูลถูกบันทึกแล้ว!' });
  });
});

// เส้นทางที่มีอยู่แล้ว
app.use('/api/products', require('./routes/products'));
app.use('/api/search',   require('./routes/search'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/admin/products', require('./routes/admin'));
app.use('/api/register', require('./routes/register'));
app.use('/api/login', require('./routes/login'));

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log("✅ Server is running at http://localhost:" + PORT);
});
