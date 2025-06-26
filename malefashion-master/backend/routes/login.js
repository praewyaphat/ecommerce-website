const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');  // ใช้ bcrypt สำหรับการเข้ารหัสรหัสผ่าน
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '..','data', 'database.db'));

router.post('/', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).send("Error checking user data");
        }

        if (!row) {
            return res.send("Incorrected Username");
        }

        bcrypt.compare(password, row.password, (err, isMatch) => {
            if (err) {
                return res.status(500).send("Error comparing password");
            }

            if (!isMatch) {
                return res.send("Incorrected Password.");
            }

            req.session.user = row;

            res.send("Login successfully.");
        });
    });
});

module.exports = router;
