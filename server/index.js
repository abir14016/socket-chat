import express from "express";
const app = express();
import { createServer } from "http";

const { Server } = require("socket.io");

require('dotenv').config()
const port = process.env.PORT || 3001;

//using cors middleware to avoid conflicts between server and client
import cors from "cors";
app.use(cors());



const server = createServer(app);

// new instance of Server with solving cors issues
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    })
})


server.listen(3001, () => {
    console.log(`SERVER RUNNING ON PORT-${port}`)
})