import * as React from "react";
import { Link } from "react-router";

import { ListItem } from "react-toolbox/lib/list";

import MDLComponent from "../MDLComponent";

const ListItemStyle = require("../../themes/listitem.scss");

export interface TwoLineItemProps {
    /**
     * Number that this item is in.
     */
    index: number;
    /**
     * The primary text to appear on the item.
     */
    primaryValue: string;
    /**
     * The secondary text to appear on the item.
     */
    secondaryValue: string;
    /**
     * A route to method that will use `react-router` to move to another part of the website.
     */
    routeTo?: string;
    /**
     * A hard linke href that can be used to go to another website.
     */
    linkTo?: string;
    /**
     * A callback to retrieve a selected item index.
     */
    onSelected?: (index: number) => void;
}

export interface TwoLineItemState {
}

class StaticListItem extends MDLComponent<TwoLineItemProps, TwoLineItemState> {

    constructor(props: TwoLineItemProps) {
        super(props);
    }

    click() {
        if (this.props.onSelected) {
            this.props.onSelected(this.props.index);
        }
    }

    render() {
        // Documenting for future refernce:
        // The top level element should be "</li>".
        // The "routeTo" method is intended to be used with Router to go to another URL within the app.
        // Right now, the only way to do that is with "Link", but wrapping the "ListItem" in a "Link" will make
        // the outside item a </a>.  Ideally, we may have to write our own ListItem that supports this. Or wait until React-toolbox
        // adds support for this.
        // https://github.com/react-toolbox/react-toolbox/issues/1059

        const listItem = (
            <ListItem
                theme={ListItemStyle}
                caption={this.props.primaryValue}
                legend={this.props.secondaryValue}
                to={this.props.linkTo}
                onClick={this.click.bind(this)} />
        );

        let fullItem: JSX.Element;
        if (this.props.routeTo) {
            fullItem = (
                <div className={ListItemStyle.listItem}>
                    <Link to={this.props.routeTo}>
                        {listItem}
                    </Link>
                </div>
            );
        } else {
            fullItem = listItem;
        }
        return fullItem;
    }
}

export default StaticListItem;
