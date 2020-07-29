import React from "react";

import ReactPlayer from "react-player/youtube";
import { connect } from "react-redux";

import { setPlayer } from "store/actions";
import { IconContext } from "react-icons";
import { FaYoutube } from "react-icons/fa";

import { isEmpty } from "helpers";

import "./Player.scss";

class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playedSeconds: 0,
        };
    }

    ref = (player) => {
        let { video } = this.props;
        if (isEmpty(video)) return;
        this.props.setPlayer(player);
    };

    getPlayer = (playerWidth, playerHeight) => {
        let { video } = this.props;

        return (
            <>
                <div style={{ width: playerWidth, height: playerHeight }} className="player-wrapper">
                    <ReactPlayer
                        ref={this.ref}
                        config={{
                            playerVars: { disablekb: 1 },
                        }}
                        url={video.url}
                        width="100%"
                        height="100%"
                        playing={video.isPlaying}
                        playbackRate={1}
                        controls={false}
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
                    <div className="overlay"></div>
                </div>
            </>
        );
    };

    handleProgress = (state) => {
        // custom slider
    };
    _onStart = () => {
        console.log("ON START");
        // set inital time
        // enable controls
    };

    _onEnd = () => {
        console.log("ON END");
    };

    _onPlayerReady = () => {
        console.log("PLAYER READY");
    };

    _onBuffer = () => {
        console.log("BUFFERING");
    };

    _onBufferEnd = () => {
        console.log("BUFFERING ENDED");
    };

    _onPause = () => {
        console.log("PAUSED");
    };

    render() {
        let { width, height, video } = this.props;

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
        video: state.video,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setPlayer: (player) => {
        dispatch(setPlayer(player));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
