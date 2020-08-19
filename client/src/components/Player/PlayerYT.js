// Libraries & utils
import React from "react";

// Redux
import { connect } from "react-redux";
import { setPlayer, updatePlayerState, updateVideo } from "store/actions";

// Components
import Player from "./Player";

// Constants
import { BUFFERING, ENDED } from "helpers";

// Helpers
import { isEmpty } from "helpers";

class PlayerYT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBuffering: false,
            isVisible: false,
        };

        this.playerRef = React.createRef();
    }
    componentDidMount() {
        this.player = new window.YT.Player(this.youtubePlayerAnchor, {
            height: "300px",
            width: "500px",
            videoId: "_nL6tq48au0",
            events: {
                onReady: this.onPlayerReady,
                onStateChange: this.onPlayerStateChange,
            },
        });
    }

    componentWillUnmount() {
        console.log("componentWillUnmount");
    }

    onPlayerStateChange = (state) => {
        console.log(state);
        let playerState = state.data;
        let isBuffering = this.state.isBuffering;

        if (isBuffering && playerState !== BUFFERING) {
            this.setState({ isBuffering: false });
            this.props.player.embed.pauseVideo();
            this.props.updatePlayerState({ isBuffering: false });
            return;
        }

        switch (playerState) {
            case ENDED:
                this.props.updateVideo({ ended: true });
                break;
            case BUFFERING:
                this.setState({ isBuffering: true });
                this.props.updatePlayerState({ isBuffering: true });
                break;
            default:
                break;
        }
    };

    onPlayerReady = () => {
        console.log("onPlayerReady");
        this.props.setPlayer(this.player);
        this.player.playVideo();
    };
    render() {
        return (
            <div
                className="player"
                ref={(r) => {
                    this.youtubePlayerAnchor = r;
                }}
                style={{ width: "100%", height: "100%" }}
            ></div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        video: state.video,
        player: state.player,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setPlayer: (player) => {
        dispatch(setPlayer(player));
    },
    updatePlayerState: (state) => {
        dispatch(updatePlayerState(state));
    },
    updateVideo: (state) => {
        dispatch(updateVideo(state));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerYT);
