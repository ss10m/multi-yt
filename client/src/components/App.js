import React from "react";
import socketIO from "socket.io-client";
import Player from "./Player/Player";
import _ from "lodash";

import "./App.scss";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = { width: window.innerWidth, height: window.innerHeight, loaded: false, socket: null };
        this.updateDimensions = _.debounce(this.updateDimensions, 1000);
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        this.connectSocket();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions = () => {
        console.log("updateDimensions");
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    connectSocket = () => {
        let socket = socketIO.connect();
        //socket.on("update", this.handleUpdate);
        //socket.on("notification", this.handleNotification);
        this.setState({ socket, loaded: true });
    };
    render() {
        let { loaded, width, height } = this.state;
        console.log(loaded);
        if (!loaded) return <p>Loading</p>;
        //return <Player />;
        return (
            <div className="main">
                <div className="player">
                    <div>
                        <Player width={width} height={height} />
                    </div>
                </div>
                <div className="chat">chat</div>
                <div className="options">options</div>
            </div>
        );
    }
}

export default App;
