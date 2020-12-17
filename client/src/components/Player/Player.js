// Libraries & utils
import React from "react";

// Icons
import { IconContext } from "react-icons";
import { FaYoutube } from "react-icons/fa";

import Notifications from "components/Notifications/NotificationsContainer";

// SCSS
import "./Player.scss";

const Player = (props) => {
    return (
        <div
            className="player"
            style={{ width: props.playerWidth, height: props.playerHeight }}
        >
            {props.isVisible ? (
                <YTPlayer
                    url={props.url}
                    onPlayerReady={props.onPlayerReady}
                    onPlayerStateChange={props.onPlayerStateChange}
                />
            ) : (
                <Preview />
            )}
            <Notifications />
        </div>
    );
};

class YTPlayer extends React.Component {
    componentDidMount() {
        let { url, onPlayerReady, onPlayerStateChange } = this.props;

        new window.YT.Player(this.player, {
            height: "100%",
            width: "100%",
            videoId: url.id,
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
        return (
            <div>
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

const Preview = () => {
    return (
        <IconContext.Provider value={{ className: "icon" }}>
            <FaYoutube />
        </IconContext.Provider>
    );
};

export default Player;
