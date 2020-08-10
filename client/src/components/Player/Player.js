import React from "react";

import ReactPlayer from "react-player/youtube";
import { connect } from "react-redux";

import { setPlayer, updatePlayerState, setPlayerState, setVideoState } from "store/actions";

import "./Player.scss";
const ENDED = 0;
const PLAYING = 1;
const PAUSED = 2;
const BUFFERING = 3;

class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            initalLoading: true,
            isBuffering: false,
        };
    }

    componentDidMount() {
        this.timePlayed = setInterval(() => {
            let { player, socket } = this.props;
            let { isBuffering } = this.state;
            if (!player.embed) return;

            let loadedBytes = player.embed.getVideoBytesLoaded();
            let totalBytes = player.embed.getVideoBytesTotal();

            if (loadedBytes === totalBytes && loadedBytes === 1 && isBuffering) {
                this.setState({ isBuffering: false });
                this.props.updatePlayerState(socket, { isBuffering: false });
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timePlayed);
    }

    getPlayer = (playerWidth, playerHeight) => {
        let { video } = this.props;
        return (
            <>
                <div style={{ width: playerWidth, height: playerHeight }} className="player-wrapper">
                    <ReactPlayer
                        config={{
                            playerVars: {
                                disablekb: 1,
                                iv_load_policy: 3,
                            },
                            embedOptions: {
                                events: {
                                    onReady: this.onPlayerReady,
                                    onStateChange: this.onPlayerStateChange,
                                },
                            },
                        }}
                        url={video.url || ""}
                        width="100%"
                        height="100%"
                        playbackRate={1}
                        controls={false}
                        muted={true}
                        style={{ position: "absolute" }}
                    />
                    <div className="overlay"></div>
                </div>
            </>
        );
    };

    onPlayerReady = (state) => {
        this.props.setPlayer(state.target);
        this.setState({ initalLoading: true });
        state.target.playVideo();
    };

    onPlayerStateChange = (state) => {
        let { socket } = this.props;
        let playerState = state.data;
        if (this.state.initalLoading && playerState === PLAYING) {
            this.setState({ initalLoading: false });
            return state.target.pauseVideo();
            //notify server that inital loading is done
        }

        if (this.state.isBuffering && playerState !== BUFFERING) {
            console.log("BUFFERING ENDED");
            this.setState({ isBuffering: false });
            this.props.updatePlayerState(socket, { isBuffering: false });
        }

        switch (playerState) {
            case ENDED:
                console.log("ENDED");
                this.props.setVideoState({ isPlaying: false });
                break;
            case PLAYING:
                console.log("PLAYING");
                break;
            case PAUSED:
                console.log("PAUSED");
                break;
            case BUFFERING:
                console.log("BUFFERING");
                //notify server
                if (!this.state.isBuffering) {
                    this.setState({ isBuffering: true });
                    this.props.updatePlayerState(socket, { isBuffering: true });
                }
                break;
            default:
                console.log("OTHER STATE: " + state.data);
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

        return this.getPlayer(playerWidth, playerHeight - 10);
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.username,
        socket: state.socket,
        video: state.video,
        player: state.player,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setPlayer: (player) => {
        dispatch(setPlayer(player));
    },
    updatePlayerState: (socket, state) => {
        dispatch(updatePlayerState(socket, state));
    },
    setPlayerState: (state) => {
        dispatch(setPlayerState(state));
    },
    setVideoState: (state) => {
        dispatch(setVideoState(state));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
