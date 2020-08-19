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
    let { width, height, isRoomEmpty, showUsernamePrompt, confirmUsername, error } = props;
    if (error) return <div className="error">{error}</div>;
    return (
        <>
            {showUsernamePrompt && <UsernamePrompt confirmUsername={confirmUsername} />}
            <div className="main">
                <Player width={width} height={height} />
                <div className="options">{isRoomEmpty ? <Rooms /> : <Room />}</div>
                <Chat />
            </div>
        </>
    );
};
