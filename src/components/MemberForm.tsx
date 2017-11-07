import * as React from "react";
import Noop from "../utils/Noop";
import Button from "./Button";
import { ErrorHandler, FormInput } from "./FormInput";
import Toast from "./Toast/Toast";

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
    error?: Error;
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
            error: props.error,
        };

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleUserTypeChange = this.handleUserTypeChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentWillReceiveProps(nextProps: any) {
        this.setState({...this.state, error: nextProps.error});
    }

    handleUserTypeChange(userType: "admin" | "viewer") {
        this.setState({...this.state, userType});
    }

    handleEmailChange(event: React.FormEvent) {
        let target = event.target as HTMLSelectElement;
        this.setState({
            email: target.value,
            userType: this.state.userType,
            error: undefined,
        });
        this.props.onChange(target.value);
    }

    async onClick() {
        this.setState({...this.state, error: undefined});
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
                {
                    this.state && this.state.error &&
                    <Toast message={this.state.error.message} type="error" />
                }
                <Button disabled={!this.state.email} style={{margin: "1% 10%"}} colored={true} ripple={true} raised={true} onClick={this.onClick}>Add Member</Button>
            </div>
        );
    }
}

export default MemberForm;
