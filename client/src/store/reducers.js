import { combineReducers } from "redux";

const SET_SOCKET = "SET_SOCKET";
const CLEAR_SOCKET = "CLEAR_SOCKET";

const socketReducer = (state = null, action) => {
    switch (action.type) {
        case SET_SOCKET:
            return action.socket;
        case CLEAR_SOCKET:
            return null;
        default:
            return state;
    }
};

const SET_PLAYER = "SET_PLAYER";
const CLEAR_PLAYER = "CLEAR_PLAYER";

const playerReducer = (state = null, action) => {
    switch (action.type) {
        case SET_PLAYER:
            return action.player;
        case CLEAR_PLAYER:
            return null;
        default:
            return state;
    }
};

const SET_ROOMS = "SET_ROOMS";
const CLEAR_ROOMS = "CLEAR_ROOMS";

const roomsReducer = (state = [], action) => {
    switch (action.type) {
        case SET_ROOMS:
            return [...action.rooms];
        case CLEAR_ROOMS:
            return [];
        default:
            return state;
    }
};

export default combineReducers({
    socket: socketReducer,
    player: playerReducer,
    rooms: roomsReducer,
});
