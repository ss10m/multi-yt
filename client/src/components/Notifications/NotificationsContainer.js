// Libraries & utils
import React from "react";

// Redux
import { connect } from "react-redux";
import { removeNotification } from "store/actions";

// Components
import Notifications from "./Notifications";

class NotificationsContainer extends React.Component {
    remove = (id) => {
        this.props.removeNotification(id);
    };

    render() {
        const { notifications } = this.props;
        return <Notifications notifications={notifications} remove={this.remove} />;
    }
}

const mapStateToProps = (state) => {
    return {
        notifications: state.notifications,
    };
};

const mapDispatchToProps = (dispatch) => ({
    removeNotification: (id) => {
        dispatch(removeNotification(id));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsContainer);
