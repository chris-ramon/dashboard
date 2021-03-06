import * as React from "react";

import { Button } from "react-toolbox/lib/button";

import Interaction from "../../../components/Interaction";
import Conversation from "../../../models/conversation";
import DefaultConvo from "../../../utils/DefaultConvo";
import Noop from "../../../utils/Noop";

interface DropdownProps {
    conversation: Conversation;
    active: boolean;
    onClick?: () => void;
}

interface DropdownState {
}

class Dropdown extends React.Component<DropdownProps, DropdownState> {

    static defaultProps: DropdownProps = {
        conversation: DefaultConvo,
        active: false,
        onClick: Noop
    };

    constructor(props: DropdownProps) {
        super(props);

        this.state = {
            showDropdown: props.active
        };
    }

    render() {
        if (this.props.active) {
            return (<ActualComponent {...this.props} />);
        } else {
            return (<div />);
        }
    }
}

export default Dropdown;

interface ActualProps {
    conversation: Conversation;
    onClick: (conversation: Conversation) => void;
}

class ActualComponent extends React.Component<ActualProps, any> {

    constructor(props: ActualProps) {
        super(props);
    }

    render() {
        return (<div>
            <Interaction
                request={this.props.conversation.request}
                response={this.props.conversation.response}
                outputs={this.props.conversation.outputs}
                stackTraces={this.props.conversation.stackTraces} />
            <Button
                primary={true}
                ripple={true}
                onClick={this.props.onClick}>
                <i className="material-icons">keyboard_arrow_up</i>
                Collapse
            </Button>
        </div>);
    }
}