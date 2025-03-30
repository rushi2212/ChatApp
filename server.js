const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

dotenv.config();
const port = process.env.PORT || 5000;
console.log(port);

const app = express();
app.use(cors());

// Serve static files from the frontend dist directory
const frontendDistPath = path.join(__dirname, "dist"); // Adjust if needed
app.use(express.static(frontendDistPath));

// Serve index.html for all routes (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Change this if needed
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("message", (data) => {
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log("Server running on port " + port);
});
