
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/',(req,res) => {
    const { username, password} = req.body;

    const filePath = path.join(__dirname,'..','data','user.json');

     if (!fs.existsSync(filePath)) {
    return res.send("์No user information yet");
  }

  const users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const user = users.find(u => u.email === username);

  if (!user) {
    return res.send("Incorrected Username");
  }

  if (user.password !== password) {
    return res.send("Incorrected Password.");
  }

  res.send("Login successfully.");
});

module.exports = router;