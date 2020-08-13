// Libraries & utils
import React from "react";

// Redux
import { connect } from "react-redux";
import { sendMessage } from "store/actions";

// Components
import Chat from "./Chat";

// Helpers
import { isEmpty } from "helpers";

class ChatContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: "",
        };

        this.messages = React.createRef();
    }

    componentDidMount() {
        this.messages.current.scrollTop = this.messages.current.scrollHeight;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.messages !== this.props.messages) {
            this.messages.current.scrollTop = this.messages.current.scrollHeight;
        }
    }

    handleInput = (event) => {
        this.setState({ message: event.target.value });
    };

    sendMessage = (event) => {
        let { message } = this.state;
        if (event.key === "Enter" && message.length) {
            this.props.sendMessage(message);
            this.setState({ message: "" });
        }
    };

    render() {
        let { message } = this.state;
        let { room, messages } = this.props;
        return (
            <Chat
                ref={this.messages}
                message={message}
                room={room}
                messages={messages}
                sendMessage={this.sendMessage}
                handleInput={this.handleInput}
                isEmpty={isEmpty}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        room: state.room,
        messages: state.messages,
    };
};

const mapDispatchToProps = (dispatch) => ({
    sendMessage: (message) => {
        dispatch(sendMessage(message));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);
