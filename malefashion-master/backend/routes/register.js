
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/',(req,res) => {
    const newUser = req.body;

    const filePath = path.join(__dirname,'..','data','user.json');

    let user = [];
    if(fs.existsSync(filePath)){
         //file is there
        const filedata = fs.readFileSync(filePath, 'utf-8');
        user =JSON.parse(filedata);

        if (user.find(user => user.email === newUser.email)) {
            return res.send('This email has already been used.');
        }

        user.push(newUser);
        fs.writeFileSync(filePath, JSON.stringify(user, null, 2));
        res.status(200).json({status : "Register successfully!"});
        console.log('New user registered', newUser.email);
    }else{
        //no file
        user.push(newUser);
        fs.writeFileSync(filePath, JSON.stringify(user, null, 2));
        res.status(200).json({status : "Register successfully!"});
        console.log('New user registered', newUser.email);
    }


});

module.exports = router;