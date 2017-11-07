import * as React from "react";
import {connect} from "react-redux";

import MemberForm from "../../components/MemberForm";
import Source from "../../models/source";
import UserService from "../../services/user";

export interface TeamPageProps {
    sources: Source[];
}

interface TeamPageState {
    selected: any[];
    users: any[];
    emailReg?: RegExp;
    formError?: Error;
}

export class AddMemberPage extends React.Component<TeamPageProps, TeamPageState> {
    constructor(props: TeamPageProps) {
        super(props);

        this.state = {
            users: [],
            selected: [],
            emailReg: new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/),
        };

        this.addMember = this.addMember.bind(this);
    }

    handleEnableCheckChange(currentUser: any, value: boolean) {
        const changedCheck = {...currentUser, enableNotification: value};
        const users = this.state.users.map(user => {
            if (user.email === currentUser.email) return changedCheck;
            return user;
        });
        this.setState({...this.state, users});
    }

    addMember(email: string, userType: string ) {
        UserService.addTeamMember({email, userType}).then(() => {
            location.replace("/dashboard/team");
        }).catch(err => {
            this.setState({...this.state, formError: err});
        });
    }

    render() {
        const emailRule = () => "Please use a valid Email";
        return (
            <div>
                <h3 style={{margin: "1% 10%"}}>Add new member</h3>
                <MemberForm addMember={this.addMember} emailRule={{regex: this.state.emailReg, errorMessage: emailRule }} error={this.state.formError} />
            </div>
        );
    }
}

export default connect(
)(AddMemberPage);
