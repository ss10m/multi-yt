import React from "react";
import YouTube from "react-youtube";
import { connect } from "react-redux";

import { setPlayer } from "store/actions";
import { IconContext } from "react-icons";
import { FaYoutube } from "react-icons/fa";

import "./Player.scss";

class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            player: null,
        };
    }

    getPlayer = (playerWidth, playerHeight) => {
        const opts = {
            height: playerHeight - 10,
            width: playerWidth,
            playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 1,
                //controls: 0,
                fs: 0,
                iv_load_policy: 3,
                modestbranding: 0,
                allow: "autoplay",
            },
        };

        return (
            <div style={{ width: playerWidth, height: playerHeight }}>
                <YouTube
                    //videoId="QJD8mpcGykE"
                    videoId="H8GptHQ0W2U"
                    opts={opts}
                    onReady={this._onPlayerReady}
                    onStateChange={this._onStateChange}
                    allow="autoplay; encrypted-media"
                />
            </div>
        );
    };

    _onPlayerReady = (event) => {
        let player = event.target;
        //player.seekTo(50);
        player.playVideo();
        this.setState({ player });
        this.props.setPlayer(player);
    };

    _onStateChange = (event) => {
        console.log(`STATE CHANGE: ${event.target.getPlayerState()}`);
    };

    render() {
        let { width, height } = this.props;
        let playerWidth = 0;
        let playerHeight = 0;

        if (width > 1100) {
            playerWidth = width - 400;
            playerHeight = Math.max(height, 600);
        } else {
            playerWidth = width;
            playerHeight = (playerWidth * 9) / 16;

            if (playerHeight > height * 0.6) {
                playerHeight = height * 0.6;
            }
        }

        return this.getPlayer(playerWidth, playerHeight);

        return (
            <div>
                <div className="empty-player" style={{ width: playerWidth, height: playerHeight }}>
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

const mapDispatchToProps = (dispatch) => ({
    setPlayer: (player) => {
        dispatch(setPlayer(player));
    },
});

export default connect(null, mapDispatchToProps)(Player);
