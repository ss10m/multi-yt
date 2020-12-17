// Redux
import { batch } from "react-redux";
import socketIO from "socket.io-client";

// Helpers
import { isEmpty } from "helpers";

//=====================================
//          USER ACTIONS
//=====================================
export const setUsername = (username) => ({
    type: "SET_USERNAME",
    username,
});

//=====================================
//          SOCKET ACTIONS
//=====================================
export const connectSocket = (id) => async (dispatch, getState) => {
    let socket = socketIO.connect({ query: `id=${id}` });
    dispatch(setSocket(socket));

    socket.on("handle-error", (message) => {
        dispatch(setError(message));
    });

    socket.on("rooms", (rooms) => {
        dispatch(setRooms(rooms));
    });

    socket.on("joined-room", (room, video) => {
        batch(() => {
            dispatch(setRoom(room));
            dispatch(clearRooms());
            if (video) dispatch(setVideo(video));
        });
    });

    socket.on("left-room", (rooms) => {
        batch(() => {
            dispatch(clearRoom());
            dispatch(clearVideo());
            dispatch(clearPlayer());
            dispatch(clearMessages());
            dispatch(setRooms(rooms));
        });
    });

    socket.on("receive-message", (message) => {
        dispatch(addMessage(message));
    });

    socket.on("load-video", (video) => {
        dispatch(clearPlayer());
        dispatch(clearVideo());
        dispatch(setVideo(video));
    });

    socket.on("get-video-time", (roomId) => {
        let { player } = getState();
        let currentTime = 0;
        if (!isEmpty(player)) {
            let playerTime = player.embed.getCurrentTime();
            if (playerTime) currentTime = Math.floor(playerTime);
        }
        socket.emit("current-video-time", roomId, currentTime);
    });

    socket.on("remove-video", () => {
        batch(() => {
            dispatch(clearPlayer());
            dispatch(clearVideo());
        });
    });

    socket.on("updated-state", (updatedState) => {
        let keys = Object.keys(updatedState);
        let { player } = getState();
        batch(() => {
            for (let key of keys) {
                switch (key) {
                    case "room":
                        dispatch(setRoom(updatedState[key]));
                        break;
                    case "seek":
                        if (isEmpty(player) || isEmpty(player.embed)) return;
                        player.embed.playVideo();
                        player.embed.seekTo(updatedState[key]);
                        break;
                    case "video":
                        if (isEmpty(player) || isEmpty(player.embed)) return;
                        switch (updatedState[key].action) {
                            case "play":
                                player.embed.playVideo();
                                break;
                            case "pause":
                                player.embed.pauseVideo();
                                break;
                            default:
                                break;
                        }
                        if ("isPlaying" in updatedState[key]) {
                            dispatch(
                                setVideoState({ isPlaying: updatedState[key].isPlaying })
                            );
                        }
                        break;
                    case "message":
                        dispatch(addMessage(updatedState[key]));
                        break;
                    case "ended":
                        if (isEmpty(player) || isEmpty(player.embed)) return;
                        player.embed.seekTo(0);
                        player.embed.pauseVideo();
                        dispatch(setVideoState({ isPlaying: false }));
                        break;
                    default:
                        return;
                }
            }
        });
    });
};
export const setSocket = (socket) => ({
    type: "SET_SOCKET",
    socket,
});

//=====================================
//          ERROR ACTIONS
//=====================================
export const setError = (error) => ({
    type: "SET_ERROR",
    error,
});

//=====================================
//           ROOM ACTIONS
//=====================================
export const createRoom = () => async (dispatch, getState) => {
    let { socket, username } = getState();
    socket.emit("create-room", username);
};
export const joinRoom = (room) => async (dispatch, getState) => {
    let { socket, username } = getState();
    socket.emit("join-room", room, username);
};
export const leaveRoom = () => async (dispatch, getState) => {
    let { socket } = getState();
    socket.emit("leave-room");
};
export const setRoom = (room) => ({
    type: "SET_ROOM",
    room,
});
export const clearRoom = () => ({
    type: "CLEAR_ROOM",
});

//=====================================
//           ROOMS ACTIONS
//=====================================
export const refreshRooms = () => async (dispatch, getState) => {
    let { socket } = getState();
    socket.emit("rooms");
};
export const setRooms = (rooms) => ({
    type: "SET_ROOMS",
    rooms,
});
export const clearRooms = () => ({
    type: "CLEAR_ROOMS",
});

//=====================================
//          MESSAGE ACTIONS
//=====================================
export const sendMessage = (msg) => async (dispatch, getState) => {
    let { username, socket } = getState();
    let message = { username, msg };
    dispatch(addMessage(message));
    socket.emit("send-message", message);
};
export const addMessage = (message) => ({
    type: "ADD_MESSAGE",
    message,
});
export const clearMessages = () => ({
    type: "CLEAR_MESSAGES",
});

//=====================================
//           VIDEO ACTIONS
//=====================================
export const loadVideo = (url) => async (dispatch, getState) => {
    let { socket } = getState();
    socket.emit("load-video", url);
};
export const removeVideo = () => async (dispatch, getState) => {
    let { socket } = getState();
    socket.emit("remove-video");
};
export const updateVideo = (state) => async (dispatch, getState) => {
    let { socket } = getState();
    socket.emit("update-video", state);
};
export const setVideo = (video) => ({
    type: "SET_VIDEO",
    video,
});
export const setVideoState = (state) => ({
    type: "SET_VIDEO_STATE",
    state,
});
export const clearVideo = () => ({
    type: "CLEAR_VIDEO",
});

//=====================================
//           PLAYER ACTIONS
//=====================================
export const updatePlayerState = (state) => async (dispatch, getState) => {
    let { socket } = getState();
    socket.emit("update-player-state", state);
};
export const setPlayer = (embed) => ({
    type: "SET_PLAYER",
    embed,
});
export const clearPlayer = () => ({
    type: "CLEAR_PLAYER",
});

//=====================================
//        NOTIFICATION ACTIONS
//=====================================
export const addNotification = (notification) => ({
    type: "ADD_NOTIFICATION",
    notification,
});

export const removeNotification = (id) => ({
    type: "REMOVE_NOTIFICATION",
    id,
});
