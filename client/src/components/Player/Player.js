import React from "react";

import ReactPlayer from "react-player/youtube";
import { connect } from "react-redux";

import { setPlayer, setPlayerReady, updateVideo, updatePlayerState, setVideoState } from "store/actions";
import { IconContext } from "react-icons";
import { FaYoutube } from "react-icons/fa";

import { isEmpty } from "helpers";

import "./Player.scss";

class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isBuffering: true,
            initalLoading: true,
        };
    }

    componentDidMount() {
        setInterval(() => this.checkPlayerState(), 500);
    }

    checkPlayerState = () => {
        console.log("checkPlayerState");
        let { video } = this.props;
        if (isEmpty(video) || !video.isPlayerReady) return;

        let playerState = video.player.getInternalPlayer().getPlayerState();

        if (video.isPlaying && !video.isBuffering && playerState !== 1) {
            this.props.setVideoState({ isPlaying: false });
            this.props.setVideoState({ isPlaying: true });
            return;
        }

        if (this.state.isBuffering && playerState !== 3) {
            this._onBufferEnd();
        }
    };

    ref = (player) => {
        let { video } = this.props;
        if (isEmpty(video)) return;
        this.props.setPlayer(player);
    };

    getPlayer = (playerWidth, playerHeight) => {
        let { initalLoading, isBuffering } = this.state;
        let { video } = this.props;
        return (
            <>
                <div style={{ width: playerWidth, height: playerHeight }} className="player-wrapper">
                    <ReactPlayer
                        ref={this.ref}
                        config={{
                            playerVars: {
                                disablekb: 1,
                                iv_load_policy: 3,
                            },
                        }}
                        url={video.url}
                        width="100%"
                        height="100%"
                        playing={(video.isPlaying && !video.isBuffering) || initalLoading || isBuffering}
                        playbackRate={1}
                        controls={true}
                        muted={true}
                        onReady={this._onPlayerReady}
                        onBuffer={this._onBuffer}
                        onBufferEnd={this._onBufferEnd}
                        onStart={this._onStart}
                        onEnded={this._onEnd}
                        onPause={this._onPause}
                        onProgress={this.handleProgress}
                        style={{ position: "absolute" }}
                    />
                </div>
            </>
        );
    };

    //<div className="overlay"></div>

    handleProgress = (state) => {
        // custom slider
    };
    _onStart = () => {
        console.log("ON START");
        this.props.setPlayerReady();
        this.setState({ initalLoading: false });

        // set inital time
        // enable controls
    };

    _onEnd = () => {
        console.log("ON END");
        this.props.updateVideo(this.props.socket, { isPlaying: false });
    };

    _onPlayerReady = () => {
        console.log("PLAYER READY");
    };

    _onBuffer = () => {
        console.log("BUFFERING");

        let { socket } = this.props;
        if (!this.state.isBuffering) {
            this.setState({ isBuffering: true });
            this.props.updatePlayerState(socket, { isBuffering: true });
        }
    };

    _onBufferEnd = () => {
        console.log("BUFFERING ENDED");

        let { socket } = this.props;
        if (this.state.isBuffering) {
            this.setState({ isBuffering: false });
            this.props.updatePlayerState(socket, { isBuffering: false });
        }
    };

    _onPause = () => {
        console.log("PAUSED");
    };

    render() {
        let { width, height, video } = this.props;
        console.log("client isBuffering: " + this.state.isBuffering);

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

        if (!isEmpty(video)) return this.getPlayer(playerWidth, playerHeight - 10);

        return (
            <div>
                <div className="empty-player" style={{ width: playerWidth, height: playerHeight - 10 }}>
                    <IconContext.Provider value={{ color: "#0e0e10", size: playerWidth / 3 }}>
                        <div>
                            <FaYoutube />
                        </div>
                    </IconContext.Provider>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.username,
        socket: state.socket,
        video: state.video,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setPlayer: (player) => {
        dispatch(setPlayer(player));
    },
    setPlayerReady: () => {
        dispatch(setPlayerReady());
    },
    updateVideo: (socket, state) => {
        dispatch(updateVideo(socket, state));
    },
    setVideoState: (state) => {
        dispatch(setVideoState(state));
    },
    updatePlayerState: (socket, state) => {
        dispatch(updatePlayerState(socket, state));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
