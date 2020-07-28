import React from "react";
import { connect } from "react-redux";

import { IconContext } from "react-icons";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdReplay10, MdReplay30, MdForward10, MdForward30 } from "react-icons/md";
import { leaveRoom, loadVideo, removeVideo } from "store/actions";

import "./Room.scss";

class Room extends React.Component {
    constructor(props) {
        super(props);
        this.state = { url: "https://www.youtube.com/watch?v=H8GptHQ0W2U", controls: true };
    }

    handleControls = (value) => {
        console.log("CLICK");
        let video = this.props.video;
        if (!video) return;

        this.setState({ controls: false });
        setTimeout(() => {
            this.setState({ controls: true });
        }, 1000);

        video.player.seekTo(50);
    };

    handleInput = (event) => {
        console.log(event.target.value);
        this.setState({ url: event.target.value });
    };

    loadVideo = () => {
        this.props.loadVideo(this.props.socket, this.state.url);
    };

    removeVideo = () => {
        console.log("REMOVE");
        this.setState({ url: "https://www.youtube.com/watch?v=H8GptHQ0W2U" });
        this.props.removeVideo(this.props.socket);
    };

    getControls = () => {
        let { controls } = this.state;
        console.log(controls);
        return (
            <div className={"controls" + (controls ? "" : " disabled")}>
                <div onClick={this.handleControls}>
                    <IconContext.Provider value={{ color: "whitesmoke", size: "30px" }}>
                        <MdReplay30 />
                    </IconContext.Provider>
                </div>
                <div onClick={this.handleControls}>
                    <IconContext.Provider value={{ color: "whitesmoke", size: "40px" }}>
                        <MdReplay10 />
                    </IconContext.Provider>
                </div>
                <div onClick={this.handleControls}>
                    <IconContext.Provider value={{ color: "whitesmoke", size: "40px" }}>
                        <div className="play">
                            <FaPlay />
                        </div>
                    </IconContext.Provider>
                </div>
                <div onClick={this.handleControls}>
                    <IconContext.Provider value={{ color: "whitesmoke", size: "40px" }}>
                        <MdForward10 />
                    </IconContext.Provider>
                </div>
                <div onClick={this.handleControls}>
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

        console.log(video);

        let button;
        if (video) {
            button = <button onClick={this.removeVideo}>CLEAR</button>;
        } else {
            button = <button onClick={this.loadVideo}>LOAD</button>;
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
