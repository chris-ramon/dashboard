import * as classNames from "classnames";
import * as React from "react";

import "./Toast-theme.scss";

interface ToastProps {
    message?: string;
    type?: "error" | "info" | "warning" | "success";
    style?: React.CSSProperties;
    className?: string;
}

interface ToastState {
}

export class Toast extends React.Component<ToastProps, ToastState> {
    static defaultProps = {
        message: "",
        type: "error",
    };

    constructor(props: any) {
        super(props);
        console.log(props);
    }

    classes() {
        return classNames("custom-toast", {
            [`${this.props.type}`]: !!this.props.type,
        });
    }

    render() {
        console.log(this.props.type);
        return (
            <div style={this.props.style} className={this.classes()}>
                {this.props.message}
            </div>
        );
    }
}

export default Toast;
