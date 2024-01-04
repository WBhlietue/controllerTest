const express = require('express');
const app = express();
const cors = require("cors")
const port = 8000;

app.use(express.static('public'));
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello Express!');
});

app.post("/getKey", (req, res) => {
    console.log(req.body);
})










app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${port}`);
});
