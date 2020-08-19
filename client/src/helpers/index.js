// Player States
const PLAYING = 1;
const PAUSED = 2;
const BUFFERING = 3;
const ENDED = 0;

// Player Actions
const PLAY = "PLAY";
const PAUSE = "PAUSE";
const SEEK_BACK_10 = "SEEK_BACK_10";
const SEEK_BACK_30 = "SEEK_BACK_30";
const SEEK_FORWARD_10 = "SEEK_FORWARD_10";
const SEEK_FORWARD_30 = "SEEK_FORWARD_30";

// Volume states
const VOLUME_MUTED = 1;
const VOLUME_HALF = 2;
const VOLUME_FULL = 3;

const isEmpty = (obj) => {
    return !obj || Object.keys(obj).length === 0;
};

export {
    PLAYING,
    PAUSED,
    BUFFERING,
    ENDED,
    PLAY,
    PAUSE,
    SEEK_BACK_10,
    SEEK_BACK_30,
    SEEK_FORWARD_10,
    SEEK_FORWARD_30,
    VOLUME_MUTED,
    VOLUME_HALF,
    VOLUME_FULL,
    isEmpty,
};
