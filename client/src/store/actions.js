import { batch } from "react-redux";
import socketIO from "socket.io-client";
import { isEmpty } from "helpers";

//=====================================
//          SOCKET ACTIONS
//=====================================
export const connectSocket = (id) => async (dispatch, getState) => {
    let socket = socketIO.connect({ query: `id=${id}` });
    dispatch(setSocket(socket));

    socket.on("handle-error", () => {
        console.log("RESPONSE: handle-error");
        dispatch(setError("Reached maximum number of allowed tabs in a single browser"));
    });

    socket.on("rooms", (rooms) => {
        console.log("RESPONSE: rooms");
        dispatch(setRooms(rooms));
    });

    socket.on("joined-room", (room, video) => {
        console.log("RESPONSE: joined-room");
        batch(() => {
            dispatch(setRoom(room));
            dispatch(clearRooms());
            if (video) dispatch(setVideo(video));
        });
    });

    socket.on("left-room", (rooms) => {
        console.log("RESPONSE: left-room");
        batch(() => {
            dispatch(clearRoom());
            dispatch(clearVideo());
            dispatch(clearPlayer());
            dispatch(clearMessages());
            dispatch(setRooms(rooms));
        });
    });

    socket.on("receive-message", (message) => {
        console.log("RESPONSE: receive-message");
        dispatch(addMessage(message));
    });

    socket.on("load-video", (video) => {
        console.log("RESPONSE: load-video");
        dispatch(setVideo(video));
    });

    socket.on("get-video-time", (roomId) => {
        let { player } = getState();
        let currentTime = 0;
        if (!isEmpty(player)) {
            let playerTime = player.embed.getCurrentTime();
            if (playerTime) {
                currentTime = playerTime;
            }
        }
        socket.emit("current-video-time", roomId, currentTime);
    });

    socket.on("remove-video", () => {
        console.log("RESPONSE: remove-video");
        batch(() => {
            dispatch(clearPlayer());
            dispatch(clearVideo());
        });
    });

    socket.on("updated-state", (updatedState) => {
        console.log("RESPONSE: updated-state");
        console.log(updatedState);
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
                        player.embed.seekTo(updatedState[key]);
                        player.embed.playVideo();
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
                        dispatch(setVideoState({ isPlaying: updatedState[key].isPlaying }));
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
//          USER ACTIONS
//=====================================
export const setUsername = (username) => ({
    type: "SET_USERNAME",
    username,
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
    console.log("ACTION: create-room");
    let { socket, username } = getState();
    socket.emit("create-room", username);
};
export const joinRoom = (room) => async (dispatch, getState) => {
    console.log("ACTION: join-room");
    let { socket, username } = getState();
    socket.emit("join-room", room, username);
};
export const leaveRoom = (socket) => async (dispatch) => {
    console.log("ACTION: leave-room");
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
    console.log("ACTION: rooms");
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
export const sendMessage = (socket, username, msg) => async (dispatch) => {
    console.log("ACTION: send-message");
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
export const loadVideo = (socket, url) => async (dispatch) => {
    console.log("ACTION: load-video");
    socket.emit("load-video", url);
};
export const removeVideo = (socket) => async (dispatch) => {
    console.log("ACTION: remove-video");
    socket.emit("remove-video");
};
export const updateVideo = (socket, state) => async (dispatch) => {
    console.log("ACTION: update-video");
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
    console.log("ACTION: update-player-state");
    let { socket } = getState();
    socket.emit("update-player-state", state);
};
export const setPlayer = (embed) => ({
    type: "SET_PLAYER",
    embed,
});
export const setPlayerState = (state) => ({
    type: "SET_PLAYER_STATE",
    state,
});
export const clearPlayer = () => ({
    type: "CLEAR_PLAYER",
});
