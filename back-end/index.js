const express = require('express');
const app = express();
// Kết nối tới cơ sở dữ liệu MongoDB
const connectDB = require('./src/configs/mongoDB');
connectDB();

const PORT = process.env.PORT || 3001;
app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    });