import socketIO from "socket.io-client";
import { isEmpty } from "helpers";

//=====================================
//          SOCKET ACTIONS
//=====================================
export const connectSocket = () => async (dispatch, getState) => {
    let socket = socketIO.connect();
    dispatch(setSocket(socket));
    socket.on("rooms", (rooms) => {
        console.log("RESPONSE: rooms");
        dispatch(setRooms(rooms));
    });

    socket.on("joined-room", (room, video) => {
        console.log("RESPONSE: joined-room");
        dispatch(setRoom(room));
        dispatch(setVideo(video));
        dispatch(clearRooms());
    });

    socket.on("left-room", (rooms) => {
        console.log("RESPONSE: left-room");
        dispatch(clearRoom());
        dispatch(clearVideo());
        dispatch(clearMessages());
        dispatch(setRooms(rooms));
    });

    socket.on("receive-message", (message) => {
        console.log("RESPONSE: receive-message");
        dispatch(addMessage(message));
    });

    socket.on("load-video", (video) => {
        console.log("RESPONSE: load-video");
        video.isPlayerReady = false;
        dispatch(setVideo(video));
    });

    socket.on("remove-video", () => {
        console.log("RESPONSE: remove-video");
        dispatch(clearPlayer());
        dispatch(clearVideo());
    });

    socket.on("updated-state", (updatedState) => {
        console.log("RESPONSE: updated-state");
        console.log(updatedState);
        let keys = Object.keys(updatedState);
        let { player } = getState();
        for (let key of keys) {
            switch (key) {
                case "room":
                    console.log(updatedState[key]);
                    dispatch(setRoom(updatedState[key]));
                    break;
                case "video":
                    //dispatch(setVideo(updatedState[key]));

                    if (updatedState[key].hasOwnProperty("isPlaying")) {
                        switch (updatedState[key].isPlaying) {
                            case true:
                                return player.embed.playVideo();
                            case false:
                                return player.embed.pauseVideo();
                            default:
                                break;
                        }
                    }
                    if (updatedState[key].hasOwnProperty("isBuffering")) {
                        switch (updatedState[key].isBuffering) {
                            case true:
                                return player.embed.pauseVideo();

                            case false:
                                return player.embed.playVideo();
                            default:
                                break;
                        }
                    }

                    break;
                case "seek":
                    if (isEmpty(player) || isEmpty(player.embed)) return;
                    player.embed.seekTo(updatedState[key]);
                    break;
                case "message":
                    dispatch(addMessage(updatedState[key]));
                    break;
                default:
                    return;
            }
        }
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
//           ROOM ACTIONS
//=====================================
export const createRoom = (socket, username) => async (dispatch) => {
    console.log("ACTION: create-room");
    socket.emit("create-room", username);
};
export const joinRoom = (socket, room, username) => async (dispatch) => {
    console.log("ACTION: join-room");
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
export const refreshRooms = (socket) => async (dispatch) => {
    console.log("ACTION: rooms");
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
    console.log(message);
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
export const updatePlayerState = (socket, state) => async (dispatch) => {
    console.log("ACTION: update-player-state");
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
