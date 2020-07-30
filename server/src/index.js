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

    socket.on("create-room", (username) => {
        console.log("------------------create-room------------------");

        roomsId += 1;
        let room = "room" + roomsId;

        socket.join(room, printRooms);

        rooms[room] = { users: {}, video: {} };
        rooms[room].users[socket.id] = username;
        userToRoom[socket.id] = room;
        socket.emit("joined-room", { name: room, users: Object.values(rooms[room].users) });
    });

    socket.on("join-room", (roomId, username) => {
        console.log("------------------join-room------------------");

        let currentRooms = getRoomNames();
        if (!currentRooms.includes(roomId)) return socket.emit("rooms", currentRooms);

        socket.join(roomId, printRooms);
        let room = rooms[roomId];
        room.users[socket.id] = username;
        userToRoom[socket.id] = roomId;
        if (room.video && room.video.isPlaying) room.video.isPlaying = false;
        socket.emit("joined-room", { name: roomId, users: Object.values(room.users) }, room.video);
        socket.to(roomId).emit("updated-state", {
            room: { users: Object.values(room.users) },
            video: room.video,
            message: { username, msg: "has joined the chat", type: "status" },
        });
    });

    socket.on("leave-room", () => {
        console.log("------------------leave-room------------------");
        let roomId = userToRoom[socket.id];
        if (!roomId) return;
        let username = rooms[roomId].users[socket.id];

        let room = leaveRoom(socket.id);
        socket.leave(roomId, printRooms);
        socket.emit("left-room", getRoomNames());
        if (room) {
            socket.to(room).emit("updated-state", {
                room: { users: Object.values(rooms[room].users) },
                message: { username, msg: "has left the chat", type: "status" },
            });
        }
    });

    socket.on("rooms", () => {
        console.log("------------------rooms------------------");
        socket.emit("rooms", getRoomNames());
    });

    socket.on("send-message", (message) => {
        console.log("------------------send-message------------------");
        let room = userToRoom[socket.id];
        if (!room) return;
        socket.to(room).emit("receive-message", message);
    });

    socket.on("load-video", (url) => {
        console.log("------------------load-video------------------");
        let room = userToRoom[socket.id];
        if (!room) return;
        rooms[room].video = { url, isPlaying: true };
        io.in(room).emit("load-video", { url, isPlaying: true });
    });

    socket.on("remove-video", () => {
        console.log("------------------remove-video------------------");
        let room = userToRoom[socket.id];
        if (!room) return;
        rooms[room].video = {};
        io.in(room).emit("remove-video");
    });

    socket.on("update-video", (state) => {
        console.log("------------------update-video------------------");
        let roomId = userToRoom[socket.id];
        if (!roomId) return;

        if (state.hasOwnProperty("isPlaying")) {
            let room = rooms[roomId];
            room.video.isPlaying = state.isPlaying;
            return io.in(roomId).emit("updated-state", { video: state });
        }
        if (state.hasOwnProperty("seek")) {
            return io.in(roomId).emit("updated-state", state);
        }
    });

    socket.on("disconnect", () => {
        console.log("------------------disconnect------------------");
        let roomId = userToRoom[socket.id];
        let username;
        if (roomId) {
            username = rooms[roomId].users[socket.id];
        }
        let room = leaveRoom(socket.id);

        if (room) {
            socket.to(room).emit("updated-state", {
                room: { users: Object.values(rooms[room].users) },
                message: { username, msg: "has left the chat", type: "status" },
            });
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
    return Object.keys(rooms);
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
