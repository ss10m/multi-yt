// Player States
const PLAYER_STATE = {
    BUFFERING: 3,
    ENDED: 0,
};

// Player Actions
const PLAYER_ACTION = {
    PLAY: "PLAY",
    PAUSE: "PAUSE",
    SEEK_BACK_10: "SEEK_BACK_10",
    SEEK_BACK_30: "SEEK_BACK_30",
    SEEK_FORWARD_10: "SEEK_FORWARD_10",
    SEEK_FORWARD_30: "SEEK_FORWARD_30",
};

// Volume states
const VOLUME = {
    MUTED: 1,
    HALF: 2,
    FULL: 3,
};

const isEmpty = (obj) => {
    return !obj || Object.keys(obj).length === 0;
};

const parseResponse = async (response) => {
    try {
        return await response.json();
    } catch (err) {
        return null;
    }
};

export { PLAYER_STATE, PLAYER_ACTION, VOLUME, isEmpty, parseResponse };
