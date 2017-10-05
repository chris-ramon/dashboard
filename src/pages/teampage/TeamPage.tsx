import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";

import {Button} from "react-toolbox/lib/button";
import Checkbox from "react-toolbox/lib/checkbox";

import Source from "../../models/source";
import UserService from "../../services/user";

const CheckboxTheme = require("../integration/themes/checkbox.scss");
const ButtonTheme = require("../integration/themes/button.scss");

export interface TeamPageProps {
    sources: Source[];
}

interface TeamPageState {
    selected: any[];
    users: any[];
}

export class TeamPage extends React.Component<TeamPageProps, TeamPageState> {
    constructor(props: TeamPageProps) {
        super(props);

        this.state = {
            users: [],
            selected: [],
        };
    }

    componentWillMount() {
        this.getTeam(this.props);
    }

    componentWillReceiveProps (nextProps: any) {
        this.getTeam(nextProps);
    }

    handleEnableCheckChange(currentUser: any, value: boolean) {
        const changedCheck = {...currentUser, userType: {...currentUser.userType, enableNotifications: value}};
        console.log(changedCheck);
        const users = this.state.users.map(user => {
            if (user.email === currentUser.email) return changedCheck;
            return user;
        });
        this.setState({...this.state, users});
    }

    async getTeam(props: any) {
        const team = await UserService.getTeam();
        this.setState({...this.state, users: team});
    }

    render() {
        const usersRows = this.state.users && this.state.users.map(user =>
            <tr key={user.email}>
                <td className="mdl-data-table__cell--non-numeric">
                    {user.email}
                </td>
                <td className="mdl-data-table__cell--non-numeric">
                    {user.userType.userType}
                </td>
                <td style={{textAlign: "center"}}>
                    (<Checkbox
                        style={{marginTop: 8}}
                        theme={CheckboxTheme}
                        label={""}
                        checked={user.userType.enableNotifications}
                        onChange={this.handleEnableCheckChange.bind(this, user)}/>)
                </td>
            </tr>
        );
        return (
            <div>
                <h3 style={{margin: "1% 10%"}}>Team List</h3>
                <div style={{width: "80%", margin: "1% 10%", border: "1px solid rgba(0, 0, 0, 0.12)"}}>
                    <table style={{width: "100%"}} className="mdl-data-table mdl-js-data-table">
                        <thead>
                        <tr>
                            <th className="mdl-data-table__cell--non-numeric">Email</th>
                            <th className="mdl-data-table__cell--non-numeric">User Type</th>
                            <th style={{textAlign: "center"}}>Notifications Enabled</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            usersRows
                        }
                        </tbody>
                    </table>
                </div>
                <Link to="/team/new" style={{position: "absolute", right: "11%"}}>
                    <Button theme={ButtonTheme} icon="add" accent={true} mini={true} floating={true}/>
                </Link>
            </div>
        );
    }
}

export default connect(
)(TeamPage);
