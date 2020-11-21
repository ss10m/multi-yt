// Libraries & utils
import React from "react";

// Redux
import { connect } from "react-redux";
import { connectSocket, setUsername, joinRoom, setError } from "store/actions";

// Components
import App from "./App";

// Helpers
import { isEmpty } from "helpers";

// SCSS
import "./App.scss";

class AppContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isIframeReady: false,
            showUsernamePrompt: true,
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }

    componentDidMount() {
        if (!window.YT) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            window.onYouTubeIframeAPIReady = this.onIframeReady;
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
            this.onIframeReady();
        }

        try {
            let id = localStorage.getItem("sync-id");
            if (!id) {
                id = Math.random().toString(36).substr(2, 9);
                localStorage.setItem("sync-id", id);
            }

            window.addEventListener("resize", this.updateDimensions);
            this.props.connectSocket(id);
        } catch (e) {
            this.props.setError("Local Storage is not enabled");
            return;
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    onIframeReady = () => {
        this.setState({ isIframeReady: true });
    };

    confirmUsername = (username) => {
        this.setState({ showUsernamePrompt: false });
        this.props.setUsername(username);

        let path = window.location.pathname.split("/");
        let result = path.filter((word) => word);

        if (result.length === 2 && result[0] === "invite" && result[1].length === 7) {
            this.props.joinRoom(result[1]);
        }
        this.props.history.push("/");
    };

    render() {
        let { width, height, isIframeReady, showUsernamePrompt } = this.state;
        let { room, error } = this.props;

        return (
            <App
                width={width}
                height={height}
                isIframeReady={isIframeReady}
                showLobby={isEmpty(room)}
                showUsernamePrompt={showUsernamePrompt}
                confirmUsername={this.confirmUsername}
                error={error}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        room: state.room,
        error: state.error,
    };
};

const mapDispatchToProps = (dispatch) => ({
    connectSocket: (id) => {
        dispatch(connectSocket(id));
    },
    setUsername: (username) => {
        dispatch(setUsername(username));
    },
    joinRoom: (room) => {
        dispatch(joinRoom(room));
    },
    setError: (error) => {
        dispatch(setError(error));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
