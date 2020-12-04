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

const dateDifference = (then, now) => {
    let offset = (now - then) / 1000;
    let delta_s = parseInt(offset % 60);
    offset /= 60;
    let delta_m = parseInt(offset % 60);
    offset /= 60;
    let delta_h = parseInt(offset % 24);
    offset /= 24;
    let delta_d = parseInt(offset);

    if (delta_d > 365) {
        let years = parseInt(delta_d / 365);
        let plural = years > 1 ? "s" : "";
        return `${years} year${plural} ago`;
    }
    if (delta_d > 30) {
        let months = parseInt(delta_d / 30);
        let plural = months > 1 ? "s" : "";
        return `${months} month${plural} ago`;
    }
    if (delta_d > 0) {
        let plural = delta_d > 1 ? "s" : "";
        return `${delta_d} day${plural} ago`;
    }
    if (delta_h > 0) {
        let plural = delta_h > 1 ? "s" : "";
        return `${delta_h} hour${plural} ago`;
    }
    if (delta_m > 0) {
        let plural = delta_m > 1 ? "s" : "";
        return `${delta_m} minute${plural} ago`;
    }
    if (delta_s > 10) {
        return `${delta_s} seconds ago`;
    } else {
        return "just now";
    }
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
    duration = duration
        .replace("PT", "")
        .replace("H", ":")
        .replace("M", ":")
        .replace("S", "");

    duration = duration.split(":");
    duration = duration.map((digit, i) => (i > 0 && digit < 10 ? "0" + digit : digit));
    return duration.join(":");
};

export {
    PLAYER_STATE,
    PLAYER_ACTION,
    VOLUME,
    isEmpty,
    parseResponse,
    dateDifference,
    roundedToFixed,
    parseTitle,
    parseDuration,
};
