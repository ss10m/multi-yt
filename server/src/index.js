import express from "express";
import http from "http";
import path from "path";
import ioClient from "socket.io";
import { nanoid } from "nanoid";

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
let roomIdToRoom = {};

io.on("connection", (socket) => {
    console.log("------------------connection------------------");
    socket.emit("rooms", getRooms());
    socket.join("lobby", printRooms);

    socket.on("create-room", (username) => {
        console.log("------------------create-room------------------");

        roomsId += 1;
        let room = "room-" + roomsId;
        let roomId = nanoid(7);
        roomIdToRoom[roomId] = room;

        socket.leave("lobby");
        socket.join(room);

        rooms[room] = {
            users: {},
            video: {},
            action: null,
            roomId,
        };
        rooms[room].users[socket.id] = { username, isBuffering: true };
        userToRoom[socket.id] = room;
        socket.emit("joined-room", {
            name: room,
            users: Object.values(rooms[room].users),
            roomId,
        });
        updateLobby();
    });

    socket.on("join-room", (roomDetails, username) => {
        console.log("------------------join-room------------------");

        let roomId;
        if (roomDetails.hasOwnProperty("id")) {
            roomId = roomIdToRoom[roomDetails.id];
        } else {
            roomId = roomDetails.name;
        }

        let currentRooms = Object.keys(rooms);
        if (!currentRooms.includes(roomId)) return socket.emit("rooms", getRooms());

        let updatedState = {};

        socket.leave("lobby");
        socket.join(roomId, printRooms);
        let room = rooms[roomId];
        let timeSource = Object.keys(room.users)[0];
        room.users[socket.id] = { username, isBuffering: true };
        userToRoom[socket.id] = roomId;
        updatedState["room"] = { users: Object.values(room.users) };
        if (Object.keys(room.video).length !== 0) {
            room.video.isBuffering = true;
            updatedState["video"] = { action: "pause" };
        }

        socket.emit("joined-room", { name: roomId, users: Object.values(room.users), roomId: room.roomId }, room.video);
        io.to(timeSource).emit("get-video-time", roomId);

        updatedState["message"] = { username, msg: "has joined the chat", type: "status" };
        socket.to(roomId).emit("updated-state", updatedState);
        updateLobby();
    });

    socket.on("current-video-time", (roomId, currentTime) => {
        console.log("------------current-video-time-------------");
        rooms[roomId].action = { type: "seek", time: currentTime };
    });

    socket.on("leave-room", () => {
        console.log("------------------leave-room------------------");
        let roomId = userToRoom[socket.id];
        if (!roomId) return socket.emit("left-room", getRooms());
        let username = rooms[roomId].users[socket.id].username;

        let room = leaveRoom(socket.id);
        socket.leave(roomId);
        socket.join("lobby", printRooms);
        socket.emit("left-room", getRooms());
        if (room) {
            socket.to(room).emit("updated-state", {
                room: { users: Object.values(rooms[room].users) },
                message: { username, msg: "has left the chat", type: "status" },
            });
        }
        updateLobby();
    });

    socket.on("rooms", () => {
        console.log("------------------rooms------------------");
        socket.emit("rooms", getRooms());
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
        rooms[room].video = { url, isPlaying: true, isBuffering: true };
        io.in(room).emit("load-video", { url });
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

            let action = { action: room.video.isPlaying && !room.video.isBuffering ? "play" : "pause" };
            return io.in(roomId).emit("updated-state", { video: action });
        }
        if (state.hasOwnProperty("seek")) {
            return io.in(roomId).emit("updated-state", state);
        }
    });

    socket.on("update-player-state", (state) => {
        console.log("-----------update-player-state--------------");
        console.log(state);

        let roomId = userToRoom[socket.id];
        let room = rooms[roomId];
        room.users[socket.id].isBuffering = state.isBuffering;
        let updatedState = {
            room: { users: Object.values(room.users) },
        };

        let isBuffering = Object.values(room.users).some((user) => user.isBuffering);
        let video = room.video;

        if (!isBuffering && room.action) {
            console.log("1");
            let action = room.action;
            updatedState["seek"] = action.time;
            updatedState["video"] = { action: room.video.isPlaying && !room.video.isBuffering ? "play" : "pause" };
            room.action = null;
        } else if (!isBuffering && room.isPlaying) {
            console.log("2");
            video.isBuffering = isBuffering;
            updatedState["video"] = { action: "play" };
        } else if (video.isBuffering != isBuffering) {
            console.log("3");
            video.isBuffering = isBuffering;
            updatedState["video"] = { action: room.video.isPlaying && !room.video.isBuffering ? "play" : "pause" };
        } else {
            console.log("4");
        }

        io.in(roomId).emit("updated-state", updatedState);
        console.log(updatedState.room);
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
        if (roomId) {
            updateLobby();
        }
        socket.leave("lobby", printRooms);
    });
});

const leaveRoom = (socketId) => {
    let room = userToRoom[socketId];
    if (!room) return null;
    let roomId = rooms[room].roomId;
    delete rooms[room].users[socketId];
    delete userToRoom[socketId];
    if (!Object.keys(rooms[room].users).length) {
        delete roomIdToRoom[roomId];
        delete rooms[room];
        return null;
    }
    return room;
};

const getRooms = () => {
    let currentRooms = Object.keys(rooms).map((room) => ({
        name: room,
        users: Object.keys(rooms[room].users).length,
        status: rooms[room].video,
    }));
    return currentRooms;
};

const updateLobby = () => {
    io.in("lobby").emit("rooms", getRooms());
};

const printRooms = () => {
    /*
    console.log(io.sockets.adapter.rooms);
    console.log(rooms);
    console.log(userToRoom);
    console.log(roomIdToRoom);
    console.log("--------------------");
    */
};

app.get("*", (request, response) => {
    response.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
});

server.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));
