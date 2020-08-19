// Libraries & utils
import React from "react";
import ReactPlayer from "react-player/youtube";

// SCSS
import "./Player.scss";

export default (props) => {
    let { playerWidth, playerHeight, video, onPlayerReady, onBuffer, onBufferEnd, onEnded } = props;
    return (
        <div className="player" style={{ width: playerWidth, height: playerHeight }}>
            <iframe
                style={{
                    width: "100%",
                    height: "100%",
                }}
                src={"https://www.youtube.com/embed/_g8LPvTtO58"}
                frameBorder="0"
                onLoad={onPlayerReady}
            />
        </div>
    );
};

/*
            <ReactPlayer
                config={{
                    playerVars: {
                        disablekb: 1,
                        iv_load_policy: 3,
                    },
                }}
                url={video.url || ""}
                width={playerWidth}
                height={playerHeight}
                onReady={onPlayerReady}
                onBuffer={onBuffer}
                onBufferEnd={onBufferEnd}
                onEnded={onEnded}
                playbackRate={1}
                controls={true}
                muted={true}
                style={{ position: "absolute" }}
            />
*/
