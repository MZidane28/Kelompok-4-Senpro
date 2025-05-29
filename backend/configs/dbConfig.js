// At the top of your app.js
require('dotenv').config();
const fs = require("fs");


// db.js
const { Pool } = require('pg');
let db;

if(process.env.DB_LOCAL == "TRUE") {
  console.log("USE DB LOCAL")
  db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    connectionTimeoutMillis: 7500,
  });
} else {
  console.log("USE DB SERVER")
  db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    connectionTimeoutMillis: 7500,
    ssl: {
      rejectUnauthorized: false,
      ca: process.env.DB_CA,
    },
  });
}


module.exports = db;