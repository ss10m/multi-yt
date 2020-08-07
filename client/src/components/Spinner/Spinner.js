import React from "react";

import "./Spinner.scss";

export default (props) => {
    return (
        <div className="spinner">
            <svg width={props.size} height={props.size} viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30" />
            </svg>
        </div>
    );
};
