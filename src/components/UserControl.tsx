import * as React from "react";

import User from "../models/user";
import { Icon, ICON } from "./Icon";
import { Menu, MenuItem } from "./Menu";

interface UserProps {
  user?: User;
  login: () => void;
  logout: () => void;
  team?: () => void;
}

export default class UserControl extends React.Component<UserProps, any> {
  render() {

    let callback = this.props.user ? this.props.logout : this.props.login;
    let buttonText = this.props.user ? "Logout" : "Login";

    let icon = this.props.user && this.props.user.photoUrl ? (
      <img
        style={{ borderRadius: "50%" }}
        width="32"
        height="32"
        src={this.props.user.photoUrl}
        />
    ) : (
        <Icon
          style={{width: "32", height: "32"}}
          icon={ICON.DEFAULT_AVATAR}
          />
      );
    return (
      <Menu
        className="userMenu"
        icon={icon}
        position="topRight"
        menuRipple={true}>
        {this.props.user && <MenuItem caption="Team" onClick={this.props.team}/>}
        <MenuItem
          caption={buttonText}
          onClick={callback} />
      </Menu>
    );
  }
}
