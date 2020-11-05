// Libraries & utils
import React from "react";

// Icons
import { IconContext } from "react-icons";
import { FaYoutube } from "react-icons/fa";

// SCSS
import "./Player.scss";

const Player = (props) => {
    if (props.isIframeReady && props.isVisible) {
        return (
            <YTPlayer
                playerWidth={props.playerWidth}
                playerHeight={props.playerHeight}
                url={props.url}
                onPlayerReady={props.onPlayerReady}
                onPlayerStateChange={props.onPlayerStateChange}
            />
        );
    } else {
        return <Preview playerWidth={props.playerWidth} playerHeight={props.playerHeight} />;
    }
};

class YTPlayer extends React.Component {
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

const Preview = ({ playerWidth, playerHeight }) => {
    return (
        <div className="player" style={{ width: playerWidth, height: playerHeight }}>
            <IconContext.Provider value={{ className: "icon" }}>
                <FaYoutube />
            </IconContext.Provider>
        </div>
    );
};

export default Player;
