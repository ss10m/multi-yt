import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { debounce } from "lodash";
import { connect } from "react-redux";

import Spinner from "../Spinner/Spinner";

import { IconContext } from "react-icons";
import { FaPlay, FaPause, FaCheckCircle } from "react-icons/fa";
import { MdReplay10, MdReplay30, MdForward10, MdForward30 } from "react-icons/md";
import { leaveRoom, loadVideo, removeVideo, updateVideo } from "store/actions";

import { isEmpty } from "helpers";

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
        this.state = { url: "", timePlayed: 0 };

        this.updateServer = debounce(this.updateServer, 200);
        this.sendWithDelay = debounce(this.sendWithDelay, 200);
    }

    componentDidMount() {
        this.timePlayed = setInterval(() => {
            let { player } = this.props;
            if (!player.embed) return;
            let currentTime = player.embed.getCurrentTime();
            if (currentTime !== this.state.timePlayed) {
                this.setState({ timePlayed: currentTime });
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timePlayed);
    }

    componentDidUpdate(prevProps) {
        if (!isEmpty(prevProps.player) && isEmpty(this.props.player)) {
            this.setState({ url: "", timePlayed: 0 });
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

    getControls = () => {
        let { player, video } = this.props;
        let isDisabled = !player.embed;

        let isPlaying = video.isPlaying;

        return (
            <div className="controls-wrapper">
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
