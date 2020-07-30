import React from "react";
import { connect } from "react-redux";

import { joinRoom, createRoom, refreshRooms } from "store/actions";
import { IconContext } from "react-icons";
import { FaPlay, FaPause, FaStop, FaUser, FaPlusCircle } from "react-icons/fa";

import { isEmpty } from "helpers";

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

    getIndicator = (status) => {
        console.log(status);

        if (isEmpty(status)) {
            return (
                <IconContext.Provider value={{ color: "red", size: "20px" }}>
                    <FaStop />
                </IconContext.Provider>
            );
        }
        if (status.isPlaying) {
            return (
                <IconContext.Provider value={{ color: "green", size: "20px" }}>
                    <FaPlay />
                </IconContext.Provider>
            );
        } else {
            return (
                <IconContext.Provider value={{ color: "orange", size: "20px" }}>
                    <FaPause />
                </IconContext.Provider>
            );
        }
    };

    getRooms = () => {
        let { username, socket, rooms } = this.props;

        return rooms.map((room) => (
            <tr>
                <td width="20%">
                    <div className="indicator">{this.getIndicator(room.status)}</div>
                </td>
                <td width="25%">{room.name}</td>
                <td width="15%">{room.users}</td>
                <td className="btn">
                    <button onClick={() => this.props.joinRoom(socket, room.name, username)}>JOIN</button>
                </td>
            </tr>
        ));
    };

    render() {
        let { username, socket, rooms } = this.props;
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
                <div className="body">
                    {isEmpty(rooms) ? (
                        <div className="empty">
                            <div className="icon" onClick={() => this.props.createRoom(socket, username)}>
                                <IconContext.Provider value={{ size: "100px" }}>
                                    <FaPlusCircle />
                                </IconContext.Provider>
                            </div>
                        </div>
                    ) : (
                        <table>
                            <tr style={{ height: "40px" }}>
                                <th>Status</th>
                                <th>Name</th>
                                <th>
                                    <div style={{ height: "15px" }}>
                                        <FaUser />
                                    </div>
                                </th>
                                <th></th>
                            </tr>
                            {this.getRooms()}
                        </table>
                    )}
                </div>
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
