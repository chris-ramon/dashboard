import * as classNames from "classnames";
// tslint:disable:no-unused-variable
// Needed only for testing.  It isn't a problem when the files are
// bundled but testing as modules the translated JS files
// assume React is global
import * as React from "react";
// tslint:enable:no-unused-variable

import MDLComponent from "../MDLComponent";

interface MenuProps {
  align: "left" | "right";
  ripple: boolean;
  target: string;
  valign: "bottom" | "top";
  className?: string;
}

/**
 *
 * For information about the Menu class, see https://getmdl.io/components/index.html#menus-section
 */
export default class Menu extends MDLComponent<MenuProps, any> {

  classes() {
    return classNames("mdl-menu mdl-js-menu", {
      [`mdl-menu--${this.props.valign}-${this.props.align}`]: true,
      "mdl-js-ripple-effect": this.props.ripple
    }, this.props.className);
  }
  render() {
    return (
      <ul className={this.classes()} htmlFor={this.props.target}>
        {this.props.children}
      </ul>
    );
  }
}