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
let rooms = {};
let userToRoom = {};

io.on("connection", (socket) => {
    console.log("------------------connection------------------");
    socket.emit("rooms", getRoomNames());

    socket.on("join-room", (roomId, username) => {
        console.log("------------------join-room------------------");
        console.log(roomId, username);

        let currentRooms = getRoomNames();
        if (!currentRooms.includes(roomId)) return socket.emit("rooms", currentRooms);

        socket.join(roomId, printRooms);
        let room = rooms[roomId];
        room.users[socket.id] = username;
        userToRoom[socket.id] = roomId;
        //room.video.isPlaying = true;
        socket.emit("joined-room", { name: roomId, users: Object.values(room.users) }, room.video);
        socket.to(roomId).emit("updated-state", {
            room: { users: Object.values(room.users) },
            video: room.video,
        });
    });

    socket.on("create-room", (username) => {
        console.log("------------------create-room------------------");
        console.log(username);

        roomsId += 1;
        let room = "room" + roomsId;

        socket.join(room, printRooms);

        rooms[room] = { users: {}, video: {} };
        rooms[room].users[socket.id] = username;
        userToRoom[socket.id] = room;
        socket.emit("joined-room", { name: room, users: Object.values(rooms[room].users) });
    });

    socket.on("leave-room", () => {
        console.log("------------------leave-room------------------");
        let room = leaveRoom(socket.id);
        if (!room) return;
        socket.leave(room, printRooms);
        socket.emit("left-room", getRoomNames());
        if (rooms[room]) {
            socket.to(room).emit("updated-state", { room: { users: Object.values(rooms[room].users) } });
        }
    });

    socket.on("rooms", () => {
        console.log("------------------rooms------------------");
        socket.emit("rooms", getRoomNames());
    });

    socket.on("send-message", (message) => {
        console.log("------------------send-message------------------");
        console.log(message);
        socket.to(userToRoom[socket.id]).emit("receive-message", message);
    });

    socket.on("load-video", (url) => {
        console.log("------------------load-video------------------");
        console.log(url);

        let room = userToRoom[socket.id];
        rooms[room].video = { url, isPlaying: true };
        io.to(room).emit("load-video", { url, isPlaying: true });
    });

    socket.on("remove-video", () => {
        console.log("------------------remove-video------------------");
        let room = userToRoom[socket.id];
        rooms[room].video = {};
        io.to(room).emit("remove-video");
    });

    socket.on("update-state", (state) => {
        console.log("------------------update-state------------------");
        io.to(userToRoom[socket.id]).emit("updated-state", state);
    });

    socket.on("disconnect", () => {
        console.log("------------------disconnect------------------");
        let room = leaveRoom(socket.id);
        if (room) {
            socket.to(room).emit("updated-state", { room: { users: Object.values(rooms[room].users) } });
        }
        printRooms();
    });
});

const leaveRoom = (socketId) => {
    let room = userToRoom[socketId];
    if (!room) return null;
    delete rooms[room].users[socketId];
    delete userToRoom[socketId];
    if (!Object.keys(rooms[room].users).length) {
        delete rooms[room];
        return null;
    }
    return room;
};

const getRoomNames = () => {
    return Object.keys(io.sockets.adapter.rooms).filter((room) => room.startsWith("room"));
};

const printRooms = () => {
    console.log(io.sockets.adapter.rooms);
    console.log(rooms);
    console.log(userToRoom);
};

app.get("*", (request, response) => {
    response.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
});

server.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));
