import { Room } from "../core/index.js";

export const videoHandlers = (io, socket) => {
    socket.on("load-video", (url) => {
        let room = Room.getRoomBySocketId(socket.id);
        if (!room) return;
        room.loadVideo(url);
        io.in(room.id).emit("load-video", { url, isPlaying: true });
    });

    socket.on("remove-video", () => {
        let room = Room.getRoomBySocketId(socket.id);
        if (!room) return;
        room.removeVideo();
        io.in(room.id).emit("remove-video");
    });

    socket.on("current-video-time", (id, currentTime) => {
        let room = Room.getRoomById(id);
        if (!room) return;
        room.setAction({ type: "seek", time: currentTime });
    });

    socket.on("update-video", (state) => {
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
            if (!room.action) io.in(room.id).emit("updated-state", state);
            return;
        }
        if (state.hasOwnProperty("ended")) {
            room.update("video", { isPlaying: false });
            return io.in(room.id).emit("updated-state", { ended: true });
        }
    });

    socket.on("update-player-state", (state) => {
        let room = Room.getRoomBySocketId(socket.id);
        if (!room) return;
        let user = room.users[socket.id];
        if (!user) return;

        let isBufferingPrev = room.isVideoBuffering();
        room.setUserState(socket.id, "isBuffering", state.isBuffering);
        let isBuffering = room.isVideoBuffering();
        room.update("video", { isBuffering });

        let updatedState = {};
        if (room.action && !isBuffering) {
            for (let clientId of room.actionClients) {
                io.to(clientId).emit("updated-state", { seek: room.action.time });
            }
            room.clearAction();
        } else if (isBuffering != isBufferingPrev) {
            if (!isBuffering && room.video.isPlaying) {
                updatedState["video"] = {
                    action: "play",
                };
            }
        }
        updatedState["room"] = { users: room.getUsers() };
        io.in(room.id).emit("updated-state", updatedState);
    });
};
