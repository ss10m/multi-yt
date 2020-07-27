import React, { Component } from "react";

import "./UsernamePrompt.scss";

import Input from "../Input/Input";

class UsernamePrompt extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
        };
    }

    handleInput = (inputType) => {
        return (event) => {
            this.setState({
                [inputType]: event.target.value,
            });
        };
    };

    handleKeyPress = (event) => {
        if (event.key === "Enter") {
            this.confirm();
        }
    };

    confirm = () => {
        let { username } = this.state;
        if (!username.length) return;
        this.props.confirmUsername(username);
    };

    render() {
        return (
            <div className="prompt-wrapper">
                <div className="prompt">
                    <p>ENTER YOUR USERNAME</p>

                    <div className="input">
                        <Input
                            title="Username"
                            icon="user-circle"
                            value={this.state.username}
                            onChangeValue={this.handleInput("username")}
                            onKeyPress={this.handleKeyPress}
                            autoFocus={true}
                        />
                    </div>

                    <div className="btns">
                        <button onClick={this.confirm}>CONFIRM</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default UsernamePrompt;
