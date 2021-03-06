import * as classNames from "classnames";
import * as React from "react";

export default class Navigation extends React.Component<any, any> {

  classes() {
    return classNames(this.props.classNames, "mdl-navigation");
  }

  render() {
    return (
      <nav className={this.classes()}>
        {this.props.children}
      </nav>
    );
  }
}
