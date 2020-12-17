// Libraries & utils
import { nanoid } from "nanoid";

// Redux
import { combineReducers } from "redux";

const SET_USERNAME = "SET_USERNAME";
const usernameReducer = (state = "", action) => {
    switch (action.type) {
        case SET_USERNAME:
            return action.username;
        default:
            return state;
    }
};

const SET_ERROR = "SET_ERROR";
const errorReducer = (state = null, action) => {
    switch (action.type) {
        case SET_ERROR:
            return action.error;
        default:
            return state;
    }
};

const SET_SOCKET = "SET_SOCKET";
const socketReducer = (state = null, action) => {
    switch (action.type) {
        case SET_SOCKET:
            return action.socket;
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
const roomReducer = (state = {}, action) => {
    switch (action.type) {
        case SET_ROOM:
            return { ...state, ...action.room };
        case CLEAR_ROOM:
            return {};
        default:
            return state;
    }
};

const ADD_MESSAGE = "ADD_MESSAGE";
const CLEAR_MESSAGES = "CLEAR_MESSAGES";
const messagesReducer = (state = [], action) => {
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
const SET_VIDEO_STATE = "SET_VIDEO_STATE";
const CLEAR_VIDEO = "CLEAR_VIDEO";
const videoReducer = (state = {}, action) => {
    switch (action.type) {
        case SET_VIDEO:
            return { ...state, ...action.video };
        case SET_VIDEO_STATE:
            return { ...state, ...action.state };
        case CLEAR_VIDEO:
            return {};
        default:
            return state;
    }
};

const SET_PLAYER = "SET_PLAYER";
const SET_PLAYER_STATE = "SET_PLAYER_STATE";
const CLEAR_PLAYER = "CLEAR_PLAYER";
const playerReducer = (state = {}, action) => {
    switch (action.type) {
        case SET_PLAYER:
            return { embed: action.embed, state: -1 };
        case SET_PLAYER_STATE:
            return { ...state, state: action.state };
        case CLEAR_PLAYER:
            return {};
        default:
            return state;
    }
};

const ADD_NOTIFICATION = "ADD_NOTIFICATION";
const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";
const notificationsReducer = (state = [], action) => {
    switch (action.type) {
        case ADD_NOTIFICATION:
            let notification = { id: nanoid(7), ...action.notification };
            return [notification, ...state];
        case REMOVE_NOTIFICATION:
            return state.filter((notification) => notification.id !== action.id);
        default:
            return state;
    }
};

export default combineReducers({
    username: usernameReducer,
    error: errorReducer,
    socket: socketReducer,
    room: roomReducer,
    rooms: roomsReducer,
    messages: messagesReducer,
    video: videoReducer,
    player: playerReducer,
    notifications: notificationsReducer,
});
