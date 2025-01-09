const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 2000;
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

const authRoutes = require('./routes/authRoutes')
const courseRoutes = require('./routes/courseRoutes')

app.use('/api', authRoutes);
app.use('/api', courseRoutes);

app.listen(port, () => {
    console.log("Server is running on port " + port);
});
