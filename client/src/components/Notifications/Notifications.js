// Libraries & utils
import React from "react";

// Components
import Notification from "./components/Notification/NotificationContainer";

// SCSS
import "./Notifications.scss";

function Notifications({ notifications, remove }) {
    return (
        <div className="notifications-wrapper">
            <div className="notifications">
                {notifications.map((notification) => (
                    <Notification
                        key={notification.id}
                        notification={notification}
                        counter={notifications.length}
                        remove={remove}
                    />
                ))}
            </div>
        </div>
    );
}

export default Notifications;
