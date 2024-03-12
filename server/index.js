const express = require("express");
const app = express();
const http = require("http");
require('dotenv').config()
const port = process.env.PORT || 3001;

//using cors middleware to avoid conflicts between server and client
const cors = require("cors");
app.use(cors());

const server = http.createServer(app);


server.listen(3001, () => {
    console.log(`SERVER RUNNING ON PORT-${port}`)
})