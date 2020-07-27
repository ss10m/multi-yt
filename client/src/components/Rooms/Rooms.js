import React from "react";
import { connect } from "react-redux";

import { joinRoom, createRoom, refreshRooms } from "store/actions";

import "./Rooms.scss";

class Rooms extends React.Component {
    _onToggle = () => {
        let { player } = this.props;
        //console.log(player.getPlayerState());
        if (!player) return;

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
    };

    getRooms = () => {
        let { socket, rooms } = this.props;
        return rooms.map((room) => {
            return (
                <div className="room">
                    <p>{room}</p>
                    <button onClick={() => this.props.joinRoom(socket, room)}>JOIN</button>
                </div>
            );
        });
    };

    render() {
        let { socket } = this.props;
        return (
            <div className="rooms">
                <div className="header">
                    <button onClick={() => this.props.refreshRooms(socket)}>REFRESH</button>
                    <p>ROOMS</p>
                    <button onClick={() => this.props.createRoom(socket)}>CREATE</button>
                </div>
                <div className="body">{this.getRooms()}</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        socket: state.socket,
        player: state.player,
        rooms: state.rooms,
    };
};

const mapDispatchToProps = (dispatch) => ({
    joinRoom: (socket, room) => {
        dispatch(joinRoom(socket, room));
    },
    createRoom: (socket) => {
        dispatch(createRoom(socket));
    },
    refreshRooms: (socket) => {
        dispatch(refreshRooms(socket));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
