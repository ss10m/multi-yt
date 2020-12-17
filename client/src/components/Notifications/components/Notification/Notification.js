// Libraries & utils
import React from "react";

import { FaClipboardCheck } from "react-icons/fa";

// SCSS
import "./Notification.scss";

const Notification = React.forwardRef((props, ref) => {
    const { notification } = props;
    return (
        <div
            ref={ref.notificationRef}
            style={props.outerStyle}
            key={notification.id}
            onClick={props.removeNotification}
            onTransitionEnd={props.onTransitionEnd}
            onAnimationEnd={props.onAnimationEnd}
        >
            <div
                className={props.innerClass}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
            >
                <div className="body">
                    <div className="clipboard">
                        <FaClipboardCheck />
                    </div>

                    <div className="message">{notification.message}</div>
                </div>
                <div className="indicator">
                    <div style={props.indicatorStyle} ref={ref.indicatorRef} />
                </div>
            </div>
        </div>
    );
});

export default Notification;
