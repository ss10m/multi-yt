// Libraries & utils
import React from "react";

// Redux
import { connect } from "react-redux";
import { setPlayer, updatePlayerState, updateVideo } from "store/actions";

// Components
import Player from "./Player";

// Constants
import { PLAYER_STATE } from "helpers";

// Helpers
import { isEmpty } from "helpers";

class PlayerContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBuffering: false,
            isVisible: false,
        };
    }

    componentDidMount = () => {
        if (this.props.video.url) {
            this.setState({ isVisible: true });
        }
    };

    componentDidUpdate(prevProps) {
        if (!isEmpty(prevProps.player) && isEmpty(this.props.player)) {
            this.setState({ isBuffering: false });
        }

        let video = this.props.video;
        if (prevProps.video.url !== video.url) {
            this.setState({ isVisible: video.url ? true : false });
        }
    }

    onPlayerStateChange = (state) => {
        let playerState = state.data;
        let isBuffering = this.state.isBuffering;

        if (isBuffering && playerState !== PLAYER_STATE.BUFFERING) {
            this.setState({ isBuffering: false });
            this.props.player.embed.pauseVideo();
            this.props.updatePlayerState({ isBuffering: false });
            return;
        }

        switch (playerState) {
            case PLAYER_STATE.ENDED:
                this.props.updateVideo({ ended: true });
                break;
            case PLAYER_STATE.BUFFERING:
                this.setState({ isBuffering: true });
                this.props.updatePlayerState({ isBuffering: true });
                break;
            default:
                break;
        }
    };

    onPlayerReady = (event) => {
        const videoData = event.target.getVideoData();
        const current = this.props.video.url;
        current["title"] = videoData.title;
        current["duration"] = event.target.getDuration();
        current["thumbnail"] = `http://img.youtube.com/vi/${current.id}/0.jpg`;

        this.props.setPlayer(event.target);
        event.target.mute();
        event.target.playVideo();
    };

    render() {
        let { isVisible } = this.state;
        let { width, video } = this.props;
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
                isVisible={isVisible}
                playerWidth={playerWidth}
                playerHeight={playerHeight}
                url={video.url}
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
