import * as React from "react";
import Noop from "../utils/Noop";
import Button from "./Button";
import { ErrorHandler, FormInput } from "./FormInput";

import Dropdown from "react-toolbox/lib/dropdown";
import "../themes/main-baseline.scss";

interface DropdownValue {
    value: "admin" | "viewer";
    label: string;
}

export interface EmailRule extends ErrorHandler {
    // Passing up the ErrorHandler interface so our parents don't have to know about it.
}

interface MemberFormProps {
    email?: string;
    userType?: string;
    error?: Error;
    creatingMember?: boolean;
    onChange?: (name: string) => any;
    emailRule?: EmailRule;
    addMember: (email: string, userType: string) => any;
}

interface MemberFormState {
    email: string;
    userType: string;
}

export class MemberForm extends React.Component<MemberFormProps, MemberFormState> {

    static defaultProps = {
        email: "",
        userType: "viewer",
        error: "",
        creatingMember: "",
        onChange: Noop,
        emailRule: { regex: new RegExp(".*"), errorMessage: function(input: string): undefined { return undefined; }}
    };

    static OPTIONS: DropdownValue[] = [{value: "admin", label: "Admin"}, {value: "viewer", label: "Viewer"}];

    constructor(props: MemberFormProps) {
        super(props);
        this.state = {
            email: "",
            userType: "viewer",
        };

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleUserTypeChange = this.handleUserTypeChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    handleUserTypeChange(userType: "admin" | "viewer") {
        this.setState({...this.state, userType});
    }

    handleEmailChange(event: React.FormEvent) {
        let target = event.target as HTMLSelectElement;
        this.setState({
            email: target.value,
            userType: this.state.userType,
        });

        this.props.onChange(target.value);
    }

    async onClick() {
        await this.props.addMember(this.state.email, this.state.userType);
    }

    render() {
        return (
            <div>
                <form className="custom-form" id="newSource">
                    <FormInput
                        type={"text"}
                        value={this.state.email}
                        onChange={this.handleEmailChange}
                        label={"Email"}
                        floatingLabel={true}
                        autoComplete={"off"}
                        error={this.props.emailRule} />
                    <Dropdown
                        style={{fontSize: "1rem"}}
                        source={MemberForm.OPTIONS}
                        value={this.state.userType}
                        onChange={this.handleUserTypeChange} />
                </form>
                {this.props.error ? <p> {this.props.error.message} </p> : <div />}
                <Button style={{margin: "1% 10%"}} colored={true} ripple={true} raised={true} onClick={this.onClick}>Add Member</Button>
            </div>
        );
    }
}

export default MemberForm;
