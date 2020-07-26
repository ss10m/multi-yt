import React from "react";
import { connect } from "react-redux";

import "./Room.scss";

class Room extends React.Component {
    render() {
        return (
            <div className="room-info">
                <div className="header">
                    <button onClick={() => console.log("leave")}>LEAVE</button>
                    <p>ROOM #2</p>
                </div>
                <div className="body">room data</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        player: state.player,
    };
};

export default connect(mapStateToProps)(Room);
