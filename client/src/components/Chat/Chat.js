import React from "react";
import { connect } from "react-redux";

import { sendMessage } from "store/actions";

import "./Chat.scss";

class Chat extends React.Component {
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

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            this.messages.current.scrollTop = this.messages.current.scrollHeight;
        }
    }

    handleInput = (event) => {
        this.setState({ message: event.target.value });
    };

    sendMessage = (event) => {
        let { socket, username } = this.props;
        let { message } = this.state;
        if (event.key === "Enter" && message.length) {
            this.props.sendMessage(socket, username, message);
            this.setState({ message: "" });
        }
    };

    render() {
        let { message } = this.state;

        let { room, messages } = this.props;

        return (
            <div className="box chat">
                <div className="header">CHAT</div>
                <div className="body">
                    <div className="msgs" ref={this.messages}>
                        {messages.map((message, idx) => (
                            <p key={idx}>
                                <span>{message.username}</span>
                                {`: ${message.msg}`}
                            </p>
                        ))}
                    </div>
                    <div className="input">
                        {room ? (
                            <input
                                type={"text"}
                                value={message}
                                placeholder={"Send a message"}
                                onChange={this.handleInput}
                                onKeyPress={this.sendMessage}
                                spellCheck={false}
                                autoFocus={false}
                            />
                        ) : (
                            <p>You must first join a room</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        socket: state.socket,
        room: state.room,
        username: state.username,
        messages: state.messages,
    };
};

const mapDispatchToProps = (dispatch) => ({
    sendMessage: (socket, username, message) => {
        dispatch(sendMessage(socket, username, message));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
