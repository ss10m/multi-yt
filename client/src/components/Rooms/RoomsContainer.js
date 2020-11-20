// Libraries
import React from "react";
import { connect } from "react-redux";

// Components
import Rooms from "./Rooms";

// Redux Actions
import { joinRoom, createRoom, refreshRooms } from "store/actions";

// Helpers
import { isEmpty } from "helpers";

class RoomsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { refreshDisabled: false };
    }

    refreshRooms = () => {
        if (this.state.refreshDisabled) return;
        this.props.refreshRooms();
        this.setState({ refreshDisabled: true });
        setTimeout(() => this.setState({ refreshDisabled: false }), 800);
    };

    createRoom = () => {
        this.props.createRoom();
    };

    joinRoom = (room) => {
        this.props.joinRoom(room);
    };

    render() {
        let { rooms } = this.props;

        return (
            <Rooms
                rooms={rooms}
                refreshRooms={this.refreshRooms}
                createRoom={this.createRoom}
                joinRoom={this.joinRoom}
                isEmpty={isEmpty}
                refreshDisabled={this.state.refreshDisabled}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        rooms: state.rooms,
    };
};

const mapDispatchToProps = (dispatch) => ({
    createRoom: () => {
        dispatch(createRoom());
    },
    joinRoom: (room) => {
        dispatch(joinRoom(room));
    },
    refreshRooms: () => {
        dispatch(refreshRooms());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomsContainer);
