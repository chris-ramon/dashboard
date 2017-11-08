import * as React from "react";
import { connect } from "react-redux";
import { replace } from "react-router-redux";

import Source from "../../models/source";
import { State } from "../../reducers";
import IntegrationPage from "./IntegrationPage";

interface StateIntegrationProps {
    source: Source;
    goTo: (path: string) => (dispatch: Redux.Dispatch<any>) => void;
}

interface StateIntegrationState {
}

function mapStateToProps(state: State.All) {
    return {
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        goTo: function (path: string) {
            return dispatch(replace(path));
        }
    };
}

export class StateIntegrationPage extends React.Component<StateIntegrationProps, StateIntegrationState> {

    render() {
        const { source } = this.props;
        return (
            <IntegrationPage source={source} goTo={this.props.goTo} showSecret={true} />
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StateIntegrationPage);
