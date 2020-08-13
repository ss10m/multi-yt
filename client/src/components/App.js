import React from "react";

import { connect } from "react-redux";
import { connectSocket, setUsername, joinRoom } from "store/actions";

import "./App.scss";

import { isEmpty } from "helpers";

import Player from "./Player/PlayerContainer";
import Chat from "./Chat/ChatContainer";
import Room from "./Room/Room";
import Rooms from "./Rooms/RoomsContainer";
import UsernamePrompt from "./UsernamePrompt/UsernamePrompt";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showUsernamePrompt: true,
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }

    componentDidMount() {
        let id = localStorage.getItem("sync-id");
        if (!id) {
            id = Math.random().toString(36).substr(2, 9);
            localStorage.setItem("sync-id", id);
        }

        window.addEventListener("resize", this.updateDimensions);
        this.props.connectSocket(id);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    confirmUsername = (username) => {
        this.setState({ showUsernamePrompt: false });
        this.props.setUsername(username);

        let path = window.location.pathname.split("/");
        let result = path.filter((word) => word);

        if (result.length === 2 && result[0] === "invite" && result[1].length === 7) {
            this.props.joinRoom(this.props.socket, result[1], username);
        }
        this.props.history.push("/");
    };

    render() {
        let { width, height, showUsernamePrompt } = this.state;
        let { room, error } = this.props;
        if (error) return <div className="error">{error}</div>;

        return (
            <>
                {showUsernamePrompt && <UsernamePrompt confirmUsername={this.confirmUsername} />}
                <div className="main">
                    <div className="player">
                        <div>
                            <Player width={width} height={height} />
                        </div>
                    </div>
                    <div className="options">{isEmpty(room) ? <Rooms /> : <Room />}</div>
                    <Chat />
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        room: state.room,
        error: state.error,
        rooms: state.rooms,
        video: state.video,
        messages: state.messages,
        socket: state.socket,
        player: state.player,
    };
};

const mapDispatchToProps = (dispatch) => ({
    connectSocket: (id) => {
        dispatch(connectSocket(id));
    },
    setUsername: (username) => {
        dispatch(setUsername(username));
    },
    joinRoom: (socket, room, username) => {
        dispatch(joinRoom(socket, room, username));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
