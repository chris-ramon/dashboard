import * as React from "react";

import { IconButton } from "react-toolbox/lib/button";
import Tooltip from "react-toolbox/lib/tooltip";

const IconTheme = require("./echo-theme.scss");

const TooltipButton = Tooltip(IconButton);

interface AmazonEchoProps {
    theme?: string;
    style?: React.CSSProperties;
    tooltip?: string;
    width?: string;
    height?: string;
    color?: string;
    onClick?: () => void;
}

export default class AmazonEcho extends React.Component<AmazonEchoProps, any> {

    static defaultProps: AmazonEchoProps = {
        theme: IconTheme,
        width: "21px",
        height: "46px",
        color: "#FFFFFF"
    };

    render() {
        let { style, theme, onClick, tooltip, ...iconProps } = this.props;
        return (
            <TooltipButton
                style={style}
                theme={theme}
                onClick={onClick}
                tooltip={tooltip}
                icon={<Icon
                    {...iconProps} />} />
        );
    }
}

export class Icon extends React.Component<AmazonEchoProps, any> {

    // tslint:disable
    render() {
        return (
            <svg {...this.props} viewBox="0 0 43 97" preserveAspectRatio="xMinYMin" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="Page-1" stroke="none" strokeWidth="3" fill="none" fillRule="evenodd">
                    <g id="simple_alexa" fillRule="nonzero">
                        <g id="noun_646078">
                            <g id="Group">
                                <path d="M21.3,0.3 C19.1,0.3 0.3,0.5 0.3,7.9 L0.3,88.5 C0.3,95.9 19.2,96.1 21.3,96.1 C23.4,96.1 42.3,95.9 42.3,88.5 L42.3,7.8 C42.3,0.5 23.4,0.3 21.3,0.3 Z" id="Background" fill={this.props.color}></path>
                                <path d="M11,9.7 C13.4,9.7 16.1,9.1 16.1,7.9 C16.1,6.7 13.4,6 11,6 C8.6,6 5.9,6.6 5.9,7.8 C5.9,9 8.6,9.7 11,9.7 Z M11,6.9 C13.7,6.9 15.1,7.6 15.1,7.8 C15,8.1 13.6,8.7 11,8.7 C8.3,8.7 6.9,8 6.9,7.8 C6.9,7.6 8.3,6.9 11,6.9 Z" id="Shape" fill="#000000"></path>
                                <path d="M31.2,9.7 C33.6,9.7 36.3,9.1 36.3,7.9 C36.3,6.7 33.6,6 31.2,6 C28.8,6 26.1,6.6 26.1,7.8 C26.1,9 28.8,9.7 31.2,9.7 Z M31.2,6.9 C33.9,6.9 35.3,7.6 35.3,7.8 C35.2,8.1 33.8,8.7 31.2,8.7 C28.5,8.7 27.1,8 27,7.8 C27.1,7.6 28.5,6.9 31.2,6.9 Z" id="Shape" fill="#000000"></path>
                                <path d="M21.3,0.3 C19.1,0.3 0.3,0.5 0.3,7.9 L0.3,88.5 C0.3,95.9 19.2,96.1 21.3,96.1 C23.4,96.1 42.3,95.9 42.3,88.5 L42.3,7.8 C42.3,0.5 23.4,0.3 21.3,0.3 Z M21.5,3.1 C32.2,3.1 39.6,5.6 39.6,7.8 C39.6,10 32.1,12.5 21.5,12.5 C10.9,12.5 3.4,10 3.4,7.8 C3.4,5.6 10.8,3.1 21.5,3.1 Z M3.3,9.6 C5.9,12.1 13.8,13.4 21.4,13.4 C29,13.4 36.9,12.1 39.5,9.6 L39.5,10.7 C35.7,13.3 29.9,14.5 21.4,14.5 C11.8,14.5 5.7,12.6 3.3,10.9 L3.3,9.6 Z M3.3,42.6 C5.9,45.1 13.8,46.4 21.4,46.4 C29,46.4 36.9,45.1 39.5,42.6 L39.5,43.7 C35.7,46.3 29.9,47.5 21.4,47.5 C11.8,47.5 5.7,45.6 3.3,43.9 L3.3,42.6 Z M3.3,79.6 C5.9,82.1 13.8,83.4 21.4,83.4 C29,83.4 36.9,82.1 39.5,79.6 L39.5,80.7 C35.7,83.3 29.9,84.5 21.4,84.5 C11.8,84.5 5.7,82.6 3.3,80.9 L3.3,79.6 Z M3.3,12 C6.2,13.7 12.2,15.4 21.4,15.4 C29.8,15.4 35.6,14.2 39.5,11.8 L39.5,17.1 C39.5,19.3 32,21.8 21.4,21.8 C10.8,21.8 3.3,19.3 3.3,17.1 L3.3,12 Z M3.3,18.8 C5.9,21.3 13.8,22.6 21.4,22.6 C29,22.6 36.9,21.3 39.5,18.8 L39.5,88.4 C39.5,90.6 32,93 21.4,93 C10.8,93 3.3,90.6 3.3,88.4 L3.3,18.8 Z" id="Shape" fill="#000000"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        )
    }
}
// tslint:enable