import React from "react";
import Player from "./Player/Player";
import { debounce } from "lodash";

import { connect } from "react-redux";
import { connectSocket, setUsername } from "store/actions";

import "./App.scss";

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
        this.updateDimensions = debounce(this.updateDimensions, 500);
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        this.props.connectSocket();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions = () => {
        console.log("updateDimensions");
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    confirmUsername = (username) => {
        this.setState({ showUsernamePrompt: false });
        this.props.setUsername(username);
    };

    render() {
        let { width, height, showUsernamePrompt } = this.state;
        let { room } = this.props;
        return (
            <>
                {showUsernamePrompt && <UsernamePrompt confirmUsername={this.confirmUsername} />}
                <div className="main">
                    <div className="player">
                        <div>
                            <Player width={width} height={height} />
                        </div>
                    </div>
                    {room ? <Room /> : <Rooms />}
                    <Chat />
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        room: state.room,
    };
};

const mapDispatchToProps = (dispatch) => ({
    connectSocket: () => {
        dispatch(connectSocket());
    },
    setUsername: (username) => {
        dispatch(setUsername(username));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
