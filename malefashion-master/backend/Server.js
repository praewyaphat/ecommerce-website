
// Server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Static Files
app.use(express.static(path.join(__dirname, '../')));


app.use('/api/products', require('./routes/products'));
app.use('/api/search',   require('./routes/search'));
+app.use('/api/cart',     require('./routes/cart'));


app.listen(PORT, () => {
    console.log("✅ Server is running at http://localhost:" + PORT);
});
