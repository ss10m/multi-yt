import React from "react";
import { FaUserCircle } from "react-icons/fa";

import "./Input.scss";

export default (props) => {
    const activeClass = props.value.length > 0 ? " active" : "";
    return (
        <div className="input">
            <div className="icon">
                <FaUserCircle />
            </div>
            <div className={"field" + activeClass}>
                <label>
                    <input
                        type={"text"}
                        value={props.value}
                        onChange={(e) => props.onChangeValue(e)}
                        onKeyPress={props.onKeyPress}
                        spellCheck={false}
                        autoFocus={props.autoFocus}
                    />
                    <span className="title">{props.title}</span>
                </label>
            </div>
        </div>
    );
};
