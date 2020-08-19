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

class PlayerContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBuffering: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (!isEmpty(prevProps.player) && isEmpty(this.props.player)) {
            this.setState({ isBuffering: false });
        }
    }

    onPlayerReady = (state) => {
        this.props.setPlayer(state.target);
        state.target.playVideo();
    };

    onPlayerStateChange = (state) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(PlayerContainer);
