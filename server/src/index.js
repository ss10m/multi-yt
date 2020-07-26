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
const users = {};

io.on("connection", (socket) => {
    console.log("new user connected");
    users[socket.id] = { name: "1" };
    console.log(users);
    socket.emit("rooms", getRoomNames());

    socket.on("join-room", (room) => {
        console.log(room);

        console.log(io.sockets.adapter.rooms);

        let rooms = getRoomNames();
        console.log(rooms);

        if (!rooms.includes(room.name)) return socket.emit("rooms", rooms);

        socket.join(room.name);
        socket.emit("joined-room", room);
    });

    socket.on("create-room", () => {
        console.log("create-room");
        console.log("LATEST ID :" + roomsId);

        roomsId += 1;
        let room = "room" + roomsId;
        socket.join(room);
        socket.emit("joined-room", room);
    });

    socket.on("disconnect", () => {
        console.log("disconnect");
        delete users[socket.id];
        console.log(users);
    });
});

const getRoomNames = () => {
    return Object.keys(io.sockets.adapter.rooms).filter((room) => room.startsWith("room"));
};

app.get("*", (request, response) => {
    response.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
});

server.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));
