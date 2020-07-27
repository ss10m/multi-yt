import socketIO from "socket.io-client";

//=====================================
//          SOCKET ACTIONS
//=====================================
export const connectSocket = () => async (dispatch) => {
    let socket = socketIO.connect();
    dispatch(setSocket(socket));
    socket.on("rooms", (rooms) => {
        console.log("RESPONSE: rooms");
        dispatch(setRooms(rooms));
    });

    socket.on("joined-room", (room) => {
        console.log("RESPONSE: joined-room");
        dispatch(setRoom(room));
        dispatch(clearRooms());
    });

    socket.on("left-room", (rooms) => {
        console.log("RESPONSE: left-room");
        dispatch(clearRoom());
        dispatch(clearMessages());
        dispatch(setRooms(rooms));
    });

    socket.on("receive-message", (message) => {
        console.log("RESPONSE: receive-message");
        dispatch(addMessage(message));
    });
};
export const setSocket = (socket) => ({
    type: "SET_SOCKET",
    socket,
});
export const clearSocket = () => ({
    type: "CLEAR_SOCKET",
});

//=====================================
//          PLAYER ACTIONS
//=====================================
export const clearPlayer = () => ({
    type: "CLEAR_PLAYER",
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

export const setPlayer = (player) => ({
    type: "SET_PLAYER",
    player,
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
