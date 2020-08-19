// Libraries & utils
import React from "react";

// Components
import Input from "components/Input/Input";

// SCSS
import "./UsernamePrompt.scss";

export default (props) => {
    let { username, handleInput, handleKeyPress, confirmUsername } = props;
    return (
        <div className="prompt-bg">
            <div className="prompt">
                <p>ENTER YOUR USERNAME</p>
                <div className="input">
                    <Input
                        title="Username"
                        icon="user-circle"
                        value={username}
                        onChangeValue={handleInput}
                        onKeyPress={handleKeyPress}
                        autoFocus={true}
                    />
                </div>
                <div className="confirm-btn">
                    <button onClick={confirmUsername}>CONFIRM</button>
                </div>
            </div>
        </div>
    );
};
