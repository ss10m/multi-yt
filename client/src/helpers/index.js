// Player States
const PLAYING = 1;
const PAUSED = 2;
const BUFFERING = 3;
const ENDED = 0;

// Volume states
const VOLUME_MUTED = 1;
const VOLUME_HALF = 2;
const VOLUME_FULL = 3;

export { PLAYING, PAUSED, BUFFERING, ENDED, VOLUME_MUTED, VOLUME_HALF, VOLUME_FULL };

export const isEmpty = (obj) => {
    return !obj || Object.keys(obj).length === 0;
};
