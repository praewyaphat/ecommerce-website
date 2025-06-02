const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const path = require('path');
app.use(express.static(path.join(__dirname, '../')));


app.listen(PORT, () => {
    console.log("Server is running at http://localhost:" + PORT);
});
