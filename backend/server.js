const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
const FRONTEND_URL = "https://omeglee-frontend-ekjnozzed-sunny-s-projects-3972cfe9.vercel.app/"; 

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ Root route to prevent 404 error
app.get("/", (req, res) => {
  res.send("✅ Omegle Backend is Running!");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // ✅ Added polling support
});

const users = {};
const waitingUsers = []; 

io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);
  users[socket.id] = socket;

  socket.on("requestMatch", () => {
    console.log(`🔍 User ${socket.id} requested match...`);
    
    if (waitingUsers.length > 0) {
      const matchedUser = waitingUsers.shift();
      const room = `room-${socket.id}-${matchedUser.id}`;

      socket.join(room);
      matchedUser.socket.join(room);

      io.to(room).emit("matchFound", { room });
      
      console.log(`✅ Match Found: ${socket.id} 🔗 ${matchedUser.id} (Room: ${room})`);
    } else {
      waitingUsers.push({ id: socket.id, socket });
      console.log(`🕒 User ${socket.id} added to waiting queue.`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    delete users[socket.id];
    io.emit("userDisconnected", { userId: socket.id });

    const index = waitingUsers.findIndex((user) => user.id === socket.id);
    if (index !== -1) waitingUsers.splice(index, 1);
  });
});

const PORT = process.env.PORT || 10000;  // ✅ Change default port
server.listen(PORT, "0.0.0.0", () => {  
  console.log(`🚀 Server running on port ${PORT}`);
});
