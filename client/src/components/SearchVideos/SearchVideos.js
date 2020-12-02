// Libraries & utils
import React from "react";
import classNames from "classnames";

// Icons
import { FiSearch } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";

// SCSS
import "./SearchVideos.scss";

export default (props) => {
    return (
        <div className="room-search">
            <div className="input-wrapper">
                <div className="icon">
                    <FiSearch />
                </div>
                <input
                    className={classNames({
                        rounded: !props.searchValue,
                    })}
                    type="text"
                    value={props.searchValue}
                    onChange={props.handleChange}
                    spellCheck={false}
                    placeholder="Search"
                    autoComplete="off"
                    autoFocus
                />
                {props.searchValue && (
                    <div className="icon right">
                        <span onClick={props.clearInput}>
                            <FaTimes />
                        </span>
                    </div>
                )}
            </div>
            <div className="search-results"></div>
        </div>
    );
};
