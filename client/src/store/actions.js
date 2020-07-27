import socketIO from "socket.io-client";

export const connectSocket = () => async (dispatch) => {
    let socket = socketIO.connect();
    dispatch(setSocket(socket));
    socket.on("rooms", (rooms) => {
        console.log("RESPONSE: rooms");
        console.log(rooms);
        dispatch(setRooms(rooms));
    });

    socket.on("joined-room", (room) => {
        console.log("RESPONSE: joined-room");
        console.log(room);
        dispatch(setRoom(room));
        dispatch(clearRooms());
    });

    socket.on("left-room", (rooms) => {
        console.log("RESPONSE: left-room");
        dispatch(clearRoom());
        dispatch(setRooms(rooms));
    });
};

export const joinRoom = (socket, room, username) => async (dispatch) => {
    console.log("ACTION: join-room");
    socket.emit("join-room", room, username);
};

export const leaveRoom = (socket) => async (dispatch) => {
    console.log("ACTION: leave-room");
    socket.emit("leave-room");
};

export const createRoom = (socket, username) => async (dispatch) => {
    console.log("ACTION: create-room");
    socket.emit("create-room", username);
};

export const refreshRooms = (socket) => async (dispatch) => {
    console.log("ACTION: rooms");
    socket.emit("rooms");
};

export const setSocket = (socket) => ({
    type: "SET_SOCKET",
    socket,
});

export const clearSocket = () => ({
    type: "CLEAR_SOCKET",
});

export const setPlayer = (player) => ({
    type: "SET_PLAYER",
    player,
});

export const clearPlayer = () => ({
    type: "CLEAR_PLAYER",
});

export const setRooms = (rooms) => ({
    type: "SET_ROOMS",
    rooms,
});

export const clearRooms = () => ({
    type: "CLEAR_ROOMS",
});

export const setRoom = (room) => ({
    type: "SET_ROOM",
    room,
});

export const clearRoom = () => ({
    type: "CLEAR_ROOM",
});

export const setUsername = (username) => ({
    type: "SET_USERNAME",
    username,
});
