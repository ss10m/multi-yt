// Libraries & utils
import React from "react";

// Redux
import { connect } from "react-redux";
import { setPlayer, updatePlayerState, setPlayerState, setVideoState, updateVideo } from "store/actions";

// Components
import Player from "./Player";

// Constants
import { BUFFERING, ENDED } from "helpers";

// Helpers
import { isEmpty } from "helpers";

class PlayerContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isBuffering: false,
        };
    }

    componentDidMount() {
        this.timePlayed = setInterval(() => {
            let { player } = this.props;
            if (!player.embed) return;

            let loadedBytes = player.embed.getVideoBytesLoaded();
            let totalBytes = player.embed.getVideoBytesTotal();

            let isVideoBuffered = loadedBytes === totalBytes && this.state.isBuffering;
            let isStuckBuffering = player.state !== BUFFERING && this.state.isBuffering;

            console.log(loadedBytes, totalBytes);
            console.log(isStuckBuffering, isVideoBuffered);

            if (isVideoBuffered || isStuckBuffering) {
                console.log("STUCK");
                //this.setState({ isBuffering: false });
                //this.props.updatePlayerState({ isBuffering: false });
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timePlayed);
    }

    componentDidUpdate(prevProps) {
        if (!isEmpty(prevProps.player) && isEmpty(this.props.player)) {
            this.setState({ isBuffering: false });
            console.log("CLEARED STATE");
        }
    }

    onPlayerReady = (state) => {
        this.props.setPlayer(state.target);
        state.target.playVideo();
    };

    onPlayerStateChange = (state) => {
        console.log(state);

        let playerState = state.data;
        let isBuffering = this.state.isBuffering;

        if (isBuffering && playerState !== BUFFERING) {
            console.log("NOT BUFFERING");
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
                console.log("BUFFERING");
                this.setState({ isBuffering: true });
                this.props.updatePlayerState({ isBuffering: true });
                break;
            default:
                break;
        }
    };

    render() {
        let { width } = this.props;
        let playerWidth = 0;
        let playerHeight = 0;

        if (width <= 600) {
            playerWidth = Math.max(width, 320);
            playerHeight = (playerWidth * 9) / 16;
        }

        if (!playerWidth) {
            playerWidth = "100%";
            playerHeight = "100%";
        }

        return (
            <Player
                playerWidth={playerWidth}
                playerHeight={playerHeight}
                video={this.props.video}
                onPlayerReady={this.onPlayerReady}
                onPlayerStateChange={this.onPlayerStateChange}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        video: state.video,
        player: state.player,
        socket: state.socket,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setPlayer: (player) => {
        dispatch(setPlayer(player));
    },
    updatePlayerState: (state) => {
        dispatch(updatePlayerState(state));
    },
    setPlayerState: (state) => {
        dispatch(setPlayerState(state));
    },
    setVideoState: (state) => {
        dispatch(setVideoState(state));
    },
    updateVideo: (state) => {
        dispatch(updateVideo(state));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerContainer);
