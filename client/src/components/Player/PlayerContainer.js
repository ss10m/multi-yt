// Libraries & utils
import React from "react";

// Redux
import { connect } from "react-redux";
import { setPlayer, updatePlayerState, setPlayerState, setVideoState } from "store/actions";

// Components
import Player from "./Player";

// Constants
import { BUFFERING, ENDED } from "helpers/constants";

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
            if (loadedBytes === totalBytes && loadedBytes === 1 && this.state.isBuffering) {
                this.setState({ isBuffering: false });
                this.props.updatePlayerState({ isBuffering: false });
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timePlayed);
    }

    onPlayerReady = (state) => {
        this.props.setPlayer(state.target);
        state.target.playVideo();
    };

    onPlayerStateChange = (state) => {
        let playerState = state.data;

        if (this.state.isBuffering && playerState !== BUFFERING) {
            this.setState({ isBuffering: false });
            this.props.updatePlayerState({ isBuffering: false });
        }

        switch (playerState) {
            case ENDED:
                this.props.setVideoState({ isPlaying: false });
                break;
            case BUFFERING:
                if (!this.state.isBuffering) {
                    this.setState({ isBuffering: true });
                    this.props.updatePlayerState({ isBuffering: true });
                }
                break;
            default:
                break;
        }

        this.props.setPlayerState(state.data);
    };

    render() {
        let { width, height } = this.props;
        let playerWidth = 0;
        let playerHeight = 0;

        if (width > 1100) {
            playerWidth = width - 400;
            playerHeight = Math.max(height, 600);
        } else {
            playerWidth = Math.max(width, 320);
            playerHeight = (playerWidth * 9) / 16;

            if (playerHeight > height * 0.6) {
                playerHeight = height * 0.6;
            }
        }

        playerHeight = playerHeight - 10;

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
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerContainer);
