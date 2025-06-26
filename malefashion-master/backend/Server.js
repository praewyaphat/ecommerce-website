const express = require('express');
const fs = require('fs');
const path = require('path');

const cors = require('cors');
const bodyParser = require('body-parser');

const session = require('express-session'); 
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

const app = express();
const PORT = 3000;

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, '../')));

// ตรวจสอบและสร้างโฟลเดอร์ 'data' ถ้ายังไม่มี
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// POST route สำหรับบันทึกข้อมูล Billing และข้อมูลสินค้า
app.post('/api/save-billing', (req, res) => {
  const billingData = req.body; // รับข้อมูลจาก request body
  
  // ตรวจสอบว่าได้ส่งข้อมูลสินค้าหรือไม่
  if (!billingData.items || !Array.isArray(billingData.items)) {
    return res.status(400).json({ error: 'กรุณาส่งข้อมูลสินค้า' });
  }

  // คำนวณยอดรวมจากสินค้าที่ซื้อ
  const total = billingData.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // เตรียมข้อมูลทั้งหมดที่จะบันทึกในไฟล์ JSON
  const dataToSave = {
    ...billingData,  // ข้อมูลจากฟอร์ม
    total: total     // ยอดรวม
  };

  // กำหนดเส้นทางของไฟล์ JSON
  const filePath = path.join(__dirname, 'data', 'billing_details.json');

  // เขียนข้อมูลลงไฟล์ JSON
  fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2), (err) => {
    if (err) {
      console.error('Error saving billing details:', err);
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }
    res.json({ success: true, message: 'ข้อมูลถูกบันทึกแล้ว!' });
  });
});

app.get('/api/check-login', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});


app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Error logging out");
        }
        res.send("Logged out successfully");
    });
});

app.get('/shopping-cart', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'shopping-cart.html'));
    } else {
        res.redirect('/login');
    }
});


// GET route สำหรับดึงข้อมูลจาก billing_details.json
app.get('/data/billing_details.json', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'billing_details.json');
  
  // อ่านไฟล์และส่งข้อมูลไปที่ frontend
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading billing details:', err);
      return res.status(500).json({ error: 'ไม่สามารถโหลดข้อมูลการชำระเงินได้' });
    }
    res.json(JSON.parse(data)); // ส่งข้อมูลกลับไปที่ frontend
  });
});

// เส้นทางที่มีอยู่แล้ว
app.use('/api/products', require('./routes/products'));
app.use('/api/search',   require('./routes/search'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/admin/products', require('./routes/admin'));

app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log("✅ Server is running at http://localhost:" + PORT);
});
