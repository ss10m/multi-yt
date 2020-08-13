// Libraries & utils
import React from "react";

// SCSS
import "./Chat.scss";

export default React.forwardRef((props, ref) => {
    return (
        <div className="chat">
            <div className="chat-header">CHAT</div>
            <div className="chat-body">
                <Messages {...props} ref={ref} />
                <ChatInput {...props} />
            </div>
        </div>
    );
});

const Messages = React.forwardRef(({ messages }, ref) => {
    const rows = [];
    messages.forEach((message, idx) => {
        if (message.type) {
            rows.push(
                <p key={idx} style={{ color: "grey" }}>
                    {`${message.username} ${message.msg}`}
                </p>
            );
        } else {
            rows.push(
                <p key={idx}>
                    <span>{message.username}</span>
                    {`: ${message.msg}`}
                </p>
            );
        }
    });

    return (
        <div className="chat-msgs" ref={ref}>
            {rows}
        </div>
    );
});

const ChatInput = ({ room, message, isEmpty, handleInput, sendMessage }) => {
    let input;
    if (isEmpty(room)) {
        input = <p>You must first join a room</p>;
    } else {
        input = (
            <input
                type={"text"}
                value={message}
                placeholder={"Send a message"}
                onChange={handleInput}
                onKeyPress={sendMessage}
                spellCheck={false}
                autoFocus={false}
            />
        );
    }
    return <div className="chat-input">{input}</div>;
};
