import React from "react";
import { connect } from "react-redux";

import { IconContext } from "react-icons";
import { FaPlay, FaPause } from "react-icons/fa";
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
        this.state = { url: "" };
    }

    handleControls = (action) => {
        let { video, socket } = this.props;

        let actionObj = null;
        switch (action) {
            case PLAY:
                actionObj = { isPlaying: true };
                break;
            case PAUSE:
                actionObj = { isPlaying: false };
                break;
            case SEEK_BACK_10:
                actionObj = { seek: Math.max(video.player.getCurrentTime() - 10, 0) };
                break;
            case SEEK_BACK_30:
                actionObj = { seek: Math.max(video.player.getCurrentTime() - 30, 0) };
                break;
            case SEEK_FORWARD_10:
                actionObj = { seek: Math.max(video.player.getCurrentTime() + 10, 0) };
                break;
            case SEEK_FORWARD_30:
                actionObj = { seek: Math.max(video.player.getCurrentTime() + 30, 0) };
                break;
            default:
                return;
        }
        if (actionObj) this.props.updateVideo(socket, actionObj);
    };

    handleInput = (event) => {
        this.setState({ url: event.target.value });
    };

    loadVideo = () => {
        let url = this.state.url;
        if (!url) return;
        // check if valid link
        this.props.loadVideo(this.props.socket, url);
        this.setState({ url: "" });
    };

    removeVideo = () => {
        this.setState({ url: "" });
        this.props.removeVideo(this.props.socket);
    };

    getControls = () => {
        let { video } = this.props;
        let isDisabled = isEmpty(video);
        let isPlaying = video.isPlaying;

        return (
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
        );
    };

    render() {
        let { url } = this.state;
        let { socket, room, video } = this.props;

        let loadedVideo = !isEmpty(video);
        let button;
        if (loadedVideo) {
            button = <button onClick={this.removeVideo}>CLEAR</button>;
        } else {
            button = <button onClick={this.loadVideo}>PLAY</button>;
        }

        return (
            <div className="room-info">
                <div className="header">
                    <button onClick={() => this.props.leaveRoom(socket)}>LEAVE</button>
                    <p>{room.name}</p>
                </div>
                <div className="body">
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
                    <div>
                        {room.users.map((user) => (
                            <p>{user}</p>
                        ))}
                    </div>
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
