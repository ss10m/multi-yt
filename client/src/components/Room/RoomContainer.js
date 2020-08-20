// Libraries & utils
import React from "react";
import { debounce } from "lodash";
import { sprintf } from "sprintf-js";

// Redux
import { connect } from "react-redux";
import { leaveRoom, loadVideo, removeVideo, updateVideo } from "store/actions";

// Components
import Room from "./Room";

// Constants
import {
    isEmpty,
    VOLUME_MUTED,
    VOLUME_HALF,
    VOLUME_FULL,
    PLAY,
    PAUSE,
    SEEK_BACK_10,
    SEEK_BACK_30,
    SEEK_FORWARD_10,
    SEEK_FORWARD_30,
} from "helpers";

class RoomContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { url: "", timePlayed: 0, totalTime: 0, volume: VOLUME_MUTED };
        this.updateServer = debounce(this.updateServer, 200);
        this.sendWithDelay = debounce(this.sendWithDelay, 200);
    }

    componentDidMount() {
        this.timePlayed = setInterval(() => {
            let { player } = this.props;
            if (!player.embed) return;
            let currentTime = player.embed.getCurrentTime();
            let totalTime = player.embed.getDuration();
            if (currentTime !== this.state.timePlayed) {
                this.setState({ timePlayed: currentTime });
            }
            if (!this.state.totalTime) {
                this.setState({ totalTime });
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timePlayed);
    }

    componentDidUpdate(prevProps) {
        if (!isEmpty(prevProps.player) && isEmpty(this.props.player)) {
            this.setState({ url: "", timePlayed: 0, totalTime: 0, volume: VOLUME_MUTED });
        }
    }

    handleControls = (action) => {
        let { player } = this.props;

        let actionObj = null;
        switch (action) {
            case PLAY:
                actionObj = { isPlaying: true };
                break;
            case PAUSE:
                actionObj = { isPlaying: false };
                break;
            case SEEK_BACK_10:
                actionObj = { seek: Math.max(player.embed.getCurrentTime() - 10, 0) };
                break;
            case SEEK_BACK_30:
                actionObj = { seek: Math.max(player.embed.getCurrentTime() - 30, 0) };
                break;
            case SEEK_FORWARD_10:
                actionObj = { seek: Math.max(player.embed.getCurrentTime() + 10, 0) };
                break;
            case SEEK_FORWARD_30:
                actionObj = { seek: Math.max(player.embed.getCurrentTime() + 30, 0) };
                break;
            default:
                return;
        }
        if (actionObj) this.sendWithDelay(actionObj);
    };

    sendWithDelay = (action) => {
        this.props.updateVideo(action);
    };

    handleInput = (event) => {
        this.setState({ url: event.target.value });
    };

    loadVideo = () => {
        let url = this.state.url;
        if (!url) return;
        let idRegEx = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
        let match = url.match(idRegEx);
        if (match && match[2]) {
            this.props.loadVideo(match[2]);
            this.setState({ url: "" });
        }
    };

    removeVideo = () => {
        this.setState({ url: "" });
        this.props.removeVideo();
    };

    handleSeek = (event) => {
        this.updateServer(event.target.value);
    };

    updateServer = (value) => {
        this.setState({ timePlayed: value });
        this.props.updateVideo({ seek: value });
    };

    handleVolume = (action) => {
        let { player } = this.props;
        if (!player.embed) return;

        let isMuted = player.embed.isMuted();

        let newVolume;
        switch (action) {
            case VOLUME_FULL:
                if (isMuted) player.embed.unMute();
                player.embed.setVolume(100);
                newVolume = VOLUME_FULL;
                break;
            case VOLUME_HALF:
                if (isMuted) player.embed.unMute();
                player.embed.setVolume(50);
                newVolume = VOLUME_HALF;
                break;
            case VOLUME_MUTED:
                if (!isMuted) {
                    player.embed.mute();
                    newVolume = VOLUME_MUTED;
                } else {
                    player.embed.unMute();
                    player.embed.setVolume(100);
                    newVolume = VOLUME_FULL;
                }
                break;
            default:
                break;
        }
        if (newVolume) this.setState({ volume: newVolume });
    };

    parseTimer = (time) => {
        let hours = Math.floor(time / 3600);
        let minutes = Math.floor((time % 3600) / 60);
        let seconds = Math.floor((time % 3600) % 60);

        if (hours > 0) {
            return sprintf("%01d:%02d:%02d", hours, minutes, seconds);
        } else {
            return sprintf("%01d:%02d", minutes, seconds);
        }
    };

    render() {
        let { room, video, player, leaveRoom } = this.props;
        let { url, volume, timePlayed, totalTime } = this.state;

        let inviteUrl = window.location.href + "invite/" + room.id;
        let playedTimer = this.parseTimer(Math.floor(timePlayed));
        let totalTimer = this.parseTimer(Math.floor(totalTime));

        let isDisabled = !player.embed;

        return (
            <Room
                room={room}
                video={video}
                volume={volume}
                url={url}
                inviteUrl={inviteUrl}
                playedTimer={playedTimer}
                totalTimer={totalTimer}
                playedtime={isDisabled ? 0 : timePlayed}
                totalTime={isDisabled ? 1 : Math.floor(player.embed.getDuration())}
                leaveRoom={leaveRoom}
                isPlaying={video.isPlaying}
                controlsDisabled={!player.embed}
                loadVideo={this.loadVideo}
                removeVideo={this.removeVideo}
                handleInput={this.handleInput}
                handleVolume={this.handleVolume}
                handleControls={this.handleControls}
                handleSeek={this.handleSeek}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        video: state.video,
        player: state.player,
        room: state.room,
    };
};

const mapDispatchToProps = (dispatch) => ({
    leaveRoom: () => {
        dispatch(leaveRoom());
    },
    loadVideo: (url) => {
        dispatch(loadVideo(url));
    },
    removeVideo: () => {
        dispatch(removeVideo());
    },
    updateVideo: (state) => {
        dispatch(updateVideo(state));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomContainer);
