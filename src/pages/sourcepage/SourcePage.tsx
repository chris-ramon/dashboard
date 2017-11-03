import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { replace, RouterAction } from "react-router-redux";

import { Button } from "react-toolbox/lib/button";
import Dialog from "react-toolbox/lib/dialog";

import { deleteSource } from "../../actions/source";
import { Cell, Grid } from "../../components/Grid";
import Source from "../../models/source";
import User from "../../models/user";
import { State } from "../../reducers";

import SourceFullSummary from "./SourceFullSummary";
import SourceHeader from "./SourceHeader";

const DeleteButtonTheme = require("../../themes/button_theme.scss");
const DeleteDialogTheme = require("../../themes/dialog_theme.scss");

interface SourcePageProps {
    user: User;
    source: Source;
    goHome: () => RouterAction;
    removeSource: (source: Source) => Promise<Source>;
}

interface SourcePageState {
    deleteDialogActive: boolean;
}

function mapStateToProps(state: State.All) {
    return {
        user: state.session.user,
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        goHome: function (): RouterAction {
            return dispatch(replace("/skills"));
        },
        removeSource: function (source: Source): Promise<Source> {
            return dispatch(deleteSource(source));
        }
    };
}

export class SourcePage extends React.Component<SourcePageProps, SourcePageState> {

    dialogActions: any[];

    constructor(props: SourcePageProps) {
        super(props);
        this.handleDeleteDialogToggle = this.handleDeleteDialogToggle.bind(this);
        this.handleDeleteSkill = this.handleDeleteSkill.bind(this);

        this.dialogActions = [{
            label: "Cancel",
            onClick: this.handleDeleteDialogToggle
        }, {
            label: "Delete",
            onClick: this.handleDeleteSkill
        }];

        this.state = {
            deleteDialogActive: false,
        };
    }

    handleDeleteDialogToggle() {
        this.state.deleteDialogActive = !this.state.deleteDialogActive;
        this.setState(this.state);
    }

    handleDeleteSkill(): Promise<Source> {
        const goBack = this.props.goHome;
        const source = this.props.source;
        return this.props.removeSource(source)
            .then(function (source: Source) {
                goBack();
                return source;
            }).catch(function (e: Error) {
                console.error(e);
                return source;
            });
    }

    render() {
        const { source } = this.props;
        const sourceName = (source) ? source.name : "this skill";
        const start = moment().subtract(7, "days");
        const end = moment();
        const currentUserId = this.props && this.props.user && this.props.user.userId;
        const isOwner = currentUserId && this.props && ["admin", "owner"].indexOf(this.props.source && this.props.source.members[currentUserId]) > -1;
        if (!source) {
            return (<div />);
        }
        return (
            <span>
                <span>
                    <SourceHeader
                        isOwner={isOwner}
                        source={source} />
                </span>
                <SourceFullSummary
                    header={"Last Seven Day Summary"}
                    source={source}
                    startDate={start}
                    endDate={end} />
                <Grid>
                    <Cell>
                        <Button
                            theme={DeleteButtonTheme}
                            raised
                            primary
                            onClick={this.handleDeleteDialogToggle}
                            label="Delete Source" />
                    </Cell>
                </Grid>
                <Dialog
                    theme={DeleteDialogTheme}
                    actions={this.dialogActions}
                    active={this.state.deleteDialogActive}
                    onEscKeyDown={this.handleDeleteDialogToggle}
                    onOverlayClick={this.handleDeleteDialogToggle}
                    title="Delete Source" >
                    <p>Are you sure you want to delete {sourceName}? This action can not be undone.</p>
                </Dialog>
            </span>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SourcePage);
