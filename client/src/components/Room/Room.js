import React from "react";
import { connect } from "react-redux";

import { leaveRoom } from "store/actions";

import "./Room.scss";

class Room extends React.Component {
    render() {
        let { socket, room } = this.props;
        return (
            <div className="room-info">
                <div className="header">
                    <button onClick={() => this.props.leaveRoom(socket)}>LEAVE</button>
                    <p>{room.name}</p>
                </div>
                <div className="body">room data</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        socket: state.socket,
        player: state.player,
        room: state.room,
    };
};

const mapDispatchToProps = (dispatch) => ({
    leaveRoom: (socket) => {
        dispatch(leaveRoom(socket));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
