// Libraries & utils
import React from "react";
import ReactPlayer from "react-player/youtube";

// SCSS
import "./Player.scss";

export default (props) => {
    let { playerWidth, playerHeight, video, onPlayerReady, onPlayerStateChange } = props;
    return (
        <div className="player-wrapper" style={{ width: playerWidth, height: playerHeight }}>
            <ReactPlayer
                config={{
                    playerVars: {
                        disablekb: 1,
                        iv_load_policy: 3,
                    },
                    embedOptions: {
                        events: {
                            onReady: onPlayerReady,
                            onStateChange: onPlayerStateChange,
                        },
                    },
                }}
                url={video.url || ""}
                width="100%"
                height="100%"
                playbackRate={1}
                controls={true}
                muted={true}
                style={{ position: "absolute" }}
            />
        </div>
    );
};
// <div className="overlay"></div>
