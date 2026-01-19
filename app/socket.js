// src/socket.js (or inline)
const { io } = require("socket.io-client");

const socket = io("http://localhost:3000", {
  withCredentials: true, // if you use cookies/auth
  transports: ["websocket"], // optional, avoids long-polling
});

socket.on("connect", () => {
  console.log("connected", socket.id);
  socket.emit("join", { room: "news" }); // example
});

socket.on("feed:update", (payload) => {
  console.log("update", payload);
});

socket.on("disconnect", (reason) => {
  console.log("disconnected", reason);
});
