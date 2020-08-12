import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import classNames from "classnames";

import { debounce } from "lodash";
import { connect } from "react-redux";

import Spinner from "../Spinner/Spinner";

import { sprintf } from "sprintf-js";

import { IconContext } from "react-icons";
import { FaPlay, FaPause, FaCheckCircle, FaVolumeMute, FaVolumeUp, FaVolumeDown } from "react-icons/fa";
import { MdReplay10, MdReplay30, MdForward10, MdForward30 } from "react-icons/md";
import { leaveRoom, loadVideo, removeVideo, updateVideo } from "store/actions";

import { isEmpty, VOLUME_MUTED, VOLUME_HALF, VOLUME_FULL } from "helpers";

import "./Room.scss";

const PLAY = "PLAY";
const PAUSE = "PAUSE";
const SEEK_BACK_10 = "SEEK_BACK_10";
const SEEK_BACK_30 = "SEEK_BACK_30";
const SEEK_FORWARD_10 = "SEEK_FORWARD_10";
const SEEK_FORWARD_30 = "SEEK_FORWARD_30";

class Room extends React.Component {
    constructor(props) {
        super(props);
        this.state = { url: "", timePlayed: 0, totalTime: 0, volume: VOLUME_MUTED };

        this.updateServer = debounce(this.updateServer, 200);
        this.sendWithDelay = debounce(this.sendWithDelay, 200);
    }

    componentDidMount() {
        this.timePlayed = setInterval(() => {
            let { player } = this.props;
            if (!player.embed) return;
            let currentTime = player.embed.getCurrentTime();
            let totalTime = player.embed.getDuration();
            if (currentTime !== this.state.timePlayed) {
                this.setState({ timePlayed: currentTime });
            }
            if (!this.state.totalTime) {
                this.setState({ totalTime });
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timePlayed);
    }

    componentDidUpdate(prevProps) {
        if (!isEmpty(prevProps.player) && isEmpty(this.props.player)) {
            this.setState({ url: "", timePlayed: 0, totalTime: 0, volume: VOLUME_MUTED });
        }
    }

    handleControls = (action) => {
        let { player } = this.props;

        let actionObj = null;
        switch (action) {
            case PLAY:
                actionObj = { isPlaying: true };
                break;
            case PAUSE:
                actionObj = { isPlaying: false };
                break;
            case SEEK_BACK_10:
                actionObj = { seek: Math.max(player.embed.getCurrentTime() - 10, 0) };
                break;
            case SEEK_BACK_30:
                actionObj = { seek: Math.max(player.embed.getCurrentTime() - 30, 0) };
                break;
            case SEEK_FORWARD_10:
                actionObj = { seek: Math.max(player.embed.getCurrentTime() + 10, 0) };
                break;
            case SEEK_FORWARD_30:
                actionObj = { seek: Math.max(player.embed.getCurrentTime() + 30, 0) };
                break;
            default:
                return;
        }
        if (actionObj) this.sendWithDelay(actionObj);
    };

    sendWithDelay = (action) => {
        let { socket } = this.props;
        this.props.updateVideo(socket, action);
    };

    handleInput = (event) => {
        this.setState({ url: event.target.value });
    };

    loadVideo = () => {
        let url = this.state.url;
        if (!url) return;
        let idRegEx = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
        let match = url.match(idRegEx);
        if (match && match[2].length === 11) {
            this.props.loadVideo(this.props.socket, "https://www.youtube.com/watch?v=" + match[2]);
            this.setState({ url: "" });
        }
    };

    removeVideo = () => {
        this.setState({ url: "" });
        this.props.removeVideo(this.props.socket);
    };

    handleSeek = (event) => {
        this.updateServer(event.target.value);
    };

    updateServer = (value) => {
        this.setState({ timePlayed: value });
        this.props.updateVideo(this.props.socket, { seek: value });
    };

    getStatus = () => {
        let { room, video } = this.props;

        let checkbox = (
            <IconContext.Provider value={{ size: "20px", color: "green" }}>
                <FaCheckCircle />
            </IconContext.Provider>
        );
        let loading = <Spinner size="20px" />;

        let status = (user) => {
            if (!video.url || !user.isBuffering) return checkbox;
            return loading;
        };

        return (
            <div className="status">
                {room.users.map((user, idx) => (
                    <div className="user" key={idx}>
                        <p>{user.username}</p>
                        {status(user)}
                    </div>
                ))}
            </div>
        );
    };

    handleVolume = (action) => {
        console.log(action);
        let { player } = this.props;
        if (!player.embed) return;

        let volume = player.embed.getVolume();
        let isMuted = player.embed.isMuted();
        console.log(volume, isMuted);

        let newVolume;
        switch (action) {
            case VOLUME_FULL:
                console.log("VOLUME_FULL");
                if (isMuted) player.embed.unMute();
                player.embed.setVolume(100);
                newVolume = VOLUME_FULL;
                break;
            case VOLUME_HALF:
                console.log("VOLUME_HALF");
                if (isMuted) player.embed.unMute();
                player.embed.setVolume(50);
                newVolume = VOLUME_HALF;
                break;
            case VOLUME_MUTED:
                console.log("VOLUME_MUTED");
                if (!isMuted) {
                    player.embed.mute();
                    newVolume = VOLUME_MUTED;
                } else {
                    player.embed.unMute();
                    player.embed.setVolume(100);
                    newVolume = VOLUME_FULL;
                }
                break;
        }
        if (newVolume) this.setState({ volume: newVolume });
    };

    getControls = () => {
        let { timePlayed, totalTime } = this.state;
        let { player, video } = this.props;
        let isDisabled = !player.embed;

        let isPlaying = video.isPlaying;

        timePlayed = Math.floor(timePlayed);
        totalTime = Math.floor(totalTime);

        //console.log(sprintf("%01d:%02d", playedMinutes, playedSeconds));

        let playedHours = Math.floor(timePlayed / 3600);
        let playedMinutes = Math.floor((timePlayed % 3600) / 60);
        let playedSeconds = Math.floor((timePlayed % 3600) % 60);

        let playedTimer;
        if (playedHours > 0) {
            playedTimer = sprintf("%01d:%02d:%02d", playedHours, playedMinutes, playedSeconds);
        } else {
            playedTimer = sprintf("%01d:%02d", playedMinutes, playedSeconds);
        }

        let totalHours = Math.floor(totalTime / 3600);
        let totalMinutes = Math.floor((totalTime % 3600) / 60);
        let totalSeconds = Math.floor((totalTime % 3600) % 60);

        let totalTimer;
        if (totalHours > 0) {
            totalTimer = sprintf("%01d:%02d:%02d", totalHours, totalMinutes, totalSeconds);
        } else {
            totalTimer = sprintf("%01d:%02d", totalMinutes, totalSeconds);
        }

        let { volume } = this.state;
        console.log(volume);

        return (
            <div className="controls-wrapper">
                <div className="volume-bar">
                    <div className="timer">{`${playedTimer} / ${totalTimer}`}</div>
                    <div className="volume-controls" disabled={isDisabled}>
                        <IconContext.Provider
                            value={{
                                size: "20px",
                                className: classNames("volume-icon", {
                                    active: !isDisabled && volume === VOLUME_MUTED,
                                }),
                            }}
                        >
                            <FaVolumeMute onClick={() => this.handleVolume(VOLUME_MUTED)} />
                        </IconContext.Provider>
                        <IconContext.Provider
                            value={{
                                size: "20px",
                                className: classNames("volume-icon", { active: !isDisabled && volume === VOLUME_HALF }),
                            }}
                        >
                            <FaVolumeDown onClick={() => this.handleVolume(VOLUME_HALF)} />
                        </IconContext.Provider>
                        <IconContext.Provider
                            value={{
                                size: "20px",
                                className: classNames("volume-icon", { active: !isDisabled && volume === VOLUME_FULL }),
                            }}
                        >
                            <FaVolumeUp onClick={() => this.handleVolume(VOLUME_FULL)} />
                        </IconContext.Provider>
                    </div>
                </div>
                <div className={"controls" + (isDisabled ? " disabled" : "")}>
                    <div className="inner"></div>
                    <div className="btn" onClick={() => this.handleControls(SEEK_BACK_30)}>
                        <IconContext.Provider value={{ size: "28px" }}>
                            <MdReplay30 />
                        </IconContext.Provider>
                    </div>
                    <div className="btn" onClick={() => this.handleControls(SEEK_BACK_10)}>
                        <IconContext.Provider value={{ size: "35px" }}>
                            <MdReplay10 />
                        </IconContext.Provider>
                    </div>
                    <div className="btn-wrapper">
                        <div
                            className={"btn large" + (isPlaying ? " pause" : " play")}
                            onClick={() => this.handleControls(isPlaying ? PAUSE : PLAY)}
                        >
                            <IconContext.Provider value={{ size: "30px" }}>
                                {isPlaying ? <FaPause /> : <FaPlay />}
                            </IconContext.Provider>
                        </div>
                    </div>
                    <div className="btn" onClick={() => this.handleControls(SEEK_FORWARD_10)}>
                        <IconContext.Provider value={{ size: "35px" }}>
                            <MdForward10 />
                        </IconContext.Provider>
                    </div>
                    <div className="btn" onClick={() => this.handleControls(SEEK_FORWARD_30)}>
                        <IconContext.Provider value={{ size: "28px" }}>
                            <MdForward30 />
                        </IconContext.Provider>
                    </div>
                </div>

                <input
                    className="slider"
                    type="range"
                    value={isDisabled ? 0 : this.state.timePlayed}
                    min={0}
                    max={isDisabled ? 1 : Math.floor(player.embed.getDuration())}
                    onInput={this.handleSeek}
                    step={1}
                    disabled={isDisabled}
                />
            </div>
        );
    };

    render() {
        let { url } = this.state;
        let { socket, room, video } = this.props;
        let loadedVideo = !isEmpty(video);
        let button;
        if (loadedVideo) {
            button = (
                <button className="link-btn" onClick={this.removeVideo}>
                    CLEAR
                </button>
            );
        } else {
            button = (
                <button className="link-btn" onClick={this.loadVideo}>
                    PLAY
                </button>
            );
        }

        let inviteUrl = window.location.href + "invite/" + room.id;

        return (
            <div className="room-info">
                <div className="header">
                    <button onClick={() => this.props.leaveRoom(socket)}>LEAVE</button>
                    <p>{room.name}</p>
                </div>
                <div className="body">
                    <div>
                        <div className="input">
                            <input
                                type={"text"}
                                value={loadedVideo ? video.url : url}
                                placeholder={"Youtube URL"}
                                onChange={this.handleInput}
                                spellCheck={false}
                                autoFocus={false}
                                disabled={loadedVideo}
                            />
                            {button}
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
                                <button className="link-btn invite-btn">COPY INVITE LINK</button>
                            </CopyToClipboard>
                        </div>
                    </div>
                    {this.getStatus()}

                    {this.getControls()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        socket: state.socket,
        video: state.video,
        player: state.player,
        room: state.room,
    };
};

const mapDispatchToProps = (dispatch) => ({
    leaveRoom: (socket) => {
        dispatch(leaveRoom(socket));
    },
    loadVideo: (socket, url) => {
        dispatch(loadVideo(socket, url));
    },
    removeVideo: (socket) => {
        dispatch(removeVideo(socket));
    },
    updateVideo: (socket, state) => {
        dispatch(updateVideo(socket, state));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
