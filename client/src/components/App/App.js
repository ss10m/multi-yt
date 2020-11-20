// Libraries & utils
import React from "react";

// Components
import Player from "components/Player/PlayerContainer";
import Chat from "components/Chat/ChatContainer";
import Room from "components/Room/RoomContainer";
import Rooms from "components/Rooms/RoomsContainer";
import UsernamePrompt from "components/UsernamePrompt/UsernamePromptContainer";

// SCSS
import "./App.scss";

export default (props) => {
    let { width, height, showLobby, showUsernamePrompt, confirmUsername, error } = props;

    if (error) return <div className="error">{error}</div>;

    if (showLobby) {
        return (
            <>
                {showUsernamePrompt && <UsernamePrompt confirmUsername={confirmUsername} />}
                <Rooms />
            </>
        );
    }

    return (
        <div className="layout">
            <Player width={width} height={height} />
            <Room />
            <Chat />
        </div>
    );
};
