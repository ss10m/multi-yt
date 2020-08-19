// Libraries & utils
import React, { Component } from "react";

// Components
import UsernamePrompt from "./UsernamePrompt";

class UsernamePromptContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
        };
    }

    handleInput = (event) => {
        let username = event.target.value;
        if (username.length > 12) return;
        this.setState({
            username: username,
        });
    };

    handleKeyPress = (event) => {
        if (event.key === "Enter") {
            this.confirmUsername();
        }
    };

    confirmUsername = () => {
        let { username } = this.state;
        if (!username.length) return;
        this.props.confirmUsername(username);
    };

    render() {
        return (
            <UsernamePrompt
                username={this.state.username}
                handleInput={this.handleInput}
                handleKeyPress={this.handleKeyPress}
                confirmUsername={this.confirmUsername}
            />
        );
    }
}

export default UsernamePromptContainer;
