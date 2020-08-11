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

import Room from "./room.js";

let roomsId = 0;
let rooms = {};
let userToRoom = {};
let roomIdToRoom = {};
let browserIds = {};
let socketIdtoBrowserId = {};

io.on("connection", (socket) => {
    console.log("------------------connection------------------");

    /*
    let browserId = socket.handshake.query.id;
    if (browserIds.hasOwnProperty(browserId)) {
        let connectedUsers = browserIds[browserId];
        if (connectedUsers >= 4) {
            socket.emit("handle-error");
            return socket.disconnect();
        }
        browserIds[browserId] += 1;
    } else {
        browserIds[browserId] = 1;
    }
    socketIdtoBrowserId[socket.id] = browserId;
    */

    socket.emit("rooms", Room.getRooms());
    socket.join("lobby", printRooms);

    socket.on("create-room", (username) => {
        console.log("------------------create-room------------------");
        let room = new Room(socket.id);
        room.addUser(socket.id, username);
        socket.leave("lobby");
        socket.join(room.id);
        let roomInfo = {
            id: room.id,
            name: room.name,
            users: room.getUsers(),
        };
        socket.emit("joined-room", roomInfo);
        updateLobby();
    });

    socket.on("join-room", (id, username) => {
        console.log("------------------join-room------------------");

        let room = Room.getRoomById(id);
        if (!room) return socket.emit("rooms", Room.getRooms());

        socket.leave("lobby");
        socket.join(room.id, printRooms);

        let updatedState = {};
        if (room.video.url) {
            room.update("video", { isBuffering: true });
            updatedState["video"] = { action: "pause", isPlaying: room.video.isPlaying };
            io.to(Object.keys(room.users)[0]).emit("get-video-time", room.id);
        }

        room.addUser(socket.id, username);

        let users = { users: Object.values(room.users) };
        updatedState["room"] = users;
        updatedState["message"] = { username, msg: "has joined the chat", type: "status" };

        let videoStatus = {
            url: room.video.url,
            isPlaying: room.video.isPlaying,
        };
        socket.emit("joined-room", { name: room.name, ...users, id: room.id }, videoStatus);
        socket.to(room.id).emit("updated-state", updatedState);
        updateLobby();
    });

    socket.on("current-video-time", (id, currentTime) => {
        console.log("------------current-video-time-------------");
        let room = Room.getRoomById(id);
        if (!room) return;
        room.setAction({ type: "seek", time: currentTime });
    });

    socket.on("leave-room", () => {
        console.log("------------------leave-room------------------");

        let room = Room.getRoomBySocketId(socket.id);
        if (!room) return;

        let removed = room.leave(socket.id);
        socket.leave(room.id);
        socket.join("lobby");
        socket.emit("left-room", Room.getRooms());

        let updatedState = {};
        let users = { users: Object.values(room.users) };
        updatedState["room"] = users;

        if (!removed.isEmpty) {
            socket.to(room.id).emit("updated-state", {
                room: { users: Object.values(room.users) },
                message: { username: removed.username, msg: "has left the chat", type: "status" },
            });
        }

        updateLobby();
    });

    socket.on("rooms", () => {
        console.log("------------------rooms------------------");
        socket.emit("rooms", Room.getRooms());
    });

    socket.on("send-message", (message) => {
        console.log("------------------send-message------------------");
        let room = Room.getRoomBySocketId(socket.id);
        if (!room) return;
        socket.to(room.id).emit("receive-message", message);
    });

    socket.on("load-video", (url) => {
        console.log("------------------load-video------------------");
        let room = Room.getRoomBySocketId(socket.id);
        if (!room) return;
        room.loadVideo(url);
        io.in(room.id).emit("load-video", { url, isPlaying: true });
    });

    socket.on("remove-video", () => {
        console.log("------------------remove-video------------------");
        let room = Room.getRoomBySocketId(socket.id);
        if (!room) return;
        room.removeVideo();
        io.in(room.id).emit("remove-video");
    });

    socket.on("update-video", (state) => {
        console.log("------------------update-video------------------");

        let room = Room.getRoomBySocketId(socket.id);
        if (!room) return;

        if (state.hasOwnProperty("isPlaying")) {
            room.update("video", state);

            let video = {
                isPlaying: room.video.isPlaying,
                action: room.video.isPlaying && !room.video.isBuffering ? "play" : "pause",
            };
            return io.in(room.id).emit("updated-state", { video });
        }
        if (state.hasOwnProperty("seek")) {
            return io.in(room.id).emit("updated-state", state);
        }
    });

    socket.on("update-player-state", (state) => {
        console.log("-----------update-player-state--------------");
        let room = Room.getRoomBySocketId(socket.id);
        if (!room) return;

        room.setUserState(socket.id, "isBuffering", state.isBuffering);

        let updatedState = {
            room: { users: room.getUsers() },
        };

        let isBuffering = room.isVideoBuffering();
        let video = room.video;

        if (!isBuffering && room.action) {
            let action = room.action;
            updatedState["seek"] = action.time;
            updatedState["video"] = {
                isPlaying: room.video.isPlaying,
                action: room.video.isPlaying && !room.video.isBuffering ? "play" : "pause",
            };
            room.setAction(null);
        } else if (!isBuffering && room.isPlaying) {
            updatedState["video"] = { isPlaying: room.video.isPlaying, action: "play" };
            room.update("video", { isBuffering });
        } else if (video.isBuffering != isBuffering) {
            room.update("video", { isBuffering });
            updatedState["video"] = {
                isPlaying: room.video.isPlaying,
                action: room.video.isPlaying && !room.video.isBuffering ? "play" : "pause",
            };
        }

        io.in(room.id).emit("updated-state", updatedState);
    });

    socket.on("disconnect", () => {
        console.log("------------------disconnect------------------");

        let room = Room.getRoomBySocketId(socket.id);
        if (!room) {
            return socket.leave("lobby", printRooms);
        }

        socket.leave(room.id);
        let removed = room.leave(socket.id);
        if (!removed.isEmpty) {
            socket.to(room.id).emit("updated-state", {
                room: { users: room.getUsers() },
                message: { username: removed.username, msg: "has left the chat", type: "status" },
            });
        }
        updateLobby();

        let browserId = socketIdtoBrowserId[socket.id];
        if (!browserId) return;
        let connectecUsers = browserIds[browserId];
        if (connectecUsers <= 1) {
            delete browserIds[browserId];
        } else {
            browserIds[browserId] -= 1;
        }
        delete socketIdtoBrowserId[socket.id];
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

const updateLobby = () => {
    io.in("lobby").emit("rooms", Room.getRooms());
};

const printRooms = () => {
    console.log(Room);
};

app.get("*", (request, response) => {
    response.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
});

server.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));
