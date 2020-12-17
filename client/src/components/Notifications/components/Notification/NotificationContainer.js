// Libraries & utils
import React from "react";
import Timer from "helpers/timer";

// Componenets
import Notification from "./Notification";

class NotificationContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            outerStyle: {
                height: "0px",
                overflow: "hidden",
            },
            innerClassList: [],
            indicatorStyle: {
                width: "100%",
            },
            onAnimationEnd: null,
            onTransitionEnd: null,
        };

        this.notificationRef = React.createRef();
        this.indicatorRef = React.createRef();
    }

    componentDidMount() {
        let { notification, counter } = this.props;
        const { scrollHeight } = this.notificationRef.current;

        const onTransitionEnd = () => {
            const callback = () => this.removeNotification();
            this.timer = new Timer(callback, notification.duration);
        };

        const callback = () => {
            requestAnimationFrame(() => {
                this.setState((prevState) => ({
                    innerClassList: [
                        "animate__animated",
                        "animate__fadeIn",
                        ...prevState.innerClassList,
                    ],
                }));
            });
        };

        this.setState(
            {
                outerStyle: {
                    height: `${scrollHeight}px`,
                    transition: counter > 1 ? "300ms height linear 0ms" : "10ms height",
                },
                onTransitionEnd,
                indicatorStyle: {
                    width: "0px",
                    transition: `${notification.duration}ms width linear 0ms`,
                },
            },
            callback
        );
    }

    componentWillUnmount() {
        if (this.timer) {
            this.timer.clear();
        }
    }

    removeNotification = () => {
        let { notification, remove } = this.props;

        const outerStyle = {
            height: `0px`,
            transition: "300ms height linear 0ms",
        };

        const innerClassList = ["animate__animated", "animate__faster", "animate__fadeOut"];

        this.setState({
            outerStyle,
            innerClassList,
            onTransitionEnd: null,
            onAnimationEnd: () => {
                remove(notification.id);
            },
        });
    };

    onMouseEnter = () => {
        if (this.timer) {
            this.timer.pause();
            let outerWidth = this.notificationRef.current.clientWidth;
            let innerWidth = this.indicatorRef.current.clientWidth;
            let widthRatio = (innerWidth / outerWidth) * 100;
            this.setState({
                indicatorStyle: {
                    width: `${widthRatio}%`,
                },
            });
        }
    };

    onMouseLeave = () => {
        if (this.timer) {
            this.setState({
                indicatorStyle: {
                    width: "0px",
                    transition: `${this.timer.remaining}ms width linear 0ms`,
                },
            });
            this.timer.resume();
        }
    };

    render() {
        let { notification } = this.props;

        let innerClass = `${[...this.state.innerClassList, "notification"].join(" ")}`;

        const ref = {
            notificationRef: this.notificationRef,
            indicatorRef: this.indicatorRef,
        };

        return (
            <Notification
                {...this.state}
                ref={ref}
                notification={notification}
                innerClass={innerClass}
                removeNotification={this.removeNotification}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            />
        );
    }
}

export default NotificationContainer;
