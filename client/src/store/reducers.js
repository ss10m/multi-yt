import { combineReducers } from "redux";

const SET_USERNAME = "SET_USERNAME";

const usernameReducer = (state = "User", action) => {
    switch (action.type) {
        case SET_USERNAME:
            return action.username;
        default:
            return state;
    }
};

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

const SET_ROOM = "SET_ROOM";
const CLEAR_ROOM = "CLEAR_ROOM";

const roomReducer = (state = null, action) => {
    switch (action.type) {
        case SET_ROOM:
            return action.room;
        case CLEAR_ROOM:
            return null;
        default:
            return state;
    }
};

let messages = [
    { username: "WittehMate", msg: "3.0 is never coming out" },
    {
        username: "bogahey",
        msg: "no point for w to do this he would have to add all this on the new phone at some point",
    },
    { username: "xIAlexanderIx", msg: "dud you leaked the 3.0 release" },
    {
        username: "Koil",
        msg: "currently when people sign on as cops the radio is on 1.0 and extremely loud for everyone... yeah",
    },
    { username: "xIAlexanderIx", msg: "brah" },
    {
        username: "StreamElements",
        msg: "rHighrise_ went all in and lost every single one of their 90 points",
    },
    {
        username: "bogahey",
        msg: "no point for w to do this he would have to add all this on the new phone at some point",
    },

    {
        username: "xIAlexanderIx",
        msg: "there a few empty tabs right? you could move some of the missing elements to a new tab haha",
    },
    {
        username: "Koil",
        msg: "currently when people sign on as cops the radio is on 1.0 and extremely loud for everyone... yeah",
    },
];

const ADD_MESSAGE = "ADD_MESSAGE";
const CLEAR_MESSAGES = "CLEAR_MESSAGES";

const messagesReducer = (state = messages, action) => {
    switch (action.type) {
        case ADD_MESSAGE:
            return [...state, action.message];
        case CLEAR_MESSAGES:
            return [];
        default:
            return state;
    }
};

const SET_VIDEO = "SET_VIDEO";
const SET_PLAYER = "SET_PLAYER";
const UPDATE_PLAYER = "UPDATE_PLAYER";
const CLEAR_VIDEO = "CLEAR_VIDEO";

const videoReducer = (state = null, action) => {
    switch (action.type) {
        case SET_VIDEO:
            return { ...action.video };
        case SET_PLAYER:
            return { ...state, player: action.player };
        case UPDATE_PLAYER:
            return { ...state, ...action.updatedState };
        case CLEAR_VIDEO:
            return null;
        default:
            return state;
    }
};

export default combineReducers({
    username: usernameReducer,
    socket: socketReducer,
    room: roomReducer,
    rooms: roomsReducer,
    messages: messagesReducer,
    video: videoReducer,
});
