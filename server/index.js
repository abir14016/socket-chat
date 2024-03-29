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

const generateAvatar = (userNeme, gender) => {
    const lowerCaseUserName = userNeme.toLowerCase();
    let avatarURL
    if (gender === "Male") {
        avatarURL = `https://avatar.iran.liara.run/public/boy?username=${lowerCaseUserName}`;
    } else if (gender === "Female") {
        avatarURL = `https://avatar.iran.liara.run/public/girl?username=${lowerCaseUserName}`;
    } else {
        avatarURL = "";
    }
    return avatarURL
}

// Data structure to store users in rooms
const usersInRooms = {};

io.on("connection", (socket) => {
    socket.on("join_room", (data) => {
        const userId = socket.id;
        const { room, userName, gender } = data;
        socket.join(room);
        console.log(`User: ${userName} connected with id: ${socket.id} and joined room: ${room}`);

        // Emit a message to inform other users about the new user
        const joinMessageData = {
            room: room,
            author: "system",
            message: `${userName} has joined the room.`,
            time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
        }
        socket.to(room).emit("user_join_message", joinMessageData);
        const imgURL = generateAvatar(userName, gender);
        // Add user to the room
        if (!usersInRooms[room]) {
            usersInRooms[room] = [];
        }
        usersInRooms[room].push({ userName, userId, imgURL });

        // Emit event to update user list in the room
        io.to(room).emit("user_list", usersInRooms[room]);
    });

    socket.on("start_typing", (data) => {
        socket.to(data.room).emit("display_start_typing", data);
    });

    socket.on("stop_typing", (data) => {
        socket.to(data.room).emit("display_stop_typing", data);
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
