import { Room, Connection } from "../core/index.js";

export const roomHandlers = (io, socket) => {
    let browserId = socket.handshake.query.id;
    let connection = new Connection(browserId, socket.id);
    if (!connection.isValid) {
        socket.emit("handle-error");
        return socket.disconnect();
    }

    socket.emit("rooms", Room.getRooms());
    socket.join("lobby");

    socket.on("create-room", (username) => {
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
        updateLobby(io);
    });

    socket.on("join-room", (id, username) => {
        let room = Room.getRoomById(id);
        if (!room) return socket.emit("rooms", Room.getRooms());

        socket.leave("lobby");
        socket.join(room.id);

        let updatedState = {};
        if (room.video.url) {
            room.update("video", { isBuffering: true });
            updatedState["video"] = { action: "pause", isPlaying: room.video.isPlaying };
            if (!room.actionClients.length) io.to(Object.keys(room.users)[0]).emit("get-video-time", room.id);
            room.addActionClient(socket.id);
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
        updateLobby(io);
    });

    socket.on("leave-room", () => {
        let room = Room.getRoomBySocketId(socket.id);
        if (!room) return;

        let isBufferingPrev = room.isVideoBuffering();
        let removed = room.leave(socket.id);
        let isBuffering = room.isVideoBuffering();

        socket.leave(room.id);
        socket.join("lobby");
        socket.emit("left-room", Room.getRooms());

        if (removed.isEmpty) return updateLobby(io);

        let updatedState = {};
        updatedState["room"] = { users: Object.values(room.users) };
        updatedState["message"] = { username: removed.username, msg: "has left the chat", type: "status" };
        if (isBufferingPrev !== isBuffering) {
            room.update("video", { isBuffering });
            updatedState["video"] = {
                isPlaying: room.video.isPlaying,
                action: room.video.isPlaying && !room.video.isBuffering ? "play" : "pause",
            };
        }
        socket.to(room.id).emit("updated-state", updatedState);
    });

    socket.on("rooms", () => {
        socket.emit("rooms", Room.getRooms());
    });

    socket.on("send-message", (message) => {
        let room = Room.getRoomBySocketId(socket.id);
        if (!room) return;
        socket.to(room.id).emit("receive-message", message);
    });

    socket.on("disconnect", () => {
        Connection.removeConnection(socket.id);
        let room = Room.getRoomBySocketId(socket.id);
        if (!room) {
            return socket.leave("lobby");
        }

        socket.leave(room.id);
        let isBufferingPrev = room.isVideoBuffering();
        let removed = room.leave(socket.id);
        if (!removed.isEmpty) {
            let isBuffering = room.isVideoBuffering();
            let updatedState = {};
            updatedState["room"] = { users: room.getUsers() };
            updatedState["message"] = { username: removed.username, msg: "has left the chat", type: "status" };

            if (isBufferingPrev !== isBuffering) {
                updatedState["room"] = { users: Object.values(room.users) };
                room.update("video", { isBuffering });
                updatedState["video"] = {
                    isPlaying: room.video.isPlaying,
                    action: room.video.isPlaying && !room.video.isBuffering ? "play" : "pause",
                };
            }
            socket.to(room.id).emit("updated-state", updatedState);
        }
        updateLobby(io);
    });
};

const updateLobby = (io) => {
    io.in("lobby").emit("rooms", Room.getRooms());
};
