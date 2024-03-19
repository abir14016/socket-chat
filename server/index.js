const express = require("express");
const app = express();
const http = require("http");
require('dotenv').config();
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

// Data structure to store users in rooms
const usersInRooms = {};

io.on("connection", (socket) => {
    socket.on("join_room", (data) => {
        const userId = socket.id;
        const { room, userName } = data;
        socket.join(room);
        console.log(`User: ${userName} connected with id: ${socket.id} and joined room: ${room}`);

        // Add user to the room
        if (!usersInRooms[room]) {
            usersInRooms[room] = [];
        }
        usersInRooms[room].push({ userName, userId });

        // Emit event to update user list in the room
        io.to(room).emit("user_list", usersInRooms[room]);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);//send the message to the room
    });

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
        // Remove user from all rooms upon disconnection
        for (const room in usersInRooms) {
            if (usersInRooms.hasOwnProperty(room)) {
                const index = usersInRooms[room].findIndex(user => user.userId === socket.id);
                if (index !== -1) {
                    usersInRooms[room].splice(index, 1);

                    console.log(usersInRooms)
                    // Emit event to update user list in the room
                    io.to(room).emit("user_list", usersInRooms[room]);
                }
            }
        }
    });
});

// Endpoint to get users in a room
app.get("/room/:room/users", (req, res) => {
    const room = req.params.room;
    const users = usersInRooms[room];

    console.log(users);

    // Check if the room exists
    if (users === undefined) {
        // Room does not exist, send an error response
        return res.status(404).json({ error: 'Room not found' });
    }

    // Room exists, send the users in the room
    res.json(users);
});


server.listen(3001, () => {
    console.log(`SERVER RUNNING ON PORT-${port}`);
});
