// Libraries & utils
import React from "react";
import classNames from "classnames";

// SCSS
import "./Input.scss";

// Icons
import { FaUserCircle } from "react-icons/fa";

export default (props) => {
    return (
        <div className="input">
            <div className="icon">
                <FaUserCircle />
            </div>
            <div
                className={classNames("field", {
                    active: props.value.length > 0,
                })}
            >
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
