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

        socket.leave("lobby");
        socket.join(roomId, printRooms);
        let room = rooms[roomId];
        room.users[socket.id] = { username, isBuffering: true };
        userToRoom[socket.id] = roomId;
        //if (room.video && room.video.isPlaying) room.video.isPlaying = false;
        socket.emit("joined-room", { name: roomId, users: Object.values(room.users), roomId: room.roomId }, room.video);
        socket.to(roomId).emit("updated-state", {
            room: { users: Object.values(room.users) },
            video: room.video,
            message: { username, msg: "has joined the chat", type: "status" },
        });
        updateLobby();
        getRooms();
    });

    socket.on("leave-room", () => {
        console.log("------------------leave-room------------------");
        let roomId = userToRoom[socket.id];
        if (!roomId) return socket.emit("left-room", getRooms());
        let username = rooms[roomId].users[socket.id];

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
        io.in(room).emit("load-video", { url, isPlaying: false });
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

    socket.on("update-player-state", (state) => {
        console.log("-----------update-player-state--------------");
        console.log(state);

        /*
        let roomId = userToRoom[socket.id];
        let room = rooms[roomId];
        let updatedState = { video: { isPlaying: true } };
        console.log(updatedState);
        io.in(roomId).emit("updated-state", updatedState);
        */

        /*
        room.users[socket.id].isBuffering = state.isBuffering;

        let updatedState = {
            room: { users: Object.values(room.users) },
        };

        
        let isBuffering = Object.values(room.users).some((user) => user.isBuffering);
        let video = room.video;
        console.log("isBuffering: " + isBuffering);
     
        if (video.isBuffering != isBuffering) {
            video.isBuffering = isBuffering;
            updatedState["video"] = { isPlaying: video.isPlaying && !isBuffering };
        }
       


        console.log(updatedState);
        */

        let roomId = userToRoom[socket.id];
        let room = rooms[roomId];
        room.users[socket.id].isBuffering = state.isBuffering;
        let updatedState = {
            room: { users: Object.values(room.users) },
        };

        let isBuffering = Object.values(room.users).some((user) => user.isBuffering);
        let video = room.video;
        if (video.isBuffering != isBuffering) {
            video.isBuffering = isBuffering;
            updatedState["video"] = { isPlaying: video.isPlaying && !isBuffering };
            console.log("1");
            console.log(updatedState);

            switch (isBuffering) {
                case true:
                    socket.to(roomId).emit("updated-state", updatedState);
                    break;
                case false:
                    io.in(roomId).emit("updated-state", updatedState);
                    break;
                default:
                    break;
            }
        } else {
            console.log("2");
            console.log(updatedState);
            socket.to(roomId).emit("updated-state", updatedState);
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
