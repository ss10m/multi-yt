import moment from "moment";

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

const timeSince = (then) => {
    return moment(then).fromNow();
};

const roundedToFixed = (number) => {
    return Intl.NumberFormat("en", { notation: "compact" }).format(number);
};

const parseTitle = (title) => {
    return title
        .replace(/&quot;/g, '‏‏‎"‎‎')
        .replace(/&amp;/g, "&‎‎‎")
        .replace(/&apos;/g, "‏‏‎'")
        .replace(/&gt;/g, '>‏‎"‎‎')
        .replace(/&lt;/g, '<"‎‎');
};

const parseDuration = (duration) => {
    duration = moment.duration(duration);
    const d = duration.get("days");
    const h = duration.get("hours");
    const m = duration.get("minutes");
    const s = duration.get("seconds");

    const parsed = [];
    if (d + h > 0) parsed.push(d * 24 + h);
    parsed.push(h > 0 ? ("0" + m).slice(-2) : m);
    parsed.push(("0" + s).slice(-2));
    return parsed.join(":");
};

export {
    PLAYER_STATE,
    PLAYER_ACTION,
    VOLUME,
    isEmpty,
    parseResponse,
    timeSince,
    roundedToFixed,
    parseTitle,
    parseDuration,
};
