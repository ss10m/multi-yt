// Libraries & utils
import React from "react";

// SCSS
import "./Player.scss";

class Player extends React.Component {
    componentDidMount() {
        let { url, onPlayerReady, onPlayerStateChange } = this.props;

        new window.YT.Player(this.player, {
            height: "100%",
            width: "100%",
            videoId: url,
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
            },
            playerVars: {
                disablekb: 1,
                iv_load_policy: 3,
                controls: 0,
                enablejsapi: 1,
            },
        });
    }

    render() {
        let { playerWidth, playerHeight } = this.props;
        return (
            <div className="player" style={{ width: playerWidth, height: playerHeight }}>
                <div
                    style={{ position: "absolute" }}
                    ref={(ref) => {
                        this.player = ref;
                    }}
                ></div>
                <div className="player-overlay"></div>
            </div>
        );
    }
}

export default Player;
