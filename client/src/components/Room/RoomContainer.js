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
import { PLAYER_ACTION, VOLUME, ROOM_VIEW, isEmpty } from "helpers";

class RoomContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: ROOM_VIEW.MAIN,
            timePlayed: 0,
            totalTime: 0,
            volume: VOLUME.MUTED,
        };
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
            this.setState({ timePlayed: 0, totalTime: 0, volume: VOLUME.MUTED });
        }
    }

    switchView = (view) => {
        if (view) this.setState({ view });
    };

    handleBackPress = () => {
        switch (this.state.view) {
            case ROOM_VIEW.MAIN:
                return this.props.leaveRoom();
            case ROOM_VIEW.SEARCH:
                return this.setState({ view: ROOM_VIEW.MAIN });
            case ROOM_VIEW.URL:
                return this.setState({ view: ROOM_VIEW.SEARCH });
            default:
                break;
        }
    };

    handleControls = (action) => {
        let { player } = this.props;

        let actionObj = null;
        switch (action) {
            case PLAYER_ACTION.PLAY:
                actionObj = { isPlaying: true };
                break;
            case PLAYER_ACTION.PAUSE:
                actionObj = { isPlaying: false };
                break;
            case PLAYER_ACTION.SEEK_BACK_10:
                actionObj = { seek: Math.max(player.embed.getCurrentTime() - 10, 0) };
                break;
            case PLAYER_ACTION.SEEK_BACK_30:
                actionObj = { seek: Math.max(player.embed.getCurrentTime() - 30, 0) };
                break;
            case PLAYER_ACTION.SEEK_FORWARD_10:
                actionObj = { seek: Math.max(player.embed.getCurrentTime() + 10, 0) };
                break;
            case PLAYER_ACTION.SEEK_FORWARD_30:
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

    playVideo = (video) => {
        this.setState({ view: ROOM_VIEW.MAIN });
        this.props.loadVideo(video);
    };

    removeVideo = () => {
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
            case VOLUME.FULL:
                if (isMuted) player.embed.unMute();
                player.embed.setVolume(100);
                newVolume = VOLUME.FULL;
                break;
            case VOLUME.HALF:
                if (isMuted) player.embed.unMute();
                player.embed.setVolume(50);
                newVolume = VOLUME.HALF;
                break;
            case VOLUME.MUTED:
                if (!isMuted) {
                    player.embed.mute();
                    newVolume = VOLUME.MUTED;
                } else {
                    player.embed.unMute();
                    player.embed.setVolume(100);
                    newVolume = VOLUME.FULL;
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
        let { room, video, player } = this.props;
        let { view, volume, timePlayed, totalTime } = this.state;

        let inviteUrl = window.location.href + "invite/" + room.id;
        let playedTimer = this.parseTimer(Math.floor(timePlayed));
        let totalTimer = this.parseTimer(Math.floor(totalTime));

        let isDisabled = !player.embed;

        return (
            <Room
                room={room}
                video={video}
                volume={volume}
                view={view}
                switchView={this.switchView}
                handleBackPress={this.handleBackPress}
                inviteUrl={inviteUrl}
                playedTimer={playedTimer}
                totalTimer={totalTimer}
                playedtime={isDisabled ? 0 : timePlayed}
                totalTime={isDisabled ? 1 : Math.floor(player.embed.getDuration())}
                isPlaying={video.isPlaying}
                controlsDisabled={!player.embed}
                playVideo={this.playVideo}
                removeVideo={this.removeVideo}
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
