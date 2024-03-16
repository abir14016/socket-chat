const express = require("express");
const app = express();
const http = require("http");
require('dotenv').config()
const port = process.env.PORT || 3001;

const { Server } = require("socket.io");

//using cors middleware to avoid conflicts between server and client
const cors = require("cors");
app.use(cors());

const server = http.createServer(app);

// new instance of Server with solving cors issues
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`user connected with id: ${socket.id} and joined room: ${data}`)
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);//send the message to the room
    })

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
    })
})


server.listen(3001, () => {
    console.log(`SERVER RUNNING ON PORT-${port}`)
})