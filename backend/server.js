require("dotenv").config();
const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const errorHandler = require("./domains/shared_middleware/errorHandler")
const corsConfig = require("./configs/corsConfig")


const app = express();
const PORT = 3000;

app.use(cors(corsConfig()));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());


// Basic route
app.use('/auth', require('./domains/authentication/authRoutes'))

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use("*", (req, res) => {
    res.status(404).json({ error: "Access Not Available!" });
});

app.use(errorHandler)

module.exports = app;
