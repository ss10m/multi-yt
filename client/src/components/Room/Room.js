import React from "react";
import { connect } from "react-redux";

import { leaveRoom, loadVideo, removeVideo } from "store/actions";

import "./Room.scss";

class Room extends React.Component {
    constructor(props) {
        super(props);
        this.state = { url: "https://www.youtube.com/watch?v=H8GptHQ0W2U" };
    }

    handleClick = () => {
        console.log("CLICK");
        let video = this.props.video;
        if (!video) return;
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
                    <button onClick={this.handleClick}>SKIP</button>
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
