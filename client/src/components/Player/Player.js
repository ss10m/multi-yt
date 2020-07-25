import React from "react";
import YouTube from "react-youtube";

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
        console.log("PLAYER READY");
        //event.target.pauseVideo();
        console.log(player);
        player.seekTo(50);
        this.setState({ player });
    };

    _onStateChange = (event) => {
        console.log(`STATE CHANGE: ${event.target.getPlayerState()}`);
    };

    _onToggle = () => {
        let { player } = this.state;
        console.log(player.getPlayerState());

        switch (player.getPlayerState()) {
            case 1:
                console.log("PLAYING");
                player.pauseVideo();
                break;
            case 2:
                console.log("STOPPED");
                player.playVideo();
                break;
            default:
                console.log("NEITHER");
        }

        //player.pauseVideo();
    };

    render() {
        console.log(this.state.player);
        return (
            <div>
                {this.getPlayer()}
                {/*<button onClick={this._onToggle}>TOGGLE</button>*/}
            </div>
        );
    }
}

export default Player;
