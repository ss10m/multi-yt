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

    getPlayer = () => {
        let { width, height } = this.props;
        //let width = window.innerWidth;
        //let height = window.innerHeight;
        let playerWidth = 0;
        let playerHeight = 0;

        console.log(width, height);

        if (width > 1100) {
            playerWidth = width - 400;
            playerHeight = Math.max(height, 600);
        } else {
            playerWidth = width;
            playerHeight = (playerWidth * 9) / 16;
        }

        console.log(width, playerHeight);

        const opts = {
            height: playerHeight - 10,
            width: playerWidth,
            playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 1,
            },
        };

        return (
            <YouTube
                //videoId="QJD8mpcGykE"
                videoId="H8GptHQ0W2U"
                opts={opts}
                onReady={this._onPlayerReady}
                onStateChange={this._onStateChange}
            />
        );
    };

    _onPlayerReady = (event) => {
        let player = event.target;
        player.seekTo(50);
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
        }

        //return this.getPlayer();

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
