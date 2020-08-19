// Libraries & utils
import React, { useState, useEffect } from "react";

// Redux
import { connect } from "react-redux";
import { setPlayer, updatePlayerState, updateVideo } from "store/actions";

// Components
import Player from "./Player";

// Constants
import { BUFFERING, ENDED } from "helpers";

// Helpers
import { isEmpty } from "helpers";

import PlayerYT from "./PlayerYT";

class PlayerContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBuffering: false,
            isVisible: false,
        };
    }

    componentDidMount = () => {
        // On mount, check to see if the API script is already loaded

        if (!window.YT) {
            console.log(1);
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            //window.onYouTubeIframeAPIReady = this.loadVideo;
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
            // If script is already there, load the video directly
            console.log(2);
            //this.loadVideo();
        }
    };

    componentDidUpdate(prevProps) {
        if (!isEmpty(prevProps.player) && isEmpty(this.props.player)) {
            this.setState({ isBuffering: false });
        }

        let video = this.props.video;
        if (prevProps.video.url !== video.url) {
            console.log("CHANGED URL");
            if (video.url) {
                this.setState({ isVisible: true });
                //this.loadVideo();
            } else {
                //var iframe = document.getElementById("youtube-player");

                //console.log(this.youtubePlayerAnchor);
                //iframe.src = "";
                //iframe.style.display = "none";

                this.setState({ isVisible: false });
                //iframe = null;
            }
        }
    }

    /*
    loadVideo = () => {
        console.log("loadVideo");

        this.player = new window.YT.Player("youtube-player", {
            height: "100%",
            width: "100%",
            videoId: "_nL6tq48au0",
            events: {
                onReady: this.onPlayerReady,
                onStateChange: this.onPlayerStateChange,
            },
        });
    };
     */

    onPlayerStateChange = (state) => {
        console.log("onPlayerStateChange");
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

    onPlayerReady = (event) => {
        console.log("onPlayerReady");
        console.log(event.target);
        this.props.setPlayer(event.target);
        event.target.mute();
        event.target.playVideo();
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

        /*
        return (
            <div
                className="player"
                ref={(r) => {
                    this.youtubePlayerAnchor = r;
                }}
                style={{ width: playerWidth, height: playerHeight }}
            ></div>
        );
        */
        //return <div className="player" id="youtube-player" style={{ width: playerWidth, height: playerHeight }}></div>;

        if (this.state.isVisible) {
            return (
                <Example
                    playerWidth={playerWidth}
                    playerHeight={playerHeight}
                    onPlayerReady={this.onPlayerReady}
                    onPlayerStateChange={this.onPlayerStateChange}
                />
            );
        } else {
            return <div className="player" style={{ width: playerWidth, height: playerHeight }} />;
        }
    }
}
/*
class PlayerYT extends React.Component {
    componentDidMount() {
        this.player = new window.YT.Player("youtube-player", {
            height: "300px",
            width: "500px",
            videoId: "_nL6tq48au0",
            events: {
                onReady: this.onPlayerReady,
                onStateChange: this.onPlayerStateChange,
            },
        });
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
        return <div className="player" id="youtube-player" style={{ width: "100%", height: "100%" }}></div>;
    }
}
*/
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

const Example = (props) => {
    useEffect(() => {
        new window.YT.Player("yt-player", {
            height: "100%",
            width: "100%",
            videoId: "_nL6tq48au0",
            events: {
                onReady: props.onPlayerReady,
                onStateChange: props.onPlayerStateChange,
            },
            playerVars: {
                disablekb: 1,
                iv_load_policy: 3,
                controls: 1,
                enablejsapi: true,
                html5: 1,
            },
        });
    });

    return (
        <div className="player" style={{ width: props.playerWidth, height: props.playerHeight }}>
            <div id="yt-player"></div>
        </div>
    );
};
