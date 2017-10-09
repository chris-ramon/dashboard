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
}

export class AddMemberPage extends React.Component<TeamPageProps, TeamPageState> {
    constructor(props: TeamPageProps) {
        super(props);

        this.state = {
            users: [],
            selected: [],
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

    async addMember(email: string, userType: string ) {
        await UserService.addTeamMember({email, userType});
        location.replace("/dashboard/team");
    }

    render() {
        return (
            <div>
                <h3 style={{margin: "1% 10%"}}>Add new member</h3>
                <MemberForm addMember={this.addMember} />
            </div>
        );
    }
}

export default connect(
)(AddMemberPage);
