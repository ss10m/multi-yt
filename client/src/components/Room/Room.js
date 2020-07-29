import React from "react";
import { connect } from "react-redux";

import { IconContext } from "react-icons";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdReplay10, MdReplay30, MdForward10, MdForward30 } from "react-icons/md";
import { leaveRoom, loadVideo, removeVideo, stateUpdate } from "store/actions";

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
        this.state = { url: "https://www.youtube.com/watch?v=H8GptHQ0W2U", controls: true };
    }

    handleControls = (action) => {
        let { video, socket } = this.props;

        if (!video) return;

        this.setState({ controls: false });
        setTimeout(() => {
            this.setState({ controls: true });
        }, 1000);

        let actionObj = null;
        switch (action) {
            case PLAY:
                actionObj = { isPlaying: true };
                break;
            case PAUSE:
                actionObj = { isPlaying: false };
                break;
            case SEEK_BACK_10:
                video.player.seekTo(video.player.getCurrentTime() - 10);
                break;
            case SEEK_BACK_30:
                video.player.seekTo(video.player.getCurrentTime() - 30);
                break;
            case SEEK_FORWARD_10:
                video.player.seekTo(video.player.getCurrentTime() + 10);
                break;
            case SEEK_FORWARD_30:
                video.player.seekTo(video.player.getCurrentTime() + 30);
                break;
            default:
                return;
        }
        if (actionObj) this.props.stateUpdate(socket, actionObj);
        //video.player.seekTo(50);
    };

    handleInput = (event) => {
        this.setState({ url: event.target.value });
    };

    loadVideo = () => {
        this.props.loadVideo(this.props.socket, this.state.url);
    };

    removeVideo = () => {
        this.setState({ url: "https://www.youtube.com/watch?v=H8GptHQ0W2U" });
        this.props.removeVideo(this.props.socket);
    };

    getControls = () => {
        let { controls } = this.state;
        let { video } = this.props;
        if (!video) return;
        return (
            <div className={"controls" + (controls ? "" : " disabled")}>
                <div onClick={() => this.handleControls(SEEK_BACK_30)}>
                    <IconContext.Provider value={{ color: "whitesmoke", size: "30px" }}>
                        <MdReplay30 />
                    </IconContext.Provider>
                </div>
                <div onClick={() => this.handleControls(SEEK_BACK_10)}>
                    <IconContext.Provider value={{ color: "whitesmoke", size: "40px" }}>
                        <MdReplay10 />
                    </IconContext.Provider>
                </div>
                <div onClick={() => this.handleControls(video.isPlaying ? PAUSE : PLAY)} style={{ width: "50px" }}>
                    <IconContext.Provider value={{ color: "whitesmoke", size: "40px" }}>
                        <div className={!video.isPlaying ? "play" : ""}>
                            {video.isPlaying ? <FaPause /> : <FaPlay />}
                        </div>
                    </IconContext.Provider>
                </div>
                <div onClick={() => this.handleControls(SEEK_FORWARD_10)}>
                    <IconContext.Provider value={{ color: "whitesmoke", size: "40px" }}>
                        <MdForward10 />
                    </IconContext.Provider>
                </div>
                <div onClick={() => this.handleControls(SEEK_FORWARD_30)}>
                    <IconContext.Provider value={{ color: "whitesmoke", size: "30px" }}>
                        <MdForward30 />
                    </IconContext.Provider>
                </div>
            </div>
        );
    };

    render() {
        let { url } = this.state;
        let { socket, room, video } = this.props;

        let button;
        if (isEmpty(video)) {
            button = <button onClick={this.loadVideo}>LOAD</button>;
        } else {
            button = <button onClick={this.removeVideo}>CLEAR</button>;
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
                            value={url}
                            placeholder={"Youtube URL"}
                            onChange={this.handleInput}
                            spellCheck={false}
                            autoFocus={false}
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
    stateUpdate: (socket, state) => {
        dispatch(stateUpdate(socket, state));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
