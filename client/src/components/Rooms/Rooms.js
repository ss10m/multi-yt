import React from "react";
import { connect } from "react-redux";

import { joinRoom, createRoom, refreshRooms } from "store/actions";

import "./Rooms.scss";

class Rooms extends React.Component {
    constructor(props) {
        super(props);

        this.state = { refreshDisabled: false };
    }

    refreshRooms = () => {
        let { socket } = this.props;
        this.props.refreshRooms(socket);
        this.setState({ refreshDisabled: true });
        setTimeout(() => this.setState({ refreshDisabled: false }), 1000);
    };

    getRooms = () => {
        let { username, socket, rooms } = this.props;

        return rooms.map((room) => {
            return (
                <div className="room">
                    <p>{room}</p>
                    <button onClick={() => this.props.joinRoom(socket, room, username)}>JOIN</button>
                </div>
            );
        });
    };

    render() {
        let { username, socket } = this.props;
        let { refreshDisabled } = this.state;
        return (
            <div className="rooms">
                <div className="header">
                    <button
                        className={refreshDisabled ? "disabled" : ""}
                        onClick={this.refreshRooms}
                        disabled={refreshDisabled}
                    >
                        REFRESH
                    </button>
                    <p>ROOMS</p>
                    <button onClick={() => this.props.createRoom(socket, username)}>CREATE</button>
                </div>
                <div className="body">{this.getRooms()}</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.username,
        socket: state.socket,
        player: state.player,
        rooms: state.rooms,
    };
};

const mapDispatchToProps = (dispatch) => ({
    joinRoom: (socket, room, username) => {
        dispatch(joinRoom(socket, room, username));
    },
    createRoom: (socket, username) => {
        dispatch(createRoom(socket, username));
    },
    refreshRooms: (socket) => {
        dispatch(refreshRooms(socket));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
