// Libraries & utils
import React from "react";
import classNames from "classnames";
import { CopyToClipboard } from "react-copy-to-clipboard";

// Components
import Spinner from "../Spinner/Spinner";

// SCSS
import "./Room.scss";

// Icons
import { IconContext } from "react-icons";
import {
    FaPlay,
    FaPause,
    FaCheckCircle,
    FaVolumeMute,
    FaVolumeUp,
    FaVolumeDown,
    FaArrowLeft,
} from "react-icons/fa";
import { MdReplay10, MdReplay30, MdForward10, MdForward30 } from "react-icons/md";

// Other
import { PLAYER_ACTION, VOLUME, isEmpty } from "helpers";

export default (props) => {
    return (
        <div className="room">
            <Header room={props.room} leaveRoom={props.leaveRoom} />
            <div className="room-body">
                <Links
                    url={props.url}
                    inviteUrl={props.inviteUrl}
                    video={props.video}
                    loadVideo={props.loadVideo}
                    removeVideo={props.removeVideo}
                    handleInput={props.handleInput}
                />
                <PlayerStatus users={props.room.users} url={props.video.url} />
                <Controls {...props} />
            </div>
        </div>
    );
};

const Header = ({ room, leaveRoom }) => {
    return (
        <div className="room-header">
            <IconContext.Provider value={{ size: "20px", className: "header-icon" }}>
                <FaArrowLeft onClick={leaveRoom} />
            </IconContext.Provider>
            <p>{room.name}</p>
        </div>
    );
};

const Links = ({ url, inviteUrl, video, loadVideo, removeVideo, handleInput }) => {
    let isVideoLoaded = !isEmpty(video);
    let loadVideoBtn;
    if (isVideoLoaded) {
        loadVideoBtn = {
            onClick: removeVideo,
            content: "CLEAR",
        };
    } else {
        loadVideoBtn = {
            onClick: loadVideo,
            content: "PLAY",
        };
    }

    return (
        <div className="room-links">
            <div className="url-link">
                <input
                    type={"text"}
                    value={isVideoLoaded ? video.url : url}
                    placeholder={"Youtube URL"}
                    onChange={handleInput}
                    spellCheck={false}
                    autoFocus={false}
                    disabled={isVideoLoaded}
                />
                <button className="link-btn" onClick={loadVideoBtn.onClick}>
                    {loadVideoBtn.content}
                </button>
            </div>
            <div className="invite">
                <input
                    type={"text"}
                    value={inviteUrl}
                    placeholder={"Invite"}
                    spellCheck={false}
                    autoFocus={false}
                    readOnly={true}
                    onFocus={(event) => event.target.select()}
                />
                <CopyToClipboard text={inviteUrl}>
                    <button className="link-btn">COPY INVITE LINK</button>
                </CopyToClipboard>
            </div>
        </div>
    );
};

const Controls = (props) => {
    return (
        <div className="controls">
            <VolumeBar
                volume={props.volume}
                controlsDisabled={props.controlsDisabled}
                playedTimer={props.playedTimer}
                totalTimer={props.totalTimer}
                handleVolume={props.handleVolume}
            />
            <PlayerControls
                isPlaying={props.isPlaying}
                controlsDisabled={props.controlsDisabled}
                handleControls={props.handleControls}
            />
            <VideoProgress
                playedtime={props.playedtime}
                totalTime={props.totalTime}
                controlsDisabled={props.controlsDisabled}
                handleSeek={props.handleSeek}
            />
        </div>
    );
};

const VolumeBar = ({ volume, controlsDisabled, playedTimer, totalTimer, handleVolume }) => {
    return (
        <div className="volume-controls">
            <div className="timer">{`${playedTimer} / ${totalTimer}`}</div>
            <div className="volume" disabled={controlsDisabled}>
                <IconContext.Provider
                    value={{
                        size: "20px",
                        className: classNames("volume-icon", {
                            active: !controlsDisabled && volume === VOLUME.MUTED,
                        }),
                    }}
                >
                    <FaVolumeMute onClick={() => handleVolume(VOLUME.MUTED)} />
                </IconContext.Provider>
                <IconContext.Provider
                    value={{
                        size: "20px",
                        className: classNames("volume-icon", {
                            active: !controlsDisabled && volume === VOLUME.HALF,
                        }),
                    }}
                >
                    <FaVolumeDown onClick={() => handleVolume(VOLUME.HALF)} />
                </IconContext.Provider>
                <IconContext.Provider
                    value={{
                        size: "20px",
                        className: classNames("volume-icon", {
                            active: !controlsDisabled && volume === VOLUME.FULL,
                        }),
                    }}
                >
                    <FaVolumeUp onClick={() => handleVolume(VOLUME.FULL)} />
                </IconContext.Provider>
            </div>
        </div>
    );
};

const PlayerControls = ({ isPlaying, controlsDisabled, handleControls }) => {
    return (
        <div className={classNames("player-controls", { disabled: controlsDisabled })}>
            <div className="inner-box" />
            <div className="btn" onClick={() => handleControls(PLAYER_ACTION.SEEK_BACK_30)}>
                <IconContext.Provider value={{ size: "28px" }}>
                    <MdReplay30 />
                </IconContext.Provider>
            </div>
            <div className="btn" onClick={() => handleControls(PLAYER_ACTION.SEEK_BACK_10)}>
                <IconContext.Provider value={{ size: "35px" }}>
                    <MdReplay10 />
                </IconContext.Provider>
            </div>
            <div className="btn-wrapper">
                <div
                    className={classNames("btn large", {
                        pause: isPlaying,
                        play: !isPlaying,
                    })}
                    onClick={() =>
                        handleControls(isPlaying ? PLAYER_ACTION.PAUSE : PLAYER_ACTION.PLAY)
                    }
                >
                    <IconContext.Provider value={{ size: "30px" }}>
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </IconContext.Provider>
                </div>
            </div>
            <div
                className="btn"
                onClick={() => handleControls(PLAYER_ACTION.SEEK_FORWARD_10)}
            >
                <IconContext.Provider value={{ size: "35px" }}>
                    <MdForward10 />
                </IconContext.Provider>
            </div>
            <div
                className="btn"
                onClick={() => handleControls(PLAYER_ACTION.SEEK_FORWARD_30)}
            >
                <IconContext.Provider value={{ size: "28px" }}>
                    <MdForward30 />
                </IconContext.Provider>
            </div>
        </div>
    );
};

const VideoProgress = ({ playedtime, totalTime, controlsDisabled, handleSeek }) => {
    return (
        <input
            className="slider"
            type="range"
            value={playedtime}
            min={0}
            max={totalTime}
            onInput={handleSeek}
            step={1}
            disabled={controlsDisabled}
        />
    );
};

const PlayerStatus = ({ users, url }) => {
    let checkbox = (
        <IconContext.Provider value={{ size: "15px", color: "green" }}>
            <FaCheckCircle />
        </IconContext.Provider>
    );
    let loading = <Spinner size="15px" />;

    let status = (user) => {
        if (!url || !user.isBuffering) return checkbox;
        return loading;
    };

    return (
        <div className="room-status">
            {users.map((user, idx) => (
                <div className="user" key={idx}>
                    <p>{user.username}</p>
                    {status(user)}
                </div>
            ))}
        </div>
    );
};
