import React from "react";
import Player from "./Player/Player";
import { debounce } from "lodash";

import { connect } from "react-redux";
import { connectSocket } from "store/actions";

import "./App.scss";

import Chat from "./Chat/Chat";
import Room from "./Room/Room";
import Rooms from "./Rooms/Rooms";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = { width: window.innerWidth, height: window.innerHeight, loaded: false, socket: null };
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

    render() {
        let { width, height } = this.state;
        let { room } = this.props;
        return (
            <div className="main">
                <div className="player">
                    <div>
                        <Player width={width} height={height} />
                    </div>
                </div>
                {room ? <Room /> : <Rooms />}
                <Chat />
            </div>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
