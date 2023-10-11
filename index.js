const express = require("express");
const { SocketAddress } = require("net");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server)

// static file setting
app.use(express.static("public"))

io.on("connection", (socket) => {
    socket.on("join", (roomname) => {
        const rooms = io.sockets.adapter.rooms;
        const room = rooms.get(roomname);
        if (room == undefined) {
            socket.join(roomname)
            socket.emit("created")
        }
        else if (room.size == 1) {
            socket.join(roomname)
            socket.emit("joined")
        }
        else {
            socket.emit("full")
        }
        socket.on("ready", (room) => {
            socket.to(room).emit("ready")
        })
        socket.on("offer", (offer, room) => {
            socket.to(room).emit("offer", offer)
        })
        socket.on("answer", (answer, room) => {
            socket.to(room).emit("answer", answer)
        })
        socket.on("candidate", (candidate, room) => {
            socket.to(room).emit("candidate", candidate)
        })
    })
})


server.listen(3002, () => {
    console.log("Server Running At http://localhost:3000/");
})