// Libraries & utils
import React from "react";

// SCSS
import "./Rooms.scss";

// Icons
import { IconContext } from "react-icons";
import {
    FaPlay,
    FaPause,
    FaStop,
    FaUser,
    FaPlusCircle,
    FaRedo,
    FaPlus,
} from "react-icons/fa";

export default (props) => {
    return (
        <div className="rooms">
            <RoomsHeader {...props} />
            <div className="rooms-body">
                <RoomList {...props} />
            </div>
        </div>
    );
};

const RoomsHeader = (props) => {
    let { refreshRooms, createRoom } = props;
    return (
        <div className="rooms-header">
            <IconContext.Provider value={{ size: "20px", className: "header-icon" }}>
                <FaRedo onClick={refreshRooms} />
            </IconContext.Provider>
            <p>ROOMS</p>
            <IconContext.Provider value={{ size: "20px", className: "header-icon" }}>
                <FaPlus onClick={createRoom} />
            </IconContext.Provider>
        </div>
    );
};

const RoomList = (props) => {
    let { rooms, isEmpty, createRoom, joinRoom } = props;

    if (isEmpty(rooms)) {
        return (
            <IconContext.Provider value={{ size: "100px", className: "icon" }}>
                <FaPlusCircle onClick={createRoom} />
            </IconContext.Provider>
        );
    } else {
        const rows = [];
        rooms.forEach((room, idx) => {
            rows.push(
                <RoomRow key={idx} room={room} joinRoom={joinRoom} isEmpty={isEmpty} />
            );
        });

        return (
            <table className="rooms-table">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Name</th>
                        <th>
                            <div style={{ height: "15px" }}>
                                <FaUser />
                            </div>
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
};

const RoomRow = ({ room, joinRoom, isEmpty }) => {
    return (
        <tr>
            <td width="20%">
                <div className="indicator">
                    <RoomIndicator status={room.status} isEmpty={isEmpty} />
                </div>
            </td>
            <td width="25%">{room.name}</td>
            <td width="15%">{room.users}</td>
            <td className="btn">
                <button onClick={() => joinRoom(room.id)}>JOIN</button>
            </td>
        </tr>
    );
};

const RoomIndicator = ({ status, isEmpty }) => {
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
