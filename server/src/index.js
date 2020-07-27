import express from "express";
import http from "http";
import path from "path";
import ioClient from "socket.io";

const PORT = 8080;
const HOST = "0.0.0.0";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const CLIENT_BUILD_PATH = path.join(path.resolve(), "../client/build");
app.use(express.static(CLIENT_BUILD_PATH));

const server = http.Server(app);
const io = ioClient(server);

let roomsId = 0;

io.on("connection", (socket) => {
    console.log("------------------connection------------------");
    socket.emit("rooms", getRoomNames());

    socket.on("join-room", (room) => {
        console.log("------------------join-room------------------");
        console.log(room);

        let rooms = getRoomNames();
        console.log("Available rooms: ", rooms);

        if (!rooms.includes(room)) return socket.emit("rooms", rooms);

        socket.join(room, () => console.log(io.sockets.adapter.rooms));
        socket.emit("joined-room", { name: room, status: "waiting", players: [] });
    });

    socket.on("create-room", () => {
        console.log("------------------create-room------------------");

        roomsId += 1;
        let room = "room" + roomsId;
        socket.join(room, () => console.log(io.sockets.adapter.rooms));
        //console.log(getUserRoom(socket));
        //console.log(getRoomNames());
        socket.emit("joined-room", { name: room, status: "waiting", players: [] });
    });

    socket.on("rooms", async () => {
        socket.emit("rooms", getRoomNames());
    });

    socket.on("disconnect", () => {
        console.log("------------------disconnect------------------");
        console.log(io.sockets.adapter.rooms);
        console.log("[" + Object.keys(io.sockets.sockets).join(" - ") + "]");
    });
});

const getRoomNames = () => {
    return Object.keys(io.sockets.adapter.rooms).filter((room) => room.startsWith("room"));
};

const getUserRoom = (socket) => {
    return Object.keys(socket.rooms).filter((room) => room.startsWith("room"));
};

app.get("*", (request, response) => {
    response.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
});

server.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));
