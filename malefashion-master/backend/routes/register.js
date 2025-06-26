
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '..','data', 'database.db'));

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT)");
});

router.post('/', (req, res) => {
    const newUser = req.body;

    const { email, password } = newUser;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).send("Error checking user data");
        }

        if (row) {
            return res.send('This email has already been used.');
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
        stmt.run(email, hashedPassword, function (err) {
            if (err) {
                return res.status(500).send("Error registering user");
            }

            req.session.user = { id: this.lastID, email };

            res.status(200).json({ status: "Register successfully!" });
            console.log('New user registered', email);
        });
        stmt.finalize();
    });
});

module.exports = router;