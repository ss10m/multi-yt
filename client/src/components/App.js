import React from "react";
import Player from "./Player/Player";

import { connect } from "react-redux";
import { connectSocket, setUsername, joinRoom } from "store/actions";

import "./App.scss";

import { isEmpty } from "helpers";

import Chat from "./Chat/Chat";
import Room from "./Room/Room";
import Rooms from "./Rooms/Rooms";
import UsernamePrompt from "./UsernamePrompt/UsernamePrompt";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showUsernamePrompt: true,
            width: window.innerWidth,
            height: window.innerHeight,
            loaded: false,
            socket: null,
        };
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        this.props.connectSocket();
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
            this.props.joinRoom(this.props.socket, { id: result[1] }, username);
        }
        this.props.history.push("/");
    };

    printState = () => {
        let { room, rooms, video, messages } = this.props;
        console.log("=======================");
        console.log(rooms);
        console.log(room);
        console.log(video);
        console.log(messages);
        console.log("------------------------");
    };

    render() {
        let { width, height, showUsernamePrompt } = this.state;
        let { room } = this.props;
        //this.printState();
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
        rooms: state.rooms,
        video: state.video,
        messages: state.messages,
        socket: state.socket,
    };
};

const mapDispatchToProps = (dispatch) => ({
    connectSocket: () => {
        dispatch(connectSocket());
    },
    setUsername: (username) => {
        dispatch(setUsername(username));
    },
    joinRoom: (socket, room, username) => {
        dispatch(joinRoom(socket, room, username));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
