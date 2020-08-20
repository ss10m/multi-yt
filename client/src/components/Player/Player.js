// Libraries & utils
import React, { useEffect } from "react";

// SCSS
import "./Player.scss";

const Player = (props) => {
    let player = null;
    useEffect(() => {
        new window.YT.Player(player, {
            height: "100%",
            width: "100%",
            videoId: props.url,
            events: {
                onReady: props.onPlayerReady,
                onStateChange: props.onPlayerStateChange,
            },
            playerVars: {
                disablekb: 1,
                iv_load_policy: 3,
                controls: 0,
                enablejsapi: 1,
            },
        });
    }, []);

    return (
        <div className="player" style={{ width: props.playerWidth, height: props.playerHeight }}>
            <div
                style={{ position: "absolute" }}
                ref={(ref) => {
                    player = ref;
                }}
            ></div>
            <div className="player-overlay"></div>
        </div>
    );
};

export default Player;
